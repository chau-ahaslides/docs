# Zoho Desk MCP (kb-local)

A small [FastMCP](https://github.com/jlowin/fastmcp) stdio server exposing one tool,
`get_zoho_convo(ticket_id, thread_id)`, which fetches a Zoho Desk ticket thread.

This is a **kb-only fork** of `scrum-master-slave/tools/zoho/mcp_server.py`, kept here so
customer-identity masking can be added without diverging the shared upstream tool. The
masking seam is `_mask_identity()` in `mcp_server.py`.

## Setup

1. `cp .env.example .env` and fill in the Zoho OAuth credentials:
   - `ZOHO_CLIENT_ID`
   - `ZOHO_CLIENT_SECRET`
   - `ZOHO_REFRESH_TOKEN`

   `.env` and the cached `access_token.txt` are git-ignored — never commit them.

2. The server is wired into `ahaslides-kb/.mcp.json` and launched on demand by Claude
   Code via `uv` (no manual venv needed). `uv` auto-fetches a Python ≥3.10 and the deps.

## Run manually (for debugging)

```bash
uv run --python 3.11 --with fastmcp --with requests --with python-dotenv \
  fastmcp run mcp_server.py:mcp
```

The 10-minute Zoho access token is minted lazily on first tool call and refreshed
automatically on `INVALID_OAUTH` / `UNAUTHORIZED`.
