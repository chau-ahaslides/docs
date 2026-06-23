#!/usr/bin/env python
"""One-time bootstrap: exchange a Zoho self-client grant code for a long-lived
refresh token, and save it into the kb repo-root .env as ZOHO_REFRESH_TOKEN.

Why: the MCP server mints short-lived *access* tokens from a *refresh* token,
but the refresh token must be created once. Zoho's self-client "Generate Code"
produces a grant code that is valid only a few minutes — exchange it promptly.

How to get the grant code:
  api-console.zoho.com -> your Self Client -> "Generate Code" tab
    Scope:    Desk.tickets.READ
    Duration: 10 minutes
  Copy the code, then run (from the kb repo root):

    uv run --python 3.11 --with requests --with python-dotenv \
        python mcp/zoho/bootstrap_token.py '<GRANT_CODE>'

Reads ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET (and optional ZOHO_ACCOUNTS_URL /
ZOHO_REDIRECT_URI) from the repo-root .env.
"""
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

HERE = Path(__file__).parent
REPO_ROOT = HERE.parent.parent

for _p in (REPO_ROOT / '.env', HERE / '.env'):
    if _p.is_file():
        load_dotenv(_p, override=True)

CLIENT_ID = os.getenv("ZOHO_CLIENT_ID")
CLIENT_SECRET = os.getenv("ZOHO_CLIENT_SECRET")
ACCOUNTS_URL = os.getenv("ZOHO_ACCOUNTS_URL", "https://accounts.zoho.com").rstrip("/")
REDIRECT_URI = os.getenv("ZOHO_REDIRECT_URI", "https://www.ahaslides.com")


def _exchange(code, with_redirect):
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
    }
    if with_redirect:
        params["redirect_uri"] = REDIRECT_URI
    return requests.post(f"{ACCOUNTS_URL}/oauth/v2/token", params=params, timeout=20).json()


def _save_refresh_token(refresh_token):
    env_path = REPO_ROOT / '.env'
    lines = env_path.read_text().splitlines() if env_path.is_file() else []
    out, found = [], False
    for ln in lines:
        if ln.startswith("ZOHO_REFRESH_TOKEN="):
            out.append(f"ZOHO_REFRESH_TOKEN={refresh_token}")
            found = True
        else:
            out.append(ln)
    if not found:
        out.append(f"ZOHO_REFRESH_TOKEN={refresh_token}")
    env_path.write_text("\n".join(out) + "\n")
    return env_path


def main():
    if len(sys.argv) < 2 or not sys.argv[1].strip():
        sys.exit("usage: bootstrap_token.py '<grant_code>'")
    if not (CLIENT_ID and CLIENT_SECRET):
        sys.exit("ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET missing from .env")
    code = sys.argv[1].strip()

    # Self clients often don't need redirect_uri; try with it, then without.
    data = _exchange(code, with_redirect=True)
    if not data.get("refresh_token"):
        data = _exchange(code, with_redirect=False)

    rt = data.get("refresh_token")
    if not rt:
        sys.exit(f"No refresh_token returned. Zoho said: {data}")

    env_path = _save_refresh_token(rt)
    print(f"OK: refresh token saved to {env_path}")
    print("access_token also returned:", bool(data.get("access_token")))
    print("api_domain:", data.get("api_domain"))


if __name__ == "__main__":
    main()
