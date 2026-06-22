---
id:
title: Using the Type Answer Slide
status: Published
permalink: using-the-type-answer-slide
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-06-22
tags: ["quiz", "type answer", "short answer", "accepted answer", "scored", "ahaslides"]
keywords: ["type answer", "short answer quiz", "typed answer", "accepted answers", "correct answer to display", "open question", "scored question", "leaderboard"]
summary: The Type Answer slide is a scored quiz question with no options to choose from — participants type their answer, which must match one of the answers you accept. Harder to guess than multiple choice, it gives a truer picture of what your audience knows.
plan_required: Free
portal_url: https://help.ahaslides.com/portal/en/kb/articles/using-the-type-answer-slide
related_articles: ["how-to-make-and-run-a-quiz", "using-the-pick-answer-slide", "adding-and-deleting-a-leaderboard-on-your-quiz", "how-to-use-profanity-filter"]
mcp_actions:
  create: 'create_slides(slide_type: "short_answer_quiz", heading: "...", correct_answer: "...")'
  configure: 'update_slide_properties_tool(type: "multipleChoiceQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)'
  delete: 'update_slide_properties_tool(type: "multipleChoiceQuizQuestion", deleted: true)'
description: "The Type Answer slide is a scored quiz question with no options to choose from — participants type their answer, which must match one of the answers you accept. Harder to guess than multiple choice, it gives a truer picture of what your audience knows."
---

# Using the Type Answer Slide

The Type Answer slide is an open quiz question with no options to pick from. Instead of choosing, participants *type* their answer — which must match one of the answers you accept to score points. With no multiple choice to guess from, it's a much truer test of what your audience actually knows.

> 💡 The Type Answer slide is also referred to as the **Short Answer** slide in some places — they are the same quiz slide type.

## How the Type Answer slide works

The Type Answer slide is a quiz slide type and forms part of a [quiz](how-to-make-and-run-a-quiz.md).

When you present a Type Answer slide, every player sees the question and a text box on their device. They type their answer and submit before the timer runs out. An answer scores points if it matches the **correct answer to display** or any of the **other accepted answers** you've listed.

Because there are no options to choose from, guessing is much harder than on a [Pick Answer](using-the-pick-answer-slide.md) slide — which makes Type Answer a more accurate reflection of your participants' subject knowledge.

## Setting up your Type Answer slide

### 1. Add the slide

In the editor, create a new slide and select **Type Answer** from the **Quiz** section of the slide type picker.

### 2. Write your question

Type your question in the **Your question** field in the right-hand column.

### 3. Add the correct answer to display

Enter the **correct answer to display**. This is the main answer you accept, and the only one shown on screen when the timer is up. If a player types something that matches one of your *other accepted answers* instead, it still counts as correct and scores points — it just won't be the answer displayed on the results screen.

### 4. Add other accepted answers

Add any **other accepted answers** — alternatives besides the "correct answer to display" that you also want to mark correct and award points for.

> 💡 Tip
>
> If you want to accept misspellings, add as many likely misspellings of the answer as you can think of into the **other accepted answers** field. Type Answer matches against the exact answers you list, so spelling variants you don't add won't be counted automatically.

### 5. Adjust the settings

Set the **time**, **points**, and other settings just as you would on any other quiz slide:

- **Points** — The maximum and minimum points possible for the question. With *Faster answers get more points* off, every correct answer receives the maximum.
- **Faster answers get more points** — Toggle on to reward players who answer sooner.
- **Time limit** — The number of seconds each player has to type their answer.
- **Leaderboard** — Toggle on to add a leaderboard slide automatically after this question.

> 👉 Because players type free text, the Type Answer slide is eligible for the [profanity filter setting](how-to-use-profanity-filter.md), which blocks banned words entered by audience members.

## The results display

After your participants have submitted their answers and the correct answer is revealed, the results screen shows:

1. The **correct answer to display**.
2. **Incorrect answers:**
   - If there are 4 or fewer different incorrect answers, each one is displayed.
   - If there are 5 or more, three incorrect answers are displayed along with an **other answers** entry that groups together every remaining incorrect answer.

## Manually accepting answers

Sometimes a player types an answer that doesn't exactly match any of your accepted answers, but you still consider it correct (a synonym, an abbreviation, a typo you didn't anticipate). You can accept these on the fly.

Once the question results are shown, an **Accept more answers** button appears at the bottom of the slide. Click it to bring up every answer players submitted for that question.

- **Click the circle** in the top-right corner of any answer box to accept that answer and award its points.
- Answers are grouped when identical and arranged by how many players wrote them, so the most common "technically incorrect" answers — the ones you're most likely to accept — appear first. You can also see who entered each answer.

When you've accepted everything you want, click **See full results**.

## Previewing and presenting

Click **Preview** in the top header to rehearse the slide from both the presenter and player view before going live. When you're ready, click **Present** — players join at the access code, enter their name, and type their answers on their phones.

> 💡 For the full walkthrough of building and hosting a quiz — joining, the lobby, team play, and more — see [How to make and run a quiz](how-to-make-and-run-a-quiz.md).

## How to create a good Type Answer slide

- **Ask for a short, specific answer** — a single word, name, number, or short phrase works best when players are typing on a phone.
- **List every reasonable accepted answer** — synonyms, abbreviations, and common misspellings — so you don't have to accept them manually under time pressure.
- **Avoid questions with many valid phrasings** — "Name a benefit of exercise" has too many right answers; "What organ pumps blood?" has one.
- **Use it where guessing would undermine the quiz** — vocabulary, capitals, formulas, dates, and definitions are ideal.

## Common use cases

- **Classroom recall** — spelling, vocabulary, capitals, dates, and formulas where you want genuine recall, not recognition.
- **Corporate training** — confirm trainees can produce a key term or figure from memory, not just recognise it in a list.
- **Trivia nights** — make rounds harder and more rewarding by removing the multiple-choice safety net.
- **Brand and product knowledge** — check that staff can name a value, feature, or policy unprompted.
