---
id: "008"
date: "2026-08-04"
category: "BUILD"
title: "Spinning Up a Retro Game in Under Two Hours"
excerpt: "Rebuilding a childhood retro favourite from screenshots to a fully playable JavaScript app in 120 minutes using Figma, Antigravity, and playtesting with the kids."
readTime: "4 min read"
tags: ["retro-gaming", "figma", "antigravity", "javascript", "ai-workflows", "build-log"]
---

# Spinning Up a Retro Game in Under Two Hours

It is frankly remarkable what modern tooling allows us to pull off in an afternoon.

I was recently reminiscing about a retro game I played obsessively as a kid. Having put hundreds of hours into it back in the day, I knew the game mechanics by heart: how the movement felt, how score counters behaved, how collisions were handled, everything. A year ago, if I had wanted to rebuild a classic game, I would have either searchied for the original source code repositories and tried to get them running with whatever instructions were available with the language they were written in. But with the tools available right now, that's officially the long way.

## From Screenshots to Figma Code

Instead of hunting down old source code, I grabbed a couple of retro screenshots from the web and fed them straight into Figma. I asked Figma's layout tools to inspect the visual elements and recreate the UI structure. 

Figma spitting out clean layout code directly into the workspace still feels like a cheat code. You get structured layout positioning and visual elements without spending an hour configuring container elements and pixel offsets manually.

## Handing Off to Antigravity

Once I had the visual structure ready, I pulled that code into Antigravity. I gave it a set of strict instructions: keep this as a lightweight, pure JavaScript application without unnecessary heavy framework dependencies.

Antigravity took over the implementation logic from there. It wired up the game loop, state management, key bindings, and rendering routines in minutes. Within roughly sixty minutes of actual building effort, the core engine was alive, responsive, and completely playable in the browser.

## Hour Two: Playtesting and Kid Feedback

The second hour was spent entirely on refinement and playtesting. My kids jumped in to test out the controls, and they immediately started throwing out suggestions: tweaking sounds, adding better character graphics, and adjusting difficulty curves.

Iterating on those suggestions in real time took only a few quick prompt adjustments. By the end of the two hours, we had a fantastic, fully functional replica of the game we could all play together.

Building software used to mean days of tedious boilerplate before seeing anything move on screen. Going from a childhood memory to a working game in 120 minutes is proof that we live in magical times.
