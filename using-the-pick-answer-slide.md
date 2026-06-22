---
id:
title: Using the Pick Answer Slide
status: Published
permalink: using-the-pick-answer-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-22
tags: ["quiz", "pick answer", "multiple choice", "scored", "ahaslides"]
keywords: ["pick answer", "multiple choice quiz", "scored question", "quiz slide", "correct answer", "partial scoring", "points", "leaderboard"]
summary: The Pick Answer slide is a scored multiple-choice quiz question where participants choose from up to 8 answer options on their phones. Mark one or more options correct, set points and a timer, and crown the winner on the leaderboard.
plan_required: Free
zoho_url:
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-pick-answer-slide
related_articles: ["how-to-make-and-run-a-quiz", "using-the-type-answer-slide", "adding-and-deleting-a-leaderboard-on-your-quiz", "generating-questions-and-answers-using-ai-on-ahaslides"]
mcp_actions:
  create: 'create_slides(slide_type: "pick_answer_quiz", heading: "...", options: [{text, correct: bool}])'
  configure: 'update_slide_properties_tool(type: "multipleChoiceQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)'
  delete: 'update_slide_properties_tool(type: "multipleChoiceQuizQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "The Pick Answer slide is a scored multiple-choice quiz question where participants choose from up to 8 answer options on their phones. Mark one or more options correct, set points and a timer, and crown the winner on the leaderboard."
---

# Using the Pick Answer Slide

The Pick Answer slide is the classic multiple-choice quiz question. Participants pick from a set of answer options on their phones, score points for getting it right — and the faster they answer, the more points they earn.

## How the Pick Answer slide works

The Pick Answer slide is a quiz slide type and forms part of a [quiz](how-to-make-and-run-a-quiz.md).

When you present a Pick Answer slide, every player sees the question and the answer options at the same time on their own device. They tap the option they think is correct before the timer runs out. Players who answer correctly — and quickly — climb the leaderboard.

Unlike a [Poll](creating-a-poll-question-on-ahaslides.md), which looks similar but simply gathers opinions, a Pick Answer slide is *scored*: it has a correct answer, awards points, and asks players for their names so they can compete.

## Setting up your Pick Answer slide

### 1. Add the slide

In the editor, create a new slide and select **Pick Answer** from the **Quiz** section of the slide type picker.

### 2. Write your question

In the right-hand column, type your question in the **Your question** field.

### 3. Add your answer options

Write up to **8 answer options** for players to choose from. Mark at least one option as correct by checking the box next to it.

You can also let AI generate the answer options for you — see [generating questions and answers using AI](generating-questions-and-answers-using-ai-on-ahaslides.md).

> 💡 Multiple correct answers
>
> You can mark more than one option as correct. When you do, players are able to select multiple answers, and a **Partial scoring** option appears (see below).

### 4. Adjust the settings

Each quiz slide has its own settings. Scroll down in the right-hand column to configure scoring and timing:

- **Points** — Set the maximum and minimum points possible for the question. If *Faster answers get more points* is off, any correct answer receives the maximum.
- **Faster answers get more points** — Toggle this on (the default) to reward speed. For example, with a 100-second time limit and a max of 100 points, a player who answers with 80 seconds left earns 80 points.
- **Time limit** — The number of seconds each player has to answer.
- **Leaderboard** — Toggle this on to add a leaderboard slide automatically right after this question.

### 5. Partial scoring (multiple correct answers only)

When you mark more than one option as correct, a **Partial scoring** toggle appears:

1. **On** — Players score points for each correct answer they select, but choosing any incorrect answer results in 0 points.
2. **Off** — Players must select *all* correct answers to score any points.

### 6. Add hints (optional)

You can add hints to help players out. Only the presenter chooses to reveal a hint during a question.

1. Click the **Add hint** button above your question.
2. Write up to 3 hints.
3. The first hint appears in a yellow box below your question. While presenting, press the arrow to reveal each subsequent hint. Hints appear on both the presenter's screen and the audience's screens.

> 💡 Hints are currently available only on the Pick Answer slide.

🎧 On the **Pro or Enterprise** plan, you can also add accompanying [audio](slide-audio-presentation-audio-and-sound-effects.md) to your quiz questions.

## Previewing and presenting

Click **Preview** in the top header to rehearse the slide from both the presenter and player view — no participants needed.

When you're ready, click **Present**. Players join at the access code shown on screen, enter their name, and answer each question on their phones. As the timer counts down, results fill in on your presenter screen, and the leaderboard reshuffles after each question.

> 💡 For the full walkthrough of building and hosting a quiz — joining, the lobby, team play, and more — see [How to make and run a quiz](how-to-make-and-run-a-quiz.md).

## Audience experience

On their phones, players see the question and tap the answer option they think is correct. If you've marked several options correct, they can select more than one before submitting. When the timer ends, the correct answer is revealed, points are awarded, and players see where they rank.

## How to create a good Pick Answer slide

- **Keep options short and distinct** — clear, single-idea answers are easier to read and tap on a phone.
- **Use 3–4 options for most questions** — enough to make players think without overwhelming them. Eight is the maximum, but rarely necessary.
- **Make distractors plausible** — wrong answers that are obviously wrong don't test anything.
- **Use multiple correct answers and partial scoring** for "select all that apply" questions where you want to reward partial knowledge.
- **Add a hint** for harder questions so you can rescue a stuck audience without giving the answer away outright.

## Common use cases

- **Classroom knowledge checks** — quick comprehension questions during or after a lesson, with the leaderboard adding friendly competition.
- **Corporate training and onboarding** — verify that policies, product facts, or compliance points have landed.
- **Trivia and icebreakers** — fast, fun rounds that energise meetings, webinars, and events.
- **Live audience polling with a "right" answer** — when you want to test the room's knowledge rather than just gather opinions.
