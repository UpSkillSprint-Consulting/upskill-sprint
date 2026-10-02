import { handleRequest } from './_shared/excel-sprint-grading.mjs';
import { issueCertificate } from './_shared/excel-sprint-certificates.mjs';
export default async function certificate(request) {
 return handleRequest(request, ['award','learnerName','tokens','expertTokens'], issueCertificate);
}
export const config = {path:'/api/excel-sprint/certificate',method:'POST',rateLimit:{windowLimit:12,windowSize:60,aggregateBy:['ip','domain']}};
