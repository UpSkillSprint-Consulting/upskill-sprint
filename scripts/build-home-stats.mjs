// Counts the practice questions in every released exam and publishes ONLY the
// totals as /home-stats.json for the homepage "by the numbers" box. No question
// text, answers or explanations leave the private delivery packages.
//
// Runs after build-exam-delivery.mjs (which writes content/exam-delivery-generated)
// and after stage-public-site.mjs (which creates public-site/).
//
// A question is counted once per exam, by its stem, across all of that exam's
// sets, so a question reused between sets is not counted twice. Exams count only
// when their card on /exam-practice is marked data-publication="published".
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DELIVERY = join(root, 'content', 'exam-delivery-generated');

/** Exam keys whose card is released on /exam-practice (same rule as the homepage exam count). */
export function publishedExams(examPracticeHtml) {
  const doc = new JSDOM(examPracticeHtml).window.document;
  const list = doc.getElementById('exam-certifications');
  if (!list) throw new Error('Exam catalog missing from exam-practice.html');
  return [...new Set([...list.querySelectorAll('.exam-card[data-publication="published"][data-exam]')]
    .map(card => card.getAttribute('data-exam').trim()).filter(Boolean))];
}

/** Unique questions in one exam's delivery package (runs its scripts in an isolated window). */
export function countQuestions(pkg, exam) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', pretendToBeVisual: true,
    virtualConsole: new VirtualConsole()
  });
  const w = dom.window;
  try {
    for (const source of pkg.scripts || []) {
      try { w.eval(source); } catch (e) { /* UI-only scripts may need a full page; banks still register. */ }
    }
    const e = w.__TB && w.__TB.EXAMS && w.__TB.EXAMS[exam];
    if (!e) throw new Error(`Exam ${exam} did not register a question bank`);
    const sets = Object.values(e.sets || {}).filter(Array.isArray);
    const items = sets.length && sets.some(s => s.length) ? sets.flat() : (Array.isArray(e.bank) ? e.bank : []);
    const stems = new Set(items.map(q => String((q && (q.stem || q.q || q.question)) || '').trim()).filter(Boolean));
    if (!stems.size) throw new Error(`Exam ${exam} has no countable questions`);
    return stems.size;
  } finally {
    w.close();
  }
}

export async function buildHomeStats(siteDir = join(root, 'public-site')) {
  const exams = publishedExams(await readFile(join(root, 'exam-practice.html'), 'utf8'));
  const byExam = {};
  for (const exam of exams) {
    const pkg = JSON.parse(await readFile(join(DELIVERY, `${exam}.json`), 'utf8'));
    byExam[exam] = countQuestions(pkg, exam);
  }
  const questions = Object.values(byExam).reduce((a, b) => a + b, 0);
  const stats = { questions, byExam, exams: exams.length };
  await mkdir(siteDir, { recursive: true });
  await writeFile(join(siteDir, 'home-stats.json'), JSON.stringify(stats, null, 2) + '\n');
  console.log(`Home stats: ${questions} practice questions across ${exams.length} exams.`);
  return stats;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildHomeStats(process.argv[2] ? resolve(process.argv[2]) : join(root, 'public-site'));
}
