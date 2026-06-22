---
id: 570272000000844051
title: How to Make and Run a Poll
status: Published
permalink: creating-a-poll-question-on-ahaslides
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-10
tags: ["image", "voters", "multiple", "ahaslides", "multiple choice", "anonymous", "survey", "poll", "vote"]
keywords: []
summary: A Poll slide is a quick and easy way to get live opinions in poll format from your audience. You can ask a question, provide up to 30 answer options, and see results update live as your audience votes.
plan_required: All
portal_url: https://help.ahaslides.com/portal/en/kb/articles/creating-a-poll-question-on-ahaslides
related_articles: ["sharing-your-presentation-to-your-participants", "setting-up-a-self-paced-quiz"]
mcp_actions:
  create: 'create_slides(slide_type: "poll", heading: "...", options: [{text}])'
  configure: 'update_slide_properties_tool(type: "pollQuestion", showPercentage: bool, addCorrectOption: bool, multipleChoice: bool, limitChoice: int, typeChart: "barChart"|"donutChart"|"pieChart")'
  delete: 'update_slide_properties_tool(type: "pollQuestion", deleted: true)'
description: "A Poll slide is a quick and easy way to get live opinions in poll format from your audience. You can ask a question, provide up to 30 answer options, and see results update live as your audience votes."
---

# How to Make and Run a Poll

A Poll slide is a quick and easy way to get live opinions in poll format from your audience.

Watch how to create a poll from start to finish — including previewing it before you go live:

{% embed url="https://www.youtube.com/watch?v=hJvW96emNxo" %}
How to create a Poll question on AhaSlides
{% endembed %}

Below is an interactive demo, which will help you experience this function:

{% embed url="https://capture.navattic.com/cmnho6ycy002x04l1hcxk0ob4" %}
Interactive demo: try the Poll slide
{% endembed %}

## How does a Poll slide work?

In a poll, you ask a question and provide between 2 and 30 answer options. Your audience vote for one or more of the answer options on their phones. The poll is updated live, so on the presenter screen you see a chart displaying the results. Once a participant has voted on their phone, they'll see the results on their screen too — you can see both views side by side in the Preview section of the video above.

## How to make a poll question

1. On the AhaSlides editor, click **+ New slide** in the top-left corner. (On a brand-new presentation, you can also click **Choose a slide** right on the canvas.)
2. Pick **Poll** from the slide type list — you'll find it in the **Unscored** section.
3. Fill in your question in the **Your question** box on the right.
4. Fill in or upload images as your answer options. You can have between 2 and 30 answer options.

This is the **minimum** you need to do for any Poll slide to work. Want to see exactly what your audience will see before going live? Hit **Preview** in the top-right corner — [here's how previewing works](how-to-preview-and-test-your-presentation.md). When your slide is ready for your audience to vote on, [invite your audience to your presentation](sharing-your-presentation-for-participants-to-join.md) and press the 'Present' button in the top-right corner.

## Other settings on your poll

- **Hide results** - Keep the results hidden until you press the button to reveal them to your audience. This also hides the results on each participant's phone screen.
- **Show results on audience's phones** - Allows the audience to see everyone's votes for that slide on their phone screen after they have submitted their own vote.
- **Show results in % for this question** - Displays the results as percentages, instead of displaying the number of participants who voted for each answer option. This can also be toggled by simply clicking on any of the coloured segments on the presenter's screen.
- **Layout** - Displays the results in one of 3 different options: a bar chart, donut chart or pie chart.
- **Allow picking more than one option** - Allows the audience to select multiple answer options. When this option is selected, choose the maximum number of options a participant can pick, between 2 options and all of the options on the poll.

- **This question has correct answer(s)** - Allows you to ask a multiple choice question which contains one or more correct answers. When this option is selected, you will be asked to mark which answer option(s) are correct. The answer will remain concealed until you press the 'show correct answer' button on your slide.

**💡** *__Note:__ A multiple-choice slide with a correct answer is not scored. If you would like to create a **quiz question** where your audience can earn points for correct answers, please use one of the slides in the 'Quiz' section.*

- **Close submission** - Close submission for specific slides can be useful if you need to explain a question before your audience votes, or for any other reason where you do not wish the participants to vote on a question at that moment.

When presenting, you can click the "Submission closed" icon to enable the audience to submit their answers, and click on the "Submission opened" icon to close it.

- **Limit time to answer** - Allows you to set a time limit for answering for your audience. This can be between 5 seconds and 20 minutes.

While running the Poll slides, you have the option to turn off the timer or change the time limit. If you turn off the timer, you cannot turn it on again in the present mode. You will need to switch back to edit mode to enable the timer again.

**💡** *__Note:__ If you're using a multiple choice slide for a do-at-home survey, you can allow your participants to cast their votes in the poll without needing you to present it live. For more info, [check out our article on self-paced presentations](setting-up-a-self-paced-presentation-on-ahaslides.md).*
