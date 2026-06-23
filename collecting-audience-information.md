---
id: 570272000000696221
title: "Collecting audience information"
status: Published
permalink: collecting-participants-information
category: "Features and functions"
category_id: 570272000074885546
permission: ALL
plan_required: Pro
last_updated: 2026-06-22
tags:
  - audience info
  - participant information
  - collect information
  - audience admission
  - authentication
  - custom fields
keywords: []
summary: "Collect audience information such as names, email addresses, and organisation names from participants before they join your presentation or while they answer an Open Ended or Brainstorm slide."
description: "How to collect audience information on AhaSlides through a join form or an Open Ended or Brainstorm slide, including default and custom fields and where to find the collected data in the Excel export."
questions_answered:
  - "How do I collect names and emails from my audience on AhaSlides?"
  - "How do I ask participants for their information before they join?"
  - "How do I add custom fields to the audience info form?"
  - "Where do I find the participant information I collected?"
  - "Which plans can collect audience information?"
  - "How many fields can I add to the audience info form?"
user_intents:
  - "Gather participant contact and identity details during a presentation"
  - "Add custom questions to the join form and export the responses"
related:
  - your-ahaslides-presentation-report
mcp_actions:
  create: 'create_slides(slide_type: "open_ended_survey", heading: "...")'
  configure: 'update_slide_properties_tool(type: "openEndedQuestion", layout: "grid"|"oneByOne", imageSubmission: bool)'
  delete: 'update_slide_properties_tool(type: "openEndedQuestion", deleted: true)'
portal_url: https://help.ahaslides.com/portal/en/kb/articles/collecting-participants-information
zoho_id: "570272000000696221"
---

# Collecting audience information

Collect audience information such as names, email addresses, and organisation names from participants before they join your presentation or while they answer an Open Ended or Brainstorm slide.

{% hint style="info" %}
Collecting audience information is available on all paid plans. Only certain paid plans can view the collected information in the Excel export after the presentation ends. See [Your AhaSlides presentation report](your-ahaslides-presentation-report.md) for plan details.
{% endhint %}

## How to collect audience info

You can collect audience info in two places: on the join form, or on an Open Ended or Brainstorm slide.

### In the settings menu

1. Go to the **Settings** menu and click **Collect audience info**.
2. Check the box labelled **Ask participants for info before they join**. This shows an entry form that participants fill in when they join your presentation.
3. Write the heading for your form, then click the button next to **Add fields** to select which information fields to add.

### In an Open Ended or Brainstorm slide

1. While editing an Open Ended or Brainstorm slide, click the button next to **Collect audience info**. This collects information from participants when they answer that specific slide.
2. Click the field you want to add.

## Adding information fields

You can add up to 8 fields: 3 default fields (Name, Email, Avatar) and up to 5 custom fields.

### Default fields

To add a default field, choose one of the three default fields after clicking the add button. You cannot rename a default field, but you can edit the question that participants see on their devices.

### Custom fields

To add a custom field, choose **Custom field +** after clicking the add button. A window opens for you to set up the field with these options:

- **Field name**: your internal label, used for sorting or filtering data in the Excel report. Participants do not see this name.
- **Question shown to participants**: the question or label participants see when filling out the form.
- **Required**: turn on this switch to make the field mandatory for participants.

After filling out the fields in the window, click **Add field** to create the custom field. It is then added to the list.

### Reordering and editing fields

To remove a field or mark it as required, click the three-dot button next to it. To rearrange fields, drag them using the six-dot button at the front of each field.

## What participants see on their devices

When participants join your presentation, they see a form prompting them to enter the information you requested before they can join.

{% hint style="info" %}
When participants join, they see the same background as the slide the presenter is displaying at that moment.
{% endhint %}

## Seeing collected info in the Excel export

Once participants enter their info, it is stored in the Excel file that contains your full presentation report.

Any user not on the Free plan can download this Excel file from the **Results** tab in the editor toolbar by clicking **Request Excel file**. Open the downloaded file and click the second sheet, labelled **Participants**, to see all collected participant info.
