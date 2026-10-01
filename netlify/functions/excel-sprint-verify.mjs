import { handleRequest, verifyProgress } from './_shared/excel-sprint-grading.mjs';

export default async function verify(request) {
  return handleRequest(request, ['tokens'], verifyProgress);
}

export const config = {
  path: '/api/excel-sprint/verify', method: 'POST',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};
