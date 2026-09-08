'use strict';
const path = require('node:path');
const { supervise } = require('./lib/student-audit-supervisor.cjs');
const modes = {
  full: ['scripts/stress-mbb-set3-final175.mjs', 'audit-results-final175', 35 * 60000],
  edges: ['scripts/stress-mbb-set3-edge-cases.mjs', 'audit-results-final175-edges', 15 * 60000]
};
for(let batch=1;batch<=7;batch++)modes[`batch${batch}`]=[`scripts/audit-mbb-set3-batch${batch}.mjs`,batch===1?'audit-results':`audit-results-batch${batch}`,12*60000];
async function main() {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !Object.hasOwn(modes, mode)) throw Error('Usage: node scripts/run-student-audit.cjs full|edges|batch1..batch7');
  const [script, defaultOut, totalMs] = modes[mode];
  const out = path.resolve(process.env.AUDIT_OUT || defaultOut);
  const state = await supervise({ args: [script], resultFile: path.join(out, 'supervisor.json'), totalMs });
  console.log(JSON.stringify({ auditSupervisor: state }, null, 2));
  if (state.status !== 'passed') process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
