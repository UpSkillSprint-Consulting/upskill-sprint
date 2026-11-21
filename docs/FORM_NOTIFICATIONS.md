# Form submission email notifications

`netlify/functions/form-submission-notification.mjs` handles Netlify's `formSubmitted` event. Netlify invokes it only for a verified form submission and validates its event signature before calling the handler.

The notification uses the existing `RESEND_API_KEY`, `NEWSLETTER_FROM`, and `NEWSLETTER_ADMIN_EMAIL` function environment variables. The current production values send alerts to `hello@upskillsprint.com` from the verified UpSkill Sprint sender. The sender and recipient are fixed by site configuration; submitted fields cannot choose a destination. The handler excludes the honeypot and credential-like fields, escapes values in HTML, and uses a Resend idempotency key when Netlify provides a submission ID.

After the function is deployed to production, submit a clearly labeled test through the public form and confirm the message arrives at hello@. Once that delivery is confirmed, remove the legacy Netlify Forms email alert to `skillsprintconsulting@gmail.com` from Forms → Submission notifications. Keep the native alert until the new route has been verified so there is no notification gap during rollout.

## Code Finder export form

Submissions to `code-finder-export` get a custom lead alert ("Code Finder lead: <pack>") instead of the generic field dump, and the visitor is emailed their pack with the CSV attached. See `docs/CODE_FINDER_DATA.md` → Export leads. The function bundles `data/code-finder/*.json` (`netlify.toml` → `included_files`). If the catalog cannot be read, the generic alert is sent and the visitor email is skipped.
