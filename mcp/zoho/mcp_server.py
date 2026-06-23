# Zoho Desk MCP server (kb-local copy)
#
# Origin: scrum-master-slave/tools/zoho/mcp_server.py
# This is a kb-only fork so that customer-identity masking can be added without
# diverging the shared upstream tool. Port upstream fixes manually if needed.
#
# Changes vs. upstream:
#   - access_token.txt + .env are anchored to this file's directory (cwd-independent).
#   - Token refresh is lazy (no network call at import time) so the server starts
#     cleanly and fastmcp can introspect it even before credentials are exercised.
#   - Every ticket-reading tool routes its result through _mask_identity() — the
#     seam where customer-identity masking belongs. As of AKB-46 this covers ALL
#     the ways to pull a ticket, not just the single-thread endpoint:
#       * get_zoho_convo(ticket_id, thread_id)        — one conversation thread
#       * get_zoho_ticket(ticket_id)                  — ticket detail
#       * get_zoho_ticket_conversations(ticket_id)    — full thread list
#       * list_zoho_tickets(limit, from_, status)     — ticket list ({"data":[...]})

import os
import re
import json
from pathlib import Path

import requests
from fastmcp import FastMCP
from fastmcp.server.auth.providers.jwt import StaticTokenVerifier
from dotenv import load_dotenv

HERE = Path(__file__).parent

# Credentials may live in the kb repo-root .env (the repo's established secret
# store, per CLAUDE.md) or in a local mcp/zoho/.env. Load in increasing priority
# (later wins): repo-root, then local, then an explicit ZOHO_ENV_FILE override.
for _env in (HERE.parent.parent / '.env', HERE / '.env', os.getenv('ZOHO_ENV_FILE')):
    if _env and Path(_env).is_file():
        load_dotenv(_env, override=True)

CLIENT_ID = os.getenv("ZOHO_CLIENT_ID")
CLIENT_SECRET = os.getenv("ZOHO_CLIENT_SECRET")
# Optional: only set for the older refresh_token grant. Absent -> client_credentials.
REFRESH_TOKEN = os.getenv("ZOHO_REFRESH_TOKEN")
# Zoho Desk organization id — required by the client_credentials (Self Client) grant,
# which scopes the token via soid=ZohoDesk.<orgId>. Not a secret.
ORG_ID = os.getenv("ZOHO_ORG_ID")
# Datacenter-specific endpoints (override for .eu/.in/.com.au/.jp accounts).
ACCOUNTS_URL = os.getenv("ZOHO_ACCOUNTS_URL", "https://accounts.zoho.com").rstrip("/")
API_BASE = os.getenv("ZOHO_API_BASE", "https://desk.zoho.com").rstrip("/")
SCOPE = os.getenv("ZOHO_SCOPE", "Desk.tickets.READ")

# Optional bearer auth for the MCP transport itself.
auth_token_str = os.getenv("AUTH_TOKEN")

if auth_token_str:
    try:
        tokens = json.loads(auth_token_str)
        verifier = StaticTokenVerifier(tokens=tokens, required_scopes=["read:data"])
        mcp = FastMCP("Zoho tools", auth=verifier)
        print("Authentication enabled with environment tokens")
    except json.JSONDecodeError:
        raise ValueError("Invalid AUTH_TOKEN format in environment")
else:
    # Fallback to no authentication for development / local fleet use.
    print("No AUTH_TOKEN found, running without authentication")
    mcp = FastMCP("Zoho tools")


TOKEN_PATH = HERE / 'access_token.txt'


def fetch_access_token():
    """Mint a Zoho access token.

    Grant is chosen by which credentials are present:
      - ZOHO_REFRESH_TOKEN set -> refresh_token grant (legacy)
      - otherwise              -> client_credentials grant (Self Client),
                                  which needs ZOHO_ORG_ID for soid scoping.
    """
    url = f"{ACCOUNTS_URL}/oauth/v2/token"
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'scope': SCOPE,
    }
    if REFRESH_TOKEN:
        params.update({
            'grant_type': 'refresh_token',
            'refresh_token': REFRESH_TOKEN,
            'redirect_uri': 'https://www.ahaslides.com',
        })
    else:
        params['grant_type'] = 'client_credentials'
        if ORG_ID:
            params['soid'] = f'ZohoDesk.{ORG_ID}'
    resp = requests.post(url, params=params)
    data = resp.json()
    token = data.get('access_token')
    if not token:
        raise RuntimeError(f"Zoho token request failed: {data}")
    return token


