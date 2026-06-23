---
id: 570272000000638057
title: "Moving and editing multiple slides"
status: Published
permalink: moving-and-editing-multiple-slides
category: "Features and functions"
category_id: 570272000074885546
permission: ALL
plan_required: All
last_updated: 2026-06-22
tags:
  - multiple slides
  - grid view
  - move slides
  - duplicate slides
  - edit slides
  - rearrange slides
keywords: []
summary: "You can move, edit, duplicate, and delete multiple slides at once, either from the navigation column or in Grid View."
description: "How to select and work with multiple slides at once on AhaSlides, with and without Grid View: move, rearrange, edit backgrounds and audio, duplicate, copy to other presentations, clear results, and delete."
questions_answered:
  - "How do I select multiple slides at once in AhaSlides?"
  - "How do I move several slides to a new position?"
  - "What is Grid View and how do I open it?"
  - "How do I edit the background or audio of multiple slides at once?"
  - "How do I duplicate or copy multiple slides?"
  - "How do I delete multiple slides at the same time?"
user_intents:
  - "Reorder, edit, or delete several slides in one action"
  - "Copy or duplicate multiple slides, including across presentations"
related: []
mcp_actions:
  move: "move_slide(slide_id: int, presentation_id: int, insert_after_slide_id: int)"
  delete: "update_slide_properties_tool(slides: [{id, type, deleted: true}])"
  skip: "skip_slide_when_presenting(slide_id: int, skip_when_presenting: bool)"
portal_url: https://help.ahaslides.com/portal/en/kb/articles/moving-and-editing-multiple-slides
zoho_id: "570272000000638057"
---

# Moving and editing multiple slides

You can move, edit, duplicate, and delete multiple slides at once, either from the navigation column or in Grid View.

## Editing slides without grid view

To quickly select multiple slides, use the navigation column on the left of the editor.

- Hold **CTRL** and click each slide to select it.
- Hold **SHIFT** and click to select a range of slides from one point to another.

## What is grid view?

Grid View shows all the slides in your presentation in a grid, so you can preview the whole presentation at once. For presentations with many slides, Grid View is the easiest way to rearrange, delete, and edit multiple slides.

## Editing slides with grid view

### Opening grid view

To open Grid View, click **Grid View** at the bottom of the left-hand panel. To close it, click **Close** in the right corner of the bottom panel.

### Selecting multiple slides

To select multiple slides, click the **Select** button in the top panel, click the slides you want, then click **Done** when finished.

You can also use keyboard shortcuts: hold **CTRL** and click each slide to select it, or hold **SHIFT** and click to select a range of slides.

### Editing multiple slides

Grid View lets you edit the backgrounds and audio of multiple slides at the same time. Select the slides you want to edit, then use the right-hand panel:

- Under the **Design** tab, you can change text colour, base colour, background image, and background visibility.
- Under the **Audio** tab, you can add an audio track and edit its playback settings.

### Moving individual or multiple slides

In Grid View, you can drag and drop one or more slides to a different position.

- To move a single slide, select it and drag it to your desired position.
- To move multiple slides, select the slides, drag them to your desired position, then click **Done** when finished.

You can also use the **Rearrange** button in the bottom panel. Select the slides you want to move, click **Rearrange**, then select the position you want to move them to.

### Duplicating multiple slides

To duplicate multiple slides at once, select the slides you want and click the **Duplicate** button in the bottom panel.

### Copying multiple slides to other presentations

To copy slides to another presentation, select the slides and click the **Copy to** button in the bottom panel. Then select the destination presentation and the position for the copied slides within it.

{% hint style="info" %}
This is a quick way to merge two presentations into one. Create a new presentation, then use the **Copy to** button to copy the slides you want from each existing presentation into it.
{% endhint %}

### Clearing audience response data on multiple slides

To erase audience response data across multiple slides, select the slides, then click **Clear result** in the panel.

### Deleting multiple slides

To delete multiple slides at once, click the **Select** button, select the slides you want to delete, and click **Done**. Then click the **Delete** button in the panel.

## Frequently asked questions

### How do I select multiple slides at once in AhaSlides?

In the navigation column or in Grid View, hold **CTRL** and click each slide, or hold **SHIFT** and click to select a range. In Grid View you can also click the **Select** button, click the slides, then click **Done**.

### What is Grid View and how do I open it?

Grid View shows all your slides in a grid so you can preview the whole presentation at once, which makes rearranging, deleting, and editing many slides easier. Open it by clicking **Grid View** at the bottom of the left-hand panel.

### How do I edit the background or audio of multiple slides at once?

In Grid View, select the slides, then use the right-hand panel. The **Design** tab edits text colour, base colour, background image, and background visibility, and the **Audio** tab adds a track and edits its playback settings.

### How do I duplicate or copy multiple slides?

Select the slides in Grid View, then click **Duplicate** in the bottom panel. To copy them into another presentation, click **Copy to**, then choose the destination presentation and position.

### How do I delete multiple slides at the same time?

Click the **Select** button, select the slides you want to delete, click **Done**, then click the **Delete** button in the panel.

*Last updated: 2026-06-23*
