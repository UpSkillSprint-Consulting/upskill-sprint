# NPPE Mock A source-access and accessibility follow-up — 2026-10-18

**Status:** evidence collection only; no independent Canadian-law opinion or accessibility certification. PR #301 remains release-held.

## Source access

- Official [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) read on 2026-10-18. The website expressly identifies the **2017** specification as current while describing a proposed replacement. Existing blueprint metadata need not be rewritten on the basis of an announced update.
- **NPPE-186:** Ontario [Limitations Act, 2002, section 15](https://jobs.ontario.ca/laws/statute/02l24) was available via Ontario's government-hosted alternate domain, with text including the 15-year general ultimate limitation, exceptions and non-running circumstances. The canonical ontario.ca direct open failed. This is **government-hosted text retrieved**, not independent verification that the item correctly captures every statutory qualification; counsel must verify application, current consolidation and effective dates. A [historical official version](https://www.ontario.ca/laws/statute/02l24/v14) is indexed but must not silently substitute for the current law.
- **NPPE-206:** the Supreme Court of Canada's [Sable Offshore Energy v. Ameron, 2013 SCC 37](https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/13138/index.do?alternatelocale=en&iframe=true&pedisable=false&r=AAAAAQA8IFNhYmxlIE9mZnNob3JlIEVuZXJneSBJbmMuIHZzLiBBbWVyb24gSW50ZXJuYXRpb25hbCBDb3JwLiwgAAAAAAAAAQ&site_preference=normal) official indexed decision text was retrieved. It recognizes settlement-privilege protection of successful negotiations including settlement amounts, subject to exceptions. This does not independently sign off the item.
- **NPPE-185/256:** Southcott Estates, 2012 SCC 51, paras. 23–25, mitigation propositions independently corroborated only through an indexed secondary-law report in this pass; official full judgment not successfully read. **Pending direct primary review**.
- **NPPE-193,252,197:** Ontario Regulation 941 and Quebec Civil Code direct canonical retrieval failed. **Pending official consolidation access and human review**.
- **NPPE-208,224,237,238,245,248,269:** no fresh complete primary-source review in this pass. **Pending**, with exact locators supplied by individual question metadata and prior batch audit.

No source record should be labelled “resolved” merely because a government search result is indexed. For each pending item, a qualified reviewer must capture the exact claim, section/paragraph, jurisdiction, consolidated effective date, retrieval format and ruling on the keyed response. Preserve the separate repository protocol's reviewer status fields.

## Accessibility investigation

Source inspection of `auth.js` found an `account-menu-btn` element with `aria-haspopup="true"`, `aria-controls="account-menu-panel"` and `aria-expanded` updates; its panel is inserted with a matching ID and `hidden` initially. Escape key handling closes the panel and returns focus to the button. These are implementation observations **only**, not proof that live browser semantics, focus order or screen-reader announcement pass. Preserve the axe `aria-valid-attr-value` incomplete record as a manual gate pending inspection of its actual DOM and element screenshot.

The earlier reported `.tb-navcell.done::before` contrast issue could not be confirmed from an exact text search in `test-bank.html` in this pass. Inspect the computed pseudo-element and complete axe incomplete payload from an exact-head Chromium/WebKit artifact; do not claim the contrast issue has been fixed.

### Required verification matrix

- Account dropdown: keyboard Tab, Enter/Space, Escape, focus restoration, click-away and focus destination, plus assistive-technology announcements.
- Navigation/review: light/dark theme, completed/current/flagged/assisted state indicators, independent non-colour cues, 320px layout, 200% and 400% zoom/reflow.
- Mock A: reveal denial during active attempts, accessible 110-card review, source/link focus, timing status and automated versus manual distinctions.
- Record browser version, viewport, exact commit SHA, axe incomplete IDs/screenshots, WCAG criteria, observed contrast ratios, user-impact severity and remediation evidence.

Do not suppress axe incomplete records or report WCAG compliance without a manual assistive-technology pass. Fixture tests are not production-account verification.
