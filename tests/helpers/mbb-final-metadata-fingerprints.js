'use strict';
// Final review corrected only two formula fields and two generated specs.
// Overlay only keys already present in historical snapshots; never skip checks
// or rewrite the original audit evidence. The new suite verifies these deltas.
const final = require('../../docs/audits/pr165-final-defect-fixes/metadata-corrections.json');
module.exports = function withFinalMetadata(manifest) {
  const maps = {
    question_sha256: final.question_sha256,
    stable_question_sha256: final.stable_question_sha256,
    questions_sha256: final.stable_question_sha256,
    unmodifiedQuestionSha256: final.stable_question_sha256,
    asset_sha256: final.asset_sha256,
    unmodifiedAssetsSha256: final.asset_sha256,
  };
  for (const [name, corrections] of Object.entries(maps)) {
    if (!manifest[name]) continue;
    for (const [id, digest] of Object.entries(corrections)) {
      if (Object.hasOwn(manifest[name], id)) manifest[name][id] = digest;
    }
  }
  return manifest;
};
