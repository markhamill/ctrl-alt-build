---
id: "005"
date: "2026-08-01"
category: "BUILD"
title: "The Happy Idiot's Guide to Modern Web Deployment"
excerpt: "How I fumbled my way through Vite, React, and GitHub Pages, asking all the dumb questions so you don't have to."
readTime: "6 min read"
tags: ["vite", "react", "tailwindcss", "github-pages", "github-actions"]
---

# The Happy Idiot's Guide to Modern Web Deployment

I am an executive product leader by day. I spend my time talking about cybersecurity, telemetry, and enterprise scale. But when it comes to actually building a modern web app from absolute scratch in 2026? I am basically a happy idiot with a keyboard. 

This is the exact breakdown of how I built this site, the questions I asked along the way, and why these specific tools were chosen. 

## Step 1: The Design Phase (Figmake to Code)
I knew I wanted a "brutalist" theme—high contrast, monospaced fonts, dark mode by default. 

I found some visual samples I liked, took them into **Figmake** (a fantastic prototyping tool within Figma), and started mapping out the visual hierarchy. Once I had the shapes, colors, and layout looking right, I passed that design into my code builder to generate a baseline React template. 

*Question: "I have a layout. How do I actually style this in code without writing thousands of lines of CSS?"*

**The Answer:** **Tailwind CSS (v4)**. It's a utility-first CSS framework that lets you style things directly inside your HTML/React components using tiny, predictable class names (like `text-brand-orange` or `bg-black`). 

## Step 2: The Weight Problem
Here was my main constraint: I wanted to host this site for free on GitHub Pages. GitHub Pages is a "static host," meaning it doesn't have a backend server to run heavy web frameworks or database queries. It just serves flat files.

*Question: "If I want to use React and Tailwind, but I need it to be lightweight and static for GitHub, how do I glue them together?"*

**The Answer:** **Vite** (pronounced "veet", like the French word for fast). 

Vite is a build tool. Think of it as a lightning-fast translator. While I am coding, it hot-reloads my changes instantly in the browser. When I am ready to publish, Vite takes all my React code, strips out the junk, compiles the Tailwind CSS, and squashes it all down into a tiny, highly optimized package of static files that GitHub Pages can actually read.

We installed it from the terminal like this:
```bash
npm create vite@latest
```

## Step 3: The Markdown Engine
I refused to build a database or install a heavy CMS (like WordPress) just to write blog posts. I wanted to write standard `.md` (Markdown) text files in my code editor, and have the website magically turn them into styled articles.

*Question: "How do I make a React app read local text files?"*

**The Answer:** We used Vite's built-in file scraper (`import.meta.glob`) and installed two lightweight packages:
1. `front-matter`: This reads the metadata block at the top of my text files (title, date, category).
2. `react-markdown`: This safely translates the raw text body into HTML, so things like bold text or code blocks actually look right on the screen.

```bash
npm install front-matter react-markdown
```

## Step 4: The Routing Trap
Once the articles were loading, I hit a snag. In modern Single Page Applications (SPAs) built with React, the browser doesn't actually load new web pages when you click a link; it just swaps out the components instantly on the same page. 

*Question: "If the URL never changes, how do I use the browser's back button, or share a link to a specific article?"*

**The Answer:** Hash Routing. We injected a small script to update the URL with a `#` (like `/#note-001`) whenever an article is clicked. 
Because GitHub's servers ignore everything after a hash, if someone refreshes the page, GitHub doesn't throw a 404 error. The React app loads, reads the hash, and instantly displays the correct article.

## Step 5: The Deployment Pipeline
Finally, I needed to get it on the internet. 

*Question: "How do I update the live website without having to manually compile the code and drag-and-drop files onto a server every time?"*

**The Answer:** **GitHub Actions**. 

We created a hidden folder (`.github/workflows`) and dropped a `deploy.yml` configuration file inside it. This file is essentially a script of instructions for GitHub's servers. 

Now, the workflow is entirely automated. When I finish writing a markdown file on my laptop, I type:
```bash
git push
```
That sends the text file to GitHub. GitHub sees the new file, spins up a virtual machine, installs Vite, builds the Tailwind CSS, and publishes the finished website to the internet. I don't lift a finger.

I may not be a pure developer, but even I can appreciate the beauty of a pipeline that does the heavy lifting for you.