def refresh_access_token():
    with open(TOKEN_PATH, 'w') as f:
        f.write(fetch_access_token())


def get_access_token():
    # Lazily mint a token on first use (and whenever the cache is empty).
    if not TOKEN_PATH.exists() or TOKEN_PATH.stat().st_size == 0:
        refresh_access_token()
    with open(TOKEN_PATH, 'r') as f:
        return f.read()


# --- Customer-identity masking -------------------------------------------------
# Redact end-user PII from Zoho Desk payloads before handing them to the model.
# Set ZOHO_MASK=0 in the environment to bypass (debugging only).

_MASKING_ENABLED = os.getenv("ZOHO_MASK", "1") != "0"

REDACT_NAME = "[redacted-name]"
REDACT_EMAIL = "[redacted-email]"
REDACT_PHONE = "[redacted-phone]"
REDACT_URL = "[redacted]"

# Match email addresses anywhere in a string.
_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
# Conservative phone matcher: a run of 7+ digits with phone-like separators,
# optionally international. Only applied to free-text / phone fields to avoid
# clobbering numeric IDs and timestamps.
_PHONE_RE = re.compile(r"(?<![\w.])(\+?\d[\d\s().\-]{6,}\d)(?![\w.])")
# A display name immediately attached to an email, as in `"Sascha Bäcker" <a@b.de>`
# or `Sascha Bäcker <a@b.de>`. Used to HARVEST the customer's name out of free
# text (forwarded/quoted bodies, `From:` headers) so it can be scrubbed even when
# the thread carries no structured customer person object (e.g. outbound/forwarded
# threads whose only person object is the agent). The captured name must not look
# like an email itself (no `@`).
_NAME_BEFORE_EMAIL_RE = re.compile(
    r'(?:"([^"\r\n@]{2,60})"|([^\s"<>@][^"<>@\r\n]{1,58}?))'
    r'\s*[<(]\s*[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}'
)

# Keys whose value is an email address -> fully redacted.
_EMAIL_KEYS = {
    "fromemailaddress", "toemailaddress", "email", "emailid", "mailid",
    "to", "cc", "bcc", "replyto", "fromaddress", "toaddress",
    "fromemail", "toemail", "sender",
}
# Keys whose value is a person's display name -> redacted (unless agent).
_NAME_KEYS = {
    "name", "fromname", "authorname", "fullname", "displayname",
    "firstname", "lastname", "sendername", "contactname",
}
# Keys whose value is an avatar / profile image URL.
_URL_KEYS = {"photourl", "avatar", "avatarurl", "profileimageurl"}
# Keys whose value is a phone number.
_PHONE_KEYS = {"phone", "mobile", "phonenumber", "mobilenumber", "tel"}
# Free-text fields that may embed PII (names/emails/phones in signatures).
_TEXT_KEYS = {"content", "plaintext", "summary", "snippet", "subject", "description"}

# Markers that identify a dict as a "person" object (so plain `name` keys like
# attachment filenames or department names are left untouched elsewhere).
_PERSON_MARKERS = {"email", "emailid", "type", "authortype", "photourl", "phone", "mobile"}
# Keys whose value is itself a person object.
_PERSON_PARENT_KEYS = {"author", "from", "contact", "responder", "sender", "commenter", "owner"}
# author/type values that mean the message came from a staff agent (name kept).
_AGENT_TYPES = {"agent"}


def _collect_person_names(node, names, want_agent, in_person=False):
    """Gather display names of person objects, filtered by staff/customer.

    `want_agent=False` collects customer (end-user) names; `want_agent=True`
    collects staff/agent names (so they can be excluded from the redaction set).
    """
    if isinstance(node, dict):
        is_person = in_person or any(k.lower() in _PERSON_MARKERS for k in node)
        is_agent = str(node.get("type", node.get("authorType", ""))).lower() in _AGENT_TYPES
        if is_person and is_agent == want_agent:
            for key, value in node.items():
                if key.lower() in _NAME_KEYS and isinstance(value, str) and value.strip():
                    names.add(value.strip())
        for key, value in node.items():
            _collect_person_names(value, names, want_agent,
                                  in_person=(key.lower() in _PERSON_PARENT_KEYS))
    elif isinstance(node, list):
        for item in node:
            _collect_person_names(item, names, want_agent, in_person=in_person)
    return names


