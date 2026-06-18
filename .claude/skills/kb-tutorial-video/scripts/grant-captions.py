#!/usr/bin/env python3
"""
One-time helper: mint a YouTube OAuth token that includes the
youtube.force-ssl scope (required for captions.insert), reusing the
existing desktop OAuth client in client_secret.json.

Run it, approve in the browser as the @chauhoangahaslides account, and it
writes the token (incl. refresh_token) to caption_token.json next to this
script. Claude then reads that file and calls captions.insert directly.

Prereq: youtube.force-ssl must already be added to the OAuth consent
screen for project ahaslides-knowledge-base (Step 1).
"""
import json, os, sys, time, subprocess, urllib.parse, webbrowser, http.server, socket

HERE = os.path.dirname(os.path.abspath(__file__))
SECRET = os.path.join(HERE, "client_secret.json")
OUT = os.path.join(HERE, "caption_token.json")
SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl"
AUTH = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN = "https://oauth2.googleapis.com/token"

c = json.load(open(SECRET))["installed"]
CID, CSECRET = c["client_id"], c["client_secret"]

# Pick a free loopback port; desktop clients accept any http://localhost:PORT
s = socket.socket(); s.bind(("127.0.0.1", 0)); PORT = s.getsockname()[1]; s.close()
REDIRECT = f"http://localhost:{PORT}"

params = {
    "client_id": CID, "redirect_uri": REDIRECT, "response_type": "code",
    "scope": SCOPE, "access_type": "offline", "prompt": "consent",
}
url = AUTH + "?" + urllib.parse.urlencode(params)

code_box = {}
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.urlparse(self.path).query
        code_box.update(urllib.parse.parse_qs(q))
        self.send_response(200); self.end_headers()
        self.wfile.write(b"Authorization received. You can close this tab and return to the terminal.")
    def log_message(self, *a): pass

print("\nOpen this URL and approve as @chauhoangahaslides:\n\n" + url + "\n")
try: webbrowser.open(url)
except Exception: pass

srv = http.server.HTTPServer(("127.0.0.1", PORT), H)
srv.handle_request()  # serve exactly one request (the redirect)

if "error" in code_box:
    sys.exit("OAuth error: " + code_box["error"][0])
code = code_box.get("code", [None])[0]
if not code:
    sys.exit("No code received.")

# Use curl for the token exchange — the python.org macOS build lacks a CA
# bundle, so urllib raises CERTIFICATE_VERIFY_FAILED; curl uses the system store.
form = urllib.parse.urlencode({
    "code": code, "client_id": CID, "client_secret": CSECRET,
    "redirect_uri": REDIRECT, "grant_type": "authorization_code",
})
out = subprocess.run(
    ["curl", "-fsS", "-X", "POST", TOKEN, "-d", form],
    capture_output=True, text=True,
)
if out.returncode != 0:
    sys.exit("Token exchange failed: " + (out.stderr or out.stdout))
tok = json.loads(out.stdout)
tok["obtained_at"] = int(time.time())
json.dump(tok, open(OUT, "w"), indent=2)
os.chmod(OUT, 0o600)
print(f"\n✓ Token with force-ssl written to {OUT}")
print("  scope:", tok.get("scope"))
print("  refresh_token:", "present" if tok.get("refresh_token") else "MISSING (re-run with prompt=consent)")
