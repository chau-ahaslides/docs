---
id: 570272000000844051
title: Creating a Poll question on AhaSlides
status: Published
permalink: creating-a-poll-question-on-ahaslides
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-05-12
tags: ["image", "voters", "multiple", "ahaslides", "multiple choice", "anonymous", "survey", "poll", "vote"]
keywords: []
summary: A poll slide is a quick and easy way to get live opinions in poll format from your audience. You can ask a question, provide up to 30 answer options, and see results update live as your audience votes.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000844051
portal_url: https://help.ahaslides.com/portal/en/kb/articles/creating-a-poll-question-on-ahaslides
related_articles: ["sharing-your-presentation-to-your-participants", "setting-up-a-self-paced-quiz"]
mcp_actions:
  create: 'create_slides(slide_type: "poll", heading: "...", options: [{text}])'
  configure: 'update_slide_properties_tool(type: "pollQuestion", showPercentage: bool, addCorrectOption: bool, multipleChoice: bool, limitChoice: int, typeChart: "barChart"|"donutChart"|"pieChart")'
  delete: 'update_slide_properties_tool(type: "pollQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "A poll slide is a quick and easy way to get live opinions in poll format from your audience. You can ask a question, provide up to 30 answer options, and see results update live as your audience votes."
---

# Creating a Poll question on AhaSlides

A poll slide is a quick and easy way to get live opinions in poll format from your audience.

Below is an interactive demo, which will help you experience this function:

> 📹 [Watch video](https://capture.navattic.com/cmnho6ycy002x04l1hcxk0ob4)

## How does a Poll slide Work?

In a poll, you ask a question and provide between 2 and 30 answer options. Your audience vote for one or more of the answer options on their phones. The poll is updated live, so on the presenter screen you see a chart displaying the results.

Here is the **presenter's screen**, showing the voting results:

![Presenter screen showing poll voting results](https://help.ahaslides.com/galleryDocuments/edbsnc513393e2951acbb11bcf3ce8fc6df0dd07d16b2a91d28b60a0281bf8c24ab2ff783be48da1a3363f4e1c6910c467323?inline=true)

Here is the **participants' screen**. Once a participant has voted via their phone, they will also see the results on their screen.

![Participants screen showing poll results](https://help.ahaslides.com/galleryDocuments/edbsn97ab0867907473455107fae2234816051aa20bbd678d69107122af7ebad7bb54e7eddea7f830e2ab1e32d70004f471cd?inline=true)

## **How to make a Poll question?**

1. On the AhaSlides editor, add new slide button in the top left corner.
2. Select the slide type in the list - 'Poll'.

   ![Select Poll slide type](https://help.ahaslides.com/galleryDocuments/edbsnef6cd4036df29823b2e3df4d07a8bbd4d43ee35f965c72936c7eeed7232f126f6d900ee8437716aa7e7ecf2beccdb285?inline=true)

3. Fill in your question.
4. Fill in or upload images as your answer options. You can have between 2 and 30 answer options.

![Poll question editor with answer options](https://help.ahaslides.com/galleryDocuments/edbsn385d9a0f32fb00b65e5852ff4ded30e180c57624008411c57936de4fb643bf8356475458058d052812ae08df85686678?inline=true)

This is the **minimum** you need to do for any poll slide to work. When your slide is ready for your audience to vote on, [invite your audience to your presentation](https://help.ahaslides.com/sharing-your-presentation-to-your-participants) and press the 'Present' button in the top-right corner.

## Other Settings on your Poll

![Poll settings panel](https://help.ahaslides.com/galleryDocuments/edbsn5e0c485179a56ac13921f6636b91065ea49a881bed37817e4e3e15e6718840d0b7bbe2622771909e79c5c6708ca5e5e8?inline=true)

- **Hide results** - Keep the results hidden until you press the button to reveal them to your audience. This also hides the results on each participant's phone screen.
- **Show results on audience's phones** - Allows the audience to see everyone's votes for that slide on their phone screen after they have submitted their own vote.
- **Show results in % for this question** - Displays the results as percentages, instead of displaying the number of participants who voted for each answer option. This can also be toggled by simply clicking on any of the coloured segments on the presenter's screen.
- **Layout** - Displays the results in one of 3 different options: a bar chart, donut chart or pie chart.
- **Allow picking more than one option** - Allows the audience to select multiple answer options. When this option is selected, choose the maximum number of options a participant can pick, between 2 options and all of the options on the poll.

  ![Multiple choice option selector](https://help.ahaslides.com/galleryDocuments/edbsn5e0c485179a56ac13921f6636b91065e07385926c20a403c86e4e055bf5ae8384a2ca91964ae4d7494ac7a7dc204e191?inline=true)

- **This question has correct answer(s)** - Allows you to ask a multiple choice question which contains one or more correct answers. When this option is selected, you will be asked to mark which answer option(s) are correct. The answer will remain concealed until you press the 'show correct answer' button on your slide.

  ![Correct answer option](https://help.ahaslides.com/galleryDocuments/edbsnf2620d7dfb3f822011f5a1fc76665079359baaa18e23ba6a6f203291d372577f49f451fb6dfc7b907d723324a0c4a68c?inline=true)

**💡** *__Note:__ A multiple-choice slide with a correct answer is not scored. If you would like to create a **quiz question** where your audience can earn points for correct answers, please use one of the slides in the 'Quiz' section.*

- **Close submission** - Close submission for specific slides can be useful if you need to explain a question before your audience votes, or for any other reason where you do not wish the participants to vote on a question at that moment.

  ![Close submission toggle](https://help.ahaslides.com/galleryDocuments/edbsnbb23e51c8bd242a985610141969f1ba6fec988fa10f684dc678bba1da8013363f54355daa56b9ec1f53fbb0d6f4c2bce?inline=true)

When presenting, you can click the "Submission closed" icon to enable the audience to submit their answers, and click on the "Submission opened" icon to close it.

![Submission open/closed icons in present mode](https://help.ahaslides.com/galleryDocuments/edbsndc0914262dc4502a34fb760488c5e0df626445af0e2b69fec11c18155b609cc937241b49fce5281fd2467f4548967c27?inline=true)

- **Limit time to answer** - Allows you to set a time limit for answering for your audience. This can be between 5 seconds and 20 minutes.

  ![Time limit setting](https://help.ahaslides.com/galleryDocuments/edbsnbfa4d80d75b695baa364ed320187c705e2df9d18f8ddc2816e5ce6498f034aa843e0f6e6f4d66e8838799e43d6b9cba8?inline=true)

While running the poll slides, you have the option to turn off the timer or change the time limit. If you turn off the timer, you cannot turn it on again in the present mode. You will need to switch back to edit mode to enable the timer again.

![Timer controls in present mode](https://help.ahaslides.com/galleryDocuments/edbsn7b65629097bb4e28677e1d3ea1253e0b85da7f4f14ca8830f3aeda74974212496150417ca1ff39e1de92d301d9d0edf4?inline=true)

**💡** *__Note:__ If you're using a multiple choice slide for a do-at-home survey, you can allow your participants to cast their votes in the poll without needing you to present it live. For more info, [check out our article on self-paced presentations](https://help.ahaslides.com/setting-up-a-self-paced-quiz).*

**For more on polls, check out this tutorial. Please bear in mind that the tutorial is a little outdated, but the process it shows in creating a poll slide is still very similar.**

> 📹 [Watch video](https://www.youtube.com/embed/l6OXGVZg45M?feature=oembed)
