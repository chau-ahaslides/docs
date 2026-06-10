---
id: 570272000000696303
title: How to Use Rating Scale Slides on AhaSlides
status: Published
permalink: how-to-use-rating-scale-slides-on-ahaslides
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2025-10-03
tags: ["rate", "slide", "scales", "rating", "ahaslides", "scale", "rating scale", "scale slide"]
keywords: []
summary: Rating Scale slide is a great one to use if you're looking for more nuanced responses that you can't get from a simple 'yes or no' option on a multiple-choice slide. It allows the host to pose a broad question with specific statements that the audience rates on a sliding scale.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000696303
portal_url: https://help.ahaslides.com/portal/en/kb/articles/how-to-use-rating-scale-slides-on-ahaslides
related_articles: []
mcp_actions:
  create: "create_slides(slide_type: \"scale\", heading: \"...\", options: [{text}], scale_config: {low_label, high_label, low_value, high_value, must_rate, show_average, show_mid_values})"
  configure: "update_slide_properties_tool(type: \"scaleQuestion\", hasTimeLimit: bool, timeToAnswer: int)"
  delete: "update_slide_properties_tool(type: \"scaleQuestion\", deleted: true)"
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "Rating Scale slide is a great one to use if you're looking for more nuanced responses that you can't get from a simple 'yes or no' option on a multiple-choice slide. It allows the host to pose a broad question with specific statements that the audience rates on a sliding scale."
---

# How to Use Rating Scale Slides on AhaSlides

Rating Scale slide is a great one to use if you're looking for more nuanced responses that you can't get from a simple 'yes or no' option on a multiple-choice slide.

## How do Rating Scale Slides Work?

