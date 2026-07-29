# Test-bank feedback review schema

Phase 2 distinguishes three feedback integrity levels:

1. **Expert-reviewed feedback** — complete review metadata and option-specific rationales are recorded.
2. **Question-bank grounded** — the stored answer and explanation are displayed, but complete expert-review metadata has not been recorded.
3. **Review required** — a structural defect, missing explanation, invalid answer index, blank option, duplicate option, or missing subtopic was detected.

The interface must never label a question as expert-reviewed merely because it has an answer key.

## Required fields for expert-reviewed status

```js
{
  stem: 'Question text',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  answer: 1,
  why: 'Complete explanation supporting the answer.',
  sub: 'subtopic-id',

  conceptId: 'stable-concept-id',
  keyPoint: 'One reviewed, memorable learning point.',
  trap: 'The specific misconception or exam trap for this item.',
  distractors: {
    0: 'Why option A is incorrect.',
    2: 'Why option C is incorrect.',
    3: 'Why option D is incorrect.'
  },

  reviewSource: 'Approved source and section/page',
  reviewedBy: 'Reviewer name or controlled reviewer ID',
  reviewedAt: 'YYYY-MM-DD'
}
```

Every incorrect option must have a substantive rationale. The rationale must explain the conceptual, definitional, procedural, or calculation error; it must not merely state that another answer is correct.

## Content review checklist

- Confirm the stem has one defensible best answer.
- Confirm the answer index points to that answer.
- Recalculate numerical questions independently.
- Confirm units, rounding, symbols, and terminology.
- Confirm the explanation supports the stored answer without circular reasoning.
- Confirm every distractor is genuinely incorrect under the stated conditions.
- Record the misconception represented by each distractor.
- Add a concise key learning point.
- Add a question-specific exam trap only when one is defensible.
- Assign a stable concept ID for concept-matched practice.
- Record the approved source, reviewer, and review date.

## Review governance

Changing `stem`, `options`, `answer`, `why`, `keyPoint`, `trap`, `conceptId`, or `distractors` invalidates the prior review. The editor must update `reviewedAt` and repeat the content review before the question can retain expert-reviewed status.

Automated tests validate structure and the presence of review metadata. They do not replace independent subject-matter review.
