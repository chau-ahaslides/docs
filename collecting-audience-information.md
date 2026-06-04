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
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000696221
portal_url: https://help.ahaslides.com/portal/en/kb/articles/collecting-participants-information
related_articles: ["exporting-to-excel", "your-ahaslides-presentation-report"]
mcp_actions:
  create: 'create_slides(slide_type: "open_ended_survey", heading: "...")'
  configure: 'update_slide_properties_tool(type: "openEndedQuestion", layout: "grid"|"oneByOne", imageSubmission: bool)'
  delete: 'update_slide_properties_tool(type: "openEndedQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
---

Collect audience information like names, email addresses and names of organisations from your participants before they join your presentation or while they answer an Open-Ended or Brainstorm slide.

**Please note** that while this feature is available on all paid plans, only **certain paid plans** can see collected participant information in the [Excel export]([[exporting-to-excel]]) after the presentation is over: [Your AhaSlides Presentation Report]([[your-ahaslides-presentation-report]])

## How to Collect Audience Info

### 1. In the Setting menu:

a. Head to the **Settings** menu and click on **Collect audience info**.

b. Check the box labelled **Ask participants for info before they join** - This will show an entry form that participants are asked to fill in when they join your presentation.

![Collect audience info setting](https://help.ahaslides.com/galleryDocuments/edbsn4f0f7c23e21427d7335c0ab645cf6be2e88ec7bf72965aa616fd4a3f36fb6f6932ee4ce95526ba52f915bffc76127179?inline=true)

c. Start by writing the heading to your form, then you can click the ![Add fields button](https://help.ahaslides.com/galleryDocuments/edbsn16b8584babb8c16448ca72285bf20cf681c1709caeabec583eb57c23d6e66b543f2cd1abdedaa88dcabc74076795f9c1?inline=true) button next to **Add fields** to select information fields to add.

![Add fields dropdown](https://help.ahaslides.com/galleryDocuments/edbsn5115f3d3b9df25186e6bc275e41f99a317d2dc645f8028e6daf9f51ded2815110528a0f17759010be5a16d2f8f0ec554?inline=true)

### 2. In an Open-Ended or Brainstorm slide

a. When editing an Open-Ended or Brainstorm slide, click the ![Add button](https://help.ahaslides.com/galleryDocuments/edbsn16b8584babb8c16448ca72285bf20cf681c1709caeabec583eb57c23d6e66b543f2cd1abdedaa88dcabc74076795f9c1?inline=true) button next to **Collect audience info.** This option will allow you to collect information from participants when they answer this particular slide.

![Collect audience info on slide](https://help.ahaslides.com/galleryDocuments/edbsn9b443b5ca5ab20d12de660ee5671adf7a994f1db58ae87a6f17ce055d6776057fa622bcee71510dd6b12b070497234f5?inline=true)

b. You can then click on the field that you want to add.

![Field selection](https://help.ahaslides.com/galleryDocuments/edbsn0bed6f86202cac2c345840520b6af1380eb9e6a133bf184d9255dcdc7d33c8b202f1aa965130b72d9329ab4bb08d8ba1?inline=true)

## Adding information fields

You can add up to 8 fields, including:

1. 3 default fields: Name, Email, Avatar
1. 5 custom fields.

### 1. Default fields

To add a default field, you only need to choose one of them after clicking the ![Add button](https://help.ahaslides.com/galleryDocuments/edbsnb74a2bf100284c43efb61c35705bb9d89dca8cf8b367b93c640e89ecb409b899d78bc74db89090f85764b635881f8086?inline=true) button.

![Default fields](https://help.ahaslides.com/galleryDocuments/edbsn4f0f7c23e21427d7335c0ab645cf6be2bc4b59a92e944cc21f028ef15b36d472341625076fa7c549c57182b4710ac4d3?inline=true)

While you cannot change a default field's name, it is possible to **edit** its question, which will appear on participants' devices.

![Edit default field question](https://help.ahaslides.com/galleryDocuments/edbsn851d1baaafc7f06abe15288f398c0283c16b74f8d2a6065fef535981ab73afa00ff8048df66aa8d58bbf4400d066d6ec?inline=true)

### 2. Custom field

To add a custom field, choose **Custom field +** after clicking the ![Add button](https://help.ahaslides.com/galleryDocuments/edbsnb74a2bf100284c43efb61c35705bb9d89dca8cf8b367b93c640e89ecb409b899d78bc74db89090f85764b635881f8086?inline=true) button.

![Custom field option](https://help.ahaslides.com/galleryDocuments/edbsn5731fd26c7a0cd9a932f3def61aa9881ea513ff5e6d8532f8c06edc5c898cba9e20010d02c267933c3a154f953067a40?inline=true)

A window will pop-up for you to set up the custom field.

![Custom field setup window](https://help.ahaslides.com/galleryDocuments/edbsn7225384a9647184e6ffb627d6715154411cd59cd81ca542eb8d0d215b8dc288b65726de0c8ade769f47b99b2f268168c?inline=true)

There will be:

- **Field name**: This is your internal label — perfect for sorting or filtering data in the Excel report. It won't be shown to participants.
- **Question shown to participants**: This is what participants will see as the question or label when filling out the form.
- **Required**: Enable this switch to make this field mandatory for participants.

After filling out the fields in the pop-up window, you can click **Add field** to create the custom field.

![Add field button](https://help.ahaslides.com/galleryDocuments/edbsn959bb97cbfc7db36233d4d4f3fe47ddeb3188501af18e7913f0cf5dcddc5f3574650fa4934ad586e2f4cc6a46886ee5c?inline=true)

The field will then be added to the list:

![Field added to list](https://help.ahaslides.com/galleryDocuments/edbsn5a6e5648eb50cb6a45fcfb9c7e971f6a0d96cac3667934f98925fc22863fc6bb2c43619cd27b917872890b2118b7fe76?inline=true)

### 3. Additional settings

You can **Remove** a field or **Mark it as required** for participants by clicking the three-dot button next to it. You can also rearrange the fields by dragging them using the six-dot button at the front of each field.

![Additional settings](https://help.ahaslides.com/galleryDocuments/edbsn2abd97faa4392b43a47fd5c4e2c7625a72ff2813b98223bfa0d97539b7c999be349373990a52aa08b609303a3d39238b?inline=true)

## On participants' devices

When participants join your presentation, they will see a form prompting them to enter the information you've requested before they can join.

![Participant entry form](https://help.ahaslides.com/galleryDocuments/edbsne1171a6ed3a075077425ba8d6bfdc88f70ed782bf556975eb33ecde2b51af7f76537ea6dc66641fb4fe603abed0198a2?inline=true)

> When participants join, they will see the same background as the slide the presenter is displaying at that moment.

## Seeing Collected Info in the Excel Export

**Once participants have entered their info, it will be stored in the Excel file that contains your full presentation report.**

Any user not on the free plan can download this Excel file by heading to the **Results** tab in the editor toolbar and clicking the button labelled *'Request Excel file'*.

Download the Excel file and click on the second sheet here, labelled *'Participants'.* Here you will see all of your collected participant info.

![Participants sheet in Excel](https://help.ahaslides.com/galleryDocuments/edbsna9dfa93bf5b7f47b856391b384fb7ae018ff35ddba413d01a143d6a58a941fb8f12e05e7413630eaa92f38366298360c?inline=true)
