# Attached standards in the material checker

`standards-adapter.js` connects the compliance engine to the audited modules in
`source-assets/grade-specification-lookup/`. Numeric tables and conditional
resolvers are shared with the grade lookup; they are not maintained separately.

Build the browser/CommonJS bundle with:

```sh
node scripts/build-material-checker-standards.mjs
```

This writes `tools/material-checker-standards.js`. The site build runs the same
command, and CI checks that the committed bundle matches its sources.

The adapter exports `identify`, `catalogue`, `inspect`, `describe`, `evaluate`
and `computeCSAEquivalent`. Assessments provide the existing scope and canonical
actuals plus `scope.standardContext`, `scope.standardTests` and
`scope.standardEvidence`. Individual specimen results are required wherever a
source rule checks a specimen count or individual minimum.

The engine always evaluates recognized attached editions before additional
customer rules. A package identifies its attached family and source hash instead
of freezing conditional numeric limits. Missing applicability, documentary
evidence or referenced requirements remains an explicit unresolved check.

The input renderer is `tools/material-checker-standard-inputs.js`; presentation
styles are in its adjacent CSS file. Source requirements, context and documentary
checks are collapsed independently to keep the main workflow readable.
