# UpSkill Sprint — Lesson Creation & Update Guide

**Audience:** AI agents and human contributors creating or updating lessons on upskillsprint.com.
**Status:** Authoritative. If any instruction elsewhere conflicts with this file, follow this file.

This guide is written to be executed literally. Where it says **MUST**, it is a hard
requirement. Where it says **MUST NOT**, doing it is a defect. Do not "improve",
reinterpret, or substitute equivalents unless this guide explicitly allows a choice.

---

## 0. How an AI agent must use this guide

When asked to create or update a lesson:

1. Read this entire file first.
2. Work inside a local clone of the repo. Never hand-write files blindly — inspect the
   real repo first (existing lessons are the reference implementation).
3. For a **new** lesson, follow sections 1–13 in order, then validate (16) and open a PR (17).
4. For an **update** to an existing lesson, obey the **Content Preservation Rule** (§14):
   change only what the task requires; never remove or shorten existing lesson content.
5. Before submitting, complete the **Pre-Submit Checklist** (§18). Every box must be true.
6. Never invent product facts, menu paths, formulas, or data. If unsure, state the
   uncertainty rather than fabricating.

**Definition of "lesson content":** everything the reader learns from — headings, prose,
tables, equations, interactives, examples, quiz questions. It does **not** include site
chrome (header, footer, nav), the metadata block, stylesheet/script tags, or the progress
card. Chrome may be changed to match this guide; content may not be altered on updates.

---

## 1. File location, naming, and slugs

- Lessons live under `lessons/`. Category subfolders are used where a category slug exists,
  e.g. `lessons/statistics/`, `lessons/lean-six-sigma/`, `lessons/data-analytics/`,
  `lessons/power-bi-excel-sql/`. Some older lessons sit directly in `lessons/`.
- **Filename = slug + `.html`**, all lowercase, words separated by hyphens, no spaces, no
  underscores. Example: `choosing-the-right-regression-analysis-in-minitab.html`.
- The **slug is the filename without `.html`** and MUST match the `slug` field in the
  metadata block (§3) exactly.
- Pretty URLs are on: the public URL drops `.html`
  (e.g. `/lessons/statistics/<slug>`). Use the URL **without** `.html` everywhere you link
  to the lesson (canonical tag, catalog `path`, back-links).

**Valid category slugs** (use these exact strings for folder, `category_slug`, `sectionId`,
`topic`, and the back-link anchor):

```
data-analytics
quality-engineering
lean-six-sigma
statistics
power-bi-excel-sql
project-management
business-decision-making
ai-for-work
```

Display names (for the `category` metadata field), in the same order: `Data Analytics`,
`Quality Engineering`, `Lean Six Sigma`, `Statistics`, `Power BI, Excel & SQL`,
`Project Management`, `Business Decision-Making`, `AI for Work`.

---

## 2. Required page skeleton (exact order)

Every lesson is a single self-contained `.html` file with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<!-- UPSKILLSPRINT_LESSON_META
{ ... see §3 ... }
-->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>… lesson title …</title>
  <meta name="description" content="… one sentence …">
  <link rel="canonical" href="https://upskillsprint.com/lessons/<category>/<slug>">
  <!-- required site assets, root-relative (see §5) -->
  <link rel="stylesheet" href="/style.css">
  <link rel="stylesheet" href="/lessons-theme.css">
  <script src="/theme.js"></script>
  <script src="/site-sections.js"></script>
  <!-- optional: a lesson-specific inline <style> block AFTER the two links above -->
</head>
<body data-lesson-page="true" data-category="<category-slug>" data-level="<level>" data-interactive="true" data-lesson-type="general">
  <!-- 1. CANONICAL HEADER (exact markup, §4) -->
  <!-- 2. lesson content wrapped in <main id="lesson-content"> … </main> -->
  <!-- 3. "Check your understanding" quiz (§7) -->
  <!-- 4. back-to-category link (§8) -->
  <!-- 5. CANONICAL FOOTER (exact markup, §4) -->
  <!-- 6. any lesson-specific <script> (quiz grader, interactives) -->
</body>
</html>
```

**Hard rules for the skeleton:**

- The metadata comment MUST appear immediately after `<html lang="en">`, on the next line.
  The exact bytes `<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META` are checked by tests.
- There MUST be exactly one `<html>`, one outer `<head>`, and one outer `<body>`.
- The main content MUST be inside `<main id="lesson-content">…</main>` so the progress card
  injects correctly and `:where(#lesson-content)` scoping works (it is also the stable content
  landmark that lesson navigation and automated checks anchor to).

---

## 3. Lesson metadata block

