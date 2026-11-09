# Admin UI usage note (admin.css and admin-shell.js)

One page for checking any admin page against the shared contract. Every admin page uses only these classes and this API.

## Page skeleton (static HTML, every admin page)

```html
<body data-site-chrome="minimal" data-admin-page="overview|accounts|exams|tools">
  <div id="admin-shell-header"></div>
  <main id="admin-main" class="adm"><p class="adm-checking" role="status" aria-live="polite">Checking access…</p></main>
  <div class="adm-toast-region" aria-live="polite" aria-atomic="false"></div>
```

Head order: `style.css`, `theme.js`, `site-nav.css`, `admin.css`, `site-nav.js`, `site-sections.js`, then `<script defer src="/admin-shell.js">` **before** the page script. `noindex,nofollow`. No inline scripts, no `<template>`, no admin copy and no `href` to `/admin`, `/admin-access`, `/admin-exam-access` or `/admin-tool-access`.

## Shell API: `window.UpskillAdminShell`

| Function | What it does | Example |
|---|---|---|
| `mount({ page, isOwner })` | Renders the header into `#admin-shell-header`: "UpSkill Sprint" (link home), an "Admin" pill linking to `/admin`, tabs Overview, Accounts (only if `isOwner === true`), Exams and Tools, the current tab with `aria-current="page"`, and the theme switch (`button.theme-toggle[data-theme-toggle="true"]`, kept in sync with `html[data-theme]`). Under 800px the tabs collapse behind a **Menu** button (`aria-expanded`, Esc closes and returns focus). Calling it again replaces the header. | `UpskillAdminShell.mount({ page: 'exams', isOwner: await UpskillAdminShell.checkOwner(client) })` |
| `renderDenied(container, { signedOut, next })` | Removes the header, then replaces `container` with `.adm-denied`. `signedOut: true` gives "Sign in to continue" and a link to `/sign-in.html?next=<encoded next>` (only same-origin paths; anything else becomes `/`). Otherwise "This area isn't available" and a link to `/`. Never renders an admin link. | `renderDenied(document.getElementById('admin-main'), { signedOut: !user, next: '/admin-exam-access' })` |
| `checkOwner(client)` | `client.rpc('owner_manage_access', {operation:'status'})`; resolves `true` only when there is no error and `data.owner === true`. Errors, throws, a 12-second timeout (aborted) or a missing client resolve `false`. Never rejects. | `const isOwner = await UpskillAdminShell.checkOwner(auth.getClient())` |
| `toast(message, { tone })` | Appends `.adm-toast.adm-toast--success` or `--error` to `.adm-toast-region` (created if missing). Text only, with a visually hidden "Done:" or "Error:" prefix and a 44px dismiss button. Success dismisses after 5 seconds (paused on hover or focus); errors stay until dismissed. At most four at once. Returns `{ element, dismiss }`, or `null` for empty text. | `UpskillAdminShell.toast('Decision saved.', { tone: 'success' })` |
| `unmount()` *(extra)* | Removes the header, its listeners **and every toast** (timers cancelled). Pages call it whenever they return to the checking state: sign-out, account switch or denial. `renderDenied()` calls it too. | `UpskillAdminShell.unmount()` |
| `clearToasts()` *(extra)* | Removes all toasts and cancels their timers without touching the header. | `UpskillAdminShell.clearToasts()` |

Status lines that report search, load and save progress are polite live regions (`role="status" aria-live="polite"`). After a request, remove `inert` and `aria-busy` from the controls **before** rendering, so focus can move to the result heading.

The rule: run the page's own existing server check first, and only when it passes call `mount()` and build the UI inside `#admin-main`. Otherwise call `renderDenied()`.

## CSS vocabulary

