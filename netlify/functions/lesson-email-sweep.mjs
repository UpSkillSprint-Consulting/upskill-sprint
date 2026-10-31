// Hourly safety net for new-lesson emails (minute 23, UTC; it does not need a
// local hour because sends are gated by NEWSLETTER_SEND_WINDOW instead).
//
// It catches anything the deploy event missed, resumes campaigns that were
// interrupted, releases lessons that were waiting for the send window, and
// lets Ernest trigger a run on demand ("Run now" in Netlify > Functions).
// Scheduled functions only run on published deploys, and we also require the
// production site, so the staging site never sends.

import { netlifyEnv, readConfig, runAnnouncer, isProductionDeploy, defaultDeps } from './_shared/lesson-email.mjs';

// Scheduled functions stop at 30 seconds.
const BUDGET_MS = 22_000;

export async function handleSweep(context, { env = netlifyEnv(), deps = defaultDeps() } = {}) {
  const config = readConfig(env);
  const target = {
    context: context?.deploy?.context ?? 'production',
    siteName: context?.site?.name,
    siteUrl: context?.site?.url
  };
  if (!isProductionDeploy(target, config)) {
    deps.log('info', 'not_production_site', { site: target.siteName || null, context: target.context });
    return { skipped: 'not_production' };
  }
  return runAnnouncer({ trigger: 'sweep', deployId: context?.deploy?.id || null, config, deps, budgetMs: BUDGET_MS });
}

export default async (request, context) => {
  await handleSweep(context);
};

export const config = {
  schedule: '23 * * * *'
};
