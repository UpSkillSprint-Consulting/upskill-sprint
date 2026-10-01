import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { fail, verifyProgress, PACKAGE_IDS, EXPERT_CORE_IDS, EXPERT_IDS, tokenHash } from './excel-sprint-grading.mjs';

const AWARDS = Object.freeze({
 'levels-1-6': { title:'Excel Formula Sprint — Levels 1–6', scope:'30 core assignments across Levels 1–6', coreCount:30, expertCount:0 },
 'expert-track-v1': { title:'Excel Formula Sprint — Expert Track', scope:'30 core assignments across Levels 1–6 and 3 Expert Track capstones', coreCount:30, expertCount:3 },
 'full-path': { title:'Excel Formula Sprint — Levels 1–10', scope:'50 core assignments across Levels 1–10', coreCount:50, expertCount:0 }
});
const DOMAIN = 'excel-sprint-certificate-v1.';
const LIMIT = 'Verifies matching submitted outputs and a continuous signed learning path. Learner name is self-reported. Does not verify identity, independent work or Excel formula execution.';
const sha = text => createHash('sha256').update(text).digest('hex');
function nameOf(value) {
 if (typeof value !== 'string') fail(400, 'Enter the learner name to display on the certificate.');
 const name = value.normalize('NFKC').trim().replace(/ +/g,' ');
 if (!name || [...name].length > 80 || /[<>\p{Cc}\p{Cf}]/u.test(name) || !/\p{L}/u.test(name)) fail(400, 'Use a name of 1–80 characters without markup or control characters.');
 return name;
}
function identity(proof) { return sha(JSON.stringify([proof.award,proof.chainId,proof.coreProofHash,proof.expertProofHash,proof.learnerName])).slice(0,24).toUpperCase(); }
export function issueCertificate(payload, secret) {
 const award = Object.hasOwn(AWARDS, payload.award) ? AWARDS[payload.award] : null;
 if (!award) fail(400, 'Choose a released certificate award.');
 const name = nameOf(payload.learnerName);
 const progress = verifyProgress(payload, secret);
 if (progress.completions.length < award.coreCount || progress.expertCompletions.length < award.expertCount) fail(403, 'Complete every required assignment and capstone for this certificate.');
 const lastCore = progress.completions[award.coreCount-1], lastExpert = award.expertCount ? progress.expertCompletions[award.expertCount-1] : null;
 const proof = { type:'certificate',schema:1,issuer:'UpSkillSprint',award:payload.award,title:award.title,scope:award.scope,
  learnerName:name,nameSource:'self-reported',coreCount:award.coreCount,expertCount:award.expertCount,
  corePackageIds:award.coreCount===50 ? PACKAGE_IDS : EXPERT_CORE_IDS,expertPackageIds:award.expertCount ? EXPERT_IDS : [],
  chainId:lastCore.chainId,coreProofHash:tokenHash(lastCore.completionToken),expertProofHash:lastExpert ? tokenHash(lastExpert.completionToken) : null,
  completedAt:lastExpert?.timestamp || lastCore.timestamp,issuedAt:new Date().toISOString(),limitations:LIMIT };
 proof.certificateId = identity(proof);
 const encoded = Buffer.from(JSON.stringify(proof)).toString('base64url');
 const signature = createHmac('sha256',secret).update(DOMAIN+encoded).digest('base64url');
 return { certificate:proof,certificateToken:`${encoded}.${signature}` };
}
export function verifyCertificate(payload, secret) {
 const token = payload.certificateToken;
 if (typeof token !== 'string' || token.length > 10000 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token)) fail(403, 'The certificate proof is invalid.');
 const [encoded, supplied] = token.split('.'), expected = createHmac('sha256',secret).update(DOMAIN+encoded).digest(), actual = Buffer.from(supplied,'base64url');
 if (actual.length !== expected.length || !timingSafeEqual(actual,expected)) fail(403, 'The certificate proof is invalid.');
 let proof;try { proof=JSON.parse(Buffer.from(encoded,'base64url').toString('utf8')); } catch { fail(403,'The certificate proof is invalid.'); }
 const award = proof && Object.hasOwn(AWARDS, proof.award) ? AWARDS[proof.award] : null;
 if (!award || proof.type!=='certificate' || proof.schema!==1 || proof.issuer!=='UpSkillSprint' || proof.title!==award.title || proof.scope!==award.scope ||
     proof.nameSource!=='self-reported' || proof.coreCount!==award.coreCount || proof.expertCount!==award.expertCount ||
     JSON.stringify(proof.corePackageIds)!==JSON.stringify(award.coreCount===50?PACKAGE_IDS:EXPERT_CORE_IDS) || JSON.stringify(proof.expertPackageIds)!==JSON.stringify(award.expertCount?EXPERT_IDS:[]) ||
     typeof proof.chainId!=='string' || !/^[0-9a-f-]{36}$/.test(proof.chainId) || !/^[A-Za-z0-9_-]{43}$/.test(proof.coreProofHash) ||
     (award.expertCount ? !/^[A-Za-z0-9_-]{43}$/.test(proof.expertProofHash) : proof.expertProofHash!==null) ||
     typeof proof.issuedAt!=='string' || !Number.isFinite(Date.parse(proof.issuedAt)) || typeof proof.completedAt!=='string' || !Number.isFinite(Date.parse(proof.completedAt)) ||
     proof.limitations!==LIMIT || nameOf(proof.learnerName)!==proof.learnerName || proof.certificateId!==identity(proof)) fail(403,'The certificate proof is invalid.');
 return { verified:true,certificate:proof };
}
