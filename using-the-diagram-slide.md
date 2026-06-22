---
title: Using the Diagram Slide
status: Draft
permalink: using-the-diagram-slide
category: Using Slide Types on AhaSlides
permission: ALL
last_updated: 2026-06-15
tags: ["diagram", "visual", "flowchart", "chart", "hierarchy", "ahaslides"]
keywords: ["diagram", "flowchart", "visual", "chart", "flow diagram", "network diagram", "hierarchy", "timeline", "SWOT", "word cloud"]
summary: The Diagram slide lets you build and display structured visual diagrams — flowcharts, hierarchies, charts, timelines, comparisons, and more — directly in your AhaSlides presentation, with no image uploads required.
plan_required: All
related_articles: ["using-the-content-slide"]
mcp_actions:
  note: "The Diagram slide is not currently supported by the AhaSlides MCP create_slides() tool. Add diagram slides manually in the editor."
description: "The Diagram slide lets you build and display structured visual diagrams — flowcharts, hierarchies, charts, timelines, comparisons, and more — directly in your AhaSlides presentation, with no image uploads required."
---

# Using the Diagram Slide

The Diagram slide lets you build and display structured visual diagrams — flowcharts, hierarchies, charts, timelines, comparisons, and more — directly inside AhaSlides. Instead of pasting a static screenshot, you define your content in a structured form in the right panel, and the diagram renders automatically. No external tool is required, and you can update the content at any time before presenting.

## What the diagram slide is for

Use a Diagram slide any time you need to show relationships, processes, data, or structure rather than a list of words or a poll result. The slide supports seven diagram types covering a wide range of visual needs:

- **Process flows and network diagrams** — show how steps or systems connect.
- **Org charts and decision trees** — build hierarchies with nested levels.
- **Bar, column, line, pie, and donut charts** — display labeled numerical data.
- **Timelines, roadmaps, and pyramids** — lay out sequential or layered items.
- **Comparisons** — SWOT analyses, quadrants, binary comparisons.
- **Word clouds** — visualise terms sized by weight.
- **Custom infographics** — write raw AntV syntax for full control.

Unlike a Content slide with a static image, the Diagram slide is data-driven: you enter labels and values in the panel, and the visual updates live.

## Diagram types

When you add a Diagram slide, the right panel shows a **Diagram type** dropdown. There are seven types, each with its own variants and data fields.

### Relation

**Description:** Flow / network diagrams from nodes and edges.

You define **Nodes** (labelled boxes) and **Connections** between them (arrows from one node to another, with an optional edge label). Use this for flowcharts, process flows, system architectures, or any diagram where the links between items matter.

**Variants:** Flow (left → right), Flow (top → bottom), Flow LR (animated), Flow TB (animated), Circle (progress), Circle (icons), Network

### Hierarchy

**Description:** Tree with nested children.

You define a root node and nest children and grandchildren beneath it. Use this for org charts, decision trees, or any parent-child structure.

**Variants:** Radial tree, Tree (top → bottom), Tree (left → right), Tree (right → left), Tree (bottom → top), Tech-style tree

### Items

**Description:** Flat list or step sequence — pyramid, grid, timeline, roadmap, funnel.

You define a list of items, each with a label and an optional description. The variant controls how those items are arranged visually. Use this for step-by-step processes, sequential milestones, or any list where the visual layout carries meaning.

**Variants:** Pyramid, Horizontal arrows, Row (icon arrows), Vertical arrows, Grid, Grid (progress), Zigzag (down), Zigzag (up), Sector, Sector (half), Stairs, Timeline, Roadmap, Funnel, Circular, Steps, Snake steps, Pyramid (sequence)

### Chart

**Description:** Bar, column, line, pie, or donut from labeled values.

You define items with a **Label** and a numeric **Value**. Use this for showing data distributions, comparisons, or trends without leaving AhaSlides.

**Variants:** Bar, Column, Line, Pie, Donut

### Word Cloud

**Description:** Words sized by weight.

You define a list of words, each with a numeric **Weight** (minimum 1). Higher-weight words appear larger. Use this for static word clouds that illustrate theme importance — distinct from the interactive Word Cloud slide where participants submit live responses.

