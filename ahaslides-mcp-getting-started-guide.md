---
id: 570272000171073204
title: AhaSlides MCP — Getting Started Guide
status: Published
permalink: ahaslides-mcp-getting-started-guide
category: Integrations on AhaSlides
category_id: 570272000090547085
permission: ALL
last_updated: 2026-04-24
tags: []
keywords: []
summary: The AhaSlides MCP (Model Context Protocol) server lets AI assistants like Claude talk directly to AhaSlides on your behalf — so you can create presentations, build quizzes, manage slides, analyze audience responses, and more just by describing what you want in plain language.
plan_required: All
zoho_url: https://desk.zoho.com/agent/ahaslides/helpcenter/en/kb/articles/570272000171073204
portal_url: https://help.ahaslides.com/portal/en/kb/articles/ahaslides-mcp-getting-started-guide
related_articles: []
mcp_actions:
  not_applicable: "No AhaSlides MCP slide actions for this article type"
warning: "Do not update article body via ZohoDesk_updateArticle using this local .md file — images and videos exist in Zoho but are referenced here as markdown only. Fetch live HTML from Zoho first."
description: "The AhaSlides MCP (Model Context Protocol) server lets AI assistants like Claude talk directly to AhaSlides on your behalf \u2014 so you can create presentations, build quizzes, manage slides, analyze audience responses, and more just by describing what you want in plain language."
---

The AhaSlides MCP (Model Context Protocol) server lets AI assistants like Claude talk directly to AhaSlides on your behalf — so you can create presentations, build quizzes, manage slides, analyze audience responses, and more just by describing what you want in plain language.

# What is MCP?

Model Context Protocol is an open standard that connects AI assistants to external tools and services. Instead of switching between apps, you describe what you need and the AI does the work inside AhaSlides for you. Think of it like giving Claude a seat at your AhaSlides account.

# Before You Start

You'll need:

- An AhaSlides account (free or paid)
- Claude Code installed (CLI, desktop app, or VS Code / JetBrains extension)

No API key needed — you'll sign in with your AhaSlides account when you connect for the first time.

# Setup: Adding AhaSlides to Claude Code

## Option 1: quick add via CLI

Run this command in your terminal:

> `claude mcp add ahaslides --transport http https://mcp.ahaslides.com/mcp`

## Option 2: manual configuration

Add the following to your Claude Code MCP settings (settings.json or .mcp.json):

```json
{
  "mcpServers": {
    "ahaslides": {
      "type": "url",
      "url": "https://mcp.ahaslides.com/mcp"
    }
  }
}
```

## Signing in

The first time you use an AhaSlides tool, Claude Code will open a browser window for you to sign in with your AhaSlides account (email/password, Google, or Microsoft). After signing in, you're all set.

# What You Can Do

Once connected, just describe what you need. Here's everything the MCP server supports:

## Presentations

- Create a new presentation
- View full presentation details (slides, theme, structure)

## Slides

- Create slides of 17+ types — quizzes, polls, word clouds, brainstorms, content slides, and more
- Edit slide content (titles, options, answers, paragraphs, images)
- Configure slide properties (timers, scoring, display settings, chart types)
- Reorder slides within a presentation
- Delete slides
- Skip slides during a live presentation (hide from audience without removing)

## Themes

- Browse all available themes (official, custom, and team-shared)
- Apply a theme to any presentation

## Analytics

- Query audience response data across all your presentations
- Analyze a specific presentation's session data (participation, quiz scores, poll results)

# Supported Slide Types

| Category | Slide Types |
|---|---|
| **Quiz** | Pick Answer, Short Answer, Match Pairs, Correct Order, Categorise |
| **Interactive** | Poll, Word Cloud, Brainstorm, Open Ended, Scale, Q&A, Spinner Wheel |
| **Content** | Presentation Title, Content, Listing, Content with Image (left or right) |
| **Utility** | QR Code, Leaderboard |

# Example Prompts

Here are example prompts to get started:

| Task | Prompt |
|---|---|
| Create a Presentation | *"Create a new AhaSlides presentation called 'Q2 Team Update' with a welcome slide and an agenda."* |
| Add a Poll or Quiz | *"Add a multiple choice question to my presentation asking 'What's your biggest challenge at work?' with four options."* |
| Build a Quiz | *"Create a 5-question trivia quiz about our product features for a team training session."* |
| Add a Word Cloud | *"Add a Word Cloud slide asking participants 'What does great collaboration look like to you?'"* |
| Edit Existing Slides | *"Update the title of slide 3 in my presentation to 'Quarterly Highlights'."* |
| Rearrange Slides | *"Move the leaderboard slide to right after the last quiz question."* |
| Change the Look | *"Show me all available themes, then apply a dark one to my presentation."* |
| Analyze Audience Responses | *"How many people participated in my 'Sales Kickoff 2025' presentation? Show me the quiz scores breakdown."* |
| Skip a Slide | *"Skip the Brainstorm slide during the live session — I want to keep it but not show it today."* |

# Tips for Best Results

**Be specific about what you want:**

- Instead of "Make a quiz", try "Make a 10-question multiple choice quiz on workplace safety for new hires, with 4 answer options each"

**Reference presentations by name:**

- "Add a poll to my presentation called 'Sales Kickoff 2025'"

**Ask for structure first, then refine:**

- "Create an outline for a 15-minute product training session, then build it in AhaSlides"

**Combine with other tools:**

- "Read my meeting agenda from Google Docs, then create an AhaSlides presentation from it"

**Use analytics to improve:**

- "Show me which quiz questions had the lowest correct answer rate in my last training session"

# Troubleshooting

| Issue | Fix |
|---|---|
| **Sign-in popup doesn't appear** | Restart Claude Code and try again |
| **"Not authenticated" error** | Your session may have expired — Claude Code will prompt you to sign in again |
| **Tools not appearing** | Restart Claude Code after adding the server |
| **"Presentation not found"** | Make sure you are referencing the correct presentation name or ID |
| **Slow responses** | Normal for large presentations with many slides — wait a moment |

# Security & Privacy

- No API keys to manage — authentication uses secure OAuth 2.0 (the same standard used by Google, GitHub, etc.)
- You sign in with your existing AhaSlides account — no extra credentials to create or store
- The AI can only access presentations in your account
- The MCP server only performs actions you explicitly request
- You can revoke access anytime from your AhaSlides Account Settings
- Your sign-in session will expire automatically — you'll be prompted to re-authenticate when needed

# Getting Help

- AhaSlides Support: hi@ahaslides.com

*Last updated: April 2026*
