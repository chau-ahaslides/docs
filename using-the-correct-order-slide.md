---
id: 570272000000638001
title: Using the Correct Order Slide
status: Published
permalink: using-the-correct-order-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-15
tags: ["quiz", "sequence", "correct", "statement", "ahaslides", "correct order"]
keywords: ["correct", "order", "arrange", "list", "timeline", "sequence", "quiz", "statement", "rank"]
summary: Learn how to use the Correct Order slide in an AhaSlides quiz. The Correct Order quiz slide asks participants to place randomized statements in the correct order.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000638001
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-correct-order-slide
related_articles: ["how-to-make-and-run-a-quiz"]
mcp_actions:
  create: "create_slides(slide_type: \"correct_order_quiz\", heading: \"...\", options: [{position, text}], max: 7)"
  configure: "update_slide_properties_tool(type: \"correctOrderQuizQuestion\", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)"
  delete: "update_slide_properties_tool(type: \"correctOrderQuizQuestion\", deleted: true)"
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "Learn how to use the Correct Order slide in an AhaSlides quiz. The Correct Order quiz slide asks participants to place randomized statements in the correct order."
---

# Using the Correct Order Slide

The Correct Order quiz slide asks participants to place randomized statements in the correct order.

{% embed url="https://www.youtube.com/watch?v=K5YPdRXDscU" %}
How to set up a Correct Order slide on AhaSlides — full walkthrough in under a minute.
{% endembed %}

## How does a Correct Order Slide work?

A Correct Order slide is a quiz slide type and forms part of a [quiz](how-to-make-and-run-a-quiz.md).

On a Correct Order slide, players are presented with a question and a row of shuffled statements. Players have the time limit you set to drag and drop the statements into the correct order, then press the *Submit* button when finished.

> 💡 No partial scoring
>
> Players need to get every statement in the correct order to score points. Even one misplaced statement results in 0 points.

## Setting up your Correct Order Slide

In the AhaSlides editor, select the Correct Order slide from the *Quiz* section of the slide type picker, then do the following:

1. Type your question or instructions in the **Your question** field.
2. Under **Statements**, enter up to 7 statements in the correct order. AhaSlides automatically shuffles them for participants on the presentation canvas.
3. Scroll down to configure the settings:
   - **Points** — Set the maximum and minimum points for the question. With *Faster answers get more points* toggled on (the default), players who answer sooner earn more points within the max–min range.
   - **Time to answer** — The time limit in seconds. Defaults to 45 seconds; adjust it to suit your question.

> 💡 For more help on quizzes, learn [how to make and run a quiz](how-to-make-and-run-a-quiz.md).

## How to create a good Correct Order slide

- **Keep the list to 5 items max** — fewer items = less cognitive load and easier to drag on mobile.
- **Make each item distinct** — avoid items that could plausibly swap positions.
- **Use a clear, unambiguous question** — e.g. "Put these steps in the correct order."
- **Choose a logical sequence type** — chronological events, process steps, or ranked priorities work best.
- **Keep item text concise** — short phrases (3–7 words) are easier to read and drag.
- **Avoid numbering items** — don't write "Step 1: …" in the text, as it gives the answer away.