**Variants:** Standard

### Compare

**Description:** Side-by-side comparison — quadrant, binary, hierarchy.

You define groups of items (each group has a label and optional items with labels and descriptions). The default template starts you with a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). Use this for any structured side-by-side comparison.

**Variants:** Quadrant (cards), and additional binary and hierarchy variants

### Advanced

**Description:** Hand-write the AntV infographic syntax directly.

You type raw AntV Infographic markup in a text area. There is no Variant dropdown for this type. Use this when none of the structured types covers your use case and you need full control. A link to the AntV Infographic gallery is provided in the panel for syntax reference: [infographic.antv.vision/gallery](https://infographic.antv.vision/gallery)

## Setting up your diagram slide

### 1. Add the slide

In the editor, click **New slide** and select **Diagram** from the **Content** section of the slide type picker. The slide is labelled **New** in the picker.

### 2. Choose a diagram type

In the right panel, open the **Diagram type** dropdown and choose the type that fits your content. The canvas previews the diagram as you switch types.

### 3. Choose a variant

With the type selected, open the **Variant** dropdown to choose how the diagram is laid out visually. Visual previews appear in the dropdown to help you pick.

### 4. Fill in your content

Depending on the type, the panel shows different data fields:

- **Relation** — add nodes via the **Add node** button, then add connections via **Add connection**, selecting source and target nodes from dropdowns. Optionally add an edge label to each connection.
- **Hierarchy** — add child nodes under a root using the **+** button next to any node.
- **Items** — add items via **Add item**; each item has a label and an optional description.
- **Chart** — add data points via **Add slice**; each has a label and a numeric value.
- **Word cloud** — add words via **Add word**; each has a word and a weight (1 or higher).
- **Compare** — add groups via **Add group**, then add items within each group.
- **Advanced** — type your AntV infographic syntax directly into the text area.

### 5. Set streaming animation (optional)

Use the **Streaming animation** control to animate the diagram when the slide first appears during a presentation. Options: **Off** (default), **Slow**, **Medium**, **Fast**.

### 6. Add a title (optional)

Type a title in the **Title** field at the top of the right panel. You can also add a short **description** below the title field.

## Presenting the diagram slide

When you reach a Diagram slide during a presentation, the diagram fills the slide area on the presenter screen. Participants viewing on their devices see the same visual in a read-only format — there is no response or interaction required from the audience on a Diagram slide.

If streaming animation is enabled, the diagram animates in when the slide first appears. The **Improve** AI button in the editor toolbar is also available on Diagram slides to help refine content via the AI assistant.

## Tips for effective diagram slides

- **Start with the right type.** The Diagram type you choose determines the data model — switching types later resets the content, so pick the right one before filling in items.
- **Use Relation for connected flows; use Hierarchy for trees.** If items have a strict parent-child nesting with no cross-links, Hierarchy is simpler to manage. If items connect in multiple directions, use Relation.
- **Preview before presenting.** Click **Preview** in the editor header to check how the diagram renders at full screen.
- **Use animation sparingly.** Streaming animation works best on Relation and Hierarchy types to reveal connections step by step. On dense Charts or Word clouds, Off is usually cleaner.
- **Use the AI agent.** The AhaSlides AI agent can generate a Diagram slide from a natural-language description — describe the flow or structure you want and let AI build the initial data, then refine in the panel.

## When to use a diagram slide vs. a Content slide

| | Diagram slide | Content slide |
|---|---|---|
| Source | Data entered in the right panel | Static image upload |
| Editable in editor | Yes — change labels and values | No (re-upload to change) |
| Best for | Flows, trees, charts, timelines, SWOT | Photo, screenshot, infographic |
| Auto-layout | Yes — variant controls layout automatically | No |
| Participant interaction | None (display only) | None (display only) |

## AhaSlides MCP

The Diagram slide is not currently supported by the AhaSlides MCP `create_slides()` tool. Add Diagram slides manually in the editor.

## Remaining pre-publish steps

1. **Article ID** — assign a KB article ID in the frontmatter (`id:`) before publishing.
