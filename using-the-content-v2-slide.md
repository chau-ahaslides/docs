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

> **Tip — let AI do the heavy lifting:** The AhaSlides AI slide agent can generate a ready-to-use Content v2 slide from a plain-text prompt. Open the AI slide agent, describe what you need (e.g. "a cover slide for a product launch" or "a comparison table for three pricing tiers"), and the agent creates the slide with blocks and content already in place. Editing a generated slide is much faster than building one from scratch.

## How to add a Content v2 slide

In the editor, click **New slide**, then scroll to the **Content** section of the slide type picker and select **Content v2**. The slide opens with a prompt: *"Choose a layout or insert elements →"*

## Two ways to build your slide

### Option 1: Start from a layout

AhaSlides ships a growing gallery of named, pre-designed layouts — cover slides, agenda grids, callout cards, comparison tables, image-and-text pairs, and more. The gallery is regularly expanded, so you may see more options than are listed anywhere in this article.

To browse the gallery, look for the **Layouts** section in the right panel (visible when no block is selected), then click **Browse all →** to open the full picker. Scroll through or search by name to find a starting point that matches your content. Examples of available layouts include *Cover Hero*, *Agenda*, *Feature matrix*, *Pull quote*, and *Process steps* — but these are illustrative; the full gallery inside the editor is the authoritative list.

Clicking any layout fills the canvas with a matching arrangement of pre-styled blocks that you can edit straight away. Once applied, each block is independently editable.

### Option 2: Insert blocks manually

Click the **+ Insert** button at the top of the right panel to open the block picker. A search bar lets you filter by name. Blocks are grouped into five categories:

| Category | Blocks |
|---|---|
| **Text** | Title, Body, Bullets, Numbered (list), Quote, Section header |
| **Callouts** | Note, Info, Tip, Important, Warning, Caution, Success, Question |
| **Visual** | Image, Rectangle, Circle, Line, Arrow, Divider, Icon |
| **Media** | Video, Timer |
| **Data** | Table, Big stat, Code |

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
