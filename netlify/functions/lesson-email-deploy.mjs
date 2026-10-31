// Announces new lessons right after a production deploy succeeds, i.e. as soon
// as a lesson merged to main is live. Netlify signs platform events and blocks
// external requests to event handlers; we additionally act only on the
// production context of the production site (never deploy previews, branch
// deploys or the staging site).
//
// The hourly lesson-email-sweep function is the safety net if this event is
// ever missed. Both are idempotent; see netlify/functions/_shared/lesson-email.mjs.

import { netlifyEnv, readConfig, runAnnouncer, isProductionDeploy, defaultDeps } from './_shared/lesson-email.mjs';

// Comfortably inside the synchronous function limit; unfinished work resumes hourly.
const BUDGET_MS = 50_000;

export async function handleDeploySucceeded(event, { env = netlifyEnv(), deps = defaultDeps() } = {}) {
  const config = readConfig(env);
  const deploy = event?.deploy || event?.payload || {};
  const site = event?.site || {};
  const target = {
    context: deploy.context,
    siteName: site.name || deploy.name,
    siteUrl: site.url || deploy.ssl_url || deploy.url
  };
  if (!isProductionDeploy(target, config)) {
    deps.log('info', 'not_production_deploy', { context: target.context || null, site: target.siteName || null });
    return { skipped: 'not_production' };
  }
  return runAnnouncer({ trigger: 'deploy', deployId: deploy.id || null, config, deps, budgetMs: BUDGET_MS });
}

export default {
  async deploySucceeded(event) {
    await handleDeploySucceeded(event);
  }
};
