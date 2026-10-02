import { handleRequest } from './_shared/excel-sprint-grading.mjs';
import { verifyCertificate } from './_shared/excel-sprint-certificates.mjs';
export default async function verify(request) {
 return handleRequest(request, ['certificateToken'], verifyCertificate);
}
export const config = {path:'/api/excel-sprint/certificate/verify',method:'POST',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']}};
