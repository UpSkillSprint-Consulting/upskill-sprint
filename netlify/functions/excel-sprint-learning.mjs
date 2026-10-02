import { handleRequest } from './_shared/excel-sprint-grading.mjs';
import { learningAction } from './_shared/excel-sprint-learning.mjs';

export default async function learning(request) {
  return handleRequest(request, ['action', 'answers', 'receipt', 'drillId', 'formula', 'result', 'token', 'tokens'], learningAction);
}

export const config = {
  path: '/api/excel-sprint/learning', method: 'POST',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};
