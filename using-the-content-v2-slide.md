---
title: Using the Content v2 Slide
status: Draft
permalink: using-the-content-v2-slide
category: Using Slide Types on AhaSlides
permission: ALL
last_updated: 2026-06-18
tags: ["content v2", "layout", "blocks", "slide design", "presentation design", "static slide"]
keywords: ["content v2", "content slide", "layout", "blocks", "insert", "design slide", "presenter slide"]
summary: The Content v2 slide is a fully flexible design canvas for creating polished, layout-driven slides. Start from a ready-made layout or build your own by inserting text, callout, visual, media, and data blocks from scratch.
plan_required: All
related_articles: ["using-the-content-slide", "using-the-diagram-slide"]
mcp_actions:
  note: "The Content v2 slide is not currently supported by the AhaSlides MCP create_slides() tool. Add Content v2 slides manually in the editor."
warning: "DRAFT — Zoho article ID not yet assigned. Do not publish to Zoho until an ID is confirmed."
description: "The Content v2 slide is a fully flexible design canvas for creating polished, layout-driven slides. Start from a ready-made layout or build your own by inserting text, callout, visual, media, and data blocks from scratch."
---

# Using the Content v2 Slide

The Content v2 slide is a design canvas for creating polished, structured presentation slides. You choose a pre-built layout or compose the slide block by block — mixing text, images, tables, callouts, shapes, and more — and the result appears on the presenter screen for your audience to view.

Like the original Content slide, Content v2 is **non-interactive**: participants see the slide on their screens but cannot submit a response. The upgrade is in the authoring experience: a structured block system replaces the free-floating canvas, giving you a richer set of content types and purpose-built layout templates.

## How to add a Content v2 slide

In the editor, click **New slide**, then scroll to the **Content** section of the slide type picker and select **Content v2**. The slide opens with a prompt: *"Choose a layout or insert elements →"*

## Two ways to build your slide

### Option 1: start from a layout

The right panel shows a **Layouts** section with more than 25 named templates. Click **Browse all →** to see the full list. Clicking a layout fills the canvas with a matching arrangement of pre-styled blocks that you can edit straight away.

Available layouts include:

| Layout name | Best for |
|---|---|
| Cover · Hero | Opening slides with a strong headline |
| Cover · Minimal | Clean, typographic title slides |
| Statement · headline + body | Making a single key point |
| Big stat · one hero number | Highlighting a key metric |
| Image left, text right | Side-by-side photo and copy |
| Image right, text left | Side-by-side copy and photo |
| Image + text | Mixed image and body text |
| Photo overlay | Full-bleed image with text on top |
| Agenda · 6-section grid | Session agendas or topic lists |
| Section break | Transition slides between topics |
| Feature matrix | Comparing features or options |
| Pull quote | Highlighting a quote or testimonial |
| Pull quote · rich | Quote with additional styling |
| Big question | Posing a large discussion prompt |
| CTA · next steps | Closing slides with action items |
| Manifesto | Bold statement or values slide |
| Process steps | Sequential steps or workflows |
| Timeline / Roadmap | Chronological or project views |
| Logo wall · 4×2 | Sponsor or partner logo grids |
| Wave accent | Visually accented background slide |
| Definition slide | Glossary or key term definitions |
| Editorial · cream | Magazine-style editorial layout |
| FAQ | Frequently asked questions |
| Tip callout | Highlighting a tip or advice |
| Centered headline + body | Balanced centred text layout |
| 10 min break | Break announcement slide |
| Video hero | Full-width video with text |

Once a layout is applied, each block on the canvas is independently editable.

### Option 2: insert blocks manually

Click the **+ Insert** button at the top of the right panel to open the block picker. A search bar lets you filter by name. Blocks are grouped into five categories:

**TEXT**
- Title
- Body
- Bullets
- Numbered (list)
- Quote
- Section header

**CALLOUTS**
- Note
- Info
- Tip
- Important
- Warning
- Caution
- Success
- Question

**VISUAL**
- Image
- Rectangle
- Circle
- Line
- Arrow
- Divider
- Icon

**MEDIA**
- Video
- Timer

**DATA**
- Table
- Big stat
- Code

Each block you insert appears on the canvas and can be repositioned, resized, and styled independently.

## Editing blocks

Click any block on the canvas to select it. The right panel switches to show that block's settings across three tabs:

- **Style** — font family, formatting, Markdown input (blocks accept Markdown syntax, so `# Heading`, `**bold**`, and `- list item` all render correctly), and colour controls.
- **Layout** — size, position, and alignment options for the selected block.
- **Animate** — animation settings for when the block appears on screen during a presentation.

The canvas toolbar for a selected block also gives you quick access to bold, italic, underline, strikethrough, font size, text colour, and text alignment without opening the panel.

To delete a block, select it and click **Delete** in the canvas toolbar, or press the Delete key on your keyboard.

## Formatting with Markdown

All text blocks on the Content v2 slide accept **Markdown**. You type in the Markdown text area in the Style tab and the canvas renders the output live. Standard Markdown syntax works: headings (`#`, `##`), bold (`**text**`), italic (`*text*`), bullet lists (`-`), numbered lists (`1.`), inline code (`` `code` ``), and links (`[label](url)`).

## Using the AI assistant

Click **Improve with AI** on any selected block to open the AI assistant for that block. The assistant can rewrite, expand, or shorten the block's text based on your instructions. The **Improve** button in the editor header bar also opens the AI assistant for the slide as a whole.

## Presenting the Content v2 slide

When your presentation reaches a Content v2 slide, the canvas fills the presenter screen. Participants viewing on their phones or browsers see the same layout in a read-only view. There is no response required from the audience.

## Content v2 vs. Content slide

| | Content v2 | Content (original) |
|---|---|---|
| Authoring model | Structured blocks | Free-floating canvas |
| Layouts | 25+ named templates | None |
| Block types | Text, callouts, visual, media, data | Text, image, GIF, emoji, shape |
| Markdown support | Yes | No |
| AI per-block | Yes | Slide-level only |
| Participant interaction | None (display only) | None (display only) |

Use **Content v2** when you want polished, well-structured slides — covering slides, data callouts, FAQs, or branded layouts. Use the original **Content slide** when you need freeform, pixel-precise drag-and-drop placement.

## AhaSlides MCP

The Content v2 slide is not currently supported by the AhaSlides MCP `create_slides()` tool. Add Content v2 slides manually in the editor.

## Remaining pre-publish steps

1. **Zoho article ID** — a Zoho Help Center article ID must be added to the frontmatter (`id:` and `zoho_url:`) before this draft can be published and synced.
