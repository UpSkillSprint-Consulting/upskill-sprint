// Allow-list of lesson bodies served by netlify/functions/lesson-content.mjs.
//
// Each key is the lesson's content_access_rules resource key; each value is the
// fragment path under content/protected-lessons/. Only keys listed here can be
// requested, so a request can never name a file (no path traversal), and a
// lesson body cannot be served unless it is reviewed into this list.
//
// The access tier itself lives only in Supabase (public.can_access_content).
// Adding a lesson here does not grant anyone access; the rule row does.
// See docs/LESSON_CREATION_GUIDE.md §12.8 for the full teaser + payload contract.
export const PROTECTED_LESSONS = Object.freeze({
  'lesson:/lessons/statistics/choosing-a-transformation-to-linearize-data':
    'statistics/choosing-a-transformation-to-linearize-data.html'
});

export const PROTECTED_LESSON_DIRECTORY = 'content/protected-lessons';

/** Fragment path (relative to PROTECTED_LESSON_DIRECTORY) for an allow-listed key, else null. */
export function protectedLessonFile(resourceKey) {
  return typeof resourceKey === 'string' && Object.hasOwn(PROTECTED_LESSONS, resourceKey) ? PROTECTED_LESSONS[resourceKey] : null;
}

/** The site path a protected lesson key belongs to, e.g. "/lessons/statistics/x". */
export function protectedLessonRoute(resourceKey) {
  return resourceKey.replace(/^lesson:/, '');
}
