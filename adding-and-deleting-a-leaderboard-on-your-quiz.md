---
id: 570272000000696095
title: "Adding and deleting a leaderboard on your quiz"
description: "How to add, delete, and re-enable a leaderboard slide on an AhaSlides quiz, and how to open the pop-up leaderboard during a live presentation. Leaderboards work only with quiz slide types."
permalink: adding-and-deleting-a-leaderboard-on-your-quiz
category: "Features and functions"
category_id: 570272000074885296
permission: ALL
plan_required: All
last_updated: 2026-06-22
tags:
  - quiz
  - leaderboard
  - leader board
  - add leaderboard
  - delete leaderboard
  - pop-up leaderboard
  - scores
  - rankings
keywords: []
questions_answered:
  - "How do I add a leaderboard to my AhaSlides quiz?"
  - "How do I delete a leaderboard slide from my quiz?"
  - "I deleted my leaderboard slide, how do I add it back?"
  - "Why isn't a leaderboard showing up after my quiz slide?"
  - "Why doesn't my leaderboard update in real time?"
  - "How do I show the leaderboard once per round instead of after every question?"
  - "How do I open the pop-up leaderboard during a presentation?"
  - "Which slide types support a leaderboard?"
user_intents:
  - "Add a leaderboard so participants can see their rank and score during a quiz"
  - "Remove or re-enable a leaderboard slide"
  - "Check live scores mid-presentation without changing the audience screen"
related:
  - how-to-make-and-run-a-quiz
mcp_actions:
  create: "create_slides(slide_type: \"leaderboard\")"
  delete: "update_slide_properties_tool(type: \"leaderboard\", deleted: true)"
portal_url: https://help.ahaslides.com/portal/en/kb/articles/adding-and-deleting-a-leaderboard-on-your-quiz
zoho_id: "570272000000696095"
---

# Adding and deleting a leaderboard on your quiz

A leaderboard displays the rankings and scores of participants in an AhaSlides quiz. After the final question, the leaderboard displays the winner.

{% hint style="info" %}
Leaderboards work only with quiz slide types: Pick Answer, Short Answer, Match Pairs, Correct Order, and Categorize. They do not work with Poll slides.
{% endhint %}

A leaderboard slide does not update in real time. It fetches the latest results only when you refresh it, or when you return or move to it from another slide, because it is designed for live presentations.

For more on building a quiz, see [How to make and run a quiz](how-to-make-and-run-a-quiz.md).

> **Tip:** Try the interactive demo to see the leaderboard in action: [Watch the demo](https://capture.navattic.com/cmndzyx32000a04ju199244r8)

## The Leaderboard slide

### On the presenter screen

When you add a quiz slide (except the Spinner Wheel), AhaSlides automatically creates a leaderboard slide and places it after the quiz slide. If you do not see a leaderboard, you may have added a Poll slide instead of a quiz slide type.

You can delete any leaderboard slide without affecting the quiz slide that generated it. To show the leaderboard once per round instead of after every question, delete every leaderboard slide except the last one in each round.

To add a deleted leaderboard back, open the Content tab of the quiz slide and turn on the Leaderboard switch.

Each leaderboard slide shows the top 5 participants, and the presenter can scroll down to see everyone else. The final leaderboard slide of your presentation displays the final scores and announces the winner of your quiz.

### On the audience screen

The leaderboard is also viewable on the audience's mobile devices. Every quiz player can see their own position in the table and can scroll up and down to reveal all positions on the leaderboard.

## The pop-up Leaderboard

The pop-up leaderboard lets a presenter check live scores at any point during a presentation. Press **L** on the keyboard, or click the **Trophy icon** in the control bar, to open it.

When you open the pop-up leaderboard, the audience screens stay unchanged. The leaderboard slides placed in your presentation still display as usual when they appear in the presentation flow.

{% hint style="info" %}
The pop-up leaderboard always displays the final scores accumulated from all completed quizzes, regardless of when or where you open it.
{% endhint %}

*Last updated: 2026-06-23*
