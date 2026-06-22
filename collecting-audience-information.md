---
id: 570272000000696221
title: Collecting Audience Information
status: Published
permalink: collecting-participants-information
category: Features and Functions on AhaSlides
category_id: 570272000074885546
permission: ALL
last_updated: 2026-04-10
tags: ["audience admission", "personal info", "ahaslides", "audience info", "information", "participant information", "collect", "authentication"]
keywords: []
summary: Collect audience information like names, email addresses and names of organisations from your participants before they join your presentation or while they answer an Open-Ended or Brainstorm slide.
plan_required: Pro
portal_url: https://help.ahaslides.com/portal/en/kb/articles/collecting-participants-information
related_articles: ["exporting-to-excel", "your-ahaslides-presentation-report"]
mcp_actions:
  create: 'create_slides(slide_type: "open_ended_survey", heading: "...")'
  configure: 'update_slide_properties_tool(type: "openEndedQuestion", layout: "grid"|"oneByOne", imageSubmission: bool)'
  delete: 'update_slide_properties_tool(type: "openEndedQuestion", deleted: true)'
description: "Collect audience information like names, email addresses and names of organisations from your participants before they join your presentation or while they answer an Open-Ended or Brainstorm slide."
---

# Collecting Audience Information

Collect audience information like names, email addresses and names of organisations from your participants before they join your presentation or while they answer an Open-Ended or Brainstorm slide.

**Please note** that while this feature is available on all paid plans, only **certain paid plans** can see collected participant information in the [Excel export](https://help.ahaslides.com/portal/en/kb/articles/exporting-to-excel) after the presentation is over: [Your AhaSlides Presentation Report](your-ahaslides-presentation-report.md)

## How to collect audience info

### 1. In the setting menu:

a. Head to the **Settings** menu and click on **Collect audience info**.

b. Check the box labelled **Ask participants for info before they join** - This will show an entry form that participants are asked to fill in when they join your presentation.

c. Start by writing the heading to your form, then you can click the  button next to **Add fields** to select information fields to add.

### 2. In an open-ended or Brainstorm slide

a. When editing an Open-Ended or Brainstorm slide, click the  button next to **Collect audience info.** This option will allow you to collect information from participants when they answer this particular slide.

b. You can then click on the field that you want to add.

## Adding information fields

You can add up to 8 fields, including:

1. 3 default fields: Name, Email, Avatar
1. 5 custom fields.

### 1. Default fields

To add a default field, you only need to choose one of them after clicking the  button.

While you cannot change a default field's name, it is possible to **edit** its question, which will appear on participants' devices.

### 2. Custom field

To add a custom field, choose **Custom field +** after clicking the  button.

A window will pop-up for you to set up the custom field.

There will be:

- **Field name**: This is your internal label — perfect for sorting or filtering data in the Excel report. It won't be shown to participants.
- **Question shown to participants**: This is what participants will see as the question or label when filling out the form.
- **Required**: Enable this switch to make this field mandatory for participants.

After filling out the fields in the pop-up window, you can click **Add field** to create the custom field.

The field will then be added to the list:

### 3. Additional settings

You can **Remove** a field or **Mark it as required** for participants by clicking the three-dot button next to it. You can also rearrange the fields by dragging them using the six-dot button at the front of each field.

## On participants' devices

When participants join your presentation, they will see a form prompting them to enter the information you've requested before they can join.

> When participants join, they will see the same background as the slide the presenter is displaying at that moment.

## Seeing collected info in the Excel export

**Once participants have entered their info, it will be stored in the Excel file that contains your full presentation report.**

Any user not on the free plan can download this Excel file by heading to the **Results** tab in the editor toolbar and clicking the button labelled *'Request Excel file'*.

Download the Excel file and click on the second sheet here, labelled *'Participants'.* Here you will see all of your collected participant info.

