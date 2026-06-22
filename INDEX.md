# AhaSlides Knowledge Base — Agent Index

> **For agents:** Read this file first to find the right article before opening individual files.
> Each entry includes the local slug (filename without `.md`), summary, plan requirement, and whether AhaSlides MCP actions are available.
>
> **⚠️ Do NOT use local `.md` body content to update Zoho articles** — images and videos exist in Zoho but are only referenced as URLs here. Always fetch live HTML from Zoho first via `ZohoDesk_getArticle(orgId: "736517018")`.

---

## Quick reference

| Slug | Category | Plan | MCP Actions? |
|------|----------|------|--------------|
| [ahaslides-vs-mentimeter](#ahaslides-vs-mentimeter) | Compare | Free | No |
| [what-is-ahaslides](#what-is-ahaslides) | Getting Started | Free | No |
| [creating-your-ahaslides-account](#creating-your-ahaslides-account) | Getting Started | Free | No |
| [the-my-presentations-dashboard](#the-my-presentations-dashboard) | Getting Started | All | No |
| [ahaslides-template-library](#ahaslides-template-library) | Getting Started | Free | No |
| [how-to-make-and-run-a-quiz](#how-to-make-and-run-a-quiz) | Using Slide Types | Free | ✅ Yes |
| [using-the-spinner-wheel](#using-the-spinner-wheel) | Using Slide Types | All | ✅ Yes |
| [using-the-word-cloud-slide](#using-the-word-cloud-slide) | Using Slide Types | Free | ✅ Yes |
| [using-the-brainstorm-slide](#using-the-brainstorm-slide) | Using Slide Types | All | ✅ Yes |
| [using-the-match-pairs-slide](#using-the-match-pairs-slide) | Using Slide Types | All | ✅ Yes |
| [using-the-correct-order-slide](#using-the-correct-order-slide) | Using Slide Types | All | ✅ Yes |
| [using-the-pick-answer-slide](#using-the-pick-answer-slide) | Using Slide Types | Free | ✅ Yes |
| [using-the-type-answer-slide](#using-the-type-answer-slide) | Using Slide Types | Free | ✅ Yes |
| [how-to-use-rating-scale-slides-on-ahaslides](#how-to-use-rating-scale-slides-on-ahaslides) | Using Slide Types | All | ✅ Yes |
| [using-qa](#using-qa) | Using Slide Types | Free | ✅ Yes |
| [adding-and-deleting-a-leaderboard-on-your-quiz](#adding-and-deleting-a-leaderboard-on-your-quiz) | Using Slide Types | All | ✅ Yes |
| [creating-a-poll-question-on-ahaslides](#creating-a-poll-question-on-ahaslides) | Using Slide Types | All | ✅ Yes |
| [using-the-categorise-slide](#using-the-categorise-slide) | Using Slide Types | All | ✅ Yes |
| [using-the-content-slide](#using-the-content-slide) | Using Slide Types | All | ✅ Yes |
| [using-the-open-ended-slide](#using-the-open-ended-slide) | Using Slide Types | All | ✅ Yes |
| [using-the-ranking-slide](#using-the-ranking-slide) | Using Slide Types | All | ✅ Partial |
| [how-to-use-the-idea-board-slide](#how-to-use-the-idea-board-slide) | Using Slide Types | All | No |
| [using-the-surveys-tool](#using-the-surveys-tool) | Using Slide Types + Surveys | All | No |
| [using-the-content-v2-slide](#using-the-content-v2-slide) | Using Slide Types | All | No |
| [using-the-diagram-slide](#using-the-diagram-slide) | Using Slide Types | All | No |
| [using-the-pin-on-image-slide](#using-the-pin-on-image-slide) | Using Slide Types | All | No |
| [adding-notes-to-your-presentation](#adding-notes-to-your-presentation) | Features | All | No |
| [how-to-preview-and-test-your-presentation](#how-to-preview-and-test-your-presentation) | Features | All | No |
| [presenter-role](#presenter-role) | Features | Pro | No |
| [resetting-the-results](#resetting-the-results) | Features | All | No |
| [collecting-audience-information](#collecting-audience-information) | Features | Pro | ✅ Yes |
| [how-to-collaborate-on-presentations-and-folders](#how-to-collaborate-on-presentations-and-folders) | Features | All | ✅ Partial |
| [moving-and-editing-multiple-slides](#moving-and-editing-multiple-slides) | Features | All | ✅ Yes |
| [reactions-on-ahaslides](#reactions-on-ahaslides) | Features | All | No |
| [slide-audio-presentation-audio-and-sound-effects](#slide-audio-presentation-audio-and-sound-effects) | Features | Pro | No |
| [changing-the-display-language](#changing-the-display-language) | Features | All | No |
| [upload-image-guidelines-for-ahaslides](#upload-image-guidelines-for-ahaslides) | Features | All | No |
| [running-a-team-quiz](#running-a-team-quiz) | Features | Pro | ✅ Partial |
| [how-to-use-youtube-slides-on-ahaslides](#how-to-use-youtube-slides-on-ahaslides) | Using Slide Types | All | ✅ Partial |
| [embedding-ahaslides-to-your-website](#embedding-ahaslides-to-your-website) | Using Slide Types | All | No |
| [how-to-show-or-hide-the-audience-get-slides-button](#how-to-show-or-hide-the-audience-get-slides-button) | Using Slide Types | All | No |
| [importing-a-powerpoint-presentation-or-pdf-file](#importing-a-powerpoint-presentation-or-pdf-file) | Features | All | No |
| [using-your-google-slides-presentation-with-ahaslides](#using-your-google-slides-presentation-with-ahaslides) | Features | Free | No |
| [generating-questions-and-answers-using-ai-on-ahaslides](#generating-questions-and-answers-using-ai-on-ahaslides) | AI-powered | All | No |
| [generating-quiz-questions-from-imported-ppt-or-pdf-files-on-ahaslides](#generating-quiz-questions-from-imported-ppt-or-pdf-files-on-ahaslides) | AI-powered | All | No |
| [how-to-use-profanity-filter](#how-to-use-profanity-filter) | Presenting | All | No |
| [setting-up-a-self-paced-presentation-on-ahaslides](#setting-up-a-self-paced-presentation-on-ahaslides) | Presenting | All | No |
| [sharing-your-presentation-for-participants-to-join](#sharing-your-presentation-for-participants-to-join) | Presenting | Pro | No |
| [your-ahaslides-presentation-report](#your-ahaslides-presentation-report) | After Presentation | All | No |
| [sharing-a-copy-of-your-presentation-with-other-ahaslides-users](#sharing-a-copy-of-your-presentation-with-other-ahaslides-users) | After Presentation | Free | No |
| [removing-and-changing-the-logo](#removing-and-changing-the-logo) | Branding | Pro | No |
| [how-to-change-and-manage-fonts](#how-to-change-and-manage-fonts) | Branding | Pro | No |
| [using-the-ahaslides-app-on-zoom](#using-the-ahaslides-app-on-zoom) | Integrations | Free | No |
| [ahaslides-mcp-getting-started-guide](#ahaslides-mcp-getting-started-guide) | Integrations | All | No |
| [managing-your-team-members](#managing-your-team-members) | Teams & Enterprise | Enterprise | No |
| [sharing-a-presentation-with-specific-team-members](#sharing-a-presentation-with-specific-team-members) | Teams & Enterprise | Pro | No |
| [white-label-multiple-accounts-and-enterprise-license-inquiries](#white-label-multiple-accounts-and-enterprise-license-inquiries) | Teams & Enterprise | Enterprise | No |
| [what-is-included-in-the-free-account](#what-is-included-in-the-free-account) | Price Plans | Free | No |
| [monthly-plan](#monthly-plan) | Price Plans | All | No |
| [annual-subscriptions](#annual-subscriptions) | Price Plans | All | No |
| [one-time-plans](#one-time-plans) | Price Plans | All | No |
| [educational-subscriptions](#educational-subscriptions) | Price Plans | All | No |
| [purchasing-multiple-licenses-for-ahaslides-team-plan-subscription](#purchasing-multiple-licenses-for-ahaslides-team-plan-subscription) | Payment | Pro | No |
| [ahaslides-payment-methods](#ahaslides-payment-methods) | Payment | All | No |
| [what-currencies-can-be-used-to-purchase](#what-currencies-can-be-used-to-purchase) | Payment | All | No |
| [how-to-add-discount-code-to-your-purchase](#how-to-add-discount-code-to-your-purchase) | Payment | All | No |
| [failed-payment](#failed-payment) | Payment | All | No |
| [billing-address](#billing-address) | Account | All | No |
| [billing-information-and-invoicereceipt](#billing-information-and-invoicereceipt) | After Purchase | All | No |
| [cancelling-your-ahaslides-subscription](#cancelling-your-ahaslides-subscription) | After Purchase | All | No |
| [refund-policy](#refund-policy) | After Purchase | All | No |
| [change-or-reset-your-password](#change-or-reset-your-password) | Account | All | No |
| [deleting-your-ahaslides-account](#deleting-your-ahaslides-account) | Account | All | No |
| [how-to-log-out-of-ahaslides-from-all-other-devices-and-browsers](#how-to-log-out-of-ahaslides-from-all-other-devices-and-browsers) | Account | Free | No |
| [sharing-your-ahaslides-account](#sharing-your-ahaslides-account) | Account | All | No |

---

## 🔍 Compare

### ahaslides-vs-mentimeter
**Plan:** Free | **MCP Actions:** No
**Summary:** A side-by-side comparison of AhaSlides and Mentimeter — covering activity types, AI and integrations, free plan limits, and pricing — so you can make an informed choice.
**File:** `compare/ahaslides-vs-mentimeter.md`

---

## 📚 Getting started

### what-is-ahaslides
**Plan:** Free | **MCP Actions:** No
**Summary:** AhaSlides is a platform to help you make interactive presentations using polls, word clouds, open-ended slides and other slide types that audiences can interact with live using their phones.
**File:** `what-is-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/what-is-ahaslides

### creating-your-ahaslides-account
**Plan:** Free | **MCP Actions:** No
**Summary:** Welcome to AhaSlides! Follow these simple steps to create your AhaSlides account, using the method that works best for you.
**File:** `creating-your-ahaslides-account.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/creating-your-ahaslides-account

### the-my-presentations-dashboard
**Plan:** All | **MCP Actions:** No
**Summary:** The Presentations section is the main area of AhaSlides where you can see and manage all of your presentations. It is the first screen you see when you log in.
**File:** `the-my-presentations-dashboard.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/the-my-presentations-dashboard

### ahaslides-template-library
**Plan:** Free | **MCP Actions:** No
**Summary:** The AhaSlides Template Library is a time-saving feature that allows you to download and customize ready-made templates for your presentations.
**File:** `ahaslides-template-library.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/ahaslides-template-library

---

## 🎮 Using slide types

### how-to-make-and-run-a-quiz
**Plan:** Free | **MCP Actions:** ✅ Yes
**Summary:** Learn everything about creating and hosting a live quiz. Build scored quiz slides (Pick Answer, Short Answer, Match Pairs, Correct Order, Categorise) and see who tops the leaderboard.
**MCP:** `create_slides(slide_type: "pick_answer_quiz" | "short_answer_quiz" | "leaderboard")`
**File:** `how-to-make-and-run-a-quiz.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-make-and-run-a-quiz

### using-the-spinner-wheel
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** The spinner wheel lets a presenter pick any entry at random by spinning the wheel. Supports up to 5,000 entries, autofill with participant names, and configurable spin duration.
**MCP:** `create_slides(slide_type: "spinner_wheel", options: [{text}], max: 50)` | `update_slide_properties_tool(type: "spinnerWheelQuestion", metadata.spinningDuration, metadata.autoFillParticipantName)`
**File:** `using-the-spinner-wheel.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-spinner-wheel

### using-the-word-cloud-slide
**Plan:** Free | **MCP Actions:** ✅ Yes
**Summary:** A word cloud lets participants submit short written responses, displayed together with the most popular appearing larger in the cloud.
**MCP:** `create_slides(slide_type: "word_cloud", heading: "...")` | `update_slide_properties_tool(type: "wordCloudQuestion", entriesPerParticipant: int)`
**File:** `using-the-word-cloud-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-word-cloud-slide

### using-the-brainstorm-slide
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** A Brainstorm slide lets participants put forward ideas and vote for their favourites, guiding audiences through submitting ideas, voting, and viewing results.
**MCP:** `create_slides(slide_type: "brainstorm", heading: "...")` | `update_slide_properties_tool(type: "brainstormActivity", limitChoice: int)`
**File:** `using-the-brainstorm-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-brainstorm-slide

### using-the-match-pairs-slide
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** The Match Pairs slide is a quiz slide where players must match a set of prompts with a set of answers. Max 4 pairs.
**MCP:** `create_slides(slide_type: "match_pairs_quiz", pairs: [{left_item, right_item}], max: 4)` | `update_slide_properties_tool(type: "matchPairsQuizQuestion", minPoint, maxPoint, timeToAnswer)`
**File:** `using-the-match-pairs-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-match-pairs-slide

### using-the-correct-order-slide
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** The Correct Order quiz slide asks participants to place randomised statements in the correct order. Max 7 items.
**MCP:** `create_slides(slide_type: "correct_order_quiz", options: [{position, text}], max: 7)` | `update_slide_properties_tool(type: "correctOrderQuizQuestion", minPoint, maxPoint, timeToAnswer)`
**File:** `using-the-correct-order-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-correct-order-slide

### using-the-pick-answer-slide
**Plan:** Free | **MCP Actions:** ✅ Yes
**Summary:** The Pick Answer slide is a scored multiple-choice quiz question where participants choose from up to 8 answer options on their phones. Mark one or more options correct, set points and a timer, and crown the winner on the leaderboard.
**MCP:** `create_slides(slide_type: "pick_answer_quiz", heading: "...", options: [{text, correct: bool}])` | `update_slide_properties_tool(type: "multipleChoiceQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)`
**File:** `using-the-pick-answer-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-pick-answer-slide

### using-the-type-answer-slide
**Plan:** Free | **MCP Actions:** ✅ Yes
**Summary:** The Type Answer slide is a scored quiz question with no options to choose from — participants type their answer, which must match one of the answers you accept. Also known as the Short Answer slide.
**MCP:** `create_slides(slide_type: "short_answer_quiz", heading: "...", correct_answer: "...")` | `update_slide_properties_tool(type: "multipleChoiceQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)`
**File:** `using-the-type-answer-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-type-answer-slide

### how-to-use-rating-scale-slides-on-ahaslides
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** Rating Scale slides allow hosts to pose a broad question with specific statements that the audience rates on a sliding scale — great for nuanced responses.
**MCP:** `create_slides(slide_type: "scale", scale_config: {low_label, high_label, low_value, high_value, must_rate, show_average, show_mid_values})`
**File:** `how-to-use-rating-scale-slides-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-use-rating-scale-slides-on-ahaslides

### using-qa
**Plan:** Free | **MCP Actions:** ✅ Yes
**Summary:** The Q&A slide lets audience members submit questions to the presenter during a live presentation.
**MCP:** `create_slides(slide_type: "q&a", heading: "...")`
**File:** `using-qa.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-qa

### adding-and-deleting-a-leaderboard-on-your-quiz
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** The Leaderboard displays rankings and scores of quiz participants. Works only with quiz slides (Pick Answer, Short Answer, Match Pairs, Correct Order, Categorise).
**MCP:** `create_slides(slide_type: "leaderboard")` | `update_slide_properties_tool(type: "leaderboard", deleted: true)`
**File:** `adding-and-deleting-a-leaderboard-on-your-quiz.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/adding-and-deleting-a-leaderboard-on-your-quiz

### how-to-use-youtube-slides-on-ahaslides
**Plan:** All | **MCP Actions:** ✅ Partial
**Summary:** AhaSlides YouTube Slides let you play YouTube videos on both the presenter and audience screen.
**MCP:** `create_slides(slide_type: "content", paragraphs: ["..."])` — No dedicated YouTube slide type in MCP.
**File:** `how-to-use-youtube-slides-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-use-youtube-slides-on-ahaslides

### how-to-show-or-hide-the-audience-get-slides-button
**Plan:** All | **MCP Actions:** No
**Summary:** Learn how to show or hide the link that invites participants to sign up to AhaSlides at the end of your presentation.
**File:** `how-to-show-or-hide-the-audience-get-slides-button.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-show-or-hide-the-audience-get-slides-button

### creating-a-poll-question-on-ahaslides
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** A Poll slide is a quick and easy way to get live opinions from your audience — ask a question, provide up to 30 answer options, and see results update live as participants vote.
**MCP:** `create_slides(slide_type: "poll", heading: "...", options: [{text}])` | `update_slide_properties_tool(type: "pollQuestion", showPercentage: bool, addCorrectOption: bool, multipleChoice: bool, limitChoice: int, typeChart: "barChart"|"donutChart"|"pieChart")`
**File:** `creating-a-poll-question-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/creating-a-poll-question-on-ahaslides

### using-the-categorise-slide
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** The Categorise slide is a quiz type where participants sort items into predefined categories on their phones — results update live. Great for knowledge checks, training, and classroom activities.
**MCP:** `create_slides(slide_type: "categorise_quiz", heading: "...", options: [{name, items[]}])` | `update_slide_properties_tool(type: "categoriseQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)`
**File:** `using-the-categorise-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-categorise-slide

### using-the-content-slide
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** The Content slide lets you create and customise text and images directly on the canvas, giving you full control over the layout.
**MCP:** `create_slides(slide_type: "content", heading: "...", paragraphs: [])` | `update_slide_properties_tool(type: "staticContent", deleted: true)`
**File:** `using-the-content-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-content-slide

### using-the-open-ended-slide
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** An Open Ended slide collects free-text responses from your audience in their own words, displayed in grid or one-by-one layout. Supports image submission.
**MCP:** `create_slides(slide_type: "open_ended_survey", heading: "...")` | `update_slide_properties_tool(type: "openEndedQuestion", layout: "grid"|"oneByOne", imageSubmission: bool)`
**File:** `using-the-open-ended-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-open-ended-slide

### using-the-ranking-slide
**Plan:** All | **MCP Actions:** ✅ Partial
**Summary:** A Ranking slide lets your audience prioritize a list of options — instead of picking a favourite, participants rank what matters most. Results update instantly.
**MCP:** `create_slides(slide_type: "poll", heading: "...", options: [{text}])` — Ranking is a poll variant.
**File:** `using-the-ranking-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-ranking-slide

### how-to-use-the-idea-board-slide
**Plan:** All | **MCP Actions:** No
**Summary:** An Idea Board slide lets your audience submit ideas organized into themes in real time, helping you spot patterns and turn raw feedback into structured insights.
**File:** `how-to-use-the-idea-board-slide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-use-the-idea-board-slide

### using-the-surveys-tool
**Plan:** All | **MCP Actions:** No
**Summary:** AhaSlides Surveys let you collect structured, multi-question feedback in two modes: share a standalone link for async responses, or add the Survey as a slide in your presentation deck so your live audience completes it on the spot. Both modes use the same survey — build it once in the Surveys section of the dashboard, then choose how to launch it.
**File:** `using-the-surveys-tool.md`
**Video:** https://www.youtube.com/watch?v=LXRHtEqirN0 (supersedes m6fRdEv3Cqg — please delete old video in YouTube Studio)

### using-the-content-v2-slide
**Plan:** All | **MCP Actions:** No
**Summary:** The Content v2 slide is a fully flexible design canvas for creating polished, layout-driven slides. Start from a ready-made layout or build your own by inserting text, callout, visual, media, and data blocks from scratch.
**File:** `using-the-content-v2-slide.md`

### using-the-diagram-slide
**Plan:** All | **MCP Actions:** No (slide_type string unconfirmed — see draft)
**Summary:** The Diagram slide lets you build and display visual diagrams — such as flowcharts, mind maps, or org charts — directly in your AhaSlides presentation, turning complex relationships into clear, structured visuals for your audience.
**File:** `using-the-diagram-slide.md`

### using-the-pin-on-image-slide
**Plan:** All | **MCP Actions:** No
**Summary:** The Pin on Image slide lets participants tap or click to place a pin anywhere on a custom image — great for heatmaps, location spotting, diagram labelling, and spatial feedback.
**File:** `using-the-pin-on-image-slide.md`

### embedding-ahaslides-to-your-website
**Plan:** All | **MCP Actions:** No
**Summary:** Embed AhaSlides into your website using an iframe code pointing to your presentation's audience link.
**File:** `embedding-ahaslides-to-your-website.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/embedding-ahaslides-to-your-website

---

## ⚙️ Features and functions

### adding-notes-to-your-presentation
**Plan:** All | **MCP Actions:** No
**Summary:** Write speaker notes for each slide. During your presentation, notes are visible on your monitor via Remote Control — your audience cannot see them.
**File:** `adding-notes-to-your-presentation.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/adding-notes-to-your-presentation

### how-to-preview-and-test-your-presentation
**Plan:** All | **MCP Actions:** No
**Summary:** Preview mode lets you see how your presentation will look on both your and your audience's devices, and interact with your own slides before going live.
**File:** `how-to-preview-and-test-your-presentation.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-preview-and-test-your-presentation

### presenter-role
**Plan:** Pro | **MCP Actions:** No
**Summary:** Allow multiple presenters to run the same presentation simultaneously without affecting each other. The owner can view reports from all sessions separately.
**File:** `presenter-role.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/presenter-role

### resetting-the-results
**Plan:** All | **MCP Actions:** No
**Summary:** Clear all participant submissions from a presentation to reuse it for a new audience. Slide content (questions, options) is unaffected — only responses are erased.
**File:** `resetting-the-results.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/resetting-the-results

### collecting-audience-information
**Plan:** Pro | **MCP Actions:** ✅ Yes
**Summary:** Collect audience info (names, email, organisation) before participants join or while they answer an Open-Ended or Brainstorm slide.
**MCP:** `create_slides(slide_type: "open_ended_survey")` | `update_slide_properties_tool(type: "openEndedQuestion", layout: "grid"|"oneByOne", imageSubmission: bool)`
**File:** `collecting-audience-information.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/collecting-audience-information

### how-to-collaborate-on-presentations-and-folders
**Plan:** All | **MCP Actions:** ✅ Partial
**Summary:** Collaborative editing lets you work together on presentations or folders with other AhaSlides users, within your team or externally.
**MCP:** `create_presentation_tool(name: "...", lang: "en")` — Folder/sharing management via web UI only.
**File:** `how-to-collaborate-on-presentations-and-folders.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-collaborate-on-presentations-and-folders

### moving-and-editing-multiple-slides
**Plan:** All | **MCP Actions:** ✅ Yes
**Summary:** Learn how to move, edit and delete multiple slides at once, with and without Grid View.
**MCP:** `move_slide(slide_id, presentation_id, insert_after_slide_id)` | `update_slide_properties_tool(deleted: true)` | `skip_slide_when_presenting(slide_id, skip_when_presenting: bool)`
**File:** `moving-and-editing-multiple-slides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/moving-and-editing-multiple-slides

### running-a-team-quiz
**Plan:** Pro | **MCP Actions:** ✅ Partial
**Summary:** Set up a quiz to be played in teams, with custom scoring rules and team names. Available on Edu Medium, Edu Large, Pro, and Enterprise plans.
**MCP:** `create_slides(slide_type: "pick_answer_quiz")` — Team settings configured via web UI only.
**File:** `running-a-team-quiz.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/running-a-team-quiz

### reactions-on-ahaslides
**Plan:** All | **MCP Actions:** No
**Summary:** Let your audience send reactions (Like, Love, Haha, Wow, Sad) during your presentation via the Settings menu.
**File:** `reactions-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/reactions-on-ahaslides

### slide-audio-presentation-audio-and-sound-effects
**Plan:** Pro | **MCP Actions:** No
**Summary:** Enhance presentations with slide or presentation-level audio and sound effects. Available on Pro and Enterprise plans.
**File:** `slide-audio-presentation-audio-and-sound-effects.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/slide-audio-presentation-audio-and-sound-effects

### changing-the-display-language
**Plan:** All | **MCP Actions:** No
**Summary:** Create, navigate, and display presentations in multiple languages. Change language settings on the presenter interface and audience app.
**File:** `changing-the-display-language.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/changing-the-display-language

### importing-a-powerpoint-presentation-or-pdf-file
**Plan:** All | **MCP Actions:** No
**Summary:** Import a PowerPoint (PPT/PPTX) or PDF into AhaSlides and add interactive slides between your existing slides. Import via web UI only.
**File:** `importing-a-powerpoint-presentation-or-pdf-file.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/importing-a-powerpoint-presentation-or-pdf-file

### using-your-google-slides-presentation-with-ahaslides
**Plan:** Free | **MCP Actions:** No
**Summary:** Import your Google Slides presentation into AhaSlides and add interactive elements to bring it to life. Import via web UI only.
**File:** `using-your-google-slides-presentation-with-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-your-google-slides-presentation-with-ahaslides

### upload-image-guidelines-for-ahaslides
**Plan:** All | **MCP Actions:** No
**Summary:** Supports JPEG, PNG, GIF. Max 15MB upload. Recommended 2K resolution (2560×1440) for full-screen backgrounds.
**File:** `upload-image-guidelines-for-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/upload-image-guidelines-for-ahaslides

---

## 🤖 AI-powered features

### generating-questions-and-answers-using-ai-on-ahaslides
**Plan:** All | **MCP Actions:** No
**Summary:** Use AI to generate quiz and poll questions with answer options automatically. Works for pick-answer quizzes, short-answer quizzes, and polls.
**File:** `generating-questions-and-answers-using-ai-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/generating-questions-and-answers-using-ai-on-ahaslides

### generating-quiz-questions-from-imported-ppt-or-pdf-files-on-ahaslides
**Plan:** All | **MCP Actions:** No
**Summary:** Import a PPT, PDF, or image file and let AI generate interactive quiz slides from your content — saves time and boosts engagement for training sessions.
**File:** `generating-quiz-questions-from-imported-ppt-or-pdf-files-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/generating-quiz-questions-from-imported-ppt-or-pdf-files-on-ahaslides

---

## 🎤 Presenting

### how-to-use-profanity-filter
**Plan:** All | **MCP Actions:** No
**Summary:** The profanity filter blocks swear words submitted by participants across word clouds, open-ended slides, Q&A, short answer quizzes, and name fields.
**File:** `how-to-use-profanity-filter.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-use-profanity-filter

### setting-up-a-self-paced-presentation-on-ahaslides
**Plan:** All | **MCP Actions:** No
**Summary:** In self-paced mode, participants proceed through a presentation at their own speed without a live host — ideal for async quizzes and surveys.
**File:** `setting-up-a-self-paced-presentation-on-ahaslides.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/setting-up-a-self-paced-presentation-on-ahaslides

### sharing-your-presentation-for-participants-to-join
**Plan:** Pro | **MCP Actions:** No
**Summary:** Learn how to share your presentation code with participants so they can start responding to your questions.
**File:** `sharing-your-presentation-for-participants-to-join.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/sharing-your-presentation-for-participants-to-join

### sharing-a-copy-of-your-presentation-with-other-ahaslides-users
**Plan:** Free | **MCP Actions:** No
**Summary:** Share a copy of your presentation with other AhaSlides users so they can copy it to their own accounts.
**File:** `sharing-a-copy-of-your-presentation-with-other-ahaslides-users.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/sharing-a-copy-of-your-presentation-with-other-ahaslides-users

---

## 📊 After the presentation

### your-ahaslides-presentation-report
**Plan:** All | **MCP Actions:** No
**Summary:** The Presentation Report provides detailed insights into your audience's engagement — statistics on participant interactions, individual scores, and written feedback to evaluate your presentation's impact.
**File:** `your-ahaslides-presentation-report.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/your-ahaslides-presentation-report

---

## 🎨 Branding

### removing-and-changing-the-logo
**Plan:** Pro | **MCP Actions:** No
**Summary:** Remove and change the default AhaSlides logo across all slides in your presentation. Pro and Enterprise only.
**File:** `removing-and-changing-the-logo.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/removing-and-changing-the-logo

### how-to-change-and-manage-fonts
**Plan:** Pro | **MCP Actions:** No
**Summary:** Change the font used throughout your AhaSlides presentation and arrange favourite fonts for easy access. Pro and Enterprise only.
**File:** `how-to-change-and-manage-fonts.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-change-and-manage-fonts

---

## 🔗 Integrations

### using-the-ahaslides-app-on-zoom
**Plan:** Free | **MCP Actions:** No
**Summary:** Install the AhaSlides app from the Zoom Marketplace and run interactive presentations directly inside Zoom meetings or webinars. Desktop only (PC/laptop); Zoom mobile is not supported. Only the host needs an AhaSlides account.
**File:** `using-the-ahaslides-app-on-zoom.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/using-the-ahaslides-app-on-zoom

### ahaslides-mcp-getting-started-guide
**Plan:** All | **MCP Actions:** Not applicable
**Summary:** The AhaSlides MCP server lets AI assistants like Claude create presentations, build quizzes, manage slides, and analyse responses just by describing what you want in plain language.
**File:** `ahaslides-mcp-getting-started-guide.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/ahaslides-mcp-getting-started-guide

---

## 👥 Teams & enterprise

### managing-your-team-members
**Plan:** Enterprise | **MCP Actions:** No
**Summary:** As team Owner, add/remove team members, set roles (Member/Admin), and manage licences from the Team Members tab.
**File:** `managing-your-team-members.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/managing-your-team-members

### sharing-a-presentation-with-specific-team-members
**Plan:** Pro | **MCP Actions:** No
**Summary:** Share a presentation with selected team members individually, rather than making it accessible to the whole team workspace.
**File:** `sharing-a-presentation-with-specific-team-members.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/sharing-a-presentation-with-specific-team-members

### white-label-multiple-accounts-and-enterprise-license-inquiries
**Plan:** Enterprise | **MCP Actions:** No
**Summary:** For bulk licences or White Label (no AhaSlides branding), contact hi@ahaslides.com. White Label lets you use AhaSlides as your own software.
**File:** `white-label-multiple-accounts-and-enterprise-license-inquiries.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/white-label-multiple-accounts-and-enterprise-license-inquiries

---

## 💳 Price plans

### what-is-included-in-the-free-account
**Plan:** Free | **MCP Actions:** No
**Summary:** Free plan includes up to 50 live participants, unlimited presentations, and AI features. Free accounts support up to 5 Quiz or 3 Poll-type slides before a 3-participant limit applies.
**File:** `what-is-included-in-the-free-account.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/what-is-included-in-the-free-account

### monthly-plan
**Plan:** All | **MCP Actions:** No
**Summary:** Monthly plans auto-renew every month. If you only need one month, purchase then turn off auto-renewal.
**File:** `monthly-plan.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/monthly-plan

### annual-subscriptions
**Plan:** All | **MCP Actions:** No
**Summary:** The Annual Plan is the most cost-effective option — save up to 67% compared to monthly billing.
**File:** `annual-subscriptions.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/annual-subscriptions

### one-time-plans
**Plan:** All | **MCP Actions:** No
**Summary:** The One-Time plan activates when a presentation reaches 8 participants and stays active for 24 hours of unlimited presentations.
**File:** `one-time-plans.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/one-time-plans

### educational-subscriptions
**Plan:** All | **MCP Actions:** No
**Summary:** Teachers, students, and NGOs can claim a discounted Educational Plan billed annually.
**File:** `educational-subscriptions.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/educational-subscriptions

---

## 💰 Payment

### ahaslides-payment-methods
**Plan:** All | **MCP Actions:** No
**Summary:** Purchase AhaSlides plans with cards or credit balance. Payments handled securely by Stripe.
**File:** `ahaslides-payment-methods.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/ahaslides-payment-methods

### purchasing-multiple-licenses-for-ahaslides-team-plan-subscription
**Plan:** Pro | **MCP Actions:** No
**Summary:** Step-by-step guide to purchasing multiple licences for the AhaSlides Team Plan subscription — enabling collaborative features across your organisation.
**File:** `purchasing-multiple-licenses-for-ahaslides-team-plan-subscription.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/purchasing-multiple-licenses-for-ahaslides-team-plan-subscription

### what-currencies-can-be-used-to-purchase
**Plan:** All | **MCP Actions:** No
**Summary:** AhaSlides accepts USD. International cards are automatically converted by your bank.
**File:** `what-currencies-can-be-used-to-purchase.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/what-currencies-can-be-used-to-purchase

### how-to-add-discount-code-to-your-purchase
**Plan:** All | **MCP Actions:** No
**Summary:** On the Checkout page, find 'Add promotion code' under the Subtotal section, enter your code, and click Apply.
**File:** `how-to-add-discount-code-to-your-purchase.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-add-discount-code-to-your-purchase

### failed-payment
**Plan:** All | **MCP Actions:** No
**Summary:** If your credit card was declined, this is usually caused by your bank's automated systems. Learn how to resolve payment failures.
**File:** `failed-payment.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/failed-payment

---

## 👤 Account management

### change-or-reset-your-password
**Plan:** All | **MCP Actions:** No
**Summary:** Change or reset your password from My Profile → Change password section.
**File:** `change-or-reset-your-password.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/change-or-reset-your-password

### billing-address
**Plan:** All | **MCP Actions:** No
**Summary:** Add billing address and other information into your receipt via My Profile → Billing Address section.
**File:** `billing-address.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/billing-address

### how-to-log-out-of-ahaslides-from-all-other-devices-and-browsers
**Plan:** Free | **MCP Actions:** No
**Summary:** The 'Log out everywhere' function logs you out from all other devices and browsers simultaneously.
**File:** `how-to-log-out-of-ahaslides-from-all-other-devices-and-browsers.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/how-to-log-out-of-ahaslides-from-all-other-devices-and-browsers

### sharing-your-ahaslides-account
**Plan:** All | **MCP Actions:** No
**Summary:** Each AhaSlides account is personal — sharing violates Terms of Use and may cause data loss. Presenters need personal accounts.
**File:** `sharing-your-ahaslides-account.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/sharing-your-ahaslides-account

### deleting-your-ahaslides-account
**Plan:** All | **MCP Actions:** No
**Summary:** How to permanently delete your AhaSlides account at any time.
**File:** `deleting-your-ahaslides-account.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/deleting-your-ahaslides-account

---

## 🧾 After purchase

### billing-information-and-invoicereceipt
**Plan:** All | **MCP Actions:** No
**Summary:** Access and download invoices and receipts directly from the AhaSlides website. Update billing details before payment for correct invoice information.
**File:** `billing-information-and-invoicereceipt.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/billing-information-and-invoicereceipt

### cancelling-your-ahaslides-subscription
**Plan:** All | **MCP Actions:** No
**Summary:** Turn off auto-renewal for your subscription. Monthly plans renew after 1 month, yearly plans after 1 year.
**File:** `cancelling-your-ahaslides-subscription.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/cancelling-your-ahaslides-subscription

### refund-policy
**Plan:** All | **MCP Actions:** No
**Summary:** Eligible for a full refund within 14 days of subscribing if AhaSlides has not been used at a live event.
**File:** `refund-policy.md` | **Portal:** https://help.ahaslides.com/portal/en/kb/articles/refund-policy

---

## 🔧 MCP tools reference (AhaSlides)

> Quick reference for all AhaSlides MCP tools used across articles.

| Tool | What it does |
|------|-------------|
| `create_presentation_tool(name, lang?)` | Create a new empty presentation |
| `create_slides(slides[], presentation_id, insert_after_slide_id?)` | Add one or more slides to a presentation |
| `update_slide_content(...)` | Update the content/text of an existing slide |
| `update_slide_properties_tool(slides[], presentation_id)` | Update slide settings (points, time, delete, skip, etc.) |
| `move_slide(slide_id, presentation_id, insert_after_slide_id?)` | Move a slide to a different position |
| `skip_slide_when_presenting(slide_id, skip_when_presenting)` | Show/hide a slide during live presentation |
| `get_presentation_detail_tool(presentation_id)` | Get full details of a presentation including all slide IDs |

### Slide types available via `create_slides`
| slide_type | Description |
|-----------|-------------|
| `pick_answer_quiz` | Multiple choice quiz — mark correct answers |
| `short_answer_quiz` | Open quiz with a correct text answer |
| `match_pairs_quiz` | Match prompts to answers (max 4 pairs) |
| `correct_order_quiz` | Put items in correct order (max 7) |
| `categorise_quiz` | Classify items into groups |
| `spinner_wheel` | Random entry picker (max 50 options) |
| `scale` | Rating scale slide |
| `poll` | Multiple choice poll (unscored) |
| `word_cloud` | Word cloud from audience responses |
| `brainstorm` | Idea submission + voting |
| `q&a` | Live audience Q&A |
| `open_ended_survey` | Collect audience info (name, email, org) |
| `leaderboard` | Quiz leaderboard |
| `content` | Static text/image content slide |
| `listing` | Bullet list slide |
| `qr_code` | QR code slide |
| `presentation_title` | Title slide |

---

*Last synced from Zoho Desk: 2026-06-18 | org_id: 736517018*
