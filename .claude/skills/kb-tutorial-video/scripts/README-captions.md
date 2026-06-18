# YouTube caption upload (KB tutorial videos)

The `youtube-uploader` MCP can upload videos but **not** captions: it has no
caption tool, and its OAuth token is scoped `youtube.readonly + youtube.upload`
only. Caption (`captions.insert`) needs `youtube.force-ssl`. We bypass the MCP
and call the REST API directly with a separately-minted force-ssl token.

## One-time setup
1. In Google Cloud Console (project `ahaslides-knowledge-base`) → OAuth consent
   screen → Data Access, add scope `.../auth/youtube.force-ssl`. (Adding the
   scope does NOT upgrade an existing token — OAuth scopes are frozen at
   authorization, so you must re-consent.)
2. Run `grant-captions.py` (reuses `~/.config/youtube-uploader/client_secret.json`),
   approve in the browser. It writes `~/.config/youtube-uploader/caption_token.json`
   (force-ssl access + refresh token, mode 600 — never committed). The token
   exchange uses `curl`, not python urllib, because the python.org macOS build
   ships no CA bundle (CERTIFICATE_VERIFY_FAILED otherwise).

## Uploading a caption track
Read `access_token` from `caption_token.json`, then:

    curl -sS -X POST \
      "https://www.googleapis.com/upload/youtube/v3/captions?part=snippet&uploadType=multipart" \
      -H "Authorization: Bearer $AT" \
      -F 'metadata={"snippet":{"videoId":"<ID>","language":"en","name":"English","isDraft":false}};type=application/json' \
      -F "file=@<path>.vtt;type=text/vtt"

Returns a `standard` track that overrides YouTube's auto (`asr`) caption.
First proven on AKB-4 (pc18uoqDQv0) and AKB-13 (W3Diw_84Rj0).
