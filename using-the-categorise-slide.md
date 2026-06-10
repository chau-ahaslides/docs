---
id: 570272000069894001
title: Using the Categorise Slide
status: Published
permalink: using-the-categorise-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-10
tags: ["quiz", "categorise", "ahaslides"]
keywords: []
summary: The Categorise slide is a quiz type where participants sort items into predefined categories on their phones — results update live on your screen. Great for knowledge checks, training, and classroom activities.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000069894001
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-categorise-slide
related_articles: []
mcp_actions:
  create: 'create_slides(slide_type: "categorise_quiz", heading: "...", options: [{name, items[]}])'
  configure: 'update_slide_properties_tool(type: "categoriseQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)'
  delete: 'update_slide_properties_tool(type: "categoriseQuizQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "The Categorise slide is a quiz type where participants sort items into predefined categories on their phones — results update live on your screen. Great for knowledge checks, training, and classroom activities."
---

# Using the Categorise Slide

The Categorise slide turns sorting into a live quiz. Participants drag items into the right category buckets on their phones while results appear on your presenter screen in real time — no clickers, no paper, no chaos.

{% embed url="https://www.youtube.com/watch?v=u3DI1qbg4aE" %}
How to create a Categorise quiz slide on AhaSlides — quick tutorial (1:06)
{% endembed %}

## How the Categorise slide works

When you present a Categorise slide, participants see a list of shuffled items on their devices. They drag each item into the category they think it belongs in. The more items they get right — and the faster they answer — the more points they earn.

On your presenter screen, you'll see the category columns with items populating in real time as responses come in.

## Setting up your Categorise slide

### 1. Add the slide

In the editor, click **New slide** (top-left) and select **Categorise** from the Quiz section of the slide type picker.

### 2. Write your question

Click into the **Your question** field in the Content panel and type the challenge you want participants to tackle. Keep it specific — they need to know exactly what they're sorting.

### 3. Add items to sort

In the **Category & options** section, enter all the items participants will sort into the shared **"Enter options, separated by commas"** field at the top. AhaSlides splits them automatically and lists them as draggable items on the participant screen.

### 4. Name your categories

Each category block (A, B, C…) has its own **"Enter category name"** field. Fill in a name for each bucket. You can add up to 8 categories by clicking **+ Add Category** at the bottom of the category list.

You can also add category-specific items by typing into the **"Enter options, separated by commas"** field inside each individual category — those items will be pre-assigned to that category as correct answers.

### 5. Adjust settings

Scroll down in the Content panel to configure scoring and timing:

- **Points** — Set the **Max** and **Min** points for this question. All correct answers receive the maximum unless "Faster answers get more points" is enabled.
- **Faster answers get more points** — Toggle this on to reward speed. For example, with 45 seconds on the clock and a max of 1,000 points, answering with 30 seconds remaining earns more than answering in the final seconds.
- **Partial scoring** — Toggle this on to award points for each correctly sorted item, even if the participant doesn't get them all right.
- **Time limit** — Set how many seconds participants have to answer. The default is 45 seconds.
- **Leaderboard** — Toggle this on to show a leaderboard slide automatically after the Categorise slide.

## Previewing and presenting

Click **Preview** in the top header to rehearse the slide before going live — no participants needed. You'll see both the presenter view (category columns) and the participant view (draggable items on a phone screen).

When you're ready, click **Present**. Participants join at the access code shown on screen, and their sorted items appear live in your category columns.

## Audience experience

On the participant screen, items appear shuffled in a list. Participants tap and drag each item into the category column they think is correct. Once they've placed all items, they submit — or the timer runs out.

By using Categorise slides, you can turn any sorting task — from scientific classification to sales objection handling — into an engaging live activity that keeps your audience actively thinking, not passively watching.

> **Note:** This article reflects the GitBook version of this guide. The canonical Zoho Help Center article may differ — port any significant changes there separately.