Placed immediately after `<html lang="en">`. It is an HTML comment containing a single JSON
object. Format exactly like this (a real, passing example):

```html
<!-- UPSKILLSPRINT_LESSON_META
{
  "title": "Choosing the Right Regression Analysis in Minitab",
  "slug": "choosing-the-right-regression-analysis-in-minitab",
  "category": "Statistics",
  "category_slug": "statistics",
  "level": "Intermediate",
  "lesson_type": "General",
  "estimated_minutes": 60,
  "interactive": true,
  "card_title": "Choosing the Right Regression Analysis in Minitab",
  "card_description": "Choose among fitted line plots, multiple regression, stepwise methods, Best Subsets, validation, interactions, and nonlinear regression.",
  "search_keywords": ["regression","Minitab","best subsets","stepwise","validation","interaction","nonlinear regression"],
  "suggested_github_path": "lessons/statistics/choosing-the-right-regression-analysis-in-minitab.html"
}
-->
```

**Field rules (all fields required):**

| Field | Type | Rule |
|---|---|---|
| `title` | string | Human title; matches `<title>` and the `<h1>`. |
| `slug` | string | MUST equal the filename without `.html`. |
| `category` | string | One of the display names in §1. |
| `category_slug` | string | One of the category slugs in §1. |
| `level` | string | Exactly one of `Beginner`, `Intermediate`, `Advanced`. |
| `lesson_type` | string | `General` unless told otherwise. |
| `estimated_minutes` | integer | Positive integer (realistic reading/interaction time). |
| `interactive` | boolean | `true` if it has any interactive widget/quiz, else `false`. |
| `card_title` | string | Title shown on the lessons catalog card. |
| `card_description` | string | One-sentence catalog blurb. |
| `search_keywords` | array | **At least 5** distinct lowercase keyword strings. |
| `suggested_github_path` | string | Exactly `lessons/<category_slug>/<slug>.html` (or `lessons/<slug>.html` for uncategorised). |

The JSON MUST be valid (parseable) — no trailing commas, straight quotes only.

---

## 4. Canonical site chrome (header + footer)

Every lesson MUST carry the **exact** header and footer below. Paths are **root-relative**
(begin with `/`) so they work at any folder depth. Do **not** use `../` or absolute
`https://upskillsprint.com/...` links in the chrome. Do **not** add, remove, rename, or
reorder nav items. The nav MUST contain all eight items in this order: Start Here, Lessons,
Engineering Tools, Services, Request a Topic, About, FAQ, Contact.

### 4.1 Header — paste immediately after the `<body …>` tag

Do **not** add a visible or hidden "Skip to lesson content" link before the header. New
lessons must begin with the mobile-navigation checkbox shown below. The site intentionally
does not include that link in lesson chrome.

```html
<input type="checkbox" id="mnav-check" class="mnav-check" aria-hidden="true">
<header class="site lesson-sitebar">
  <a class="brand" href="/"><img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo"><span>UpSkill Sprint Consulting</span></a>
  <nav class="desktop-nav" aria-label="Primary navigation"><a href="/start-here">Start Here</a><a href="/lessons" aria-current="page">Lessons</a><a href="/engineering-tools">Engineering Tools</a><a href="/services">Services</a><a href="/request-topic">Request a Topic</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/contact">Contact</a></nav>
  <div class="header-actions">
    <label for="mnav-check" class="mobile-menu-btn" aria-label="Open menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></label>
    <div class="theme-control" aria-label="Colour theme"><svg class="theme-icon theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg><button type="button" class="theme-toggle" data-theme-toggle="true" role="switch" aria-checked="false" aria-label="Switch to dark mode" title="Switch to dark mode"><span class="sr-only">Toggle dark and light mode</span></button><svg class="theme-icon theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></div>
  </div>
</header>
```

### 4.2 Footer — paste immediately before `</body>` (after the content, quiz, and back-link)

```html
<footer class="site"><div class="wrap"><div class="footer-grid"><div><div class="brand" style="margin-bottom:14px"><img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo"><span>UpSkill Sprint Consulting</span></div><p style="font-size:13.5px;line-height:1.6;color:#cbd5e1;max-width:260px;margin:0">Practical learning for quality, data, process improvement, and business problem-solving.</p></div><div><h4>Quick Links</h4><a href="/">Home</a><a href="/start-here">Start Here</a><a href="/lessons">Lessons</a><a href="/engineering-tools">Engineering Tools</a><a href="/services">Services</a><a href="/request-topic">Request a Topic</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/contact">Contact</a></div><div><h4>Topics</h4><a href="/lessons#data-analytics">Data Analytics</a><a href="/lessons#quality-engineering">Quality Engineering</a><a href="/lessons#lean-six-sigma">Lean Six Sigma</a><a href="/lessons#statistics">Statistics</a><a href="/lessons#power-bi-excel-sql">Power BI, Excel &amp; SQL</a><a href="/lessons#project-management">Project Management</a><a href="/lessons#business-decision-making">Business Decision-Making</a><a href="/lessons#ai-for-work">AI for Work</a></div><div><h4>Contact</h4><a href="mailto:skillsprintconsulting@gmail.com">skillsprintconsulting@gmail.com</a><p style="font-size:13.5px;color:#cbd5e1;margin:0">Saskatchewan, Canada</p></div></div></div><div class="footer-bottom"><span>&copy; 2026 UpSkill Sprint Consulting</span><div><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a></div></div></footer>
```

