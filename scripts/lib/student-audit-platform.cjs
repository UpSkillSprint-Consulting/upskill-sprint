'use strict';
// The Linux Playwright WebKit port paints through Skia/Mesa, not Apple's GPU
// stack. Recorded GPU-less runner freezes wait in the native
// paint/compositor path; select deterministic CPU ImageBuffers for these audits. Use WebKit's documented CPU rasterizer; retain normal
// CSS, SVG, compositing, screenshots, actionability and accessibility checks.
// This module is test infrastructure. The student application never imports it.
const POLICY_VERSION = 1;
function auditPlatform(env = process.env, platform = process.platform) {
  const environment = { ...env };
  const useCPU = platform === 'linux' && env.AUDIT_ENGINE !== 'chromium';
  if (useCPU) {
    environment.WEBKIT_SKIA_ENABLE_CPU_RENDERING = '1';
    environment.WEBKIT_SKIA_CPU_PAINTING_THREADS = '1';
  }
  return {
    environment,
    policy: {
      version: POLICY_VERSION,
      platform,
      engine: env.AUDIT_ENGINE || 'matrix',
      rasterizer: useCPU ? 'webkit-skia-cpu' : 'browser-default',
      paintingThreads: useCPU ? 1 : null,
      scope: 'audit-process-only'
    }
  };
}
module.exports = { auditPlatform, POLICY_VERSION };