def _harvest_text_names(node, exclude_tokens):
    """Pull customer display names out of free text by matching names attached to
    an email address (`"Name" <addr>` / `Name <addr>`), scanning every string in
    the payload. Candidates whose every token is a known agent token are dropped
    so staff names (e.g. "AhaSlides Team" in an outbound `From:`) are not redacted.
    """
    found = set()
    if isinstance(node, dict):
        for value in node.values():
            found |= _harvest_text_names(value, exclude_tokens)
    elif isinstance(node, list):
        for item in node:
            found |= _harvest_text_names(item, exclude_tokens)
    elif isinstance(node, str):
        for quoted, bare in _NAME_BEFORE_EMAIL_RE.findall(node):
            cand = (quoted or bare).strip().strip(".,;:'\"()<>")
            if len(cand) < 2 or "@" in cand:
                continue
            toks = [t for t in re.split(r"\s+", cand) if len(t) >= 3]
            if toks and all(t.lower() in exclude_tokens for t in toks):
                continue
            found.add(cand)
    return found


def _expand_names(names):
    """Expand full names into their individual tokens (first/last) so a name
    leaks neither whole nor in part. Tokens shorter than 3 chars are dropped to
    avoid redacting initials and common short words."""
    expanded = set()
    for n in names:
        n = (n or "").strip()
        if len(n) >= 3:
            expanded.add(n)
        for tok in re.split(r"\s+", n):
            tok = tok.strip(".,;:'\"()")
            if len(tok) >= 3:
                expanded.add(tok)
    return expanded


def _scrub_text(text, names=()):
    if not isinstance(text, str):
        return text
    text = _EMAIL_RE.sub(REDACT_EMAIL, text)
    text = _PHONE_RE.sub(REDACT_PHONE, text)
    # Redact known customer names in signatures / body prose. Longest first so a
    # full name is replaced before its component tokens.
    for name in sorted(names, key=len, reverse=True):
        text = re.sub(r"\b" + re.escape(name) + r"\b", REDACT_NAME, text, flags=re.IGNORECASE)
    return text


def _mask_node(node, names=(), in_person=False):
    if isinstance(node, dict):
        is_person = in_person or any(k.lower() in _PERSON_MARKERS for k in node)
        is_agent = str(node.get("type", node.get("authorType", ""))).lower() in _AGENT_TYPES
        out = {}
        for key, value in node.items():
            k = key.lower()
            # Never rewrite an empty/blank value — redacting "" to a placeholder
            # invents PII that was not there (e.g. an empty `cc`/`bcc`).
            blank = isinstance(value, str) and not value.strip()
            if blank:
                out[key] = value
            elif k in _URL_KEYS and isinstance(value, str):
                out[key] = REDACT_URL
            elif k in _PHONE_KEYS and isinstance(value, str):
                out[key] = REDACT_PHONE
            elif k in _NAME_KEYS and isinstance(value, str):
                # Only a person's name is identity; keep agent names and
                # non-person `name` fields (filenames, channel names, ...).
                out[key] = value if (is_agent or not is_person) else REDACT_NAME
            elif k in _EMAIL_KEYS and isinstance(value, str):
                out[key] = REDACT_EMAIL
            elif k in _TEXT_KEYS and isinstance(value, str):
                out[key] = _scrub_text(value, names)
            elif isinstance(value, (dict, list)):
                out[key] = _mask_node(value, names, in_person=(k in _PERSON_PARENT_KEYS))
            elif isinstance(value, str):
                # Catch stray emails embedded anywhere else.
                out[key] = _EMAIL_RE.sub(REDACT_EMAIL, value)
            else:
                out[key] = value
        return out
    if isinstance(node, list):
        return [_mask_node(item, names, in_person=in_person) for item in node]
    if isinstance(node, str):
        return _EMAIL_RE.sub(REDACT_EMAIL, node)
    return node


