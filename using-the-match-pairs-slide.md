---
id: 570272000000638099
title: Using the Match Pairs Slide
status: Published
permalink: using-the-match-pairs-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-15
tags: ["quiz", "image", "images", "match", "match pairs", "prompt", "pairs", "connect", "matching"]
keywords: ["match", "pairs", "matching", "prompt", "answer", "connect", "quiz", "partial"]
summary: Learn how to use the Match Pairs slide type in an AhaSlides quiz. The Match Pairs slide is a quiz slide type where players must match a set of prompts with a set of answers.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000638099
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-match-pairs-slide
related_articles: ["how-to-make-and-run-a-quiz"]
mcp_actions:
  create: "create_slides(slide_type: \"match_pairs_quiz\", heading: \"...\", pairs: [{left_item, right_item}], max: 4)"
  configure: "update_slide_properties_tool(type: \"matchPairsQuizQuestion\", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)"
  delete: "update_slide_properties_tool(type: \"matchPairsQuizQuestion\", deleted: true)"
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "Learn how to use the Match Pairs slide type in an AhaSlides quiz. The Match Pairs slide is a quiz slide type where players must match a set of prompts with a set of answers."
---

# Using the Match Pairs Slide

The Match Pairs slide is a quiz slide type where players must match a set of prompts with a set of answers.

{% embed url="https://www.youtube.com/watch?v=AmB2UZvlvEg" %}
How to use the Match Pairs slide on AhaSlides
{% endembed %}

### How does a Match Pairs Slide Work?

In a Match Pairs slide, players are presented with a question, as well as two columns of words. In the left-side column are **prompts**, marked by numbers *(1, 2, 3, 4)* and in the right-side column are **answers**, marked by letters *(A, B, C, D).*

Players have the time limit you give them in order to match each prompt with the answer that it goes with. Players have to match ALL the prompts and answers correctly to get the points.

### Setting up your Match Pairs slide

In the AhaSlides editor, add a Match Pairs slide and do the following:

1. Write your question or instructions in the **Your question** field.
2. Under **Pairs**, type up to 4 prompts and the answers they match with. The answer column shuffles automatically on the canvas — so participants can't just copy the order.
   - You can also upload an image in place of text for any prompt or answer using the image icon next to the field.
3. Adjust the settings below the pairs:
   - **Points**: Set the maximum and minimum points for the question. If **Faster answers get more points** is off, any correct answer earns the maximum.
   - **Faster answers get more points**: Rewards speed — a player with 80 seconds left on a 100-second timer earns 80 out of 100 points.
   - **Partial scoring**: Rewards each correctly matched pair individually, even if the player doesn't match them all. For example, 1 out of 4 correct = 25% of points.
   - **Time limit**: How many seconds participants have to match all pairs.

For more help, learn [how to make and run a quiz](how-to-make-and-run-a-quiz.md).
