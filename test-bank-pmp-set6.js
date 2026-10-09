/*
 * PMI PMP Exam Set 6 — original practice questions.
 * Q171-Q180. Written to the July 2026 Exam Content Outline
 * (People, Process, Business Environment) and the PMBOK Guide 8th Edition
 * performance domains. No PMI item, handbook passage, or figure is copied.
 * UpSkill Sprint is not affiliated with the Project Management Institute.
 */
(function (global) {
  'use strict';

  var questions = [
    {
      qid: 'pmp:set-6:171',
      sub: 'pmp-process',
      ecoTask: 'Manage project closure',
      approach: 'Predictive',
      stem: 'The customer signed the acceptance form. In the comments they listed three defects that stop operations from running the process. A lead says the signature means the project can close. What should you do?',
      options: [
        'Close it. A signature is acceptance, and comments are notes.',
        'Do not close on that signature. The comments are open work that blocks operations. Resolve them, or get an acceptance that states what was actually accepted.',
        'Delete the comments from the signed form so the close file looks clean.',
        'Transfer the three defects to a new project with no one told.'
      ],
      answer: 1,
      why: '<p>The signature and the comments disagree. Operations cannot run the process, so the form is not a clean acceptance. The project manager resolves the defects or gets an acceptance that says what was really accepted. Deleting the comments, or parking the defects on an unnamed project, makes the file look closed.</p><p><strong>Exam tip:</strong> Read the comments on an acceptance. A signature that lists blocking defects is not permission to close.</p>',
      optionRationales: [
        'Comments that stop operations are open work, not decoration on a signature.',
        'The defects are resolved, or the acceptance is rewritten to say what was actually accepted.',
        'Removing the comments falsifies the form the customer signed.',
        'A new project with no owner hides the defects instead of closing them.'
      ],
      keyPoint: 'Do not close on a signature whose comments still block operations.',
      trap: 'A signed form is the easiest document to mistake for a finished acceptance.'
    },
    {
      qid: 'pmp:set-6:172',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Hybrid',
      stem: 'Operations needs a transition workshop on Thursday. The sponsor wants that same afternoon for a celebration, and says the workshop can be one slide at the party. The operations staff have not practiced the new process. What should you do?',
      options: [
        'Use the afternoon for the party. Morale is part of transition.',
        'Cancel any recognition. The workshop is the only thing that matters.',
        'Hold the workshop with the operations staff. Recognition can follow. Do not replace the handover with a party.',
        'Record a slide and send it after the party so both events are satisfied.'
      ],
      answer: 2,
      why: '<p>The people who will run the process have not practiced it. A slide at a party is not that practice. The project manager keeps the workshop and lets recognition follow. Cancelling recognition altogether is unnecessary. A recording after the party leaves Thursday without the handover.</p><p><strong>Exam tip:</strong> Celebrate after the people who will run the process can actually run it. Do not trade the workshop for the party.</p>',
      optionRationales: [
        'Morale does not teach operations a process they have not practiced.',
        'Recognition can happen. It does not have to be cancelled to protect the workshop.',
        'The workshop stays with the operations staff, and the celebration comes after.',
        'A slide sent later is not practice, and it gives away the only afternoon they had.'
      ],
      keyPoint: 'Keep the transition workshop. Do not fold it into a celebration.',
      trap: 'One slide at the party feels like both events and teaches nobody the process.'
    },
    {
      qid: 'pmp:set-6:173',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Agile',
      stem: 'The person who owned the benefit measures left the company the week after go-live. The close checklist has a blank next to those measures. A lead says the blank is fine because the measures were already designed. What should you do?',
      options: [
        'Close the blank. A designed measure does not need a living owner.',
        'Ask the sponsor to name a new owner before you close. Do not leave the measures with nobody to read them.',
        'Delete the measures from the checklist so the blank goes away.',
        'Assign the measures to the person who left, until someone notices.'
      ],
      answer: 1,
      why: '<p>A measure with no owner will not be read. Design is not ownership, and the owner has left. The project manager gets the sponsor to name a replacement before close. Deleting the measures, or leaving them under a person who is gone, clears the blank without keeping the benefit visible.</p><p><strong>Exam tip:</strong> Before you close, every benefit measure needs a living owner. A blank line is an open item.</p>',
      optionRationales: [
        'A design nobody reads is not a benefit measure.',
        'The sponsor names someone who is still here, and the close waits on that name.',
        'Deleting the line removes the measure instead of staffing it.',
        'The person who left cannot read a result next month.'
      ],
      keyPoint: 'Name a new owner for the benefit measures before you close.',
      trap: 'The measures were designed is not the same as someone will look at them.'
    },
    {
      qid: 'pmp:set-6:174',
      sub: 'pmp-process',
      ecoTask: 'Manage project closure',
      approach: 'Hybrid',
      stem: 'The sponsor asks you to close the project today because the exhibit shows the money and the archive are done. What should you do?',
      options: [
        'Close it. Finance and the archive are the parts that matter at the end.',
        'Do not close. Acceptance is unsigned, the punch list sits with people who have been released, and operations have not been trained.',
        'Sign the acceptance yourself so the open rows can be marked done.',
        'Release the punch list and the training from the checklist because the people assigned to them are already gone.'
      ],
      answer: 1,
      chart: {
        type: 'data-table',
        title: 'Close checklist, this morning',
        columns: ['Item', 'Status'],
        rows: [
          ['Financial close', 'Done'],
          ['Project records', 'Archived'],
          ['Customer acceptance', 'Unsigned'],
          ['Punch list', '4 items, each assigned to someone already released'],
          ['Operations training', 'Not held']
        ]
      },
      why: '<p>Money and records are done. Acceptance, the punch list, and training are not, and the people named on the punch list have already left. The project manager does not close. Signing for the customer, or dropping the open rows because the people are gone, finishes the checklist instead of the work.</p><p><strong>Exam tip:</strong> At close, read the rows that are still open. A finished archive does not accept the product or train operations.</p>',
      optionRationales: [
        'Finance and the archive are two rows. The exhibit has three others still open.',
        'The close waits on acceptance, a punch list someone can still do, and the training.',
        'Your signature is not the customer acceptance.',
        'Dropping open rows because people left hides the work the release created.'
      ],
      keyPoint: 'Do not close while acceptance, the punch list, and training are open.',
      trap: 'Two green rows at the top of a close checklist can hide three open ones under them.'
    },
    {
      qid: 'pmp:set-6:175',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Predictive',
      stem: 'A junior project manager asks how to tell the sponsor the project succeeded. Two of the four success criteria were missed. The team worked nights. The junior says the sponsor will remember the effort, so the message should lead with that. What should you do?',
      options: [
        'Lead with the nights. Effort is the success the sponsor can feel.',
        'Coach them to report the four criteria as written. Recognize the effort, and do not let it stand in for the two criteria that were missed.',
        'Report all four criteria as met so the junior does not have to give bad news.',
        'Skip the sponsor and file the criteria as a lesson only the team will see.'
      ],
      answer: 1,
      why: '<p>Success was defined as four criteria. Two were missed. Effort can be recognized, and it does not replace those two. The project manager coaches the junior to say that plainly. Rewriting the result, or hiding it in a team-only lesson, teaches the junior to manage the sponsor mood instead of the agreement.</p><p><strong>Exam tip:</strong> Report success criteria as they were written. Hard work is real. It is not a substitute for a missed criterion.</p>',
      optionRationales: [
        'Nights may deserve thanks. They do not convert two missed criteria into a success.',
        'The sponsor hears the four criteria, including the two misses, and the effort is recognized separately.',
        'Marking missed criteria as met is a false closeout.',
        'A lesson the sponsor never sees avoids the conversation the criteria were for.'
      ],
      keyPoint: 'Coach the junior to report the criteria. Do not recast missed criteria as effort.',
      trap: 'The team worked hard is the sentence that most often replaces a missed success criterion.'
    },
    {
      qid: 'pmp:set-6:176',
      sub: 'pmp-process',
      ecoTask: 'Manage project closure',
      approach: 'Agile',
      stem: 'The retro named three changes to how the team estimates. The next project has a different team. Those notes sit in a chat the new team cannot open. A lead says the retro happened, so the transfer is done. What should you do?',
      options: [
        'Leave the notes in the chat. A held retro is a completed transfer.',
        'Put the three changes where the next team looks before they estimate. A chat they cannot open is not a transfer.',
        'Ask the new team to repeat the same retro from memory.',
        'Drop the three changes. A different team should not inherit another team estimates.'
      ],
      answer: 1,
      why: '<p>The lesson exists only where the next team cannot see it. Holding the retro was the conversation, not the transfer. The project manager places the three changes where that team will look before they estimate. Asking them to remember a meeting they were not in, or dropping the changes because the team is new, wastes the retro.</p><p><strong>Exam tip:</strong> A lesson transfers when the next people can find it at the moment they need it. A closed chat is not that place.</p>',
      optionRationales: [
        'A retro the next team cannot read did not transfer anything.',
        'The three changes sit where the next team will see them before they estimate.',
        'They cannot reconstruct a retro they did not attend.',
        'A new team is the reason to hand the changes over, not a reason to discard them.'
      ],
      keyPoint: 'Move the estimating changes to where the next team will see them. The retro alone did not transfer them.',
      trap: 'We held the retro is not the same as the next team can use what it decided.'
    },
    {
      qid: 'pmp:set-6:177',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Hybrid',
      stem: 'The contract says unused materials go back to the client at close. A site lead wants to keep them for an internal job that starts Monday, and says the client will not miss a small lot. What should you do?',
      options: [
        'Keep the lot. An internal job on Monday is a better use than a return shipment.',
        'Return the materials as the contract says. If the client agrees to leave them, get that agreement in writing. Do not decide it on the site.',
        'Use the materials Monday and tell the client after the internal job ends.',
        'Scrap the lot so neither the client nor the internal job has a claim.'
      ],
      answer: 1,
      why: '<p>The materials are the client property under the contract. Monday need does not change that. The project manager returns them, unless the client agrees in writing to leave them. Using them first, or scrapping them, spends or destroys property the contract already assigned.</p><p><strong>Exam tip:</strong> Closeout follows the contract on residual materials. Do not keep the client property because the next internal job could use it.</p>',
      optionRationales: [
        'A convenient internal job is not a change to who owns the materials.',
        'The lot goes back, or the client written agreement says it can stay.',
        'Using it first and telling the client later takes the property before any agreement.',
        'Scrapping the lot destroys client property to avoid the return.'
      ],
      keyPoint: 'Return unused materials as the contract requires, unless the client agrees otherwise in writing.',
      trap: 'They will not miss a small lot is how client property stays on your site.'
    },
    {
      qid: 'pmp:set-6:178',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'The final cost is under budget because a listed risk never happened and its contingency was not spent. Finance wants the close report to call that unused amount a saving from strong team performance. What should you do?',
      options: [
        'Call it a performance saving. The money was not spent, so the team beat the budget.',
        'Report the unused contingency as unused contingency. Do not describe a risk that never happened as a performance saving.',
        'Move the unused amount into a new scope line so the final cost matches the budget.',
        'Leave the contingency in the actual cost so the project does not look under budget.'
      ],
      answer: 1,
      why: '<p>The variance came from a risk that did not occur. That is unused contingency, not proof the team outperformed the work. The project manager reports it that way. Spending it on new scope, or burying it in actual cost, hides the same fact in the other direction.</p><p><strong>Exam tip:</strong> At close, unused contingency is released as unused contingency. Do not relabel it as team performance.</p>',
      optionRationales: [
        'Money not spent because a risk did not happen is not a performance result.',
        'The close report says the contingency was unused because the risk did not occur.',
        'Adding scope to consume the difference spends contingency the risk never required.',
        'Parking it in actual cost overstates what the work cost.'
      ],
      keyPoint: 'Report unused contingency as unused. Do not call it a performance saving.',
      trap: 'Under budget at the end often means a risk did not happen, not that the team beat the work.'
    },
    {
      qid: 'pmp:set-6:179',
      sub: 'pmp-people',
      ecoTask: 'Manage conflict',
      approach: 'Agile',
      stem: 'In the lessons log, two people wrote opposite views of why a test failed. One asks you to delete the other comment so the archived log looks aligned. The failure was real. What should you do?',
      options: [
        'Delete the comment. An archive should show one agreed story.',
        'Rewrite both comments into a softer version neither person wrote.',
        'Keep both comments. The disagreement about a real failure is part of the lesson. Do not edit the log so it looks tidy.',
        'Remove the whole failure from the log so there is nothing to disagree about.'
      ],
      answer: 2,
      why: '<p>The two views are the record of a real disagreement about a real failure. Deleting one, blending them, or dropping the failure makes the archive calmer and less true. The project manager keeps both and lets the disagreement stand as part of the lesson.</p><p><strong>Exam tip:</strong> Do not sanitize a lessons log to look aligned. Keep the disagreement when it is about something that actually failed.</p>',
      optionRationales: [
        'One agreed story would be invented. The two people do not agree.',
        'A softer blend is your words, not the record either person wrote.',
        'Both comments stay, and the failure remains visible.',
        'Removing the failure deletes the lesson in order to end the argument.'
      ],
      keyPoint: 'Keep both accounts of the failure. Do not edit the log for a tidy archive.',
      trap: 'Looks aligned is how a real disagreement disappears from the lesson.'
    },
    {
      qid: 'pmp:set-6:180',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Predictive',
      stem: 'After acceptance, you find the tool the client will use is still on a trial license that ends in five days. Nobody bought the license. Close is scheduled for tomorrow. A lead says acceptance already happened, so the license is an operations problem. What should you do?',
      options: [
        'Close tomorrow. Acceptance moved the license out of the project.',
        'Let the trial end. Operations can buy a license when the tool stops.',
        'Do not close past it. Tell the sponsor and the client, and get a real license into the handover before the trial ends.',
        'Extend the trial by changing the tool date in the handover note, without buying anything.'
      ],
      answer: 2,
      why: '<p>The client is about to depend on a tool that stops in five days. Acceptance did not purchase the license. The project manager tells the sponsor and the client and gets a real license into the handover before close. Waiting for the tool to stop, or editing the date, leaves them with a handover that will fail.</p><p><strong>Exam tip:</strong> A missing license discovered after acceptance is still your handover to fix. Do not close and hope operations notices before the trial ends.</p>',
      optionRationales: [
        'Acceptance of the work did not buy the license the client needs in order to use it.',
        'Waiting until the tool stops makes the client find the gap by losing the tool.',
        'Both parties hear it now, and a real license is part of the handover before the trial ends.',
        'A new date in the note does not extend a license you have not bought.'
      ],
      keyPoint: 'Put a real license in the handover before you close. Do not leave a five-day trial for operations to discover.',
      trap: 'Already accepted is how a tool the client cannot legally keep using slips out of the project.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 6;
    q.batch = 18;
    q.original = true;
    q.sourceDocument = 'Original UpSkill Sprint item. July 2026 PMP Exam Content Outline and PMBOK Guide 8th Edition used as references only. Not a PMI item.';
    if (q.qid !== 'pmp:set-6:' + String(index + 171).padStart(3, '0')) {
      throw new Error('PMP Set 6 id sequence broken at ' + q.qid);
    }
  });

  global.PMP_SET6 = questions;

  global.registerPMPSet6 = function (exam) {
    if (!exam) return;
    var existing = exam.sets || {};
    var first = existing[1] || exam.bank || [];
    var second = existing[2] || [];
    var third = existing[3] || [];
    var fourth = existing[4] || [];
    var fifth = existing[5] || [];
    exam.sets = Object.assign({}, existing, {1: first, 2: second, 3: third, 4: fourth, 5: fifth, 6: questions});
    if (!exam.bank || !exam.bank.length) exam.bank = first.length ? first : questions;
    var ids = Array.isArray(exam.plannedSets) ? exam.plannedSets.map(String) : ['1', '2', '3', '4', '5'];
    if (ids.indexOf('6') < 0) ids.push('6');
    exam.plannedSets = ids;
    exam.setPlans = Object.assign({}, exam.setPlans, {
      6: {target: 10, label: 'Q171-Q180'}
    });
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {6: 10});
    exam.setName = 'Set 1: Q001-Q080 · Set 2: Q081-Q100 · Set 3: Q101-Q130 · Set 4: Q131-Q150 · Set 5: Q151-Q170 · Set 6: Q171-Q180';
  };
})(typeof window !== 'undefined' ? window : globalThis);
