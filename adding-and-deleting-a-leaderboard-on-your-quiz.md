---
id: 570272000000696095
title: Adding and Deleting a Leaderboard on your Quiz
status: Published
permalink: adding-and-deleting-a-leaderboard-on-your-quiz
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-05-11
tags: ["quiz", "add", "leaderboard", "leader board", "ahaslides", "delete"]
keywords: []
summary: The Leaderboard displays the rankings and scores of participants in a quiz. After the final question, the leaderboard will display the winner. Leaderboards will only work with quiz slides (Pick Answer, Short Answer, Match Pairs, Correct Order, and Categorize).
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000696095
portal_url: https://help.ahaslides.com/portal/en/kb/articles/adding-and-deleting-a-leaderboard-on-your-quiz
related_articles: ["how-to-make-and-run-a-quiz"]
mcp_actions:
  create: "create_slides(slide_type: \"leaderboard\")"
  delete: "update_slide_properties_tool(type: \"leaderboard\", deleted: true)"
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "The Leaderboard displays the rankings and scores of participants in a quiz. After the final question, the leaderboard will display the winner. Leaderboards will only work with quiz slides (Pick Answer, Short Answer, Match Pairs, Correct Order, and Categorize)."
---

# Adding and Deleting a Leaderboard on your Quiz

The Leaderboard displays the rankings and scores of participants in a quiz. After the final question, the leaderboard will display the winner.

> **Leaderboards will only work with quiz slides** (Pick Answer, Short Answer, Match Pairs, Correct Order, and Categorize).
>
> They also **don't update in real-time. They only fetch the latest results when you refresh them or return/move to them from another slide**, as they are designed for live presentations.
>
> For more info on creating a quiz, please check out this article: [How to Make and Run a Quiz](how-to-make-and-run-a-quiz.md)

Below is an interactive demo, which will help you experience this function:

> 📹 [Watch video](https://capture.navattic.com/cmndzyx32000a04ju199244r8)

## Leaderboard slide

### On the presenter screen

When you add a **quiz slide** (**except** the **Spinner Wheel**), a leaderboard slide will **automatically be created** and placed after it. In case you don't see the leaderboard, you may have accidentally chosen a **Poll** slide instead of a quiz slide type.

![Leaderboard slide auto-created after quiz slide](https://help.ahaslides.com/galleryDocuments/edbsn804d1434d44407267d584db14c4d9303f6db0eaa982c75c859773ffe04dfe25bcda51d4fce368bd0da2d6f42507e7a15?inline=true)

You can **delete any leaderboard slide** without affecting the quiz slide that generated it. If you would like to show the leaderboard after each quiz round, rather than after each question, you just need to delete all leaderboard slides except the last one in each round.

On the flip side, if you have deleted a leaderboard slide and want to **add it back**, then head to the 'Content' tab of your quiz slide and enable the '*__Leaderboard__*' switch.

![Leaderboard toggle switch in Content tab](https://help.ahaslides.com/galleryDocuments/edbsnd8f859c124563207217610c1842cfffc9a85ffe149b134708bcdb9ba3acbe82728789e12a4651876ad0e131cb6ff90d6?inline=true)

Any leaderboard slide will show the top 5 participants, and the presenter can scroll down to see all other participants. The final leaderboard slide of your presentation will display the final scores and announce the winner of your quiz.

![Final leaderboard slide showing winner](https://help.ahaslides.com/galleryDocuments/edbsn62b6c433cd843756db47d426735c6e38fb871882a61df5b5680719c4fc1f605140b129a1fcdc0a922b6057711b916eac?inline=true)

### On the audience's screen

The leaderboard is also viewable on the audience's mobile devices. Every quiz player can see their own position in the table and can scroll up and down to reveal all positions on the leaderboard.

![Audience leaderboard view on mobile](https://help.ahaslides.com/galleryDocuments/edbsn1aafd98e2259bddb7b8baa44d8639676bebca65e47543dcd00bca2342797fd8c75d84886c2ec88bf5fdae4e41a44c99e?inline=true)

## Pop-up Leaderboard

By pressing **L** on the keyboard or clicking on the **Trophy icon** in the Control bar, presenters can now access a pop-up Leaderboard anytime during a presentation to view real-time scores.

When presenters open the pop-up Leaderboard, the audience's screens will remain unaffected. The designated Leaderboard slides in your presentation will continue to display as usual when they appear in the presentation flow.

> The pop-up Leaderboard will always display the final scores accumulated from all completed quizzes, regardless of when and where it's opened.

![Pop-up leaderboard in control bar](https://help.ahaslides.com/galleryDocuments/edbsn2ebd7dfae3ed8a1a67b58082937a13fc530141c20558b58d741ca21b4f2719ddd4d8cf1db0e00e634d40d4f26ded36d3?inline=true)
