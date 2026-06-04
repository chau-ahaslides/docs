---
id: 570272000000633069
title: How to Make and Run a Quiz
status: Published
permalink: how-to-make-and-run-a-quiz
category: Using Slide Types on AhaSlides
category_id: 570272000074885296
permission: ALL
last_updated: 2026-05-07
tags: [quiz, deduct, test, emoji, sound, teamplay, trivia, run, avatar, point, result, leaderboard, quiz question, music, name, host, ahaslides, create, audio, embed, live]
keywords: [Quiz, Test, Play, Run, Host, Trivia, Quiz question]
summary: Learn everything about creating and hosting a live quiz for your audience. On AhaSlides, you can host a live quiz and have all of your participants competing for points using quiz question slides and a leaderboard.
plan_required: Free
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000000633069
portal_url: https://help.ahaslides.com/portal/en/kb/articles/how-to-make-and-run-a-quiz
related_articles: [adding-and-deleting-a-leaderboard-on-your-quiz, generating-questions-and-answers-using-ai-on-ahaslides, using-the-match-pairs-slide, slide-and-presentation-audio, running-a-team-quiz, setting-up-a-self-paced-presentation-on-ahaslides, sharing-a-presentation-to-your-participants, your-ahaslides-presentation-report, resetting-the-results, how-to-preview-your-presentation]
mcp_actions:
  create_pick_answer: 'create_slides(slide_type: "pick_answer_quiz", heading: "...", options: [{text, correct: bool}])'
  create_short_answer: 'create_slides(slide_type: "short_answer_quiz", heading: "...", correct_answer: "...")'
  create_leaderboard: 'create_slides(slide_type: "leaderboard")'
  configure: 'update_slide_properties_tool(type: "multipleChoiceQuizQuestion", minPoint, maxPoint, timeToAnswer, fastAnswerGetMorePoint)'
  delete: 'update_slide_properties_tool(type: "multipleChoiceQuizQuestion", deleted: true)'
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
---

On AhaSlides, you can host a live quiz and have all of your participants competing for points. Build a quiz using quiz question slides and see who ranks top of the leaderboard at the end!

## Video and Interactive demo: How to Make a Live Quiz on AhaSlides

This video explains how to make a live quiz, including everything in this article. If you are looking for a specific part in the video, please click the bottom-right button to watch it on YouTube, where you can find each section time-stamped in the video description.

