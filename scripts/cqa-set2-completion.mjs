// Compose the final reviewed batch into the unshipped authoring page before
// protected-package extraction. Earlier question sources remain byte-for-byte intact.
const BASE_SCRIPT = '<script src="/test-bank-cqa-set2.js"></script>';
const FINAL_SCRIPT = '<script src="/test-bank-cqa-set2-batch15.js"></script>';
const OLD_PLAN = "setPlans:{2:{target:150,label:'Batch 14 complete'}}";
const FINAL_PLAN = "setPlans:{2:{target:150,label:'150-question set complete'}}";
const occurrences = (source, text) => source.split(text).length - 1;

export function integrateCQASet2Completion(source) {
  if (typeof source !== 'string') throw new TypeError('Expected the exam authoring HTML.');
  if (occurrences(source, BASE_SCRIPT) !== 1) {
    throw new Error('Expected exactly one reviewed CQA Set 2 base script.');
  }
  if (source.includes(FINAL_SCRIPT)) {
    if (occurrences(source, FINAL_SCRIPT) !== 1 || occurrences(source, FINAL_PLAN) !== 1 || source.includes(OLD_PLAN) || !source.includes(BASE_SCRIPT + '\n' + FINAL_SCRIPT)) {
      throw new Error('CQA Set 2 completion is duplicated or out of order.');
    }
    return source;
  }
  if (occurrences(source, OLD_PLAN) !== 1 || source.includes(FINAL_PLAN)) {
    throw new Error('CQA Set 2 progress metadata changed; review completion integration.');
  }
  return source.replace(BASE_SCRIPT, BASE_SCRIPT + '\n' + FINAL_SCRIPT).replace(OLD_PLAN, FINAL_PLAN);
}
