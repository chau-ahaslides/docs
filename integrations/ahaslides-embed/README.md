# AhaSlides embed — GitBook ContentKit integration

A small, self-contained [GitBook ContentKit](https://gitbook.com/docs/developers/integrations)
integration that embeds a **live, interactive AhaSlides template** inside a GitBook
page — the same "Try it" experience as the AhaSlides blog, but rendered through the
one GitBook primitive that produces a true sandboxed iframe: the `<webframe>`
component.

It exists because GitBook **strips raw `<iframe>` HTML** on publish, and its
`{% embed %}` block can't resolve `presenter.ahaslides.com/shared-template/<id>`
(the presenter is a client-side SPA that returns HTTP 404 to crawlers and exposes no
oEmbed/Open-Graph metadata). A ContentKit custom block is the supported way to put a
real interactive frame on the page.

## What it does

- Registers one **custom block** (`AhaSlides`) that you can insert from the editor's
  `/` menu.
- **Auto-inserts on paste**: pasting any of these links into the editor turns it into
  a live embed (via the `urlUnfurl` manifest hook + the `@link.unfurl` action):
  - `https://presenter.ahaslides.com/shared-template/<id>`
  - `https://presenter.ahaslides.com/share/<id>`
  - `https://ahaslides.com/share/<id>` (rewritten onto the presenter host)
- Renders `<webframe source={{ url }} aspectRatio={16/9} />`, defaulting the query
  string to `?hideAccessCode=true&hideText=true` so the frame matches the clean blog
  "Try it" embed. An "Open in AhaSlides" overlay button opens the deck full-screen.
- If a link can't be parsed (or the block is inserted empty), it shows a prompt card
  instead of a blank frame.

## Files

| File                     | Purpose                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| `gitbook-manifest.yaml`  | Integration manifest: one `embed` block, read-only scopes, `urlUnfurl` patterns, `visibility: private`. |
| `src/index.tsx`          | `createIntegration({ components: [embedBlock] })` — the block's `action` (unfurl) + `render` (webframe). |
| `src/embed.ts`           | URL parsing → canonical presenter embed URL with the hide-access-code/hide-text defaults. |
| `package.json`           | `@gitbook/runtime` + `@gitbook/api` deps; `@gitbook/cli` dev dep; `build`/`publish` scripts. |
| `tsconfig.json`          | Self-contained TS config (`jsxImportSource: @gitbook/runtime`).    |

## Build

```bash
cd integrations/ahaslides-embed
npm install
npm run typecheck   # tsc --noEmit
npm run build       # gitbook check — validates the manifest + ContentKit usage
```

## Publish

```bash
# One-time auth (opens a browser to authorize the GitBook CLI):
npx gitbook auth

# Set your org id in gitbook-manifest.yaml first (replace `your-org`), then:
npm run publish-integration   # gitbook publish .
```

`gitbook whoami` prints the organization id to drop into the manifest's
`organization:` field.

## Install on the docs space

1. In GitBook, open the **AhaSlides** docs space (the one published at
   `docs.ahaslides.com`).
2. Go to **Integrations** (space sub-nav) — or **Organization settings → Integrations**
   to enable it across spaces — and enable **AhaSlides**.
3. In any page, insert the **AhaSlides** block from the `/` menu, or paste a
   `presenter.ahaslides.com/shared-template/...` link. The live deck renders inline.

## Prerequisite to verify — framing headers

`<webframe>` only renders if `presenter.ahaslides.com` allows being framed by the
origin GitBook serves the frame from.

As of this writing the presenter sends **no `X-Frame-Options: DENY`** and a
`Content-Security-Policy` whose `frame-ancestors` already lists
`'self' https://*.ahaslides.com https://ahaslides.com ...`. Because the docs are
published at `docs.ahaslides.com` (a `*.ahaslides.com` host), framing is permitted
there.

Verify before relying on it:

```bash
curl -sS -D - -o /dev/null \
  "https://presenter.ahaslides.com/shared-template/<id>?hideAccessCode=true&hideText=true" \
  | grep -iE 'x-frame-options|content-security-policy'
```

If the live embed ever renders blank, confirm the origin GitBook frames it from is
covered by the presenter's `frame-ancestors` allow-list and, if not, add that origin
to the presenter's CSP. (The HTTP `404` status on the share URL is expected — the SPA
still loads client-side inside the frame.)

## Reference

Built against GitBook's official ContentKit API — mirrors the structure of the
`arcade` and `figma` integrations in
[GitbookIO/integrations](https://github.com/GitbookIO/integrations). `webframe` /
`createComponent` / `createIntegration` / manifest schema all per
[the ContentKit reference](https://gitbook.com/docs/developers/integrations).
