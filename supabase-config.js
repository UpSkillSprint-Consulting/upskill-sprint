/* Supabase project configuration for UpSkill Sprint Consulting.
   Paste your project's values from Supabase: Project Settings -> API.
   The anon key is a publishable client key — it is safe to ship in the
   browser. Data protection comes from Row Level Security policies on
   the database, never from hiding this key. */
(function () {
var config = {
  url: 'https://prerurzpikodzbnezvgz.supabase.co',
  anonKey: 'sb_publishable_CagbT4_UPEi95EieYdq4nw_TdKQ4fqH',
  // Set after Turnstile is enabled in Supabase Auth protection settings.
  turnstileSiteKey: ''
};
// One public project configuration for the browser and the bundled exam function.
// This contains no service-role key or user credential.
if (typeof window !== 'undefined') window.UPSKILLSPRINT_SUPABASE_CONFIG = config;
if (typeof module !== 'undefined' && module.exports) module.exports = config;
}());

