# Grade Specification Lookup source assets

This directory stores compressed, base64-encoded source HTML for the Grade Specification Lookup and its user guide.

The original source files were taken from the uploaded package `grade_spec_lookup_with_user_guide(5).zip` and hash-verified before integration. They remain the immutable base for the deterministic build. The build applies the audited-edition modules and integration changes described below; a source integrity hash is not a specification audit.

| Source | Compression | Verified uncompressed SHA-256 |
|---|---|---|
| `grade_spec_lookup.html.br.b64.part-01` | Brotli, then base64 | `93184e755a496d5d973bf5b2c164c72be8a4c97fecd66b213234d0de96a1e6eb` |
| `grade_spec_lookup_user_guide.html.gz.b64` | Gzip, then base64 | `9b9246bfe5bf96ed4b2335b60b4efeff21de973900b9d506b57fdbdf4cad992f` |

Run the deterministic build with:

```bash
node scripts/build-grade-specification-lookup.mjs
```

The build script verifies both hashes before creating:

- `engineering-tools/grade-specification-lookup/index.html`
- `engineering-tools/grade-specification-lookup/how-to-use/index.html`

The output directory is removed and recreated on each build so old loaders, fragments, wrappers, or stale generated files cannot survive deployment.

## Audited editions and source evidence

These modules replace the corresponding generic records using the user's supplied editions. They retain numeric requirements and paraphrased clause references, not the licensed source PDFs or complete extracted text. The audit is edition-specific and does not establish that all standards in the dataset are the latest published editions.

| Edition checked | Module | Supplied PDF SHA-256 | Evidence |
|---|---|---|---|
| ASTM A36/A36M-19 | `audited-a36.js` | `2168f20e05fdf6a57d87df57f3af82831dff36d51eec29d315277c3d3c564e03` | [`docs/a36-attached-edition-audit.md`](../../docs/a36-attached-edition-audit.md) |
| CSA G40.20-13/G40.21-13 (R2023), Update No. 1 (May 2014) | `audited-g40.js` | `b70949ce0d8afc203d8b55abaf8286e8867d4359afb09f42102a0a8bb9b00e91` | [`docs/g40-attached-edition-audit.md`](../../docs/g40-attached-edition-audit.md) |
| CSA Z245.1:26, March 2026 | `audited-z245.js` | `79e4f7190a8616cb5500c223a1770505fa565c9d2d79a7726183c68b3c10616a` | [`docs/z245-attached-edition-audit.md`](../../docs/z245-attached-edition-audit.md) |

`audited-context.js` connects these modules to lookup, calculators and compliance screening. It resolves the governing base record before applying customer overlays. Order dimensions, product form, specimen basis, analysis type and other conditional inputs determine the applicable limits. The standard-specific order/specimen controls and comprehensive requirement catalog are collapsed by default so the numeric display remains readable.

The build reads `audited-a36.js`, `audited-g40.js` and `audited-z245.js` in that order, applies their record replacements before the original application's `boot()`, then adds `hardening.js` and `audited-context.js`. It also injects `hardening.css` and the guide notice. Identical repository inputs produce identical application and guide files. The build logs SHA-256 hashes for both generated outputs; these output hashes identify the generated artifacts and are separate from the original-source and attached-PDF evidence hashes above.

## Audit and automation limits

The audit verifies the statements and numerical requirements contained in the supplied editions. It does not verify all manufacturing records, every dimensional tolerance or every provision of another standard referenced by those editions. In particular, unavailable ASTM A6/A6M product-analysis tolerances and general requirements, ASTM A370 specimen/test details, ISO test or conversion methods and API RP 5L3 provisions remain unresolved or explicit manual checks. The tool must not substitute heat-analysis limits for unavailable product-analysis tolerances or infer a compliant specimen/test method from a numeric result.

Missing applicable inputs or unresolved acceptance criteria produce `INCOMPLETE`. Known nonconforming results produce `FAIL`; invalid values produce `INVALID_INPUT`. Documentary/manual requirements prevent a clean `PASS` and remain visible for review. A numerical result with warnings is a screening result, not certification of complete standard or purchase-order conformance.

Other embedded standard records remain unverified. API 5L 46th Edition remains a legacy record and is superseded by API Spec 5L, 47th Edition; this change does not audit or replace its limits. The Z245 module replaces the previous CSA Z245.1:22 records with the supplied :26 edition.

Focused verification is maintained in `tests/standards-a36.test.js`, `tests/standards-g40.test.js`, `tests/standards-z245.test.js` and `tests/grade-specification-lookup.test.js`. Tests exercise the implemented grade/form branches, dimensional boundaries, specimen and order conditions, missing-context behavior and integration; the edition-specific evidence documents describe their coverage. These checks validate the implemented conditions within that scope; they do not perform a complete product-conformance assessment.