def _mask_identity(data):
    """Redact customer-identifying information from a Zoho Desk payload.

    Masks end-user names, all email addresses, phone numbers and avatar URLs,
    and scrubs emails/phones embedded in free-text bodies. Customer names are
    gathered both from structured person objects AND harvested from free text
    (e.g. a forwarded `From: "Name" <addr>` line), so the contact's identity is
    scrubbed even on outbound/forwarded threads that carry no customer person
    object. Agent display names (author/type == AGENT) and non-person `name`
    fields (e.g. attachment filenames) are preserved. Disable with ZOHO_MASK=0.
    """
    if not _MASKING_ENABLED:
        return data
    agent_tokens = {t.lower() for t in _expand_names(_collect_person_names(data, set(), True))}
    customer_names = _collect_person_names(data, set(), False)
    customer_names |= _harvest_text_names(data, agent_tokens)
    names = {n for n in _expand_names(customer_names) if n.lower() not in agent_tokens}
    return _mask_node(data, names)


def _zoho_headers():
    headers = {
        'Authorization': f'Zoho-oauthtoken {get_access_token()}'
    }
    if ORG_ID:
        headers['orgId'] = str(ORG_ID)
    return headers


def _is_oauth_error(data):
    """True when a Zoho payload signals an expired/invalid token, so the caller
    can refresh once and retry. `data` may be a dict or, defensively, anything."""
    return isinstance(data, dict) and data.get('errorCode') in ('INVALID_OAUTH', 'UNAUTHORIZED')


def fetch_zoho_convo(ticket_id: str, thread_id: str):
    url = f'{API_BASE}/api/v1/tickets/{ticket_id}/threads/{thread_id}'
    return requests.get(url, headers=_zoho_headers()).json()


@mcp.tool()
def get_zoho_convo(ticket_id: str, thread_id: str):
    data = fetch_zoho_convo(ticket_id, thread_id)
    if _is_oauth_error(data):
        refresh_access_token()
        data = fetch_zoho_convo(ticket_id, thread_id)
    return str(_mask_identity(data))


def fetch_zoho_ticket(ticket_id: str):
    url = f'{API_BASE}/api/v1/tickets/{ticket_id}'
    return requests.get(url, headers=_zoho_headers()).json()


@mcp.tool()
def get_zoho_ticket(ticket_id: str):
    """Fetch a single Zoho Desk ticket's detail, customer identity masked."""
    data = fetch_zoho_ticket(ticket_id)
    if _is_oauth_error(data):
        refresh_access_token()
        data = fetch_zoho_ticket(ticket_id)
    return str(_mask_identity(data))


def fetch_zoho_ticket_conversations(ticket_id: str):
    url = f'{API_BASE}/api/v1/tickets/{ticket_id}/conversations'
    return requests.get(url, headers=_zoho_headers()).json()


@mcp.tool()
def get_zoho_ticket_conversations(ticket_id: str):
    """Fetch the full conversation/thread list of a Zoho Desk ticket, customer
    identity masked across every entry."""
    data = fetch_zoho_ticket_conversations(ticket_id)
    if _is_oauth_error(data):
        refresh_access_token()
        data = fetch_zoho_ticket_conversations(ticket_id)
    return str(_mask_identity(data))


def fetch_zoho_tickets(limit=None, from_=None, status=None):
    url = f'{API_BASE}/api/v1/tickets'
    params = {}
    if limit is not None:
        params['limit'] = limit
    if from_ is not None:
        params['from'] = from_
    if status is not None:
        params['status'] = status
    return requests.get(url, headers=_zoho_headers(), params=params).json()


@mcp.tool()
def list_zoho_tickets(limit: int = None, from_: int = None, status: str = None):
    """List Zoho Desk tickets (envelope `{"data": [ ... ]}`), with every ticket's
    customer identity masked. Supports `limit`, `from_` (offset) and `status`."""
    data = fetch_zoho_tickets(limit=limit, from_=from_, status=status)
    if _is_oauth_error(data):
        refresh_access_token()
        data = fetch_zoho_tickets(limit=limit, from_=from_, status=status)
    return str(_mask_identity(data))
