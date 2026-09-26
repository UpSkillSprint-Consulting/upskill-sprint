# Steel Phase Explorer — Step 10 specification traceability handoff

Step 10 connects metallurgy screening to standards work without turning the Explorer into a compliance engine.

## Implemented boundary

- Accept a session-only SPEC_DATA JSON package with schema major version 1.
- Validate the top-level contract, body and grade identity, enums, required grade sections, verification pairing, and applicable product forms.
- Select one specification body, grade, and applicable form.
- Export only the traceability-safe `specContext` fields already supported by the calibration-package contract.
- Deliberately exclude chemistry limits, mechanical limits, Charpy/DWTT requirements, footnote rules, overlays, equivalence claims, testing rules, and acceptance logic.
- Direct compliance work to the dedicated Material Specification Lookup and Material Specification Compliance Checker.

## Safety controls

- Maximum import size is 2 MiB.
- An invalid or incompatible import cannot replace the previous valid session.
- File-reader completion is tokenized so an older asynchronous read cannot overwrite a newer selection.
- Imported specification data and selected context are not added to Explorer scenarios, local storage, share links, calculations, calibration fitting, qualification approval, or release readiness.
- Unverified grade identity is displayed as unverified.
- A downloaded identity context is a traceability aid, not evidence of specification acceptance.

## Preservation rule

All original modules, calculations, scenarios, exports, URLs, saved state, replay, calibration, qualification, learning paths, and release gates remain unchanged. Specification compliance and product release remain separate governed decisions.
