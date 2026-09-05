'use strict';

/* Shared test fixture for the write-ahead learning ledger.  The production
   simulator intentionally refuses to start a quiz without this durable
   storage, so browser-style tests that enter a session must install the same
   prerequisites the deployed page receives. */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const registry = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const learning = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');

function emptyClient() {
  return {
    from() {
      return {
        upsert() { return Promise.resolve({ error: null }); },
        select() {
          const query = {
            eq() { return query; },
            order() { return query; },
            range() { return Promise.resolve({ data: [], error: null }); },
            limit() { return Promise.resolve({ data: [], error: null }); }
          };
          return query;
        }
      };
    },
    /* Default browser fixtures do not model another device. Accepting the
       requested IDs mirrors an uncontended account-owned reservation. Exact
       retake reservations return only the required count, matching the
       all-or-nothing RPC contract. */
    rpc(name, args) {
      const ids = args && args.p_question_ids || [];
      const required = name === 'reserve_test_bank_new_questions_exact'
        ? Math.max(0, Number(args && args.p_required_count || 0))
        : ids.length;
      return Promise.resolve({
        data: ids.slice(0, required).map(question_id => ({ question_id })),
        error: null
      });
    }
  };
}

async function installDurableLearning(window, options) {
  const config = options || {};
  const user = config.user || { id: config.userId || 'test-learner' };
  const client = config.client || emptyClient();
  window.UpskillAuth = Object.assign({}, window.UpskillAuth || {}, {
    getUser: () => user,
    getClient: () => client
  });
  if (!window.__TBQuestionRegistry) window.eval(registry);
  if (!window.__TBLearning) window.eval(learning);
  await window.__TBLearning.sync('test-hydrate');
  /* Ledger hydration emits a browse-repaint event.  Let that queued core
     repaint finish before a test replaces the overview with a result shell or
     locates controls, matching the stable post-hydration state a user sees. */
  await new Promise(resolve => window.setTimeout(resolve, 0));
  return window.__TBLearning;
}

module.exports = { installDurableLearning, emptyClient };
