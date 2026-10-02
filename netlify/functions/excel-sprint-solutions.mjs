import { handleRequest, packageSolutions } from './_shared/excel-sprint-grading.mjs';

export default async function solutions(request) {
  return handleRequest(request, ['packageId', 'completionToken'], packageSolutions);
}

export const config = {
  path: '/api/excel-sprint/solutions', method: 'POST',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};
