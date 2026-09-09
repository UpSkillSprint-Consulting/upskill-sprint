const POLICY_SOURCE = '/test-bank-incremental-sync-policy.js';
const ACCOUNT_SYNC_SOURCE = '/test-bank-account-sync.js';
const LEARNING_SYNC_SOURCE = '/test-bank-learning-events.js';

function scriptTag(source) { return `<script src="${source}" defer></script>`; }

function ensureIncrementalPolicyBeforeSync(html) {
  if (html.includes(`src="${POLICY_SOURCE}"`)) return html;
  const policy = scriptTag(POLICY_SOURCE);
  const accountTag = scriptTag(ACCOUNT_SYNC_SOURCE);
  const learningTag = scriptTag(LEARNING_SYNC_SOURCE);
  if (html.includes(accountTag)) return html.replace(accountTag, policy + accountTag);
  if (html.includes(learningTag)) return html.replace(learningTag, policy + learningTag);
  return html;
}

export default async function testBankSetControls(request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  /* Segment 14 policy must execute before either existing sync runtime. A page
     that already contains account/learning tags cannot be fixed by appending
     the policy at </body>: deferred scripts execute in document order. */
  html = ensureIncrementalPolicyBeforeSync(html);
  const scripts = [
    '<script src="/test-bank-question-registry.js" defer></script>',
    '<script src="/test-bank-versioning.js" defer></script>',
    '<script src="/test-bank-version-catalog.js" defer></script>',
    '<script src="/test-bank-set-controls.js" defer></script>',
    '<script src="/test-bank-feedback-loop.js" defer></script>',
    '<script src="/test-bank-phase1-api.js" defer></script>',
    '<script src="/test-bank-deep-feedback.js" defer></script>',
    '<script src="/test-bank-deep-feedback-grounding.js" defer></script>',
    '<script src="/test-bank-phase2-hardening.js" defer></script>',
    '<script src="/test-bank-phase2-attempt-history.js" defer></script>',
    '<script src="/test-bank-phase2-reporting.js" defer></script>',
    '<script src="/test-bank-phase2-runtime-coordinator.js" defer></script>',
    '<script src="/test-bank-phase2-quality-assurance.js" defer></script>',
    '<script src="/test-bank-incremental-sync-policy.js" defer></script>',
    '<script src="/test-bank-account-sync.js" defer></script>',
    '<script src="/test-bank-history-reconciliation.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery.js" defer></script>',
    '<script src="/test-bank-learning-events.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery-runtime.js" defer></script>',
    '<script src="/test-bank-metrics-policy.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery-hardening.js" defer></script>',
    '<script src="/test-bank-history-policy.js" defer></script>',
    '<script src="/test-bank-analytics-dashboard.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery-completion-guard.js" defer></script>',
    '<script src="/test-bank-phases-integration.js" defer></script>'
  ];
  const missingScripts = scripts.filter(function (script) {
    const source = script.match(/src="([^"]+)"/)[1];
    return !html.includes(source);
  });

  if (!missingScripts.length) return new Response(html, response);

  const injection = missingScripts.join('');
  const enhancedHtml = html.includes('</body>')
    ? html.replace('</body>', injection + '</body>')
    : html + injection;

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('etag');

  return new Response(enhancedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export const config = {
  path: ['/test-bank', '/test-bank/', '/test-bank.html'],
  method: 'GET',
  onError: 'bypass'
};
