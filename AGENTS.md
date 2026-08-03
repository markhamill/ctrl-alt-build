# CTRL-ALT-BUILD: System Context & Agent Directives

## Project Overview
This repository contains "CTRL-ALT-BUILD," a public build log and technical diary. It is built as a static, brutalist-themed Single Page Application (SPA) designed to be highly performant, serverless, and driven entirely by local Markdown files.

## Technical Stack
- **Engine:** Vite + React + TypeScript
- **Styling:** Tailwind CSS v4 (compiling on-the-fly via Vite)
- **Content Parsing:** `front-matter` (for metadata) and `react-markdown` (for body text and custom component rendering)
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions (configured via `.github/workflows/deploy.yml`)

## Core Architecture Decisions
1. **The Content Pipeline:** There is no database. Notes are written as standard `.md` files stored in `src/content/`. Vite dynamically scrapes this directory using `import.meta.glob`, parses the frontmatter, and renders the feed.
2. **Hash Routing:** To maintain SPA speed while surviving GitHub Pages' static file limitations (avoiding 404s on refresh), all navigation is handled via hash routing (e.g., `/#note-003`). Do not implement `react-router-dom` or server-side routing.
3. **Brutalist UI:** The design system relies on a pitch-black background (`#0a0a0a`), signature orange (`#ff4a00`), neon green highlights, and strict monospaced typography (`font-mono`). Components are boxy, heavily bordered, and high-contrast. Avoid soft shadows, rounded corners, or gradients.

## Immediate Next Steps (Session Context)
- **Security Update:** The local `.git/config` is currently using a plaintext Personal Access Token (PAT) for remote authentication. The immediate next task is to generate an SSH key, associate it with the GitHub account, update the remote URL to `git@github.com:markhamill/ctrl-alt-build.git`, and revoke/delete the PAT.
- **Metrics Dashboard:** Implemented top-row 6-card metrics dashboard (Applied, Interviews, Rejections, Ghosted, Offers, In Flight) and header counter driven by `src/data/stats.json`.
