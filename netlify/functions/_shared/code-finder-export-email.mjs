// Emails for the Code Finder export form ("code-finder-export").
//   - renderPackEmail: the visitor's own copy of the pack they unlocked
//     (codes, reasons, check status, links), with the CSV attached.
//   - renderLeadAlert: a short, readable lead summary for the owner.
// The catalog is read from data/code-finder/ (bundled with the function via
// netlify.toml included_files) and rendered with the same engine as the page.
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import engine from '../../../tools/code-finder/code-finder-engine.js';

export const SITE = 'https://upskillsprint.com';
const FILES = ['taxonomy', 'standards', 'synonyms', 'scenarios'];

let cached = null;
export async function loadCodeFinderIndex(root = process.cwd()) {
  if (cached && cached.root === root) return cached.index;
  const [taxonomy, standards, synonyms, scenarios] = await Promise.all(
    FILES.map(async name => JSON.parse(await readFile(join(root, 'data', 'code-finder', name + '.json'), 'utf8'))));
  const index = engine.buildIndex({taxonomy, standards, synonyms, scenarios});
  cached = {root, index};
  return index;
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const packUrl = slug => `${SITE}/tools/code-finder/?pack=${encodeURIComponent(slug)}`;
const codeUrl = id => { const cut = id.indexOf('-'); return `${SITE}/codes/${id.slice(0, cut)}/${id.slice(cut + 1)}/`; };

// Colours are fixed hex because email clients ignore CSS variables; they match
// the site's light theme and pass WCAG AA on white.
const C = {ink: '#0C0E1A', text: '#1E2130', muted: '#5C5A54', line: '#E4DFD2', gold: '#7A6420', button: '#D4AF37', green: '#00753A', orange: '#9A5200', paper: '#F7F5EF'};

export function renderPackEmail(index, slug, {postalAddress = '', now = new Date()} = {}) {
  const view = engine.packResults(index, slug);
  if (!view) return null;
  const {pack, results} = view;
  const checked = results.filter(item => !engine.isStale(item.record, now)).length;
  const subject = `Your Code Finder pack: ${pack.title}`;
  const status = record => engine.isStale(record, now)
    ? {label: 'Not yet checked: confirm the current edition', color: C.orange}
    : {label: `Checked ${record.verified}${record.edition ? ` · edition ${record.edition}` : ''}`, color: C.green};

  const rows = results.map((item, i) => {
    const s = status(item.record);
    return `<tr><td style="padding:14px 0;border-top:1px solid ${C.line};">
<p style="margin:0 0 2px;font:600 15px/1.4 Arial,sans-serif;color:${C.gold};">${i + 1}. <a href="${codeUrl(item.record.id)}" style="color:${C.gold};">${esc(item.record.designation)}</a></p>
<p style="margin:0 0 6px;font:600 15px/1.4 Arial,sans-serif;color:${C.ink};">${esc(item.record.title)}</p>
<p style="margin:0 0 6px;font:14px/1.55 Arial,sans-serif;color:${C.text};"><strong>Why it is here:</strong> ${esc(item.why)}</p>
<p style="margin:0;font:13px/1.4 Arial,sans-serif;color:${s.color};">${esc(s.label)}</p></td></tr>`;
  }).join('');

  const lessons = pack.lessons.length ? `<p style="margin:22px 0 6px;font:600 15px Arial,sans-serif;color:${C.ink};">Learn the methods behind this pack</p>
<ul style="margin:0;padding-left:20px;font:14px/1.6 Arial,sans-serif;color:${C.text};">${pack.lessons.map(l => `<li><a href="${SITE}${esc(l.href)}" style="color:${C.gold};">${esc(l.label)} lesson</a></li>`).join('')}</ul>` : '';
  const consult = pack.regulated ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;border:1px solid #1E5BD8;border-radius:8px;"><tr><td style="padding:14px 16px;">
<p style="margin:0 0 6px;font:600 15px Arial,sans-serif;color:${C.ink};">Need help applying this?</p>
<p style="margin:0 0 8px;font:14px/1.55 Arial,sans-serif;color:${C.text};">This work is regulated, and the edition your regulator or contract calls for matters. Reply to this email or <a href="${SITE}/services#consulting-support" style="color:${C.gold};">see our consulting support</a>.</p></td></tr></table>` : '';
  const address = postalAddress ? `<br>${esc(postalAddress)}` : '';

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(results.length)} codes for ${esc(pack.title.toLowerCase())}, each with the reason it is on the list. Spreadsheet attached.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.line};border-radius:10px;">
<tr><td style="padding:22px 24px 12px;border-bottom:1px solid ${C.line};"><a href="${SITE}/"><img src="${SITE}/assets/logo-wordmark.png" width="180" alt="UpSkill Sprint Consulting" style="display:block;border:0;width:180px;height:auto;"></a></td></tr>
<tr><td style="padding:22px 24px 8px;">
<p style="margin:0 0 6px;font:600 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${C.gold};">Code Finder starter pack</p>
<h1 style="margin:0 0 10px;font:600 24px/1.25 Arial,sans-serif;color:${C.ink};">${esc(pack.title)}</h1>
<p style="margin:0 0 6px;font:15px/1.6 Arial,sans-serif;color:${C.text};">Here is the pack you asked for. ${esc(pack.summary)}</p>
<p style="margin:0 0 18px;font:13px/1.5 Arial,sans-serif;color:${C.muted};">${results.length} codes · ${checked} checked against the publisher so far · spreadsheet attached</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:${C.button};"><a href="${packUrl(pack.slug)}" style="display:inline-block;padding:12px 20px;font:600 14px Arial,sans-serif;color:${C.ink};text-decoration:none;">Open the pack in Code Finder</a></td></tr></table>
</td></tr>
<tr><td style="padding:8px 24px 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>${consult}${lessons}
<p style="margin:22px 0 0;padding:12px 14px;background:${C.paper};border-radius:8px;font:13px/1.55 Arial,sans-serif;color:${C.muted};">Code Finder lists facts about each code in our own words, never the code text. Editions change and regulators adopt specific editions, so confirm the current edition with the publisher and check which edition your regulator or contract calls for.</p>
</td></tr>
<tr><td style="padding:18px 24px 22px;border-top:1px solid ${C.line};font:12px/1.6 Arial,sans-serif;color:${C.muted};">You are getting this one email because you asked for this pack on <a href="${packUrl(pack.slug)}" style="color:${C.gold};">upskillsprint.com</a>. We only send updates if you ticked the updates box. Questions? Just reply.<br>UpSkill Sprint Consulting${address}</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `CODE FINDER STARTER PACK: ${pack.title}`, '',
    `Here is the pack you asked for. ${pack.summary}`,
    `${results.length} codes · ${checked} checked against the publisher so far · spreadsheet attached`, '',
    `Open the pack: ${packUrl(pack.slug)}`, '',
    ...results.flatMap((item, i) => [`${i + 1}. ${item.record.designation}: ${item.record.title}`, `   Why it is here: ${item.why}`, `   ${status(item.record).label}`, `   ${codeUrl(item.record.id)}`, '']),
    ...(pack.regulated ? ['Need help applying this? Reply to this email or see ' + SITE + '/services#consulting-support', ''] : []),
    ...(pack.lessons.length ? ['Learn the methods behind this pack:', ...pack.lessons.map(l => `- ${l.label} lesson: ${SITE}${l.href}`), ''] : []),
    'Code Finder lists facts about each code in our own words, never the code text. Confirm the current edition with the publisher and check which edition your regulator or contract calls for.', '',
    'You are getting this one email because you asked for this pack on upskillsprint.com. We only send updates if you ticked the updates box. Questions? Just reply.',
    'UpSkill Sprint Consulting' + (postalAddress ? '\n' + postalAddress : '')
  ].join('\n');

  const csv = engine.packToCsv(index, slug, {siteUrl: SITE, today: now.toISOString().slice(0, 10), now});
  return {subject, html, text, attachment: {filename: `code-finder-${pack.slug}.csv`, content: Buffer.from('﻿' + csv, 'utf8').toString('base64')}};
}

export function renderLeadAlert(index, {email, pack: slug, optIn}) {
  const view = slug ? engine.packResults(index, slug) : null;
  const title = view ? view.pack.title : `Unknown pack (${slug || 'none'})`;
  const opted = /^yes$/i.test(String(optIn || ''));
  const subject = `Code Finder lead: ${title}`;
  const lines = [
    `Someone unlocked a Code Finder download.`, '',
    `Email: ${email}`,
    `Pack: ${title}${view ? ` (${view.total} codes${view.pack.regulated ? ', regulated' : ''})` : ''}`,
    ...(view ? [`Link: ${packUrl(view.pack.slug)}`] : []),
    `Wants update emails: ${opted ? 'Yes (opted in)' : 'No: do not add to the newsletter'}`, '',
    view ? 'They were also sent their own copy of the pack.' : 'No visitor email was sent because the pack is unknown.'
  ];
  const row = (k, v) => `<tr><td style="padding:6px 12px 6px 0;font:600 14px Arial,sans-serif;color:#5C5A54;vertical-align:top;">${esc(k)}</td><td style="padding:6px 0;font:14px Arial,sans-serif;color:#0C0E1A;">${v}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:20px;background:#ffffff;">
<h2 style="margin:0 0 12px;font:600 18px Arial,sans-serif;color:#0C0E1A;">New Code Finder lead</h2>
<table role="presentation" cellpadding="0" cellspacing="0">
${row('Email', `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}
${row('Pack', view ? `<a href="${packUrl(view.pack.slug)}">${esc(title)}</a> (${view.total} codes${view.pack.regulated ? ', regulated' : ''})` : esc(title))}
${row('Updates', opted ? '<strong style="color:#00753A;">Yes, opted in</strong>' : 'No: do not add to the newsletter')}
</table>
<p style="font:13px Arial,sans-serif;color:#5C5A54;">${view ? 'They were also sent their own copy of the pack.' : 'No visitor email was sent because the pack is unknown.'} Reply to this email to contact them.</p>
</body></html>`;
  return {subject, text: lines.join('\n'), html};
}
