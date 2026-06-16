---
id: 570272000000696049
title: Using the Spinner Wheel
status: Published
permalink: using-the-spinner-wheel
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-16
tags: ["random", "wheel", "spin", "lucky wheel", "ahaslides", "spinner wheel", "bulk", "spinner"]
keywords: ["spinner wheel", "random wheel", "wheel picker", "spin picker", "random spin", "ahaslides help"]
summary: Learn how to use the AhaSlides Spinner Wheel in your presentations. The Spinner Wheel is a slide type that lets a presenter pick any entry at random by spinning the wheel.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000696049
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-spinner-wheel
related_articles: ["how-to-make-and-run-a-quiz", "making-a-live-word-cloud"]
mcp_actions:
  create: 'create_slides(slide_type: "spinner_wheel", heading: "...", options: [{text}], max: 50)'
  configure: 'update_slide_properties_tool(type: "spinnerWheelQuestion", metadata.spinningDuration: int max 1200, metadata.autoFillParticipantName: bool)'
  delete: 'update_slide_properties_tool(type: "spinnerWheelQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "Learn how to use the AhaSlides Spinner Wheel in your presentations. The Spinner Wheel is a slide type that lets a presenter pick any entry at random by spinning the wheel."
---

# Using the Spinner Wheel

## What is the Spinner Wheel?

The Spinner Wheel is a slide type that a presenter can use to pick any entry at random. Fill the wheel with entries and press the button at the centre — the wheel spins and slows down to land on one entry.

> **Note:**
> Only the **Presenter side** can spin the wheel.
> Spin results **will not** be saved in the Excel export file.
> The Spinner Wheel supports up to **5,000 entries**.

Watch this quick tutorial to see the Spinner Wheel in action:

{% embed url="https://www.youtube.com/watch?v=7bbzdJ9hx6g" %}
How to use the Spinner Wheel on AhaSlides — including audience autofill
{% endembed %}

Below is an interactive demo, which will help you experience this function:

> 📹 [Watch video](https://capture.navattic.com/cmn2ziwx0000b04jq4aks31wa)

## Adding entries to the wheel

There are **2 ways** you can fill up your wheel with entries of your choice.

### #1 - Add entries

You can add entries to the Spinner Wheel by typing them in the **Entries** field on the right panel of the editor.

Click the **Entries** field and type your first entry. Hit **⏎ Enter** after each one to add the next, or paste a list you have copied to your clipboard all at once. Then click the **Save** button.

> **Protip** You can also add entries to your Spinner Wheel **while presenting in presentation mode**. There's no need to return to the editor.

### #2 - Autofill entries with participants' names

You may want to use the Spinner Wheel to select one of your presentation's participants at random. If that's the case, check the box labelled **Participant name autofill** in the right panel of the editor — the wheel fills itself with every participant's name as they scan your QR code and join by entering their name. No manual typing needed.

You can also turn on this option while in presentation mode.

With this box checked, participants scan the QR code shown on your presenter screen (or go to the join URL) and enter their name and an avatar to join — the same way they join a quiz. See [how participants join](how-to-make-and-run-a-quiz.md) for the full joining flow.

If you had any quiz slide before your Spinner Wheel slide, then checking the **Participant name autofill** box will automatically fill in the names of your quiz players — they won't need to enter them again.

> **Protip**
> With a quick workaround, participants can put entries into the wheel themselves.
>
> Create a [Word Cloud](using-the-word-cloud-slide.md) slide and get your participants to submit their wheel entries into the cloud. Then change the slide type from Word Cloud to Spinner Wheel — every submission from the Word Cloud is automatically uploaded as an entry in the wheel.

## How to remove entries

To remove a manual entry from the wheel, hover over the entry in the entry list and press the **bin icon** labelled *'Delete this entry'.*

## Settings

In the right panel of the editor, there are several settings for your Spinner Wheel.

1. **Spin time** — The length of time the wheel will spin before arriving on a winning entry. Set up to 1,200 seconds for maximum suspense.
1. **Duplicate entries** — Multiply the entries already in your wheel by up to 10 times. Uncheck the box to clear.
1. **Filter profanity** — Hide inappropriate words submitted by the audience on all slides.
1. **Hide entry board** — Removes the list of entries from the wheel when the presenter is presenting.

## Spinning the wheel

With all your desired entries in the wheel, press the button at the centre of the wheel to spin it. The chosen entry is displayed on both the presenter and audience devices.

