---
id: 570272000000638099
title: Using the Match Pairs Slide
status: Published
permalink: using-the-match-pairs-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-18
tags: ["quiz", "image", "images", "match", "match pairs", "prompt", "pairs", "connect", "matching"]
keywords: ["match", "pairs", "matching", "prompt", "answer", "connect", "quiz", "partial"]
summary: Learn how to use the Match Pairs slide type in an AhaSlides quiz. The Match Pairs slide is a quiz slide type where players must match a set of prompts with a set of answers.
plan_required: All
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-match-pairs-slide
related_articles: ["how-to-make-and-run-a-quiz"]
mcp_actions:
  create: "create_slides(slide_type: \"match_pairs_quiz\", heading: \"...\", pairs: [{left_item, right_item}], max: 4)"
  configure: "update_slide_properties_tool(type: \"matchPairsQuizQuestion\", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)"
  delete: "update_slide_properties_tool(type: \"matchPairsQuizQuestion\", deleted: true)"
description: "Learn how to use the Match Pairs slide type in an AhaSlides quiz. The Match Pairs slide is a quiz slide type where players must match a set of prompts with a set of answers."
---

# Using the Match Pairs Slide

The Match Pairs slide is a quiz slide type where players must match a set of prompts with a set of answers.

### How does a Match Pairs slide work?

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

### Watch the tutorial

{% embed url="https://www.youtube.com/watch?v=W3Diw_84Rj0" %}
How to use the Match Pairs slide on AhaSlides
{% endembed %}

## Tips for creating a good Match Pairs slide

- **Keep pairs clear and unambiguous.** Each left-side item should have exactly one correct match on the right. Avoid answers that could plausibly fit multiple items.
- **Aim for 3–4 pairs.** Enough to be engaging without taking too long or crowding a small mobile screen.
- **Balance difficulty.** Mix one or two obvious pairs with a few trickier ones to keep everyone engaged regardless of knowledge level.
- **Use parallel structure.** If the left column uses terms, the right column should use definitions (or images, or examples) consistently. Mixing formats confuses the pattern.
- **Keep text short.** Each item should be a word or short phrase. Long sentences make scanning and dragging difficult, especially on mobile.
- **Test for red herrings.** Read all right-side options together and make sure none of them almost fit multiple left-side items in a misleading way, unless that's intentional difficulty.

For more help, learn [how to make and run a quiz](how-to-make-and-run-a-quiz.md).

*Last updated: 2026-06-22*
