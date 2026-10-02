import {handleRequest} from './_shared/excel-sprint-grading.mjs';
import {coachFormula} from './_shared/excel-sprint-coaching.mjs';
export default async function coach(request) {
 return handleRequest(request,['packageId','taskId','formula','result','predecessorToken','receipt'],coachFormula);
}
export const config={path:'/api/excel-sprint/coach',method:'POST',rateLimit:{windowLimit:6,windowSize:60,aggregateBy:['ip','domain']}};
