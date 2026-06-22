---
id: 570272000000696303
title: Using the Rating Scale Slide
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
portal_url: https://help.ahaslides.com/portal/en/kb/articles/how-to-use-rating-scale-slides-on-ahaslides
related_articles: []
mcp_actions:
  create: "create_slides(slide_type: \"scale\", heading: \"...\", options: [{text}], scale_config: {low_label, high_label, low_value, high_value, must_rate, show_average, show_mid_values})"
  configure: "update_slide_properties_tool(type: \"scaleQuestion\", hasTimeLimit: bool, timeToAnswer: int)"
  delete: "update_slide_properties_tool(type: \"scaleQuestion\", deleted: true)"
description: "Rating Scale slide is a great one to use if you're looking for more nuanced responses that you can't get from a simple 'yes or no' option on a multiple-choice slide. It allows the host to pose a broad question with specific statements that the audience rates on a sliding scale."
---

# Using the Rating Scale Slide

Rating Scale slide is a great one to use if you're looking for more nuanced responses that you can't get from a simple 'yes or no' option on a multiple-choice slide.

## How do Rating Scale slides work?

1. **The host** poses a broad question, offers specific statements to that question, and asks the audience to rate their opinions on those specific statements on a sliding scale.

2. **The audience** accesses the slide on their phones and responds to each of the statements via a sliding scale.

3. **The resulting data** is shown on a graph that reveals what and how many responses each statement received. It also shows the average numbered response for each statement.

## Setting up a Rating Scale slide

### #1 – Your question

**Pretty self-explanatory; 'your question' is the main question you want to ask your audience.**

This can be a question that invokes an answer on a scale of 1-5, such as the question *'how satisfied are you with our service?'*, with 1 being *very dissatisfied* and 5 being *very satisfied*. Alternatively, this can also be a statement, such as a statement *'My experience of this service was highly satisfactory'*, with the scale measuring *strong disagreement* (1) to *strong agreement* (5).

If you feel like your statement needs clarifying, you can also choose to 'add a longer description'. The description will be shown underneath the question on audience members' devices.

### #2 – Statements

**'Statements' are the specific parts of a broad question that you want an answer to.**

For example, if you ask the broad question *'how satisfied are you with our service?'*, you might want responses to specific parts of the service that your audience were either satisfied or dissatisfied about. In this case, you can add up to 8 statements for different aspects of service, such as *'ease of use'*, *'friendliness of staff'*, *'speed of delivery'* etc.

**Note:** If your broad question *is* your statement, and you don't require the statement field at all, you can delete all statement boxes. This centralises the layout and means that your audience will only respond to the one question at the top.

### #3 – Scale

**The 'scale' section deals with the wording and number of your scale's values.**

These values are typically from 1 to 5. In our *'how satisfied are you with our service?'* example, 1 represents *very dissatisfied* and 5 represents *very satisfied*. You can attach specific wording to all values in between the two extremes to help your audience make a more informed and accurate decision on their opinions. The wording for the values will not appear on your desktop display, but they will appear on your audience's devices (providing that the difference between the lowest value and highest value is not more than 10).

The standard rating scale slide on AhaSlides comes with 5 values, but you can increase this to any number you want (below 1000) if you want a more refined answer.

The *low label* and the *high label* are the lowest and highest values respectively, both of which will appear at either end of the scale on your display.

### #4 – Time limit:

Introduces a time limit for the question, chosen by the host, between 5 seconds and 20 minutes.

While running the Rating Scale slides, you have the option to turn off the timer or change the time limit. If you turn off the timer, you cannot turn it on again in the present mode. You will need to switch back to edit mode to enable the timer again.

### #5 – Close submission:

Closing submissions for specific slides can be useful if you need to clarify a question before your audience submits the responses, or for any other reason where you do not want the participants to submit their answers to a question at that moment.

When presenting, you can click the "Submission closed" icon to enable the audience to submit their answers, and click on the "Submission opened" icon to close it.

### #6 – Hide results:

Hides all of the results until the host presses the 'show results' button. You can click "Apply to all questions" to apply this feature to all questions.

### #7 – Other settings

**There are 2 'other settings' on an AhaSlides scale slide that you can choose to check on or off:**

1. **Show the average line for all statements**: Displays a vertical line that reveals the average response number across all statements of your broad question.
2. **Must rate all statements**: Removes the 'skip' option for statements and makes it mandatory to rate every statement.

## Understanding your response data

Once you receive response data, it will look something like this:

The graph shows all responses across all statements. All the data is colour-coded with your statements so that you see exactly how audience members responded to each statement.

You can see the average performance for each statement in the colour-coded circles at the bottom of the graph. Remember to turn on *'show the average line for all statements'* in 'other settings' to see the average performance of all statements combined, which is displayed in a white circle below the other averages.

If you hover your mouse over each circle, you can see how many responses each value got.

You can also hover your mouse over the statements on the right, or the circle averages at the bottom, to get an isolated view of how each statement fared in the response data.

