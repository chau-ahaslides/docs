---
id: 570272000000638057
title: Moving and Editing Multiple Slides
status: Published
permalink: moving-and-editing-multiple-slides
category: Features and Functions on AhaSlides
category_id: 570272000074885546
permission: ALL
last_updated: 2026-02-19
tags: ["view", "move", "edit", "grid", "multiple", "multiple slides", "duplicating", "duplicate", "moving", "editing"]
keywords: ["edit", "multiple", "slides", "moving", "move", "editing", "duplicate", "duplicating", "grid", "view"]
summary: Learn how to move, edit and delete multiple slides at once, both with and without using Grid View.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000638057
portal_url: https://help.ahaslides.com/portal/en/kb/articles/moving-and-editing-multiple-slides
related_articles: []
mcp_actions:
  ```yaml
  move: "move_slide(slide_id: int, presentation_id: int, insert_after_slide_id: int)"
  delete: "update_slide_properties_tool(slides: [{id, type, deleted: true}])"
  skip: "skip_slide_when_presenting(slide_id: int, skip_when_presenting: bool)"
  ```
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
---

You can edit the design and embedded audio of multiple slides at the same time, either with or without Grid View.

## Editing Slides without Grid View

To quickly edit multiple slides, you can simply use the navigation column on the left-side of your editor.

1. Hold **CTRL + click** on each slide to select it.
2. Hold **SHIFT + click** to select a range of slides from A to B.

![](https://help.ahaslides.com/galleryDocuments/edbsnf71993aa5f3926485dee48499670f2372d19e601e676da086a8569a1366d536be1c481cd5918938bfe3aecbe216f0c6c?inline=true)

## What is Grid View?

Opening the Grid View on the editor will let you preview all the slides in your presentation in a grid. For presentations with many slides, this is the best way to rearrange, delete and edit multiple slides.

## Editing Slides with Grid View

### 1. Opening Grid View

To open Grid View in the AhaSlides editor, click on **Grid View** at the bottom of the left-hand panel:

![](https://help.ahaslides.com/galleryDocuments/edbsn4c5dc949d499871dcf35fe69ddf50d3eaac5fa25837e486a67d51efee848903ab83720093a3ba013b2f4500a0f7df2ce?inline=true)

From here, you can close the grid view by clicking 'Close' in the right corner of the bottom panel.

![](https://help.ahaslides.com/galleryDocuments/edbsn60d7fb21497f32ecf1716fa98b8c2b342d2f23da48a48db04273d56bb6dd3d19fed8d969c21806049aa57c1eacd02f83?inline=true)

### 2. Selecting Multiple Slides

To select multiple slides at once, click the **'Select' button** in the top panel. Click the slides that you want to select, then click the **'Done' button** when finished.

![](https://help.ahaslides.com/galleryDocuments/edbsn4dc8722fed4ea86b008745e3ae8a86363e66901dc652f6fa28af1be433277323b04bd60a24d2662c9845e5296cbbefbe?inline=true)

⌨️ **Keyboard Shortcuts:**
– Hold **CTRL + click** on each slide to select it.
– Hold **SHIFT + click** to select a range of slides from A to B.

### 3. Editing Multiple Slides

Grid view allows you to edit the **backgrounds** and **audio** of multiple slides at the same time. To do this, select the slides you wish to edit and come to the right-hand panel:

- Under the **'Design'** tab, you can change text colour, base colour, background image and background visibility.
- Under the **'Audio'** tab, you can add an audio track and edit the playback settings of that track.

![](https://help.ahaslides.com/galleryDocuments/edbsn60d7fb21497f32ecf1716fa98b8c2b347e047f0da4496ad0186f5b18ec022482a7c5abe20122164d3c93e87345622bef?inline=true)

### 4. Moving Individual or Multiple Slides

On grid view, you can drag-and-drop one or more slides to a different position in your presentation.

- To move an **individual slide**, simply select it, then drag-and-drop it to your desired position.
- To move **multiple slides**, select the slides you want to move, then drag-and-drop them to your desired position. Click the 'Done' button when finished.

![](https://help.ahaslides.com/galleryDocuments/edbsnc85faca7a09b07c492eb4473564523f06ab0ce9fc67090d585b8dee8ac72b04fc3074ecfd1e643d00dc904a998ee7c66?inline=true)

You can also use the **'Rearrange' button** in the bottom panel to move one or more slides. Just select the slides you want to move, click the 'Rearrange' button and select what slide position you want to move your selected slides to:

![](https://help.ahaslides.com/galleryDocuments/edbsn3ba2f690e033e34423f2741b3602426448818d6911838f7d048740494cceb37d234e8781987502699b1d0eb53b942214?inline=true)

### 5. Duplicating Multiple Slides

To duplicate multiple slides at once, select the slides you want to duplicate and click the **'Duplicate' button** in the bottom panel:

![](https://help.ahaslides.com/galleryDocuments/edbsn47a344667244ccbd60c024561bebc609a61e8a00b45136db54fd33fcbfa10b3be940980500900946f31eca663f81b4a8?inline=true)

### 6. Copying Multiple Slides to Other Presentations

To copy multiple slides to another presentation, select the slides you want to copy and click the **'Copy to…' button** in the bottom panel. Then, select the presentation to which you want to copy those slides, as well as their new slide position in that presentation:

![](https://help.ahaslides.com/galleryDocuments/edbsn7beafea3df963c23476f703841d044e0d1ff8c0c9e0547cb65f3e833ad975ecc546fad86242c9017c4dc954594c0dd77?inline=true)

> **Protip:** This is a great way to merge two presentations into one. To do this, you can create a new presentation and use the **'Copy to…' button** to copy the slides you want from your two existing presentations into your new presentation!

### 7. Clearing Audience Response Data on Multiple Slides

To erase any response data from your audience across multiple slides, select the slides on which you want to erase the audience responses, then click the **'Clear result'** in the panel.

![](https://help.ahaslides.com/galleryDocuments/edbsn5db408e6ab3bcb1c24e8637100747f627dbd5993879eb31638a47ab37a392bf40a55b73f88eede90048b1819eb68eab3?inline=true)

### 8. Deleting Multiple Slides

To delete multiple slides at the same time, click the **'Select' button**, select the slides you want to delete, and click **'Done'**. Then, click the **'Delete' button** in the panel.

![](https://help.ahaslides.com/galleryDocuments/edbsnc85faca7a09b07c492eb4473564523f020a813a2f8ed4e55f83785ee4551287f583e8effd94d4b8cec24fdf7818e14f8?inline=true)
