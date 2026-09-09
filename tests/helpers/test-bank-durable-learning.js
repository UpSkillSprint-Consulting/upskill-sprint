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
  /* Browser audit scripts serialize this fixture into their isolated auth
     adapter. The adapter can become available after Segment 13's first clock
     boot attempt, so reproduce the production auth-ready contract instead of
     leaving the trusted clock permanently uncalibrated. Two queued signals
     cover both early init-script execution and the later routed auth.js load;
     production code is unaffected because this helper is test-only. */
  if (typeof document === 'object' && typeof setTimeout === 'function' && typeof CustomEvent === 'function') {
    const announce = () => {
      try { document.dispatchEvent(new CustomEvent('upskill-auth-ready', { detail: { fixture: true } })); } catch (_) {}
    };
    setTimeout(announce, 0);
    setTimeout(announce, 50);
  }
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
       all-or-nothing RPC contract. Segment 13 also requires a trustworthy
       server clock before a timed quiz may start. Tests can deliberately move
       that authoritative fixture clock through __TEST_SERVER_TIME_MS; changing
       Date.now alone must never expire a timed exam. */
    rpc(name, args) {
      if (name === 'get_test_bank_server_time_v1') {
        const override = typeof globalThis !== 'undefined' && Number.isFinite(Number(globalThis.__TEST_SERVER_TIME_MS))
          ? Number(globalThis.__TEST_SERVER_TIME_MS)
          : null;
        return Promise.resolve({
          data: {
            protocolVersion: 1,
            serverTime: new Date(override == null ? undefined : override).toISOString(),
            userId: 'isolated-test-user'
          },
          error: null
        });
      }
      if (name === 'ingest_test_bank_operations_v1') {
        return Promise.resolve({
          data: (args && args.p_operations || []).map((operation, index) => ({
            operationId: operation.operationId,
            payloadDigest: 'fixture-digest-' + operation.operationId,
            receivedAt: new Date().toISOString(),
            acceptedAt: new Date().toISOString(),
            serverSequence: index + 1,
            sessionRevision: operation.expectedSessionRevision + 1,
            applied: true,
            canonicalEventId: operation.operationId,
            state: operation.type === 'finalization_requested' ? 'completed' : 'in_progress'
          })),
          error: null
        });
      }
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
  require('./test-bank-version-runtime.cjs').installVersions(window);
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
