"""Offline checks for the customer-identity masking in mcp_server._mask_identity.

Run from anywhere with uv (no network — masking is pure):

    uv run --python 3.11 --with fastmcp --with requests --with python-dotenv \
      python mcp/zoho/test_masking.py

Exits non-zero on the first failed assertion.
"""

import json

import mcp_server as m

CUSTOMER_EMAIL = "sascha.baecker@stadt.wuerzburg.de"
CUSTOMER_NAME = "Sascha Bäcker"
AGENT_EMAIL = "hi@ahaslides.com"
AGENT_NAME = "AhaSlides Team"


def _dump(obj):
    return json.dumps(obj, ensure_ascii=False)


# An *outbound / forwarded* thread: the only structured person object is the
# agent. The customer's name + email survive only inside free text (the quoted
# `From:` line and the signature). This is the case that used to leak the name.
FORWARDED_THREAD = {
    "id": "570272000184971014",
    "direction": "out",
    "isForward": True,
    "cc": "",
    "bcc": "",
    "to": f'"{AGENT_NAME}"<{AGENT_EMAIL}>',
    "fromEmailAddress": f'"{AGENT_NAME}"<{AGENT_EMAIL}>',
    "author": {
        "id": "570272000000139001",
        "name": AGENT_NAME,
        "email": AGENT_EMAIL,
        "type": "AGENT",
        "firstName": "AhaSlides",
        "lastName": "Team",
    },
    "summary": (
        "============ Forwarded Message ============ "
        f'From: "{CUSTOMER_NAME}"<{CUSTOMER_EMAIL}> '
        f'To: "{AGENT_EMAIL}"<{AGENT_EMAIL}> Date: Tue, 23 Jun 2026 ...'
    ),
    "content": (
        f'<div>From: "{CUSTOMER_NAME}"&lt;<a href="mailto:{CUSTOMER_EMAIL}">'
        f"{CUSTOMER_EMAIL}</a>&gt;</div>"
        "<p>Kind regards,</p>"
        f"<p><span>{CUSTOMER_NAME}</span></p>"
        "<p><span>Tel: 0931 - 37- 2983</span></p>"
    ),
}

# A normal inbound thread: customer is the structured author. Already worked, but
# guard against regressions.
INBOUND_THREAD = {
    "id": "570272000184717892",
    "direction": "in",
    "to": f'"{AGENT_EMAIL}"<{AGENT_EMAIL}>',
    "fromEmailAddress": f'"{CUSTOMER_NAME}"<{CUSTOMER_EMAIL}>',
    "author": {
        "id": "570272000184717855",
        "name": CUSTOMER_NAME,
        "email": CUSTOMER_EMAIL,
        "type": "END_USER",
        "firstName": None,
        "lastName": "Bäcker",
    },
    "content": f"<p>Kind regards,</p><p>{CUSTOMER_NAME}</p>",
    "summary": f"Dear AhaSlides team ... regards {CUSTOMER_NAME}",
}

# A ticket-DETAIL payload (GET /tickets/{id}): the customer is the structured
# `contact`, plus an email/phone on the ticket envelope. Returned by get_zoho_ticket.
TICKET_DETAIL = {
    "id": "570272000184717800",
    "ticketNumber": "120929",
    "subject": "GDPR / data-protection procurement query",
    "status": "Closed",
    "channel": "Email",
    "email": CUSTOMER_EMAIL,
    "phone": "0931 - 37- 2983",
    "contact": {
        "id": "570272000184717855",
        "name": CUSTOMER_NAME,
        "firstName": "Sascha",
        "lastName": "Bäcker",
        "email": CUSTOMER_EMAIL,
        "type": "END_USER",
        "photoURL": "https://desk.zoho.com/avatar/abc.png",
    },
    "assignee": {
        "id": "570272000000139001",
        "name": AGENT_NAME,
        "email": AGENT_EMAIL,
        "type": "AGENT",
    },
    "description": f"Sent by {CUSTOMER_NAME} <{CUSTOMER_EMAIL}> regarding GDPR.",
}

