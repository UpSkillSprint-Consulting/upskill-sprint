# Material compliance checker: attached editions and shared header

The companion checker now uses the source audit modules already used by the
Grade Specification Lookup. The three user-supplied editions are the controlling
sources for this implementation, rather than a claim about every later edition
or every standard listed in the general manual catalogue.

| Attached edition | SHA-256 of supplied PDF | Existing audit |
| --- | --- | --- |
| ASTM A36/A36M-19 | `2168f20e05fdf6a57d87df57f3af82831dff36d51eec29d315277c3d3c564e03` | `a36-attached-edition-audit.md` |
| CSA G40.20-13/G40.21-13 (R2023), Update No. 1 (May 2014) | `b70949ce0d8afc203d8b55abaf8286e8867d4359afb09f42102a0a8bb9b00e91` | `g40-attached-edition-audit.md` |
| CSA Z245.1:26 | `79e4f7190a8616cb5500c223a1770505fa565c9d2d79a7726183c68b3c10616a` | `z245-attached-edition-audit.md` |

## Resulting behavior

- The browser bundle imports the same audited tables and conditional resolvers
  as the lookup. The catalogue contains 66 audited grade records. Product, unit
  basis, nominal dimensions, test method and order context select the applicable
  requirements at evaluation time.
- Attached-standard checks run regardless of the additional manual-section
  selections. Additional customer limits cannot replace source requirements.
  Captured packages retain source identity and evaluate it for each record.
- The correct CSA carbon-equivalent formula uses all required chemistry inputs;
  a reported IIW result does not replace it. Source rounding rules are applied
  to final comparisons, while individual and count rules retain raw evidence.
- Toughness checks require individual CVN/DWTT specimens where needed. Tests
  cover G40's individual-energy rule, Z245's count-below-average rule,
  temperature, subsize, shear, hydrostatic pressure/hold and hardness paths.
- Unknown context, contradictory grade/category or product/subtype, malformed
  values, unsupported units and conflicting repeated actuals block an
  unconditional result, including multi-package comparisons. Unknown imported designations remain unchanged and
  require controlled designation review.
- Source hashes, context and test evidence survive assessment export/import.
  Reusable templates and packages exclude prior measured results, documentary
  confirmations and material-specific specimen waivers.
- The lookup, checker and both guides share header styling matching the site's
  lesson/tool typography, spacing, navigation, theme control and mobile menu.
  Earlier standalone styles cannot shrink the brand and navigation.

## Coverage boundaries

Every automated numeric check shows its acceptance rule and source basis.
Manufacturing, inspection, marking, sampling and other documentary clauses are
retained as release-gating evidence checks with references. Unavailable
referenced-standard requirements, such as A6/A6M product-analysis allowances,
remain unresolved and cannot be dismissed through a blanket confirmation.
Contract-dependent criteria, including G40 category 5 agreed toughness criteria,
also remain unresolved when the required agreement is absent. This is controlled
screening support; an authorized reviewer still owns contract acceptance.

## Verification

Regression suites cover shared source tables, conditional applicability,
rounding boundaries, unit conversions, specimen rules, conservative missing
evidence, interactive state, packages, batch input, server storage and mobile
headers. All 152 regression tests passed. The full site build passed. The live tool redirects to the site's
sign-in gate, so browser review of authenticated production content was limited;
DOM, computed header styles and state transitions were verified locally.
