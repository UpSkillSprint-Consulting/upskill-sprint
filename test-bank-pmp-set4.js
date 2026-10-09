/*
 * PMI PMP Exam Set 4 — original practice questions.
 * Q131-Q150. Written to the July 2026 Exam Content Outline
 * (People, Process, Business Environment) and the PMBOK Guide 8th Edition
 * performance domains. No PMI item, handbook passage, or figure is copied.
 * UpSkill Sprint is not affiliated with the Project Management Institute.
 */
(function (global) {
  'use strict';

  var questions = [
    {
      qid: 'pmp:set-4:131',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'Alex stays late every night. The rest of the team has started staying late too. Output has not increased. A director praises the hours in the all-hands and asks you to thank Alex publicly so others will copy it. What should you do?',
      options: [
        'Thank Alex publicly for the hours so the rest of the team has a model.',
        'Tell everyone to match Alex nights until output rises.',
        'Do not praise the hours. Find out why the work needs nights, reset a sustainable load, and recognize outcomes rather than endurance.',
        'Ignore the hours. Late work is a personal choice and not a project matter.'
      ],
      answer: 2,
      why: '<p>The nights have spread, and the output has not. Praising the hours teaches the team that endurance is the job. The project manager looks at why the work does not fit the day, resets the load, and recognizes results. Matching the nights, or calling it a private choice, either spreads the harm or leaves it unexamined.</p><p><strong>Exam tip:</strong> Do not celebrate heroics that the team is already copying with no gain. Fix the load.</p>',
      optionRationales: [
        'A public thank-you for hours is how the rest of the team learns to stay late.',
        'More nights repeat a pattern that has not increased output.',
        'The cause of the nights is examined, the load is reset, and recognition moves to outcomes.',
        'A pattern the whole team has started to copy is a project problem, not a private habit.'
      ],
      keyPoint: 'Stop praising unsustainable hours. Fix the load that makes them seem necessary.',
      trap: 'Thanking the person who stays latest teaches everyone else to do the same.'
    },
    {
      qid: 'pmp:set-4:132',
      sub: 'pmp-people',
      ecoTask: 'Manage conflict',
      approach: 'Hybrid',
      stem: 'In a defect review, a sponsor says the tester made the team look incompetent and tells you to have the tester apologize to the room before any fix is discussed. The defect is real. What should you do?',
      options: [
        'Have the tester apologize first so the sponsor will stay for the fix.',
        'Stop the personal attack, discuss the defect and the fix, and speak with the sponsor separately about the remark. Do not require an apology for finding a defect.',
        'Cancel the review so the sponsor cannot repeat the remark.',
        'Side with the sponsor in the room and reassign the tester off the project.'
      ],
      answer: 1,
      why: '<p>The room needs a fix, not an apology for a real defect. The project manager stops the attack, keeps the discussion on the defect, and takes the remark up with the sponsor outside the meeting. An apology, a cancelled review, or removing the tester all punish the person who found the problem.</p><p><strong>Exam tip:</strong> Protect the person, then fix the defect. Do not make someone apologize for raising a real issue.</p>',
      optionRationales: [
        'An apology for finding a defect teaches the team to stay quiet next time.',
        'The attack stops, the fix stays on the table, and the sponsor hears about the remark in private.',
        'Cancelling the review avoids the remark and also avoids the fix.',
        'Removing the tester sides with the insult and loses the person who saw the defect.'
      ],
      keyPoint: 'Do not require an apology for a real defect. Stop the attack and get to the fix.',
      trap: 'Keeping a powerful sponsor comfortable is not a reason to humiliate the person who found the problem.'
    },
    {
      qid: 'pmp:set-4:133',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Agile',
      stem: 'In remote planning, the headquarters site talks over the other two sites. Decisions are written down as agreed when those sites were silent. They have rebuilt the work twice the next day. A manager wants a cameras-on rule and says silence means agreement. What should you do?',
      options: [
        'Adopt the cameras-on rule. Seeing faces will balance the sites.',
        'Keep the current close. Silence is the standard meaning of consent.',
        'Give each site a turn before a decision closes, record it where all three confirm it, and do not treat silence as a yes.',
        'Let headquarters decide. They are the largest site.'
      ],
      answer: 2,
      why: '<p>Silence has already produced two rebuilds. The project manager changes the close so each site speaks and confirms the decision in writing. Cameras do not create a turn. Treating silence as consent repeats the miss. Headquarters deciding by size keeps the imbalance.</p><p><strong>Exam tip:</strong> On a distributed team, silence is not agreement. Close a decision only after each site has had a turn and can restate it.</p>',
      optionRationales: [
        'Cameras do not stop one site from talking over the others or define what silence means.',
        'Silence already failed twice. It is not a safe definition of consent here.',
        'Each site speaks, and the written decision is confirmed before anyone builds.',
        'Size is not a reason for one site to close decisions the others then undo.'
      ],
      keyPoint: 'Do not close a remote decision on silence. Each site confirms it before the team builds.',
      trap: 'Silence means yes is how a loud site ships a decision the others never accepted.'
    },
    {
      qid: 'pmp:set-4:134',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage resources',
      approach: 'Predictive',
      stem: 'The exhibit is who holds the critical work this week. A manager says to leave it, because Alex is the only person who knows the safety review. What should you do?',
      options: [
        'Leave the six items with Alex. Expertise is the assignment.',
        'Have Mina perform the next safety review with Alex this week, and move work off Alex. Do not leave one person as the only reviewer.',
        'Hire a new reviewer before anyone else is allowed to touch the safety review.',
        'Give Alex the three items Owen is waiting on as well, so the queue has one owner.'
      ],
      answer: 1,
      chart: {
        type: 'data-table',
        title: 'Who holds the critical work',
        columns: ['Person', 'Critical items', 'What else is true'],
        rows: [
          ['Alex', '6, including the only safety review', 'No one else has performed that review'],
          ['Mina', '1', 'Able to learn the review, and has not been asked'],
          ['Owen', '1', 'Waiting on Alex for three other items'],
          ['Priya', '0', 'Available this week']
        ]
      },
      why: '<p>Alex is the path for the review and for Owen. Mina can learn it, and Priya is free. The project manager pairs Mina onto the next review and moves load off Alex. Leaving the expert in place, hiring before using the people you have, or adding Owen items to Alex all deepen the single point of failure.</p><p><strong>Exam tip:</strong> Read who else can take the work. The only expert is a resource risk, not a reason to leave six critical items on one person.</p>',
      optionRationales: [
        'Expertise that nobody else has is the risk. Leaving it there does not reduce it.',
        'Mina learns the review now, and Alex is no longer the only person who can do it.',
        'Hiring first ignores Mina and Priya, who are already here.',
        'More of Owen work on Alex lengthens the wait the exhibit already shows.'
      ],
      keyPoint: 'Spread the safety review this week. Do not leave it on the one person who already holds six critical items.',
      trap: 'They are the only one who knows it is the sentence that keeps a single point of failure in place.'
    },
    {
      qid: 'pmp:set-4:135',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Predictive',
      stem: 'A contractor had a near miss on site this morning. The award for the next phase is next week. The client asks you to leave the near miss out of the safety report until that award is signed. What should you do?',
      options: [
        'Hold the report until next week. The award is the larger obligation.',
        'Write the report and file it only if the award is delayed.',
        'Report the near miss through the safety path now. Do not time the report to the award.',
        'Ask the contractor to describe the near miss as a drill so the report stays clean.'
      ],
      answer: 2,
      why: '<p>A near miss is a safety fact. The award date does not change the duty to report it. The project manager files it through the safety path now. Holding it, conditioning it on a delay, or relabeling it as a drill all hide the event for a commercial reason.</p><p><strong>Exam tip:</strong> Do not delay a safety report to protect an award. The reporting path and the commercial calendar are separate.</p>',
      optionRationales: [
        'The award is not a reason to withhold a near miss the safety path requires.',
        'Filing only if the award slips still ties a safety report to a commercial outcome.',
        'The near miss goes through the safety path now, regardless of next week award.',
        'Calling it a drill falsifies the record.'
      ],
      keyPoint: 'Report the near miss now. Do not hold it for a contract award.',
      trap: 'Just until the award is signed is how a safety report becomes a commercial tactic.'
    },
    {
      qid: 'pmp:set-4:136',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Hybrid',
      stem: 'Your staff stop at 5 in the evening. The vendor team starts at noon your time and works until 9. Each side leaves questions the other does not see until the next day, and each calls the other unresponsive. What should you do?',
      options: [
        'Move your staff onto the vendor hours so there is one schedule.',
        'Move the vendor onto your hours. They are the supplier.',
        'Add a daily status meeting at each group start of day.',
        'Agree a shared overlap and a response time, write that agreement down, and do not force either group onto the other full day.'
      ],
      answer: 3,
      why: '<p>The failure is the gap between the two days, not the existence of two days. The project manager agrees an overlap and a response time and writes it down. Moving either group onto the other full schedule, or adding meetings that do not set a response, does not fix the overnight wait.</p><p><strong>Exam tip:</strong> When two teams miss each other by hours, agree the overlap and the response. Do not impose one culture full day on the other.</p>',
      optionRationales: [
        'Your full day imposed on the vendor ignores the hours their contract and lives are built on.',
        'Their full day imposed on your staff does the same thing in reverse.',
        'Two more meetings can repeat the status without a promise of when a question gets an answer.',
        'The overlap and the response time are agreed and written, and both schedules otherwise stand.'
      ],
      keyPoint: 'Set a shared overlap and a response time. Do not force one team onto the other full schedule.',
      trap: 'Calling the other group unresponsive usually means the working hours were never agreed.'
    },
    {
      qid: 'pmp:set-4:137',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'In the last retro, a manager criticized by name the person who said an estimate was wrong. This retro nobody speaks. The facilitator wants to skip retros until people feel safer. What should you do?',
      options: [
        'Skip them. A silent retro wastes the hour.',
        'Require each person to speak so the silence is broken.',
        'Hold the retro, state that naming a problem will not be punished, and address the manager reaction. Do not skip the practice.',
        'Stop inviting the team and hold the retro with managers only.'
      ],
      answer: 2,
      why: '<p>The silence is the information. Someone was punished for a true estimate, and the team learned to say nothing. The project manager holds the retro, makes the safety explicit, and deals with the manager reaction. Skipping, forcing speech, or replacing the team with managers all avoid repairing the room.</p><p><strong>Exam tip:</strong> If a retro goes silent after someone was punished for speaking, restore safety and hold the retro. Do not cancel it.</p>',
      optionRationales: [
        'Skipping confirms that speaking is unsafe and removes the only regular place to say so.',
        'Forcing speech in an unsafe room produces polite fiction.',
        'The retro happens, the no-punishment rule is stated, and the manager reaction is addressed.',
        'A managers-only retro is where the punishment came from, not where the team can talk.'
      ],
      keyPoint: 'Restore safety and keep the retro. Do not skip it because the last one was punished.',
      trap: 'A silent retro is not a sign that there is nothing to say.'
    },
    {
      qid: 'pmp:set-4:138',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Agile',
      stem: 'A director wants each person story points posted every week, with a bonus for the highest name. The team swarms shared stories. The director says the points are already on the board, so the ranking is only a different view. What should you do?',
      options: [
        'Post the ranking. The points are already visible, so nothing new is exposed.',
        'Do not use story points as an individual score. Keep the measure on the team outcome, and explain that a personal bonus will stop the swarming.',
        'Award the bonus in private so the board can stay a team board.',
        'Raise the point target until the ranking spreads out.'
      ],
      answer: 1,
      why: '<p>Story points on a shared board are a team signal. Turning them into a personal bonus makes people keep work, not swarm it. The project manager refuses that use and says why. A private bonus, or a higher target, still pays individuals for a team measure.</p><p><strong>Exam tip:</strong> Do not turn a team flow measure into an individual ranking. The behavior you pay for is the behavior you get.</p>',
      optionRationales: [
        'Visible points are a team signal. A ranked bonus changes what people optimize.',
        'The points stay a team measure, and the director hears that a personal bonus will break swarming.',
        'A private bonus still rewards the individual total the team was not built to maximize.',
        'A higher target makes the ranking sharper. It does not make it a valid individual measure.'
      ],
      keyPoint: 'Keep story points at the team level. Do not pay a bonus for the highest individual name.',
      trap: 'The points are already on the board is not permission to rank the people.'
    },
    {
      qid: 'pmp:set-4:139',
      sub: 'pmp-process',
      ecoTask: 'Develop and manage project scope',
      approach: 'Hybrid',
      stem: 'A vice president sends do-this-today messages to two developers. Those tasks are not on the backlog. The sprint goal is slipping. The vice president says a message is faster than your intake. What should you do?',
      options: [
        'Let the developers do the messages. Speed is the point of an adaptive team.',
        'Tell the developers to ignore the vice president.',
        'Bring the requests to the product owner, stop the side intake, and if something is truly urgent let the owner reorder it in the open.',
        'Add a second backlog that contains only vice president messages.'
      ],
      answer: 2,
      why: '<p>A side channel has become a second scope system, and the goal is slipping. The project manager puts intake back with the product owner and lets a real urgent item be reordered where everyone can see it. Doing the messages, ignoring the vice president, or creating a private backlog all keep two sources of work.</p><p><strong>Exam tip:</strong> Urgent still has one front door. Do not let a private message become a second backlog.</p>',
      optionRationales: [
        'Faster for one sender is slower for the goal the team already committed to.',
        'Ignoring the vice president hides the requests instead of putting them through intake.',
        'The owner sees the requests, the side door closes, and a true urgent item is reordered in the open.',
        'A second backlog is the side channel made official.'
      ],
      keyPoint: 'Close the side channel. Urgent work is reordered by the product owner, not by a private message.',
      trap: 'A message is faster is how a sprint goal loses to whoever can reach a developer.'
    },
    {
      qid: 'pmp:set-4:140',
      sub: 'pmp-business',
      ecoTask: 'Define and establish project governance',
      approach: 'Predictive',
      stem: 'A sponsor asks you to skip the safety peer review just this once so a demo can happen this afternoon. The review is required before that build is shown. The sponsor says the exception is small and will not be repeated. What should you do?',
      options: [
        'Skip it this once. A single demo is not a pattern.',
        'Show a different slice that does not need the review, or move the demo. Do not grant yourself an exception to a required review.',
        'Hold the review after the demo and backdate the result.',
        'Let the sponsor email the exception so the skip has a record and the demo stays on the clock.'
      ],
      answer: 1,
      why: '<p>The review is required before the build is shown. Just this once is still a skip. The project manager shows something that does not need the review, or moves the demo. A backdated review or a sponsor email that authorizes the skip both pretend the control happened or that a sponsor can waive it in the hallway.</p><p><strong>Exam tip:</strong> You do not get to waive a required safety review for a demo. Change what you show, or change when you show it.</p>',
      optionRationales: [
        'One demo is enough to show an unreviewed build. Once is not a safe exception.',
        'The demo uses work that has passed the review, or it waits. The review is not skipped.',
        'A review after the showing, with an earlier date, is a false record.',
        'An email does not convert a required review into an optional one.'
      ],
      keyPoint: 'Do not skip a required safety review for a demo, even once.',
      trap: 'Just this once is how a required review becomes optional.'
    },
    {
      qid: 'pmp:set-4:141',
      sub: 'pmp-process',
      ecoTask: 'Develop an integrated plan and plan delivery',
      approach: 'Hybrid',
      stem: 'Part of the work is a safety dossier with a fixed table of contents. Part is a screen flow the users have not settled. The PMO says the whole effort must be one agile team with no baseline, so the method stays pure. What should you do?',
      options: [
        'Drop the baseline. A pure method is easier to audit than a hybrid.',
        'Freeze the screen flow too, so both parts match the dossier controls.',
        'Control the dossier with a baseline, keep the screen flow adaptive, and do not force one method onto both.',
        'Refuse the dossier. Agile teams do not deliver fixed content.'
      ],
      answer: 2,
      why: '<p>The dossier is knowable and controlled. The screen flow is not. One method for both either drops the control the dossier needs or freezes work the users have not settled. The project manager uses both, on purpose. Refusing the dossier abandons part of the outcome.</p><p><strong>Exam tip:</strong> Tailor the approach to the work. Do not force a pure method onto a fixed dossier and an unsettled flow at the same time.</p>',
      optionRationales: [
        'Purity is not a reason to remove the baseline a fixed dossier needs.',
        'Freezing the screen flow pretends the users have settled it.',
        'The dossier stays baselined and the screen flow stays adaptive.',
        'The dossier is part of the work. The method has to include it, not reject it.'
      ],
      keyPoint: 'Use a baseline where the content is fixed and an adaptive flow where it is not.',
      trap: 'One pure method feels tidy and fits only half of this work.'
    },
    {
      qid: 'pmp:set-4:142',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'The phase gate is today. Two exit criteria are open: the hazard log is unsigned, and the test summary is still a draft. The sponsor says the calendar is the gate and the next phase already has people waiting. What should you do?',
      options: [
        'Pass the gate. Waiting people are a larger cost than two open criteria.',
        'Do not pass it. Finish the criteria or move the next phase start. A date does not replace exit criteria.',
        'Sign the hazard log yourself so the gate has a name on it.',
        'Mark both criteria waived and start the next phase this afternoon.'
      ],
      answer: 1,
      why: '<p>The gate is the criteria, not the day on the calendar. People waiting does not sign a hazard log or finish a test summary. The project manager finishes the criteria or replans the start. Signing for someone else, or waiving the criteria, opens the next phase on a false exit.</p><p><strong>Exam tip:</strong> Do not pass a phase gate because the date arrived. Exit criteria are the gate.</p>',
      optionRationales: [
        'Waiting people do not complete an unsigned hazard log or a draft test summary.',
        'The criteria are finished or the next start moves. The date alone does not pass the gate.',
        'Your signature is not the hazard owner decision the log requires.',
        'A waiver written to save the afternoon is a false exit.'
      ],
      keyPoint: 'A phase gate opens when the exit criteria are met, not when the calendar says so.',
      trap: 'People are waiting is the pressure that turns a gate into a meeting.'
    },
    {
      qid: 'pmp:set-4:143',
      sub: 'pmp-business',
      ecoTask: 'Define and establish project governance',
      approach: 'Hybrid',
      stem: 'A new executive says every project becomes agile on Monday, including this regulatory submission. The submission content is fixed by the regulator. The executive asks you to discard the content plan so the team can discover the filing. What should you do?',
      options: [
        'Discard the plan. The new direction is the governance.',
        'Ignore the executive. A regulatory filing cannot change method.',
        'Show which work can be iterative and which content must stay controlled, and do not discard the content plan to match a label.',
        'Stop the submission until the organization finishes a method debate.'
      ],
      answer: 2,
      why: '<p>A label is not a life cycle. Some of the work can iterate, and the regulator content cannot be discovered away. The project manager shows that split and keeps the content plan. Discarding it, ignoring the executive, or stopping for a debate all miss the actual constraint.</p><p><strong>Exam tip:</strong> When someone orders a method by name, map the method to the work. Do not throw out fixed regulatory content to look agile.</p>',
      optionRationales: [
        'An order to become agile does not make a fixed filing into discovery work.',
        'Ignoring the executive loses the chance to show what can iterate.',
        'The executive sees the split, and the content plan stays for the fixed part.',
        'A full stop waits on a debate the filing does not need.'
      ],
      keyPoint: 'Do not discard a fixed regulatory plan because a new executive wants the agile label.',
      trap: 'Becoming agile on Monday is a slogan, not a life cycle for a fixed submission.'
    },
    {
      qid: 'pmp:set-4:144',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Agile',
      stem: 'Every sprint, the team moves all stories to in progress on the first day. The first finished story appears on day eight. Review defects show up when the sprint can no longer change. What should you do?',
      options: [
        'Keep starting everything on day one. A full board shows commitment.',
        'Limit how many stories are in progress, finish a slice early enough to review it, and do not open the whole sprint on day one.',
        'Lengthen the sprint until day eight is the middle.',
        'Drop the review so late defects are not visible.'
      ],
      answer: 1,
      why: '<p>Starting everything creates a board that looks busy and a review that arrives too late to use. The project manager limits work in progress and finishes a slice in time to learn. A longer sprint or a cancelled review moves or hides the same late discovery.</p><p><strong>Exam tip:</strong> Finish a slice early. Do not start the whole sprint on day one and call that commitment.</p>',
      optionRationales: [
        'A full in-progress column is not commitment. It is unfinished work with no early feedback.',
        'Fewer stories are open, and a finished slice reaches review while the sprint can still respond.',
        'A longer sprint makes day eight look earlier and does not change the start-everything habit.',
        'Removing the review hides the defects the habit is causing.'
      ],
      keyPoint: 'Limit work in progress so a slice finishes in time to learn from it.',
      trap: 'Moving every story to in progress on day one feels like a fast start and delays every finish.'
    },
    {
      qid: 'pmp:set-4:145',
      sub: 'pmp-people',
      ecoTask: 'Align stakeholder expectations',
      approach: 'Hybrid',
      stem: 'The phase lead milestone plan and the scrum lead sprint plan disagree on what is current. Yesterday the team built the sprint version. This morning the phase lead stopped them because the milestone plan says something else. What should you do?',
      options: [
        'Tell the team to follow whichever plan they saw last.',
        'Drop the milestone plan. The sprint plan is the one the team touched yesterday.',
        'Put both leads on one current plan before more work starts. Do not leave the team to guess which document is live.',
        'Let each lead keep a plan and reconcile them at the monthly review.'
      ],
      answer: 2,
      why: '<p>Two current plans means the team will keep starting and stopping. The project manager gets both leads onto one plan before the next hour of work. Following the last document anyone saw, dropping the milestone, or waiting a month all leave the contradiction in force.</p><p><strong>Exam tip:</strong> A hybrid effort needs one current plan. Do not make the team reconcile two leads by trial and error.</p>',
      optionRationales: [
        'Whichever they saw last is how yesterday and this morning already contradicted each other.',
        'Dropping the milestone plan throws out a control instead of integrating it.',
        'Both leads agree one plan, and the team stops guessing.',
        'A month of two plans is a month of rework.'
      ],
      keyPoint: 'Reconcile the milestone plan and the sprint plan before the team builds either one.',
      trap: 'Two documents that both say current will take turns stopping the team.'
    },
    {
      qid: 'pmp:set-4:146',
      sub: 'pmp-process',
      ecoTask: 'Develop and manage project scope',
      approach: 'Predictive',
      stem: 'The exhibit shows Friday from two directions. The team has already started the field story. What should you do?',
      options: [
        'Let the story finish. It is already in progress, and the sponsor called it small.',
        'Stop the field story until the freeze and the sprint goal are reconciled through change control. Do not let an in-progress story break the milestone.',
        'Cancel the feature freeze so the sprint goal can stand alone.',
        'Hide the sponsor note and finish the freeze with the field included and unmentioned.'
      ],
      answer: 1,
      chart: {
        type: 'data-table',
        title: 'Two plans for Friday',
        columns: ['Source', 'What it says'],
        rows: [
          ['Phase milestone', 'Feature freeze Friday. No new field after Wednesday'],
          ['Sprint goal', 'Add the sponsor field'],
          ['Team board', 'The field story is in progress, and no change request is open'],
          ['Sponsor note', 'Small, just add it']
        ]
      },
      why: '<p>The milestone freezes new fields, and the sprint goal adds one. The story is already moving with no change request. The project manager stops it and reconciles the freeze and the goal through change control. Finishing because it started, cancelling the freeze, or hiding the note all pick a side in secret.</p><p><strong>Exam tip:</strong> When a sprint goal contradicts a milestone exit, stop and reconcile them. In progress is not a decision.</p>',
      optionRationales: [
        'Started and small do not override a feature freeze that forbids the field.',
        'The story stops, and the freeze and the goal go through change control together.',
        'Cancelling the freeze to save the sprint goal drops the milestone without a decision.',
        'Including the field and hiding the note makes the freeze false.'
      ],
      keyPoint: 'Stop the story that breaks the freeze, and reconcile the sprint goal with the milestone.',
      trap: 'Already in progress is how a sprint goal quietly beats a feature freeze.'
    },
    {
      qid: 'pmp:set-4:147',
      sub: 'pmp-business',
      ecoTask: 'Define and establish project governance',
      approach: 'Predictive',
      stem: 'The life cycle has been iterative, with a review each sprint. A wiki page edited last night says the rest of the work will ship as one release, with no review until the end. Governance says a life-cycle change needs the sponsor and the PMO. Neither has seen the page. What should you do?',
      options: [
        'Follow the wiki. The team that does the work may change the life cycle.',
        'Treat the wiki as a proposal. Take it to the sponsor and the PMO, and do not execute the new life cycle until they decide.',
        'Delete the page and do not tell the sponsor it was written.',
        'Skip the remaining reviews now and ask for approval after the single release.'
      ],
      answer: 1,
      why: '<p>The life cycle is governed. A wiki edit is not the approval the rule requires. The project manager takes the proposal to the sponsor and the PMO and keeps the current reviews until they decide. Following the page, hiding it, or skipping reviews and asking later all let an unapproved change run.</p><p><strong>Exam tip:</strong> A life-cycle change follows the governance path. A wiki edit does not approve it.</p>',
      optionRationales: [
        'The team can propose. They cannot replace the sponsor and PMO decision the rule names.',
        'The page stays a proposal, the right people decide, and the current life cycle continues until then.',
        'Deleting it hides a proposal the governance was supposed to see.',
        'Skipping reviews first and approving later executes the change before the decision.'
      ],
      keyPoint: 'Do not let a wiki edit become the life cycle. Take the proposal through governance.',
      trap: 'The page is written down is not the same as the sponsor and the PMO agreeing.'
    },
    {
      qid: 'pmp:set-4:148',
      sub: 'pmp-process',
      ecoTask: 'Plan and optimize quality',
      approach: 'Predictive',
      stem: 'Stories meet the team definition of done: code review and a demo. The phase exit also requires a signed hazard note. The gate fails because the notes are missing, and the team says the stories were done. What should you do?',
      options: [
        'Accept the team definition. The gate should not add conditions after a demo.',
        'Add the signed hazard note to what done means for this work, and do not call the stories ready for the gate without it.',
        'Sign the notes yourself at the gate so the stories stay done.',
        'Remove the hazard note from the exit criteria because it was not in the team definition.'
      ],
      answer: 1,
      why: '<p>Done for the team and done for the gate have drifted apart, and the gate is failing for a real reason. The project manager puts the hazard note into what done means for this work. Signing for the team, or deleting the exit criterion, makes the word done match the gap instead of closing it.</p><p><strong>Exam tip:</strong> If the phase exit needs evidence the definition of done omits, fix the definition. Do not argue the gate out of its criterion.</p>',
      optionRationales: [
        'A demo and a code review do not satisfy an exit that requires a signed hazard note.',
        'Done for this work includes the note, and the gate is not asked to ignore it.',
        'Your signature is not the hazard decision the note requires.',
        'Removing the criterion makes the exit match the gap. It does not make the work ready.'
      ],
      keyPoint: 'Align done with the phase exit. A demo is not a signed hazard note.',
      trap: 'The stories were done is often true of the team definition and false of the gate.'
    },
    {
      qid: 'pmp:set-4:149',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Hybrid',
      stem: 'The team wants to cancel the next three sprint reviews to gain two days. In the last three reviews the sponsor caught that the build had drifted from the outcome. What should you do?',
      options: [
        'Cancel them. Two days of building is worth more than a meeting.',
        'Replace the reviews with an email the sponsor can read if they want.',
        'Keep the reviews. The two days are cheaper than another drift the sponsor does not see until later.',
        'Hold the reviews only if the sponsor promises not to change anything.'
      ],
      answer: 2,
      why: '<p>The reviews are where the drift was caught. Cancelling them to gain two days removes the feedback that protected the outcome. An email the sponsor might read, or a review that cannot change anything, is not the same conversation. The project manager keeps the reviews.</p><p><strong>Exam tip:</strong> Do not cancel the review that is catching drift in order to gain build time. The review is the control.</p>',
      optionRationales: [
        'Two extra build days without the review are how the last drifts would have stayed hidden.',
        'An optional email is not the sponsor looking at the build.',
        'The reviews stay, because that is where the outcome drift was actually caught.',
        'A review that cannot change anything is a status, not a review.'
      ],
      keyPoint: 'Keep the sprint review when it is the moment the sponsor catches drift.',
      trap: 'Saving two days by cancelling the review spends the feedback that was protecting the outcome.'
    },
    {
      qid: 'pmp:set-4:150',
      sub: 'pmp-business',
      ecoTask: 'Remove impediments and manage issues',
      approach: 'Predictive',
      stem: 'A change that takes about three days of work waits in six functional queues and finishes in about 30 days. A manager wants two extra status meetings each week so the waiting is more visible. What should you do?',
      options: [
        'Add the meetings. Visibility is the fix for a long cycle time.',
        'Ask each queue to write a longer status so the 30 days are explained.',
        'Reduce or combine the handoffs that create the queues. Do not add meetings that only describe the wait.',
        'Start every change in all six queues at once so none of them can claim they are last.'
      ],
      answer: 2,
      why: '<p>The work is three days. The system around it is 30. More meetings and longer status make the wait easier to narrate and do not remove a queue. The project manager goes after the handoffs. Starting every queue at once creates six partial starts instead of one flow.</p><p><strong>Exam tip:</strong> When cycle time is mostly waiting, remove handoffs. Do not add status meetings to watch the waiting.</p>',
      optionRationales: [
        'Another meeting reports the 30 days. It does not make the three days of work move.',
        'A longer explanation of each queue keeps the six queues.',
        'The handoffs are reduced or combined, which is what the 30 days are made of.',
        'Opening every queue at once multiplies the wait instead of sequencing the work.'
      ],
      keyPoint: 'Cut the handoffs that turn three days of work into 30. Do not meet more often to watch them.',
      trap: 'More status on a queue makes the delay look managed and leaves the queue in place.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 4;
    q.batch = index < 10 ? 14 : 15;
    q.original = true;
    q.sourceDocument = 'Original UpSkill Sprint item. July 2026 PMP Exam Content Outline and PMBOK Guide 8th Edition used as references only. Not a PMI item.';
    if (q.qid !== 'pmp:set-4:' + String(index + 131).padStart(3, '0')) {
      throw new Error('PMP Set 4 id sequence broken at ' + q.qid);
    }
  });

  global.PMP_SET4 = questions;

  global.registerPMPSet4 = function (exam) {
    if (!exam) return;
    var existing = exam.sets || {};
    var first = existing[1] || exam.bank || [];
    var second = existing[2] || [];
    var third = existing[3] || [];
    exam.sets = Object.assign({}, existing, {1: first, 2: second, 3: third, 4: questions});
    if (!exam.bank || !exam.bank.length) exam.bank = first.length ? first : questions;
    var ids = Array.isArray(exam.plannedSets) ? exam.plannedSets.map(String) : ['1', '2', '3'];
    if (ids.indexOf('4') < 0) ids.push('4');
    exam.plannedSets = ids;
    exam.setPlans = Object.assign({}, exam.setPlans, {
      4: {target: 20, label: 'Q131-Q150'}
    });
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {4: 20});
    exam.setName = 'Set 1: Q001-Q080 · Set 2: Q081-Q100 · Set 3: Q101-Q130 · Set 4: Q131-Q150';
  };
})(typeof window !== 'undefined' ? window : globalThis);
