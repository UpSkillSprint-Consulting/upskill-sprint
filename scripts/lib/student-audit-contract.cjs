'use strict';
// All original six configurations remain. A second independent mobile WebKit
// session is additional coverage, not a retry of a failed session.
const PROFILES = Object.freeze([
  { label: 'chromium-desktop', engine: 'chromium', layout: 'desktop', width: 1440, mixed: false },
  { label: 'webkit-desktop', engine: 'webkit', layout: 'desktop', width: 1440, mixed: false },
  { label: 'chromium-mobile', engine: 'chromium', layout: 'mobile', width: 390, mixed: false },
  { label: 'webkit-mobile', engine: 'webkit', layout: 'mobile', width: 390, mixed: false },
  { label: 'chromium-narrow-mixed', engine: 'chromium', layout: 'mobile', width: 320, mixed: true },
  { label: 'webkit-narrow-mixed', engine: 'webkit', layout: 'mobile', width: 320, mixed: true },
  { label: 'webkit-mobile-repeat', engine: 'webkit', layout: 'mobile', width: 390, mixed: false }
].map(Object.freeze));
const TOOL_VERSIONS = Object.freeze({ playwright: '1.63.0', axe: '4.13.0' });
module.exports = { PROFILES, TOOL_VERSIONS };
