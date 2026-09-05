import { spawnSync } from 'node:child_process';

// Netlify deploy previews have a short build window. Keep the deploy gate focused
// on the account ledger, cross-device recovery, mastery/readiness, analytics, and
// formula-panel paths that can make the test bank unusable. The exhaustive bank
// audit remains available through `npm test` and is intentionally not duplicated
// inside every deploy preview.
const checks = [
  [
    '--test',
    'tests/test-bank-mbb-set1.test.js',
    'tests/test-bank-mbb-set2-batch1.test.js',
    'tests/test-bank-adaptive-mastery-hardening.test.js',
    'tests/test-bank-learning-events.test.js',
    'tests/test-bank-ledger-reconciliation.test.js',
    'tests/test-bank-new-only-reservations.test.js',
    'tests/test-bank-retake-configuration.test.js'
  ],
  [
    '--test',
    '--test-name-pattern=a burst of 25 Retake clicks|a different signed-in user|cross-device New-only shortfall|exact New-only retake migration',
    'tests/test-bank-retake-dummy-user-stress.test.js'
  ],
  [
    '--test',
    '--test-name-pattern=New-only refreshes the signed-in cross-device ledger',
    'tests/test-bank-unseen-toggle.test.js'
  ],
  [
    '--test',
    '--test-name-pattern=does not visually accept an answer|keeps the session open when completion cannot|keeps the paused session and final question visible',
    'tests/test-bank-write-ahead-guard.test.js'
  ],
  [
    '--test',
    '--test-name-pattern=readiness is blueprint-weighted|delivering a whole domain|sessionTrend selects|studyHeatmap counts|historic full-exam domains|an open radar re-renders|a durable reconciliation refreshes|an open dashboard does not replace',
    'tests/test-bank-analytics-dashboard.test.js'
  ],
  [
    '--test',
    '--test-name-pattern=formula enhancer still initializes|open formula pane updates immediately|formula context resolves|formula context never binds|formula context infers',
    'tests/test-bank-formula-pane-exhaustive.test.js',
    'tests/test-bank-formula-pane-modes.test.js'
  ]
];

for (const args of checks) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