The header/footer are styled by `/style.css` and `/lessons-theme.css` (§5). The theme
toggle and mobile menu are wired by `/theme.js`. Do not hand-build a different header.

---

## 5. Stylesheets and scripts (required, root-relative)

In `<head>`, every lesson MUST load these four, root-relative, before any lesson-specific
inline `<style>`:

```html
<link rel="stylesheet" href="/style.css">
<link rel="stylesheet" href="/lessons-theme.css">
<script src="/theme.js"></script>
<script src="/site-sections.js"></script>
```

- `/site-sections.js` is **non-negotiable** and MUST appear as exactly
  `<script src="/site-sections.js"></script>`. A CI bot checks every page for this exact
  tag; a missing/altered tag breaks CI on future merges.
- `/site-sections.js` also loads the auth/progress scripts and injects the "Engineering
  Tools" nav entry at runtime — so you do **not** hardcode Engineering-Tools behaviour.
- A lesson may define its own visual design in an inline `<style>` block, but that block
  MUST come **after** the two stylesheet links so site classes (`.site`, `.footer-grid`,
  `.desktop-nav`, quiz classes, etc.) still resolve.
- Lesson-specific CSS MUST NOT redefine, shadow, or repurpose site-wide custom properties
  declared by `/style.css` or `/lessons-theme.css`. Site tokens control shared chrome such as
  the header, footer, navigation, and progress card.
- Every lesson-owned custom property MUST use a collision-resistant namespace, preferably
  `--lesson-<name>` or `--<lesson-slug>-<name>`. Generic names such as `--navy`, `--primary`,
  `--background`, `--surface`, or `--text` are prohibited in lesson-specific CSS unless the
  repository explicitly documents them as shared site tokens and the lesson only consumes
  them without redefining them.

---

## 6. Body attributes and the progress card

The `<body>` tag MUST carry these attributes:

```html
<body data-lesson-page="true" data-category="<category-slug>" data-level="<level-lowercase>" data-interactive="true" data-lesson-type="general">
```

With these attributes present and a `<footer>` on the page, `progress.js` (loaded via
`/site-sections.js`) **automatically injects** the "Your progress" save card immediately
above the footer. The card reads:

> **YOUR PROGRESS** — Want to save your progress and quiz scores for this lesson?
> Sign in or create a free account.

**MUST NOT** hardcode this card in the HTML — it is injected at runtime and hardcoding it
produces a duplicate.

---

## 7. "Check your understanding" comprehension quiz

Every lesson MUST include one comprehension quiz near the end (after the content, before
the back-link and footer). Use this exact structure and grader so the quiz styles render
and the `upskill-quiz-result` event fires (progress tracking depends on it).

### 7.1 Quiz styles — include once (light + dark)