1. **The host** poses a broad question, offers specific statements to that question, and asks the audience to rate their opinions on those specific statements on a sliding scale.

   ![](https://help.ahaslides.com/galleryDocuments/edbsn02b150193df27f6d923220f1d4db8092400d2689eb649777f7cc3af8d4481a8c9bc7f6766db06cff8d3b1ea472311bc2?inline=true)

2. **The audience** accesses the slide on their phones and responds to each of the statements via a sliding scale.

   ![Audience response view to a scale slide on AhaSlides.](https://ahaslides.com/wp-content/uploads/2020/11/Audience-response-618x1024.png)

3. **The resulting data** is shown on a graph that reveals what and how many responses each statement received. It also shows the average numbered response for each statement.

![](https://ahaslides.com/wp-content/uploads/2023/10/scale-PhotoRoom.png-PhotoRoom.png)

## Setting up a Rating Scale Slide

### #1 – Your Question

**Pretty self-explanatory; 'your question' is the main question you want to ask your audience.**

This can be a question that invokes an answer on a scale of 1-5, such as the question *'how satisfied are you with our service?'*, with 1 being *very dissatisfied* and 5 being *very satisfied*. Alternatively, this can also be a statement, such as a statement *'My experience of this service was highly satisfactory'*, with the scale measuring *strong disagreement* (1) to *strong agreement* (5).

![](https://help.ahaslides.com/galleryDocuments/edbsndf6ccf135524be8c605af4db02e96a345b69d163e7e059a5560ca2f6805824576d776b42d4fb403361838b2481ef5673?inline=true)

If you feel like your statement needs clarifying, you can also choose to 'add a longer description'. The description will be shown underneath the question on audience members' devices.

### #2 – Statements

**'Statements' are the specific parts of a broad question that you want an answer to.**

For example, if you ask the broad question *'how satisfied are you with our service?'*, you might want responses to specific parts of the service that your audience were either satisfied or dissatisfied about. In this case, you can add up to 8 statements for different aspects of service, such as *'ease of use'*, *'friendliness of staff'*, *'speed of delivery'* etc.

![](https://help.ahaslides.com/galleryDocuments/edbsn5f1bb1502220a7e5744b838c83ed88aa355366d5ccf248843b8da46515df86628e98754cd5fde88b9a43ae6c2f89b536?inline=true)

**Note:** If your broad question *is* your statement, and you don't require the statement field at all, you can delete all statement boxes. This centralises the layout and means that your audience will only respond to the one question at the top.

### #3 – Scale

**The 'scale' section deals with the wording and number of your scale's values.**

These values are typically from 1 to 5. In our *'how satisfied are you with our service?'* example, 1 represents *very dissatisfied* and 5 represents *very satisfied*. You can attach specific wording to all values in between the two extremes to help your audience make a more informed and accurate decision on their opinions. The wording for the values will not appear on your desktop display, but they will appear on your audience's devices (providing that the difference between the lowest value and highest value is not more than 10).

![](https://help.ahaslides.com/galleryDocuments/edbsndf6ccf135524be8c605af4db02e96a345dae9f72a2d39c6b1ae127d9e725a86c576488d0ab788ca12055e3ca8d3de9c7?inline=true)

The standard rating scale slide on AhaSlides comes with 5 values, but you can increase this to any number you want (below 1000) if you want a more refined answer.

The *low label* and the *high label* are the lowest and highest values respectively, both of which will appear at either end of the scale on your display.

### #4 – Time limit:

Introduces a time limit for the question, chosen by the host, between 5 seconds and 20 minutes.

![](https://help.ahaslides.com/galleryDocuments/edbsnbfa4d80d75b695baa364ed320187c705e2df9d18f8ddc2816e5ce6498f034aa843e0f6e6f4d66e8838799e43d6b9cba8?inline=true)

While running the rating scale slides, you have the option to turn off the timer or change the time limit. If you turn off the timer, you cannot turn it on again in the present mode. You will need to switch back to edit mode to enable the timer again.

![](https://help.ahaslides.com/galleryDocuments/edbsn4762cac9df2ced2b5c8adfdc13e348f123f09e6c93428de4f285972e215f5e5f31922a2ea1a5e211cb0ce5e5483c17ee?inline=true)

### #5 – Close submission:

Closing submissions for specific slides can be useful if you need to clarify a question before your audience submits the responses, or for any other reason where you do not want the participants to submit their answers to a question at that moment.

![](https://help.ahaslides.com/galleryDocuments/edbsnbb23e51c8bd242a985610141969f1ba6fec988fa10f684dc678bba1da8013363f54355daa56b9ec1f53fbb0d6f4c2bce?inline=true)

When presenting, you can click the "Submission closed" icon to enable the audience to submit their answers, and click on the "Submission opened" icon to close it.

![](https://help.ahaslides.com/galleryDocuments/edbsnbb23e51c8bd242a985610141969f1ba6fd0c8659a3fb540cbd9c9fdc18deddc100e5a90a937011b7f732d7bb2cfcf57b?inline=true)

### #6 – Hide results:

Hides all of the results until the host presses the 'show results' button. You can click "Apply to all questions" to apply this feature to all questions.

![](https://help.ahaslides.com/galleryDocuments/edbsn15689f2bac718ef40592d267afe76eeaea54bd5487c4f2332c51fbba64f59f8fc91a5d4cf968ac0545e44bc04a92a49e?inline=true)

### #7 – Other Settings

![](https://help.ahaslides.com/galleryDocuments/edbsn1697d865eda373decc1251e933554656e56029da9602b924d6e77f2ebc288b109e62b346f5f1eafd350217598fa6d12a?inline=true)

**There are 2 'other settings' on an AhaSlides scale slide that you can choose to check on or off:**

1. **Show the average line for all statements**: Displays a vertical line that reveals the average response number across all statements of your broad question.
2. **Must rate all statements**: Removes the 'skip' option for statements and makes it mandatory to rate every statement.

## Understanding your Response Data

Once you receive response data, it will look something like this:

![](https://ahaslides.com/wp-content/uploads/2023/10/scale-PhotoRoom.png-PhotoRoom.png)

The graph shows all responses across all statements. All the data is colour-coded with your statements so that you see exactly how audience members responded to each statement.

You can see the average performance for each statement in the colour-coded circles at the bottom of the graph. Remember to turn on *'show the average line for all statements'* in 'other settings' to see the average performance of all statements combined, which is displayed in a white circle below the other averages.

![Host a live quiz online with AhaSlides](https://ahaslides.com/wp-content/uploads/2023/10/Ordinal-scale.png)

If you hover your mouse over each circle, you can see how many responses each value got.

![](https://help.ahaslides.com/galleryDocuments/edbsnd0a30169f09ec5627371dfd92fec1754eb3e950a615cca67a9a6270eafb186f1debdad5cb4cf1f6e4615a3f97153081a?inline=true)

You can also hover your mouse over the statements on the right, or the circle averages at the bottom, to get an isolated view of how each statement fared in the response data.

![](https://help.ahaslides.com/galleryDocuments/edbsndd6efb7562f24b1fbb56ca5c857f5d2a3626d2ad7518e7767144bb0f1288021f12bcebd9b746896530683902794e933a?inline=true)
