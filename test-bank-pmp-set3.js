/*
 * PMI PMP Exam Set 3 — original practice questions.
 * Q101-Q130. Written to the July 2026 Exam Content Outline
 * (People, Process, Business Environment) and the PMBOK Guide 8th Edition
 * performance domains. No PMI item, handbook passage, or figure is copied.
 * UpSkill Sprint is not affiliated with the Project Management Institute.
 */
(function (global) {
  'use strict';

  var questions = [
    {
      qid: 'pmp:set-3:101',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Agile',
      stem: 'A pilot of the claims portal shows 4 of 30 adjusters using it. The benefits owner who asked for the portal has missed six weeks of reviews. The team is about to build the next five features from that owner first list. What should you do?',
      options: [
        'Build the five features. The first list is still the order.',
        'Take the usage data to the benefits owner and the adjusters, and choose the next slice from what the pilot showed. Do not keep building the old list.',
        'Declare the portal a success because the pilot launched.',
        'Replace the adjusters with a group more willing to use the portal.'
      ],
      answer: 1,
      why: '<p>The pilot already says the first list is not pulling adjusters in, and the owner of the benefit has been absent. The next slice should come from that evidence and from those people, not from a six-week-old list. Shipping the list, declaring success, or swapping the users all avoid the conversation the usage is asking for.</p><p><strong>Exam tip:</strong> When a pilot shows the users are not adopting the work, go back to the owner and the users before you build the next slice.</p>',
      optionRationales: [
        'The first list is what the pilot just failed to make useful. Building five more of it ignores the 4 of 30.',
        'The owner and the adjusters see the usage, and the next slice follows that conversation.',
        'A launched pilot is not a benefit when almost no adjuster uses it.',
        'Replacing the users avoids learning why the people who do the job are not in the portal.'
      ],
      keyPoint: 'Take weak adoption back to the benefits owner before you build the old list.',
      trap: 'A feature list from month one is not still the order after the pilot contradicts it.'
    },
    {
      qid: 'pmp:set-3:102',
      sub: 'pmp-people',
      ecoTask: 'Align stakeholder expectations',
      approach: 'Predictive',
      stem: 'One sponsor says the project succeeds if it hits the promised date. The other says it succeeds only if branch staff adopt the new close. The charter names staff adoption as the benefit and the date as a constraint. They ask you to invent a private blend so the argument ends. What should you do?',
      options: [
        'Average the two goals into a score neither sponsor has seen.',
        'Treat the date as the only success measure. Adoption can be watched later.',
        'Use adoption as the success measure named in the charter, keep the date as a constraint, and put that split back in front of both sponsors.',
        'Tell each sponsor, in private, that their measure is the real one.'
      ],
      answer: 2,
      why: '<p>The charter already split the argument: adoption is the benefit, and the date is a constraint. A private blend, a date-only success, or two contradictory private answers all hide that split. The project manager puts the charter language back in the room so both sponsors are deciding the same thing.</p><p><strong>Exam tip:</strong> Do not invent a third success measure to calm two sponsors. Return to the benefit and the constraint the charter already named.</p>',
      optionRationales: [
        'A private average is a new goal nobody agreed to, which is how the argument comes back later.',
        'The date is a constraint. Making it the only success drops the benefit the charter named.',
        'Both sponsors see adoption as the benefit and the date as the constraint.',
        'Telling each person they won guarantees a collision the next time they are in the same room.'
      ],
      keyPoint: 'Align the sponsors to the charter: adoption is the benefit, the date is the constraint.',
      trap: 'A private blend feels like peace and leaves both sponsors expecting a different project.'
    },
    {
      qid: 'pmp:set-3:103',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Agile',
      stem: 'The product owner wants to report a strong month because 18 stories were accepted. The exhibit is the refund outcome those stories were supposed to move. What should you do?',
      options: [
        'Report the refund time and the low usage, and aim the next work at that outcome. Do not report success from the 18 stories.',
        'Report success. Accepted stories are the value.',
        'Add 18 more stories of the same kind so the count goes higher.',
        'Reset the goal to 6 days so a flat refund time looks like the plan.'
      ],
      answer: 0,
      chart: {
        type: 'data-table',
        title: 'Refund portal, last four weeks',
        columns: ['Signal', 'Figure'],
        rows: [
          ['Stories accepted', '18'],
          ['Refund time at the start', '6 days'],
          ['Refund time now', '6 days'],
          ['Adjusters using the new path', '4 of 30']
        ]
      },
      why: '<p>Eighteen accepted stories did not move refund time, and almost no adjuster is on the new path. That is the month. The project manager reports the outcome and points the next work at it. A story count, more of the same stories, or a reset goal all hide a benefit that did not move.</p><p><strong>Exam tip:</strong> Read the outcome rows. A pile of accepted stories is not value when the measure you promised is unchanged.</p>',
      optionRationales: [
        'The report leads with refund time and usage, and the next work aims at those, not at another 18 stories.',
        'Accepted stories describe throughput. The exhibit shows the outcome did not move.',
        'More of the same stories repeats the month that failed to change refund time.',
        'Resetting the goal to the flat result makes the miss look planned.'
      ],
      keyPoint: 'Report the outcome the stories were for, not the number of stories accepted.',
      trap: 'Eighteen accepted stories is the number most likely to hide a refund time that never moved.'
    },
    {
      qid: 'pmp:set-3:104',
      sub: 'pmp-people',
      ecoTask: 'Manage stakeholder expectations',
      approach: 'Agile',
      stem: 'A department manager refuses access to the clerks the design needs. The manager says the project will make the department look slow. The clerks want to help. The sponsor offers to order the manager aside. What should you do?',
      options: [
        'Take the sponsor order and skip the manager.',
        'Drop the clerk interviews so the department stays comfortable.',
        'Tell the manager the fear is unfounded and hold the interviews the same day.',
        'Acknowledge the concern about looking slow, agree how the work will be described, and still get the clerk access the design needs.'
      ],
      answer: 3,
      why: '<p>The manager is protecting how the department will look, and the design still needs the clerks. The project manager takes that concern seriously, agrees the story that will be told, and still gets the access. An order that skips the manager, dropping the interviews, or dismissing the fear all either inflame the block or abandon the design.</p><p><strong>Exam tip:</strong> A resistant manager often has an interest, not just a no. Address the interest and still get the access the work needs.</p>',
      optionRationales: [
        'An order may open the door once and close the manager for the rest of the project.',
        'Comfort without the interviews leaves the design without the people who do the work.',
        'Telling the manager the fear is unfounded does not agree how the department will be described.',
        'The concern is acknowledged, the description is agreed, and the clerks are still in the design.'
      ],
      keyPoint: 'Meet the fear of looking slow, and still get the access the design needs.',
      trap: 'Skipping a resistant manager with a sponsor order wins the meeting and loses the relationship.'
    },
    {
      qid: 'pmp:set-3:105',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Hybrid',
      stem: 'Leadership wants the value announcement to say only that the new system goes live Friday. The benefit requires clerks to retire a side spreadsheet. The clerks have not been told the spreadsheet stops, or what they do instead. What should you do?',
      options: [
        'Announce the go-live. The system is the value.',
        'Change the announcement so it says what stops, what replaces it, and who is better off. Do not treat go-live as the whole story.',
        'Delete the spreadsheet Friday morning with no notice.',
        'Cancel the go-live because the announcement is hard to write.'
      ],
      answer: 1,
      why: '<p>Go-live is an event. The benefit is the spreadsheet stopping and the clerks knowing what replaces it. The announcement has to say that, or the old sheet stays the real system. Deleting it with no notice, or cancelling the release over wording, either shocks the clerks or abandons the change.</p><p><strong>Exam tip:</strong> A value story includes what stops and who is better off. Do not announce only that a system is on.</p>',
      optionRationales: [
        'A live system the clerks were not told to switch to does not retire the spreadsheet.',
        'The announcement names what stops, what replaces it, and who benefits.',
        'Deleting the sheet with no notice is a surprise, not a change people can make.',
        'Hard wording is not a reason to cancel a release that can be explained.'
      ],
      keyPoint: 'Tell people what stops and what replaces it. Go-live alone is not the value story.',
      trap: 'Friday go-live can be announced perfectly and still leave the side spreadsheet in charge.'
    },
    {
      qid: 'pmp:set-3:106',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Hybrid',
      stem: 'The status deck leads with percent of features built. The benefit owner asked one question: are customers finishing the new application path. That number is not in the deck. The team says feature percent is the progress measure they already have. What should you do?',
      options: [
        'Keep feature percent. A measure you already collect is the one to lead with.',
        'Tell the owner that feature percent answers the question they asked.',
        'Lead with whether customers finish the path, and do not substitute feature percent for that outcome.',
        'Remove every feature count so the deck cannot be compared with last month.'
      ],
      answer: 2,
      why: '<p>The owner asked for a customer outcome. Feature percent does not answer it. The project manager puts the path-completion number in front and keeps feature percent from standing in for it. Using the convenient measure, renaming it, or deleting all counts either miss the question or throw away context.</p><p><strong>Exam tip:</strong> Status for a benefit owner leads with the outcome they asked about. Do not swap in a feature percent you already have.</p>',
      optionRationales: [
        'A measure you already collect is not the measure the owner needs to decide.',
        'Feature percent and customers finishing the path are different facts.',
        'The deck leads with the path outcome the owner asked for.',
        'Stripping every count removes context the outcome number can sit beside.'
      ],
      keyPoint: 'Lead the status with the customer outcome, not with percent of features built.',
      trap: 'The measure you already have is often the wrong answer to the question the owner asked.'
    },
    {
      qid: 'pmp:set-3:107',
      sub: 'pmp-people',
      ecoTask: 'Plan and manage communication',
      approach: 'Predictive',
      stem: 'Executives decide whether to fund the next release, and they need the benefit trend. They receive a 40-page activity pack and do not read it. The working group decides the next slice, and they receive a one-line slogan with no numbers. What should you do?',
      options: [
        'Give the executives the benefit trend they decide on, and give the working group the numbers they need for the next slice. Do not send one pack to both.',
        'Send the 40-page pack to the working group too, so everyone has the same document.',
        'Shorten both audiences to the slogan.',
        'Stop reporting until both groups ask for a new format.'
      ],
      answer: 0,
      why: '<p>Each group has a different decision, and each is getting the artifact meant for the other job. Executives need the trend. The working group needs numbers, not a slogan. One shared pack, a slogan for both, or silence until they ask all leave at least one decision without the information it needs.</p><p><strong>Exam tip:</strong> Match the message to the decision. Do not send everyone the same pack because it feels fair.</p>',
      optionRationales: [
        'Each audience gets the information for the decision they actually make.',
        'The working group does not need 40 pages of activity to pick the next slice.',
        'A slogan gives the executives nothing to fund on and the working group nothing to sequence.',
        'Waiting for them to ask leaves both decisions on the wrong artifact.'
      ],
      keyPoint: 'Send each group the information for the decision they make, not one document for everyone.',
      trap: 'The same pack for every audience usually fits none of the decisions.'
    },
    {
      qid: 'pmp:set-3:108',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Agile',
      stem: 'Two releases shipped the planned scope. Call-backs, the benefit you promised, have not moved. The plan says to run a third release of the same scope next month. The team wants to start it because the plan is approved. What should you do?',
      options: [
        'Start the third release. An approved plan is the authority to continue.',
        'Widen the third release so more of the same scope can create the benefit.',
        'Blame the call-center staff for not producing the benefit.',
        'Pause the third release long enough to learn why call-backs did not move, and only then decide what the next release contains.'
      ],
      answer: 3,
      why: '<p>Two releases of the planned scope did not move call-backs. A third copy is not justified by the approval that produced the first two. The project manager pauses long enough to learn why, then decides the contents. Widening the same scope, or blaming the staff, skips that learning.</p><p><strong>Exam tip:</strong> When the benefit does not move, do not run the next planned release on autopilot. Learn why, then choose the work.</p>',
      optionRationales: [
        'The approval covered a plan that has already failed twice to move the benefit.',
        'More of the same scope is a bigger version of the release that did not work.',
        'Blame does not explain the flat call-backs or choose the next release.',
        'The pause is for the learning, and the next release is chosen after that, not before.'
      ],
      keyPoint: 'Do not start another release of the same scope when the benefit has not moved.',
      trap: 'An approved plan is not a reason to repeat work that already failed to deliver the benefit.'
    },
    {
      qid: 'pmp:set-3:109',
      sub: 'pmp-people',
      ecoTask: 'Align stakeholder expectations',
      approach: 'Hybrid',
      stem: 'Ask any team member what the project is for and they list features. None can say who is better off or what would show it. The backlog is ordered by which feature was requested first. What should you do?',
      options: [
        'Print the feature list and review it weekly until the team can recite it.',
        'Write the outcome in one sentence with the people who receive the benefit, and reorder the backlog from that sentence.',
        'Pick the outcome yourself and leave the recipients out of it.',
        'Freeze the backlog so the missing sentence cannot change the order.'
      ],
      answer: 1,
      why: '<p>A team that can only recite features will build in request order. The project manager writes the outcome with the people who receive it, then reorders from that sentence. Memorizing the list, choosing the outcome alone, or freezing the backlog all leave request order in charge.</p><p><strong>Exam tip:</strong> If the team cannot say who is better off, the backlog is not ordered by value. Build that sentence with the recipients, then reorder.</p>',
      optionRationales: [
        'Reciting features does not say who is better off or how you would know.',
        'The recipients help name the outcome, and the backlog follows that sentence.',
        'An outcome chosen without the recipients is another private list.',
        'A freeze keeps request order, which is the problem.'
      ],
      keyPoint: 'Name who is better off, with those people, and order the work from that.',
      trap: 'A team that can recite features can still be building the wrong project.'
    },
    {
      qid: 'pmp:set-3:110',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Predictive',
      stem: 'The business case promised 200 staff hours saved each month. A sound pilot measured 40. The method was applied as written. The sponsor wants full rollout because the case was already approved. What should you do?',
      options: [
        'Roll out. An approved case outranks a pilot result.',
        'Hide the 40 so the steering pack still shows 200.',
        'Take the measured 40 to the sponsor, show what it does to the case, and decide the rollout on that evidence.',
        'Repeat the pilot until some month produces 200.'
      ],
      answer: 2,
      why: '<p>The case was a forecast. The pilot is evidence, and the method was sound, so 40 is the number to decide on. The project manager shows what that does to the case and lets the sponsor decide. Rolling out on the old 200, hiding the 40, or repeating until the number looks right all discard the measurement.</p><p><strong>Exam tip:</strong> A measured pilot result updates the business case. Do not roll out on the forecast after the evidence contradicts it.</p>',
      optionRationales: [
        'Approval of a forecast does not erase a sound measurement that came in far lower.',
        'Hiding 40 keeps a decision on a number you already know is wrong.',
        'The sponsor sees 40 against the case and decides the rollout from that.',
        'Repeating until you hit 200 is searching for the forecast, not reading the pilot.'
      ],
      keyPoint: 'Decide the rollout on the measured benefit, not on the approved forecast.',
      trap: 'An approved business case is a forecast. It is not stronger than a sound pilot that measured something else.'
    },
    {
      qid: 'pmp:set-3:111',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'On the Harbor compliance program, the control library and the audit evidence are predictive, and the staff reporting channel is adaptive. The external audit is 15 November, and the compliance office must run the controls afterward. The sponsor reads the exhibit and asks you to report the program on track. What should you do?',
      options: [
        'Report it not on track. The missing high-risk tests, the anonymous path, and the unaccepted evidence method are the work to replan.',
        'Report on track. Seventy percent of the evidence files have been started.',
        'Move the audit date in a footnote and leave the status green.',
        'Count the 20 stories as the audit scope so the channel looks complete.'
      ],
      answer: 0,
      chart: {
        type: 'data-table',
        title: 'Harbor compliance program, 1 November',
        columns: ['Stream', 'What the report shows', 'What is still true'],
        rows: [
          ['Control evidence', '70 percent of files started', 'Three high-risk controls have no completed test'],
          ['Staff reporting channel', '20 stories accepted', 'The anonymous path the audit requires is not one of them'],
          ['Audit date', 'Listed as on track for 15 November', 'The liaison has not accepted the evidence method'],
          ['Handover', 'The office is described as ready', 'Office staff have not pulled a sample alone']
        ]
      },
      why: '<p>Started files and accepted stories are not the audit. Three high-risk controls have no test, the anonymous path is missing, and the liaison has not accepted the method. The project manager reports that and replans those items. A green percent, a quiet date change, or relabeling the stories all hide the November gap.</p><p><strong>Exam tip:</strong> On a compliance status, read the column that says what is still true. Started files are not tested controls.</p>',
      optionRationales: [
        'The report names the missing tests, the missing path, and the unaccepted method, and the replan starts there.',
        'Seventy percent started leaves the high-risk tests undone.',
        'A footnote date with a green status does not tell the sponsor what is open.',
        'Twenty stories that are not the anonymous path do not satisfy the audit item.'
      ],
      keyPoint: 'Do not call a compliance program on track because files were started and stories were accepted.',
      trap: 'Percent of files started is the number most likely to paint an untested control library green.'
    },
    {
      qid: 'pmp:set-3:112',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage risk',
      approach: 'Predictive',
      stem: 'On the Harbor compliance program, a control owner says a required access review is already how the team works, and asks you to mark the control ready. They cannot show a completed review. The auditor will sample that control. What should you do?',
      options: [
        'Mark it ready. The owner knows the daily work.',
        'Write a review dated last month so the file matches the claim.',
        'Drop the control from the library so there is nothing to sample.',
        'Keep the control open, tell the owner the audit will sample evidence, and complete a real review before you mark it ready.'
      ],
      answer: 3,
      why: '<p>The auditor will ask for a completed review, not for the owner confidence. With no review to show, the control is not ready, and the gap is a real threat to the audit. The project manager keeps it open and completes a real review. A backdated file or a dropped control manufactures the result.</p><p><strong>Exam tip:</strong> We already do it is not evidence. If the audit will sample the control, finish a real review before you mark it ready.</p>',
      optionRationales: [
        'Daily habit is not the completed review the sample will ask for.',
        'A review written after the fact and dated last month is false evidence.',
        'Dropping a required control to avoid a sample hides the obligation.',
        'The control stays open until a real review exists, and the owner hears why.'
      ],
      keyPoint: 'Do not mark a control ready on an owner claim when the audit will sample evidence you do not have.',
      trap: 'Already how we work is the sentence that leaves a sampled control with an empty file.'
    },
    {
      qid: 'pmp:set-3:113',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Hybrid',
      stem: 'On the Harbor compliance program, the audit liaison wants a weekly note that everything is fine. Control owners want no meetings until 15 November. Three high-risk controls still have no test. What should you do?',
      options: [
        'Send the comfort note. The liaison can delay the audit if they are unhappy.',
        'Hold a short weekly working session with the owners on the untested controls, and send the liaison the real status. Do not substitute comfort for the tests.',
        'Cancel contact with both groups until the evidence is perfect.',
        'Let each owner decide alone whether their control is in the audit scope.'
      ],
      answer: 1,
      why: '<p>The liaison needs the truth, and the owners need a working session while the tests can still be finished. A comfort note, silence, or private scope decisions leave the three controls untested. The project manager uses the week to do the tests and tells the liaison what is actually open.</p><p><strong>Exam tip:</strong> Do not send a comfort note to an audit liaison while high-risk controls have no test. Engage the owners on the gap.</p>',
      optionRationales: [
        'A fine note that hides three untested controls is how the audit becomes a surprise.',
        'The owners work the untested controls weekly, and the liaison gets the real status.',
        'No contact until perfection means November arrives with the same three gaps.',
        'Audit scope is not each owner private choice. The untested controls are already in it.'
      ],
      keyPoint: 'Use the weeks before the audit to test the open controls, and tell the liaison the truth.',
      trap: 'A weekly everything-is-fine note feels like engagement and hides the controls that need the meeting.'
    },
    {
      qid: 'pmp:set-3:114',
      sub: 'pmp-process',
      ecoTask: 'Manage and control changes',
      approach: 'Predictive',
      stem: 'On the Harbor compliance program, the auditor published a checklist that adds a mandatory field the signed control baseline does not include. The field changes the evidence due before 15 November. A teammate wants to add it quietly so the checklist is satisfied. What should you do?',
      options: [
        'Add it quietly. A mandatory audit field does not need the change path.',
        'Refuse the field. The baseline was signed, so the auditor must accept the old list.',
        'Run the field through change control, show the effect on the 15 November evidence, and do not ignore a mandatory audit item.',
        'Delay the entire audit a year so the field can be debated with no deadline.'
      ],
      answer: 2,
      why: '<p>A mandatory audit field is a real change to the baseline, and it hits the evidence date. Quietly adding it skips the impact. Refusing it because the baseline was signed ignores the audit. The project manager puts it through change control and shows what it does to 15 November, without pretending the field is optional.</p><p><strong>Exam tip:</strong> A new mandatory audit item is a change. Run it through control and show the date impact. Do not absorb it in silence, and do not ignore it.</p>',
      optionRationales: [
        'A quiet add hides the effect on the evidence that is due before the audit.',
        'A signed baseline does not let you skip a field the auditor has made mandatory.',
        'The change path records the field and the effect on the November evidence.',
        'Moving the audit a year is a much larger decision than assessing one field.'
      ],
      keyPoint: 'Put a new mandatory audit field through change control and show the evidence impact.',
      trap: 'Adding it quietly satisfies the checklist and surprises the date.'
    },
    {
      qid: 'pmp:set-3:115',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Hybrid',
      stem: 'On the Harbor compliance program, this year samples for two controls are thin. A teammate offers to copy last year accepted samples into this year folder so the count looks complete. The audit asks for current-period evidence. What should you do?',
      options: [
        'Do not copy them. Tell the liaison the two samples are thin, and collect current-period evidence before those controls are called ready.',
        'Copy the samples. Accepted once means accepted this year.',
        'Rename last year files with this year dates.',
        'Remove the two controls from the library the night before the audit.'
      ],
      answer: 0,
      why: '<p>The audit asked for this period. Last year samples, renamed or not, are not current evidence. The project manager says the two samples are thin and collects real ones before those controls are called ready. Removing the controls the night before hides the same gap.</p><p><strong>Exam tip:</strong> Do not fill a current-period sample with last year evidence. Report the thin file and collect the period the audit asked for.</p>',
      optionRationales: [
        'The liaison hears the gap, and current-period evidence is collected before the controls are called ready.',
        'Last year acceptance does not satisfy a current-period sample.',
        'New dates on old files are false evidence.',
        'Dropping the controls overnight removes them from the file, not from the audit.'
      ],
      keyPoint: 'Current-period evidence has to be from this period. Do not backfill it from last year.',
      trap: 'A complete-looking folder of last year samples fails the moment the auditor checks the dates.'
    },
    {
      qid: 'pmp:set-3:116',
      sub: 'pmp-process',
      ecoTask: 'Manage project closure',
      approach: 'Predictive',
      stem: 'On the Harbor compliance program, the audit is in 10 days and several evidence files are still open. A sponsor wants the project closed this week so the team can start a new program, and says the compliance office can tidy the files later. The office has not accepted the controls. What should you do?',
      options: [
        'Close it. The new program is more valuable than open files.',
        'Do not close. Finish or formally replan the open evidence, and do not hand the office a library it has not accepted.',
        'Move the open files onto the new program budget and close this one at zero.',
        'Mark the open files accepted so the close checklist passes.'
      ],
      answer: 1,
      why: '<p>Closing now would say the library is done and accepted. The files are open, and the office has not accepted the controls. The project manager finishes them or replans them in the open. Moving the cost, or marking the files accepted, creates a false close so the next program can start.</p><p><strong>Exam tip:</strong> Do not close a compliance project so the team can start the next one. Open evidence and a missing acceptance are still this project.</p>',
      optionRationales: [
        'The next program does not finish this audit file or create an acceptance you do not have.',
        'The open evidence stays visible, and the office does not inherit a library it has not accepted.',
        'Moving the cost closes the account without closing the work.',
        'A mark on an open file is not the office acceptance.'
      ],
      keyPoint: 'Do not close while evidence is open and the office has not accepted the controls.',
      trap: 'A new program waiting is not a reason to declare this one finished.'
    },
    {
      qid: 'pmp:set-3:117',
      sub: 'pmp-people',
      ecoTask: 'Help ensure knowledge transfer',
      approach: 'Predictive',
      stem: 'On the Harbor compliance program, contractors pull every audit sample. Compliance office staff have never pulled one, or explained the control, without a contractor on the call. The contractors roll off on 16 November, the day after the audit. What should you do?',
      options: [
        'Let the contractors pull the audit samples. Teaching can wait until they have left.',
        'Extend every contractor with no end date.',
        'Skip the practice because the audit itself will teach the office.',
        'Have office staff pull a sample and explain the control, from instructions they keep, before the contractors roll off.'
      ],
      answer: 3,
      why: '<p>The day after the audit, the office is alone. If they have never pulled a sample, the library transfers on paper only. The project manager has them do it, and explain the control, before the contractors leave. An open-ended extension or hoping the audit will teach them leaves the same gap.</p><p><strong>Exam tip:</strong> Before the people who know the control roll off, prove the office can pull a sample and explain it.</p>',
      optionRationales: [
        'Waiting until the contractors have left is waiting until nobody can show the office how.',
        'An extension with no end never completes the transfer.',
        'The audit is not a training class, and a failed sample during it is a finding.',
        'Office staff complete a real sample and an explanation while the contractors are still there to correct it.'
      ],
      keyPoint: 'Prove the office can pull a sample before the contractors roll off the day after the audit.',
      trap: 'Contractors who pull every sample are not a handover. They are the only people who can do it.'
    },
    {
      qid: 'pmp:set-3:118',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Agile',
      stem: 'On the Harbor compliance program, the reporting-channel backlog has four prompt-wording stories at the top. The anonymous path the audit requires is still open. The product owner wants one more prompt story because it is small and the board would look busier. What should you do?',
      options: [
        'Take the prompt story. Small work keeps the board moving.',
        'Close the anonymous path as a known limit and ship the prompts.',
        'Do not take the prompt. Put the anonymous path next, because that is the audit outcome the channel exists to deliver.',
        'Cancel the reporting channel so the prompts cannot distract the team.'
      ],
      answer: 2,
      why: '<p>The channel exists so staff can report without being identified, and that path is still open. Another prompt makes the board look busy and does not meet the audit. The project manager puts the anonymous path next. Closing it as a known limit, or cancelling the channel, either ships the wrong thing or drops the outcome.</p><p><strong>Exam tip:</strong> On a compliance backlog, the audit outcome outranks a small story that makes the board look full.</p>',
      optionRationales: [
        'A busy board of prompts leaves the anonymous path, the actual outcome, still open.',
        'Calling the required path a known limit ships a channel the audit did not ask for.',
        'The anonymous path is next, and the extra prompt waits.',
        'Cancelling the channel drops the audit outcome instead of building it.'
      ],
      keyPoint: 'Build the anonymous path before another prompt. That path is the outcome.',
      trap: 'A small story that makes the board look busy can crowd out the one path the audit requires.'
    },
    {
      qid: 'pmp:set-3:119',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Agile',
      stem: 'On the Harbor compliance program, the reporting channel is technically live. Staff still send complaints to the old mailbox. Several say the new channel looks like it reports them to their own manager. Only 3 of 25 offices have tried it. A lead says it is adopted because the software is on. What should you do?',
      options: [
        'Call it adopted. A live channel is the change.',
        'Do not call it adopted. Make clear who sees a report, and have staff practice the channel, before you treat the old mailbox as retired.',
        'Shut the old mailbox off tonight so staff have no other choice.',
        'Hide the manager concern from the sponsor so the channel stays green.'
      ],
      answer: 1,
      why: '<p>Staff are not using the channel because they think it exposes them to their manager. A live switch does not answer that. The project manager makes the audience of a report clear and has staff practice before anyone calls the mailbox retired. Cutting the mailbox overnight, or hiding the fear, forces or conceals the change.</p><p><strong>Exam tip:</strong> Adoption is people using the new path. If they fear who sees a report, fix that before you call the channel adopted.</p>',
      optionRationales: [
        'Software that is on, and that 22 offices will not touch, is not adopted.',
        'Who sees a report is made clear, and staff practice, before the old mailbox is treated as gone.',
        'Shutting the mailbox tonight does not answer the fear. It only removes the path they trust.',
        'Hiding the concern keeps the sponsor green and the staff on the old mailbox.'
      ],
      keyPoint: 'Do not call a reporting channel adopted while staff still fear who sees the report.',
      trap: 'Technically live is not adopted when the old mailbox is still how complaints arrive.'
    },
    {
      qid: 'pmp:set-3:120',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Hybrid',
      stem: 'On the Harbor compliance program, a likely finding is already visible in the evidence. A director wants the entrance meeting to open with a prepared statement that there are no findings, so the auditor starts friendly. What should you do?',
      options: [
        'Do not use that statement. Take the likely finding and the response you have into the entrance. Do not script a result you do not have.',
        'Open with the no-finding statement. Tone matters more than the file.',
        'Ask the team to rewrite the evidence so it matches the statement.',
        'Cancel the entrance and send the no-finding statement by email instead.'
      ],
      answer: 0,
      why: '<p>The file already shows a likely finding. Opening with the opposite is a false statement, and rewriting the evidence to match it is worse. The project manager takes the finding and the response into the entrance. Cancelling the meeting to send the same claim by email only changes the channel.</p><p><strong>Exam tip:</strong> Do not script a clean audit result you do not have. Walk in with the likely finding and the response.</p>',
      optionRationales: [
        'The entrance gets the likely finding and the response, not a statement the file contradicts.',
        'A friendly opening that denies the file is a false report to the auditor.',
        'Rewriting evidence to fit a slogan falsifies the audit package.',
        'Email does not make a no-finding claim true.'
      ],
      keyPoint: 'Lead with the likely finding and the response. Do not open the audit with a claim the evidence contradicts.',
      trap: 'A friendly opening is not worth a statement you already know is false.'
    },
    {
      qid: 'pmp:set-3:121',
      sub: 'pmp-people',
      ecoTask: 'Manage conflict',
      approach: 'Hybrid',
      stem: 'In a customer status meeting, two delivery leads argue about who missed a handoff. The customer has not heard a next step. Both leads ask you to say which of them is right before the call continues. What should you do?',
      options: [
        'Pick the lead who speaks for your department.',
        'Let them finish the argument so the customer sees that you allow honesty.',
        'Stop the argument, take the handoff facts out of the customer meeting, agree the next step, and return one update to the customer.',
        'End the customer relationship so the argument has no audience.'
      ],
      answer: 2,
      why: '<p>The customer needs a next step, not a verdict. The project manager stops the public argument, settles the facts and the next step off the call, and comes back with one update. Picking a winner, performing the argument, or ending the relationship all serve the dispute instead of the customer.</p><p><strong>Exam tip:</strong> Do not adjudicate a handoff in front of the customer. Park it, agree the next step, and give the customer one message.</p>',
      optionRationales: [
        'Choosing your own lead decides the fight before the facts are settled, and the customer still has no next step.',
        'Honesty does not require the customer to watch an unresolved argument.',
        'The argument leaves the call, the next step is agreed, and the customer hears one update.',
        'Ending the relationship is larger than a missed handoff and still produces no next step.'
      ],
      keyPoint: 'Get the customer a next step. Settle who missed the handoff off the call.',
      trap: 'Picking a winner in the meeting feels decisive and leaves the customer with a feud instead of a plan.'
    },
    {
      qid: 'pmp:set-3:122',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Predictive',
      stem: 'Your installation date depends on a network cutover owned by another project. That project moved the cutover by three weeks. Your schedule still shows the old cutover, and your crew is booked to it. What should you do?',
      options: [
        'Keep the crew booked. The other project may move the date back.',
        'Replan the installation from the new cutover date, and tell your sponsor the effect. Do not keep the old dependency.',
        'Crash your installation by three weeks so the slip is absorbed with no conversation.',
        'Remove the dependency from the schedule so your date stands alone.'
      ],
      answer: 1,
      why: '<p>The cutover your crew is booked to is no longer the cutover. The project manager replans from the new date and tells the sponsor the effect. Hoping it moves back, crashing with no look, or deleting the dependency all leave the schedule describing a date that is gone.</p><p><strong>Exam tip:</strong> When a predecessor date moves, update the schedule that depends on it. Do not keep a crew booked to a date you know is wrong.</p>',
      optionRationales: [
        'A hope that the other project reverses itself is not a booking plan.',
        'Installation moves with the new cutover, and the sponsor hears the effect.',
        'Crashing by the whole slip assumes your work can donate three weeks. That is not yet known.',
        'Deleting the dependency makes the schedule look independent of a cutover it still needs.'
      ],
      keyPoint: 'Replan from the new predecessor date. Do not keep the old dependency on the schedule.',
      trap: 'Leaving the crew booked to the old cutover pretends the other project did not move.'
    },
    {
      qid: 'pmp:set-3:123',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage resources',
      approach: 'Agile',
      stem: 'A shared designer is assigned at half time to your sprint. The board shows three of their stories in progress, and none has moved in five days. They have been in another release war room all week. A manager says to leave the stories in progress so the board shows the commitment. What should you do?',
      options: [
        'Replan those stories to capacity you actually have this sprint, and do not leave them in progress as a fiction.',
        'Leave them in progress. The assignment is still half time on paper.',
        'Split each story so the unmoved half looks done.',
        'Mark the designer full time so the math matches the board.'
      ],
      answer: 0,
      why: '<p>The designer is not in this sprint, whatever the assignment says. Stories sitting in progress for five days are not a commitment. The project manager replans to the capacity that is actually here. A paper half time, a cosmetic split, or a fake full-time mark all keep the board dishonest.</p><p><strong>Exam tip:</strong> In progress is not a parking lot for a person who is in another room. Replan to the capacity you have.</p>',
      optionRationales: [
        'The stories move to capacity that exists this sprint, and the board stops pretending the designer is here.',
        'A paper half time does not move a story that has sat for five days.',
        'Splitting an unmoved story to look done reports progress that did not happen.',
        'Changing the assignment percent does not pull the designer out of the other war room.'
      ],
      keyPoint: 'Replan to the designer time you actually have. Do not leave dead stories in progress.',
      trap: 'A board that shows commitment can be three stories nobody is touching.'
    },
    {
      qid: 'pmp:set-3:124',
      sub: 'pmp-business',
      ecoTask: 'Define and establish project governance',
      approach: 'Predictive',
      stem: 'You learn the team skipped a required design approval while the approver was on leave. The design is already built. The approver returns tomorrow. A lead wants the skip left out of the record because the work looks correct. What should you do?',
      options: [
        'Leave it out. A correct-looking build does not need the approval it skipped.',
        'Ask the team to obtain a signature and not mention that the build came first.',
        'Replace the approver with someone in the office today and backdate the signature.',
        'Disclose the skipped approval, stop any further bypass, and get the real decision before more work treats that design as approved.'
      ],
      answer: 3,
      why: '<p>The approval was required, and leave did not remove it. A finished build does not make the skip disappear. The project manager discloses it, stops any repeat, and gets the actual decision before the design is treated as approved. A quiet signature or a backdated substitute hides the bypass.</p><p><strong>Exam tip:</strong> A skipped approval is disclosed even when the work already looks correct. Do not bury it because the build is done.</p>',
      optionRationales: [
        'Looking correct is not the approval the governance required.',
        'A signature that hides the sequence is a false record of when the decision happened.',
        'A substitute and a backdated signature invent an approval that did not occur.',
        'The skip is disclosed, the bypass stops, and the returning approver makes the real decision.'
      ],
      keyPoint: 'Disclose a skipped approval and get the real decision. A finished build does not erase the miss.',
      trap: 'It looks correct is how a governance bypass stays out of the record.'
    },
    {
      qid: 'pmp:set-3:125',
      sub: 'pmp-process',
      ecoTask: 'Plan and optimize quality',
      approach: 'Hybrid',
      stem: 'A defect is found in a story the product owner accepted last sprint. The owner says acceptance is final, so the defect should become a lesson and not a reopened story. Customers can hit the defect in the current release. What should you do?',
      options: [
        'Leave it closed. Acceptance is a permanent decision.',
        'Reopen the work and fix the defect. Acceptance does not keep a known defect in the release.',
        'Add a lesson and ship the next release with the defect still in it.',
        'Change the acceptance notes so the defect is described as intended behavior.'
      ],
      answer: 1,
      why: '<p>Acceptance meant the story met the bar at the time. A defect customers can hit now is still a defect. The project manager reopens it and fixes it. A lesson that leaves it in the release, or a note that calls it intended, records the miss and keeps the harm.</p><p><strong>Exam tip:</strong> Acceptance is not a lock. If customers can hit a defect in accepted work, reopen it and fix it.</p>',
      optionRationales: [
        'A past acceptance does not protect customers from a defect you now know about.',
        'The story is reopened and the defect is fixed in the release customers are using.',
        'A lesson without a fix leaves the defect in the product.',
        'Relabeling the defect as intended behavior falsifies the acceptance.'
      ],
      keyPoint: 'Reopen accepted work when a real defect is found. Do not demote it to a lesson.',
      trap: 'Acceptance is final is how a known customer-facing defect stays in the release.'
    },
    {
      qid: 'pmp:set-3:126',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'The indexes in the exhibit are ahead of plan. A director says to use the spare capacity to add a report the customer mentioned once, and to worry about handover after go-live. What should you do?',
      options: [
        'Add the report. Favorable indexes mean there is room for new scope.',
        'Hold the dry run after go-live so the indexes stay ahead.',
        'Keep the spare capacity on the handover. Staff the receiving roles and run the dry run before go-live. Do not spend the gain on a new report.',
        'Rebaseline the indexes back to 1 so the project no longer looks ahead.'
      ],
      answer: 2,
      chart: {
        type: 'data-table',
        title: 'Handover week',
        columns: ['Signal', 'Figure'],
        rows: [
          ['Cost performance index', '1.10'],
          ['Schedule performance index', '1.05'],
          ['Receiving team staffed for handover', '1 of 6 roles'],
          ['Handover dry run', 'Not held']
        ]
      },
      why: '<p>The indexes are ahead, and the handover is not. One of six receiving roles is staffed, and the dry run has not happened. Spare capacity belongs there, before go-live. A new report, a dry run after go-live, or a rebaselined index all spend or hide the gain while the receiving team is not ready.</p><p><strong>Exam tip:</strong> A favorable index is not spare scope. Read the handover rows before you add work.</p>',
      optionRationales: [
        'Room in the index is not an approval to add a report the handover still needs that capacity for.',
        'A dry run after go-live is a lesson from a failed handover, not preparation.',
        'The open roles are staffed and the dry run happens before go-live. The new report waits.',
        'Pulling the indexes back to 1 erases a signal and does not staff the receiving team.'
      ],
      keyPoint: 'Spend a schedule gain on the unstaffed handover, not on a new report.',
      trap: 'Being ahead on the indexes is the moment teams add scope and skip the handover.'
    },
    {
      qid: 'pmp:set-3:127',
      sub: 'pmp-business',
      ecoTask: 'Evaluate and address external business environment changes',
      approach: 'Hybrid',
      stem: 'A customer platform you integrate with will be retired in four months. Your plan uses it for a year. The retirement note arrived yesterday. A lead says to wait until retirement week so you do not disturb a plan that is already approved. What should you do?',
      options: [
        'Assess the integration now, tell the sponsor what the four-month date does to the plan, and choose a response before more work assumes a year.',
        'Wait until retirement week. An approved plan should not move for a customer note.',
        'Cut the integration this week with no look at what else depends on it.',
        'Ask the customer to delay the retirement because your plan says one year.'
      ],
      answer: 0,
      why: '<p>The external date and the plan now disagree, and four months is soon enough to change what you build. The project manager assesses the integration, tells the sponsor, and picks a response. Waiting for retirement week, cutting blindly, or demanding the customer keep a platform for your plan all skip that assessment.</p><p><strong>Exam tip:</strong> An external retirement dated inside your plan is assessed now. Do not wait until the week it happens.</p>',
      optionRationales: [
        'The sponsor hears the effect, and the response is chosen while the plan can still change.',
        'Retirement week is when the integration is already broken, not when you start thinking.',
        'Cutting with no dependency look can break work that still needs a path.',
        'Your one-year assumption does not obligate the customer to keep the platform.'
      ],
      keyPoint: 'Replan an integration when the platform retirement date moves inside your plan.',
      trap: 'An approved plan does not outlast a customer platform that will be gone in four months.'
    },
    {
      qid: 'pmp:set-3:128',
      sub: 'pmp-people',
      ecoTask: 'Plan and manage communication',
      approach: 'Agile',
      stem: 'A squad two time zones west has twice built the wrong slice. They start work while your standup chat is still from their night, and the decision that changed the slice was made after they logged off. They do not read the chat history. What should you do?',
      options: [
        'Keep the decision in the standup chat. They should scroll back.',
        'Move their hours to match yours so the chat is live for everyone.',
        'Send a longer transcript at the end of your day and assume they will read it.',
        'Put the decision where they look at the start of their day, and confirm they can restate it before they build.'
      ],
      answer: 3,
      why: '<p>The squad is building from a chat that was already stale when their day started. The project manager puts the decision where they look first and checks they can restate it. Telling them to scroll, moving their lives, or sending a longer transcript they may also skip all leave the same miss in place.</p><p><strong>Exam tip:</strong> A decision made after another time zone logs off has to be waiting where that squad starts. Do not leave it in a chat they will not reread.</p>',
      optionRationales: [
        'They have already shown they do not scroll. The wrong slice is the evidence.',
        'Moving their hours may be unwanted and is larger than fixing where the decision sits.',
        'A longer transcript is more of the channel they are not reading.',
        'The decision is in their start-of-day place, and a restatement proves they have it before they build.'
      ],
      keyPoint: 'Leave the decision where the other time zone looks at the start of their day, and confirm it.',
      trap: 'A standup chat is not a decision record for a squad that was offline when you typed it.'
    },
    {
      qid: 'pmp:set-3:129',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage procurement',
      approach: 'Predictive',
      stem: 'The contract names a specific specialist as key personnel for the acceptance tests. The seller wants to substitute a colleague you have not worked with, starting Monday. The seller says the colleague is equivalent and the change is routine. What should you do?',
      options: [
        'Accept the colleague. Equivalent is enough when the seller says so.',
        'Check the key-personnel clause, assess whether the colleague can do the acceptance work, and approve a substitution only if the contract allows it.',
        'Refuse every substitution for the life of the contract with no review of the clause.',
        'Let the colleague start Monday and amend the contract after the tests.'
      ],
      answer: 1,
      why: '<p>Key personnel were named because the person matters to acceptance. A seller label of equivalent does not replace the clause or an assessment. The project manager checks what the contract allows and whether this colleague can do the tests, and only then approves. A blanket refusal, or starting Monday and amending later, either ignores a possible yes or lets the substitution happen first.</p><p><strong>Exam tip:</strong> A named specialist is not swapped on a seller email. Read the clause and assess the substitute before you approve.</p>',
      optionRationales: [
        'The seller word equivalent is not the contract and not your assessment.',
        'The clause and the colleague skill are both checked before any approval.',
        'A lifetime ban with no reading of the clause may refuse a substitution the contract allows.',
        'Starting Monday makes the substitution real before the contract says it is allowed.'
      ],
      keyPoint: 'Do not accept a key-personnel substitute until the contract and the skill have both been checked.',
      trap: 'Routine and equivalent are the two words sellers use to skip a key-personnel clause.'
    },
    {
      qid: 'pmp:set-3:130',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage risk',
      approach: 'Hybrid',
      stem: 'A partner will pay a rebate if you finish two weeks early. The only way to gain those two weeks is to drop the final integration test. That test is what shows the release meets the outcome. The sponsor asks you to take the rebate. What should you do?',
      options: [
        'Take the rebate. A gain should not be refused.',
        'Drop the test and record the rebate as contingency.',
        'Weigh the rebate against the test you would drop, and do not cut that test to chase the payment.',
        'Hide the rebate so the team is not distracted, and cut the test anyway.'
      ],
      answer: 2,
      why: '<p>The rebate is an opportunity, and the cost of taking it is the test that proves the outcome. The project manager weighs those and does not drop the test to collect the payment. Treating every gain as mandatory, parking it in contingency, or hiding it while still cutting the test all skip the tradeoff.</p><p><strong>Exam tip:</strong> An opportunity is assessed against what you give up. Do not cut the test that proves the outcome in order to earn a rebate.</p>',
      optionRationales: [
        'A payment is not automatically worth the test that shows the release works.',
        'Calling the rebate contingency does not replace the integration test you dropped.',
        'The rebate is weighed against the test, and the test stays because it protects the outcome.',
        'Hiding the rebate and cutting the test is the same bad trade with no decision on the record.'
      ],
      keyPoint: 'Do not drop the outcome test to collect an early-finish rebate.',
      trap: 'A rebate feels like found money and is expensive if the test you cut was the proof.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 3;
    q.batch = index < 10 ? 11 : index < 20 ? 12 : 13;
    q.original = true;
    q.sourceDocument = 'Original UpSkill Sprint item. July 2026 PMP Exam Content Outline and PMBOK Guide 8th Edition used as references only. Not a PMI item.';
    if (q.qid !== 'pmp:set-3:' + String(index + 101).padStart(3, '0')) {
      throw new Error('PMP Set 3 id sequence broken at ' + q.qid);
    }
  });

  global.PMP_SET3 = questions;

  global.registerPMPSet3 = function (exam) {
    if (!exam) return;
    var existing = exam.sets || {};
    var first = existing[1] || exam.bank || [];
    var second = existing[2] || [];
    exam.sets = Object.assign({}, existing, {1: first, 2: second, 3: questions});
    if (!exam.bank || !exam.bank.length) exam.bank = first.length ? first : questions;
    exam.setPlans = Object.assign({}, exam.setPlans, {
      3: {target: 30, label: 'Q101-Q130'}
    });
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {3: 30});
    exam.setName = 'Set 1: Q001-Q080 · Set 2: Q081-Q100 · Set 3: Q101-Q130';
  };
})(typeof window !== 'undefined' ? window : globalThis);
