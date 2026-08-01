---
id: "002"
date: "2026-07-30"
category: "DAILY BLOG"
title: "Git Archaeology and Wiring the CLI Workspace"
excerpt: "Recovering Accounts, and Mixing Technology And People Skills"
readTime: "3 min read"
tags: [architecture, git, ai-workflows, tooling]
---

# Git Archaeology and Wiring the CLI Workspace

The day started less with engineering and more with digital archaeology. After reaching out to GitHub support to help bypass some ancient device verification, I finally got back into my old account. In the process, I managed to unearth an *even older* account that somehow had my actual name as the handle. Having to choose between my historical digital baggage and a pristine `@markhamill` handle was an amusing start to the morning. 

Once I picked the canonical handle, instinct and old muscle memory kicked in. I immediately spun up a 90-day Personal Access Token to get things moving securely.

### The Context
The main objective today was not just porting old prompts, but really grappling with the architecture of my workspace. I was trying to figure out the flow, the format, and exactly how to connect local command-line skills to distinct project folders. Breaking up the old, monolithic Claude Code blog framework was definitely on the to-do list, but getting the actual wiring right between the tools and the workspace was the primary goal.

### The Build
Slicing up the monolith was satisfying. Instead of one massive prompt trying to do everything, I now have a clean pipeline of discrete tools: a `blog-ideation.md` brief generator, a `blog-drafter.md` writer, a `linkedin-adapter.md` for social distribution, and a passive `blog-style-guide.md` acting as the guardrails. 

The highlight of the build, however, was a five-minute detour into Git mechanics. My local machine was stamping commits with my old username while authenticating to the new account. Asking the AI to explain the difference between local authorship and server authentication resulted in a brilliant, concrete analogy. It turns out Git is just the label on the box, and GitHub is the key to the warehouse. A quick global configuration update, and it was sorted. 

### The Friction
I am only human, and I am very much still learning the exact rhythms of the CLI. After updating a local orchestrator file, I confidently ran a `git push` and wondered why nothing updated on the server. I had completely forgotten to stage and commit the loose changes first. You cannot ship an open box. It is a simple reminder that the command line demands precision.

### The Takeaway
The biggest win today was not a technical fix, but a logical evolution of the workflow. I swapped the clunky process of pasting notes into the terminal for a rolling local `scratchpad.md` file. It was a proactive realisation that when building AI workflows, persistence is always more reliable than relying on a context window. The system now reads my running notes automatically at the end of the day, proving that the best tools are the ones that adapt to how you naturally work.

