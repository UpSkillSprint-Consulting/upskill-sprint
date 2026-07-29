export default async function testBankSetControls(request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const scripts = [
    '<script src="/test-bank-set-controls.js" defer></script>',
    '<script src="/test-bank-feedback-loop.js" defer></script>',
    '<script src="/test-bank-deep-feedback.js" defer></script>',
    '<script src="/test-bank-deep-feedback-grounding.js" defer></script>',
    '<script src="/test-bank-phase2-hardening.js" defer></script>',
    '<script src="/test-bank-phase2-attempt-history.js" defer></script>',
    '<script src="/test-bank-phase2-reporting.js" defer></script>',
    '<script src="/test-bank-phase2-runtime-coordinator.js" defer></script>',
    '<script src="/test-bank-phase2-quality-assurance.js" defer></script>',
    '<script src="/test-bank-adaptive-mastery.js" defer></script>'
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
