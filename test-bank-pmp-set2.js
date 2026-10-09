/*
 * PMI PMP Exam Set 2 — original practice questions.
 * Q081-Q100. Written to the July 2026 Exam Content Outline
 * (People, Process, Business Environment) and the PMBOK Guide 8th Edition
 * performance domains. No PMI item, handbook passage, or figure is copied.
 * UpSkill Sprint is not affiliated with the Project Management Institute.
 */
(function (global) {
  'use strict';

  var questions = [
    {
      qid: 'pmp:set-2:081',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'The sponsor points at the cost and schedule indexes in the exhibit and asks you to report the project healthy. What should you do?',
      options: [
        'Report it healthy. A cost index above 1 means the project is in control.',
        'Hide the overdue issues until the indexes fall, so the report stays consistent.',
        'Report the indexes and also the three unowned high risks and the two overdue issues. Do not call the project healthy on the indexes alone.',
        'Rebaseline the indexes so the risks no longer look out of place.'
      ],
      answer: 2,
      chart: {
        type: 'data-table',
        title: 'Status snapshot',
        columns: ['Signal', 'Figure', 'What it means'],
        rows: [
          ['Cost performance index', '1.04', 'Work performed cost less than it earned'],
          ['Schedule performance index', '0.95', 'Slightly behind the planned value'],
          ['High risks', '3 open', 'None has a named response owner'],
          ['Issues', '2 overdue', 'Still open, and no new date is set']
        ]
      },
      why: '<p>The cost index is favorable and the schedule index is only slightly behind. That is not the whole snapshot. Three high risks have no owner, and two issues are already late. The report has to say both. Calling it healthy, hiding the issues, or rebasing the indexes all use the favorable number to cover a register that is not being managed.</p><p><strong>Exam tip:</strong> Read every row of the exhibit. A healthy index does not cancel unowned risks or overdue issues.</p>',
      optionRationales: [
        'A cost index above 1 does not assign owners to the three high risks or close the overdue issues.',
        'Waiting for the indexes to worsen hides problems the sponsor needs now.',
        'The indexes are reported, and so are the unowned risks and the overdue issues.',
        'Rebaselining to make the picture match a wish erases the signal instead of acting on it.'
      ],
      keyPoint: 'Performance indexes and the register are one status. Do not report health from the indexes alone.',
      trap: 'A cost index above 1 is the number most likely to hide a dead risk register.'
    },
    {
      qid: 'pmp:set-2:082',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage risk',
      approach: 'Predictive',
      stem: 'A component risk was accepted because a delay would cost one day. The only supplier has since consolidated, and the same delay would now stop a milestone. The register still says accept. The next risk review is in three weeks. What should you do?',
      options: [
        'Leave accept in place. The review will catch it in three weeks.',
        'Reassess the risk now, and choose a response that fits the new impact. Do not keep accept just because it was right before.',
        'Cancel the supplier today so the accepted risk is gone.',
        'Delete the risk. A changed impact means the old entry should disappear.'
      ],
      answer: 1,
      why: '<p>Accept was a response to a one-day impact. The impact is now a missed milestone, so the old response is stale. The project manager reassesses now and picks a response that fits. Waiting three weeks, cancelling the supplier with no analysis, or deleting the entry all skip that reassessment.</p><p><strong>Exam tip:</strong> When the impact of a risk changes, reopen the response. An old accept does not stay valid by default.</p>',
      optionRationales: [
        'Three weeks is a long time to keep a response that no longer matches the impact.',
        'The new impact is assessed now, and accept is kept only if it still fits.',
        'Cancelling the only supplier is a response chosen before the reassessment.',
        'Deleting the entry removes the risk from view at the moment it got worse.'
      ],
      keyPoint: 'A risk response expires when the impact changes. Reassess before the next routine review.',
      trap: 'Accept is not a permanent setting. It was a decision about the old impact.'
    },
    {
      qid: 'pmp:set-2:083',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Agile',
      stem: 'A blocker the sprint goal depends on has been open for 11 days. Velocity for the last three sprints is steady. The team says the blocker can wait because the velocity chart looks fine. What should you do?',
      options: [
        'Wait. Steady velocity means the blocker is not hurting delivery.',
        'Extend the sprint so the velocity chart and the blocker can finish together.',
        'Treat the 11-day blocker as the status that matters, name an owner, and do not let a steady velocity chart hide it.',
        'Drop the sprint goal so the velocity chart stays steady without the blocker.'
      ],
      answer: 2,
      why: '<p>Velocity can stay steady while the goal sits behind one old blocker. Eleven days is the signal. The project manager makes that blocker the status item and gets it an owner. Waiting, stretching the sprint, or dropping the goal all protect the chart instead of the goal.</p><p><strong>Exam tip:</strong> Do not read a smooth velocity chart over an aging blocker the goal still needs.</p>',
      optionRationales: [
        'Steady velocity does not move a blocker the goal depends on.',
        'Extending the sprint hides the blocker inside a longer timebox.',
        'The blocker is owned and visible, and the velocity chart is not used as a reason to wait.',
        'Dropping the goal makes the chart look calm by abandoning the outcome.'
      ],
      keyPoint: 'An aging blocker on the goal outranks a velocity chart that still looks steady.',
      trap: 'Velocity can look fine while the one thing the goal needs has been stuck for days.'
    },
    {
      qid: 'pmp:set-2:084',
      sub: 'pmp-people',
      ecoTask: 'Plan and manage communication',
      approach: 'Hybrid',
      stem: 'The early warning for a cold-room failure is a temperature trend. That trend is on a steering slide the night crew does not see. The night crew is who would act in the first hour. They watch the room log, not the slide. A lead wants another steering chart so the warning looks official. What should you do?',
      options: [
        'Put the temperature trigger on the room log the night crew already uses, and confirm they know the point at which they act.',
        'Add the chart to steering. A second slide is a stronger warning.',
        'Tell the night crew they should have read the steering pack.',
        'Wait for a failure before you change the log, so you do not alarm the crew.'
      ],
      answer: 0,
      why: '<p>The warning is in a room the people who must act do not enter. Another steering slide repeats that miss. The project manager puts the trigger on the room log and checks that the night crew knows when to act. Blame, or waiting for the failure, leaves the first hour uncovered.</p><p><strong>Exam tip:</strong> A risk trigger belongs where the people who respond already look. Do not add it only to a forum they do not attend.</p>',
      optionRationales: [
        'The log they use carries the trigger, and they can say the point at which they act.',
        'Steering already has the trend. The night crew still cannot see it.',
        'The crew was never the audience of that pack. Blame does not move the trigger.',
        'Waiting for the failure turns the early warning into an incident report.'
      ],
      keyPoint: 'Put the trigger in the channel the responding crew already uses.',
      trap: 'An official steering chart is not a warning if the night crew never sees it.'
    },
    {
      qid: 'pmp:set-2:085',
      sub: 'pmp-business',
      ecoTask: 'Remove impediments and manage issues',
      approach: 'Agile',
      stem: 'The only test environment is down now, and the sprint goal needs it today. A teammate wants it written only as a risk and discussed at the monthly risk review. What should you do?',
      options: [
        'Log it only as a risk. If it might happen again, it is not an issue yet.',
        'Wait for the monthly review so the environment and the other risks are handled together.',
        'Treat the outage as an issue now, get it restored, and add a separate risk only for the chance it happens again.',
        'Mark the sprint goal done and note the environment as a known limit.'
      ],
      answer: 2,
      why: '<p>The environment is down now. That is an issue, not a risk. The goal needs it today, so the monthly risk review is the wrong clock. The project manager drives the restoration and, separately, can record the chance of a repeat. Logging it only as a risk, or calling the goal done, leaves today blocked.</p><p><strong>Exam tip:</strong> If it has already happened and it is hurting the goal, it is an issue. Do not park a live outage on the risk register.</p>',
      optionRationales: [
        'A future repeat may be a risk. The outage that is happening now is an issue.',
        'A monthly review does not restore an environment the goal needs today.',
        'Restoration is handled as an issue, and a repeat is the only part that belongs on the risk register.',
        'The goal is not done while the environment it needs is down.'
      ],
      keyPoint: 'A down environment is an issue today. A possible repeat is the risk.',
      trap: 'Calling a current outage a risk is how it waits for a meeting that cannot help today.'
    },
    {
      qid: 'pmp:set-2:086',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Predictive',
      stem: 'One identified risk may delay a single equipment delivery. A scheduler wants to add two days of padding to every remaining activity so the risk is covered no matter where it lands. What should you do?',
      options: [
        'Add the two days to every activity. Even padding is the fairest contingency.',
        'Put contingency on the delivery the risk can actually hit, and do not pad activities the risk cannot touch.',
        'Ignore the risk. Padding would make the finish date look worse.',
        'Rebaseline the whole project by two days so no single activity carries the risk.'
      ],
      answer: 1,
      why: '<p>The risk hits one delivery, not every activity. Padding everything hides contingency in the wrong places and makes the schedule dishonest. The project manager puts the time where the delivery can slip and leaves the other activities alone. Ignoring the risk, or rebasing the whole project, either drops the response or spreads it where it does not belong.</p><p><strong>Exam tip:</strong> Place contingency on the work the risk can hit. Do not smear padding across the schedule.</p>',
      optionRationales: [
        'Even padding spends float on work the equipment risk cannot delay.',
        'The delivery that can slip carries the contingency. The rest of the schedule stays clean.',
        'Hiding the risk to protect the finish date leaves the delivery unprotected.',
        'Moving the whole baseline spreads one delivery risk across work that was not threatened.'
      ],
      keyPoint: 'Contingency belongs on the activity the risk can delay, not on every activity.',
      trap: 'Padding every task feels safe and makes the schedule useless as a signal.'
    },
    {
      qid: 'pmp:set-2:087',
      sub: 'pmp-people',
      ecoTask: 'Manage stakeholder expectations',
      approach: 'Predictive',
      stem: 'A customer review is tomorrow. Three risks are scored high. The sponsor asks you to lower those scores in the register so the slide turns green. No new information has arrived. What should you do?',
      options: [
        'Lower the scores. The customer should see a calm slide.',
        'Delete the three risks for the meeting and put them back the next day.',
        'Keep the scores, show the responses, and do not edit the register to change the color.',
        'Cancel the customer review so the scores are never discussed.'
      ],
      answer: 2,
      why: '<p>The scores change when the risk changes, not when a slide needs to look green. The project manager keeps the scores and shows the responses that are in place. Lowering them, hiding them for a day, or cancelling the review all trade the customer relationship for a false register.</p><p><strong>Exam tip:</strong> Do not edit a risk score to please a meeting. New information can change a score. A preferred color cannot.</p>',
      optionRationales: [
        'A calm slide that lies about the scores is not managing the customer expectation.',
        'Removing risks for one meeting and restoring them is a false report.',
        'The customer sees the real scores and the responses. The register is not recolored.',
        'Cancelling the review hides the same information the sponsor did not want shown.'
      ],
      keyPoint: 'Show the high risks and their responses. Do not recolor the register for the meeting.',
      trap: 'A green slide with lowered scores is a false status, not stakeholder care.'
    },
    {
      qid: 'pmp:set-2:088',
      sub: 'pmp-process',
      ecoTask: 'Plan and optimize quality',
      approach: 'Hybrid',
      stem: 'Escaped defects went from 2 to 5 to 9 over three releases. The automated suite still passes 98 percent of its tests. A lead says quality is fine because the pass rate is high, and asks you to report it that way. What should you do?',
      options: [
        'Report quality fine. A 98 percent pass rate is the quality result.',
        'Add more copies of the same automated tests so the pass rate stays high.',
        'Report the rising escapes, and move detection toward the defects the suite is not catching. Do not let the pass rate stand in for that trend.',
        'Stop testing until the escape count returns to 2.'
      ],
      answer: 2,
      why: '<p>The suite can pass 98 percent and still miss the defects that are escaping. The trend that matters is 2, then 5, then 9. The project manager reports that trend and aims detection at the misses. More of the same tests, or a testing freeze, does not explain the escapes.</p><p><strong>Exam tip:</strong> When escapes rise and the pass rate does not, believe the escapes. The suite is not testing the failure you are shipping.</p>',
      optionRationales: [
        'The pass rate describes the tests you have, not the defects reaching users.',
        'More of the same tests will keep passing and keep missing the same escapes.',
        'The escape trend is the status, and detection moves toward those defects.',
        'Stopping all testing removes the signal and the protection you still have.'
      ],
      keyPoint: 'A high pass rate does not override a rising escape trend.',
      trap: 'Ninety-eight percent passed can mean the suite never looked at the defects that escaped.'
    },
    {
      qid: 'pmp:set-2:089',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage risk',
      approach: 'Agile',
      stem: 'The same integration risk has been written on the retro board for three sprints. Nobody owns a response. It has not happened yet. The facilitator wants to copy it onto the next board and move on. What should you do?',
      options: [
        'Copy it forward. A risk that has not happened does not need an owner.',
        'Erase it. Three sprints without an incident means it was not real.',
        'Assign an owner and a response in this retro. Do not carry it as a note with no one responsible.',
        'Stop the next sprint until the risk is proven by an incident.'
      ],
      answer: 2,
      why: '<p>A risk that survives three retros with no owner is not being managed. The project manager gets an owner and a response now. Copying the note, erasing it because it has not happened, or stopping the sprint until it becomes an incident all leave it unmanaged.</p><p><strong>Exam tip:</strong> A repeated retro note is a risk with no response. Name an owner before you copy it forward again.</p>',
      optionRationales: [
        'Another copy without an owner is how it lasted three sprints.',
        'It has not happened yet because it is still a risk, not because it is gone.',
        'This retro ends with an owner and a response, not with another unmarked note.',
        'Stopping the sprint waits for harm. The response should come before the incident.'
      ],
      keyPoint: 'Do not carry the same risk across retros without an owner and a response.',
      trap: 'Writing it down again feels like risk management and is only a note.'
    },
    {
      qid: 'pmp:set-2:090',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage finance',
      approach: 'Predictive',
      stem: 'Half of the identified risks are closed. Eighty percent of the contingency reserve is already spent, mostly on small requests that were not in the risk register. A lead says the spend is fine because the project is still under the total budget. What should you do?',
      options: [
        'Stop charging those requests to contingency, show the burn against the risks that remain, and send new scope through the change path.',
        'Refill the contingency quietly so the percent spent looks normal again.',
        'Keep using contingency for small requests. Under the total budget is the only test.',
        'Close the remaining risks so the empty reserve matches a shorter register.'
      ],
      answer: 0,
      why: '<p>Contingency is disappearing faster than the risks it was for, and the money is leaving through requests that were never risks. Under the total budget does not make that valid. The project manager stops the mischarge, shows what the remaining risks still need, and routes new scope through change control. A quiet refill, or closing risks to fit the empty reserve, hides the mismatch.</p><p><strong>Exam tip:</strong> Compare contingency spent with risks actually closed. Do not judge the reserve by whether the total budget still has room.</p>',
      optionRationales: [
        'Non-risk requests come off the reserve, the remaining risks stay funded in view, and new scope uses the change path.',
        'Refilling the reserve without a decision hides how fast it was spent.',
        'Room in the total budget does not authorize contingency for work that is not a risk response.',
        'Closing risks to match an empty reserve pretends the threats are gone.'
      ],
      keyPoint: 'If contingency is gone and the risks are not, stop spending it on anything that is not a risk response.',
      trap: 'Still under the total budget is not evidence that contingency is being used correctly.'
    },
    {
      qid: 'pmp:set-2:091',
      sub: 'pmp-business',
      ecoTask: 'Evaluate and address external business environment changes',
      approach: 'Hybrid',
      stem: 'A new tariff on imported sensors takes effect next month. Your next buy is in three weeks. The buyer says to ignore the tariff until the invoice arrives, because it might be delayed or reduced. What should you do?',
      options: [
        'Ignore it until the invoice. A charge that has not arrived is not a project fact.',
        'Cancel the sensor buy today so the tariff cannot apply.',
        'Assess the tariff now, record the cost and schedule effect, and choose a response before the buy is placed.',
        'Add the tariff to the invoice after it arrives and leave the plan unchanged until then.'
      ],
      answer: 2,
      why: '<p>The tariff is a known external change with a date before the next buy. Waiting for the invoice makes it an issue on a purchase you could still shape. The project manager assesses the effect and picks a response now. Cancelling with no look, or pretending the plan can wait, skips that assessment.</p><p><strong>Exam tip:</strong> An outside cost change dated before your next commitment is assessed now. Do not wait until the invoice makes it certain.</p>',
      optionRationales: [
        'The invoice is the late moment. The buy in three weeks is the moment you can still respond.',
        'Cancelling may be the response, but it is not the first step before you know the effect.',
        'The effect is assessed and a response is chosen while the buy can still change.',
        'Updating the invoice later records the hit. It does not prevent it.'
      ],
      keyPoint: 'Assess a dated external cost change before the commitment it will hit.',
      trap: 'Waiting for the invoice turns a tariff you could plan for into a surprise bill.'
    },
    {
      qid: 'pmp:set-2:092',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'The sprint goal needs a data feed that another department blocks by policy. The team has been pasting values by hand for six days and now calls the paste the process. You are asked whether the hand paste is good enough. What should you do?',
      options: [
        'Accept the paste. The board is moving, so the policy is no longer a blocker.',
        'Take the policy block to the department that owns it, show the effect on the goal, and do not treat the hand paste as the fix.',
        'Stop the whole sprint until that department volunteers a change.',
        'Write the paste into the definition of done so the workaround becomes official.'
      ],
      answer: 1,
      why: '<p>Six days of hand paste has made a policy block look normal. The goal still depends on the feed. The project manager takes the block to the owner, with the effect visible, and does not bless the paste as the process. Accepting it, stopping everything, or writing it into done all leave the policy in charge.</p><p><strong>Exam tip:</strong> A workaround that keeps the board green can hide an impediment. Go to the owner of the policy. Do not standardize the paste.</p>',
      optionRationales: [
        'A moving board is not a feed. The policy is still the blocker.',
        'The owner sees the effect on the goal, and the paste stays a workaround rather than the plan.',
        'Stopping all other work is wider than the impediment.',
        'Putting the paste in the definition of done makes the block permanent.'
      ],
      keyPoint: 'Do not let a hand workaround become the process. Take the policy block to its owner.',
      trap: 'If the board is moving, people will stop seeing the blocker. That is when you surface it.'
    },
    {
      qid: 'pmp:set-2:093',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Predictive',
      stem: 'A port closure moved the sensor lead time from 4 weeks to 10. The schedule the crew is using still shows 4 weeks, and installation is planned off that date. The buyer hopes the port reopens and asks you not to touch the schedule yet. What should you do?',
      options: [
        'Leave the 4-week date. A hope that the port reopens is a plan.',
        'Update the schedule to the 10-week lead, see what that does to installation, and do not keep the crew on the old date.',
        'Crash every later activity by 6 weeks so the finish date never moves.',
        'Delete the installation from the schedule until the port publishes a new date.'
      ],
      answer: 1,
      why: '<p>The lead time the crew is using is already wrong. Hope is not a date. The project manager puts 10 weeks into the schedule and looks at installation before more work is planned off the old promise. Crashing everything to protect the finish, or deleting installation, either ignores the constraint or hides it.</p><p><strong>Exam tip:</strong> When an external lead time changes, update the schedule people are using. Do not wait for the constraint to go away.</p>',
      optionRationales: [
        'Hoping the port reopens leaves installation tied to a date you no longer believe.',
        'The 10-week lead is in the schedule, and installation is replanned from that fact.',
        'Crashing later work by the whole slip assumes every activity can donate six weeks. That is not an assessment.',
        'Removing installation hides the work instead of sequencing it.'
      ],
      keyPoint: 'Replace the old lead time in the working schedule as soon as the external date changes.',
      trap: 'A hope that the port reopens is not a reason to keep a 4-week duration you know is false.'
    },
    {
      qid: 'pmp:set-2:094',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Hybrid',
      stem: 'A merger was announced this morning. Your steering group is one of the teams being reorganized, and it will not have a quorum for about six weeks. The sponsor says the merger does not affect the project because the scope did not change. What should you do?',
      options: [
        'Do nothing. Unchanged scope means the stakeholder map is unchanged.',
        'Pause every workstream for six weeks so no decision is made without the old group.',
        'Find out who can decide during the gap, update the stakeholder map, and do not assume the old quorum still exists.',
        'Ask the team to make baseline decisions themselves until the new group is named.'
      ],
      answer: 2,
      why: '<p>The scope may be the same, and the people who approve it are not. The project manager finds who can decide during the six weeks and updates the map. Doing nothing, stopping all work, or letting the team approve their own baseline all miss the actual change, which is governance, not scope.</p><p><strong>Exam tip:</strong> An external reorganization can remove your decision makers without touching the scope. Re-engage. Do not wait for the old quorum.</p>',
      optionRationales: [
        'Unchanged scope does not keep a steering group that is being disbanded.',
        'A full pause is broader than a quorum gap. Some work can continue once you know who decides.',
        'The map names the people who can decide now, and the old quorum is not assumed.',
        'The team does not inherit baseline authority because the committee is in flux.'
      ],
      keyPoint: 'When a merger removes the decision makers, update who you engage. Scope is not the only thing that can change.',
      trap: 'The sponsor said the scope is the same. The quorum is still gone.'
    },
    {
      qid: 'pmp:set-2:095',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'The team is blocked on an approval that a director has called political. Morale is down. The director asks you to give a motivational talk at standup and leave the approval alone so you do not make the politics worse. What should you do?',
      options: [
        'Give the talk and leave the approval. Morale is the real issue.',
        'Tell the team to stop raising the approval so the standup stays positive.',
        'Work the approval as the impediment it is, and do not substitute a talk for the decision the goal needs.',
        'Remove the people who look discouraged so the remaining team seems motivated.'
      ],
      answer: 2,
      why: '<p>The team is blocked, and a talk will not approve the work. The project manager treats the approval as an impediment and goes after the decision. A speech, a ban on mentioning it, or removing discouraged people all manage the mood and leave the goal stuck.</p><p><strong>Exam tip:</strong> Do not motivate a team around a blocker you could escalate. Leadership here is removing the impediment, not the frown.</p>',
      optionRationales: [
        'A talk does not produce the approval. The goal stays blocked.',
        'Silencing the blocker makes the standup pleasant and the impediment invisible.',
        'The approval is pursued as the impediment, and the talk is not used as a substitute.',
        'Removing discouraged people punishes the signal and keeps the block.'
      ],
      keyPoint: 'A blocked team needs the impediment moved, not a speech about morale.',
      trap: 'Politics is not a reason to leave a goal-blocking approval untouched.'
    },
    {
      qid: 'pmp:set-2:096',
      sub: 'pmp-process',
      ecoTask: 'Develop an integrated plan and plan delivery',
      approach: 'Hybrid',
      stem: 'A regulator published a draft rule that may change how you store one data field. It is not final. One stream builds that field. Three other streams do not touch it. A lead wants to stop all four streams until the rule is final. Another wants to ignore the draft. What should you do?',
      options: [
        'Stop all four streams. Any draft from a regulator freezes the project.',
        'Ignore the draft until it is law. Unfinal rules are not planned.',
        'Record the draft as a risk on the exposed stream, keep the other three moving, and do not rebuild the field as if the draft were final.',
        'Rebuild the field to the draft now so you are early, and leave the risk unrecorded.'
      ],
      answer: 2,
      why: '<p>The draft is uncertainty, not a final rule, and it touches one stream. The project manager records that risk, protects the exposed work from a premature rebuild, and lets the other streams continue. Stopping everything, ignoring the draft, or building the draft as if it were law all miss how wide the threat actually is.</p><p><strong>Exam tip:</strong> A draft external rule is a risk on the work it could hit. Do not freeze the whole project, and do not pretend it was never published.</p>',
      optionRationales: [
        'Three streams are not exposed. A full stop treats a draft as a final halt.',
        'Ignoring a published draft leaves the exposed stream with no response if the rule lands.',
        'The exposed stream carries the risk, the other work continues, and the field is not rebuilt on a draft.',
        'Building to a draft that may change spends the work twice and hides the uncertainty.'
      ],
      keyPoint: 'Limit the response to the stream a draft rule could actually change, and keep the rest moving.',
      trap: 'A draft is neither a reason to stop everything nor a reason to do nothing.'
    },
    {
      qid: 'pmp:set-2:097',
      sub: 'pmp-business',
      ecoTask: 'Remove impediments and manage issues',
      approach: 'Predictive',
      stem: 'The exhibit is the issue list your meeting keeps walking in order of who talks loudest. Time will run out after the first two items. What should you do?',
      options: [
        'Stay with the loud order. The director and the sponsor spoke first for a reason.',
        'Close every issue over 20 days with no review so the list looks shorter.',
        'Give the unowned 40-day permit mismatch an owner and a next step before the meeting is spent on paint and a sign.',
        'Defer the whole list to next month so the loud items and the old items wait together.'
      ],
      answer: 2,
      chart: {
        type: 'data-table',
        title: 'Open issues',
        columns: ['Issue', 'Age', 'Owner', 'Recent attention'],
        rows: [
          ['Permit drawing mismatch', '40 days', 'None', 'Not discussed in six meetings'],
          ['Calibration certificate', '22 days', 'Named, no next date', 'Mentioned once'],
          ['Lobby paint color', '2 days', 'Director', 'On the last three agendas'],
          ['Cafeteria sign', '1 day', 'Sponsor', 'Opening item today']
        ]
      },
      why: '<p>The permit mismatch is 40 days old, unowned, and it can stop work. Paint and a sign are new and loud. The project manager puts an owner and a next step on the permit item first. Following the loud order, mass-closing old issues, or sliding the whole list a month all avoid the item the age column is shouting about.</p><p><strong>Exam tip:</strong> Read age and owner before volume. An unowned old issue outranks a new preference.</p>',
      optionRationales: [
        'The director and the sponsor are loud. The permit mismatch is the item with no owner and the most age.',
        'Closing old issues without a review hides the permit problem instead of resolving it.',
        'The permit mismatch gets an owner and a next step before the meeting is used up on paint and a sign.',
        'Next month adds more age to an item that has already waited 40 days.'
      ],
      keyPoint: 'Work the old unowned issue before the new loud ones consume the meeting.',
      trap: 'The item at the top of a loud agenda is often the newest, not the most dangerous.'
    },
    {
      qid: 'pmp:set-2:098',
      sub: 'pmp-people',
      ecoTask: 'Plan and manage communication',
      approach: 'Hybrid',
      stem: 'A vendor posted that a security incident may touch the integration your team uses. Your team channel has not mentioned it. The communications lead wants to wait for a perfect statement next week before anyone is told. The integration is in use today. What should you do?',
      options: [
        'Wait for the perfect statement. Incomplete news should not be shared.',
        'Forward the vendor post to the whole company as confirmed fact.',
        'Tell the people who use the integration what you know, what you do not know, and when the next update will come. Do not wait a week for perfect wording.',
        'Take the integration offline permanently so there is nothing to explain.'
      ],
      answer: 2,
      why: '<p>People are using an integration that may be affected, and they have not been told. A perfect statement next week is too late for today. The project manager tells the users what is known, what is not, and when they will hear more. Broadcasting the post as proven fact, or shutting the integration forever, either overclaims or overreacts.</p><p><strong>Exam tip:</strong> On a live external incident, communicate the knowns and the unknowns now. Do not wait for perfect wording, and do not invent certainty.</p>',
      optionRationales: [
        'A week of silence leaves today users inside a possible incident.',
        'The vendor said the incident may touch you. Repeating it as confirmed fact overstates what you know.',
        'Users hear the current facts, the gaps, and the time of the next update.',
        'A permanent shutdown is a response you have not assessed. It is not a substitute for the message.'
      ],
      keyPoint: 'Tell the affected people what you know and what you do not, with a time for the next update.',
      trap: 'Waiting for a perfect statement is how a live incident stays secret until it is old.'
    },
    {
      qid: 'pmp:set-2:099',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage risk',
      approach: 'Predictive',
      stem: 'To protect a date, the plan is to crash a safety-critical install with night overtime. That response is not yet started. The crash would put a tired crew on the install, and nothing about fatigue is on the risk register. The scheduler says the original date risk is the only one that needs a line. What should you do?',
      options: [
        'Record the fatigue risk before you accept the crash, and do not treat the date risk as the only effect.',
        'Start the overtime. A response does not create new risks.',
        'Drop the date risk from the register once the crash is chosen, because it has been handled.',
        'Hide the overtime so the crew list stays unchanged and no new risk is visible.'
      ],
      answer: 0,
      why: '<p>Crashing the install may protect the date and create a fatigue risk on safety-critical work. That secondary risk belongs on the register before the response is accepted. Starting anyway, closing the date risk as if nothing else appeared, or hiding the overtime all leave the new threat unnamed.</p><p><strong>Exam tip:</strong> A response can create a new risk. Record that secondary risk before you commit to the response.</p>',
      optionRationales: [
        'Fatigue is assessed before the crash is accepted, and the date risk is not the only line.',
        'Overtime on a safety-critical install can create the very risk the response ignored.',
        'Closing the date risk hides the new fatigue risk the response introduced.',
        'Hiding the overtime keeps both the schedule story and the safety story false.'
      ],
      keyPoint: 'Before you accept a crash, register the new risk that crash creates.',
      trap: 'Solving the date risk is not free if the response puts a tired crew on a safety-critical install.'
    },
    {
      qid: 'pmp:set-2:100',
      sub: 'pmp-business',
      ecoTask: 'Evaluate and address external business environment changes',
      approach: 'Hybrid',
      stem: 'The customer champion who shaped the backlog left yesterday in a reorganization. A new buying lead is in the role. The contract is still signed. The team wants to keep building the old backlog and skip the introduction, because the contract did not change. What should you do?',
      options: [
        'Keep building and skip the introduction. A signed contract freezes the stakeholder map.',
        'Stop all work until the new lead has rewritten the backlog.',
        'Meet the new lead, confirm which outcomes still hold, and do not assume the old backlog is still what they expect.',
        'Ask the departed champion to approve the next sprint unofficially.'
      ],
      answer: 2,
      why: '<p>The contract is in place, and the person who owned the outcome is gone. The project manager meets the new lead and checks which outcomes still hold before the team treats the old backlog as settled. Skipping the introduction, stopping everything, or routing approval through someone who has left all ignore the change that actually happened.</p><p><strong>Exam tip:</strong> A signed contract does not mean the stakeholder map is frozen. When the champion leaves, reconfirm the outcomes with the person who now owns them.</p>',
      optionRationales: [
        'The contract did not name the champion as permanent. The new lead still has to recognize the outcomes.',
        'A full stop before a conversation assumes the backlog is wrong. You do not know that yet.',
        'The new lead is engaged, and the backlog is confirmed or adjusted from that conversation.',
        'An unofficial approval from someone who has left is not the new owner decision.'
      ],
      keyPoint: 'Re-engage when the customer owner changes, even if the contract is unchanged.',
      trap: 'A signed contract is not a substitute for the person who now has to live with the backlog.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 2;
    q.batch = index < 10 ? 9 : 10;
    q.original = true;
    q.sourceDocument = 'Original UpSkill Sprint item. July 2026 PMP Exam Content Outline and PMBOK Guide 8th Edition used as references only. Not a PMI item.';
    if (q.qid !== 'pmp:set-2:' + String(index + 81).padStart(3, '0')) {
      throw new Error('PMP Set 2 id sequence broken at ' + q.qid);
    }
  });

  global.PMP_SET2 = questions;

  global.registerPMPSet2 = function (exam) {
    if (!exam) return;
    var existing = exam.sets || {};
    var first = existing[1] || exam.bank || [];
    exam.sets = Object.assign({}, existing, {1: first, 2: questions, 3: existing[3] || []});
    if (!exam.bank || !exam.bank.length) exam.bank = first.length ? first : questions;
    exam.setPlans = Object.assign({}, exam.setPlans, {
      2: {target: 20, label: 'Q081-Q100'}
    });
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {2: 20});
    exam.setName = 'Set 1: Q001-Q080 · Set 2: Q081-Q100 · Set 3 soon';
  };
})(typeof window !== 'undefined' ? window : globalThis);
