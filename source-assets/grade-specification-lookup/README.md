# Grade Specification Lookup source package

This directory contains the user-approved original Grade Specification Lookup and its user guide, stored as deterministic gzip/base64 source assets so GitHub and the Netlify build can handle the large single-file application reliably.

The build script verifies each decoded source against its approved SHA-256 digest, deletes the entire hosted route, and recreates only:

- `/engineering-tools/grade-specification-lookup/index.html`
- `/engineering-tools/grade-specification-lookup/how-to-use/index.html`

No legacy browser loader, JavaScript payload fragments, old HTML aliases, or wrapper pages are used.
