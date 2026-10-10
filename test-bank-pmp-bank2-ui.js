(function (global) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const inline = value => esc(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  function table(headers, rows) {
    return scrollHint(headers) + '<div class="pmp2-scroll" role="region" aria-label="Question evidence table" tabindex="0"><table class="pmp2-table"><thead><tr>' + headers.map(h => '<th scope="col">' + inline(h) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map((v, i) => i ? '<td>' + inline(v) + '</td>' : '<th scope="row">' + inline(v) + '</th>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  function scrollHint(headers) {
    return headers.length > 3 ? '<p class="pmp2-scroll-hint">Swipe or scroll the table horizontally to see all columns.</p>' : '';
  }
  function markdown(value) {
    return String(value || '').split(/\n\n+/).filter(Boolean).map(block => {
      if (block.startsWith('|')) {
        const rows = block.split('\n').map(line => line.split('|').slice(1, -1).map(v => v.trim()));
        return table(rows[0], rows.slice(2));
      }
      return '<p>' + inline(block).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  // Legacy Set 1 batches also use pmp:set-2:* IDs (Q081–100). Identify this
  // actual Set 2 by its explicit bank marker, never by that legacy prefix.
  const isQuestion = q => !!q && q.bankId === 'pmp-bank2-2026' && Array.isArray(q.choices);
  const isInteractive = q => isQuestion(q) && q.format !== 'single';
  const letters = q => q.choices.map(choice => choice[0]);

  /* The shared engine's contract is an integer option index. Encode each
     response state deterministically, including partial matches, without
     changing grading, session state, or any other exam bank. The expanded
     options are compact response labels; students only see authored choices.
     Bit masks encode multiple selections; base-(choices + 1) digits encode
     matching rows (zero means unanswered). Exact equality awards one point. */
  function encode(q, response) {
    const keys = letters(q);
    if (q.format === 'multiple') return (response || []).reduce((code, key) => code | (1 << keys.indexOf(key)), 0);
    if (q.format === 'matching') return q.prompts.reduce((code, row, i) => code + (keys.indexOf(response[row[0]]) + 1) * Math.pow(keys.length + 1, i), 0);
    return keys.indexOf(Array.isArray(response) ? response[0] : response);
  }
  function decode(q, code) {
    const keys = letters(q);
    if (q.format === 'multiple') return keys.filter((_, i) => (Number(code) & (1 << i)) !== 0);
    if (q.format === 'matching') return Object.fromEntries(q.prompts.map((row, i) => [row[0], keys[Math.floor(Number(code) / Math.pow(keys.length + 1, i)) % (keys.length + 1) - 1] || '']));
    return code == null ? '' : keys[code] || '';
  }
  function responseLabel(q, code) {
    if (code == null) return 'Not answered';
    const response = decode(q, code);
    if (q.format === 'matching') return q.prompts.map(row => row[0] + ' → ' + (response[row[0]] || 'unanswered')).join('; ');
    if (q.format === 'multiple') return response.length ? response.join(' and ') : 'No choices selected';
    return response + '. ' + (q.choices[code] ? q.choices[code][1] : 'Answer unavailable');
  }
  function prepare(source, batch) {
    const q = Object.assign({}, source, {
      qid: 'pmp:set-2:original-' + String(source.n).padStart(3, '0'), authorId: source.id,
      bankId: 'pmp-bank2-2026',
      set: 2, batch: batch.number, original: true, choices: source.options,
      sub: {'People':'pmp-people', 'Process':'pmp-process', 'Business Environment':'pmp-business'}[source.domain],
      ecoTask: source.domain + ' Task ' + source.task,
      caseStudy: source.caseId ? batch.caseStudy : null,
      auditSources: [{title:'PMP Examination Content Outline, July 2026',url:'https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf'}]
    });
    q.options = q.choices.map(choice => choice[1]);
    if (q.format === 'multiple' || q.format === 'matching') {
      const count = q.format === 'multiple' ? Math.pow(2, q.choices.length) : Math.pow(q.choices.length + 1, q.prompts.length);
      q.options = Array.from({length:count}, (_, i) => responseLabel(q, i));
    }
    q.answer = encode(q, q.correct);
    q.why = markdown(q.explanation) + '<details class="pmp2-references"><summary>Source references</summary><ul>' + q.references.map(ref => '<li>' + inline(ref) + '</li>').join('') + '</ul></details>';
    // Native single-choice consumers can still use their established rationale contract.
    if (q.format !== 'multiple' && q.format !== 'matching') q.optionRationales = q.choices.map(choice => q.rationales[choice[0]]);
    return q;
  }
  function render(q, review) {
    let html = '<div class="pmp2-question"><p class="pmp2-number">PMP Set 2 · Question ' + String(q.n).padStart(3, '0') + '</p>';
    const c = q.caseStudy;
    if (c) html += '<section class="pmp2-case"><h3>' + esc(c.title) + '</h3>' + (c.markdown ? markdown(c.markdown) : markdown(c.intro) + table(['Project record', 'Details'], c.exhibit)) + '</section>';
    html += '<div class="' + (review ? 'tb-review-stem' : 'tb-stem') + '">' + markdown(q.stem) + '</div>';
    if (q.exhibitMarkdown) html += markdown(q.exhibitMarkdown);
    if (q.exhibit && (q.format !== 'hotspot' || review)) html += table(q.exhibit.headers, q.exhibit.rows);
    if (q.format === 'matching' && review) html += table(['Row', 'Situation or need'], q.prompts);
    if (q.format === 'single') html += '<p>Select ONE answer.</p>';
    return html + '</div>';
  }
  function select(q, value, row) {
    return '<select data-pmp-select="' + esc(row || '') + '"><option value="">Choose a response</option>' + q.choices.map(choice => '<option value="' + choice[0] + '"' + (choice[0] === value ? ' selected' : '') + '>' + choice[0] + '. ' + esc(choice[1]) + '</option>').join('') + '</select><span class="pmp2-selected-text" aria-hidden="true">' + esc(selectedText(q, value)) + '</span>';
  }
  function selectedText(q, value) {
    const choice = q.choices.find(choice => choice[0] === value);
    return choice ? 'Selected: ' + choice[0] + '. ' + choice[1] : 'No response selected.';
  }
  function responseBank(q) {
    return '<div class="pmp2-response-bank"><p><strong>Available responses</strong></p><p>Read the full responses here, then choose the corresponding letter below.</p><ul>' + q.choices.map(choice => '<li><strong>' + esc(choice[0]) + '.</strong> ' + esc(choice[1]) + '</li>').join('') + '</ul></div>';
  }
  function renderAnswers(q, selected, locked) {
    const value = decode(q, selected);
    let body = '';
    if (q.format === 'multiple') body = '<fieldset><legend>Select TWO answers. Both must be correct for one point.</legend>' + q.choices.map(choice => '<label class="pmp2-choice"><input type="checkbox" data-pmp-choice="' + choice[0] + '"' + (value.includes(choice[0]) ? ' checked' : '') + '><span>' + choice[0] + '. ' + esc(choice[1]) + '</span></label>').join('') + '</fieldset>';
    if (q.format === 'matching') body = '<fieldset><legend>Match every row. Use each response at most once. All matches must be correct for one point.</legend>' + q.prompts.map(row => '<label class="pmp2-match"><span>' + row[0] + '. ' + esc(row[1]) + '</span>' + select(q, value[row[0]], row[0]) + '</label>').join('') + '</fieldset>';
    if (q.format === 'dropdown') body = '<label class="pmp2-match"><span>Select ONE response to complete the statement.</span>' + select(q, value) + '</label>';
    if (q.format === 'hotspot') {
      const headers = q.exhibit.headers;
      const rows = q.exhibit.rows;
      body = '<p>' + esc(q.hotspotInstruction || (q.hotspotType === 'engagement' ? 'C = current; D = desired. Select ONE current marker.' : 'Select ONE forecast receipt cell.')) + '</p>' + scrollHint(headers) + '<div class="pmp2-scroll" role="region" aria-label="Selectable question evidence" tabindex="0"><table class="pmp2-table' + (headers.length <= 3 ? ' pmp2-table-compact' : '') + '"><thead><tr>' + headers.map(h => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((row, r) => '<tr>' + row.map((cell, col) => {
        if (col === 0) return '<th scope="row">' + esc(cell) + '</th>';
        const target = q.hotspotType === 'engagement' ? cell.includes('C') : col === (q.hotspotColumn ?? 2);
        return '<td>' + (target ? '<button type="button" class="pmp2-cell" data-pmp-cell="' + q.choices[r][0] + '" aria-label="' + esc(q.choices[r][1]) + '" aria-pressed="' + (value === q.choices[r][0]) + '">' + esc(cell.replace(/ \[[A-D]\]/g, '')) + '</button>' : esc(cell)) + '</td>';
      }).join('') + '</tr>').join('') + '</tbody></table></div>';
    }
    return '<div class="pmp2-answers" data-pmp-locked="' + !!locked + '">' + ((q.format === 'matching' || q.format === 'dropdown') ? responseBank(q) : '') + body + '<p class="pmp2-selection" role="status" aria-live="polite">' + esc(responseLabel(q, selected)) + '</p></div>';
  }
  function update(root, q, selected, locked) {
    const wrap = root.querySelector('.pmp2-answers');
    if (!wrap) return;
    wrap.dataset.pmpLocked = String(!!locked);
    const value = decode(q, selected);
    wrap.querySelectorAll('input,select,button').forEach(control => {
      control.disabled = !!locked;
      if (control.dataset.pmpChoice) control.checked = value.includes(control.dataset.pmpChoice);
      if (control.hasAttribute('data-pmp-select')) {
        control.value = q.format === 'matching' ? value[control.dataset.pmpSelect] : value;
        control.nextElementSibling.textContent = selectedText(q, control.value);
      }
      if (control.dataset.pmpCell) control.setAttribute('aria-pressed', String(control.dataset.pmpCell === value));
    });
    wrap.querySelector('.pmp2-selection').textContent = responseLabel(q, selected);
  }
  function wire(root, q, getSelected, onSelect) {
    const wrap = root.querySelector('.pmp2-answers');
    if (!wrap) return;
    const commit = control => {
      if (wrap.dataset.pmpLocked === 'true') return;
      let response;
      if (q.format === 'multiple') response = Array.from(wrap.querySelectorAll('input:checked'), input => input.dataset.pmpChoice);
      else if (q.format === 'matching') response = Object.fromEntries(Array.from(wrap.querySelectorAll('select'), input => [input.dataset.pmpSelect, input.value]));
      else response = control.dataset.pmpCell || control.value;
      // A blank drop-down leaves the question unanswered. Matching and multiple
      // states include partial input and are graded only on final submission.
      let code = encode(q, response);
      if (code < 0 || ((q.format === 'matching' || q.format === 'multiple') && code === 0)) code = null;
      onSelect(code);
      update(root, q, getSelected(), wrap.dataset.pmpLocked === 'true');
    };
    wrap.querySelectorAll('input,select').forEach(control => control.addEventListener('change', () => commit(control)));
    wrap.querySelectorAll('[data-pmp-cell]').forEach(control => control.addEventListener('click', () => commit(control)));
    update(root, q, getSelected(), wrap.dataset.pmpLocked === 'true');
  }
  function reviewOptions(q, selected) {
    const value = decode(q, selected);
    if (q.format === 'matching') return table(['Row', 'Your response', 'Correct response'], q.prompts.map(row => [row[0], value[row[0]] || 'Not answered', q.correct[row[0]]])) + table(['Response', 'Meaning'], q.choices);
    return q.choices.map((choice, i) => '<p><strong>' + choice[0] + '.</strong> ' + esc(choice[1]) + ((q.format === 'multiple' ? value.includes(choice[0]) : selected === i) ? ' <strong>(Your answer)</strong>' : '') + (q.correct.includes(choice[0]) ? ' <strong>(Correct answer)</strong>' : '') + '</p>').join('');
  }
  function rationales(q) {
    return '<details class="tb-review-rationales"><summary>Reasoning for every response</summary>' + q.choices.map(choice => '<p><strong>' + choice[0] + '.</strong> ' + inline(q.rationales[choice[0]]) + '</p>').join('') + '</details>';
  }
  const questions = (global.PMP_BANK2_SOURCE || []).flatMap(batch => batch.questions.map(q => prepare(q, batch)));
  global.PMP_BANK2 = questions;
  global.registerPMPBank2 = function (exam) {
    exam.sets[2] = questions;
    exam.setPlans[2] = {target:180, label:'Q001–Q180'};
    exam.fullExamQuestionsBySet[2] = 180;
  };
  global.__PMPSet2UI = Object.freeze({isQuestion,isInteractive,render,renderAnswers,wire,update,encode,decode,responseLabel,reviewOptions,rationales});
})(typeof window !== 'undefined' ? window : globalThis);
