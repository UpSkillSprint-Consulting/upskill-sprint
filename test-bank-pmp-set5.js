/*
 * PMI PMP Exam Set 5 — original practice questions.
 * Q151-Q170. Written to the July 2026 Exam Content Outline
 * (People, Process, Business Environment) and the PMBOK Guide 8th Edition
 * performance domains. No PMI item, handbook passage, or figure is copied.
 * UpSkill Sprint is not affiliated with the Project Management Institute.
 */
(function (global) {
  'use strict';

  var questions = [
    {
      qid: 'pmp:set-5:151',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Predictive',
      stem: 'The benefits plan measures cycle time at 30 days and again at 90 days after go-live. The sponsor wants to close the project on go-live day and drop both measures, because the system will be in production. What should you do?',
      options: [
        'Close on go-live. A system in production is the benefit.',
        'Keep the 30-day and 90-day measures, and name who will read them. Do not close the benefit out on the day the system turns on.',
        'Move both measures into a lessons-learned note so they do not affect the close.',
        'Ask operations to watch cycle time if they feel like it, with no date and no owner.'
      ],
      answer: 1,
      why: '<p>Go-live is when the benefit can start to be measured, not when it has been delivered. The plan already named 30 and 90 days. The project manager keeps those reads and names who will do them. Closing on the day the system turns on, or leaving the measures as an optional note, abandons the outcome the case was built for.</p><p><strong>Exam tip:</strong> Do not close a project on go-live when the benefits plan still has dated measures. The system being on is not the benefit.</p>',
      optionRationales: [
        'Production is the start of the measurement window, not proof the cycle time moved.',
        'Both dated measures stay, and a named person will read them.',
        'A lessons note does not measure anything at day 30 or day 90.',
        'An optional watch with no owner is the same as dropping the measures.'
      ],
      keyPoint: 'Keep the benefits measures that fall after go-live. Do not close them out on launch day.',
      trap: 'The system is in production is not the same sentence as the benefit was delivered.'
    },
    {
      qid: 'pmp:set-5:152',
      sub: 'pmp-people',
      ecoTask: 'Engage stakeholders',
      approach: 'Hybrid',
      stem: 'Operations will run the process after transition. They were not in the design reviews. At handover they ask for changes that undo choices the users already accepted. The design lead wants to refuse every operations request so the design stays stable. What should you do?',
      options: [
        'Refuse every request. The design was accepted, so operations must live with it.',
        'Accept every operations request. They will own the process, so their list replaces the design.',
        'Bring operations into the handover decisions, separate defects from new wishes, and do not reopen the whole design or ignore the people who will run it.',
        'Delay handover until operations rewrite the design on their own.'
      ],
      answer: 2,
      why: '<p>Operations were missing from the design, and they are about to own the work. A blanket no repeats that miss. A blanket yes throws out choices users already accepted. The project manager puts operations in the room, splits real defects from new wishes, and decides those in the open.</p><p><strong>Exam tip:</strong> At transition, engage the people who will run the process. Do not treat their first list as either noise or a new design.</p>',
      optionRationales: [
        'A total refusal leaves the future owners outside the handover they have to live with.',
        'Replacing the accepted design with an operations list undoes user decisions without a look.',
        'Operations are in the decision, defects are separated from wishes, and the design is not reopened wholesale.',
        'Sending them off to rewrite alone delays handover and still skips the joint decision.'
      ],
      keyPoint: 'Include operations at handover. Sort defects from new wishes instead of accepting or refusing the whole list.',
      trap: 'They were not in the design is not a reason to keep them out of the handover.'
    },
    {
      qid: 'pmp:set-5:153',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Hybrid',
      stem: 'The benefit requires a policy change that legal has not approved. The system is installed and the team wants to announce that the benefit is delivered. Legal says the review will take two more weeks. What should you do?',
      options: [
        'Announce the benefit. The system is the part the project controls.',
        'Turn the new process on and tell legal after staff are already using it.',
        'Do not announce the benefit as delivered. Keep the policy approval visible as a dependency, and do not start the new process ahead of it.',
        'Cancel the system because legal is slow.'
      ],
      answer: 2,
      why: '<p>The outcome needs the policy, and the policy is not approved. An installed system does not deliver that benefit. The project manager keeps the approval visible and does not start the process ahead of it. Announcing success, or starting and telling legal later, claims a change the organization has not made.</p><p><strong>Exam tip:</strong> If the benefit depends on a decision another group has not made, that decision is still open. Do not announce delivery because the system is installed.</p>',
      optionRationales: [
        'The project also needed the policy. The system alone is not the benefit.',
        'Starting the process before approval forces a change legal has not allowed.',
        'The benefit stays unclaimed, and the policy approval remains a visible dependency.',
        'A slow review is not a reason to throw out a system that is waiting on one decision.'
      ],
      keyPoint: 'Do not call the benefit delivered while the policy it depends on is still unapproved.',
      trap: 'Installed is not delivered when a required policy is still in legal review.'
    },
    {
      qid: 'pmp:set-5:154',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'The sponsor sees the exhibit and says to stay quiet until day 90, then report whatever the benefit looks like. What should you do?',
      options: [
        'Stay quiet. Day 90 is the only read that counts.',
        'Claim the 15 percent target now, because adoption is already above the plan.',
        'Report the day-30 result now. Adoption is high, so look at why cycle time barely moved. Do not wait until day 90 to mention it.',
        'Declare the benefit failed and roll the system back this week.'
      ],
      answer: 2,
      chart: {
        type: 'data-table',
        title: 'Benefit check, day 30',
        columns: ['Signal', 'Target', 'Measured'],
        rows: [
          ['Cycle time', '15 percent faster', '2 percent faster'],
          ['Staff on the new path', '70 percent', '80 percent'],
          ['Support calls on the new path', 'No target set', 'Higher than before go-live'],
          ['Next planned read', 'Day 90', 'Not yet due']
        ]
      },
      why: '<p>Day 30 was a planned read, and it is in. People are using the path, and cycle time has barely moved. Waiting until day 90 hides a result you already have. Claiming the target because adoption is high confuses use with the benefit. Rolling back this week skips the look the numbers are asking for.</p><p><strong>Exam tip:</strong> Report a benefits read when its date arrives. High adoption does not let you claim a cycle-time target the table does not show.</p>',
      optionRationales: [
        'Day 90 is the next read, not a reason to bury the day-30 result.',
        'Eighty percent adoption is not a 15 percent cycle-time gain.',
        'The day-30 gap is reported now, and the question becomes why cycle time did not move.',
        'A rollback before anyone looks at the gap is larger than the evidence supports.'
      ],
      keyPoint: 'Report the day-30 benefit result. Do not wait for day 90, and do not claim the target.',
      trap: 'Strong adoption is the number most likely to hide a benefit that did not move.'
    },
    {
      qid: 'pmp:set-5:155',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'Go-live is Friday. The team calendar sends everyone back to their old jobs on Friday afternoon. Three defects are already on the hypercare list, and no one is named to own them after Friday. A lead says the list can wait until Monday because people will be around somewhere. What should you do?',
      options: [
        'Let the team disband Friday. Someone will pick the list up next week.',
        'Name the hypercare owners, and the hours they will give, before Friday. Do not release the team against an unowned defect list.',
        'Close the three defects as accepted so the calendar can stay as written.',
        'Keep the entire team full time for a month with no agreement on what they will do.'
      ],
      answer: 1,
      why: '<p>The defects are known, and the people who would fix them are scheduled to leave. Monday hope is not an owner. The project manager names who covers hypercare, and for how long, before the calendar releases them. Closing the defects to save the calendar, or holding everyone with no scope, either hides the work or refuses to plan it.</p><p><strong>Exam tip:</strong> Do not disband the team against an open hypercare list. Name the owners before the calendar does it for you.</p>',
      optionRationales: [
        'Around somewhere on Monday is not a named owner for three known defects.',
        'Owners and hours are set before Friday, and the list is not left to chance.',
        'Marking the defects accepted clears the list without fixing them.',
        'Holding everyone, with no agreement, is not a hypercare plan.'
      ],
      keyPoint: 'Assign hypercare before the team returns to their old jobs.',
      trap: 'The calendar says Friday, so people will assume the defects left with them.'
    },
    {
      qid: 'pmp:set-5:156',
      sub: 'pmp-process',
      ecoTask: 'Ensure value-based delivery',
      approach: 'Agile',
      stem: 'The benefit hypothesis was that users would finish the task without calling support. After release, support calls about that task went up. The product owner wants to add a set of tooltips next sprint and leave the hypothesis as it is. What should you do?',
      options: [
        'Add the tooltips. More guidance is always a response to more calls.',
        'Leave the hypothesis. The release is done, so the calls belong to support.',
        'Look at the calls against the hypothesis before you add tooltips. Do not treat a screen change as the answer until you know why people are calling.',
        'Remove the task from the product so the calls stop.'
      ],
      answer: 2,
      why: '<p>The hypothesis said calls would fall. They rose. Tooltips might be the fix, and they might not. The project manager uses the call data to revisit the hypothesis first. Adding screens, handing the calls to support, or deleting the task all skip that look.</p><p><strong>Exam tip:</strong> When the measured outcome contradicts the hypothesis, revisit the hypothesis. Do not jump to the next feature.</p>',
      optionRationales: [
        'Tooltips assume the calls are a guidance problem. The calls have not been read that way yet.',
        'A finished release does not retire a hypothesis the data just contradicted.',
        'The calls are read against the hypothesis, and tooltips wait on that reading.',
        'Removing the task ends the outcome instead of learning why the calls rose.'
      ],
      keyPoint: 'Revisit the benefit hypothesis when the calls go the wrong way. Do not preset the fix.',
      trap: 'A tooltip sprint feels like action and can miss why people are calling.'
    },
    {
      qid: 'pmp:set-5:157',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage procurement',
      approach: 'Predictive',
      stem: 'The contract warranty is 30 days after acceptance. Operations asks your team to keep fixing defects for six months, with no change to the contract, because an informal promise will be faster. What should you do?',
      options: [
        'Agree informally. A handshake keeps the relationship and avoids procurement.',
        'Stop all contact on day 31, including questions about work already accepted.',
        'If six months of support is needed, put that extension through the contract change. Do not staff an informal warranty.',
        'Bill the six months to the original warranty line so the contract text can stay at 30 days.'
      ],
      answer: 2,
      why: '<p>Thirty days is what the contract bought. Six months is a different obligation. The project manager does not create it with a handshake, and does not pretend the old warranty line can absorb it. If operations needs the longer window, it goes through a contract change. Cutting off even questions about accepted work is harsher than the clause requires.</p><p><strong>Exam tip:</strong> Do not extend a warranty informally. Change the contract if the support window needs to change.</p>',
      optionRationales: [
        'A handshake support window is an obligation the contract does not contain.',
        'Day 31 silence is more than the warranty ending. Questions about accepted work still have a path.',
        'The six-month need goes through a contract change, and the team is not staffed on a promise.',
        'Hiding six months of cost in a 30-day line misstates both the contract and the spend.'
      ],
      keyPoint: 'A longer support window is a contract change, not an informal favor.',
      trap: 'Faster if we do not involve procurement is how a 30-day warranty becomes six months of free work.'
    },
    {
      qid: 'pmp:set-5:158',
      sub: 'pmp-people',
      ecoTask: 'Plan and manage communication',
      approach: 'Predictive',
      stem: 'During transition, two operations supervisors are teaching new staff. One says a mismatch is reworked the same day. The other says it is logged and left for the weekly batch. New staff have done both, and the error rate is up. Your team is still on site. What should you do?',
      options: [
        'Let each supervisor teach their own rule. They know their shifts.',
        'Pick a rule yourself and email it after your team has left.',
        'Get one procedure and one owner while your team is still on site, and stop the two teachings until that procedure is what new staff hear.',
        'Add a third set of instructions so staff can choose the clearest one.'
      ],
      answer: 2,
      why: '<p>New staff are getting two operating rules, and the errors show it. The project manager uses the time still on site to get one procedure and one owner. Leaving both teachings, sending the answer after departure, or adding a third version all keep the contradiction in the room.</p><p><strong>Exam tip:</strong> Transition fails when two owners teach two procedures. Settle one procedure before you leave the site.</p>',
      optionRationales: [
        'Two shift rules are why the error rate is up. Knowing the shift is not the same as agreeing the work.',
        'An email after you leave arrives too late for the staff learning the wrong pair of rules now.',
        'One procedure and one owner are in place before the project team goes, and the double teaching stops.',
        'A third write-up gives new staff three versions instead of one.'
      ],
      keyPoint: 'One procedure, one owner, before the project team leaves the transition.',
      trap: 'Two experienced supervisors can still teach opposite rules. Seniority does not settle the conflict.'
    },
    {
      qid: 'pmp:set-5:159',
      sub: 'pmp-process',
      ecoTask: 'Manage project closure',
      approach: 'Hybrid',
      stem: 'Lessons learned are booked for the week after the team returns to their home departments. The home managers have already filled those calendars. The facilitator says a short survey later is the same thing. What should you do?',
      options: [
        'Keep the later date. A survey can replace the session.',
        'Cancel lessons learned. The team is tired and the system is live.',
        'Hold the session while the team is still together. Do not wait for a week when their calendars already belong to someone else.',
        'Ask one person to write the lessons after everyone has left.'
      ],
      answer: 2,
      why: '<p>The people who hold the lessons will not be in the room on the booked date. A later survey, a cancellation, or one person writing alone loses the conversation. The project manager moves the session to while the team is still together.</p><p><strong>Exam tip:</strong> Capture lessons before the team disperses. A survey after they have gone back to their old jobs is not the same session.</p>',
      optionRationales: [
        'A survey the following week reaches people whose calendars are already taken, and it drops the discussion.',
        'Fatigue and a live system are not reasons to skip what the team can still tell you.',
        'The session happens while the team is still together and able to attend.',
        'One writer after the fact is a memoir, not a team lesson.'
      ],
      keyPoint: 'Hold lessons learned before the team returns to their home departments.',
      trap: 'Next week, after everyone is back at their old desks, is how lessons learned become a blank survey.'
    },
    {
      qid: 'pmp:set-5:160',
      sub: 'pmp-business',
      ecoTask: 'Support organizational change',
      approach: 'Agile',
      stem: 'The benefit case says the annual gain will be measured over the first year. Go-live was last week. A benefit owner wants the full annual figure booked on this month scorecard so the department looks successful. Nothing has been measured yet. What should you do?',
      options: [
        'Book the annual figure. The case was approved, so the gain can be claimed at go-live.',
        'Book half the annual figure as a conservative claim.',
        'Do not book the annual gain. Report that measurement has not started, and keep the claim on the schedule the case named.',
        'Ask the owner to round the figure down slightly so the scorecard looks careful.'
      ],
      answer: 2,
      why: '<p>The case tied the gain to a year of measurement. Last week is not that year. Booking all of it, half of it, or a rounded version still puts an unmeasured number on the scorecard. The project manager reports that measurement has not started and leaves the claim on the plan.</p><p><strong>Exam tip:</strong> Do not book a benefit before its measurement window. An approved case is a forecast, not a result.</p>',
      optionRationales: [
        'Approval of a forecast does not make last week equal to a measured year.',
        'Half of an unmeasured year is still an unmeasured claim.',
        'The scorecard says measurement has not started, and the annual claim stays on its real schedule.',
        'Rounding an unmeasured figure makes the claim look careful without making it true.'
      ],
      keyPoint: 'Do not put an unmeasured annual benefit on this month scorecard.',
      trap: 'The department wants to look successful is not a measurement.'
    },
    {
      qid: 'pmp:set-5:161',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Hybrid',
      stem: 'A trusted colleague wrote the status pack. The steering meeting starts in ten minutes. They ask you to sign the pack as checked, because there is no time to read it and they have never been wrong. What should you do?',
      options: [
        'Sign it. Trust is the point of a team, and ten minutes is not a real review.',
        'Sign it and read it after the meeting so the signature is only slightly early.',
        'Do not sign work you have not checked. Tell the meeting what you have and have not verified, or ask to move the item.',
        'Refuse to attend so you cannot be associated with the pack.'
      ],
      answer: 2,
      why: '<p>A signature says you checked it. Ten minutes and a good record do not create that check. The project manager says what is verified and what is not, or moves the item. Signing now and reading later, or skipping the meeting, either attests falsely or abandons the status.</p><p><strong>Exam tip:</strong> Do not sign a status you have not reviewed. Trust does not replace the check your name claims.</p>',
      optionRationales: [
        'Trust explains why you might want to sign. It does not make the signature true.',
        'A signature before the reading tells steering the pack was checked when it was not.',
        'The meeting hears the limit of what you have verified, or the item waits until you can check it.',
        'Leaving the meeting hides you. It does not correct the pack or the request.'
      ],
      keyPoint: 'Do not attest to a status pack you have not checked, even for a trusted colleague.',
      trap: 'They have never been wrong is not a review.'
    },
    {
      qid: 'pmp:set-5:162',
      sub: 'pmp-process',
      ecoTask: 'Evaluate and manage project status',
      approach: 'Predictive',
      stem: 'A gate decision needs results from five sites. Three have reported. Two have not, and either of those two could change the result. A lead says to decide on the three so the gate is not late. What should you do?',
      options: [
        'Decide on the three. A late gate is worse than a partial sample.',
        'Treat the missing sites as if they match the three, so the file looks complete.',
        'Do not decide as if five sites reported. Say the result is three of five, and wait if the missing sites could change the gate.',
        'Cancel the gate until every future project has five complete sites.'
      ],
      answer: 2,
      why: '<p>The gate asked for five sites, and the two missing ones could change the answer. Deciding on three and calling it the result overstates the evidence. The project manager labels what is actually in hand and waits when those sites could flip the decision. Inventing matching data, or cancelling every future gate, either fakes the file or widens the problem.</p><p><strong>Exam tip:</strong> Do not present a partial sample as a complete one. If the missing data could change the decision, say so and wait.</p>',
      optionRationales: [
        'A punctual gate on three sites is the wrong decision if the other two could reverse it.',
        'Filling the gaps to match the three is invented evidence.',
        'The gate sees three of five, and it waits because the missing sites could change the result.',
        'This gate is short two sites. That does not cancel the gate process for every later project.'
      ],
      keyPoint: 'Label a three-site result as three sites. Do not decide a five-site gate on it when the rest could change the answer.',
      trap: 'On time and almost complete is how missing sites disappear from a gate.'
    },
    {
      qid: 'pmp:set-5:163',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Predictive',
      stem: 'A friend at the client offers you the numbers from a competitor bid, and says you can use them to price fairly. Your bid is still open. What should you do?',
      options: [
        'Use the numbers. Fair pricing is the reason they were offered.',
        'Look at the numbers, then decide whether they feel material.',
        'Refuse the numbers, do not use them, and disclose the offer the way your rules require.',
        'Ask the friend to send the numbers to your personal mail so the project file stays clean.'
      ],
      answer: 2,
      why: '<p>Competitor bid numbers, offered while your bid is open, are not yours to use. Looking in order to decide later, or routing them through personal mail, still takes the information. The project manager refuses them and discloses the offer as the rules require.</p><p><strong>Exam tip:</strong> Do not accept a competitor bid from a friend. Refuse it and disclose the offer. Fair is not a use for someone else numbers.</p>',
      optionRationales: [
        'Calling it fair pricing does not make another bidder confidential numbers available to you.',
        'Looking is using. You cannot unsee numbers you were not supposed to have.',
        'The numbers are refused, unused, and the offer is disclosed.',
        'Personal mail hides the offer. It does not refuse it.'
      ],
      keyPoint: 'Refuse competitor bid information and disclose the offer. Do not price from it.',
      trap: 'A friend calling it fair is still handing you another bidder numbers during an open bid.'
    },
    {
      qid: 'pmp:set-5:164',
      sub: 'pmp-process',
      ecoTask: 'Develop an integrated plan and plan delivery',
      approach: 'Hybrid',
      stem: 'Discovery is unfinished, so the estimate is a range. Finance wants one number for the board book and says a range looks indecisive. The board meets tomorrow. What should you do?',
      options: [
        'Pick the midpoint and send that single number.',
        'Pick the top of the range so you cannot be short.',
        'Send the range, say what is still unknown, and say what would narrow it. Do not replace the range with a false point.',
        'Tell finance the board cannot be informed until discovery is finished.'
      ],
      answer: 2,
      why: '<p>The honest estimate is a range because the work is not known yet. A midpoint or a padded top both pretend certainty. Refusing to inform the board is the other extreme. The project manager sends the range, the unknowns, and what would tighten it.</p><p><strong>Exam tip:</strong> Do not collapse a real range into one number because a board book prefers a point. Show the range and what would narrow it.</p>',
      optionRationales: [
        'A midpoint looks decided and hides the width the discovery has not closed.',
        'The top of the range is a pad, not a better fact.',
        'The board sees the range, the unknowns, and what would make the number tighter.',
        'The board can be informed tomorrow. They do not need a false point to hear the status.'
      ],
      keyPoint: 'Give the board the range and the unknowns. Do not invent a single number.',
      trap: 'A range looks indecisive only if you hide what the range is made of.'
    },
    {
      qid: 'pmp:set-5:165',
      sub: 'pmp-people',
      ecoTask: 'Lead the project team',
      approach: 'Agile',
      stem: 'A team member tells you privately that yesterday demo was a recording from last week, presented as live. They ask you not to say they told you, because they fear the demo lead. The sponsor congratulated the team on the live demo. What should you do?',
      options: [
        'Leave it. The sponsor is already satisfied, and the tip was private.',
        'Name the team member in the next standup so the group can confirm the story.',
        'Take the report seriously, protect the person who told you, and correct the record with the sponsor. Do not leave a recorded demo described as live.',
        'Ask the demo lead to do a live rerun someday and do not mention the recording.'
      ],
      answer: 2,
      why: '<p>The sponsor was shown a recording and told it was live. That record has to be corrected. The person who reported it asked for protection, and naming them in a standup is the opposite. The project manager treats the report as real, keeps the source safe, and tells the sponsor the truth. A quiet rerun later leaves the congratulations standing on a false demo.</p><p><strong>Exam tip:</strong> A faked demo is corrected with the audience that saw it. Protect the person who told you. Do not bury the tip because the sponsor was pleased.</p>',
      optionRationales: [
        'Sponsor satisfaction does not make a recording into a live demo.',
        'Naming the reporter in the standup is the retaliation they feared.',
        'The report is acted on, the reporter is protected, and the sponsor hears that the demo was not live.',
        'A future rerun does not correct the record the sponsor already applauded.'
      ],
      keyPoint: 'Correct a demo that was not live, and protect the person who told you.',
      trap: 'The sponsor already congratulated the team is a reason to fix the record, not to keep it.'
    },
    {
      qid: 'pmp:set-5:166',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Predictive',
      stem: 'Safety is a mandatory criterion for the choice in the exhibit. The sponsor wants option C because it is the cheapest and the fastest. What should you do?',
      options: [
        'Choose C. Cost and schedule are complete, and the blanks can be filled in later.',
        'Choose A. It is the middle cost, so it is the balanced option.',
        'Do not choose on the blank safety cells. Assess A and C, or choose only an option that already meets the safety standard.',
        'Choose B and also cut its safety work so its cost matches C.'
      ],
      answer: 2,
      chart: {
        type: 'data-table',
        title: 'Options in front of the sponsor',
        columns: ['Option', 'Cost', 'Safety assessment', 'Schedule'],
        rows: [
          ['A', '40', 'Not done', '2 weeks'],
          ['B', '55', 'Meets the standard', '3 weeks'],
          ['C', '30', 'Not done', '1 week']
        ]
      },
      why: '<p>Safety is mandatory, and it is blank for the two options that look best on cost and time. The project manager does not pick C, or A, on the columns that happen to be filled. Assess the blanks, or stay with the option that already meets the standard. Cutting the safety work out of B to win on cost removes the reason B is eligible.</p><p><strong>Exam tip:</strong> Do not decide on the columns that are filled in when a mandatory column is blank.</p>',
      optionRationales: [
        'Cheap and fast, with safety not done, fails the criterion the choice required.',
        'The middle cost is not a safety assessment. A is still blank.',
        'The blank safety cells are assessed, or the choice stays with the option that already meets the standard.',
        'Removing safety work from B to match C price throws out the only complete safety result.'
      ],
      keyPoint: 'A mandatory safety cell that says not done blocks the choice. Do not pick the cheap fast row around it.',
      trap: 'The complete columns are the ones a sponsor will use, and they are not the mandatory criterion.'
    },
    {
      qid: 'pmp:set-5:167',
      sub: 'pmp-people',
      ecoTask: 'Manage stakeholder expectations',
      approach: 'Hybrid',
      stem: 'You told a stakeholder the interface would be ready Friday. You now know it will not. They have already told their boss it will. The stakeholder asks you to wait until next week to correct it, so they are not embarrassed. What should you do?',
      options: [
        'Wait until next week. They carried the message, so they choose when it is corrected.',
        'Correct it now with the stakeholder, and with the boss who heard the Friday date. Do not leave a wrong commitment in circulation.',
        'Blame the stakeholder for repeating a date that was only a hope.',
        'Quietly move another team piece so Friday becomes true, and do not mention the miss.'
      ],
      answer: 1,
      why: '<p>The wrong date is already with the boss. Waiting a week lets that person plan on it. The project manager corrects it now, including with the boss who heard it. Blaming the stakeholder for repeating what you said, or quietly crashing other work to make Friday true, either punishes the messenger or hides the miss inside someone else plan.</p><p><strong>Exam tip:</strong> When you learn a commitment you made is wrong, correct it with everyone who is now relying on it. Do not wait out of embarrassment.</p>',
      optionRationales: [
        'Embarrassment is not a reason to leave a boss planning on a Friday that will not happen.',
        'The stakeholder and the boss both hear the correction now.',
        'They repeated your date. Blaming them avoids the correction.',
        'Moving other work in secret may not make Friday true, and it hides the broken commitment.'
      ],
      keyPoint: 'Correct a wrong commitment promptly, including with the person who was told downstream.',
      trap: 'Waiting so nobody is embarrassed leaves the wrong date in force.'
    },
    {
      qid: 'pmp:set-5:168',
      sub: 'pmp-process',
      ecoTask: 'Plan and manage schedule',
      approach: 'Agile',
      stem: 'A customer asks for a fixed delivery date. You have velocity from three sprints. The window they want includes a week when half the team is out. A sales lead says to multiply the average by the number of sprints and send that date as a commitment. What should you do?',
      options: [
        'Send the multiplied date. Three sprints are enough to promise.',
        'Leave the absent week out of the story so the date looks cleaner.',
        'Do not convert three sprints into a committed date. Give a range, and say the absent week is inside it.',
        'Promise the date and add people later if the absent week hurts.'
      ],
      answer: 2,
      why: '<p>Three sprints and a half-absent week are not a single committed date. Multiplying the average hides both the thin history and the absence. The project manager gives a range and names the week. Promising now and hiring later pretends the constraint is already solved.</p><p><strong>Exam tip:</strong> Do not turn a short velocity history into a fixed date. Show the range and the absence inside the window.</p>',
      optionRationales: [
        'An average of three sprints, times a count, ignores the week half the team is out.',
        'Omitting the absent week makes the date look precise by deleting a known fact.',
        'The customer gets a range, and the absent week is part of what they hear.',
        'A promise plus a later hire commits the date before the capacity exists.'
      ],
      keyPoint: 'Give a range when velocity is short and a known absence sits in the window. Do not promise a point date.',
      trap: 'Multiply and send is how a forecast becomes a commitment the team did not make.'
    },
    {
      qid: 'pmp:set-5:169',
      sub: 'pmp-business',
      ecoTask: 'Plan and manage project compliance',
      approach: 'Hybrid',
      stem: 'An auditor asks when a control was last tested. You do not know. A teammate whispers a month. You are not sure the month is right. The auditor is waiting. What should you do?',
      options: [
        'Say the whispered month. A pause looks like you are hiding the control.',
        'Say you do not know, and give a time when you will answer from the record. Do not pass along a whisper.',
        'Tell the auditor the control is tested regularly, without a date.',
        'Ask the teammate to answer in your place so the words are not yours.'
      ],
      answer: 1,
      why: '<p>You do not know the date. A whisper is not the record. The project manager says so and names when the real answer will come. A vague regularly, or handing the microphone to the teammate, still puts an unchecked claim in front of the auditor.</p><p><strong>Exam tip:</strong> If you do not know, say you do not know and commit a time to answer from the record. Do not launder a whisper into testimony.</p>',
      optionRationales: [
        'The pause is honest. The whispered month may be false, and the auditor would be relying on it.',
        'The auditor hears that you do not know, and hears when the record will answer.',
        'Regularly is a claim without a date. It is not the question they asked.',
        'Someone else speaking the whisper does not make it your knowledge or the record.'
      ],
      keyPoint: 'Tell the auditor you do not know, and when you will answer from the record.',
      trap: 'A confident whisper is not a test date.'
    },
    {
      qid: 'pmp:set-5:170',
      sub: 'pmp-people',
      ecoTask: 'Manage stakeholder expectations',
      approach: 'Predictive',
      stem: 'A workaround would let the customer run today. It can also produce a wrong payment if they use one path. They have not been told about that path. A release note would mention it on page four. The sponsor wants the workaround shipped this afternoon. What should you do?',
      options: [
        'Ship it. A release note is notice, and the customer can find page four.',
        'Ship it and mention the limitation only if a wrong payment actually happens.',
        'Do not ship it for silent use. Tell the customer about the wrong-payment path before they rely on the workaround, even if that delays the afternoon.',
        'Ship it to a few users and call that a pilot so the limitation does not need to be said.'
      ],
      answer: 2,
      why: '<p>The limitation can take money in error, and the customer does not know. A note on page four is not a warning they will see before they rely on the path. The project manager tells them before they use it, even if the afternoon ship slips. Waiting for a wrong payment, or calling a quiet release a pilot, still puts them on the path uninformed.</p><p><strong>Exam tip:</strong> Do not ship a workaround that can cause a wrong payment until the people who will use it have been told. A buried release note is not that conversation.</p>',
      optionRationales: [
        'Page four of a release note is not a warning given before they rely on the path.',
        'Waiting for a wrong payment makes the customer the test.',
        'They hear the limitation before they use the workaround, and the ship waits on that conversation.',
        'A small quiet release is still use without the warning.'
      ],
      keyPoint: 'Tell the customer about a wrong-payment path before they rely on the workaround.',
      trap: 'It is in the release notes is not notice when the harm is a wrong payment and the note is on page four.'
    }
  ];

  questions.forEach(function (q, index) {
    q.set = 5;
    q.batch = index < 10 ? 16 : 17;
    q.original = true;
    q.sourceDocument = 'Original UpSkill Sprint item. July 2026 PMP Exam Content Outline and PMBOK Guide 8th Edition used as references only. Not a PMI item.';
    if (q.qid !== 'pmp:set-5:' + String(index + 151).padStart(3, '0')) {
      throw new Error('PMP Set 5 id sequence broken at ' + q.qid);
    }
  });

  global.PMP_SET5 = questions;

  global.registerPMPSet5 = function (exam) {
    if (!exam) return;
    var existing = exam.sets || {};
    var first = existing[1] || exam.bank || [];
    var second = existing[2] || [];
    var third = existing[3] || [];
    var fourth = existing[4] || [];
    exam.sets = Object.assign({}, existing, {1: first, 2: second, 3: third, 4: fourth, 5: questions});
    if (!exam.bank || !exam.bank.length) exam.bank = first.length ? first : questions;
    var ids = Array.isArray(exam.plannedSets) ? exam.plannedSets.map(String) : ['1', '2', '3', '4'];
    if (ids.indexOf('5') < 0) ids.push('5');
    exam.plannedSets = ids;
    exam.setPlans = Object.assign({}, exam.setPlans, {
      5: {target: 20, label: 'Q151-Q170'}
    });
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {5: 20});
    exam.setName = 'Set 1: Q001-Q080 · Set 2: Q081-Q100 · Set 3: Q101-Q130 · Set 4: Q131-Q150 · Set 5: Q151-Q170';
  };
})(typeof window !== 'undefined' ? window : globalThis);
