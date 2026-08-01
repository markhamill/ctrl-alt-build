---
id: "001"
date: "2026-07-31"
category: "DAILY BLOG"
title: "Wiring The Workspace"
excerpt: "Learn by Building. Approaching Job Searching In An AI World By Learning All The Things"
readTime: "3 min read"
tags: ["architecture", "cli", "git", "setup"]
---

# Wiring the Workspace

The endless cycle of mass job applications is a quick way to let the brain go idle. I decided today that just firing off CVs is not enough. I need to be learning, building, and keeping my technical edge sharp. Step one on that list: finally learn how to properly use Git and build a command-line workflow from the ground up.

### The Context
It started as a simple exercise to set up a new GitHub account and build a local directory structure, but it quickly turned into a deep dive into environment configuration.

### The Build
Getting the Gemini CLI running natively threw the first hurdle. Running the npm installation as an administrator triggered security guardrails that blocked essential background scripts. It took a bit of debugging to figure out the exact `--allow-scripts` flag needed to authorise them and get the AI communicating with the Mac keychain.

Once the tools were actually running, the challenge shifted to figuring out the differences in how these AI models operate. Coming from Claude Code and Codex, I was used to specific ways of managing context and commands. Gemini CLI uses a different paradigm, relying on cascading `GEMINI.md` files. I set up a global configuration to permanently enforce British English and strip out specific punctuation across the whole machine, then migrated my product management copilot instructions into a dedicated local file.

### The Friction
The biggest friction point of the day was information architecture. I initially built my active projects inside my version-controlled skills repository. It took a moment to realise I was building a recursive Git nightmare. If I kept it that way, every time I committed a change to a prompt template, I would be committing the active state of every unrelated project I ever worked on.

It was a heavy day of plumbing, pasting raw text into the terminal, messing up the formatting, and reminding myself just how useful it has been learning vi all those years ago, editing at the command line to avoid the chaos.

### The Takeaway
The fix was separating the toolbelt from the workspace. I flattened the architecture, creating a master `ai-workspace` folder where my version-controlled `cli-skills` repository sits cleanly alongside my active `projects` directory. 

The foundation is there. The tools are separated from the work, the Git workflow makes sense, and the environment is ready.

