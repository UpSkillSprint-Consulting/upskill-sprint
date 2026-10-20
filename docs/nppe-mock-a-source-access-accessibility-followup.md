# NPPE Mock A source-access and accessibility follow-up — 2026-10-18

**Status:** evidence collection only; no independent Canadian-law opinion or accessibility certification. PR #301 remains release-held.

## Source access

- Official [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) read on 2026-10-18. The website expressly identifies the **2017** specification as current while describing a proposed replacement. Existing blueprint metadata need not be rewritten on the basis of an announced update.
- **NPPE-186:** Ontario [Limitations Act, 2002, section 15](https://www.ontario.ca/laws/statute/02l24) was available through official e-Laws indexed consolidation text, with text including the 15-year general ultimate limitation, exceptions and non-running circumstances. The current statute text and historical versions must be distinguished. This is **government-hosted text retrieved**, not independent verification that the item correctly captures every statutory qualification; counsel must verify application, current consolidation and effective dates. A [historical official version](https://www.ontario.ca/laws/statute/02l24/v14) is indexed but must not silently substitute for the current law.
- **NPPE-206:** the Supreme Court of Canada's [Sable Offshore Energy v. Ameron, 2013 SCC 37](https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/13138/index.do?alternatelocale=en&iframe=true&pedisable=false&r=AAAAAQA8IFNhYmxlIE9mZnNob3JlIEVuZXJneSBJbmMuIHZzLiBBbWVyb24gSW50ZXJuYXRpb25hbCBDb3JwLiwgAAAAAAAAAQ&site_preference=normal) official indexed decision text was retrieved. It recognizes settlement-privilege protection of successful negotiations including settlement amounts, subject to exceptions. This does not independently sign off the item.
- **NPPE-185/256:** Southcott Estates, 2012 SCC 51, official [SCC judgment document](https://decisions.scc-csc.ca/scc-csc/scc-csc/en/12612/1/document.do) retrieved as indexed text. Review paras. 23–25 and the item's precise factual distinctions with a Canadian-law reviewer; **content sign-off pending**.
- **NPPE-193/252:** Ontario [Regulation 941, s. 77](https://www.ontario.ca/laws/regulation/900941) historical official indexed text confirms professional credit and avoidance of commissions for securing engineering work. Confirm the **current** s. 77 consolidation and context, not an archived edition; **human review pending**. **NPPE-197:** Quebec [Civil Code, art. 1470](https://www.legisquebec.gouv.qc.ca/en/document/cs/ccq-1991) is available in official indexed English historical text and current official French PDF; source text describes unforeseeable and irresistible superior force, subject to an undertaking to make reparation. Confirm current bilingual provision and applicability with Quebec counsel; **human review pending**.
- **NPPE-208:** Ontario [Occupational Health and Safety Act, s. 43(11)](https://www.ontario.ca/laws/statute/90o01) official consolidated text indexed, including disclosure of another worker's refusal and reasons before assignment during inspection; item-specific review **pending**. **NPPE-224,237,238,245,248,269:** no fresh complete item-specific primary-source review in this pass. **Pending**, with exact locators supplied by individual question metadata and prior batch audit.

**Legislative currency alert:** [O. Reg. 126/26](https://www.ontario.ca/laws/regulation/r26126), filed May 1, 2026 and effective July 1, 2026, changes Regulation 941 engineering experience requirements. Review any Ontario licensing-related questions for exposure to this change.\n\nNo source record should be labelled “resolved” merely because a government search result is indexed. For each pending item, a qualified reviewer must capture the exact claim, section/paragraph, jurisdiction, consolidated effective date, retrieval format and ruling on the keyed response. Preserve the separate repository protocol's reviewer status fields.

## Accessibility investigation

Source inspection of `auth.js` found an `account-menu-btn` element with `aria-haspopup="true"`, `aria-controls="account-menu-panel"` and `aria-expanded` updates; its panel is inserted with a matching ID and `hidden` initially. Escape key handling closes the panel and returns focus to the button. These are implementation observations **only**, not proof that live browser semantics, focus order or screen-reader announcement pass. Preserve the axe `aria-valid-attr-value` incomplete record as a manual gate pending inspection of its actual DOM and element screenshot.

The earlier reported `.tb-navcell.done::before` contrast issue could not be confirmed from an exact text search in `test-bank.html` in this pass. Inspect the computed pseudo-element and complete axe incomplete payload from an exact-head Chromium/WebKit artifact; do not claim the contrast issue has been fixed.

### Required verification matrix

- Account dropdown: keyboard Tab, Enter/Space, Escape, focus restoration, click-away and focus destination, plus assistive-technology announcements.
- Navigation/review: light/dark theme, completed/current/flagged/assisted state indicators, independent non-colour cues, 320px layout, 200% and 400% zoom/reflow.
- Mock A: reveal denial during active attempts, accessible 110-card review, source/link focus, timing status and automated versus manual distinctions.
- Record browser version, viewport, exact commit SHA, axe incomplete IDs/screenshots, WCAG criteria, observed contrast ratios, user-impact severity and remediation evidence.

Do not suppress axe incomplete records or report WCAG compliance without a manual assistive-technology pass. Fixture tests are not production-account verification.
