/*
 * PMI PMP Exam Set 1 — original practice questions.
 * Batch 1-4 of 18 (Q001-Q040). Written to the July 2026 Exam Content Outline
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
    },
    {
      qid: 'pmp:set-1:011',
      sub: 'pmp-people',
      ecoTask: 'Develop a common vision',
      approach: 'Agile',
      stem: 'An adaptive warehouse team is three sprints in. The stories match their titles, but the warehouse lead says the app still will not cut the Sunday overtime named in the business case. The product owner calls the vision "a modern app" and asks you to stop reopening it so velocity can stay high. What should you do?',
      options: [
        'Tell the warehouse lead the vision is already set, and check the overtime outcome after release.',
        'Replace the vision with the overtime target and drop any story that does not mention overtime.',
        'Bring the product owner and the warehouse lead back to the business-case outcome, confirm one current vision the team can repeat, and check the next stories against it.',
        'Hang a vision poster in the team room and leave the backlog unchanged.'
      ],
      answer: 2,
      why: '<p>The team is finishing titled stories, but the people who share the outcome do not share a vision. A current vision is the overtime result in the business case, said in a way both the product owner and the warehouse lead will repeat. The next stories are then checked against that, not against a slogan. Freezing the slogan, swapping it for a single metric, or posting it on the wall without looking at the backlog leaves the misunderstanding in place.</p><p><strong>Exam tip:</strong> When delivery and the named outcome have split, repair the shared vision before you protect velocity or rewrite the backlog alone.</p>',
      optionRationales: [
        'Declaring the vision closed avoids the misunderstanding. The overtime outcome is already evidence that the vision is not shared.',
        'One metric may be part of the vision. Replacing the vision and cutting stories before the conversation is a private rewrite, not a shared one.',
        'The vision is made current with the people who must share it, then the upcoming work is checked against that outcome.',
        'A poster does not fix a vision the product owner and the warehouse lead describe differently, and it does not change the stories.'
      ],
      keyPoint: 'A shared vision is current, repeatable by the people who share the outcome, and visible in the next work.',
      trap: 'Velocity and a slogan are not a vision when the business-case outcome is still missed.'
    },
    {
      qid: 'pmp:set-1:012',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Predictive',
      stem: 'On a predictive lab renovation, the commissioning lead and the facilities lead both plan to sign the same acceptance package. Each has given the crew a different definition of ready. The gate review is in six days. The sponsor says to let them sort it out. What should you do?',
      options: [
        'Leave the two leads to settle the signature so you do not take sides.',
        'Sign the package yourself so the gate is not blocked by a role dispute.',
        'Ask the sponsor for a ruling before anyone discusses what ready means.',
        'Name who owns the acceptance decision, state what ready means for this gate, and confirm both leads will work to that before the review.'
      ],
      answer: 3,
      why: '<p>The crew is hearing two definitions of ready because the role and the expectation were never set. Leadership here is to name the owner, state the gate criteria, and confirm both leads will use them. Leaving the dispute alone, taking the signature yourself, or sending it upstairs before the criteria are clear all avoid that work.</p><p><strong>Exam tip:</strong> When two roles claim the same decision, set the expectation and the owner. Do not hope the conflict sorts itself out before a gate.</p>',
      optionRationales: [
        'Waiting keeps both definitions in force. The crew still cannot tell which ready to build to.',
        'Signing it yourself removes the dispute from view and takes a decision the role split was supposed to own.',
        'The sponsor was asked to stay out. A ruling before the criteria are stated asks for authority instead of clarity.',
        'The owner, the meaning of ready, and a check that both leads will use it are the expectations the gate needs.'
      ],
      keyPoint: 'Set the role and the meaning of ready before a gate, instead of leaving two leaders to improvise.',
      trap: 'A sponsor who says to let them sort it out is not a reason to leave the crew with two definitions of done.'
    },
    {
      qid: 'pmp:set-1:013',
      sub: 'pmp-people',
      ecoTask: 'Help ensure knowledge transfer',
      approach: 'Predictive',
      stem: 'The only engineer who has configured the plant historian is leaving in three weeks. Cutover depends on that configuration. She has not had time to write notes. Her manager offers to backfill the role after she leaves. What should you do first?',
      options: [
        'Wait for the backfill and hold a lessons-learned meeting after cutover.',
        'Name the configuration knowledge cutover needs, schedule time to capture it in a form the remaining team can use, and confirm someone else can perform the steps before she leaves.',
        'Ask her to stay on call for questions after her last day, with no capture planned.',
        'Have a junior engineer watch her for one hour and treat that as enough for cutover.'
      ],
      answer: 1,
      why: '<p>The critical knowledge is the historian configuration, and it is about to walk out. The first move is to name that knowledge, capture it while she is still here, and prove someone else can do the steps. A later lessons-learned meeting, an informal on-call promise, or one hour of watching do not transfer the work the cutover depends on.</p><p><strong>Exam tip:</strong> When one person holds knowledge the project still needs, transfer it before they leave. Do not wait for a backfill or a closing retrospective.</p>',
      optionRationales: [
        'Lessons learned after cutover cannot configure the historian if the person who knows it is already gone.',
        'Critical knowledge is named, captured in a usable form, and checked by having someone else perform it before the expert leaves.',
        'An on-call favor is not a transfer. The project still has no one who has performed the steps.',
        'Watching for an hour does not show that the junior engineer can run the configuration at cutover.'
      ],
      keyPoint: 'Transfer the knowledge the work still needs, and prove someone else can use it, before the expert leaves.',
      trap: 'A promised backfill after the expert leaves is not a knowledge transfer.'
    },
    {
      qid: 'pmp:set-1:014',
      sub: 'pmp-people',
      ecoTask: 'Plan and manage communication',
      approach: 'Hybrid',
      stem: 'Your hybrid portal team is still planning a 29 May release. The exhibit shows three decisions and where they sit. The sponsor asks why the team is not listening. What should you do?',
      options: [
        'Put each decision where the team already works, confirm the team can restate it, and close that gap before you add another meeting.',
        'Send the full steering pack to every team member so nothing is missed.',
        'Tell the sponsor the team should have read the email you were copied on.',
        'Add a daily all-hands until release so a decision cannot be missed.'
      ],
      answer: 0,
      chart: {
        type: 'data-table',
        title: 'Where decisions sit',
        columns: ['Decision', 'Recorded in', 'What the team is using'],
        rows: [
          ['Release date moved to 12 June', 'Sponsor email to you, two days ago', 'Sprint board still shows 29 May'],
          ['Old API retired', 'Architecture notes, not linked', 'Team chat still links the old API guide'],
          ['Support hours cut', 'Steering decision log', 'Not mentioned in the team channel']
        ]
      },
      why: '<p>The team is not ignoring the sponsor. The decisions live in email, unlinked notes, and a log the team does not use, while the board and the chat still show the old facts. Communication works when the decision is in the place the team already looks, and when someone checks that they can restate it. A larger pack, a blame note, or another meeting does not fix a path the team is not on.</p><p><strong>Exam tip:</strong> Read where the decision was stored and where the team actually looks. Close that gap before you add a channel.</p>',
      optionRationales: [
        'The decisions move to the board and the channel the team already uses, and a restatement check confirms they landed.',
        'More volume in a pack the team does not work from repeats the same miss at a larger size.',
        'The team was never the audience of that email. Blaming them skips the path that failed.',
        'A new daily meeting adds time. It does not correct the board and the chat that still carry the old date and the old API.'
      ],
      keyPoint: 'A decision is communicated when it is in the place the team uses and they can restate it.',
      trap: 'Do not add a meeting or a bigger pack when the working board still shows the old decision.'
    },
    {
      qid: 'pmp:set-1:015',
      sub: 'pmp-process',
      ecoTask: 'Develop and manage project scope',
      approach: 'Hybrid',
      stem: 'On a hybrid clinic-scheduling release, the agreed goal is that caregivers can book a follow-up without calling the desk. Nurses are also asking the team to rebuild the billing screen while they are in that code. The product owner has been saying yes in the hallway. The release is already full. What should you do?',
      options: [
        'Absorb the billing screen so the nurses stay supportive.',
        'Freeze the backlog and refuse every request until next quarter.',
        'Show the booking goal and the full capacity with the product owner, and treat the billing screen as a scope decision with an impact, not as a hallway yes.',
        'Split the billing screen into the current sprint without changing the goal, so the request looks small.'
      ],
      answer: 2,
      why: '<p>The release goal is booking, and the capacity is already spoken for. A hallway yes is not an agreement on scope. The project manager makes the goal and the limit visible with the product owner and puts the billing screen through a real scope decision. Absorbing it, freezing every request, or slicing it into the sprint without changing the goal all hide the same overrun.</p><p><strong>Exam tip:</strong> When new work arrives against a full release, return to the agreed scope and the capacity. Do not treat a hallway yes as a baseline change.</p>',
      optionRationales: [
        'Taking the screen in without a decision spends the capacity the booking goal still needs.',
        'A blanket freeze skips analysis. Some requests may fit later. This one still needs an impact look, not a reflex no.',
        'The agreed goal and the capacity stay visible, and the new screen is decided as scope rather than absorbed in the hallway.',
        'A smaller slice is still new scope. Putting it in the sprint without touching the goal pretends the release grew for free.'
      ],
      keyPoint: 'Scope changes against a full release need an explicit decision, not a hallway yes.',
      trap: 'Splitting a new request into the current sprint does not make it part of the agreed goal.'
    },
    {
      qid: 'pmp:set-1:016',
      sub: 'pmp-process',
      ecoTask: 'Plan and optimize quality',
      approach: 'Predictive',
      stem: 'A predictive bridge repair checks weld quality only at the final inspection, after the deck is closed. Two earlier spans were reopened because defects were found too late. The superintendent wants the same inspection so the crew is not slowed down. What should you do?',
      options: [
        'Keep the final inspection only. Rework is already priced in the contract.',
        'Add more inspectors at the final gate so defects are caught faster at the end.',
        'Skip inspection on the next span to recover the days lost to rework.',
        'Move the agreed checks to the point where a weld can still be fixed, and keep the final inspection as confirmation rather than the first look.'
      ],
      answer: 3,
      why: '<p>Defects are being built in and found only after the deck has to be reopened. Quality belongs at the point the weld can still be corrected. The final inspection can remain as confirmation. More people at the same late gate, skipping the check, or accepting rework as the plan all leave the first look too late.</p><p><strong>Exam tip:</strong> If defects are found only after the work is closed up, move the check earlier. Do not staff the late gate more heavily and call that a quality plan.</p>',
      optionRationales: [
        'Pricing the rework accepts the defect. It does not keep the weld right the first time.',
        'More inspectors at the final gate still find the defect after the deck is closed.',
        'Dropping the check removes the only detection the project has and hides the late-find problem.',
        'The check moves to where the weld can be fixed, and the final inspection confirms rather than discovers.'
      ],
      keyPoint: 'Put the quality check where the defect can still be fixed, not only at the final gate.',
      trap: 'Adding inspectors at the end does not fix a check that happens after the work is closed up.'
    },
    {
      qid: 'pmp:set-1:017',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage resources',
      approach: 'Agile',
      stem: 'Two agile squads both need the only security reviewer next sprint. Each squad put a security story at the top. The reviewer can finish one squad, not both. The engineering manager tells you to let the squads fight it out. What should you do?',
      options: [
        'Assign the reviewer to both squads at half time and expect both stories to finish.',
        'Make the single-reviewer limit visible, and with the squads decide which security outcome goes first and what the other squad will do instead.',
        'Hire a second reviewer today and start that person in this sprint.',
        'Drop security from both squads so the argument ends.'
      ],
      answer: 1,
      why: '<p>There is one reviewer and two top stories. Pretending the person can be in both squads, hiring someone who cannot start this sprint, or deleting the security work all dodge the constraint. The limit has to be visible, and the squads have to choose which outcome uses the reviewer and what the other squad will do with the sprint.</p><p><strong>Exam tip:</strong> When one person is the constraint, show the limit and choose. Do not split them in half on paper or tell the teams to compete.</p>',
      optionRationales: [
        'Half time in two squads still leaves both stories short of a full review. The limit is hidden, not solved.',
        'The constraint is named, the first outcome is chosen with the squads, and the other squad gets a real plan.',
        'A hire started today is not capacity in this sprint. The decision still has to be made for the work already queued.',
        'Removing security from both squads avoids the choice and drops a top outcome without a reason tied to value.'
      ],
      keyPoint: 'A single constrained person is planned by making the limit visible and choosing what waits.',
      trap: 'Splitting one reviewer across two squads on paper does not create a second reviewer.'
    },
    {
      qid: 'pmp:set-1:018',
      sub: 'pmp-process',
      ecoTask: 'Develop an integrated plan and plan delivery',
      approach: 'Hybrid',
      stem: 'A hybrid payroll rollout is sequencing work from a plan that still shows the tax-file dependency as optional. Yesterday compliance said the file is mandatory before any pilot paycheck. The copy on the team wall was not updated. A developer asks whether to start the pilot anyway, because the wall plan says the dependency is optional. What should you do?',
      options: [
        'Follow the wall plan. Changing it now will confuse the team.',
        'Start the pilot and update the plan after the first paycheck.',
        'Correct the plan the team is using, show the mandatory dependency, and resequence the pilot before anyone builds on the old assumption.',
        'Tell the developer to ignore plans and ask compliance before every task.'
      ],
      answer: 2,
      why: '<p>The integrated plan the team is using is wrong, and the next paycheck depends on it. The project manager corrects that plan, makes the dependency mandatory, and resequences the pilot before work starts from the optional assumption. Keeping the old wall, starting and fixing later, or throwing out plans entirely all leave the team without one current plan.</p><p><strong>Exam tip:</strong> When the plan in use contradicts a new dependency, update the plan the team actually follows before the work continues.</p>',
      optionRationales: [
        'The wall plan is the stale one. Protecting it protects the wrong sequence.',
        'A pilot paycheck that needed the file first is the defect. Updating the plan afterward records the miss. It does not prevent it.',
        'The working plan is corrected, the dependency is visible, and the pilot is resequenced before the old assumption is built.',
        'Sending every task to compliance removes the plan instead of repairing it. The team still needs one current sequence.'
      ],
      keyPoint: 'Keep the plan the team uses current when a dependency changes, then resequence before they build on the old one.',
      trap: 'The copy on the wall is not the plan if it still shows a mandatory dependency as optional.'
    },
    {
      qid: 'pmp:set-1:019',
      sub: 'pmp-business',
      ecoTask: 'Remove impediments and manage issues',
      approach: 'Agile',
      stem: 'The team has been blocked for four days on a test account that only the identity group can issue. They have been using personal logins as a workaround. The identity group says the request is in the queue. The sprint goal needs that account. You are asked whether the workaround is good enough. What should you do?',
      options: [
        'Leave the workaround in place. The queue will clear on its own.',
        'Stop the sprint until the identity group volunteers to help.',
        'Log the delay as a lesson learned and continue with personal logins.',
        'Treat the missing account as an impediment, show its effect on the goal, and work with the identity group on a specific unblock rather than normalizing the workaround.'
      ],
      answer: 3,
      why: '<p>A four-day block on the sprint goal is an impediment, and the personal logins have started to look normal. The response is to show the effect and get a specific unblock from the group that owns access. Waiting on the queue, stopping the whole sprint, or filing a lesson while the workaround continues all leave the goal blocked.</p><p><strong>Exam tip:</strong> A workaround that hides a blocker is not a fix. Surface the impediment and go after the unblock the goal needs.</p>',
      optionRationales: [
        'Hope that the queue moves does not change a block that has already lasted four days.',
        'Stopping all work is broader than the impediment. The rest of the sprint may still be able to move.',
        'A lesson learned does not issue the account. Continuing on personal logins makes the issue invisible.',
        'The impact on the goal is visible, and the owner of the account is engaged for a real unblock instead of a standing workaround.'
      ],
      keyPoint: 'Do not let a workaround become the plan. Name the impediment and pursue the unblock.',
      trap: 'Personal logins that keep the board moving can hide a goal that is still blocked.'
    },
    {
      qid: 'pmp:set-1:020',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage risk',
      approach: 'Predictive',
      stem: 'On a predictive data-center move, a technician says the freight elevator is booked by another project on the only weekend the racks can move. Nothing about this is in the risk register. The move lead says the team will deal with it if the other project runs long. The clash is not confirmed, but the weekend cannot move without a permit change. What should you do?',
      options: [
        'Add contingency days to the move and leave the register unchanged.',
        'Record the elevator clash as a risk, assess how likely it is and what it does to the permitted weekend, and choose a response before that weekend is locked.',
        'Ask the sponsor to cancel the other project booking today.',
        'Wait until the other project confirms it will run long, so you do not raise a false risk.'
      ],
      answer: 1,
      why: '<p>An uncertain clash on the only permitted weekend is a risk, even though it is not confirmed. It belongs in the register, with a look at probability and effect, and a response chosen while there is still time. Padding the schedule without a risk, cancelling another project immediately, or waiting for the clash to become certain all skip that analysis.</p><p><strong>Exam tip:</strong> If it might happen and it would hurt a date you cannot easily move, record it and respond while it is still a risk. Do not wait for it to become an issue.</p>',
      optionRationales: [
        'Extra days without a named risk hide the elevator. The permit constraint may not be solved by slack that was never assessed.',
        'The uncertainty is recorded, its effect on the permitted weekend is assessed, and a response is chosen before the window locks.',
        'Cancelling the other booking is a response chosen before anyone has assessed the clash. It may be unnecessary or unavailable.',
        'Waiting until the clash is certain turns the risk into an issue on a weekend that needs a permit to move.'
      ],
      keyPoint: 'An unconfirmed clash on a date you cannot move is still a risk. Record it and respond before it is certain.',
      trap: 'Waiting for proof that the other project will run long converts a risk into an issue too late.'
    },
    {
      qid: 'pmp:set-1:021',
      sub: 'pmp-process',
      ecoTask: 'Develop and manage project scope',
      approach: 'Hybrid',
      stem: 'A hybrid pharmacy project keeps the regulated dispensing rules on a signed scope baseline. Patient reminder wording is adaptive and can be reordered. A pharmacist asks the team to add a second interaction check while they are editing the dispensing rules. What should you do?',
      options: [
        'Add the check to the current sprint. A hybrid project does not use a scope baseline.',
        'Freeze reminder wording as well, so nothing moves until the next baseline review.',
        'Keep the signed dispensing baseline in place, assess the interaction check as a scope change with its impact, and leave reminder wording free to reorder.',
        'Move the check into the reminder backlog so it does not have to face the baseline.'
      ],
      answer: 2,
      why: '<p>Hybrid does not mean the regulated baseline is optional. The interaction check changes the signed dispensing scope, so it needs an impact look and a real decision. Reminder wording can still be reordered because that stream was planned to be adaptive. Treating the whole project as open, freezing the adaptive stream, or hiding the check in the reminder backlog all blur the boundary that was supposed to stay fixed.</p><p><strong>Exam tip:</strong> In a hybrid plan, protect the part that was baselined and keep the adaptive part free. Do not let one request flatten both.</p>',
      optionRationales: [
        'The dispensing rules were placed on a baseline for a reason. Hybrid does not erase that boundary.',
        'Reminder wording was meant to move. Freezing it punishes the adaptive stream for a change that belongs in the baseline.',
        'The fixed scope stays fixed until the check is assessed, and the adaptive wording stays free to reorder.',
        'Renaming the check as reminder work hides a baseline change. It does not assess it.'
      ],
      keyPoint: 'A hybrid boundary stays fixed on the baselined work and flexible only where the plan said it could move.',
      trap: 'Do not treat a hybrid project as fully adaptive, or fully frozen, because one request arrived.'
    },
    {
      qid: 'pmp:set-1:022',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Predictive',
      stem: 'A predictive site package shows a finish-to-start from permit approval to excavation. The permit is not approved. The crew is on site, and the weather window closes in four days. The contractor asks to excavate at risk so the crew is not idle. What should you do?',
      options: [
        'Authorize the excavation. An idle crew costs more than waiting on a permit.',
        'Keep the permit as a predecessor. Find other authorized work for the crew, and do not start excavation until the permit is approved.',
        'Delete the permit link so the schedule shows the crew starting today.',
        'Rebaseline the weather window to next month and send the crew home with no other work identified.'
      ],
      answer: 1,
      why: '<p>The permit is a hard predecessor, not spare time. Starting excavation at risk breaks the sequence the package requires. The useful move is to keep that link and look for other work the crew is already allowed to do. Authorizing the dig, deleting the link, or sending the crew away without a look at authorized work all treat the constraint as optional.</p><p><strong>Exam tip:</strong> A mandatory dependency stays in the sequence. Idle resources are a problem to place on allowed work, not a reason to skip the predecessor.</p>',
      optionRationales: [
        'Cost of an idle crew does not authorize work the permit has not allowed.',
        'The predecessor stays, and the crew is pointed at work the current approvals already cover.',
        'Deleting the link makes the schedule false. It does not approve the excavation.',
        'Moving the baseline and idling the crew skips both the constraint and any work that is already allowed.'
      ],
      keyPoint: 'Do not break a mandatory predecessor to keep a crew busy.',
      trap: 'At-risk work that skips a permit is not schedule recovery.'
    },
    {
      qid: 'pmp:set-1:023',
      sub: 'pmp-process',
      ecoTask: 'Develop an integrated plan and plan delivery',
      approach: 'Hybrid',
      stem: 'A hybrid clinic build has equipment cabinets on a 14-week predictive lead time. The scheduling software can be demonstrated on a simulator and does not need a cabinet. The integrated plan still blocks every software demo until the first cabinet arrives. A developer asks whether to wait, because that is what the plan says. What should you do?',
      options: [
        'Convert the cabinet order into an agile backlog so both streams can demo next week.',
        'Wait for the cabinet. One integrated plan should force every stream onto the same sequence.',
        'Keep the cabinet lead time fixed, update the plan so software that does not need a cabinet can proceed, and do not demo anything that pretends the cabinet is on site.',
        'Remove the cabinets from the plan so the software date looks earlier.'
      ],
      answer: 2,
      why: '<p>The integrated plan is wrong where it ties independent software to a physical lead time. The cabinet sequence stays predictive because the lead time is real. Software that can be shown on a simulator should be released from that hold, and the plan the team uses should say so. Making the cabinets agile, waiting for a dependency that does not exist, or deleting the cabinets all abandon the distinction the hybrid plan needs.</p><p><strong>Exam tip:</strong> Hybrid planning keeps the fixed sequence where a constraint requires it, and lets independent work move. Update the plan the team is following.</p>',
      optionRationales: [
        'A 14-week lead does not become a backlog item because the software can move faster.',
        'One plan can hold two sequences. Forcing the software to wait invents a dependency.',
        'The cabinet stays on its lead time, and software that does not need it is replanned so the team can proceed honestly.',
        'Removing the cabinets makes the date look better and leaves the clinic without the equipment.'
      ],
      keyPoint: 'Fix the integrated plan so fixed lead times and independent work are not locked together.',
      trap: 'Waiting because the plan says so is wrong when the plan ties together work that is not dependent.'
    },
    {
      qid: 'pmp:set-1:024',
      sub: 'pmp-people',
      ecoTask: 'Align stakeholder expectations',
      approach: 'Hybrid',
      stem: 'Operations wants the old intake form retired in this release. Compliance wants the form kept until an audit six weeks from now. The release can finish one of those outcomes, not both. Each group believes the other already agreed. What should you do?',
      options: [
        'Bring both groups to the same boundary, show what this release can hold, and record one decision on whether the form stays through the audit.',
        'Retire the form now. Operations uses it every day, so that need wins.',
        'Keep the form and wait until after the audit to tell operations.',
        'Commit to both outcomes and cut the test cycle so they fit.'
      ],
      answer: 0,
      why: '<p>The two groups are planning different boundaries, and each thinks the choice is already made. Alignment is one conversation, one capacity picture, and one recorded decision. Picking a side in private, hiding the decision, or promising both by cutting tests leaves the expectation split.</p><p><strong>Exam tip:</strong> When two stakeholders describe different scope, put them on the same limit and record the choice. Do not assume agreement that was never made.</p>',
      optionRationales: [
        'Both parties see the same limit, and the release boundary is decided once and written down.',
        'Daily use is a real interest. Deciding it alone does not align compliance, and it may break the audit need.',
        'Silence keeps operations planning a retirement the release will not deliver.',
        'Cutting tests to fake capacity hides the fact that the release cannot hold both outcomes.'
      ],
      keyPoint: 'Align the people who disagree on a boundary before the release pretends both outcomes fit.',
      trap: 'A belief that the other group already agreed is not an agreement.'
    },
    {
      qid: 'pmp:set-1:025',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'One agile squad is about to commit a release. Two product owners have each handed the squad a different must-ship list. The lists overlap on only half the items. The squad asks which list to build. What should you do?',
      options: [
        'Tell the squad to merge both lists and absorb the extra items.',
        'Let the squad pick the shorter list so the date is safe.',
        'Send both lists to the sponsor before anyone compares them with capacity.',
        'Get the two owners to one ordered boundary, show the capacity, and have the squad commit only after that boundary is clear.'
      ],
      answer: 3,
      why: '<p>The squad cannot commit to two definitions of the release. Leadership here is to get one ordered boundary from the people who own the outcome, with capacity visible, before the squad locks a commitment. Merging the lists, letting the squad choose in private, or escalating before the owners have faced the limit all leave the team without a single target.</p><p><strong>Exam tip:</strong> When two owners set two boundaries, do not make the team guess. Settle one list against capacity, then commit.</p>',
      optionRationales: [
        'A merged list is a larger promise, not a decision. The overlap problem is still unsolved.',
        'The shorter list may drop an outcome an owner still expects. The squad should not have to invent the boundary.',
        'The sponsor may help later. The first step is the two owners and the capacity, not an escalation that skips that talk.',
        'One boundary, visible capacity, and a commitment after that point give the squad a target they can actually meet.'
      ],
      keyPoint: 'A squad should commit to one boundary the owners share, not to two competing lists.',
      trap: 'Letting the team pick, or merging both lists, hides the fact that the owners have not agreed.'
    },
    {
      qid: 'pmp:set-1:026',
      sub: 'pmp-business',
      ecoTask: 'Manage project changes',
      approach: 'Predictive',
      stem: 'The charter says the program will roll out to the sites. The scope baseline names two sites. A director says adding a third site is only a clarification of the charter, not a change. Work at the third site has not started. What should you do?',
      options: [
        'Add the third site. The word sites in the charter already authorized it.',
        'Record the third site as a change, assess the schedule and cost impact, and use the agreed change path before any work starts there.',
        'Start mobilization at the third site and correct the baseline at the next monthly report.',
        'Reject the request with no analysis because the baseline already lists two sites.'
      ],
      answer: 1,
      why: '<p>A vague charter word is not a blank check. The baseline names two sites, so a third site is a change. It needs an impact assessment and the agreed path before work starts. Treating it as already authorized, starting it quietly, or refusing it with no look all skip that control.</p><p><strong>Exam tip:</strong> If the baseline does not name it, a clarification that adds it is a change. Assess it before the work begins.</p>',
      optionRationales: [
        'Sites in the charter did not list this site. The baseline is the scope the team is authorized to build.',
        'The addition is recorded, its effect is assessed, and the change path runs before mobilization.',
        'Starting first and editing the baseline later bypasses the control that exists to catch this.',
        'A flat no without an impact look is as incomplete as a silent yes. The request still deserves an assessment.'
      ],
      keyPoint: 'Work beyond the named baseline is a change, even when someone calls it a clarification.',
      trap: 'A broad word in the charter does not authorize a site the baseline left out.'
    },
    {
      qid: 'pmp:set-1:027',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Predictive',
      stem: 'A predictive tower repair is at the point shown in the exhibit. The enclosure crew is free on day 36 and asks to start then, ahead of the plan. What should you do?',
      options: [
        'Start enclosure on day 36 so the idle crew is used.',
        'Move the inspection to day 36 and enclose right after it, even though the permit names days 40 to 42.',
        'Skip the inspection. The foundation was already accepted.',
        'Keep enclosure after the inspection window. Use the idle crew on steel or other open work the sequence already allows.'
      ],
      answer: 3,
      chart: {
        type: 'data-table',
        title: 'Sequence before enclosure',
        columns: ['Work', 'Status', 'Constraint'],
        rows: [
          ['Foundation acceptance', 'Done on day 20', 'Weather window for that work is closed'],
          ['Steel erection', 'Not started. Planned day 21', 'Needs foundation acceptance, which is done'],
          ['Inspection', 'Not started', 'Allowed only on days 40 to 42. Must finish before enclosure. Permit window cannot move'],
          ['Enclosure', 'Planned day 45', 'Crew is idle and wants to start on day 36']
        ]
      },
      why: '<p>The exhibit says the inspection can happen only on days 40 to 42, and enclosure comes after that inspection. Starting enclosure on day 36 builds work the inspection may have to open. The crew can go to steel, which is already allowed because the foundation is accepted. Moving the permit window or skipping the inspection breaks a constraint to fill idle time.</p><p><strong>Exam tip:</strong> Read the constraint column before you use an idle crew. Sequence beats a free resource when the permit window cannot move.</p>',
      optionRationales: [
        'Using the crew early puts enclosure ahead of an inspection that has not happened.',
        'The permit window is days 40 to 42. Moving it because the crew is free does not change the permit.',
        'Foundation acceptance is not the inspection the enclosure is waiting on.',
        'Enclosure stays behind the inspection, and the crew is used on steel, which the sequence already allows.'
      ],
      keyPoint: 'Do not pull work forward of a permit window just because a crew is idle.',
      trap: 'An early start that jumps the inspection is not use of float. The inspection has not happened.'
    },
    {
      qid: 'pmp:set-1:028',
      sub: 'pmp-business',
      ecoTask: 'Define and establish project governance',
      approach: 'Hybrid',
      stem: 'The steering rule says any scope change of more than 5 days goes to the board. A request needs 9 days. A teammate splits it into two requests of 4 days so each one stays under the line. What should you do?',
      options: [
        'Submit the change as one 9-day request. Do not split it to stay under the board threshold.',
        'File the two 4-day requests. Each one meets the written rule.',
        'Approve both pieces yourself. The split makes them too small for the board.',
        'Drop the request with no record so the threshold is never tested.'
      ],
      answer: 0,
      why: '<p>The rule exists so the board sees scope that moves the timeline by more than 5 days. Splitting a 9-day request is a way around that rule, not compliance with it. The whole change goes to the board. Filing the pieces, approving them locally, or dropping the record all avoid the governance that was set.</p><p><strong>Exam tip:</strong> Do not slice a change to duck a threshold. The decision rights follow the real size of the change.</p>',
      optionRationales: [
        'The board sees the 9-day effect the rule was written to catch.',
        'Two forms do not make a 9-day change into two allowed ones. The split is the evasion.',
        'Local approval takes a decision the threshold reserved for the board.',
        'No record means the change can still happen with no decision at all.'
      ],
      keyPoint: 'Governance thresholds apply to the real change, not to pieces cut up to avoid the board.',
      trap: 'Meeting the number on each form while hiding the total is not following the rule.'
    },
    {
      qid: 'pmp:set-1:029',
      sub: 'pmp-business',
      ecoTask: 'Evaluate and address external business environment changes',
      approach: 'Hybrid',
      stem: 'A partner says their interface test window moved from 1 June to 15 June. That window is the fixed boundary of the release. The team wants to fill the gap with three internal screens that were below the line, and then treat the partner date as flexible from now on. What should you do?',
      options: [
        'Add the screens. The partner gave you free time.',
        'Tell the partner the original 1 June date still stands, and ignore the notice.',
        'Assess the moved window, update the fixed boundary to 15 June, and decide the screens on their own merit. Do not turn one moved date into open scope.',
        'Slip an internal status date and leave the partner notice out of the plan.'
      ],
      answer: 2,
      why: '<p>The partner moved a real external constraint. The response is to assess that move, put the new window into the plan as the boundary, and look at the screens as a separate scope choice. Filling the gap automatically, pretending the old date still holds, or hiding the notice all miss the change that actually arrived.</p><p><strong>Exam tip:</strong> An outside date that moves is assessed and recorded. Spare time is not automatic permission to add work, and it does not make the boundary optional forever.</p>',
      optionRationales: [
        'The gap is not free scope. The screens were below the line and still need their own decision.',
        'Ignoring a partner notice leaves the plan on a date the other party has already left.',
        'The new window becomes the boundary, and the screens are accepted or not on merit rather than by default.',
        'An internal slip that omits the partner notice means the team is planning to a fact the plan does not hold.'
      ],
      keyPoint: 'Update the fixed boundary when an external window moves, and do not spend the gap as new scope by default.',
      trap: 'A delay from a partner is not a blank check to pull below-the-line work into the release.'
    },
    {
      qid: 'pmp:set-1:030',
      sub: 'pmp-people',
      ecoTask: 'Manage stakeholder expectations',
      approach: 'Predictive',
      stem: 'A sponsor told the field crew to add a floor of network drops that is not in the scope baseline. The change path says requests come through you before work starts. The crew asks whether to follow the sponsor. What should you do?',
      options: [
        'Let the crew proceed. A sponsor instruction outranks the baseline.',
        'Stop the extra drops, confirm the crew did the right thing by asking, and take the sponsor request through the change path before that work starts.',
        'Add the drops to the baseline tonight with no impact review, so the crew can start in the morning.',
        'Tell the crew to ignore the sponsor and do not record the request.'
      ],
      answer: 1,
      why: '<p>The sponsor created an expectation the baseline does not contain. The crew was right to stop and ask. The project manager holds the work, keeps the relationship intact, and runs the request through the change path so the sponsor sees the impact before the drops are built. Obeying on the spot, editing the baseline with no review, or dismissing the sponsor all fail that expectation.</p><p><strong>Exam tip:</strong> A side instruction is still a change. Protect the crew for checking, and put the requester through the path you already agreed.</p>',
      optionRationales: [
        'Sponsor authority does not skip the baseline. Unchecked work becomes scope the project did not accept.',
        'The work stays stopped, the crew is backed for asking, and the sponsor request is assessed before it starts.',
        'Writing it into the baseline overnight skips the impact the change path exists to show.',
        'Ignoring the sponsor with no record leaves the expectation in place and the request invisible.'
      ],
      keyPoint: 'Hold the unbaselined work and take the sponsor through the change path instead of building from a side conversation.',
      trap: 'Rank does not turn a verbal add into baseline scope.'
    },
    {
      qid: 'pmp:set-1:031',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage finance',
      approach: 'Predictive',
      stem: 'A predictive facilities upgrade has a contingency reserve for a known equipment-delay risk. That delay is now happening. A lead asks you to charge the overtime to management reserve instead, so the contingency line stays untouched on the status chart. What should you do?',
      options: [
        'Charge management reserve. Keeping the contingency line full shows control.',
        'Draw the contingency that was set aside for this delay, record the use, and leave management reserve for work that was not identified.',
        'Cut the remaining tests to pay for the overtime so neither reserve moves.',
        'Ask the crew to absorb the overtime and leave both reserves unrecorded.'
      ],
      answer: 1,
      why: '<p>The delay is the identified risk the contingency was built for. That reserve should be drawn and recorded. Management reserve is for uncertainty that was not identified, and it is not a place to hide a known draw so the chart still looks full. Cutting tests or absorbing the cost off the books hides both the risk and the quality impact.</p><p><strong>Exam tip:</strong> Use contingency for the identified risk it covers. Do not move a known draw into management reserve to protect a status line.</p>',
      optionRationales: [
        'An untouched contingency line is not control if the risk it was for is being paid from the wrong reserve.',
        'The known delay uses its contingency, the draw is visible, and management reserve stays for unidentified work.',
        'Cutting tests to avoid a reserve draw trades quality for a cleaner chart.',
        'Unrecorded overtime hides the cost of a risk that was supposed to be managed in the open.'
      ],
      keyPoint: 'A known risk draws its contingency. Management reserve is not a hiding place for that draw.',
      trap: 'Protecting the contingency line by charging management reserve misstates both reserves.'
    },
    {
      qid: 'pmp:set-1:032',
      sub: 'pmp-process',
      ecoTask: 'Plan and optimize quality',
      approach: 'Predictive',
      stem: 'A predictive device release is over the cost forecast. The proposal is to cancel the design reviews and rely on the final test cycle to catch defects. Those reviews are the prevention in the quality plan. What should you do?',
      options: [
        'Cancel the reviews. The final test finds the same defects with fewer meetings.',
        'Drop the reviews and add inspectors only at the final test so the forecast improves this month.',
        'Keep the reviews. Show the forecast savings against the failure cost of finding those defects later, and do not cut prevention only to improve the cost line.',
        'Stop the final test as well, so prevention and appraisal both leave the cost.'
      ],
      answer: 2,
      why: '<p>The reviews are prevention. Canceling them to repair a forecast moves the cost into later failure, which is usually larger and harder to undo. The project manager keeps the planned prevention and makes that tradeoff visible. Adding only end-of-line inspectors, or dropping testing too, does not replace the review that stops the defect earlier.</p><p><strong>Exam tip:</strong> Do not cut prevention to make a cost forecast look better. Compare the savings with the failure cost before you change the quality plan.</p>',
      optionRationales: [
        'A later test is not the same as a review that keeps the defect out of the build.',
        'More people at the final test still find the defect after the design work is done, and the forecast is the wrong reason to drop prevention.',
        'Prevention stays, and the cost choice is shown as failure cost versus a short-term forecast gain.',
        'Removing both prevention and the final test leaves defects with no planned detection at all.'
      ],
      keyPoint: 'Keep prevention in place unless the failure cost truly justifies the cut. A forecast line is not that justification.',
      trap: 'Saving review time now often buys a larger failure cost later.'
    },
    {
      qid: 'pmp:set-1:033',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage finance',
      approach: 'Agile',
      stem: 'An agile product team finished the month under its funding limit. Two people want to pull three unprioritized screens into the sprint because the money is already available. Those screens are not in the release goal. Contingency in the funding plan covers an integration risk that has not closed. What should you do?',
      options: [
        'Leave the unused funding in place for the risk it covers. Do not treat a quiet month as approval to add screens outside the goal.',
        'Add the screens. Money unspent this month is waste if the team has capacity.',
        'Move the integration contingency into the feature backlog so the budget looks fully used.',
        'Ask the sponsor to cut the funding limit to exactly what was spent this month.'
      ],
      answer: 0,
      why: '<p>Underspending a month does not convert risk contingency into new scope. The integration risk is still open, and the screens are outside the release goal. The project manager leaves the funding for that uncertainty and refuses the quiet add. Filling the budget, restating contingency as features, or shrinking the limit to the spend all erase a reserve the plan still needs.</p><p><strong>Exam tip:</strong> Unused money is not a backlog. Keep contingency on the uncertainty it covers, and do not gold-plate because the month looks quiet.</p>',
      optionRationales: [
        'The reserve stays on the open risk, and screens outside the goal are not pulled in to use up funding.',
        'Capacity plus leftover money is not a reason to add work the release did not accept.',
        'Relabeling contingency as features spends the reserve before the risk has closed.',
        'Cutting the limit to this month of spend removes the cover for a risk that is still open.'
      ],
      keyPoint: 'A quiet month does not authorize new scope, and it does not spend contingency that still covers an open risk.',
      trap: 'Using leftover funding so the budget looks fully used is gold-plating, not financial control.'
    },
    {
      qid: 'pmp:set-1:034',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage finance',
      approach: 'Predictive',
      stem: 'The sponsor looks at the exhibit and says the project is under budget because 174 has been spent out of 400. The sponsor asks you to report it that way. What should you do?',
      options: [
        'Report under budget. Actual cost is below the total budget.',
        'Rebaseline the budget to 174 so the report matches the spend.',
        'Crash the remaining work so the schedule index recovers before you mention cost.',
        'Report that completed work cost more than it earned and is behind the plan, and forecast from those indexes rather than from budget minus spend.'
      ],
      answer: 3,
      chart: {
        type: 'data-table',
        title: 'Cost and schedule snapshot',
        columns: ['Measure', 'Figure'],
        rows: [
          ['Budget at completion', '400'],
          ['Planned value', '200'],
          ['Earned value', '160'],
          ['Actual cost', '174'],
          ['Cost performance index', '0.92'],
          ['Schedule performance index', '0.80']
        ]
      },
      why: '<p>Actual cost below the total budget only means money is left. The work finished so far earned 160 and cost 174, so it is over budget, and it earned less than the 200 that was planned, so it is behind. The indexes say the same thing. The report has to say that and forecast from it. Calling the project under budget, rebasing to the spend, or crashing before you state the status all hide the exhibit.</p><p><strong>Exam tip:</strong> Compare earned value with actual cost and with planned value. Money left in the budget is not proof that the project is under budget.</p>',
      optionRationales: [
        '174 of 400 only shows funds remaining. The completed work already cost more than it earned.',
        'Rewriting the budget to the spend erases the variance instead of reporting it.',
        'Crashing may be a later choice. It is not a substitute for telling the sponsor what the indexes say.',
        'Status matches the snapshot: over budget and behind for the work done, with the forecast based on that performance.'
      ],
      keyPoint: 'Under budget means the work performed cost less than it earned, not that spend is still below the total budget.',
      trap: 'Actual cost below the budget at completion is the most common false comfort in a cost report.'
    },
    {
      qid: 'pmp:set-1:035',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'A demo is tomorrow. Three stories match the demo script but miss the definition of done: error handling and the operations guide are unfinished. The product owner asks you to mark them done so the review looks complete. Operations inherits the product next month. What should you do?',
      options: [
        'Mark them done. The demo script is what the review will see.',
        'Change the definition of done so the missing work is no longer required.',
        'Keep the stories not done, show the gap at the review, and finish the work operations will inherit before you call it complete.',
        'Move the unfinished work into a later project so this team can close clean.'
      ],
      answer: 2,
      why: '<p>Done is the agreement the team and operations share. A story that demos but cannot be run or supported is not done, and marking it done pushes the cost onto the people who inherit it. The project manager keeps the definition, shows the gap, and finishes the handling and the guide. Editing done, or parking the work on a future project, makes the review look complete by moving the debt.</p><p><strong>Exam tip:</strong> Do not trade the definition of done for a cleaner demo. The people who inherit the product live with what you call finished.</p>',
      optionRationales: [
        'A demo script is not the definition of done. The review would be looking at unfinished work labeled complete.',
        'Lowering done to fit the demo removes the quality bar instead of meeting it.',
        'The gap stays visible, and the unfinished handling and guide are completed before the work is called done.',
        'A later project may never be funded. Operations would still inherit a product the team called done.'
      ],
      keyPoint: 'A demo does not make work done. Finish what the inheriting team needs before you call it complete.',
      trap: 'Marking stories done for the review transfers quality debt to operations.'
    },
    {
      qid: 'pmp:set-1:036',
      sub: 'pmp-people',
      ecoTask: 'Manage stakeholder expectations',
      approach: 'Hybrid',
      stem: 'The sponsor wants the cheaper build so the project stays inside the capital limit. The operating team will pay the energy cost for ten years, and that cost is higher with the cheaper build. The benefits case assumed the efficient option. The sponsor and the operating lead have not looked at the same numbers. What should you do?',
      options: [
        'Choose the cheaper build. The project is accountable for capital, not for the years after handover.',
        'Put both parties on the life-cycle comparison, including the capital limit and the ten-year cost, and get that decision made before the design is locked.',
        'Choose the efficient build and tell the sponsor about the capital gap only after the purchase is placed.',
        'Specify a middle design that matches neither estimate so both sides can claim a compromise.'
      ],
      answer: 1,
      why: '<p>The sponsor is optimizing the project budget. The operating lead will live with the energy cost, and the benefits case assumed the efficient option. Those expectations are not aligned until both see capital and ten-year cost together and decide. Picking the cheap build alone, buying the efficient one in secret, or inventing a middle option that was never estimated all lock a decision the two owners have not shared.</p><p><strong>Exam tip:</strong> When project cost and the cost after handover point different ways, put both decision makers on the life-cycle numbers before the design is fixed.</p>',
      optionRationales: [
        'Capital is real, and so is the ten-year cost the benefits case already assumed. One side does not get to ignore the other.',
        'Both owners see the same comparison, and the design waits until that choice is actually made.',
        'Placing the purchase first removes the sponsor from a capital decision they still own.',
        'A design nobody estimated is not a compromise. It is a third option with no cost basis.'
      ],
      keyPoint: 'Align the sponsor and the operator on life-cycle cost before you lock a cheaper build.',
      trap: 'Coming in under the capital limit can still be the wrong decision if the years after handover were part of the benefits case.'
    },
    {
      qid: 'pmp:set-1:037',
      sub: 'pmp-business',
      ecoTask: 'Continuous improvement',
      approach: 'Agile',
      stem: 'A defect in the payment rules reached production. A manager wants a 40-item checklist on every story, including stories that do not touch payment. The team can point to the missing test that would have caught this defect. What should you do?',
      options: [
        'Add the 40-item checklist. A longer list means better quality.',
        'Discipline the person who merged the change, and leave the test gap as it is.',
        'Stop releasing until every past story is rechecked against the new list.',
        'Add the missing payment test where that defect can still be caught, and do not put a blanket list on stories that do not touch payment.'
      ],
      answer: 3,
      why: '<p>The team already knows the gap: a payment test that was not there. Improvement is to put that test where this class of defect gets caught. A 40-item list on unrelated stories adds cost without aiming at the failure. Blame, or a full stop to recheck history against a new list, does not fix the missing test.</p><p><strong>Exam tip:</strong> Improve the step that let the defect through. Do not answer one miss with a checklist the whole backlog has to carry.</p>',
      optionRationales: [
        'Length is not aim. Most of the 40 items would not have caught a payment-rule defect.',
        'Blame does not add the test, so the next change can miss the same way.',
        'Rechecking every old story against a broad list delays delivery and still may not install the missing test.',
        'The specific test is added at the point of catch, and unrelated stories are not loaded with the whole list.'
      ],
      keyPoint: 'Fix the missing control that fits the defect. Do not tax every story with a blanket checklist.',
      trap: 'A longer checklist feels like rigor and often misses the one test that mattered.'
    },
    {
      qid: 'pmp:set-1:038',
      sub: 'pmp-business',
      ecoTask: 'Define and establish project governance',
      approach: 'Predictive',
      stem: 'Contingency was approved for identified risks, and you may draw it for those risks. Management reserve stays with the sponsor. A director asks you to approve contingency today for a new lobby display that was never a risk and is not in the baseline. What should you do?',
      options: [
        'Refuse the contingency draw. Record the display as a change and send it through the path that can authorize new scope and money.',
        'Approve the draw. A director request is the same thing as an identified risk.',
        'Spend management reserve yourself so the contingency percentage stays high.',
        'Have the team build the display in unrecorded overtime so no reserve is touched.'
      ],
      answer: 0,
      why: '<p>You are allowed to use contingency for identified risks, not for a new display. That request is scope and money the baseline does not contain, so it belongs on the change path that can authorize both. Treating a director ask as a risk, spending management reserve on your own, or hiding the work in overtime all step outside the authority that was set.</p><p><strong>Exam tip:</strong> Know which reserve you may spend and what it is for. New scope is a change, even when a director wants it today.</p>',
      optionRationales: [
        'Contingency stays on identified risks, and the display goes to the authority that can approve new scope.',
        'A request is not a risk response. The display was never in the risk set the reserve covers.',
        'Management reserve is the sponsor reserve. Using it yourself breaks the split you were given.',
        'Unrecorded overtime still spends the organization and still adds scope nobody authorized.'
      ],
      keyPoint: 'Contingency authority does not extend to new scope. Send that request through change control.',
      trap: 'A senior ask is not an identified risk, and it does not unlock a reserve you were not given.'
    },
    {
      qid: 'pmp:set-1:039',
      sub: 'pmp-people',
      ecoTask: 'Help ensure knowledge transfer',
      approach: 'Hybrid',
      stem: 'A hybrid rollout meets the build acceptance tests. The operating team has not run a supervised shift, and the only work instructions sit in the project chat. The contract lets you close when acceptance is signed. The operating lead asks you to close this week. What should you do?',
      options: [
        'Close this week. The contract test is the finish line.',
        'Close, then hold a lessons-learned meeting and mail the slides to operations.',
        'Before you close, confirm the operating team can run a shift from instructions they will still have. Do not treat a signed test as the handover.',
        'Leave one developer on call with no scheduled time and no written instructions.'
      ],
      answer: 2,
      why: '<p>Acceptance shows the build met the test. It does not show that operations can run the work after the project team leaves. The instructions in chat will not be the system of record. Close waits until a supervised shift works from instructions the operating team keeps. A contract signature, a later slide deck, or an informal on-call favor all end the project before the knowledge has moved.</p><p><strong>Exam tip:</strong> A passed test is not a handover. Transfer the ability to run the work before you close, even when the contract would let you sign.</p>',
      optionRationales: [
        'The contract allows close. It does not prove the operating team can run the next shift.',
        'Lessons learned after close are not instructions, and the team that knows the work may already be gone.',
        'Someone in operations runs the shift from durable instructions before the project calls itself finished.',
        'An unnamed on-call favor disappears with the developer. It is not a transfer.'
      ],
      keyPoint: 'Do not close on a signed test if the people who must run the work cannot yet do it.',
      trap: 'Contract acceptance can be earlier than a real handover. The exam wants the handover.'
    },
    {
      qid: 'pmp:set-1:040',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Hybrid',
      stem: 'The new scheduling process is live, and the project team is about to disband. Supervisors are still using the old paper book because the new step takes longer. The sponsor says adoption is an operations problem now. The benefits case depends on people actually using the new process. What should you do?',
      options: [
        'Disband. The system is live, so the change is complete.',
        'Stay with the supervisors long enough to remove the barrier to the new process, and do not close the change while the paper book is still the way work gets done.',
        'Send a policy memo that forbids the paper book, then disband the same day.',
        'Turn the new process off so the paper book is official again and the conflict ends.'
      ],
      answer: 1,
      why: '<p>Go-live is not adoption. The benefits case fails if the paper book remains the real process. The project manager stays with the barrier, the extra step the supervisors are avoiding, instead of declaring the change done. A memo with no support, or switching the new process off, either abandons the benefit or abandons the change.</p><p><strong>Exam tip:</strong> If the benefit depends on people using the new way, the change is not finished while the old way is still how the work gets done.</p>',
      optionRationales: [
        'A live system that nobody uses does not deliver the benefit the case named.',
        'The extra step is handled with the supervisors, and close waits until the new process is the one in use.',
        'A same-day ban does not remove the reason they kept the book, and the team that could help is already gone.',
        'Turning the process off ends the conflict by giving up the benefit.'
      ],
      keyPoint: 'Support the change until the new way is actually in use. Go-live is not the benefit.',
      trap: 'Handing adoption to operations on day one, while the old book is still the real system, strands the benefit.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 1;
    q.batch = index < 10 ? 1 : index < 20 ? 2 : index < 30 ? 3 : 4;
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
      1: {target: 180, label: 'Batches 1-4: Q001-Q040'},
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
