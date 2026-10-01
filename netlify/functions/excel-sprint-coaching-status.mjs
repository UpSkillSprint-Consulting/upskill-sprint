import {json} from './_shared/excel-sprint-grading.mjs';
import {coachingSettings} from './_shared/excel-sprint-coaching.mjs';
export default function status(){return json(200,{available:!!coachingSettings()});}
export const config={path:'/api/excel-sprint/coaching-status',method:'GET',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']}};
