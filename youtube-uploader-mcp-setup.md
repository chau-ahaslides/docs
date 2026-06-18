# YouTube Uploader MCP — host setup

The KB tutorial-video pipeline uploads videos to YouTube through a project-scoped
MCP server defined in [`.mcp.json`](./.mcp.json). That config references **two
machine-local files that are intentionally not committed** (the binary is large;
the credential is a secret):

| File | Purpose |
| --- | --- |
| `~/.local/bin/youtube-uploader-mcp-darwin-arm64` | the MCP server binary |
| `~/.config/youtube-uploader/client_secret.json` | your Google OAuth2 desktop-app client |

On a fresh machine neither exists, so Claude Code fails to start the server with:

```
Failed to reconnect to youtube-uploader: ENOENT
ENOENT: no such file or directory, posix_spawn
  '/Users/<you>/.local/bin/youtube-uploader-mcp-darwin-arm64'
```

Follow the two steps below to fix it.

> The server is the open-source project
> [anwerj/youtube-uploader-mcp](https://github.com/anwerj/youtube-uploader-mcp).
> The steps below target **macOS Apple Silicon (darwin-arm64)** — the platform
> `.mcp.json` is pinned to. For Intel Macs / Linux / Windows, swap the asset name
> (`darwin-amd64`, `linux-amd64`, `windows-amd64.exe`) and the binary path in
> `.mcp.json` accordingly.

## 1. Install the MCP server binary

Downloads the official **v0.1.2** release asset to the path `.mcp.json` expects,
makes it executable, and clears the macOS quarantine flag so Gatekeeper allows it:

```bash
DEST="$HOME/.local/bin/youtube-uploader-mcp-darwin-arm64"
URL="https://github.com/anwerj/youtube-uploader-mcp/releases/download/v0.1.2/youtube-uploader-mcp-darwin-arm64"

mkdir -p "$HOME/.local/bin"
curl -fsSL "$URL" -o "$DEST"
chmod +x "$DEST"
xattr -d com.apple.quarantine "$DEST" 2>/dev/null || true
```

Verify (expected size `15741026` bytes, sha256 below):

```bash
ls -l "$DEST"
shasum -a 256 "$DEST"
# e26fb7a6b692dbeb918a88830ced81ac34822db72caedd8b023899cff74f40dc
"$DEST" -h   # should print usage with -client_secret_file / -working_dir
```

This alone clears the `ENOENT` error. The server still needs step 2 to actually
boot and upload — without a `client_secret.json` present, the server exits and
the MCP handshake never completes.

## 2. Provide the Google OAuth2 client secret

The server authenticates to YouTube with **your own** Google OAuth2 credential.
This file is a secret — never commit it. Put it at exactly:

```
~/.config/youtube-uploader/client_secret.json
```

```bash
mkdir -p "$HOME/.config/youtube-uploader"
# then copy your client_secret.json into that directory
```

Two ways to obtain it:

- **Reuse an existing one** (preferred) — if a previous host or your secrets
  manager already has the OAuth client used for past uploads, drop that file in.
  Reusing the same client keeps existing refresh tokens valid.
- **Create a new one** — in the Google Cloud Console:
  1. Enable the **YouTube Data API v3**.
  2. Create an **OAuth client ID** of type **Desktop app**.
  3. Download the JSON and save it as `~/.config/youtube-uploader/client_secret.json`.

  Upstream's [`youtube_oauth2_setup.md`](https://github.com/anwerj/youtube-uploader-mcp/blob/main/youtube_oauth2_setup.md)
  is a step-by-step walkthrough.

## 3. Restart and authenticate

1. Restart Claude Code (or re-run `/mcp`) — `youtube-uploader` should now connect.
2. Run the MCP's `authenticate` tool and complete the browser consent. Tokens are
   stored in `~/.config/youtube-uploader/` (the `-working_dir`) and auto-refresh
   thereafter, so you only do this once per host.

### Verify the server boots

With the credential in place, the server completes the MCP handshake:

```bash
BIN="$HOME/.local/bin/youtube-uploader-mcp-darwin-arm64"
WD="$HOME/.config/youtube-uploader"
( printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"0"}}}'; sleep 2 ) \
  | "$BIN" -client_secret_file "$WD/client_secret.json" -working_dir "$WD"
# → {"jsonrpc":"2.0","id":1,"result":{... "serverInfo":{"name":"Youtube Uploader MCP","version":"0.1.2"}}}
```

## Notes

- **Captions are separate.** The `youtube-uploader` MCP uploads videos but not
  caption tracks — see
  [`.claude/skills/kb-tutorial-video/scripts/README-captions.md`](./.claude/skills/kb-tutorial-video/scripts/README-captions.md).
- `.mcp.json` uses `${HOME}` so the config is portable across hosts; only these
  two local files differ per machine.