| Class | Use | Example |
|---|---|---|
| `.adm` | Page container (max 1200px, 24px gutters, 16px under 640px) | `<main id="admin-main" class="adm">` |
| `.adm-header`, `.adm-tabs` | Rendered by `mount()` only | n/a |
| `.adm-page-title`, `.adm-lede`, `.adm-section-title` | h1, intro paragraph, h2 or h3 | `<h1 class="adm-page-title" tabindex="-1">Exam access</h1>` |
| `.adm-grid` | Auto-fill grid, 280px minimum per column | `<ul class="adm-grid" role="list">` or `<div class="adm-grid" role="group">` |
| `.adm-card` with `.adm-card-icon`, `.adm-card-body`, `.adm-card-action` | Card. As `button.adm-card` it is selectable with `aria-pressed="true"` | `<li class="adm-card"><span class="adm-card-icon"><svg…/></span><div class="adm-card-body"><h3>…</h3><p>…</p></div><a class="adm-btn adm-btn--primary adm-card-action" href="…">Open</a></li>` |
| `.adm-panel` | Bordered surface | `<section class="adm-panel" aria-labelledby="h">` |
| `.adm-btn` + `--primary`, `--secondary`, `--caution` | 44px buttons or links. Caution is for revoke and decline. Sibling buttons inside a `div`, `p`, `form` or `footer` line up and wrap automatically | `<button class="adm-btn adm-btn--caution">Revoke access</button>` |
| `.adm-field`, `.adm-help` | Label and control group with help text. As `fieldset.adm-field` with a `legend`, each `label` that wraps a radio or checkbox becomes a 44px option row | `<div class="adm-field"><label for="e">Account email</label><input id="e" aria-describedby="e-help"><p class="adm-help" id="e-help">…</p></div>` |
| `.adm-search` | Field and button row; stacks under 480px | `<form class="adm-search"><div class="adm-field">…</div><button class="adm-btn adm-btn--primary">Find</button></form>` |
| `.adm-summary` | Person summary: first child is the details, then actions; stacks under 480px | `<div class="adm-summary"><div><h3>email</h3><p>note</p></div><button class="adm-btn adm-btn--secondary">Reload account</button></div>` |
| `.adm-chip` + `--active`, `--expiring`, `--pending`, `--none` | Status. Always visible text; each state also has its own glyph (✓ ◷ ● –) hidden from assistive tech. `button.adm-chip` is 44px | `<span class="adm-chip adm-chip--expiring">Expires soon</span>` |
| `.adm-layout` | Main area plus side column. Collapses to one column when its `.adm-sidepanel` is `hidden`, and under 800px | `<div class="adm-layout"><div>…</div><aside class="adm-sidepanel" hidden>…</aside></div>` |
| `.adm-sidepanel`, `.adm-sidepanel-close` | Sticky right column at 800px and wider; a fixed bottom sheet with a scrim under 800px (body scroll locked). Under 800px the page script must treat it as a modal: set `role="dialog"` and `aria-modal="true"`, make every sibling up to `<body>` inert (header included; keep the confirmation `<dialog>` and `.adm-toast-region` live), contain Tab, close on Esc, return focus to the trigger, and release the inert nodes on close, on resize to wide and on teardown. At 800px and wider it is a non-modal column. See `containSheet()` in `admin-exam-access.js` | `<aside class="adm-sidepanel" aria-labelledby="t"><button class="adm-sidepanel-close" aria-label="Close details">…</button><h2 id="t" tabindex="-1">…</h2></aside>` |
| `.adm-table` | Table; under 640px each row stacks and every `td` shows its `data-label`. A `td` with `data-label=""` (actions) spans the full width. Add explicit `role="table|rowgroup|row|columnheader|cell"` so stacked rows keep table semantics in every browser | `<td role="cell" data-label="Requested">…</td>` |
| `.adm-filters` | Row of `.adm-field` selects; stacks under 480px | `<div class="adm-filters"><div class="adm-field"><label…>Status</label><select…></select></div></div>` |
| `.adm-empty` | Empty state: optional `svg`, `h3`, `p`, optional `.adm-btn` | `<div class="adm-empty"><svg aria-hidden="true">…</svg><h3>No pending requests</h3><p>…</p><button class="adm-btn adm-btn--secondary">Check again</button></div>` |
| `.adm-skeleton` | Loading placeholder; `data-size="title|line|short|row|card"`; mark `aria-hidden="true"` | `<span class="adm-skeleton" data-size="row" aria-hidden="true"></span>` |
| `.adm-timeline` | `ol` of `li > time + p` | `<ol class="adm-timeline"><li><time datetime="…">…</time><p>…</p></li></ol>` |
| `.adm-settings` | Clearly labelled maintenance section | `<section class="adm-settings" aria-labelledby="m"><h2 id="m" class="adm-section-title">Settings: history maintenance</h2>…</section>` |
| `.adm-dialog` | `<dialog>` for confirmations; buttons right-aligned, full width under 480px | `<dialog class="adm-dialog" aria-labelledby="d">…</dialog>` |
| `.adm-toast-region`, `.adm-toast`, `--success`, `--error` | Created by `toast()` only | n/a |
| `.adm-checking`, `.adm-denied` | Neutral checking state; denied state from `renderDenied()` | n/a |
| `.sr-only` | Visually hidden text | `<span class="sr-only">Action</span>` |

Internal shell classes (not for pages): `.adm-header-inner`, `.adm-brand`, `.adm-brand-site`, `.adm-brand-section`, `.adm-menu-btn`, `.adm-menu-label`, `.adm-header-tools`, `.adm-toast-icon`, `.adm-toast-message`, `.adm-toast-close`.

## Measured contrast (WCAG 2.2 AA)

| Pair | Light | Dark |
|---|---|---|
| Control border (`--adm-border-strong`) on card, paper, tint (3:1 needed) | 4.15, 3.64, 3.86 | 4.24, 4.64, 4.33 |
| Focus ring on card, paper, tint (3:1 needed) | 9.08, 7.97, 8.46 | 9.82, 10.75, 10.03 |
| Primary button text, at rest and hovered | 9.08, 12.14 | 7.77, 10.75 |
| Chip text: active, expiring, pending, none | 6.28, 6.87, 7.73, 6.72 | 9.67, 9.58, 9.72, 9.66 |
| Caution text on card and on its hover fill | 8.13, 6.94 | 8.45, 8.15 |
| Muted text on tint and on the info fill | 5.47, 5.00 | 8.49, 7.47 |
