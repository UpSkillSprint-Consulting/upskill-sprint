# Test-bank feedback and adaptive-mastery review schema

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

## Phase 3 adaptive-mastery model

The mastery estimate is intended for study prioritization, not prediction of an official examination score.

### Mastery components

- **Accuracy — 58%:** proportion of recorded retrieval attempts answered correctly.
- **Success streak — 24%:** rewards repeated correct retrieval rather than a single successful response.
- **Recency — 18%:** reduces confidence when a question has not been retrieved recently.
- **Evidence adjustment:** prevents one or two observations from producing an unjustifiably high mastery estimate.

Effective mastery is recalculated at display and selection time, so the recency component continues to decline when a question has not been retrieved. A question is counted as mastered only when its effective estimate is at least 80% and it has at least three recorded attempts.

### Coverage-adjusted readiness

The dashboard separates three quantities:

- **Attempted-question mastery:** mean effective mastery across questions the learner has attempted.
- **Question-bank coverage:** percentage of the available question bank attempted.
- **Coverage-adjusted readiness:** attempted-question mastery discounted when the evidence covers only a small part of the bank.

This prevents excellent performance on a very small sample from appearing equivalent to broad mastery.

### Spaced-review schedule

- Incorrect or unanswered: review again in one day; streak resets and ease decreases.
- First correct retrieval: review in one day.
- Second consecutive correct retrieval: review in three days.
- Later consecutive correct retrievals: the interval expands using the question's current ease factor.
- A later incorrect response resets the streak and returns the item to near-term review.

### Adaptive-session priorities

A ten-question session reserves capacity rather than allowing one category to consume the entire session:

1. Up to approximately 50% overdue review questions.
2. Lower-mastery attempted questions for the remaining reinforcement allocation.
3. Approximately 20% previously unseen questions when unseen material remains.
4. Remaining capacity filled from weak, due, unseen, and broader-bank questions.
5. Questions are interleaved across subtopics where the available pool permits.

The unseen-question sample is deterministically shuffled by exam and date to avoid permanently favouring the first questions in storage order while keeping the session reproducible within the day.

The interface uses “similar questions” only when reviewed `conceptId` or `learningObjective` metadata exists. Otherwise it accurately describes the recommendation as same-subtopic practice.

### Session continuity and learner control

- In-progress adaptive sessions are saved locally after every answer and can be resumed at the same question.
- Pausing does not score unanswered remaining items.
- Completion is recorded once through a guarded completion path.
- Learners can export their adaptive data as JSON.
- Reset requires a second confirmation action and clears only the active exam's adaptive data.
- Reduced-motion preferences disable adaptive progress animation.

### Learner-data rules

- Mastery records are stored locally in the learner's browser and are not transmitted by the adaptive engine.
- Each result records whether it was a first encounter or repeated retrieval.
- Attempt history, adaptive-practice history, review dates, streaks, and mastery estimates are retained separately by exam.
- Per-question history is limited to the 30 most recent retrieval events.
- Exam-level attempt history is limited to the 60 most recent attempts.
- The mistake notebook retains incorrect, unanswered, and below-threshold items until sustained success raises mastery.
- Internal submission navigation must not be counted as a learner retrieval or response-time event.

## Review governance

Changing `stem`, `options`, `answer`, `why`, `keyPoint`, `trap`, `conceptId`, or `distractors` invalidates the prior review. The editor must update `reviewedAt` and repeat the content review before the question can retain expert-reviewed status.

Automated tests validate structure, review metadata, mastery calculations, dynamic recency decay, coverage adjustment, schedule transitions, balanced adaptive prioritization, session persistence, attempt capture, dashboard rendering, repeated-question improvement, and completion-state persistence. They do not replace independent subject-matter review or psychometric validation.
