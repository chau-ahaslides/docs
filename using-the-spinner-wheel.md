---
id: 570272000000696049
title: Using the Spinner Wheel
status: Published
permalink: using-the-spinner-wheel
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-05-11
tags: ["random", "wheel", "spin", "lucky wheel", "ahaslides", "spinner wheel", "bulk", "spinner"]
keywords: ["spinner wheel", "random wheel", "wheel picker", "spin picker", "random spin", "ahaslides help"]
summary: Learn how to use the AhaSlides spinner wheel in your presentations. The spinner wheel is a slide type that lets a presenter pick any entry at random by spinning the wheel.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000696049
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-spinner-wheel
related_articles: ["how-to-make-and-run-a-quiz", "making-a-live-word-cloud"]
mcp_actions:
  create: 'create_slides(slide_type: "spinner_wheel", heading: "...", options: [{text}], max: 50)'
  configure: 'update_slide_properties_tool(type: "spinnerWheelQuestion", metadata.spinningDuration: int max 1200, metadata.autoFillParticipantName: bool)'
  delete: 'update_slide_properties_tool(type: "spinnerWheelQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "Learn how to use the AhaSlides spinner wheel in your presentations. The spinner wheel is a slide type that lets a presenter pick any entry at random by spinning the wheel."
---

# Using the Spinner Wheel

## What is the Spinner Wheel?

The spinner wheel is a slide type that a presenter can use to pick any entry at random. The presenter simply fills the wheel with entries and then presses the 'play' button. The wheel will spin and will slow down to the point where it stops on one entry.

> **Note:**
> Only the **Presenter side** can spin the wheel.
> Spin results **will not** be saved in the Excel export file.
> The Spinner Wheel supports up to **5,000 entries**.

Check out this video for a 1-minute explainer on how to make a spinner wheel

> 📹 [Watch video](https://www.youtube.com/embed/TD_CAk24I2Y)

Below is an interactive demo, which will help you experience this function:

> 📹 [Watch video](https://capture.navattic.com/cmn2ziwx0000b04jq4aks31wa)

## Adding Entries to the Wheel

There are **2 ways** you can fill up your wheel with entries of your choice...

### #1 - Add Entries

You can add entries to the spinner wheel by writing directly on the slide in the centre column of the editor.

Click the box under '**Entries**' to add any entry. You can type in an entry and hit **⏎ Enter** on your keyboard to type in another, or paste a list that you have copied to your clipboard. Then click '**Save**' button.

![](https://help.ahaslides.com/galleryDocuments/edbsn60f0a419a47a9984f3fbc85f7ce2addca47ce160e15b74110249750b266225238531790265d0f39293a9c094ddc31f5d?inline=true)

> **Protip 💡** You can also add entries to your spinner wheel **while presenting in presentation mode**. There's no need to return to the editor.

### #2 - Autofill Entries with Participants' Names

You may want to use the spinner wheel to select your presentation's participants at random. If that's the case, you can autofill these entries to the wheel by getting each participant to enter their own name.

To do this, check the box labeled '**Participant name autofill**' on the right-panel of the editor

![](https://help.ahaslides.com/galleryDocuments/edbsnb9b6c21808edc32d48cdd809c3290ca467a4bee4c7044c217228972436a756b0c4a3891174e7e9176604aeccf951d0d5?inline=true)

You can also turn on this option while on presenting mode

![](https://help.ahaslides.com/galleryDocuments/edbsn51291605759cff985f795bddf2d195c6d417311f6e782898a0cccffed97fd4cba46f20bb42bd19f78b8b5fff9507a327?inline=true)

With this box checked, when participants reach this slide, they will be prompted for their names and an avatar, the same way they are when they are [joining a quiz](how-to-make-and-run-a-quiz.md).

If you had any **quiz slide** before your spinner wheel slide, then checking the *Participant name autofill* box will automatically fill in the names of your quiz players - they won't need to write them again.

> **Protip**
> With a quick workaround, participants can put entries into the wheel themselves.
>
> To set this up, create a [word cloud](using-the-word-cloud-slide.md) slide and get your participants to submit their wheel entries into the cloud. Next, change the slide type from word cloud to spinner wheel; every submission from the word cloud will be automatically uploaded as entries in the wheel.
>
> ![](https://help.ahaslides.com/galleryDocuments/edbsn49101f674da1e52389ead3b1c23a119aec9a66ef05516a16c52285fd56d96bf227ee7aab8ec9f162aba5da9f05cc5a1f?inline=true)

## How to manually Remove Entries

To remove a manual entry from the wheel, hover over the entry in the entry list and press the **bin icon** labelled *'Delete this entry'.*

![](https://help.ahaslides.com/galleryDocuments/edbsn48308c4bdac0adedf0a2a5935b9f6d330ba4581a0a8e4bf1b41cfea3389e2c2afffbcc0ff3168e44405fc32ad4e13a73?inline=true)

## Settings

On the right-panel of the editor, there are several settings for your spinner wheel.

1. **Spin time** - The length of time the wheel will spin for before arriving on a winning entry.
1. **Duplicate entries** - Multiply the entries already in your wheel by up to 10 times. Uncheck the box to clear.
1. **Filter profanity** - Hide inappropriate words submitted by the audience on all slides
1. **Hide entry board** - Removes the list of entries from the wheel when the presenter is presenting.

## Spinning the Wheel

With all your desired entries in the wheel, simply press the button at the centre of the wheel to spin it. The chosen entry will be displayed on presenter and audience devices.

![](https://help.ahaslides.com/galleryDocuments/edbsn524906e8c54b4d7c0ad30197519136c4d06adfbb7a749763fd9020ea3110e741fec6c07c69d33c5b8f909829be376b26?inline=true)
