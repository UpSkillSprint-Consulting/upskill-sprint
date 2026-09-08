'use strict';

/* Read-only review tool. Input is an exported JSON object accepted by
   __TBHistoryReconciliation.project(). Output is a deterministic conversion
   plan; this command has no database or browser-storage write path. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', '..');
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/exam-reliability/segment08-reconcile.cjs <export.json>');
  process.exit(2);
}
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'test-bank-history-reconciliation.js'), 'utf8'), context, { filename: 'test-bank-history-reconciliation.js' });
const input = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
process.stdout.write(JSON.stringify(context.window.__TBHistoryReconciliation.dryRun(input), null, 2) + '\n');
