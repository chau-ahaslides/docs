# Zoho Desk MCP (kb-local)

A small [FastMCP](https://github.com/jlowin/fastmcp) stdio server exposing the Zoho Desk
ticket-reading tools. **Every** tool routes its result through the same masking seam,
`_mask_identity()` in `mcp_server.py`, so no matter which endpoint an agent calls the
customer's identity is redacted (end-user names, emails, phones, avatar URLs — agent
names preserved):

- `get_zoho_convo(ticket_id, thread_id)` — a single conversation thread.
- `get_zoho_ticket(ticket_id)` — ticket detail (`GET /tickets/{id}`).
- `get_zoho_ticket_conversations(ticket_id)` — the full thread list (`GET /tickets/{id}/conversations`).
- `list_zoho_tickets(limit, from_, status)` — the ticket list (`GET /tickets`, envelope
  `{"data": [...]}`; masking recurses into every ticket).

This is a **kb-only fork** of `scrum-master-slave/tools/zoho/mcp_server.py`, kept here so
customer-identity masking can be added without diverging the shared upstream tool.

Offline masking tests live in `test_masking.py` (no network — payloads are constructed
directly); they cover the thread, ticket-detail and ticket-list shapes.

## Setup

Credentials are read from the kb **repo-root `.env`** or a local `mcp/zoho/.env`
(both are loaded; local wins). You need:

- `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET` — from your Zoho **Self Client**.
- `ZOHO_REFRESH_TOKEN` — long-lived, but minted **once** from a short-lived grant code:

  1. api-console.zoho.com → your Self Client → **Generate Code**
     (scope `Desk.tickets.READ`, 10-min duration), copy the code.
  2. Exchange it (the code expires in minutes, so run promptly):

     ```bash
     uv run --python 3.11 --with requests --with python-dotenv \
       python mcp/zoho/bootstrap_token.py '<GRANT_CODE>'
     ```

     This writes `ZOHO_REFRESH_TOKEN` into the repo-root `.env`. The refresh token
     does not expire (valid until revoked), so this is a one-time step.

`.env` and the cached `access_token.txt` are git-ignored — never commit them.

The server is wired into `ahaslides-kb/.mcp.json` and launched on demand by Claude
Code via `uv` (no manual venv needed). `uv` auto-fetches a Python ≥3.10 and the deps.

### Fleet folder

The Agent-Fleet workspace `.fleet-tasks/ahaslides_kb_fleet/.mcp.json` also defines a
`zoho` server. Since that folder isn't a git checkout, it points at this server by
absolute path and sets `ZOHO_ENV_FILE` to the fleet folder's own `.env`. A manager
session launched there gets the same `get_zoho_convo` tool.

## Run manually (for debugging)

```bash
uv run --python 3.11 --with fastmcp --with requests --with python-dotenv \
  fastmcp run mcp_server.py:mcp
```

The 10-minute Zoho access token is minted lazily on first tool call and refreshed
automatically on `INVALID_OAUTH` / `UNAUTHORIZED`.
