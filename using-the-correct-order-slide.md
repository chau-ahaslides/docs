---
id: 570272000000638001
title: Using the Correct Order Slide
status: Published
permalink: using-the-correct-order-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-04-13
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

## How does a Correct Order Slide work?

A Correct Order slide is a quiz slide type and forms part of a [quiz](how-to-make-and-run-a-quiz.md).

On a Correct Order slide, players are presented with a question, as well as a column of statements. Players have the time limit you give them in order to arrange all statements in the correct order.

On the player's screen, they can drag and drop each statement into the correct order and press the *submit* button when finished.

> 💡 No 'partial scoring'
>
> At present, players need to get every statement in the correct order to score points. Even one misplaced statement will result in 0 points.

## Setting up your Correct Order Slide:

On the AhaSlides editor, choose the Correct Order slide from the *'Quiz and games'* section and do the following...

1. Write your question or the instructions in the box labelled '**Your question**'.
2. Enter up to 7 statements in the correct order. Once written, they will be placed in random order on the presentation canvas.

3. Change the settings:
   - **Time to answer**: The time limit for that question in seconds. The time limit for the Correct Order slide will auto set for 45 seconds, but you can change it to fit your questions.
   - **Reward points**: The maximum and the minimum number of points it is possible to get on that question. If the *'Faster answers get more points'* box is unchecked, then any correct answer will receive the maximum number of points.
   - **Faster answers get more points**: Check this box to encourage players to answer quicker. For example, if the *'time to answer'* is 100 seconds and the *'reward points'* is set to 100 maximum and 0 minimum, then a player submitting their answer with 80 seconds left will receive 80 points.

> 💡 For more help on quizzes, learn [how to make and run a quiz](how-to-make-and-run-a-quiz.md).
