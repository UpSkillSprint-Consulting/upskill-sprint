// What a Netlify deploy preview of a lesson must equal once the deploy-only tags
// (Netlify block, seasonal/ticker tags, skip link) are removed by the validator.
//
// build:site runs scripts/inject-lesson-jsonld.mjs, which adds one LearningResource
// JSON-LD <script> before </head> to every lesson that does not carry its own graph.
// The preview validators compare against exactly that output, so the check stays an
// exact match: nothing else on the page is normalised or ignored.
import { injectLessonJsonLd } from './inject-lesson-jsonld.mjs';

/** The lesson source as build:site stages it (source plus the injected JSON-LD, if any). */
export function expectedPreviewSource(source, lessonPath) {
  return injectLessonJsonLd(source, lessonPath) ?? source;
}