```html
<style id="uss-quiz-style">
.quiz-section{margin:34px auto 8px;max-width:900px;padding:0 20px}
.quiz-section .lesson-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:12.5px;color:#0f6b78;font-weight:700;margin:0 0 4px}
.quiz{border:1px solid #d7e0e8;border-radius:14px;padding:18px;background:#fff}
.quiz-question{margin:16px 0;padding:14px;border:1px solid #d7e0e8;border-radius:10px}
.quiz-question legend{font-weight:600;padding:0 4px}
.quiz-option{display:block;width:100%;margin:8px 0;padding:9px 11px;border:1px solid #d7e0e8;border-radius:8px;cursor:pointer;font-size:15px}
.quiz-option input{margin-right:9px}
.quiz-question.is-correct{border-color:#2d6a4f;background:#f5fbf7}
.quiz-question.is-incorrect{border-color:#a32d2d;background:#fdf6f6}
.quiz-feedback{display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:14.5px}
.quiz-feedback.show{display:block}
.quiz-feedback.good{background:#eef8f2;border-left:4px solid #2d6a4f}
.quiz-feedback.bad{background:#fff1f1;border-left:4px solid #a32d2d}
.quiz-feedback.warn{background:#fff8e6;border-left:4px solid #c79224}
.quiz-actions{margin-top:16px}
.quiz-actions button{background:#0f6b78;color:#fff;border:0;border-radius:10px;padding:11px 18px;font-size:15px;font-weight:600;cursor:pointer}
.quiz-result{display:none;margin-top:16px;padding:12px 14px;border-radius:10px;background:#eef5fb;border-left:4px solid #1f4e78;font-size:15px}
.quiz-result.show{display:block}
html[data-theme="dark"] .quiz{background:#131f2c;border-color:#243546}
html[data-theme="dark"] .quiz-question{background:#15212e;border-color:#243546}
html[data-theme="dark"] .quiz-option{background:#111c28;border-color:#2b3b4c;color:#e7eef4}
html[data-theme="dark"] .quiz-question.is-correct{background:#13291f;border-color:#3fa27a}
html[data-theme="dark"] .quiz-question.is-incorrect{background:#2c1717;border-color:#e06a6a}
html[data-theme="dark"] .quiz-feedback.good{background:#13291f}
html[data-theme="dark"] .quiz-feedback.bad{background:#2c1717}
html[data-theme="dark"] .quiz-feedback.warn{background:#2a2413}
html[data-theme="dark"] .quiz-result{background:#12202e;border-left-color:#5b9bd5;color:#e7eef4}
</style>
```

### 7.2 Quiz markup — one `<fieldset class="quiz-question">` per question