> 📹 [Watch video](https://www.youtube.com/embed/mj5VdtHqh5M)

Below is an interactive demo, which will help you experience this function:

> 📹 [Watch video](https://capture.navattic.com/cmma91d5i000004l89f6i63x4)

## How Does a Quiz Work?

In a quiz, participants in your presentation compete against each other to get the most points by submitting the most correct answers to your quiz questions.

You progress through the quiz, pausing at each slide for players to answer the question on that slide. All players will see a question at the same time on their personal devices, they will be able to submit the answer from there before the time runs out.

Here you can see the screens of the **quiz host** (on the left-hand computer) and the **quiz player** (on the right-hand phone).

![](https://help.ahaslides.com/galleryDocuments/edbsnfa365e53ee980c08fb39d223bf1325e21eef04d28046db065138b2c7af6b05931497da888f2128f5682c1c719bdf1bd0?inline=true)

### Step 1: Choosing a Quiz Slide

On the presentation editor, create a new slide and select any of the 5 'quiz' slides as the format for that question (Spinner Wheel is *not* a scored quiz slide).

1. **Pick Answer**: A multiple-choice question with text or image answers.
2. **Short Answer**: An open question with no answers to choose from. Players must type their answers.
3. **Match Pairs**: A question with a set of prompts and a set of answers. Players must match the prompt to the right answer.
4. **Correct Order**: A question with statements in random order. Players must put the statements in the correct order.
5. **Categorise:** A question with categorized items. The player must classify the provided items into the corresponding groups.

**15-Second Explainer ⏰: Leaderboard Slides** 🏆

> 📹 [Watch video](https://www.youtube.com/embed/99CdgXDTs58)

Once you have selected your quiz slide, a leaderboard slide will automatically generate after it.

**Please note that the leaderboard slide will not update in real-time**. **It fetches the latest results only when you refresh it or return/move to it from another slide**, as it's designed for live presentations.

You can also use a **Pop-up Leaderboard** by pressing **L** on your keyboard (or clicking the **Trophy icon** in the control bar).

![](https://help.ahaslides.com/galleryDocuments/edbsn5c6d02f5652644a3b77bf3a2e0c22b4561607cee16c6b1827f4fec1ae929e65cf5f52ca395ae289f90e5db2132d64c3e?inline=true)

More details can be found in this article: [Adding and Deleting a Leaderboard on your Quiz]([[adding-and-deleting-a-leaderboard-on-your-quiz]])

### Step 2: Editing a Quiz Slide

Now you are able to edit your slide. Here's what a 'pick answer' slide will look like when it's ready to edit:

![](https://help.ahaslides.com/galleryDocuments/edbsne585ab5d1c28f5be1a5c1a81623dae58ebbfa792d9a474ce56622879b1aa72091eec594974ada28dfdaf53b9ca4316bc?inline=true)

**Write your question** - In the right-hand column, write your question in the box labelled 'Your question'.

**Write your answer options or Generate options** - Write up to 8 answer options for your players to choose from. Mark at least one of the options as correct by checking the box next to it. Or generate answers with AI-powered, helping you quickly create answer options for your questions ([See here for more]([[generating-questions-and-answers-using-ai-on-ahaslides]])).

With your question and answer options filled in, your slide will update automatically:

![](https://help.ahaslides.com/galleryDocuments/edbsnf654294c3977f95bc6cd0990b43d70ac6cb9c28120abbe9aafeb7fd69500e28ae3b43a6acf0d034ad58542d5add07f62?inline=true)

**3. Change the settings** - Each quiz slide in your quiz has its own settings. Scroll down in the right-hand column to find the settings for your quiz question:

- **Points:** The maximum and minimum number of points it is possible to get on that question. If the *'Faster answers get more points'* box is unchecked, then any correct answer will receive the maximum number of points.
- **Faster answers get more points:** Enable this option to encourage players to answer quicker. For example, if the *'time to answer'* is 100 seconds and the *'reward points'* is set to 100 maximum and 0 minimum, then a player submitting their answer with 80 seconds left will receive 80 points.
- **Time limit:** The amount of seconds each player has to answer the question.
- **Leaderboard:** If this option is enabled, a leaderboard will be added right after this slide.

🌘 **Partial Scoring**

When you're setting up a Pick Answer slide, you can mark multiple answers as correct. If you do so, participants will be able to pick more than one answer, and the option for 'Partial scoring' will appear:

![](https://help.ahaslides.com/galleryDocuments/edbsnf654294c3977f95bc6cd0990b43d70ac110bce50dcc26abaa637dd3e670c8a4738ebd9af9b24b2121399209484b6b443?inline=true)

You can then choose if you want to toggle partial scoring On or Off.

1. **On** - Players score points for each correct answer, but any incorrect answer will result in 0 points.
2. **Off** - Players must select all correct answers to score points.

It is also possible to toggle on partial scoring on the **Match Pairs** and **Categorise** slide types. [Click here to read how it works]([[using-the-match-pairs-slide]]).

**Adding Hints**

You can add hints to your quiz questions to help out players. Only the presenter can choose to reveal a hint during a question.

1. Click the '**Add hint**' button above your question.
2. Write up to 3 hints in the boxes.
3. Your first hint will appear in a yellow box below your question. When presenting, you can press the arrow to reveal your next hint.

![](https://help.ahaslides.com/galleryDocuments/edbsn74ad38c707745bb83193fdb803ebbb3be2c47baac975bf0d6f69d6ff376b0f407fbc803930a03c2990d82a726cb00b24?inline=true)

Hints will appear both on the presenter's screen and the audience's screens.

💡 **Please note that this feature is currently only available on the Pick Answer slide.**

🎧 **Adding Audio**

If you are on the **Pro or Enterprise** plan, you can also add accompanying audio to your quiz questions. [Check this guide out for more]([[slide-and-presentation-audio#Audio_on_Quiz_Slides]]).

### Step 3: Joining a Quiz

When you have created your quiz slides, you can either **invite your players** to join your presentation, or you can **join it yourself** on your phone to test it out (which we recommend).

To start, press the purple 'Present' button in the top-right corner of the editor. This will take you into the quiz lobby, where players join your quiz before you start hosting it.

![](https://help.ahaslides.com/galleryDocuments/edbsnfb8d02a542bb6953f248ca8785a06a00af02831059edc8dbc0147b709e6e4a4f80d9e371f3e75a7ed1a51b909467712f?inline=true)

In the lobby, your players can [join your quiz]([[sharing-a-presentation-to-your-participants]]) using either the **URL code** or **QR code** in the left-hand column.

![](https://help.ahaslides.com/galleryDocuments/edbsn5de66707bfa034f44799c7d7e447fc14a6f7ccb6f8f34118d2fd41bbe3cb6372a8d788f4e91e17e69408f8a52703a6b0?inline=true)

👉 **Important**

If a player joins the presentation while the host is presenting a non-quiz slide (like a poll, heading or content slide), then that player **has not yet joined the quiz**.

To join the quiz, **the host needs to present a quiz slide**. When they do...

- The host will see the **lobby** on their screen. This is where they can see all the players who have joined the quiz and are waiting to play.
- The player will be asked to **enter their name** and choose an avatar for the quiz. Once they have chosen, they will be shown in the quiz lobby.

![](https://help.ahaslides.com/galleryDocuments/edbsnac47fe8326d7383e8c81b56d3a631e9036c8a8ccf0f75689038227e44155c78c0e704e3a743f269393f9cc3449fd7503?inline=true)

### Step 4: Presenting a Quiz

When all your players have joined the quiz and are showing in the quiz lobby, you can press the blue button below that says '**Start the Quiz!'**

Your first question will show on your screen and each player's phone screens. Players will have the time limit you specified in the settings to answer the question.

Proceed through your quiz like this until the final winner is announced at the end!

📊 **Quiz Report**

Once you've finished presenting your quiz, you can check your presentation report to see how well your players did.

Find the report by clicking 'View presentation report' button in the top right toolbar and it will take you to the 'Participant Report', then you will be taken to your report page.

![](https://help.ahaslides.com/galleryDocuments/edbsn7c9686a3d17e750219b2506140f39c4055c7933499baaab4ab9d18c62cd2ab1d1b9092f46f53c4a9839a82c29cb6bfa7?inline=true)

[(Click here to see more about reports)]([[your-ahaslides-presentation-report]])

## Other Settings for Quizzes

Aside from the settings you can make on each slide (see step 2 for more details), you can also enable/disable the general settings for the whole quiz. These settings can be found by navigating to **'Settings'** in the right side menu bar, followed by **'General quiz settings'**.

![](https://help.ahaslides.com/galleryDocuments/edbsn5e11fb7da80a562eb02eaac974a3e5cdc6ff32e50ada4e8f8017f938c75062333274ead060ba83295b5845785103957c?inline=true)

### 1. Live chat

When the live chat is turned on, the presenter and participants can exchange messages, inspire friendly competition, and have lively discussions **on the quiz lobby screen**. This interactive feature cultivates a thriving and enthusiastic atmosphere, transforming the quiz into an exciting and bonding experience.

![](https://help.ahaslides.com/galleryDocuments/edbsnb4bb780e6bfa9219571bbefb24f8bc3131386b50eb85a5b814f35edaaa78a5bcf9e201f86ba970e533bedbebc28cb566?inline=true)

### 2. Sound effects:

You can turn on music and sound effect that automatically plays during the quiz lobby screen, quiz slides and each leaderboard screen. You can also toggle this off and on directly on the screen itself in the top left corner.

![](https://help.ahaslides.com/galleryDocuments/edbsn2425110cc49e32e8d2b9afd2c450a9c232217707a8b990ed158330f227c19f243c14dd0f4516d3a77e278e9693f8daa5?inline=true)

The music and sound effects are selected by AhaSlides and is **not customisable**.

Sound effects will accompany the countdown on quiz slides, signaling both the beginning of the quiz and the impending conclusion as the timer winds down. Additionally, music will be played throughout the duration of the quiz.

On a leaderboard slide, a short jingle will play while the leaderboard is rearranging itself to show the new standings. On the final leaderboard slide, a different, more triumphant jingle will play to announce the winner of the quiz.

### 3. 5s Countdown

When this setting is on, each question is preceded by a 5-second countdown timer, which gives your players time to read the question before they answer.

![](https://help.ahaslides.com/galleryDocuments/edbsnac47fe8326d7383e8c81b56d3a631e90deb8501f92164311ffec3346ec5f48f6eb752355cba5a3634ba9e475e021f496?inline=true)

### 4. Play as Teams

This feature is available for **Edu Medium, Edu large, Pro and Enterprise plans**

Players can play the quiz in teams, rather than individuals.

To set this up, please follow this article: [Running a Team Quiz]([[running-a-team-quiz]])

### 5. Shuffle Options

This feature is available for **Edu Medium, Edu large, Pro and Enterprise plans**

By enabling this setting, answer options for players on all Pick Answer, Match Pairs and Correct Order slides in your quiz will be shuffled randomly. This makes it harder for players to swap answers by showing each other their screens.

### 6. Manually show correct answers

This feature is available for **all paid plans**

Please note that this feature will not work in [Self-paced mode]([[setting-up-a-self-paced-presentation-on-ahaslides]])

When toggled on, the presenter will see this at the end of each quiz question 👇 This gives them the chance to explain the question in greater detail before revealing how everyone voted in the question.

![](https://help.ahaslides.com/galleryDocuments/edbsn79448b086e7f510dda52c677fda3a2f1ceefb789bd82ff482b26d2f599394646fa31fc46d54239220248b8329b9f884d?inline=true)

### 7. Participant avatars:

This option gives you more control over the quiz experience:

- **Enabled:** Participants will be asked to select an avatar when they join the quiz at the Lobby screen.
- **Disabled:** Allow participants to join the quiz without avatars.

![](https://help.ahaslides.com/galleryDocuments/edbsn5e11fb7da80a562eb02eaac974a3e5cd320973d6767d295e140350cf03d2da0f644b4a6d1d92951f2f309d9a5a907a06?inline=true)

## Audience-Paced/Self-Paced Quizzes

You can also let your players play a quiz **without a host**.

This is great for teachers who want to assign a quiz as homework, or for quiz masters who want to give their players freedom to complete a quiz at a time that suits them.

To set this up, please check out our guide: [Setting up a Self-Paced presentation on AhaSlides]([[setting-up-a-self-paced-presentation-on-ahaslides]])

## FAQ

### 1. Why isn't my quiz asking players for their names?

Usually, your quiz isn't asking players to fill out their name for one of two reasons:

1. You may have chosen a **'poll' slide instead of a 'pick answer' slide**. These slides look very similar, but only the *pick answer* slide is a quiz slide, so only the *pick answer* slide will ask players for their names while you're presenting the slide.
2. You may be **presenting any other non-quiz slide**. If your players join your presentation when you're presenting a heading, list, image or any other non-quiz slide type, it will not ask for their names. Once you move onto the first quiz slide of your quiz, your players will be asked for their names.

### 2. How can I clear player answers on my quiz?

If you've just tested your quiz with a real device, want to reuse a quiz, or made a mistake and want to start a quiz over, you can clear any answers submitted to your quiz, all without affecting the content of your quiz.

You can clear *all* responses in your quiz or *just* the responses from one question. [Check out this article to find out how.]([[resetting-the-results]])

### 3. How can I test my quiz?

The best way to test a quiz is by using [Preview Mode]([[how-to-preview-your-presentation]]). This is a test mode where you can try out your quiz from both the presenter screen and the player screen.

You can also test out a quiz by simply joining it on your own phone or getting some friends to join, then playing along as if it were a real quiz. If you use this method, remember to [clear your own answers](https://help.ahaslides.com/how-to-reset-the-results) after you've tested your quiz.

### 4. How "Everyone Has Answered" (auto end quiz timer) works

AhaSlides includes a feature called **"Everyone has answered,"** which automatically ends the quiz timer once all participants have submitted their answers. This feature counts the **highest number of participants who were in the quiz at the same time** after the presenter clicked **"Present."**

For example, if your quiz had a peak of 100 participants joining at the same time, but later 1–2 people left (by closing the tab or browser), **the system will still treat the total as 100**. This means the quiz **won't automatically end the timer** once the remaining participants have answered, because it's still expecting responses from all 100.

The count will only reset when the presenter exits presenting mode and clicks **"Present"** again to restart the session.

The presenter can also manually end the quiz timer by hovering the cursor on the timer, then clicking **End now**

![](https://help.ahaslides.com/galleryDocuments/edbsna1e486a068c00b0ed4e41a296aee1440df4dc2da193eb0a8f858444e4f1c0d0a8b924411490dad22344e4109906bbbaa?inline=true)
