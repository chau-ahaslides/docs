---
id: 570272000000638099
title: Using the Match Pairs Slide
status: Published
permalink: using-the-match-pairs-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2025-10-03
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

### How does a Match Pairs Slide Work?

In a Match Pairs slide, players are presented with a question, as well as two columns of words. In the left-side column are **prompts**, marked by numbers *(1, 2, 3, 4)* and in the right-side column are **answers**, marked by letters *(A, B, C, D).*

Players have the time limit you give them in order to match each prompt with the answer that it goes with. Players have to match ALL the prompts and answers correctly to get the points.

### Setting up your Match Pairs slide:

On the AhaSlides editor, choose the Match Pairs slide and do the following...

1. Write your question or instructions in the box labelled '**Your question**'
2. Under '**Pairs**', write up to 4 prompts and the answers they match with. Once written, the answer column will automatically shuffle itself on the presentation canvas.

2.1. Alternatively, you can also upload images to your prompt.

3. Select your **other settings**:

- - **Points**: The maximum and the minimum number of points it is possible to get on that question. If the *'Faster answers get more points'* box is unchecked, then any correct answer will receive the maximum number of points.
  - **Faster answers get more points**: Check this box to encourage players to answer quicker. For example, if the *time* is set at 100 seconds and the *points* is set to 100 maximum and 0 minimum, then a player submitting their answer with 80 seconds left will receive 80 points.
  - **Partial scoring**: If this box is checked, players will be rewarded for the amount of pairs they correctly match, even if they don't correctly match each pair. For example, if a player matches one out of four questions correct, they will receive 25% of the points.
  - **Time limit**: The time limit for that question in seconds.

For more help, learn [how to make and run a quiz](how-to-make-and-run-a-quiz.md).