Each question MUST have `data-answer` (the correct option's `value`) and `data-explanation`.
Provide 4–8 questions covering the lesson's key ideas.

```html
<section class="quiz-section" id="quiz" aria-labelledby="quiz-heading">
  <p class="lesson-kicker">Knowledge check</p>
  <h2 id="quiz-heading">Check your understanding</h2>
  <div class="quiz">
    <div class="quiz-head"><h3>Comprehension quiz</h3><p>Pick the strongest answer, then submit. Explanations appear after you submit.</p></div>
    <form id="quiz-form">
      <fieldset class="quiz-question" data-answer="b" data-explanation="Because … (one or two sentences grounded in the lesson).">
        <legend>1. Question text?</legend>
        <label class="quiz-option"><input type="radio" name="q1" value="a"> Option A</label>
        <label class="quiz-option"><input type="radio" name="q1" value="b"> Option B</label>
        <label class="quiz-option"><input type="radio" name="q1" value="c"> Option C</label>
        <div class="quiz-feedback"></div>
      </fieldset>
      <!-- more <fieldset class="quiz-question"> … -->
      <div class="quiz-actions"><button type="button" id="quiz-submit">Submit answers</button></div>
      <div class="quiz-result" id="quiz-result" role="status" aria-live="polite"></div>
    </form>
  </div>
</section>
```

### 7.3 Quiz grader — include once, before `</body>`

```html
<script>
(function () {
  'use strict';
  var form = document.getElementById('quiz-form');
  if (!form) return;
  var btn = document.getElementById('quiz-submit');
  var result = document.getElementById('quiz-result');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var questions = Array.prototype.slice.call(form.querySelectorAll('.quiz-question'));
    var total = questions.length, score = 0, unanswered = 0;
    questions.forEach(function (q) {
      var chosen = q.querySelector('input[type="radio"]:checked');
      var fb = q.querySelector('.quiz-feedback');
      q.classList.remove('is-correct', 'is-incorrect');
      if (!chosen) { unanswered++; if (fb) { fb.className = 'quiz-feedback show warn'; fb.textContent = 'Select an answer to see feedback.'; } return; }
      var correct = chosen.value === q.getAttribute('data-answer');
      if (correct) score++;
      q.classList.add(correct ? 'is-correct' : 'is-incorrect');
      if (fb) { fb.className = 'quiz-feedback show ' + (correct ? 'good' : 'bad'); fb.innerHTML = (correct ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') + (q.getAttribute('data-explanation') || ''); }
    });
    if (result) { result.className = 'quiz-result show'; result.innerHTML = '<strong>Score: ' + score + ' / ' + total + '</strong>' + (unanswered ? ' \u2014 ' + unanswered + ' unanswered' : ''); }
    document.dispatchEvent(new CustomEvent('upskill-quiz-result', { detail: { score: score, total: total } }));
  });
})();
</script>
```

---

## 8. Back-to-category link

Immediately before the footer, add a left-aligned link back to the lesson's category
section on the lessons page (root-relative, using the `category_slug`):

```html
<section aria-label="Return to lesson category" style="max-width:900px;margin:26px auto;padding:0 20px;text-align:left">
  <a href="/lessons#<category-slug>" style="color:#1f4e78;font-weight:600;text-decoration:none">&larr; Back to <Category display name> lessons</a>
</section>
```

---

## 9. Mandatory light and dark mode compatibility

Every lesson MUST be fully readable and functional in both light and dark mode before it
can be approved or merged. This applies whether the lesson relies on site CSS or ships a
self-contained inline `<style>` design.

### 9.1 Theme implementation requirements

1. Use shared CSS custom properties for backgrounds, text, borders, links, controls, and
   status colours. Define every theme-dependent property in both light and dark modes.
2. Do not rely on inherited text colour inside a component with a fixed background.
3. **Any component that declares `background` or `background-color` MUST also declare an
   intentional compatible text colour in both themes.**
4. Avoid hard-coded component colours unless a matching dark-mode rule is also provided.
5. Do not use colour alone to communicate meaning. Pair colour with text, labels, icons,
   patterns, or another visible indicator.
6. Declare `color-scheme: light dark` so native controls render appropriately.
7. Keep accent hues that feed gradients; do not blindly invert every variable. Darken
   surfaces and lighten text while preserving intentional accent contrast.
8. Scope dark-mode overrides to `html[data-theme="dark"]` and place the final override
   block last in the document (just before `</body>`) so it wins the cascade.
9. Namespace every lesson-owned custom property with `--lesson-` or a slug-specific prefix.
   Lesson CSS MUST NOT declare generic custom properties on `:root`, `html`, `body`, or
   `html[data-theme="dark"]` that can collide with the site's shared tokens.
10. Treat the canonical header, footer, navigation, theme control, and injected progress card
    as protected site chrome. Lesson selectors MUST NOT restyle them, and lesson variables
    MUST NOT change their computed colours, typography, spacing, opacity, or layout.
11. Before adding a custom property, search `/style.css` and `/lessons-theme.css` for the same
    name. If it already exists, consume it as documented or choose a lesson-prefixed name;
    never override it for a lesson-specific meaning.

Reference token pattern (adapt names and values as needed):

```css
:root {
  color-scheme: light dark;
  --lesson-page-bg: #f8fafc;
  --lesson-surface-bg: #ffffff;
  --lesson-surface-muted: #f1f5f9;
  --lesson-text-primary: #172033;
  --lesson-text-secondary: #475569;
  --lesson-border-color: #cbd5e1;
  --lesson-link-color: #075985;
}

html[data-theme="dark"] {
  --lesson-page-bg: #0f172a;
  --lesson-surface-bg: #182338;
  --lesson-surface-muted: #243149;
  --lesson-text-primary: #f8fafc;
  --lesson-text-secondary: #cbd5e1;
  --lesson-border-color: #475569;
  --lesson-link-color: #7dd3fc;
}

.lesson-card,
.callout,
.topic-pill,
.quiz-panel {
  color: var(--lesson-text-primary);
  background-color: var(--lesson-surface-bg);
  border-color: var(--lesson-border-color);
}
```

### 9.2 Required components and states to inspect

Check every component the lesson contains in both themes, including:

- Page backgrounds; body text; headings; subtitles; and muted text.
- Topic pills, tags, badges, workflow labels, formula boxes, and worked examples.
- Information, warning, success, and critical callouts.
- Cards, panels, accordions, tabs, tables, code blocks, and inline code.
- Form fields, selectors, buttons, disabled controls, and navigation links.
- Quiz questions, answer choices, feedback, results, and reset controls.
- Charts, diagrams, axes, legends, labels, meaningful graphics, and tooltips.
- Default, hover, focus, active, selected, correct, incorrect, and disabled states.
- Canonical header, footer, navigation, theme control, and injected progress card, confirming
  they are visually unchanged by lesson-specific CSS in both themes.

### 9.3 Contrast requirements

All lesson content MUST meet WCAG 2.1 AA contrast requirements:

- Normal text: at least **4.5:1**.
- Large text: at least **3:1**.
- Controls, component boundaries, focus indicators, and meaningful graphics: at least
  **3:1** against adjacent colours.
- Placeholder and muted text must remain readable and MUST NOT carry essential instructions.

### 9.4 Prohibited patterns

A lesson MUST NOT be approved if it contains any of the following:

- White or near-white text on a white or light background.
- Dark text on a dark background.
- A light-mode background combined with inherited dark-mode text.
- Hard-coded white cards or panels without dark-mode overrides.
- Transparent components whose text becomes unreadable over their parent background.
- Correct/incorrect or other status feedback communicated through colour alone.
- Charts whose labels, axes, legends, tooltips, or data marks disappear in either theme.
- Lesson-specific CSS that redefines a site-wide custom property or uses an unnamespaced,
  generic token such as `--navy`, causing shared site chrome to inherit lesson colours.
- Broad lesson selectors such as `footer`, `header`, `.site`, `.brand`, or `.footer-grid`
  that unintentionally override canonical site chrome.

### 9.5 Mandatory visual validation

Before approval:

1. Open the complete lesson in light mode and review it from top to bottom at desktop width.
2. Repeat the complete review in dark mode at desktop width.
3. Repeat both reviews at a narrow mobile viewport.
4. Interact with every button, quiz, tab, accordion, selector, and calculator in both themes.
5. Inspect every supported default, hover, focus, selected, correct, incorrect, and disabled
   state.
6. Capture at least one full-page screenshot in each theme and attach both to the PR.
7. Correct every contrast or visibility failure before merging.

Passing automated checks does not replace visual inspection.

### 9.6 Automated accessibility validation

Where supported, run Axe, Lighthouse, or an equivalent accessibility scan in both themes.
The lesson MUST have:

- No serious or critical colour-contrast violations.
- No missing accessible names on interactive controls.
- A visible keyboard-focus indicator in both themes.
- No content hidden solely because the theme changes.

### 9.7 Pull-request acceptance evidence

Every new or materially restyled lesson PR MUST report:

```
[ ] Light-mode desktop validation completed.
[ ] Dark-mode desktop validation completed.
[ ] Light-mode mobile validation completed.
[ ] Dark-mode mobile validation completed.
[ ] All interactive states tested in both themes.
[ ] WCAG AA contrast validation completed.
[ ] Light-mode screenshot attached.
[ ] Dark-mode screenshot attached.
[ ] No unresolved theme or contrast defects.
```

Verify in both light and dark mode before submitting (§16).
## 10. Mobile requirements (all lessons)

- Include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- No fixed pixel widths that overflow small screens; layouts must be responsive.
- Wrap every `<table>` in a horizontally scrollable container so it never overflows:
  ```html
  <div style="overflow-x:auto"><table> … </table></div>
  ```
- SVGs must scale; controls must be touch-friendly.
- Verify rendering at a narrow viewport before submitting.

---

## 11. Statistics lessons — required "Statistics Implementation" section

Any lesson whose `category_slug` is `statistics` (or that teaches a statistical method) MUST
include a **Statistics Implementation** section with these four parts, in this order:

1. **Excel Functions** — a table of every relevant function and its variants
   (e.g. `T.DIST`, `T.DIST.2T`, `T.DIST.RT`) with columns: *Function*, *Syntax*, *Purpose*,
   *When to use it*. Wrap the table per §10.
2. **Excel Use Cases** — practical worked examples showing each function in context.
3. **Minitab Navigation** — the exact menu path(s) (e.g.
   `Stat → Basic Statistics → 1-Sample Z`), any alternative paths, and a note on which option
   to choose and why. Use `<code>` for menu paths.
4. **Exam Tips** — how these functions/menu paths connect to the ASQ CSSBB/CQE exams and to
   real-world analysis.

Do not fabricate function syntax or menu paths. If you are not certain a function or path is
correct, verify against the existing statistics lessons or say so — never guess.

---

## 12. Register the lesson in the catalog (`chi-square-lesson-library.js`)

The lessons catalog is generated from `chi-square-lesson-library.js` at the repo root. A new
lesson MUST be registered there or it will not appear on the lessons page.

**Critical build constraint:** `chi-square-lesson-library.js` MUST remain **plain, readable
JavaScript** — a literal array of objects. **MUST NOT** be minified into, replaced by, or
wrapped in a gzip/base64/`eval` "packed" stub. The Netlify build runs
`scripts/build-binomial-poisson-exponential-lesson.mjs`, which scans this file for a literal
insertion point; if the literals are gone, **every deploy fails** with
*"Could not locate the Statistics lesson insertion point."*

### 12.1 Entry format

Add one object to the `LESSONS` array, in the position matching where the lesson should
appear within its category. Copy this shape exactly:

```js
    {
      marker: 'data-<unique-lesson-key>',
      sectionId: '<category-slug>',
      path: '/lessons/<category-slug>/<slug>',
      topic: '<category-slug>',
      level: '<beginner|intermediate|advanced>',
      interactive: 'true',
      search: 'space separated lowercase keywords describing the lesson',
      meta: '<span><Level></span><span>Interactive</span><span><N> min</span><span><Tool/tag></span>',
      title: '<Lesson title>',
      description: '<One-sentence description for the catalog card>'
    },
```

Notes:
- `path` uses the pretty URL (no `.html`).
- `level` here is **lowercase**; the metadata block (§3) uses Title-case — both must agree.
- `interactive` is the **string** `'true'`, not a boolean.
- `marker` is a unique `data-…` key; keep it distinct from every existing marker.

### 12.2 Do not disturb the build insertion point

The file contains an entry with `marker: 'data-beyond-the-bell'`. The build script inserts a
generated lesson immediately before it. Leave that entry and the surrounding literal
structure intact. After editing, the file MUST still parse as JavaScript (no syntax errors)
and MUST still contain the literal `marker: 'data-beyond-the-bell',`.

---

## 13. Downloadable datasets and other lesson assets

- Lesson assets (practice datasets, images, payloads) live under
  `assets/lessons/<slug>/`. Example:
  `assets/lessons/<slug>/practice-dataset.xlsx`.
- Link to them root-relative with a `download` attribute:
  ```html
  <a class="btn btn-teal" href="/assets/lessons/<slug>/practice-dataset.xlsx" download>Download the practice dataset (Excel .xlsx)</a>
  ```
- If a lesson's text references a dataset ("use the practice dataset"), that dataset MUST
  actually exist and be downloadable. Do not reference data that was never created.
- For synthetic practice data, generate it deterministically, keep it realistic, and add a
  "Data Dictionary" tab documenting each column and that the data is fictitious.

---

## 14. Content Preservation Rule (updates only)

When updating an existing lesson:

- **Never remove, shorten, summarise, or re-order existing lesson content** unless the task
  explicitly asks for that specific change.
- Make the smallest change that satisfies the task. Add around existing content; do not
  rewrite it.
- **MUST NOT** replace a full lesson with a "packed"/encoded/loader stub to save space.
- After editing, prove content was preserved: the set of `<h1>`–`<h4>` headings and the
  body-text length (excluding chrome) MUST be unchanged except for the exact text the task
  changed. If a heading disappears unexpectedly, you broke something — stop and fix it.

---

## 15. Loader-architecture lessons (special case)

A few older lessons are "loader shells": a small HTML page that fetches a gzip+base64 payload
(e.g. `assets/lessons/<slug>/part-1.txt … part-4.txt`, or a `payload.js`), decompresses it in
the browser, and `document.write`s the real lesson.

- The **rendered** lesson's chrome/content lives inside the payload, not the shell.
- To change such a lesson: decode the payload → make the edit in the decoded HTML (applying
  this guide) → re-encode with the **same** method (standard gzip, then standard base64) →
  write it back → verify the round-trip (decode again and confirm your change is present and
  content headings are preserved).
- Prefer **not** to create new loader-architecture lessons. New lessons should be plain,
  self-contained HTML per §2.

---

## 16. Testing & validation (run before every PR)

Run all of these from the repo root and confirm each passes:

1. **Full unit test suite** — must be green:
   ```
   node --test tests/*.test.js
   ```
   Notable invariants the suite enforces: every page carries the exact `/theme.js` and
   `/site-sections.js` tags; every lesson has a valid metadata block; the catalog stays
   build-parseable.
2. **Netlify build command** — must exit 0 (this is what deploy runs):
   ```
   node --test tests/test-bank*.test.js && node scripts/build-binomial-poisson-exponential-lesson.mjs && node scripts/validate-binomial-poisson-exponential-visual.mjs && node scripts/build-grade-specification-lookup.mjs && node scripts/build-interactive-sql-lesson.mjs && node scripts/focus-sql-clause-learning.mjs
   ```
   The build **mutates** `chi-square-lesson-library.js` and generates files under
   `engineering-tools/` and some `lessons/…` outputs. **Do not commit build-generated
   output.** Restore build-mutated tracked files and delete generated files before committing.
3. **New behaviour needs a regression test.** If you fixed a bug, add a test that fails on the
   old code and passes on the fix (verify by temporarily reverting the fix).
4. **CSS custom-property collision check** — inspect every custom property declared by the
   lesson and compare it with `/style.css` and `/lessons-theme.css`. Rename any lesson-owned
   collision with a `--lesson-` or slug-specific prefix. Also reject broad selectors that
   target canonical chrome (`header`, `footer`, `.site`, `.brand`, `.footer-grid`, or
   `.desktop-nav`) unless the guide explicitly requires that exact rule.
5. **Visual check** the deploy preview in **both light and dark mode** and at a **narrow
   (mobile) viewport**. Confirm the header, footer, navigation, theme control, and progress
   card retain the canonical site appearance as well as checking the lesson content.

---

## 17. Pull-request workflow

- Branch off `main`. Use **independent PRs** — one focused PR per task. Do **not** stack PRs.
- Commit author/committer identity: `BigErnie <BigErnie@users.noreply.github.com>`.
- Never commit build-generated output (`engineering-tools/`, generated `lessons/…`,
  build-mutated `chi-square-lesson-library.js` beyond your intended registration edit).
- Push the branch and open a PR against `main` with a clear description of what changed and
  the validation performed.
- After pushing, confirm the GitHub checks and the Netlify **deploy-preview** status both
  pass (Netlify status context: `netlify/upskillsprint/deploy-preview`). Report the PR number
  and preview URL.
- `main` is protected; a human reviewer (Ernest) merges. Do not attempt to bypass review.

---

## 18. Pre-submit checklist (every box MUST be true)

```
[ ] Filename is lowercase-hyphenated; equals slug; correct category folder.
[ ] <html lang="en"> is immediately followed by the UPSKILLSPRINT_LESSON_META comment.
[ ] Metadata JSON is valid; slug matches filename; suggested_github_path correct;
    level is Beginner/Intermediate/Advanced; >=5 search_keywords.
[ ] <head> loads /style.css, /lessons-theme.css, /theme.js, /site-sections.js (root-relative),
    with any inline <style> AFTER the stylesheet links.
[ ] Exactly the canonical header block (§4.1) sits right after <body>; it starts with the
    mobile-navigation checkbox, contains no "Skip to lesson content" link, and its nav has
    all 8 items, root-relative, in order.
[ ] <body> has data-lesson-page/category/level/interactive/lesson-type attributes.
[ ] Progress card is NOT hardcoded (it auto-injects).
[ ] Main content is inside <main id="lesson-content">…</main>.
[ ] A "Check your understanding" quiz exists using the §7 markup + grader; it dispatches
    the upskill-quiz-result event.
[ ] A left-aligned "Back to <Category> lessons" link points to /lessons#<category-slug>.
[ ] Exactly the canonical footer (§4.2) sits right before </body>.
[ ] Light + dark mode verified at desktop + mobile widths; all interactive states checked.
[ ] WCAG AA contrast thresholds met; no serious/critical contrast violations.
[ ] Any component with its own background has an intentional text colour in both themes.
[ ] Every lesson-owned CSS custom property uses `--lesson-` or a slug-specific prefix.
[ ] No lesson CSS redefines a custom property from /style.css or /lessons-theme.css.
[ ] No broad lesson selector overrides canonical header/footer/navigation/progress-card styles.
[ ] Header, footer, navigation, theme control, and progress card remain correct in both themes.
[ ] Self-styled lesson? Dark-mode override block present and placed last.
[ ] Light-mode and dark-mode full-page screenshots attached to the PR.
[ ] All tables wrapped in overflow-x:auto; viewport meta present; verified on mobile.
[ ] Statistics lesson? "Statistics Implementation" section present with all 4 parts.
[ ] Lesson registered in chi-square-lesson-library.js as a plain literal entry;
    file still parses; data-beyond-the-bell insertion point intact.
[ ] Any referenced dataset/asset actually exists under assets/lessons/<slug>/ and downloads.
[ ] Update task? No existing content removed/shortened; headings + body-text preserved.
[ ] node --test tests/*.test.js is fully green.
[ ] Netlify build command exits 0; no build-generated output committed.
[ ] Deploy preview verified in light + dark mode and at a narrow viewport.
```

---

## 19. Anti-patterns (never do these)

- ❌ Replacing a lesson (or the catalog file) with a gzip/base64/`eval` "packed" stub.
- ❌ Removing or shortening existing lesson content on an update.
- ❌ Hardcoding the "Your progress" card (it duplicates the injected one).
- ❌ Using `../` or absolute `https://upskillsprint.com/...` links in the header/footer.
- ❌ Adding, dropping, renaming, or reordering nav items.
- ❌ Adding a "Skip to lesson content" link before the canonical lesson header.
- ❌ Omitting or altering the `<script src="/site-sections.js"></script>` tag.
- ❌ Committing `engineering-tools/` or other build-generated output.
- ❌ Fabricating Excel functions, Minitab menu paths, formulas, or dataset values.
- ❌ A self-styled lesson with no dark-mode overrides.
- ❌ A component background without an intentional compatible text colour in both themes.
- ❌ Defining unnamespaced lesson tokens such as `--navy`, `--primary`, `--background`,
  `--surface`, or `--text`, or redefining any site-wide custom property.
- ❌ Using broad lesson CSS selectors that restyle canonical header, footer, navigation,
  theme controls, or the injected progress card.
- ❌ Approving a lesson without desktop/mobile screenshots in both light and dark mode.
- ❌ Referencing a "practice dataset" that does not exist as a downloadable file.
