import { gradeSubmission, handleRequest } from './_shared/excel-sprint-grading.mjs';

export default async function grade(request) {
  return handleRequest(request, ['packageId', 'submissions', 'predecessorToken', 'receipt'], gradeSubmission);
}

export const config = {
  path: '/api/excel-sprint/grade', method: 'POST',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};
