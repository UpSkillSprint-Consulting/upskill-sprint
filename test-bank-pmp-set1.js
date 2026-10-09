/*
 * PMI PMP Exam Set 1 — original practice questions.
 * Batch 1 of 18 (Q001–Q010). Written to the July 2026 Exam Content Outline
 * (People, Process, Business Environment) and the PMBOK Guide 8th Edition
 * performance domains. No PMI item, handbook passage, or figure is copied.
 * UpSkill Sprint is not affiliated with the Project Management Institute.
 *
 * The player grades one best answer. Question 10 states the paired governance
 * actions as a single choice so it can be scored with the shared engine.
 */
(function (global) {
  'use strict';
  var questions = [
    {
      qid: 'pmp:set-1:001',
      sub: 'pmp-people',
      ecoTask: 'Manage conflict',
      approach: 'Predictive',
      stem: 'You are leading a predictive plant-upgrade project. During a design review, two senior engineers argue about a material specification that is blocking the design baseline. Each is defending a different supplier. The disagreement is now delaying the review, and the design lead asks you to "just pick one so we can leave." The sponsor is not in the room. Neither option has been checked against the safety requirement. What should you do?',
      options: [
        'Choose the supplier yourself so the review can end and the baseline can move.',
        'Separate the two engineers onto different work packages and leave the specification undecided.',
        'Escalate the choice to the sponsor for a ruling before anyone discusses the requirement.',
        'Bring both engineers back to the safety requirement, draw out the interest behind each supplier, and facilitate a decision the design can baseline.'
      ],
      answer: 3,
      why: '<p>The argument looks like a supplier preference. The decision that actually matters is whether the material meets the safety requirement. A collaborating approach starts there, with both people in the conversation, and only then locks the baseline. Picking, separating, or escalating first avoids that work.</p><p><strong>Exam tip:</strong> Where possible, choose collaboration and problem-solving to work toward a win-win outcome. Do not use authority, withdrawal, or escalation as the first move.</p>',
      optionRationales: [
        'Using authority to close the argument skips the safety check and treats the conflict as a delay rather than a decision.',
        'Separating them avoids the conversation. The baseline stays blocked, and the disagreement is still unresolved.',
        'The sponsor is the wrong first stop. The team has not yet examined the interests or the safety constraint.',
        'Conflict is handled by finding the source and working toward a resolution that protects the requirement and the relationship.'
      ],
      keyPoint: 'Collaborate on the requirement before you pick, separate, or escalate.',
      trap: 'Authority, withdrawal, and escalation are not the first response to a task conflict.'
    },
    {
      qid: 'pmp:set-1:002',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Predictive',
      stem: 'Execution is underway on a predictive facilities project. A colleague mentions that the city inspector can stop site work, and that the inspector was never listed in the stakeholder register. The inspector has not asked for a meeting. The next concrete pour is in four days. The project management plan is large, and the superintendent wants to "deal with the city if they show up." What should you do?',
      options: [
        'Wait for the inspector to make contact, so you do not create an issue that does not exist yet.',
        'Add the inspector to the daily crew huddle for the rest of the project.',
        'Send the full project management plan so the inspector has every baseline.',
        'Identify the inspector\'s role, authority, and expectations, then update the stakeholder register and the engagement approach before the pour.'
      ],
      answer: 3,
      why: '<p>The inspector can stop the work, so the gap in the register is urgent. The first move is still analysis: who they are, what they can decide, and what they need to know. The register and the engagement approach are updated from that, in time for the pour. Waiting, over-inviting, or dumping the whole plan all skip that step.</p><p><strong>Exam tip:</strong> When a missing stakeholder can affect the work, identify and analyze them before you choose a meeting, a document, or a delay.</p>',
      optionRationales: [
        'A stakeholder who can halt the work is already an engagement need. Silence is not consent, and waiting risks the pour.',
        'A daily huddle is an engagement tactic chosen before you know the inspector\'s authority, interests, or preferred channel.',
        'Volume is not engagement. Untailored information often hides the few decisions the stakeholder actually needs.',
        'Engagement starts with analysis, then a tailored approach, recorded where the team will actually use it.'
      ],
      keyPoint: 'Analyze a newly found stakeholder before you pick a communication tactic.',
      trap: 'Waiting for contact is not a plan when that person can stop the work.'
    },
    {
      qid: 'pmp:set-1:003',
      sub: 'pmp-people',
      ecoTask: 'Lead the team',
      approach: 'Agile',
      stem: 'Cycle time on your adaptive team has climbed for three sprints. In refinement, the team waits for you to approve library choices, test data, and story splits. None of those choices cross a compliance or architecture guardrail. The team says they are waiting because, last quarter, a different project manager overturned a similar decision in the sprint review. What should you do?',
      options: [
        'Keep approving each choice. The extra check is what reduced defects on the other project.',
        'Take the decisions yourself and publish a technical direction so the team can stop asking.',
        'Add a sponsor approval on every story so an overturn cannot happen again.',
        'State which decisions the team owns, keep the real guardrails visible, and coach the team to decide inside them without waiting for you.'
      ],
      answer: 3,
      why: '<p>The delay is not a technical gap. It is a decision-rights gap created by an earlier override. The accountable move is to name what the team owns, leave compliance and architecture as the guardrails, and coach them to decide. Extra approvals, a personal technical decree, or sponsor sign-off all keep the queue.</p><p><strong>Exam tip:</strong> If the team is waiting on you for choices inside the guardrails, give the decision back. Do not add another approver.</p>',
      optionRationales: [
        'More approvals keep the team dependent and do not address a decision that already sits inside the guardrails.',
        'Centralizing ordinary decisions is command-and-control. It shortens the question and lengthens the dependency.',
        'Escalating routine choices to the sponsor slows the team and uses the sponsor for work the team should own.',
        'Leadership here is clarity and empowerment. Guardrails stay; permission-seeking inside them goes.'
      ],
      keyPoint: 'Give decision rights back when the choice is already inside the guardrails.',
      trap: 'Another approval layer does not repair a team that has stopped deciding.'
    },
    {
      qid: 'pmp:set-1:004',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage project compliance and the delivery approach',
      approach: 'Hybrid',
      stem: 'You are recommending a delivery approach for a hospital patient-portal project. Clinical-safety and privacy requirements are fixed by regulation and must be verified before go-live. The patient-facing screens are still changing as nurses trial the workflow. Funding is approved. The sponsor wants a usable portal in three months, not a single release at the end of a long design phase. What should you recommend?',
      options: [
        'Use a predictive life cycle for the whole project, because a hospital setting cannot use adaptive delivery.',
        'Use an adaptive life cycle for the whole project, because the screens are still changing.',
        'Recommend a hybrid approach: predictive controls for the regulated safety and privacy work, and adaptive delivery for the patient-facing workflow.',
        'Delay the start until every screen requirement is signed, then run a predictive life cycle.'
      ],
      answer: 2,
      why: '<p>The project has two different kinds of work. Safety and privacy are stable and must be verified, so they need predictive controls. The workflow is still being discovered, and the sponsor wants a usable portal early, so that slice should be adaptive. A single approach for the whole project ignores half of the evidence.</p><p><strong>Exam tip:</strong> Choose the approach from the work, not from the industry label. Hybrid is the answer when part of the project is fixed and part is still emerging.</p>',
      optionRationales: [
        'Regulation justifies controls on the safety work. It does not freeze the screens that are still being learned.',
        'Changing screens justify iteration. They do not remove the need to verify fixed safety and privacy requirements.',
        'The approach follows the work. Fixed, high-compliance outcomes stay controlled; evolving workflow is delivered in increments.',
        'Waiting for certainty on the screens delays value and assumes the nurses\' feedback can be finished up front.'
      ],
      keyPoint: 'Match the life cycle to the work: controlled where it is fixed, adaptive where it is still emerging.',
      trap: 'The industry (a hospital) does not by itself force one life cycle for every deliverable.'
    },
    {
      qid: 'pmp:set-1:005',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Agile',
      stem: 'You are the project manager for an adaptive retail product. The product owner has ordered the backlog. The sponsor writes: "The steering committee wants every backlog item in the next release. If we drop anything, they will call the project incomplete." The release window holds about a third of the backlog. Several lower items are cosmetic. Two items near the top reduce checkout failures, which is the benefit named in the business case. What should you do?',
      options: [
        'Accept the full backlog as the release scope and ask the team to work overtime so the committee is satisfied.',
        'Remove the benefit measures from the status report so the conversation stays on scope completion.',
        'Work with the product owner to keep the release ordered by value, show what capacity can finish, and make the deferred items and the checkout benefit visible to the sponsor.',
        'Move the cosmetic items to the top because they are easier to demonstrate to the steering committee.'
      ],
      answer: 2,
      why: '<p>The committee is asking for completeness. The release can hold a third of the work, and the business case points at checkout failures. The project manager\'s job is to keep the value order, make the capacity limit explicit, and show what is deferred, with the product owner, not by quietly cutting or by buying the gap with overtime.</p><p><strong>Exam tip:</strong> When the backlog does not fit, do not hide the tradeoff and do not reorder for a demo. Show value, capacity, and what will wait.</p>',
      optionRationales: [
        'Overtime is being used to hide a capacity limit. It does not change how much value the release can actually finish.',
        'Hiding the benefit makes the project look like a pile of outputs. The business case is the point of the release.',
        'Value-based delivery keeps the order, tells the truth about capacity, and keeps the named benefit in view.',
        'A smoother demo is not the benefit in the business case. Reordering for optics drops the checkout outcome.'
      ],
      keyPoint: 'Keep the value order and make capacity and deferred work visible.',
      trap: 'Completing every backlog item is not the same as delivering the benefit in the business case.'
    },
    {
      qid: 'pmp:set-1:006',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Predictive',
      stem: 'You are managing a predictive plant upgrade. The schedule baseline shows the critical path finishing in 46 days. Today those critical activities are 3 days behind because a specialty crew was late to mobilize. A second path has 3 days of total float. The sponsor says, "Crash everything so we recover the three days this week." One remaining critical activity cannot start until a regulatory inspection is signed off. What should you do?',
      options: [
        'Crash activities on both paths so the near-critical path cannot become critical.',
        'Fast-track the remaining critical work by overlapping the inspection hold point with construction.',
        'Find out why the crew was late, then evaluate compression options on the critical activities, including cost and risk, before you change the plan.',
        'Rebaseline the finish date so status reports show the project on schedule.'
      ],
      answer: 2,
      why: '<p>The slip is on the critical path, and the cause is a late crew. The first response is to understand that cause and then look at legitimate compression on critical activities, including what it costs and what it risks. Crashing the path that still has float, overlapping a regulatory hold, or rewriting the baseline to look green all manage the report instead of the schedule.</p><p><strong>Exam tip:</strong> On a predictive schedule, analyze the variance before you crash, fast-track, or rebaseline. Do not compress a path that is not driving the finish, and do not overlap a required hold.</p>',
      optionRationales: [
        'Crashing noncritical work spends money and people on float that is not the cause of the slip.',
        'That dependency is a constraint, not spare time. Overlapping it breaks a required sequence.',
        'Variance is analyzed first. Compression is then aimed at critical work, with the cost and the hold point still visible.',
        'Moving the baseline to hide a variance avoids the cause and skips change control.'
      ],
      keyPoint: 'Analyze the schedule variance, then compress only the work that drives the finish.',
      trap: 'Crashing every path, or rebaselining to hide the slip, does not recover the critical path.'
    },
    {
      qid: 'pmp:set-1:007',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Agile',
      stem: 'You are reviewing sprint 4 of 6 with the team. The sprint goal is a working claims-status inquiry. The board and the burndown are in the exhibit. A vendor API credential was logged as blocked on day 2 and is still blocked. The sponsor sees the day-9 movement and asks you to report the sprint as back on track. What should you do?',
      options: [
        'Extend the sprint so the committed points can be finished before the review.',
        'Split the unfinished stories and count the partial points as done so the burndown looks recovered.',
        'Report the sprint as on track. The burndown moved on day 9, which shows the blockage has cleared.',
        'Treat the open credential as the blocker it is, replan the remaining days against the sprint goal with the team, and keep unfinished work visible rather than reporting the sprint recovered.'
      ],
      answer: 3,
      chart: {
        type: 'data-table',
        title: 'Sprint 4 exhibit',
        columns: ['Item', 'Status'],
        rows: [
          ['Sprint length', '10 days. Today is day 9.'],
          ['Committed points', '21'],
          ['Accepted points', '8'],
          ['Stories done', '0'],
          ['Stories in progress', '3'],
          ['Burndown', 'Flat on days 1-8. Eight points accepted on day 9.'],
          ['Impediment', 'Vendor API credential, opened day 2, still blocked.'],
          ['Sprint goal', 'Working claims-status inquiry. Not yet demonstrable.']
        ]
      },
      why: '<p>Eight points on day 9 do not make a flat sprint healthy. No story is done, the sprint goal cannot be demonstrated, and the vendor credential has been blocked since day 2. The project manager works that impediment with the team, resets the remaining time against the goal, and reports the sprint as it is. Extending, counting partials, or calling it recovered all conceal the same fact.</p><p><strong>Exam tip:</strong> Read the exhibit before the narrative. A late burndown movement is not recovery if the goal is not done and the impediment is still open.</p>',
      optionRationales: [
        'Stretching the timebox to fit the work abandons the sprint boundary. Unfinished work is replanned, not given extra days by default.',
        'Partial credit hides that nothing meets the goal. Accepted work is work the team can demonstrate.',
        'A late bump in points is not a working inquiry, and the credential is still blocked. The chart does not override the board.',
        'Status is what is true: the goal is not met, and a day-2 impediment is still open. The next move is to act on that, not to smooth the chart.'
      ],
      keyPoint: 'A late point bump is not recovery when the goal is not demonstrable and the blocker is still open.',
      trap: 'Do not report the sprint recovered just because the burndown moved on the last day.'
    },
    {
      qid: 'pmp:set-1:008',
      sub: 'pmp-business',
      ecoTask: 'Manage project changes',
      approach: 'Predictive',
      stem: 'A predictive medical-device project has an approved change-control procedure and a change control board. A hospital liaison asks you to add a training video. She says it will raise satisfaction scores. The request would touch the training baseline and may move a regulatory submission date. She wants the team to start today so her committee sees action. What should you do?',
      options: [
        'Start the video today. Satisfaction is a success measure, and waiting will look unresponsive.',
        'Reject the request. The submission date is fixed, so any added work is out of scope.',
        'Ask the team to produce the video in the evenings so the baseline does not have to change.',
        'Record the request, assess its effect on scope, schedule, cost, risk, and the regulatory date, then route it through the change-control procedure.'
      ],
      answer: 3,
      why: '<p>The liaison may be right that the video has value. On this project, value is not permission to edit the baseline. The request is recorded, its effect on the regulatory date and the other constraints is assessed, and the change control board decides. Starting, rejecting without a look, or hiding the work as evening effort all skip that control.</p><p><strong>Exam tip:</strong> On a predictive project, a good idea is still a change. Assess the impact, then use the change-control path already in place.</p>',
      optionRationales: [
        'Starting implements a baseline change before its impact is known and before the agreed authority has decided.',
        'A refusal before assessment assumes the date cannot move. That is itself a decision the change process is there to make.',
        'Hidden overtime is still a change. It consumes capacity and bypasses the baseline.',
        'A worthwhile idea still follows the path the project agreed. Impact first, then the decision, then the update.'
      ],
      keyPoint: 'Assess a requested change, then use the agreed change-control path.',
      trap: 'A popular idea, or hidden overtime, is still a baseline change.'
    },
    {
      qid: 'pmp:set-1:009',
      sub: 'pmp-business',
      ecoTask: 'Evaluate and address external business environment changes',
      approach: 'Hybrid',
      stem: 'Midway through a hybrid customer-portal rollout, a new data-residency rule is published. It may require citizen data to stay in-country. The current sprint is building the profile service in a foreign region because that region was the cheapest approved option. The rule takes effect after this sprint and before the release. The product owner asks whether to ignore it until quarterly planning. What should you do?',
      options: [
        'Finish the sprint as planned and review external rules at the next quarterly planning meeting.',
        'Stop all development until legal rewrites the entire backlog.',
        'Assess the impact on the backlog and the release with the product owner and the compliance stakeholder, record the risk, and change near-term work if staying in the foreign region would threaten a compliance outcome.',
        'Capture the announcement as a lesson learned after go-live.'
      ],
      answer: 2,
      why: '<p>The rule is an external change with a date inside the release. The project manager does not ignore it until the next quarter, and does not freeze the whole team before anyone has judged the impact. The assessment is done with the product owner and compliance, the risk is recorded, and only the work that would break the rule is redirected.</p><p><strong>Exam tip:</strong> When the outside world changes, assess the impact on scope or the backlog before you wait, stop everything, or file it as a lesson.</p>',
      optionRationales: [
        'The rule lands inside the release. Waiting for a quarterly ritual leaves a compliance problem inside the committed outcome.',
        'A full stop is an action before the impact is known. Most of the backlog may be unaffected.',
        'An external change is surveyed, its effect on scope and backlog is prioritized, and the response matches that effect.',
        'A lesson after release does not prevent a noncompliant go-live. This is a live external change, not a retrospective topic.'
      ],
      keyPoint: 'Assess an external change against the release before you wait, stop, or defer it to lessons learned.',
      trap: 'A rule that takes effect before release is not a quarterly-planning topic.'
    },
    {
      qid: 'pmp:set-1:010',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change and project governance',
      approach: 'Hybrid',
      stem: 'The PMO is piloting a tool that drafts status narratives and risk statements from project artifacts. Your hybrid team wants to use it on the customer-data workstream. Governance has not yet published a rule for this tool. A coordinator offers to paste the drafts into the sponsor pack this afternoon so the report goes out on time. What should you do?',
      options: [
        'Send the generated status to the sponsor today so the reporting cycle stays on time.',
        'Turn off human review so the team is not biased by arguing with the draft.',
        'Check each draft against the source artifacts, and confirm the tool is allowed for this customer-data workstream before anyone relies on it.',
        'Refuse the tool on principle, because project managers should not use automated drafting.'
      ],
      answer: 2,
      why: '<p>The tool can shorten a status cycle. It cannot own the status, and it has no published rule on a workstream that holds customer data. The project manager verifies the draft against the artifacts and confirms the use is allowed before the draft goes anywhere. Sending it raw, skipping review, or banning it without a look all miss that pair of checks.</p><p><strong>Exam tip:</strong> When a tool drafts an artifact, keep the decision with the project manager: verify the content, and confirm the use is allowed.</p>',
      optionRationales: [
        'Speed does not check whether the draft invented a status or a risk. The sponsor would be deciding on unchecked text.',
        'Removing review removes accountability. Disagreement with a draft is how errors get caught.',
        'The project manager remains accountable for the report, and customer data plus an ungoverned tool is a governance question. Verify the draft and confirm the use is allowed.',
        'A blanket ban skips the actual decision: whether this use is allowed and controlled.'
      ],
      keyPoint: 'Verify a generated draft against the artifacts, and confirm the use is allowed, before anyone relies on it.',
      trap: 'A draft is not a status report, and an ungoverned tool on customer data is not automatically either approved or banned.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 1;
    q.batch = 1;
    q.original = true;
    q.sourceDocument = 'Original UpSkill Sprint item. July 2026 PMP Exam Content Outline and PMBOK Guide 8th Edition used as references only. Not a PMI item.';
    if (q.qid !== 'pmp:set-1:' + String(index + 1).padStart(3, '0')) {
      throw new Error('PMP Set 1 id sequence broken at ' + q.qid);
    }
  });

  global.PMP_SET1 = questions;

  global.registerPMPSet1 = function (exam, domainMetadata) {
    if (!exam) return;
    exam.sets = Object.assign({2: [], 3: []}, exam.sets, {1: questions});
    exam.bank = questions;
    exam.defaultSet = '1';
    exam.plannedSets = ['1', '2', '3'];
    exam.setName = 'Set 1 live · Sets 2–3 soon';
    exam.setPlans = Object.assign({}, exam.setPlans, {
      1: {target: 180, label: 'Batch 1: Q001-Q010'},
      2: {target: 10, label: 'Not yet written'},
      3: {target: 10, label: 'Not yet written'}
    });
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {1: 180});
    exam.questions = 180;
    exam.minutes = 240;
    exam.pass = exam.pass || 70;
    var domains = [
      ['pmp-people', 'People', 33, 'People', '#1a5276'],
      ['pmp-process', 'Process', 41, 'Process', '#0e6b7a'],
      ['pmp-business', 'Business Environment', 26, 'Business', '#8a5a12']
    ];
    domains.forEach(function (row) {
      if (domainMetadata) domainMetadata[row[0]] = {name: row[1], short: row[3], color: row[4]};
    });
    if (!exam.bok || !exam.bok.length) {
      exam.bok = domains.map(function (row) {
        return {domain: row[0], weight: row[2], subs: [{id: row[0], name: row[1], w: row[2], lesson: '/lessons', lessonName: 'Browse lessons'}]};
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
