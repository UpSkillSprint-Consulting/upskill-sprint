const POLICY_SOURCE = '/test-bank-incremental-sync-policy.js';
const ACCOUNT_SYNC_SOURCE = '/test-bank-account-sync.js';
const LEARNING_SYNC_SOURCE = '/test-bank-learning-events.js';
const NEW_ONLY_ALLOCATION_SOURCE = '/test-bank-new-only-allocation-v2.js';
const SECURITY_RESET_SOURCE = '/test-bank-security-reset.js';
const UX_ACCESSIBILITY_SOURCE = '/test-bank-ux-accessibility.js';
const UX_ACCESSIBILITY_STYLE_SOURCE = '/test-bank-ux-accessibility.css';

function scriptTag(source) { return `<script src="${source}" defer></script>`; }
function styleTag(source) { return `<link rel="stylesheet" href="${source}">`; }

function ensureIncrementalPolicyBeforeSync(html) {
  const policy = scriptTag(POLICY_SOURCE);
  const accountTag = scriptTag(ACCOUNT_SYNC_SOURCE);
  const learningTag = scriptTag(LEARNING_SYNC_SOURCE);
  const policyIndex = html.indexOf(policy);
  const accountIndex = html.indexOf(accountTag);
  const learningIndex = html.indexOf(learningTag);
  const firstSyncIndex = [accountIndex, learningIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
  if (firstSyncIndex == null) return html;
  if (policyIndex >= 0 && policyIndex < firstSyncIndex) return html;
  const withoutLatePolicy = policyIndex >= 0 ? html.replace(policy, '') : html;
  if (withoutLatePolicy.includes(accountTag)) return withoutLatePolicy.replace(accountTag, policy + accountTag);
  if (withoutLatePolicy.includes(learningTag)) return withoutLatePolicy.replace(learningTag, policy + learningTag);
  return withoutLatePolicy;
}

function ensureAccessibilityStyles(html) {
  const tag = styleTag(UX_ACCESSIBILITY_STYLE_SOURCE);
  if (html.includes(UX_ACCESSIBILITY_STYLE_SOURCE)) return html;
  if (html.includes('</head>')) return html.replace('</head>', tag + '</head>');
  return tag + html;
}

export default async function testBankSetControls(request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  html = ensureIncrementalPolicyBeforeSync(html);
  html = ensureAccessibilityStyles(html);
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
    scriptTag(POLICY_SOURCE),
    scriptTag(ACCOUNT_SYNC_SOURCE),
    '<script src="/test-bank-history-reconciliation.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery.js" defer></script>',
    scriptTag(LEARNING_SYNC_SOURCE),
    scriptTag(NEW_ONLY_ALLOCATION_SOURCE),
    '<script src="/test-bank-adaptive-mastery-runtime.js" defer></script>',
    '<script src="/test-bank-metrics-policy.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery-hardening.js" defer></script>',
    '<script src="/test-bank-history-policy.js" defer></script>',
    '<script src="/test-bank-analytics-dashboard.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery-completion-guard.js" defer></script>',
    '<script src="/test-bank-phases-integration.js" defer></script>',
    scriptTag(SECURITY_RESET_SOURCE),
    scriptTag(UX_ACCESSIBILITY_SOURCE)
  ];
  const missingScripts = scripts.filter(function (script) {
    const source = script.match(/src="([^"]+)"/)[1];
    return !html.includes(source);
  });
  if (!missingScripts.length) return new Response(html, response);

  const injection = missingScripts.join('');
  const enhancedHtml = html.includes('</body>') ? html.replace('</body>', injection + '</body>') : html + injection;
  const headers = new Headers(response.headers);
  headers.delete('content-length'); headers.delete('etag');
  return new Response(enhancedHtml, { status: response.status, statusText: response.statusText, headers });
}

export const config = {
  path: ['/test-bank', '/test-bank/', '/test-bank.html'],
  method: 'GET',
  onError: 'bypass'
};