# A ticket-LIST payload (GET /tickets): an envelope `{"data": [ ... ]}` with two
# tickets. Proves masking recurses into EVERY ticket in the list, not just the
# envelope. Returned by list_zoho_tickets.
SECOND_CUSTOMER_EMAIL = "maria.rossi@example.it"
SECOND_CUSTOMER_NAME = "Maria Rossi"
TICKET_LIST = {
    "data": [
        {
            "id": "570272000184717800",
            "ticketNumber": "120929",
            "subject": "GDPR query",
            "email": CUSTOMER_EMAIL,
            "contact": {
                "name": CUSTOMER_NAME,
                "email": CUSTOMER_EMAIL,
                "type": "END_USER",
            },
        },
        {
            "id": "570272000184717999",
            "ticketNumber": "120930",
            "subject": "Billing question",
            "email": SECOND_CUSTOMER_EMAIL,
            "contact": {
                "name": SECOND_CUSTOMER_NAME,
                "email": SECOND_CUSTOMER_EMAIL,
                "type": "END_USER",
            },
        },
    ]
}

failures = []


def check(name, cond):
    print(("PASS" if cond else "FAIL"), "-", name)
    if not cond:
        failures.append(name)


for label, thread in (("forwarded", FORWARDED_THREAD), ("inbound", INBOUND_THREAD)):
    masked = m._mask_identity(thread)
    blob = _dump(masked)
    check(f"[{label}] customer email gone", CUSTOMER_EMAIL not in blob)
    check(f"[{label}] customer name gone", CUSTOMER_NAME not in blob and "Bäcker" not in blob)

# --- Ticket DETAIL (get_zoho_ticket) ------------------------------------------
det = m._mask_identity(TICKET_DETAIL)
det_blob = _dump(det)
check("[detail] customer email gone", CUSTOMER_EMAIL not in det_blob)
check("[detail] customer name gone", CUSTOMER_NAME not in det_blob and "Bäcker" not in det_blob)
check("[detail] agent name preserved", AGENT_NAME in det_blob)
check("[detail] redaction markers present",
      "[redacted-email]" in det_blob and "[redacted-name]" in det_blob)

# --- Ticket LIST (list_zoho_tickets) ------------------------------------------
# Masking must reach EVERY ticket in the {"data": [...]} envelope, not just the
# first — this is the regression the list endpoint is most likely to hit.
lst = m._mask_identity(TICKET_LIST)
lst_blob = _dump(lst)
check("[list] first customer email gone", CUSTOMER_EMAIL not in lst_blob)
check("[list] first customer name gone", CUSTOMER_NAME not in lst_blob and "Bäcker" not in lst_blob)
check("[list] second customer email gone", SECOND_CUSTOMER_EMAIL not in lst_blob)
check("[list] second customer name gone", SECOND_CUSTOMER_NAME not in lst_blob)
check("[list] both tickets still present (envelope intact)",
      len(lst.get("data", [])) == 2)
check("[list] every ticket masked (no raw contact name survives)",
      all("[redacted-name]" in _dump(t) for t in lst["data"]))

# Agent name must not be over-redacted away on the forwarded thread.
fwd = m._mask_identity(FORWARDED_THREAD)
check("[forwarded] empty cc/bcc preserved (not invented)", fwd["cc"] == "" and fwd["bcc"] == "")
check("[forwarded] redaction markers present", "[redacted-email]" in _dump(fwd) and "[redacted-name]" in _dump(fwd))

# Masking bypass still works.
import os
os.environ["ZOHO_MASK"] = "0"
m._MASKING_ENABLED = False
try:
    check("bypass returns raw", m._mask_identity(INBOUND_THREAD) is INBOUND_THREAD)
finally:
    m._MASKING_ENABLED = True
    os.environ.pop("ZOHO_MASK", None)

if failures:
    raise SystemExit(f"\n{len(failures)} check(s) failed: {failures}")
print("\nAll masking checks passed.")
