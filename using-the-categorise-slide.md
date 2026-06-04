---
id: 570272000069894001
title: Using the Categorise Slide
status: Published
permalink: using-the-categorise-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2025-10-03
tags: ["quiz", "categorise", "ahaslides"]
keywords: []
summary: The Categorize slide is a slide type that allows you to create interactive quizzes where participants must categorize items into predefined groups. It's a great way to test your audience's knowledge and engagement.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000069894001
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-categorise-slide
related_articles: []
mcp_actions:
  create: 'create_slides(slide_type: "categorise_quiz", heading: "...", options: [{name, items[]}])'
  configure: 'update_slide_properties_tool(type: "categoriseQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)'
  delete: 'update_slide_properties_tool(type: "categoriseQuizQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
---

The Categorize slide is a slide type that allows you to create interactive quizzes where participants must categorize items into predefined groups. It's a great way to test your audience's knowledge and engagement.

## How does the Categorise Slide work?

Categorize slide in AhaSlides work by presenting participants with a question and a set of options in a list of categories. Participants must then select each option from the correct category.

On the presenter's screen, a list of answer choices will be displayed on the left, while the categories into which these choices should be sorted will appear on the right.

## Setting up your Categorise Slide

In the "Content" tab of the Categorise slide, you'll find the following fields:

- **Your question**: Enter the question you want to ask.
- **Add Category & Options:**
  - Add Name Category: Enter the name of the category for this slide.
  - Add Options: Enter the options and separate them by commas.
  - Add Category: Click this button to add more categories if needed.

![Categorise slide content tab setup](https://help.ahaslides.com/galleryDocuments/edbsnc8225e3a81fa590d8e7bd00e64de8ed1a3d81474d602b20607b8caf129137cabf94a34b39607726369593caa1a41a0ab?inline=true)

### Adjusting Settings

- **Points**: Set the maximum and minimum number of points that can be earned for this question. If the "Faster answers get more points" box is unchecked, all correct answers will receive the maximum points.
- **Faster answers get more points:** Check this box to encourage players to answer quicker. For example, if the time is set at 100 seconds and the points are set to a maximum of 100 and a minimum of 0, then a player submitting their answer with 80 seconds left will receive 80 points.
- **Partial scoring**: Enable this option to award points based on the number of correct matches, even if not all options are selected correctly.
- **Time limit:** Set the time limit for this question in seconds. The time limit for the "Correct Order" slide is automatically set to 45 seconds, but you can change it.
- **Leaderboard:** Enable or disable the leaderboard slide that appears after the category slide.

## Audience Screen

Your audience will be able to see the categories and options on their devices and select the correct category for each option.

![Audience view of categorise slide](https://help.ahaslides.com/galleryDocuments/edbsn4c30243c30aed1bff459835eb2dd9b957f2f932fd244f7ff1d25d6417dcec2d9bfdfc5fb90341e3569ac5a82a2efe02f?inline=true)

By using Categorise quiz slides, you can create more dynamic and informative presentations that keep your audience interested and engaged.
