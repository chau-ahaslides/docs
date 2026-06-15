---
title: Using the Diagram Slide
status: Draft
permalink: using-the-diagram-slide
category: Using Slide Types on AhaSlides
permission: ALL
last_updated: 2026-06-15
tags: ["diagram", "visual", "flowchart", "ahaslides"]
keywords: ["diagram", "flowchart", "visual", "chart", "mind map"]
summary: The Diagram slide lets you build and display visual diagrams — such as flowcharts, mind maps, or org charts — directly in your AhaSlides presentation, turning complex relationships into clear, structured visuals for your audience.
plan_required: All
related_articles: ["using-the-content-slide"]
mcp_actions:
  note: "Diagram slide MCP action — confirm slide_type string before adding"
warning: "DRAFT — product details (diagram subtypes, exact UI labels, plan gating) unconfirmed. Confirm with product team before publishing. Do not update Zoho until verified."
description: "The Diagram slide lets you build and display visual diagrams — such as flowcharts, mind maps, or org charts — directly in your AhaSlides presentation, turning complex relationships into clear, structured visuals for your audience."
---

# Using the Diagram Slide

The Diagram slide lets you create and display structured visual diagrams — such as flowcharts, mind maps, or org charts — without leaving AhaSlides. Instead of pasting a static screenshot, you build the diagram directly in the editor, keeping everything inside your presentation and making it easy to update.

## What the Diagram slide is for

Use a Diagram slide any time you need to show relationships, hierarchies, or processes rather than a list of words or a poll result. Common uses include:

- **Process walkthroughs** — map out a workflow or decision tree step by step.
- **Org charts** — show team structure or reporting lines to a live audience.
- **Mind maps** — visualise how ideas connect during a brainstorm or planning session.
- **Concept maps** — illustrate cause-and-effect relationships in training or education.

Unlike a Content slide with a static image, the Diagram slide is built with nodes and connectors that you arrange in the editor, which means you can adjust labels or structure at any time before presenting.

## Setting up your Diagram slide

### 1. Add the slide

In the editor, click **New slide** and select **Diagram** from the slide type picker.

### 2. Choose a diagram type

Select the diagram layout that best fits your content. Available layouts may include:

- Flowchart
- Mind map
- Org chart
- Other visual formats

> **Note:** The exact diagram subtypes available — and which layouts are accessible on which plans — need confirmation. See the open questions at the bottom of this article.

### 3. Add nodes and labels

Click an empty area in the diagram canvas to add a new node, or click an existing node and use the **Add** button to branch from it. Type your label directly into each node.

To connect two nodes, hover over the edge of a node until the connector handle appears, then drag to the target node.

### 4. Arrange your layout

Drag nodes to reposition them on the canvas. Most diagram types auto-arrange when you add new nodes; you can drag to override the automatic positioning.

### 5. Style your diagram (optional)

Use the styling panel on the right side of the editor to adjust node colours, border styles, and connector types to match your presentation theme.

### 6. Add a title

Enter a short title or prompt in the **Your question** or heading field above the diagram canvas — this appears on the presenter screen and helps your audience orient themselves.

## Presenting the Diagram slide

When you reach a Diagram slide during a presentation, the diagram appears on the main presenter screen. Participants viewing on their devices see the same visual in a read-only format — there is no response required from the audience on a Diagram slide.

Use the **Zoom** controls on the presenter screen if your diagram is large. Click any node to highlight it and draw attention to a specific part of the diagram during your explanation.

## Tips for effective Diagram slides

- **Keep labels short.** Long node labels crowd the canvas. Use the slide notes to hold supporting detail.
- **Use one diagram type per concept.** Mixing a flowchart structure with mind-map branching in the same slide makes the visual hard to read.
- **Preview before presenting.** Click **Preview** in the editor header to check how the diagram renders at full screen. What looks spaced out in the editor may be cramped when projected.
- **Update, don't screenshot.** Because the diagram is built in the editor, you can revise labels and connections between sessions — no need to re-export a static image.

## When to use a Diagram slide vs. a Content slide

| | Diagram slide | Content slide |
|---|---|---|
| Source | Built in AhaSlides editor | Static image upload |
| Editable in editor | Yes | No (re-upload to change) |
| Best for | Relationships, hierarchy, process | Photo, screenshot, infographic |
| Participant interaction | None (display only) | None (display only) |

---

> **Note:** This article reflects the GitBook version of this guide. The canonical Zoho Help Center article may differ — port any significant changes there separately.

---

## Open questions for Chau to confirm before publishing

The following product details are **unconfirmed** and were left deliberately vague or omitted from this draft:

1. **Diagram subtypes available** — Which diagram layouts does the Diagram slide actually support? (Flowchart, mind map, org chart, other?) What are their exact names in the UI?
2. **Plan gating** — Is the Diagram slide available on all plans (Free, Essential, Pro, Enterprise), or only paid plans?
3. **MCP slide_type string** — What is the `slide_type` value to use in `create_slides()` for a Diagram slide? (e.g., `"diagram"`) — needed for the `mcp_actions` frontmatter.
4. **Exact UI labels** — The steps above use assumed label names ("Your question" field, "Add" button, connector handle). Please verify these match the actual editor UI.
5. **Audience interaction** — Is the Diagram slide display-only, or can participants interact with it in any way (e.g., annotate, vote on nodes)?
6. **Zoho article ID** — Once confirmed, this draft needs a Zoho article ID in the frontmatter before it can be published.
