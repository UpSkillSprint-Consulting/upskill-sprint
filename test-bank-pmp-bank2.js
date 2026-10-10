/* PMP Set 2: original authored batches 1–7 (Q001–Q070), July 2026 ECO.
 * Legacy files named test-bank-pmp-set1.js through set6.js all populate Set 1.
 * Keep this bank separate. No PMI exam items or book passages are reproduced.
 */
(function (global) {
  'use strict';
  const batches = [
  {
    "number": 1,
    "sourcePage": "https://chatgpt.com/space/page_0e2a409c9f048191b07c90bf37e5cf23",
    "caseStudy": {
      "id": "C01",
      "title": "Packaging line modernization",
      "markdown": "A manufacturer is installing barcode-verification equipment and an operator application on two packaging lines. Equipment work follows an approved predictive plan; the application team uses two-week iterations. The project is in Week 4. Use the project brief below for Questions 001–003. Treat each question independently; do not assume that an action from another question has occurred.\n\n| Project information | Approved brief |\n|---|---|\n| Intended outcome | Reduce incorrectly routed cartons by 40% within six weeks of go-live. |\n| Integration milestone | End-to-end testing must finish by the end of Week 8 to support the approved Week 10 commissioning window. |\n| Technical baseline | The equipment configuration and application interface use approved message schema V2. |\n| Team responsibilities | The equipment lead owns equipment readiness. The product owner orders application work. The application team chooses how to implement it. The project manager coordinates the overall project. |\n| Responsibility gap | The responsibility matrix does not name an accountable owner for end-to-end test preparation and coordination. |\n| Decision boundaries | The product owner may reorder application work within approved boundaries. Changes to the equipment interface, commissioning baseline, or cost baseline require change control board approval. |"
    },
    "questions": [
      {
        "n": 1,
        "id": "pmp-set2-001",
        "domain": "People",
        "task": 3,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C01",
        "instruction": "Select ONE answer.",
        "stem": "Two integration rehearsals have failed because neither team prepared the combined test data and equipment configuration. Both teams demonstrate that their own components pass their local tests. Each lead says the other team should coordinate the next rehearsal. What should the project manager do next?",
        "options": [
          [
            "A",
            "Ask the change control board to assign ownership of all remaining integration activities."
          ],
          [
            "B",
            "Bring the teams together to agree one accountable test owner, clarify handoffs, and update their responsibilities."
          ],
          [
            "C",
            "Give the equipment lead authority to set the application team's priorities until integration succeeds."
          ],
          [
            "D",
            "Take over all integration-test coordination personally and retain that responsibility through commissioning."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The exhibit identifies a gap between component responsibility and end-to-end accountability. The project manager should help the teams establish clear ownership and workable handoffs while preserving their existing decision rights.",
        "rationales": {
          "A": "The board controls specified changes; the facts do not require it to resolve this team-level responsibility gap. Escalation would delay an action within project management's remit.",
          "B": "Jointly agreeing an accountable owner and explicit handoffs addresses the cause of the failures and makes the arrangement sustainable.",
          "C": "Equipment expertise does not confer authority over application priorities. This transfers an unrelated decision right without resolving all integration responsibilities.",
          "D": "Taking over could help with an immediate rehearsal, but retaining all coordination through commissioning concentrates dependency on the project manager instead of establishing team ownership."
        },
        "references": [
          "PMBOK 8, Guide §2.6.2.4.1, p. 84 (PDF p. 189): roles, responsibilities, and team operations.",
          "PMBOK 8, Guide §5, p. 194 (PDF p. 299): responsibility assignment matrix.",
          "PMBOK 8, Standard §3.8, pp. 53–54 (PDF pp. 76–77): an empowered culture."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 2,
        "id": "pmp-set2-002",
        "domain": "Process",
        "task": 1,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C01",
        "instruction": "Select ONE answer.",
        "stem": "The application team's current release forecast puts its V2 integration capability at the end of Week 9 because several operator-screen improvements are ordered ahead of it. The equipment team remains on schedule for Week 8 testing. The application team says the V2 work might be split into smaller usable increments, but the teams have not examined this together. What is the best next planning action?",
        "options": [
          [
            "A",
            "Convert the application work to a detailed predictive schedule and freeze its remaining requirements."
          ],
          [
            "B",
            "Keep the local plans and require daily progress reports until the application team recovers the gap."
          ],
          [
            "C",
            "Move integration testing to Week 9 and use the commissioning preparation period to absorb the difference."
          ],
          [
            "D",
            "Jointly examine an earlier usable V2 increment and align both teams' plans to the shared testing milestone."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The local forecasts conflict at a shared dependency. Coordinated planning can test whether a usable integration increment can be delivered sooner without imposing one development approach on both teams. If a viable plan cannot meet the approved milestone, the resulting evidence supports a change decision.",
        "rationales": {
          "A": "A predictive schedule does not by itself solve the dependency, and freezing all requirements discards the tailored hybrid approach without justification.",
          "B": "More frequent reporting may expose the gap, but it does not change work ordering, increment scope, or the dependency plan.",
          "C": "Moving a baselined milestone assumes that preparation time can be consumed safely and bypasses the stated decision process.",
          "D": "This uses the available possibility of smaller increments to reconcile the plans, while retaining appropriate approaches and testing the forecast against the shared milestone."
        },
        "references": [
          "PMBOK 8, Guide §2.1.6.2, pp. 18–19 (PDF pp. 123–124): integrated and aligned project plans.",
          "PMBOK 8, Guide §3.3.1–3.4.1, pp. 104–105 (PDF pp. 209–210): tailoring development approaches and integration."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 3,
        "id": "pmp-set2-003",
        "domain": "Business Environment",
        "task": 3,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "multiple",
        "caseId": "C01",
        "instruction": "Select TWO answers.",
        "stem": "Operations requests a feature that would reduce manual carton checks. The product owner proposes exchanging two application backlog items of equal estimated size to make room. Technical review confirms that the feature also changes message schema V2, requires $18,000 of equipment reconfiguration, and adds three days of integrated testing. Its effect on the commissioning window has not been assessed. Which TWO actions should the project manager take before authorizing implementation?",
        "options": [
          [
            "A",
            "Approve the exchange through the product owner because replacing equally sized backlog items preserves the team's planned workload."
          ],
          [
            "B",
            "Evaluate the combined business value and impacts on equipment, testing, risk, and commissioning with the affected parties."
          ],
          [
            "C",
            "Authorize application development now and submit only the equipment reconfiguration cost for approval before the equipment team proceeds."
          ],
          [
            "D",
            "Keep all current work unchanged and defer the feature until after commissioning because its interface is already baselined."
          ],
          [
            "E",
            "Obtain the change control board's decision on the assessed request before implementing changes to the approved interface."
          ]
        ],
        "correct": [
          "B",
          "E"
        ],
        "explanation": "Equal application estimates do not account for impacts outside that backlog. This request crosses an explicit decision boundary. It needs an integrated assessment and a decision by the authority named in the project brief; its potential value should be considered rather than rejected automatically.",
        "rationales": {
          "A": "Equal estimated size does not establish equal total cost, risk, timing, or business value. Equipment and test impacts are already known.",
          "B": "The assessment must include both workstreams and the intended outcome so that the authorized decision maker can compare credible options.",
          "C": "Beginning the application portion commits work to an unapproved interface change and can create rework or pressure to approve the remainder.",
          "D": "A baseline provides control, not a permanent prohibition on change. Deferral should follow an informed decision, not an automatic rule.",
          "E": "The case explicitly reserves interface and baseline changes for the board. Product-owner backlog authority does not replace that authority."
        },
        "references": [
          "PMBOK 8, Guide §2.1.6.8, pp. 28–30 (PDF pp. 133–135): assessing and implementing changes across predictive and adaptive approaches."
        ],
        "exhibitMarkdown": "",
        "requiredSelections": 2
      },
      {
        "n": 4,
        "id": "pmp-set2-004",
        "domain": "People",
        "task": 4,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "instruction": "Select ONE answer.",
        "stem": "During a clinic refurbishment project, a newly appointed facilities director says the approved layout does not provide enough maintenance access and refuses to support the planned handover. The director was not included in earlier design workshops. The sponsor believes the contractor already represented the facilities team's needs. What should the project manager do first?",
        "options": [
          [
            "A",
            "Meet with the director to understand the operational concerns, assess the stakeholder's influence and needs, and update the engagement approach."
          ],
          [
            "B",
            "Add the requested access changes to the contractor's scope so that the director will support handover."
          ],
          [
            "C",
            "Send the approved workshop minutes and ask the director to accept the decisions made before the appointment."
          ],
          [
            "D",
            "Ask the sponsor to resolve the director's objection before the project team discusses the layout further."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "A stakeholder with relevant operational interests was missed. The first useful action is direct engagement and analysis of the concern. The resulting information can then support technical assessment and, if needed, a controlled change.",
        "rationales": {
          "A": "This establishes what the concern means for operations and gives the project a basis for appropriate engagement and subsequent decisions.",
          "B": "Agreement to change scope is premature before clarifying the need, assessing impacts, and obtaining any required approval.",
          "C": "Prior approval does not demonstrate that the director's operational needs were understood or addressed.",
          "D": "The facts show no failed engagement attempt or authority problem requiring the sponsor to intervene first."
        },
        "references": [
          "PMBOK 8, Guide §2.5.2.1–2.5.2.4, pp. 71–72 (PDF pp. 176–177): stakeholder identification, engagement planning, and engagement management."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 5,
        "id": "pmp-set2-005",
        "domain": "Process",
        "task": 2,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "Select ONE answer.",
        "stem": "A project manager supports a Scrum Team building a customer onboarding service. Before Sprint Planning, finance asks for identity verification before an applicant can save a draft; customer support asks to let applicants save first so they can retrieve missing information. The product owner confirms that both goals matter, but the intended user workflow and acceptance criteria remain unclear. No mandatory rule settles the sequence. What should the project manager do next to help the team prepare the work?",
        "options": [
          [
            "A",
            "Ask the product owner to choose a workflow now and let the team settle its acceptance criteria during implementation."
          ],
          [
            "B",
            "Split the requests into separate backlog items and schedule both, letting users choose their preferred workflow after release."
          ],
          [
            "C",
            "Facilitate a review of user examples and a simple prototype, then help the product owner clarify and order testable backlog items."
          ],
          [
            "D",
            "Have the team estimate both requests and implement the cheaper workflow first, reviewing the other after the Sprint."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The problem is an unresolved need and workflow, not simply a shortage of estimates. Concrete examples and a prototype can expose the distinction between saving a draft and completing verification. Clarified acceptance criteria support informed backlog ordering and selection.",
        "rationales": {
          "A": "The product owner can make priority decisions, but asking for an immediate choice leaves the stated uncertainty unresolved and shifts avoidable discovery into implementation.",
          "B": "Separate items do not resolve conflicting behavior in the same workflow. Committing to both before clarifying the need may create rework.",
          "C": "This develops a shared understanding and testable requirements while keeping backlog ordering with the product owner.",
          "D": "Implementation cost alone does not determine whether a workflow meets the business and user needs."
        },
        "references": [
          "PMBOK 8, Guide §2.2.2.2–2.2.2.3, pp. 40–41 (PDF pp. 145–146): eliciting requirements and defining scope.",
          "PMBOK 8, Guide §4 (Backlog), p. 114 (PDF p. 219): product and iteration backlogs.",
          "Scrum Guide 2020, Product Owner and Sprint Planning: https://scrumguides.org/scrum-guide.html"
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 6,
        "id": "pmp-set2-006",
        "domain": "Business Environment",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "Select ONE answer.",
        "stem": "A project recovery plan requires an $18,000 supplier-expediting charge and $18,000 of additional testing; both are necessary to achieve the recovery. The governance plan lets the project manager approve changes with a total impact up to $25,000. Larger changes require the investment committee, which accepts urgent written requests between meetings. The sponsor offers $36,000 from the business unit and asks the project manager to approve the two charges separately today. The impact assessment is complete. What should the project manager do next?",
        "options": [
          [
            "A",
            "Approve each charge separately because both individual commitments are below the delegated limit."
          ],
          [
            "B",
            "Obtain the sponsor's written funding commitment and place the orders, reporting the combined change at the next meeting."
          ],
          [
            "C",
            "Hold the recovery plan until the committee's next scheduled meeting because the delegated limit is exceeded."
          ],
          [
            "D",
            "Submit the combined $36,000 change through the urgent committee process before committing the expenditure."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The two charges are one interdependent recovery change. The total exceeds the stated delegation, and available funding does not change that delegation. An established urgent route allows a timely decision without dividing the request to avoid the threshold.",
        "rationales": {
          "A": "Separating the purchase amounts does not change the total impact of the integrated change or its approval requirement.",
          "B": "A funding commitment establishes a potential source of money; the case does not grant the sponsor authority to replace the committee's approval.",
          "C": "Waiting for the regular meeting ignores the available urgent process and could unnecessarily delay recovery.",
          "D": "This respects the specified authority and uses the available mechanism for an expedited decision."
        },
        "references": [
          "PMBOK 8, Guide §2.1.2–2.1.4, pp. 11–13 (PDF pp. 116–118): governance models, escalation, and investment control.",
          "PMBOK 8, Guide §2.1.6.8.1, pp. 29–30 (PDF pp. 134–135): designated change authority."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 7,
        "id": "pmp-set2-007",
        "domain": "Process",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "dropdown",
        "caseId": null,
        "instruction": "Select ONE value for the drop-down.",
        "stem": "An agile project's current product goal is to increase the proportion of new customers who complete account activation within seven days from 50% to 70%. User observation and support records identify recovery from a failed identity-document upload on mobile as the largest confirmed barrier. The product owner can prioritize one of the following increments for the next Sprint. The team confirms that each fits its capacity and can meet the Definition of Done; none changes the required security checks. Complete the statement: To test the strongest current opportunity for improving the product goal, prioritize [select one].",
        "options": [
          [
            "A",
            "an internal case-routing dashboard that reduces the time agents spend assigning support tickets"
          ],
          [
            "B",
            "mobile upload recovery that preserves progress and measures subsequent account-activation completion"
          ],
          [
            "C",
            "a desktop-dashboard performance improvement that reduces page-loading time for active customers"
          ],
          [
            "D",
            "an automated document-status email that tells applicants their upload failed and repeats the current upload instructions"
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The chosen increment should address the confirmed barrier and measure its effect on the desired outcome. Mobile recovery provides a usable intervention; activation completion shows whether it produces value beyond a feature being delivered.",
        "rationales": {
          "A": "Faster ticket assignment may help support operations, but it does not directly remove the largest identified barrier in the activation journey.",
          "B": "This addresses the observed failure point and links the increment to measurement of the product goal.",
          "C": "Better performance for already-active customers serves a different outcome from activation of new customers.",
          "D": "Failure notification could improve awareness, but repeating the existing instructions does not repair the confirmed recovery difficulty."
        },
        "references": [
          "PMBOK 8, Standard §3.4–3.4.2, pp. 40–42 (PDF pp. 63–65): outcomes, value, and feedback.",
          "PMBOK 8, Guide §4 (Backlog), p. 114 (PDF p. 219): product backlog."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 8,
        "id": "pmp-set2-008",
        "domain": "People",
        "task": 2,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "matching",
        "caseId": null,
        "instruction": "Match all four situations. Use each response at most once.",
        "stem": "An agile delivery lead encounters four independent situations. Match each situation to the most appropriate immediate conflict response. Use each response at most once; one response will remain unused.",
        "options": [
          [
            "A",
            "Smooth or accommodate"
          ],
          [
            "B",
            "Compromise or reconcile"
          ],
          [
            "C",
            "Withdraw or avoid"
          ],
          [
            "D",
            "Force or direct"
          ],
          [
            "E",
            "Collaborate or problem-solve"
          ]
        ],
        "correct": {
          "1": "E",
          "2": "B",
          "3": "D",
          "4": "A"
        },
        "explanation": "Conflict responses should fit the urgency, consequence, relationship, and opportunity for a durable solution. Collaboration is valuable but is not the best immediate response in every situation.",
        "rationales": {
          "A": "Situation 4: yielding an immaterial preference preserves the relationship without sacrificing a project need. No reciprocal concession is required.",
          "B": "Situation 2: splitting the constrained resource gives each party part of what it requested and an acceptable reduced result.",
          "C": "Unused: none of the situations gives a sound reason to postpone or disengage. The first needs constructive resolution, the second has an immediate workable settlement, and the third requires intervention.",
          "D": "Situation 3: explicit authority and immediate danger make stopping the activity the appropriate first response. Collaborative review can follow after the unsafe situation is controlled.",
          "E": "Situation 1: jointly exploring the valid constraints can produce a durable solution that addresses both perspectives."
        },
        "references": [
          "PMBOK 8, Guide §5, pp. 156–157 (PDF pp. 261–262): conflict management and context-dependent response techniques."
        ],
        "prompts": [
          [
            "1",
            "Two specialists disagree about a long-term test-data approach. Both identify valid constraints, and there is time to develop a solution that addresses both."
          ],
          [
            "2",
            "Two teams need the same demonstration environment today. Each requests four hours, only four hours remain, and both confirm that two hours would allow an acceptable reduced demonstration."
          ],
          [
            "3",
            "During an equipment prototype demonstration, a team member begins a prohibited unsafe action while others debate what to do. The delivery lead has explicit authority to stop the demonstration immediately."
          ],
          [
            "4",
            "A customer strongly prefers one of two equally acceptable, low-impact screen labels. The delivery lead has no material reason to insist on the other label and wants to preserve goodwill."
          ]
        ]
      },
      {
        "n": 9,
        "id": "pmp-set2-009",
        "domain": "Process",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "instruction": "Select ONE answer.",
        "stem": "A project must finish its remaining work within 16 working days. The updated schedule has two paths to completion: A–B–D takes 18 days, and A–C–D takes 17 days. Only the following reductions are feasible: B can be shortened by up to 2 days at $2,000 per day; C by up to 1 day at $2,000 per day; and D by up to 1 day at $6,000 per day. Shortening D affects both paths. The estimates have been validated, and separate specialists can perform the reductions without resource conflicts. Activity A cannot be shortened, and mandatory dependencies prohibit overlapping activities. The project manager has authority to spend up to $6,000 on these recovery actions. Which plan meets the deadline within that authority?",
        "options": [
          [
            "A",
            "Shorten B by 2 days, for an additional cost of $4,000."
          ],
          [
            "B",
            "Shorten B by 2 days and C by 1 day, for an additional cost of $6,000."
          ],
          [
            "C",
            "Shorten B by 1 day and D by 1 day, for an additional cost of $8,000."
          ],
          [
            "D",
            "Shorten B by 1 day and C by 1 day, for an additional cost of $4,000."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "Completion is controlled by the longest remaining path. Shortening B by two days gives a 16-day first path, but the other path would still take 17 days. Reducing C by one day also brings that path to 16 days. The combined cost is $6,000, within the stated authority.\n\n| Option | A–B–D after recovery | A–C–D after recovery | Project duration | Cost | Meets both conditions |\n|---|---:|---:|---:|---:|---|\n| A | 16 days | 17 days | 17 days | $4,000 | No |\n| B | 16 days | 16 days | 16 days | $6,000 | Yes |\n| C | 16 days | 16 days | 16 days | $8,000 | No |\n| D | 17 days | 16 days | 17 days | $4,000 | No |",
        "rationales": {
          "A": "The paths become 16 and 17 days. The project still finishes in 17 days, even though its original critical path has been shortened sufficiently.",
          "B": "The paths become 16 and 16 days, and the cost is 2 × $2,000 + $2,000 = $6,000. Both conditions are satisfied.",
          "C": "The paths become 16 and 16 days, but $8,000 exceeds the existing $6,000 authority. The question does not authorize assuming additional approval.",
          "D": "The paths become 17 and 16 days. The lower cost does not compensate for missing the deadline."
        },
        "references": [
          "PMBOK 8, Guide §5, pp. 196–197 (PDF pp. 301–302): schedule compression and iterative schedule network analysis."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 10,
        "id": "pmp-set2-010",
        "domain": "Business Environment",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "Select ONE answer.",
        "stem": "A project has an approved contingency response for a critical pump delivery: if shipment is not confirmed by 14 days before the required delivery date, the logistics lead will activate a qualified alternate supplier. The response reserves $9,000 and authorizes the project manager to release those funds when the trigger occurs. Shipment was not confirmed at the trigger date. The logistics lead has verified that the plan's assumptions remain valid and the alternate can meet the requirement for $8,500 if instructed today. The original supplier says confirmation may arrive tomorrow. What should the project manager do next?",
        "options": [
          [
            "A",
            "Authorize the logistics lead to activate the agreed response, update the risk information, and monitor the result."
          ],
          [
            "B",
            "Wait for the required delivery date to be missed before using the contingency funds."
          ],
          [
            "C",
            "Request fresh sponsor approval for the $8,500 before allowing the logistics lead to act."
          ],
          [
            "D",
            "Repeat the full quantitative risk analysis and choose between suppliers after it is complete."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The defined trigger has occurred, the relevant assumptions have been checked, and the response remains feasible within its approved authority and reserve. The project manager should enable timely execution and monitor the resulting exposure.",
        "rationales": {
          "A": "This follows the agreed trigger, owner, funding, and authority while retaining monitoring and documentation.",
          "B": "The trigger was deliberately set before actual delivery failure. Waiting until the impact occurs defeats the timing of the planned response.",
          "C": "The case already grants the required authority. A new approval cycle is unnecessary unless a relevant limit or condition has changed.",
          "D": "There is no stated change that warrants delaying the validated response for a full new analysis; delay could lose the viable alternate."
        },
        "references": [
          "PMBOK 8, Guide §2.7.2.4–2.7.2.6, pp. 96–99 (PDF pp. 201–204): planning, implementing, and monitoring risk responses.",
          "PMBOK 8, Guide §5, corrected p. 157: contingent response strategies. Apply PMI second-printing errata, PDF pp. 1 and 5: https://www.pmi.org/-/media/pmi/documents/public/pdf/pmbok-standards/pg8-errata---second-printing.pdf"
        ],
        "exhibitMarkdown": ""
      }
    ]
  },
  {
    "number": 2,
    "sourcePage": "https://chatgpt.com/space/page_34e0ea7833088191a53eed9453741709",
    "caseStudy": {
      "id": "C02",
      "title": "Passenger service rollout",
      "markdown": "A regional transport operator is rolling out a standardized passenger-assistance process at three terminals using a predictive implementation plan. The next milestone is an operational rehearsal. Use the approved brief and Friday's verified staff-assessment results for Questions 011–013. Answer each question independently.\n\n| Project information | Approved brief |\n|---|---|\n| Outcome | Reduce the time passengers wait for assistance while maintaining service quality. |\n| Rehearsal entry criteria | At least 75% of all assigned staff must have passed the practical assessment, and at least 60% must have passed at each terminal. Both conditions are required. |\n| Evidence rule | Count each assigned person once. Attendance, message delivery, and a manager's acknowledgement do not count as a practical-assessment pass. |\n| Current communication | A weekly procedure update is emailed to terminal managers for distribution. Frontline staff work different shifts and have access to shared workstations. |\n| Organizational context | Terminal managers control shift assignments and coaching time. Their current performance measures emphasize short individual transaction times. |\n\n**Friday staff assessment results**\n\n| Terminal | Assigned staff | Staff who passed |\n|---|---:|---:|\n| North | 10 | 10 |\n| Central | 30 | 15 |\n| South | 60 | 45 |"
    },
    "questions": [
      {
        "n": 11,
        "id": "pmp-set2-011",
        "domain": "People",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C02",
        "instruction": "**Select ONE answer.**",
        "stem": "All three terminal managers acknowledge receiving the latest procedure update. A walkthrough then finds that several late-shift staff are using an obsolete procedure. The staff explain that they did not see the update and assumed their local supervisor would brief them. What should the project manager do next?",
        "options": [
          [
            "A",
            "Issue the same update daily and use the managers' delivery acknowledgements as the communication measure."
          ],
          [
            "B",
            "Ask managers to post the document at each workstation and treat publication as confirmation that staff understand it."
          ],
          [
            "C",
            "Agree a shift-accessible briefing and current-document route with the managers, then verify understanding through staff feedback."
          ],
          [
            "D",
            "Escalate the late-shift staff's noncompliance to the sponsor and request enforcement of the emailed procedure."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "A delivered message has not reached the people who need to apply it. The project manager should tailor the channel and timing to the shifts, clarify distribution responsibility, and check whether staff understand the current procedure. This communication check complements, rather than replaces, the practical assessment.",
        "rationales": {
          "A": "Increasing frequency on the same route does not resolve the access and ownership gap, and a manager's acknowledgement does not establish staff understanding.",
          "B": "Accessible documentation helps, but publication alone still does not show that the intended recipients received and understood the change.",
          "C": "This addresses both access and the missing feedback loop while working with the managers who control the local communication arrangements.",
          "D": "The facts indicate a communication failure, not an informed refusal to comply. Immediate enforcement would leave that cause unresolved."
        },
        "references": [
          "PMBOK 8, Guide §2.5.2.3–2.5.2.7, pp. 72–74 (PDF pp. 177–179): planning, managing, and monitoring communications.",
          "PMBOK 8, Guide §2.5.3.1, p. 77 (PDF p. 182): tailoring methods and detail to stakeholder needs."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 12,
        "id": "pmp-set2-012",
        "domain": "Process",
        "task": 9,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": "C02",
        "instruction": "**Select ONE answer.**",
        "stem": "The sponsor asks for the overall practical-assessment pass rate and whether the project currently meets the staff-readiness criteria for the rehearsal. Using the approved criteria and Friday's results, which report is accurate?",
        "options": [
          [
            "A",
            "The overall pass rate is 70%; readiness is not met because the overall threshold and Central's terminal threshold are both missed."
          ],
          [
            "B",
            "The overall pass rate is 75%; readiness is met because the average of the three terminal percentages meets the overall threshold."
          ],
          [
            "C",
            "The overall pass rate is 70%; readiness is met because most assigned staff have passed and every terminal has some qualified staff."
          ],
          [
            "D",
            "The overall pass rate is 75%; readiness is not met because Central alone fails the terminal threshold."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "There are 70 passes among 100 assigned staff, so the overall pass rate is 70%. Terminal rates are North 100%, Central 50%, and South 75%. The project misses the 75% overall requirement, and Central also misses its 60% requirement. Averaging terminal percentages equally would incorrectly give a ten-person terminal the same weight as a sixty-person terminal.",
        "rationales": {
          "A": "This uses the person-based denominator and applies both mandatory readiness conditions.",
          "B": "The equal-weight average is 75%, but the approved metric counts people. It also overlooks Central's separate mandatory threshold.",
          "C": "The 70% calculation is right, but neither a simple majority nor the presence of some qualified staff is the approved entry criterion.",
          "D": "The conclusion that readiness is not met is right, but the overall percentage is wrong and it understates the number of failed conditions."
        },
        "references": [
          "PMBOK 8, Guide §2.1.6.7, p. 26 (PDF p. 131): evaluating performance against the plan and communicating status.",
          "PMBOK 8, Guide §2.1.3, p. 13 (PDF p. 118): meaningful metrics and feedback for governance."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 13,
        "id": "pmp-set2-013",
        "domain": "Business Environment",
        "task": 7,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C02",
        "instruction": "**Select ONE answer.**",
        "stem": "Interviews show that staff can explain why the new assistance process is needed. However, managers release few staff for coached practice because it temporarily increases transaction times, which worsens their current performance results. Managers ask staff to revert to the faster old process during busy periods. What is the most effective next action for the project manager?",
        "options": [
          [
            "A",
            "Increase the frequency of benefit presentations so that managers and staff become more aware of the rollout's purpose."
          ],
          [
            "B",
            "Work with the sponsor and operations leaders to reconcile transition capacity and performance expectations with the new process."
          ],
          [
            "C",
            "Ask staff to complete the remaining practice outside their shifts so that existing terminal performance measures remain unaffected."
          ],
          [
            "D",
            "Retain both procedures indefinitely and allow each manager to choose whichever produces the best local transaction-time result."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The obstacle is a conflict between the organizational measures, available practice time, and the intended change. Awareness already exists. Operations leaders and the sponsor need to help create feasible transition arrangements and consistent expectations; the project manager should not unilaterally change line-management measures.",
        "rationales": {
          "A": "The interviews establish understanding of the purpose. More awareness messages do not address the incentive and capacity barriers.",
          "B": "This engages the people who can adjust organizational conditions that are undermining adoption and aligns local behavior with the intended outcome.",
          "C": "Moving practice outside shifts assumes availability and authority that are not stated, and it leaves the conflicting performance expectations in place.",
          "D": "Indefinite local choice undermines the standardized rollout and preserves the cause of inconsistent adoption."
        },
        "references": [
          "PMBOK 8, Guide §3.4.2, pp. 106–107 (PDF pp. 211–212): alignment with organizational context and cross-group tailoring.",
          "PMBOK 8, Guide §3.4.3.3, p. 109 (PDF p. 214): culture, support, trust, and empowerment.",
          "PMBOK 8, Standard §3.8.1, p. 54 (PDF p. 77): processes, organizational structures, and team agreements."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 14,
        "id": "pmp-set2-014",
        "domain": "People",
        "task": 5,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "An agile team's roadmap forecasts a customer feature in six to eight weeks. A sales representative has described the earliest date to a customer as a firm commitment, and the customer is planning a promotion around it. No contractual delivery date has been agreed. The forecast and its assumptions have not changed. What should the project manager do first?",
        "options": [
          [
            "A",
            "Replace the forecast range with an eight-week date so that the customer receives a single conservative commitment."
          ],
          [
            "B",
            "Ask the team to work additional hours until the feature can be guaranteed within six weeks."
          ],
          [
            "C",
            "Leave the roadmap unchanged and address the misunderstanding only if the six-week date becomes unattainable."
          ],
          [
            "D",
            "Bring sales and the product owner together to reconcile the customer's expectation with the forecast and agree an accurate update."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "A forecast has been communicated as a commitment. The immediate task is to align the people responsible for the product and customer relationship on what is supported by the evidence, then correct the expectation promptly.",
        "rationales": {
          "A": "The end of a forecast range is not automatically a guaranteed date. A unilateral wording change also avoids the necessary expectation discussion.",
          "B": "Extra hours do not establish a credible guarantee and impose a solution before the uncertainty and customer options have been discussed.",
          "C": "The mismatch is already known and affects customer planning. Delaying the conversation can magnify its consequences.",
          "D": "This directly addresses the misunderstanding with the relevant decision makers and supports a clear, timely customer message."
        },
        "references": [
          "PMBOK 8, Guide §2.5.1–2.5.2.4, pp. 68–72 (PDF pp. 173–177): stakeholder expectations and engagement.",
          "PMBOK 8, Guide §2.5.2.3, p. 72 (PDF p. 177): aligned communication planning."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 15,
        "id": "pmp-set2-015",
        "domain": "Process",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "A hybrid project combines a contracted equipment installation with an iteratively developed analytics service. The contract administrator confirms that the supplier's current equipment milestone meets every agreed acceptance criterion. The contract requires that accepted milestone to be paid independently of any newly requested work. During a demonstration, a business stakeholder asks the supplier for additional training reports and urges the project manager to hold the milestone payment until they are included. What should the project manager do?",
        "options": [
          [
            "A",
            "Hold the milestone payment and use it to negotiate the additional reports within the existing price."
          ],
          [
            "B",
            "Coordinate acceptance and payment under the current agreement, and address the new reports through the authorized contract-change process."
          ],
          [
            "C",
            "Reclassify the missing reports as quality defects so the supplier must provide them before the milestone is accepted."
          ],
          [
            "D",
            "Ask the product owner to put the reports into the software backlog and inform the supplier that this updates its obligations."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The current obligation and the new request must be handled according to the agreement stated in the question. Stakeholder feedback can identify useful additional work, but it does not retroactively redefine a supplier's accepted milestone or authorize contract changes.",
        "rationales": {
          "A": "Withholding payment for unrelated new work contradicts the stated agreement and creates avoidable supplier conflict.",
          "B": "This fulfills the existing agreement while providing an appropriate route to evaluate and negotiate the additional request.",
          "C": "The contract administrator has confirmed compliance with all existing criteria. A new request is not evidence that those criteria were breached.",
          "D": "Product backlog ordering can guide the software work, but it does not itself amend the separate supplier agreement."
        },
        "references": [
          "PMBOK 8, Guide §2.1.6.3, pp. 19–21 (PDF pp. 124–126): sourcing decisions and agreements.",
          "PMBOK 8, Appendix X4 §X4.8, p. 250 (PDF p. 355): contracts as the basis of financial arrangements and relationships.",
          "PMBOK 8, Appendix X4 §X4.9.1, p. 253 (PDF p. 358): understanding contract terms and preventing disputes."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 16,
        "id": "pmp-set2-016",
        "domain": "Business Environment",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "multiple",
        "caseId": null,
        "instruction": "**Select TWO answers.**",
        "stem": "A hybrid public-service project must publish a multilingual summary of stakeholder workshops tomorrow. The team proposes using an external AI service approved by the organization only for public information. The workshop notes contain names, small-community locations, and sensitive individual circumstances. A team member offers to remove names before uploading them. A trial translation of a public sample also changes a mandatory instruction into an optional suggestion. Which TWO actions should the project manager take before proceeding?",
        "options": [
          [
            "A",
            "Remove names and upload the remaining notes because direct identifiers are the only information restricted by the tool's approval."
          ],
          [
            "B",
            "Confirm permitted data use with the responsible data and security owners and use only input authorized for the selected environment."
          ],
          [
            "C",
            "Obtain the vendor's standard confidentiality promise and treat it as permission to process the workshop notes in the service."
          ],
          [
            "D",
            "Arrange qualified review of critical meaning and required instructions against the approved source before publishing the translated summary."
          ],
          [
            "E",
            "Publish the AI translation with a general accuracy disclaimer so that stakeholders can report any important errors afterward."
          ]
        ],
        "correct": [
          "B",
          "D"
        ],
        "explanation": "There are two separate issues: whether the input may be processed in the proposed environment, and whether the output faithfully communicates the approved information. Removing names does not establish that the remaining material is public or non-identifying. The observed translation error also requires validation before release.",
        "rationales": {
          "A": "Locations and individual circumstances may still identify people or remain sensitive. The service's approval does not extend automatically to the modified notes.",
          "B": "This applies the organization's data-use boundaries and permits an appropriate choice of authorized content and processing environment.",
          "C": "A vendor promise does not replace the organization's approval or establish that the proposed use is permitted.",
          "D": "A reviewer must verify substantive meaning, particularly required instructions, rather than relying on fluency or the AI output's confident wording.",
          "E": "A disclaimer does not correct the known risk of materially changing instructions and shifts detection of preventable errors to recipients."
        },
        "references": [
          "PMBOK 8, Guide §2.5.3, p. 75 (PDF p. 180): security and ethics when using AI for stakeholder communications.",
          "PMBOK 8, Appendix X3 §X3.3, pp. 239 and 243–244 (PDF pp. 344 and 348–349): privacy, accountability, validation, and organizational AI policies."
        ],
        "exhibitMarkdown": "",
        "requiredSelections": 2
      },
      {
        "n": 17,
        "id": "pmp-set2-017",
        "domain": "Process",
        "task": 10,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "A hybrid project has delivered new laboratory equipment and an application configured through several iterations. The customer has accepted the deliverables. The transition plan also requires an operations owner, a tested recovery procedure, and demonstrated ability of the support team to use it. The owner is named and the procedure is documented, but support staff have not demonstrated recovery. A sponsor asks the project manager to close the project now because the expected benefits will be tracked by operations over the next year. What should the project manager do next?",
        "options": [
          [
            "A",
            "Arrange and verify the remaining recovery exercise, then confirm transition readiness and complete the applicable closure activities."
          ],
          [
            "B",
            "Close immediately because customer acceptance establishes that every project and operational exit criterion has been satisfied."
          ],
          [
            "C",
            "Keep the full project team assigned until all benefits have been measured over the following year."
          ],
          [
            "D",
            "Transfer the untested procedure to the named owner and record the recovery exercise as an optional operational improvement."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "Customer acceptance and operational readiness are related but separate conditions in this project. One required transition activity remains. Completing it supports closure without unnecessarily retaining the project until all future benefits are realized.",
        "rationales": {
          "A": "This closes the specific readiness gap and then allows a controlled transition and project closure.",
          "B": "Acceptance does not override the additional exit criteria stated in the transition plan.",
          "C": "Benefits can be monitored after transition by their designated owners. The facts do not justify retaining the full team for a year.",
          "D": "Assigning an owner and transferring documentation do not demonstrate the capability expressly required by the plan."
        },
        "references": [
          "PMBOK 8, Guide §2.1.6.9, pp. 31–32 (PDF pp. 136–137): exit criteria, knowledge transfer, and transition to operations.",
          "PMBOK 8, Standard §3.4, pp. 40–41 (PDF pp. 63–64): value may be realized after project completion."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 18,
        "id": "pmp-set2-018",
        "domain": "Business Environment",
        "task": 6,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "matching",
        "caseId": null,
        "instruction": "**Matching.**",
        "stem": "An agile team uses retrospectives to improve its delivery process. Match each independent situation to the best next improvement action. Use each response at most once; one response will remain unused.",
        "options": [
          [
            "A",
            "Run a bounded trial with an owner and an explicit success measure."
          ],
          [
            "B",
            "Reassess the changed conditions and adapt or retest the improvement."
          ],
          [
            "C",
            "Seek a policy exception before experimenting outside a mandatory control."
          ],
          [
            "D",
            "Examine the recurring problem's evidence and underlying causes with the team."
          ],
          [
            "E",
            "Embed the validated practice and share the results and relevant context."
          ]
        ],
        "correct": {
          "1": "D",
          "2": "A",
          "3": "E",
          "4": "B"
        },
        "explanation": "An improvement cycle connects evidence, a selected experiment, measured results, and continued adaptation. Recording a lesson is useful when it changes decisions or practice and remains sensitive to context.",
        "rationales": {
          "A": "Situation 2: the cause is understood but the proposed solution is untested, so a controlled experiment can establish whether it works.",
          "B": "Situation 4: changed work may invalidate earlier assumptions. The team should review the new conditions rather than protect an obsolete solution.",
          "C": "Unused: no situation proposes breaching a mandatory control. In Situation 2 the trial is expressly permitted within existing rules.",
          "D": "Situation 1: selecting a countermeasure before examining the disputed cause risks treating the wrong problem.",
          "E": "Situation 3: evidence supports retaining the practice and sharing its conditions and results, without assuming that every other team must adopt it unchanged."
        },
        "references": [
          "PMBOK 8, Guide §3.4.4, p. 109 (PDF p. 214): ongoing improvement through inspection and adaptation.",
          "PMBOK 8, Guide §4, p. 123 (PDF p. 228): lessons learned and organizational reuse.",
          "PMBOK 8, Guide §5, p. 194 (PDF p. 299): retrospectives."
        ],
        "prompts": [
          [
            "1",
            "The same handoff delay has occurred in three iterations. People disagree about its cause, and the team has not examined the underlying workflow evidence."
          ],
          [
            "2",
            "The team has validated the cause of a delay and identified two feasible countermeasures, but neither has been tried. It can safely test one within existing rules."
          ],
          [
            "3",
            "A process trial has met its agreed success measure for three iterations without unwanted side effects. The team wants to retain the improvement and help similar teams learn from it."
          ],
          [
            "4",
            "A previously effective improvement no longer meets its success measure after the work mix changes. The assumptions supporting the original solution may no longer hold."
          ]
        ]
      },
      {
        "n": 19,
        "id": "pmp-set2-019",
        "domain": "Process",
        "task": 7,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "At the end of a Sprint, a reporting feature passes all of its functional acceptance examples. However, it fails the response-time check in the team's current Definition of Done, which incorporates a mandatory organizational quality standard. The product owner likes the feature and asks the team to mark it Done for a customer announcement while placing the performance work in the next Sprint. What is the best response?",
        "options": [
          [
            "A",
            "Mark the feature Done because the product owner's approval takes priority over a technical completion check."
          ],
          [
            "B",
            "Mark it Done with a performance exception and count the remaining work only against the next Sprint."
          ],
          [
            "C",
            "Keep the feature incomplete, make the unmet quality requirement visible, and return the work to the backlog for consideration."
          ],
          [
            "D",
            "Lower the Definition of Done for this Sprint and restore the response-time requirement after the announcement."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Passing functional examples does not satisfy an unmet Definition of Done. The mandatory quality check remains applicable, and the incomplete work must be represented transparently. Backlog consideration does not automatically commit the next Sprint to a particular solution.",
        "rationales": {
          "A": "Product-owner preference does not remove the applicable completion and quality requirements.",
          "B": "Adding an exception label while recording the feature as Done misrepresents its state and moves unfinished quality work out of the reported item.",
          "C": "This preserves the quality requirement and an accurate account of completed work while allowing the remaining work to be ordered appropriately.",
          "D": "A temporary reduction would conflict with the mandatory organizational standard and would not make the feature meet the existing quality requirement."
        },
        "references": [
          "PMBOK 8, Guide §2.2.2.5, p. 42 (PDF p. 147): measuring deliverables against quality requirements.",
          "Scrum Guide 2020, Increment and Definition of Done: [official guide](https://scrumguides.org/scrum-guide.html)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 20,
        "id": "pmp-set2-020",
        "domain": "People",
        "task": 4,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "hotspot",
        "caseId": null,
        "instruction": "**Hotspot. Select ONE current marker.**",
        "stem": "A predictive facilities project has one targeted stakeholder meeting available today before a readiness decision in three days. Use the role information and engagement matrix below. Select the CURRENT engagement marker of the stakeholder whose engagement gap most directly threatens that near-term decision.",
        "options": [
          [
            "A",
            "R1 — Supportive (Executive sponsor)"
          ],
          [
            "B",
            "R2 — Resistant (Operations manager)"
          ],
          [
            "C",
            "R3 — Neutral (User advisory chair)"
          ],
          [
            "D",
            "R4 — Supportive (Data owner)"
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The operations manager has both an engagement gap and an immediate, necessary role in the readiness decision. The meeting should explore the operating concerns and seek an evidence-based resolution. Resistance is a signal to understand the concern, not proof that the stakeholder is unreasonable.",
        "rationales": {
          "A": "The sponsor has a gap from supportive to leading, but is already supportive and has no stated decision due in three days. Seniority alone does not make this meeting the highest priority.",
          "B": "The current resistance is linked to unresolved concerns that block a required near-term endorsement. This makes the marked cell the appropriate target.",
          "C": "The chair has a gap, but its influence concerns a later advisory review rather than the immediate readiness decision.",
          "D": "The data owner has a near-term role, but current and desired engagement already match and the stated handover evidence is supported."
        },
        "references": [
          "PMBOK 8, Guide §2.5.2.1–2.5.2.2, p. 71 (PDF p. 176): engagement based on stakeholder impact and needs.",
          "PMBOK 8, Guide §5, p. 200 (PDF p. 305): current and desired engagement assessment."
        ],
        "exhibitMarkdown": "| Row | Stakeholder | Role and timing |\n|---|---|---|\n| R1 | Executive sponsor | Supports the business case; the next sponsor funding decision is in four weeks. |\n| R2 | Operations manager | Must endorse operational readiness in three days; unresolved operating concerns currently prevent endorsement. |\n| R3 | User advisory chair | Provides recommendations for a later usability review; has no approval role in the upcoming decision. |\n| R4 | Data owner | Must confirm the data handover in three days; has reviewed the evidence and supports the proposed handover. |",
        "hotspotType": "engagement",
        "exhibit": {
  "headers": [
    "Stakeholder",
    "Unaware",
    "Resistant",
    "Neutral",
    "Supportive",
    "Leading"
  ],
  "rows": [
    [
      "R1 — Executive sponsor",
      "—",
      "—",
      "—",
      "C",
      "D"
    ],
    [
      "R2 — Operations manager",
      "—",
      "C",
      "—",
      "D",
      "—"
    ],
    [
      "R3 — User advisory chair",
      "—",
      "—",
      "C",
      "D",
      "—"
    ],
    [
      "R4 — Data owner",
      "—",
      "—",
      "—",
      "C / D",
      "—"
    ]
  ]
}
      }
    ]
  },
  {
    "number": 3,
    "sourcePage": "https://chatgpt.com/space/page_0213866ed09c8191819e96bbc95dc1ab",
    "caseStudy": {
      "id": "C03",
      "title": "Dealer returns portal",
      "markdown": "An agile team is improving a manufacturer's dealer returns portal in two-week iterations. The product owner and dealer representatives have agreed on the product outcome. The team controls how it organizes its work. Use the following exhibit for Questions 021–023. Treat each question independently; do not assume an answer to one question has already been implemented.\n\n| Evidence | Details |\n|---|---|\n| Agreed outcome | Raise the proportion of return requests accepted without a request for missing information from 52% to 80%. |\n| Recent results | Completed backlog items rose from 12 in the previous iteration to 18 in the latest iteration. Requests accepted without clarification rose from 52% to 53%. Team members describe success mainly as finishing more items. |\n| Next iteration's work | Rules configuration requires 3 specialist-days. Regression execution requires 3 person-days and can be done by the specialist or a trained analyst. These estimates include all necessary preparation; no additional review effort is required. |\n| People available | The specialist has 4 days available. An analyst already qualified to execute the regression tests has 4 days available. Other developers have spare capacity but are not qualified for either activity. Both activities can be scheduled within the iteration using these availability windows. |\n| Design disagreement | One experienced developer favors a guided form to reduce omissions; another favors an editable grid to preserve experienced dealers' speed. Dealer observations show that new and experienced users have different difficulties. Neither design has been tested with both groups. The disagreement is becoming personal. |\n| Experiment allowance | A one-day prototype comparison is already funded and does not consume the specialist or analyst capacity above. There is no emergency requiring an immediate design decision. |"
    },
    "questions": [
      {
        "n": 21,
        "id": "pmp-set2-021",
        "domain": "People",
        "task": 1,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C03",
        "instruction": "**Use Case C03.** **Select ONE answer.**",
        "stem": "At the iteration review, team members point to the increase in completed items as evidence that the project is succeeding. The product owner is concerned about the dealer outcome. What should the project leader do next to restore a shared understanding of success?",
        "options": [
          [
            "A",
            "Ask the product owner to replace the outcome target with an item-completion target that the team can directly control."
          ],
          [
            "B",
            "Coach the team to increase completed items again before discussing whether the dealer outcome is improving."
          ],
          [
            "C",
            "Ask the product owner to retain the outcome target but let the team continue defining success solely by completed items."
          ],
          [
            "D",
            "Facilitate a discussion with the team and product owner connecting the agreed outcome to the recent results and the purpose of upcoming work."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The exhibit shows a gap between the agreed purpose and the team's working definition of success. A shared discussion makes that misunderstanding explicit and connects delivery choices to the dealer outcome. More completed items can be useful delivery information, but it does not establish that the intended outcome has improved.",
        "rationales": {
          "A": "This changes the definition of success to fit a convenient activity measure without evidence that the dealer need has changed.",
          "B": "Additional throughput could repeat the same mismatch. The existing result is sufficient reason to discuss the purpose now.",
          "C": "Separate definitions preserve the misunderstanding. The team needs to understand how its work contributes to the shared outcome.",
          "D": "Correct. It uses the actual results to reconnect the team and product owner around the agreed purpose before drawing conclusions about the next work."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4.1, p. 84 and §2.6.2.4.2, p. 86 (PDF pp. 189 and 191). The Standard for Project Management, §3.4, pp. 40–42 (PDF pp. 63–65)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 22,
        "id": "pmp-set2-022",
        "domain": "Process",
        "task": 4,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": "C03",
        "instruction": "**Use Case C03.** **Select ONE answer.**",
        "stem": "During planning, the team initially proposes giving both listed activities to the specialist because that person performed them in the previous iteration. Which allocation should the project leader help the team evaluate first to complete both activities within the stated capacity?",
        "options": [
          [
            "A",
            "Assign both activities to the specialist and plan to absorb the additional effort through the specialist's unused capacity."
          ],
          [
            "B",
            "Assign the configuration to the specialist and regression execution to the qualified analyst, coordinating the work within their availability."
          ],
          [
            "C",
            "Assign configuration to developers with spare capacity and leave regression execution with the specialist."
          ],
          [
            "D",
            "Assign regression execution to the specialist and defer configuration, preserving the previous division of responsibilities."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The specialist cannot perform six days of work within four available days. The qualified analyst can perform the three days of regression execution, leaving three of the specialist's four days for configuration. This uses demonstrated competence and actual availability while preserving both activities.",
        "rationales": {
          "A": "The specialist has only one day left after configuration, not the three days needed for regression execution.",
          "B": "Correct. Both assignments fit the stated skill and capacity constraints; the team should coordinate their sequence and availability.",
          "C": "Spare time is not a substitute for the configuration competence required in the exhibit.",
          "D": "Deferral is unnecessary when the available qualified analyst enables both activities to fit."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §§2.6.2.2–2.6.2.3, pp. 82–84 (PDF pp. 187–189)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 23,
        "id": "pmp-set2-023",
        "domain": "People",
        "task": 2,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C03",
        "instruction": "**Use Case C03.** **Select ONE answer.**",
        "stem": "The two developers ask the project leader to settle the design disagreement. Given the exhibit, which response best addresses both the conflict and the delivery decision?",
        "options": [
          [
            "A",
            "Reestablish respectful discussion, help the developers agree on outcome-based comparison criteria, and use the funded prototype session with both dealer groups."
          ],
          [
            "B",
            "Choose the guided form because reducing omissions is the stated outcome, then ask the other developer to support the decision."
          ],
          [
            "C",
            "Combine half of each proposed design so both developers can see their preferred approach represented."
          ],
          [
            "D",
            "Ask the product owner to choose between the untested designs immediately, then coach the developers to accept the choice."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The disagreement contains potentially useful information about different users, but its personal tone must be addressed. The available experiment makes a collaborative, evidence-based comparison feasible. A facilitated comparison can evaluate completeness and usability without treating seniority, compromise, or escalation as a substitute for evidence.",
        "rationales": {
          "A": "Correct. It addresses conduct and turns competing positions into a test of shared criteria using the time and resources already available.",
          "B": "The desired outcome does not prove that the guided form is the better design for both user groups.",
          "C": "Splitting the design by preference can introduce complexity without resolving which elements serve users.",
          "D": "A forced choice bypasses a feasible learning opportunity and leaves the source of the disagreement unresolved."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Conflict management, pp. 156–157 (PDF pp. 261–262), and Resources tailoring considerations, p. 89 (PDF p. 194)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 24,
        "id": "pmp-set2-024",
        "domain": "People",
        "task": 3,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "On a predictive equipment-installation project, an engineer has successfully led several comparable work packages. After one recent coordination error, the engineer asks the project manager to approve every routine sequencing decision. The engineer still has the required authority and skills, and there is no immediate safety or delivery threat. What is the best initial response?",
        "options": [
          [
            "A",
            "Provide a detailed sequence for the next work package so the engineer can rebuild confidence by following it."
          ],
          [
            "B",
            "Tell the engineer to resume independent decisions immediately and discuss confidence at the next performance review."
          ],
          [
            "C",
            "Discuss the setback privately, ask the engineer to work through options and decision limits, and agree on a short follow-up."
          ],
          [
            "D",
            "Introduce temporary approval of every decision until the engineer completes another work package without error."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The facts point to a confidence setback rather than missing technical competence or authority. Coaching helps the engineer reason through the problem and resume appropriate independence, with a proportionate follow-up. The leadership response should fit the person's demonstrated ability and current needs.",
        "rationales": {
          "A": "Supplying the solution may be useful for someone lacking capability, but here it reinforces dependence without first exploring the setback.",
          "B": "It reasserts autonomy without providing support for the immediate difficulty.",
          "C": "Correct. Questions, clear decision limits, and follow-up support independent problem solving without taking over routine work.",
          "D": "Universal approval adds control where the stated need is confidence and can make the dependency more persistent."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4, p. 84 (PDF p. 189), and Coaching and mentoring, p. 151 (PDF p. 256)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 25,
        "id": "pmp-set2-025",
        "domain": "Process",
        "task": 6,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "A predictive implementation project has a budget at completion of $600,000, earned value of $300,000, and actual cost of $360,000. An investigation confirms that the $60,000 overrun came from a one-time onboarding problem that has been resolved. The team has now validated a bottom-up estimate of $315,000 for ALL remaining authorized work, including the remaining coaching and testing. The current cost baseline has not been changed. Which completion-cost forecast and response are best supported?",
        "options": [
          [
            "A",
            "Forecast $600,000 and retain it until the governing body approves a higher cost baseline."
          ],
          [
            "B",
            "Forecast $660,000 by adding the remaining budgeted work to actual cost, and report a $60,000 expected overrun."
          ],
          [
            "C",
            "Forecast $675,000, report the $75,000 difference from the current budget, and route any proposed baseline or funding changes through governance."
          ],
          [
            "D",
            "Forecast $720,000 using the cumulative cost performance index, and report a $120,000 expected overrun."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The validated remaining-work estimate is the strongest stated basis for the forecast: EAC = actual cost + bottom-up estimate to complete = $360,000 + $315,000 = $675,000. That is $75,000 above the $600,000 budget. A forecast reports expected reality; it does not by itself authorize a revised baseline or additional funding.",
        "rationales": {
          "A": "An approved baseline and a current forecast serve different purposes. Waiting for approval before reporting the forecast hides the expected variance.",
          "B": "$360,000 + ($600,000 − $300,000) = $660,000 assumes remaining work can be done for $300,000 and ignores the validated $315,000 estimate.",
          "C": "Correct. It uses the full remaining estimate once, reports the variance, and preserves the distinction between forecasting and change authorization.",
          "D": "CPI = $300,000 / $360,000 = 0.8333; BAC / CPI = $720,000. That extrapolation assumes continuing cost efficiency, whereas the scenario identifies a resolved one-time cause and a validated new estimate."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Earned Value Analysis, Table 5-1, p. 209 (PDF p. 314); Bottom-up estimating, p. 149 (PDF p. 254); §2.1.6.7, p. 26 (PDF p. 131)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 26,
        "id": "pmp-set2-026",
        "domain": "Business Environment",
        "task": 4,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "multiple",
        "caseId": null,
        "instruction": "**Select TWO answers.**",
        "stem": "A hybrid project has a fixed deployment milestone and iterative software development. A shared identity service is already unavailable, blocking end-to-end testing. Two coordination attempts have failed because its owner is prioritizing another project. The agreed escalation rule requires a program-level decision after two days of unresolved cross-project blockage; three days have passed. The team can use an approved mock service, within the current budget, to continue some functional tests, but this cannot validate real authentication or replace final end-to-end testing. Which TWO actions should the project manager take now?",
        "options": [
          [
            "A",
            "Escalate the documented impact and priority trade-off to the program decision maker, requesting an accountable owner and a restoration commitment."
          ],
          [
            "B",
            "Record the dependency only as a future risk, since the deployment milestone has not yet been missed."
          ],
          [
            "C",
            "Pause all software work until the identity service is available, preserving the planned sequence of testing."
          ],
          [
            "D",
            "Use successful mock-service tests to close the impediment and remove real-service testing from the deployment forecast."
          ],
          [
            "E",
            "Use the mock service for the permitted tests while keeping the dependency open, tracking restoration and the remaining real-service validation."
          ]
        ],
        "correct": [
          "A",
          "E"
        ],
        "explanation": "This is an active issue, and the agreed escalation threshold has been reached after local attempts failed. The project manager should seek the cross-project priority decision from the person authorized to make it. The approved mock can reduce the impact meanwhile, but it cannot resolve or prove the real integration dependency.",
        "rationales": {
          "A": "Correct. It uses the established escalation path with decision-relevant facts and seeks concrete ownership and timing.",
          "B": "The blockage has already occurred. Treating it only as a possible future event understates its current effect.",
          "C": "The stated approved workaround allows useful testing to continue; stopping all work adds avoidable delay.",
          "D": "A mock tests only the permitted functional behavior. Closing the issue or removing required real-service testing would misrepresent readiness.",
          "E": "Correct. It combines partial mitigation with continued issue tracking and preserves the remaining validation obligation."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §§2.1.2–2.1.4, pp. 11–13 (PDF pp. 116–118); §2.1.6.7, p. 26 (PDF p. 131); Issue log, p. 123 (PDF p. 228). PMP Examination Content Outline, July 2026, Business Environment Task 4, p. 11."
        ],
        "exhibitMarkdown": "",
        "requiredSelections": 2
      },
      {
        "n": 27,
        "id": "pmp-set2-027",
        "domain": "People",
        "task": 7,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "A hybrid modernization project uses planned data-conversion milestones and iteratively developed interfaces. Its most experienced conversion specialist will leave in nine working days. Two backups can execute the documented routine steps, but the specialist resolves unusual records using judgment that is absent from the checklist. Several exception types are expected at the next milestone. What should the project manager prioritize during the remaining overlap?",
        "options": [
          [
            "A",
            "Ask the specialist to finish the difficult conversions while the backups maintain throughput on routine records."
          ],
          [
            "B",
            "Record a demonstration of one routine conversion and have the backups acknowledge that they understand the recording."
          ],
          [
            "C",
            "Ask the specialist to expand the checklist, then use a written recall test to confirm that the backups remember the steps."
          ],
          [
            "D",
            "Pair the backups with the specialist on representative exceptions, make the reasoning explicit, and have the backups resolve further cases with feedback."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The missing capability is context-dependent judgment, not familiarity with routine steps. Working through representative exceptions exposes the specialist's reasoning. Having backups then apply it provides evidence of transfer and reveals remaining gaps while the specialist is still available. Useful rules and examples should be captured as part of that work.",
        "rationales": {
          "A": "It can improve immediate throughput while leaving the critical capability concentrated in the departing person.",
          "B": "A routine demonstration and acknowledgment do not address the exception-handling gap.",
          "C": "Additional documentation can help, but recalling steps does not show that the backups can interpret unfamiliar exceptions.",
          "D": "Correct. Interaction, explicit reasoning, practice, and feedback address the tacit knowledge needed for the upcoming milestone."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.6, pp. 25–26 (PDF pp. 130–131), and §2.6.2.4.1, p. 84 (PDF p. 189)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 28,
        "id": "pmp-set2-028",
        "domain": "Process",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "A predictive commissioning project has one qualified engineer available for one full activity at a time. Activity A requires three consecutive working days and must finish by the end of Day 5 for an external review on the morning of Day 6. Activity B requires two consecutive working days and must finish by the end of Day 2. Both can start on Day 1, have no dependency on each other, and currently appear as starting on Day 1. All numbered days are working days. Moving A within Days 1–5 is within its approved float and the project manager's scheduling authority. Which response resolves the resource conflict without additional cost or a missed commitment?",
        "options": [
          [
            "A",
            "Schedule B on Days 1–2 and A on Days 3–5, then coordinate the revised assignments with the affected stakeholders."
          ],
          [
            "B",
            "Schedule A on Days 1–3 and B on Days 4–5 because the longer activity should be protected first."
          ],
          [
            "C",
            "Keep both Day 1 starts and allocate half of each day to each activity, retaining the original durations."
          ],
          [
            "D",
            "Request a second engineer immediately because simultaneous early starts cannot be changed without rebaselining."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "B has the earlier binding completion requirement. Completing B on Days 1–2 leaves three consecutive days for A on Days 3–5, preserving the Day 6 review. This uses the available scheduling flexibility to resolve overallocation without changing the stated commitments or adding resources.",
        "rationales": {
          "A": "Correct. It meets both durations and deadlines with one engineer and uses A's permitted float.",
          "B": "B would finish three working days after its required Day 2 completion.",
          "C": "The engineer cannot perform both full-time efforts at once. Splitting effort while retaining the same elapsed durations is not supported.",
          "D": "The scenario explicitly permits moving A within its float, so an extra engineer or rebaseline is unnecessary."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Resource optimization technique, pp. 193–194 (PDF pp. 298–299)."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 29,
        "id": "pmp-set2-029",
        "domain": "Business Environment",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "instruction": "**Select ONE answer.**",
        "stem": "A predictive service-platform project is on schedule for deployment in eight months. Its business case assumes three years of operation. A technology provider now confirms that a required interface will be discontinued in nine months. The project team notes that the interface will still work at deployment and proposes continuing unchanged. What should the project manager do first?",
        "options": [
          [
            "A",
            "Continue the approved plan and let operations evaluate a replacement after the project transfers the platform."
          ],
          [
            "B",
            "Assess the discontinuation's effect on operating benefits, feasible alternatives, cost, and schedule with the relevant owners, then bring the findings to the sponsor."
          ],
          [
            "C",
            "Direct the team to replace the interface immediately with the newest available technology before assessing the effect on the baseline."
          ],
          [
            "D",
            "Request project cancellation because the original technology assumption has changed."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "A deployment date alone does not establish that the project will deliver the expected operating value. The confirmed external change undermines a key life-cycle assumption. The project manager should assess its effects and feasible responses with those responsible for delivery and operation before recommending a governance decision.",
        "rationales": {
          "A": "The business case depends on operation beyond the interface's remaining life; deferring the impact assessment ignores a known threat to that value.",
          "B": "Correct. It investigates the external change across the operating and delivery horizons and provides a basis for an informed decision.",
          "C": "A replacement may be appropriate, but selecting and implementing it before assessing impacts and obtaining required authorization is premature.",
          "D": "Cancellation is one possible outcome of reassessment, not a conclusion supported solely by the announcement."
        },
        "references": [
          "The Standard for Project Management, §2.2.1.2, p. 19 (PDF p. 42), and §3.4, pp. 40–42 (PDF pp. 63–65). PMBOK Guide, Eighth Edition, Guide §2.1.6.7, p. 26 (PDF p. 131). PMP Examination Content Outline, July 2026, Business Environment Task 8, p. 12."
        ],
        "exhibitMarkdown": ""
      },
      {
        "n": 30,
        "id": "pmp-set2-030",
        "domain": "Process",
        "task": 7,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": null,
        "instruction": "**Select TWO answers.**",
        "stem": "A hybrid rollout combines scheduled field installations with iterative configuration work. Final checks repeatedly find missing configuration fields, causing rework and installation delays. The team has confirmed that the fields and checking method are clear, but preparers skip checks because recognition is based only on records submitted. Failed records are currently contained and cannot be installed. Which TWO changes best address the recurring causes while maintaining the existing quality requirements?",
        "options": [
          [
            "A",
            "Make the final inspector permanently responsible for correcting missing fields while leaving the preparation workflow and recognition unchanged."
          ],
          [
            "B",
            "Work with the team and functional manager to include the agreed checks in the preparation workflow and recognize first-pass quality alongside output."
          ],
          [
            "C",
            "Give preparers a refresher on the unchanged field definitions while retaining the submission-only recognition measure."
          ],
          [
            "D",
            "Move all preparation to the highest-output team member, using the existing submission count as evidence of capability."
          ],
          [
            "E",
            "Trial required-field validation at entry, verify that it catches the known omissions, and monitor first-pass results and rework before broader adoption."
          ]
        ],
        "correct": [
          "B",
          "E"
        ],
        "explanation": "The known causes concern how work is performed and rewarded, not an unclear specification. Integrating checks and aligning recognition supports the desired behavior. Testing validation at entry adds prevention close to the source of the defect, and measuring the result checks whether the change actually improves quality. Existing containment remains necessary while improvements are evaluated.",
        "rationales": {
          "A": "This transfers rework to inspection and preserves the conditions producing the defects. It may contain errors but is not the best lasting response to the stated causes.",
          "B": "Correct. It connects normal work and recognition to conformance rather than rewarding submission volume alone.",
          "C": "Training is useful when knowledge is missing. Here definitions and methods are understood; unchanged incentives leave the identified behavior driver in place.",
          "D": "The throughput measure does not establish first-pass quality, and concentrating work does not address the skipped checks.",
          "E": "Correct. It evaluates a preventive control against the actual defect pattern and measures its effect before scaling it."
        },
        "references": [
          "The Standard for Project Management, §3.5 and §3.5.1, pp. 43–44 (PDF pp. 66–67). PMBOK Guide, Eighth Edition, Guide §2.6.2.4.2, p. 86 (PDF p. 191)."
        ],
        "exhibitMarkdown": "",
        "requiredSelections": 2
      }
    ]
  },
  {
    "number": 4,
    "sourcePage": "https://chatgpt.com/space/page_021f1aa2f6b08191a3e966dc7148089d",
    "caseStudy": {
      "id": "C04",
      "title": "Distribution-center sorting upgrade",
      "intro": "A distribution center is completing a predictive upgrade to its carton-sorting line. Use the acceptance and decision record below for Questions 031–033. Each question is independent; do not assume that any answer to an earlier question has been implemented.",
      "exhibit": [
        [
          "Approved requirement R1",
          "Process at least 240 cartons per hour using the specified carton mix. The witnessed test achieved 252 cartons per hour."
        ],
        [
          "Approved requirement R2",
          "Retain fault records for 60 days and retrieve records throughout that period. The submitted verification report demonstrates retrieval only for records from the most recent 7 days; it contains no evidence for older records."
        ],
        [
          "Approved requirement R3",
          "Provide the specified supervisor dashboard and operating instructions. These have been delivered and verified against their documented criteria."
        ],
        [
          "User feedback",
          "During a usability trial, several night-shift supervisors found it difficult to locate the correct fault-recovery instruction. Their tasks and search difficulties have not yet been investigated. A day-shift representative considers the instructions adequate."
        ],
        [
          "Configuration finding",
          "An engineer added automatic weekly diagnostic emails, which are absent from the approved scope. The feature is in the release candidate but has not been deployed. The engineer reports no extra development cost; effects on support, recipient management, and the approved configuration have not been assessed."
        ],
        [
          "Decision rules",
          "The operations director formally accepts deliverables after the agreed requirements are demonstrated. The change control board authorizes scope additions. Zero incremental development cost does not exempt an addition from review. The project manager coordinates assessment and recommendations."
        ]
      ]
    },
    "questions": [
      {
        "n": 31,
        "id": "pmp-set2-031",
        "domain": "Process",
        "task": 2,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C04",
        "stem": "The vendor describes R2 as complete because the log-retention setting is configured to 60 days. Before presenting R2 for acceptance, what should the project manager do?",
        "options": [
          [
            "A",
            "Present R2 for acceptance using the configuration setting as the missing evidence, since the recent-record retrieval test succeeded."
          ],
          [
            "B",
            "Ask the change control board to authorize a new 60-day retrieval requirement before requesting any additional verification."
          ],
          [
            "C",
            "Record the verification gap and arrange appropriate evidence against the existing 60-day retention and retrieval requirement."
          ],
          [
            "D",
            "Approve R2 provisionally and plan to collect any missing evidence after operations starts using the line."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The approved requirement already covers the full retention period. The current report demonstrates only a narrower portion of it. A setting alone does not demonstrate retention and retrieval across the specified period. The team should obtain suitable verification evidence under its agreed test approach before claiming that R2 is satisfied.",
        "rationales": {
          "A": "The setting shows intended configuration, while the report does not demonstrate the required behavior for older records.",
          "B": "The 60-day requirement is already approved. Treating its verification as a new scope request misclassifies the gap.",
          "C": "Correct. It preserves the approved requirement and addresses the missing evidence without assuming the function has necessarily failed.",
          "D": "The case provides no authority for provisional acceptance in place of the required evidence."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §§2.2.2.5–2.2.2.6, pp. 42–44 (PDF pp. 147–149); Requirements traceability matrix, p. 131 (PDF p. 236)."
        ],
        "difficultyReason": "Distinguishes an unverified requirement from a new requirement or a demonstrated defect."
      },
      {
        "n": 32,
        "id": "pmp-set2-032",
        "domain": "People",
        "task": 6,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C04",
        "stem": "The day-shift representative asks the project manager to close the night-shift feedback because R3 has met its documented criteria. What should the project manager do next?",
        "options": [
          [
            "A",
            "Close the feedback using the verification result and reopen it only if the operations director rejects the delivered instructions."
          ],
          [
            "B",
            "Commit to redesigning the instructions for night-shift use before confirming which tasks are causing difficulty."
          ],
          [
            "C",
            "Collect a majority vote from supervisors and use it to decide whether the night-shift concern warrants investigation."
          ],
          [
            "D",
            "Explore the night-shift tasks and difficulties, assess the effect on intended use, and agree how to evaluate and respond to the feedback."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "Conformance to documented criteria does not eliminate the need to monitor users' expectations and satisfaction. The project manager should investigate the specific use difficulty and its effect. That evidence can distinguish a clarification, training need, defect, or proposed enhancement before deciding on a response and any necessary authorization.",
        "rationales": {
          "A": "Formal criteria matter, but using them to dismiss uninvestigated user feedback can leave an important operational need unaddressed.",
          "B": "A redesign is a premature solution. The cause and the appropriate response have not been established.",
          "C": "The frequency of votes does not establish whether a particular shift can perform its necessary tasks effectively.",
          "D": "Correct. It follows up on actual user experience while avoiding an unsupported commitment to new work."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.1, pp. 68–69 (PDF pp. 173–174), and §2.5.2.4, p. 72 (PDF p. 177).",
          "PMP Examination Content Outline, July 2026, People Task 6, p. 7."
        ],
        "difficultyReason": "Distinguishes satisfaction monitoring from acceptance evidence and from an automatic scope commitment."
      },
      {
        "n": 33,
        "id": "pmp-set2-033",
        "domain": "Business Environment",
        "task": 3,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": "C04",
        "stem": "The sponsor likes the diagnostic-email addition and asks the project manager to include it in deployment because the engineer reports no extra development cost. Which response best follows the case's decision rules?",
        "options": [
          [
            "A",
            "Keep the unapproved feature out of deployment authorization, assess its full impacts, and obtain the board's decision on including it or restoring the approved configuration."
          ],
          [
            "B",
            "Include the feature using the sponsor's preference as acceptance, then ask support staff to address recipient management after deployment."
          ],
          [
            "C",
            "Remove the feature immediately and declare the restored release ready without checking whether its removal affects the verified configuration."
          ],
          [
            "D",
            "Include the feature after a functional email test, then update the scope record to document the configuration that was deployed."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The sponsor's preference and the reported development cost do not replace the authority rule. The addition can create support and configuration consequences, and removing it may also require controlled work and verification. The project manager should prevent unapproved deployment, assess the disposition options, and obtain the required decision before promoting the release.",
        "rationales": {
          "A": "Correct. It respects the stated authority while addressing the consequences of both retention and removal.",
          "B": "The sponsor has not been given authority to bypass the board; support implications should inform the decision rather than be deferred.",
          "C": "Restoring the baseline may be appropriate, but declaring readiness without checking the resulting configuration is unsupported.",
          "D": "A functional test does not authorize new scope. Updating records after deployment would not substitute for the required prior decision."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.8, pp. 28–30 (PDF pp. 133–135), and Change control tools, p. 151 (PDF p. 256)."
        ],
        "difficultyReason": "Integrates authorization, configuration status, life-cycle impacts, and the verification implications of an apparently free addition."
      },
      {
        "n": 34,
        "id": "pmp-set2-034",
        "domain": "Process",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "quantitative": true,
        "stem": "An agile product team has capacity for 10 effort units before its next release. The product owner and stakeholders have agreed on the benefit points below. Benefits are additive and count only for fully completed, usable items. F has no standalone benefit but is a prerequisite for A. The same team estimated every item and confirmed that any package within 10 units can be sequenced within the release, including F before A. There are no mandatory items or other dependencies, and risk is comparable. Which package offers the highest total benefit among the choices while respecting these constraints?",
        "exhibit": {
          "headers": [
            "Item",
            "Effort units",
            "Benefit points",
            "Dependency"
          ],
          "rows": [
            [
              "F: Shared foundation",
              "3",
              "0",
              "None"
            ],
            [
              "A: Automated reconciliation",
              "5",
              "90",
              "F must also be completed"
            ],
            [
              "S: Search improvement",
              "4",
              "48",
              "None"
            ],
            [
              "G: Guided entry",
              "3",
              "36",
              "None"
            ],
            [
              "N: Notifications",
              "2",
              "16",
              "None"
            ]
          ]
        },
        "options": [
          [
            "A",
            "A and S"
          ],
          [
            "B",
            "S, G, and N"
          ],
          [
            "C",
            "F, A, and G"
          ],
          [
            "D",
            "F, A, and N"
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "F + A + N uses 3 + 5 + 2 = 10 effort units and delivers 0 + 90 + 16 = 106 benefit points. It includes the prerequisite and has higher benefit than the feasible S + G + N package, which yields 100 points. The decision must evaluate feasible combinations, not a feature's benefit in isolation.",
        "rationales": {
          "A": "The listed items use 9 units but omit A's prerequisite. Adding F would bring the package to 12 units, above capacity.",
          "B": "This package is feasible at 9 units and 100 points, but it delivers fewer points than D.",
          "C": "This package includes the prerequisite and yields 126 points, but its 11 units exceed capacity.",
          "D": "Correct. It respects the dependency and capacity and has the highest benefit among the feasible choices."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Backlog management, p. 149 (PDF p. 254), and Prioritization/ranking, p. 187 (PDF p. 292)."
        ],
        "difficultyReason": "Requires comparing combined benefits and capacity while recognizing that a prerequisite with no standalone benefit remains essential."
      },
      {
        "n": 35,
        "id": "pmp-set2-035",
        "domain": "People",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid rollout has a fixed equipment installation date and an iteratively delivered operator application. Operations, maintenance, and finance have each labeled all of their application requests 'must have.' The team has shown that the requests cannot all fit before installation. No safety, compliance, or contractual requirement is disputed, but the stakeholders have not agreed what business consequences justify a launch requirement. What should the project manager do first?",
        "options": [
          [
            "A",
            "Ask the team to select the requests with the smallest estimates and present the resulting launch scope for endorsement."
          ],
          [
            "B",
            "Facilitate agreement on launch outcomes and prioritization criteria, using each request's consequences and dependencies to make the trade-offs explicit."
          ],
          [
            "C",
            "Allocate one-third of the available capacity to each department so every group receives an equal share."
          ],
          [
            "D",
            "Ask the sponsor to choose a department whose entire list will take priority before clarifying the launch consequences."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The stakeholders are using the same priority label without a common decision basis. They need an agreed understanding of the launch outcomes and what happens if a request is deferred. Explicit criteria and dependencies support meaningful trade-offs; unresolved decisions can then go to the appropriate authority with useful evidence.",
        "rationales": {
          "A": "Effort is relevant, but selecting easy work first does not establish whether it supports the required launch outcomes.",
          "B": "Correct. It aligns expectations before treating competing labels as a usable priority order.",
          "C": "Equal capacity shares can look fair while overlooking different business consequences and cross-department dependencies.",
          "D": "The sponsor may need to resolve a remaining trade-off, but selecting an entire department's list before clarifying consequences is premature."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.4, p. 72 (PDF p. 177); §§2.2.2.2–2.2.2.3, pp. 40–41 (PDF pp. 145–146); Prioritization/ranking, p. 187 (PDF p. 292)."
        ],
        "difficultyReason": "Requires aligning the basis for prioritization before choosing work, dividing capacity, or escalating a poorly framed decision."
      },
      {
        "n": 36,
        "id": "pmp-set2-036",
        "domain": "Business Environment",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": null,
        "requiredSelections": 2,
        "stem": "A hybrid customer-service modernization uses a planned data migration and iterative application releases. Its approved organizational policy requires case content to be deleted after 24 months, while a minimal consent-audit record must be retained for seven years without retaining the case content. A backlog item says 'retain all customer records for seven years.' Before this item is approved for implementation, which TWO actions should the project manager coordinate?",
        "options": [
          [
            "A",
            "Work with the policy owner and team to distinguish the record types and define testable retention and deletion requirements for each."
          ],
          [
            "B",
            "Use seven years for both record types because selecting the longer period is the more conservative compliance approach."
          ],
          [
            "C",
            "Include evidence of case-content deletion and permitted audit-record retention in the acceptance tests, traced to the approved policy."
          ],
          [
            "D",
            "Apply 24-month deletion to every customer-related record because minimizing retained data satisfies both objectives."
          ],
          [
            "E",
            "Accept the backlog wording and let the migration supplier's standard retention configuration determine the detailed behavior."
          ]
        ],
        "correct": [
          "A",
          "C"
        ],
        "explanation": "The policy specifies different behavior for two kinds of record. The broad backlog wording obscures that distinction and could lead to noncompliance. Requirements should make the distinction explicit, and verification should demonstrate both required behaviors. This question uses the stated organizational policy; it does not rely on an unstated jurisdiction's law.",
        "rationales": {
          "A": "Correct. It translates the existing policy into precise requirements with the responsible owner involved.",
          "B": "Longer retention is not automatically safer. It would contradict the case-content deletion requirement.",
          "C": "Correct. Traceable acceptance evidence is needed for both deletion and the restricted audit record's continued retention.",
          "D": "Deleting the audit record after 24 months would contradict the stated seven-year requirement.",
          "E": "A supplier default does not demonstrate compliance with the specific organizational policy."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §§2.2.2.2–2.2.2.3, pp. 40–41 (PDF pp. 145–146), and Requirements traceability matrix, p. 131 (PDF p. 236).",
          "PMP Examination Content Outline, July 2026, Business Environment Task 2, p. 11."
        ],
        "difficultyReason": "Requires satisfying two different information obligations through both precise requirements and verification."
      },
      {
        "n": 37,
        "id": "pmp-set2-037",
        "domain": "People",
        "task": 4,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "An agile team is developing a scheduling application for staff on several shifts. The product owner invites user representatives to each review, but night-shift representatives rarely attend because the meeting occurs during their protected rest period. They later raise workflow needs that the day-shift representatives did not identify. What should the project leader do?",
        "options": [
          [
            "A",
            "Keep the review arrangements unchanged because every user group already receives the same invitation."
          ],
          [
            "B",
            "Ask day-shift representatives to approve requirements for all shifts so feedback can be consolidated quickly."
          ],
          [
            "C",
            "Agree on practical feedback arrangements with the night-shift representatives and connect their input to the product owner's refinement decisions."
          ],
          [
            "D",
            "Defer the night-shift input until a final all-staff acceptance event to avoid disrupting the iteration cadence."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "An invitation does not create effective participation when the timing predictably excludes a user group. The leader should work with that group on practical engagement, such as accessible review timing or additional feedback channels, and ensure the product owner can use the findings. The scenario does not require changing the duration of iterations.",
        "rationales": {
          "A": "Equal invitations do not address the observed barrier to meaningful participation.",
          "B": "The scenario already shows that the other shift's representatives do not capture all affected users' needs.",
          "C": "Correct. It removes the participation barrier and connects stakeholder engagement to requirements decisions.",
          "D": "Waiting until final acceptance loses opportunities to learn and adapt before substantial work is completed."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.4, p. 72 (PDF p. 177), and Stakeholders tailoring considerations, p. 77 (PDF p. 182)."
        ],
        "difficultyReason": "Applies stakeholder engagement to a clear and documented participation barrier."
      },
      {
        "n": 38,
        "id": "pmp-set2-038",
        "domain": "Process",
        "task": 2,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "matching",
        "caseId": null,
        "stem": "A predictive project team is organizing its scope information. Match each need to the MOST directly suitable artifact. Use each artifact at most once; one artifact will remain unused.",
        "prompts": [
          [
            "1",
            "Document the project's major deliverables, boundaries, assumptions, and explicit exclusions."
          ],
          [
            "2",
            "Record the detailed work description, responsible organization, and acceptance criteria for work package 2.3."
          ],
          [
            "3",
            "Show the hierarchical decomposition of the project's total scope into deliverables and work packages."
          ],
          [
            "4",
            "Link each requirement to its business origin, the deliverable that satisfies it, and its verification coverage."
          ]
        ],
        "options": [
          [
            "A",
            "WBS dictionary"
          ],
          [
            "B",
            "Requirements traceability matrix"
          ],
          [
            "C",
            "Risk register"
          ],
          [
            "D",
            "Project scope statement"
          ],
          [
            "E",
            "Work breakdown structure (WBS)"
          ]
        ],
        "correct": {
          "1": "D",
          "2": "A",
          "3": "E",
          "4": "B"
        },
        "explanation": "These artifacts serve related but distinct needs: the scope statement sets boundaries; the WBS structures the work; its dictionary adds component-level detail; and traceability links requirements to their origin, delivery, and verification.",
        "rationales": {
          "A": "Need 2. The dictionary supplies detail about a named WBS component; the hierarchy alone does not provide all of that detail.",
          "B": "Need 4. The traceability matrix connects requirements to their source and the evidence and deliverables that address them.",
          "C": "Unused. The risk register records identified uncertainty and related risk information, rather than providing these scope structures or requirement links.",
          "D": "Need 1. The scope statement provides the project boundaries, deliverables, assumptions, constraints, and exclusions.",
          "E": "Need 3. The WBS is the hierarchical decomposition of total project scope; it is distinct from its supporting dictionary."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.2.1, p. 38 (PDF p. 143); §2.2.2.4, p. 42 (PDF p. 147); Project scope statement, p. 128 (PDF p. 233); Requirements traceability matrix, p. 131 (PDF p. 236); WBS dictionary, p. 140 (PDF p. 245)."
        ],
        "difficultyReason": "Applies the distinct purposes of four related scope artifacts to practical information needs."
      },
      {
        "n": 39,
        "id": "pmp-set2-039",
        "domain": "Business Environment",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid inspection project plans a fixed hardware installation while developing label-recognition software iteratively. The design assumes that the selected camera and software can read glossy labels under the site's actual lighting. This has not been tested. A nonreturnable camera order must be placed in two weeks, and a representative trial can be completed in three working days before that commitment. The trial is within the project's approved risk-response allowance. What should the project manager do next?",
        "options": [
          [
            "A",
            "Place the order now to protect the installation date and use a later software iteration to address any recognition problems."
          ],
          [
            "B",
            "Assign ownership of the uncertainty and conduct the representative trial before ordering, using the result to confirm or revise the response."
          ],
          [
            "C",
            "Cancel the camera-based requirement because an untested assumption should not remain in the project's scope."
          ],
          [
            "D",
            "Keep the assumption in the risk register and defer action until the first integrated installation test provides real evidence."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The uncertainty threatens a requirement and is about to become harder to address because of the nonreturnable purchase. A timely representative trial can reduce that uncertainty before commitment. Assigning ownership and using the result to choose the next action makes the risk response active rather than merely documented.",
        "rationales": {
          "A": "Later software work may not remedy a camera or lighting limitation, and the purchase would narrow the available responses.",
          "B": "Correct. It uses the available response capacity to test the critical assumption before the irreversible procurement commitment.",
          "C": "Uncertainty warrants assessment and a proportionate response, not automatic elimination of the requirement.",
          "D": "Recording a risk is insufficient when a feasible early action can materially reduce exposure before commitment."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §§2.7.2.2–2.7.2.4, p. 96 (PDF p. 201), and §§2.7.2.5–2.7.2.6, p. 98 (PDF p. 203)."
        ],
        "difficultyReason": "Requires timing a response around an approaching commitment and distinguishing uncertainty reduction from later correction."
      },
      {
        "n": 40,
        "id": "pmp-set2-040",
        "domain": "Process",
        "task": 9,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "dropdown",
        "caseId": null,
        "stem": "An agile team's burnup record shows a steady rate of completed work over four iterations. The total estimated work in the targeted release has increased each iteration because the product owner has added newly discovered requirements. The team's estimation scale and completion criteria have stayed consistent. A sponsor says that the widening gap proves the team has become less productive. Complete the statement with the BEST response.\n\nThe project leader should explain that [SELECT ONE RESPONSE].",
        "options": [
          [
            "A",
            "the widening gap proves lower productivity, so the team should increase its estimate of how much it can finish next iteration"
          ],
          [
            "B",
            "the steady completion rate guarantees the original release date, so the new requirements do not affect the forecast"
          ],
          [
            "C",
            "the scope increase invalidates all prior completion data, so a forecast must wait until the backlog stops changing"
          ],
          [
            "D",
            "completion throughput is steady while release scope is growing, so the forecast and scope trade-offs should be reviewed with the product owner"
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The record separates completed work from the amount targeted for the release. A growing gap can arise from added scope even when completion throughput remains steady. The project leader should make both trends visible and support a current forecast and scope discussion. The evidence does not, by itself, prove a decline in productivity or guarantee a date.",
        "rationales": {
          "A": "The conclusion ignores the stated stable completion rate and added release scope; simply increasing a forecast does not create capacity.",
          "B": "Additional targeted work can affect completion timing even if the team's throughput is unchanged.",
          "C": "Changing scope does not make observed completion data useless. Forecasts can be updated with explicit scope assumptions and uncertainty.",
          "D": "Correct. It distinguishes the two trends and connects the evidence to a release decision without promising a fixed outcome."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Burnup chart, p. 150 (PDF p. 255); Visual controls, pp. 213–214 (PDF pp. 318–319); §2.1.6.7, p. 26 (PDF p. 131)."
        ],
        "difficultyReason": "Interprets completion and scope trends separately instead of attributing a widening gap to team performance alone."
      }
    ]
  },
  {
    "number": 5,
    "sourcePage": "https://chatgpt.com/space/page_a61f085abd8c8191abb78dd02d3b2d1e",
    "caseStudy": {
      "id": "C05",
      "title": "Library service transition",
      "intro": "A library network is replacing its lending-service platform. Data migration and cutover follow a predictive plan; the application is developed iteratively. All numbered days below are working days. A full-day activity starts on the next working day after all its predecessors finish. Use this record for Questions 041–043, answering each independently.",
      "exhibit": [
        [
          "Application",
          "The integration-ready application is forecast to be available at the end of Day 6. Its workstream reports green against that commitment."
        ],
        [
          "Data extract",
          "The approved source extract is forecast to be available at the end of Day 8. Its workstream reports green against that commitment."
        ],
        [
          "Conversion validation",
          "Requires 2 full working days after the source extract is available. It cannot overlap extraction. Resources are available when required."
        ],
        [
          "Integrated rehearsal",
          "Requires 2 full working days after BOTH conversion validation and application readiness. It cannot overlap either prerequisite. Resources are available when required."
        ],
        [
          "Cutover calendar",
          "Cutover may start only at the beginning of Day 11 or Day 16. The rehearsal must be complete by the end of the preceding working day. Day 11 is the approved target; no other window is available in this period."
        ],
        [
          "Reporting",
          "The sponsor sees separate green workstream indicators and assumes the Day 11 cutover is on track. The summary does not show the links between the workstreams and cutover."
        ],
        [
          "Organizational transition",
          "Awareness presentations are complete. Experienced branch staff understand the service benefits but worry that centralized exception handling will remove their ability to resolve local patron problems. New decision rights and exception-escalation arrangements have not been agreed."
        ]
      ]
    },
    "questions": [
      {
        "n": 41,
        "id": "pmp-set2-041",
        "domain": "Process",
        "task": 8,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": "C05",
        "quantitative": true,
        "stem": "The sponsor offers to accelerate application readiness from the end of Day 6 to the end of Day 4. No other duration, dependency, or cutover rule would change. Which assessment is correct?",
        "options": [
          [
            "A",
            "Acceleration enables Day 11 cutover because the application would be ready two working days earlier."
          ],
          [
            "B",
            "The rehearsal still finishes at the end of Day 12, making Day 16 the earliest available cutover window."
          ],
          [
            "C",
            "The rehearsal can finish at the end of Day 10, so Day 11 remains feasible without accelerating the application."
          ],
          [
            "D",
            "The rehearsal finishes at the end of Day 12, allowing cutover to start on Day 13."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The extract is ready at the end of Day 8. Conversion validation therefore occupies Days 9–10. The rehearsal then occupies Days 11–12 because it must follow validation and application readiness. Moving application readiness to Day 4 does not change the controlling data sequence. Day 11 is too early, and Day 16 is the next permitted window.",
        "rationales": {
          "A": "It accelerates a prerequisite that is already ready before conversion validation finishes; the controlling sequence is unchanged.",
          "B": "Correct. It respects both finish-to-start relationships and the allowed cutover calendar.",
          "C": "This would overlap the rehearsal with conversion validation, which the case explicitly prohibits.",
          "D": "Day 13 follows the rehearsal, but it is not an available cutover window."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.3.2.2, pp. 49–53 (PDF pp. 154–158), and §2.3.3.1, p. 55 (PDF p. 160)."
        ],
        "difficultyReason": "Combines converging dependencies, full-day counting, a restricted calendar, and the effect of accelerating a noncontrolling prerequisite."
      },
      {
        "n": 42,
        "id": "pmp-set2-042",
        "domain": "People",
        "task": 8,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C05",
        "stem": "The sponsor asks why the workstream indicators can be green while the cutover may be at risk. What should the project manager do to improve the status communication?",
        "options": [
          [
            "A",
            "Replace every workstream indicator with the worst indicator so all stakeholders receive a consistent color."
          ],
          [
            "B",
            "Keep the existing summary and add more frequent emails from each workstream using its current reporting basis."
          ],
          [
            "C",
            "Explain what each indicator measures and report the linked readiness forecast, key assumptions, and decisions needed for cutover."
          ],
          [
            "D",
            "Keep the summary green until a workstream misses its own commitment, then explain the cutover consequences."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The workstreams may be meeting their own commitments while the integrated plan does not support cutover. Effective reporting should distinguish local progress from readiness of the combined service and make the dependencies and forecast visible. More reports with the same missing connections would not resolve the misunderstanding.",
        "rationales": {
          "A": "A common color alone removes useful distinctions without explaining the dependency problem or the decision required.",
          "B": "Greater frequency does not correct an inadequate basis for the sponsor's interpretation.",
          "C": "Correct. It aligns the information with the sponsor's release decision while preserving meaningful workstream detail.",
          "D": "The integrated forecast can reveal a problem before any local commitment is missed; waiting would delay useful communication."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §§2.5.2.3–2.5.2.5, pp. 72–73 (PDF pp. 177–178), and §2.1.6.7, p. 26 (PDF p. 131)."
        ],
        "difficultyReason": "Distinguishes accurate local status from an accurate integrated message and rejects frequency or color consistency as sufficient fixes."
      },
      {
        "n": 43,
        "id": "pmp-set2-043",
        "domain": "Business Environment",
        "task": 7,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C05",
        "stem": "The sponsor proposes repeating the awareness presentation to address branch staff's reluctance to adopt the new service. Which action would best address the concern documented in the case?",
        "options": [
          [
            "A",
            "Work with branch staff and operations leaders to clarify future decision rights and exception paths, then rehearse representative local situations and gather feedback."
          ],
          [
            "B",
            "Repeat the benefits presentation and measure attendance to determine whether the branches are ready to adopt the service."
          ],
          [
            "C",
            "Ask the application team to add unrestricted local overrides before the operations model is agreed."
          ],
          [
            "D",
            "Wait until after cutover to define exception handling, when staff will have experience with the live service."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "Staff already understand the benefits. Their concern is how the organizational change affects their ability to do their work. Clarifying responsibilities and escalation paths with affected staff, then trying realistic situations, addresses that concern and provides evidence of adoption readiness. Neither a presentation nor an unapproved technical workaround resolves the operating-model gap.",
        "rationales": {
          "A": "Correct. It addresses the actual change in authority and work practices through involvement, clarity, and practical feedback.",
          "B": "Attendance measures exposure to communication, not whether the unresolved role concern has been addressed.",
          "C": "An unrestricted override assumes a solution and could conflict with the operating model before it is defined.",
          "D": "Deferring the arrangement until live operation exposes staff and patrons to avoidable uncertainty at transition."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.4, p. 72 (PDF p. 177); §2.6.2.4.1, p. 84 (PDF p. 189); §3.4.3.3, p. 109 (PDF p. 214).",
          "PMP Examination Content Outline, July 2026, Business Environment Task 7, p. 12."
        ],
        "difficultyReason": "Diagnoses an organizational-role concern rather than treating every adoption problem as a lack of awareness."
      },
      {
        "n": 44,
        "id": "pmp-set2-044",
        "domain": "People",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A Scrum team has met recent release forecasts by working several consecutive weekends. Escaped defects and unplanned absences are now increasing. A business sponsor asks the project leader to make weekend work the standard approach for the next three months so that every requested feature can retain its current target date. What is the best response?",
        "options": [
          [
            "A",
            "Commit to the requested dates and add recognition awards so the team remains motivated during the extended workload."
          ],
          [
            "B",
            "Keep the feature commitments and extend each Sprint until all selected work is finished."
          ],
          [
            "C",
            "Immediately hire several contractors and assume their arrival will restore the original forecast without further review."
          ],
          [
            "D",
            "Review capacity and delivery problems with the team and product owner, then present sustainable scope and date trade-offs to the sponsor."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The current approach is showing adverse delivery and team effects. The leader should represent that evidence, help the team address its impediments, and support an achievable forecast and priority discussion. Neither motivation alone nor assumed capacity from new staff establishes a sustainable plan. Scrum also uses fixed-length Sprints.",
        "rationales": {
          "A": "Recognition does not resolve the demonstrated capacity, quality, and absence problems.",
          "B": "Extending Sprints to finish selected work undermines the fixed timebox and avoids the underlying planning issue.",
          "C": "Additional people may help, but their skills, availability, onboarding, and coordination effects must be assessed rather than assumed.",
          "D": "Correct. It combines support for the team with evidence-based decisions about value, capacity, and timing."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4, p. 84 (PDF p. 189), and duration-estimating considerations, p. 53 (PDF p. 158).",
          "The Scrum Guide, November 2020, Scrum Team and The Sprint sections: https://scrumguides.org/scrum-guide.html"
        ],
        "difficultyReason": "Balances delivery commitments, sustainable work, quality, and the uncertainty of adding resources."
      },
      {
        "n": 45,
        "id": "pmp-set2-045",
        "domain": "Process",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive facilities project has approved scope and funding for two zones. Zone 1's design is complete and its work is ready to start. Zone 2's detailed design will be available in six weeks, before any Zone 2 purchase or construction commitment is required. Its high-level scope, milestone constraints, estimated resource needs, and interfaces with Zone 1 are known. A planner insists that every Zone 2 activity must be detailed now because the project is predictive. What should the project manager do?",
        "options": [
          [
            "A",
            "Delay Zone 1 until both zones can be planned at the same level of detail."
          ],
          [
            "B",
            "Populate Zone 2 with detailed activities copied from Zone 1 and treat their dates as equally reliable."
          ],
          [
            "C",
            "Plan Zone 1 in detail and maintain bounded Zone 2 planning packages, with explicit assumptions, interfaces, and a scheduled elaboration point."
          ],
          [
            "D",
            "Remove Zone 2 from the integrated plan until its detailed design is available."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Predictive delivery can use rolling wave planning. Near-term work can be detailed while later work remains at a higher level until better information is available. Zone 2 still belongs in the integrated plan, including its constraints, resource expectations, interfaces, and the point at which detail must be established before commitments.",
        "rationales": {
          "A": "There is no stated dependency requiring ready Zone 1 work to wait for all Zone 2 detail.",
          "B": "Copied detail can create false precision and unsupported commitments when the design is not yet known.",
          "C": "Correct. It progressively elaborates the plan while retaining integration and decision control.",
          "D": "Omitting the zone would hide known scope, constraints, and resource and interface demands."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Rolling wave planning, p. 196 (PDF p. 301); §2.3.2.2, pp. 49–53 (PDF pp. 154–158)."
        ],
        "difficultyReason": "Applies progressive elaboration within a predictive approach without abandoning the integrated plan or inventing precision."
      },
      {
        "n": 46,
        "id": "pmp-set2-046",
        "domain": "Business Environment",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "multiple",
        "caseId": null,
        "requiredSelections": 2,
        "stem": "A predictive project's milestone is forecast to finish four weeks later than its approved baseline. The steering committee has authority to change that baseline; it has not yet considered the proposed revision. Before an investment review, the sponsor asks the project manager to replace the baseline dates in the status dashboard so the project appears on time. The sponsor says the committee will probably approve the revision next week. Which TWO actions should the project manager take?",
        "options": [
          [
            "A",
            "Show the approved baseline, current forecast, variance, and proposed recovery or revision transparently in the review information."
          ],
          [
            "B",
            "Use the proposed dates as the baseline now, retaining the original dates only in a private working file."
          ],
          [
            "C",
            "Remove the milestone from the dashboard until the committee decides, avoiding an unfavorable provisional interpretation."
          ],
          [
            "D",
            "Explain the approval boundary and submit the proposed revision with its impacts through the steering committee's documented decision process."
          ],
          [
            "E",
            "Describe the revision as approved in principle because the sponsor expects the authorized decision to follow shortly."
          ]
        ],
        "correct": [
          "A",
          "D"
        ],
        "explanation": "Decision makers need an accurate picture of performance and the status of proposed decisions. The current forecast should be reported even though it differs from the baseline. Expected future approval does not provide present authority to change the comparison basis or describe the revision as approved. The project manager should make the position transparent and use the specified decision process.",
        "rationales": {
          "A": "Correct. It communicates current evidence without concealing the variance or confusing a proposal with an approved baseline.",
          "B": "Keeping a private original does not correct the misleading presentation or supply the missing authority.",
          "C": "Suppressing the milestone removes material decision information that is already known.",
          "D": "Correct. It respects the stated allocation of authority and gives the committee an explicit, documented decision to make.",
          "E": "An expectation of approval is not an approval; this wording would misrepresent the decision's status."
        },
        "references": [
          "The Standard for Project Management, §3.6, pp. 46–47 (PDF pp. 69–70).",
          "PMBOK Guide, Eighth Edition, Guide §2.6.3, p. 89 (PDF p. 194); §2.1.6.8.1, pp. 29–30 (PDF pp. 134–135)."
        ],
        "difficultyReason": "Combines pressure from a sponsor, reporting integrity, approval authority, and the distinction among baseline, forecast, and proposal."
      },
      {
        "n": 47,
        "id": "pmp-set2-047",
        "domain": "Business Environment",
        "task": 6,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "An agile team has repeatedly lost release time because required security reviews were requested only after features were otherwise complete. A trial in the last two iterations identified review needs during refinement, named a coordinator, and booked review capacity earlier. Evidence shows reduced waiting without weakening the review standard. Another team is about to begin similar work. What should the project leader do next?",
        "options": [
          [
            "A",
            "Capture the trial's conditions and results, work with the process owner to update applicable planning guidance, and help the other team adapt and monitor the practice."
          ],
          [
            "B",
            "Archive the retrospective notes and let the other team search for them if it encounters the same delay."
          ],
          [
            "C",
            "Require every project in the organization to use the trial unchanged because it succeeded for two iterations."
          ],
          [
            "D",
            "Keep the improved practice within the original team until its project closes, when lessons learned are formally collected."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The team has evidence of a useful improvement that another team can apply now. The next step is to preserve the context and results, incorporate the learning into relevant organizational guidance through its owner, and support appropriate adaptation. The trial supports learning and wider evaluation, not a claim that one method fits every project.",
        "rationales": {
          "A": "Correct. It turns the trial into usable organizational learning while retaining context and checking results in the next setting.",
          "B": "Passive storage alone is less effective when a relevant team and an imminent need are already known.",
          "C": "The limited trial does not establish universal suitability, and adoption should respect the process owner's authority and project context.",
          "D": "Lessons can be captured and used throughout a project; waiting would miss the current opportunity."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Lessons learned register and Lessons learned updates, p. 123 (PDF p. 228); §3.4.4, p. 109 (PDF p. 214)."
        ],
        "difficultyReason": "Distinguishes organizational uptake of an evidenced improvement from passive documentation or unjustified universal rollout."
      },
      {
        "n": 48,
        "id": "pmp-set2-048",
        "domain": "Process",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "matching",
        "caseId": null,
        "stem": "A predictive project is checking the logic in its schedule. For each row, use the explicitly named predecessor and successor to select the relationship that represents the stated constraint. Assume zero lag. Use each relationship once.",
        "prompts": [
          [
            "1",
            "Predecessor: assemble a test fixture. Successor: calibrate that fixture. Calibration cannot START until assembly has FINISHED."
          ],
          [
            "2",
            "Predecessor: start the data-extraction activity. Successor: start the extraction-monitoring activity. Monitoring cannot START before extraction has STARTED."
          ],
          [
            "3",
            "Predecessor: complete translation of the manual. Successor: complete editorial review. Review can overlap translation but cannot FINISH before translation has FINISHED."
          ],
          [
            "4",
            "Predecessor: begin the new support service. Successor: end the temporary support service. Temporary support cannot FINISH until the new service has STARTED."
          ]
        ],
        "options": [
          [
            "A",
            "Finish-to-finish (FF)"
          ],
          [
            "B",
            "Start-to-finish (SF)"
          ],
          [
            "C",
            "Finish-to-start (FS)"
          ],
          [
            "D",
            "Start-to-start (SS)"
          ]
        ],
        "correct": {
          "1": "C",
          "2": "D",
          "3": "A",
          "4": "B"
        },
        "explanation": "Relationship names identify the constrained predecessor event first and the successor event second. The arrow's predecessor/successor roles are supplied explicitly; they should not be inferred from which service began operating earlier. In row 4, the start of the new service constrains the finish of temporary support.",
        "rationales": {
          "A": "Row 3. Editorial review cannot finish until translation finishes, although the activities may overlap.",
          "B": "Row 4. The successor's finish is constrained by the predecessor's start. This follows PMI's corrected start-to-finish definition.",
          "C": "Row 1. The successor cannot start until its predecessor finishes.",
          "D": "Row 2. The successor cannot start before its predecessor starts. A zero-lag SS link allows a simultaneous start but does not itself require one."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Precedence diagramming method, p. 185 (PDF p. 290), read with PMI's Second Printing Errata, p. 1 and corrected p. 185 reproduced on errata PDF p. 4."
        ],
        "difficultyReason": "Applies four dependency types with explicitly identified predecessor and successor activities."
      },
      {
        "n": 49,
        "id": "pmp-set2-049",
        "domain": "People",
        "task": 2,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "During release planning, a senior architect repeatedly interrupts testers who say the estimate omits necessary validation work. The team's agreement requires everyone to be heard before a decision. The discussion is becoming personal, and no emergency requires an immediate commitment. What should the project leader do first?",
        "options": [
          [
            "A",
            "Average the architect's and testers' estimates to produce a compromise that allows planning to continue."
          ],
          [
            "B",
            "Use the architect's estimate because the most senior technical specialist should settle the disagreement."
          ],
          [
            "C",
            "Accept the lower estimate temporarily and ask the testers to demonstrate the gap after development begins."
          ],
          [
            "D",
            "Restore the agreed discussion rules and facilitate a respectful review of the work and assumptions behind the estimates."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The leader should address the violation of the team's discussion rules and create space to examine the substantive disagreement. An average or a seniority-based choice would not establish whether required validation work is included. The absence of an emergency supports a collaborative response.",
        "rationales": {
          "A": "Averaging can conceal different assumptions and omitted work; it does not resolve the conduct issue.",
          "B": "Seniority does not replace the team's agreement or evidence about required work.",
          "C": "This delays examination of a known concern until correcting it may be more costly.",
          "D": "Correct. It addresses the immediate behavior and enables an informed resolution of the estimate disagreement."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide, Conflict management, pp. 156–157 (PDF pp. 261–262), and Resources tailoring considerations, p. 89 (PDF p. 194)."
        ],
        "difficultyReason": "Applies team ground rules and collaborative conflict management to a clear, nonemergency situation."
      },
      {
        "n": 50,
        "id": "pmp-set2-050",
        "domain": "Process",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "hotspot",
        "caseId": null,
        "quantitative": true,
        "stem": "A predictive installation project is choosing which supplier requires the most urgent recovery discussion to protect the common release milestone. The table shows independently verified receipt forecasts. Each receipt feeds a separate path to that same milestone. Available float is the delay each receipt can absorb from its contracted date before delaying the release; downstream durations are unchanged, and there are no shared-resource constraints or hidden dependencies. Other supplier risks are comparable. Select the FORECAST RECEIPT cell for the supplier with the greatest projected release delay beyond its available float.",
        "exhibit": {
          "headers": [
            "Supplier and item",
            "Contracted receipt",
            "Forecast receipt — selectable cell",
            "Available float"
          ],
          "rows": [
            [
              "A — Field sensors",
              "End of Day 8",
              "End of Day 13 [A]",
              "4 working days"
            ],
            [
              "B — Gateway controllers",
              "End of Day 10",
              "End of Day 13 [B]",
              "0 working days"
            ],
            [
              "C — Mounting frames",
              "End of Day 7",
              "End of Day 9 [C]",
              "3 working days"
            ],
            [
              "D — Operating manuals",
              "End of Day 5",
              "End of Day 11 [D]",
              "8 working days"
            ]
          ]
        },
        "options": [
          [
            "A",
            "Supplier A, forecast receipt: end of Day 13"
          ],
          [
            "B",
            "Supplier B, forecast receipt: end of Day 13"
          ],
          [
            "C",
            "Supplier C, forecast receipt: end of Day 9"
          ],
          [
            "D",
            "Supplier D, forecast receipt: end of Day 11"
          ]
        ],
        "correct": [
          "B"
        ],
        "hotspotTarget": {
          "row": "B",
          "column": "forecast_receipt"
        },
        "interactionNote": "Text adaptation: identify the supplier letter and forecast-receipt cell. In the intended website interaction, the four marked forecast cells are selectable; selecting the supplier's other cells does not answer the target.",
        "explanation": "Subtract available float from the forecast receipt delay, with a minimum impact of zero. Supplier B is 3 working days late with no float, so its path projects a 3-day release delay. Supplier A projects a 1-day impact; C and D remain within float. B therefore drives the greatest release delay, even though D has the largest raw delivery slip.",
        "rationales": {
          "A": "Receipt delay is 13 − 8 = 5 days. After 4 days of float, projected release impact is 1 day, less than B's.",
          "B": "Correct. Receipt delay is 13 − 10 = 3 days. With zero float, all 3 days affect the release.",
          "C": "Receipt delay is 9 − 7 = 2 days, within 3 days of float; projected release impact is zero.",
          "D": "Receipt delay is 11 − 5 = 6 days, within 8 days of float. The largest delivery slip is not the largest release impact."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.3.2.3, pp. 53–55 (PDF pp. 158–160), including contractor and supplier schedule-status reviews; Schedule network analysis, p. 197 (PDF p. 302)."
        ],
        "difficultyReason": "Prioritizes supplier intervention using milestone exposure after float, rather than lateness alone, and locates the correct cell."
      }
    ]
  },
  {
    "number": 6,
    "sourcePage": "https://chatgpt.com/space/page_99b8b6cccbe08191b31a4c90d0e4f351",
    "caseStudy": {
      "id": "C06",
      "title": "Distributed repair-dispatch team",
      "markdown": "A Scrum team is developing a repair-dispatch application. Its Developers work in two regions with one hour of normal working-time overlap. The project manager supports the team and coordinates shared resources. Use the following record for Questions 051–053. Answer each independently; do not assume that an action selected for another question has occurred.\n\n| Project information | Team record |\n|---|---|\n| Proposed Sprint Goal | Enable dispatchers to locate a suitable crew and assign an urgent repair. |\n| Goal-critical mapping work | Crew lookup needs 4 specialist hours; repair assignment needs 6 specialist hours. Both are necessary for the goal. |\n| Optional mapping work | A weekly export needs 5 specialist hours. It is useful but is not necessary for the proposed goal. All three items are currently proposed for the Sprint. |\n| Specialist calendar | One mapping specialist has 18 hours allocated to this project during the Sprint. This total includes a separate, mandatory 6-hour platform-release commitment that cannot move. No other qualified specialist is available during the Sprint. |\n| Estimation assumptions | The listed specialist estimates include the relevant completion and verification work. Their hours do not overlap. Other capacity is sufficient at planning; the stated mapping specialist work cannot be reassigned this Sprint. |\n| Distributed working | Technical clarifications are agreed in regional chats, but the other region sometimes starts from an earlier interpretation. Both regions can access a common work board. There is no agreed record or acknowledgement process for these decisions. |"
    },
    "questions": [
      {
        "n": 51,
        "domain": "Process",
        "task": 4,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C06",
        "quantitative": true,
        "stem": "During Sprint Planning, the team assesses the three proposed items. Based only on the specialist constraint in the record, which assessment should inform its forecast?",
        "options": [
          [
            "A",
            "All three items fit, leaving 3 specialist hours available for unexpected mapping work."
          ],
          [
            "B",
            "The goal-critical items are short of 2 specialist hours, so even a reduced forecast needs more capacity."
          ],
          [
            "C",
            "The goal-critical items fit, but including the weekly export exceeds available specialist capacity by 3 hours."
          ],
          [
            "D",
            "The goal-critical items fit, and the weekly export fits if its 5 hours are spread across the Sprint."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The separate platform commitment leaves 12 of the specialist's 18 hours for the proposed items. Crew lookup and repair assignment need 10 hours together, leaving 2 hours. Adding the 5-hour export would require 15 hours, exceeding the available 12 by 3. This is an input to the team's forecast, not a guarantee of delivery or an instruction for the project manager to select the Sprint work.",
        "rationales": {
          "A": "This compares the 15 proposed hours with the full 18 and overlooks the separate, immovable 6-hour commitment.",
          "B": "The two goal-critical items need 10 hours, which is 2 fewer than the 12 available; there is no 2-hour shortfall.",
          "C": "Correct. It accounts for the resource calendar and distinguishes the goal-critical work from the optional item.",
          "D": "Spreading work changes when hours are used, but does not create the 3 additional hours needed. No other qualified capacity is available."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.2, p. 82 (PDF p. 187), and §2.6.2.3, pp. 82–84 (PDF pp. 187–189)."
        ],
        "difficultyReason": "Combines a resource calendar, a commitment already included in that calendar, and essential versus optional demand without assuming interchangeable skills.",
        "id": "pmp-set2-051",
        "instruction": "Select ONE answer."
      },
      {
        "n": 52,
        "domain": "People",
        "task": 8,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C06",
        "stem": "The regional clarification problem is producing rework. Moving all discussions into the one-hour overlap would delay work, and team members in both regions want to retain their normal working hours. What should the project manager facilitate first?",
        "options": [
          [
            "A",
            "Agree a shared decision record linked to work items, a receiving-team acknowledgement, and an overlap slot for unresolved questions."
          ],
          [
            "B",
            "Record each regional discussion and ask the other region to watch the recordings before it begins related development work."
          ],
          [
            "C",
            "Assign one regional lead to approve all technical clarifications before either region can continue affected development work."
          ],
          [
            "D",
            "Use the overlap period for a daily manager briefing, then let each region maintain its own detailed implementation notes."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The evidence points to inconsistent interpretations and missing feedback across a handoff. A common decision record provides a current reference; acknowledgement checks that the receiving team understands it; the overlap period can resolve ambiguity. The team should agree these practices and check whether rework falls, rather than assume that a new channel alone fixes communication.",
        "rationales": {
          "A": "Correct. It combines an accessible record, a feedback loop, and focused synchronous clarification within the stated working-time constraints.",
          "B": "Recordings can provide context, but requiring everyone to reconstruct the operative decision from discussions creates delay and does not establish a clear acknowledgement loop.",
          "C": "A central approval queue changes technical authority and introduces a bottleneck without addressing how both regions share and confirm the current interpretation.",
          "D": "A manager briefing may summarize status, but separate detailed notes preserve the source of conflicting interpretations."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3, p. 72 (PDF p. 177), §2.5.2.7, p. 74 (PDF p. 179), and Communication technology, p. 156 (PDF p. 261)."
        ],
        "difficultyReason": "Selects a communication and feedback design that fits limited overlap, instead of treating more meetings, recordings, or centralized approval as the solution.",
        "id": "pmp-set2-052",
        "instruction": "Select ONE answer."
      },
      {
        "n": 53,
        "domain": "People",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": "C06",
        "stem": "Independently of the planning calculation, assume the Sprint is under way when an unexpected absence reduces general development capacity. The Developers and Product Owner confirm that the Sprint Goal remains valuable and achievable to the existing Definition of Done if the optional export is deferred. The sponsor asks the project manager to assign each Developer a revised daily task list. What is the best response?",
        "options": [
          [
            "A",
            "Ask the sponsor to confirm the feature priority, then issue daily assignments that protect the original forecast."
          ],
          [
            "B",
            "Ask the Product Owner to cancel the Sprint so the team can start a new Sprint with a smaller commitment."
          ],
          [
            "C",
            "Have the Developers retain the selected items and propose temporary completion criteria for the Product Owner's approval."
          ],
          [
            "D",
            "Support the Developers and Product Owner in renegotiating scope while the Developers adapt their plan to achieve the Sprint Goal."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The goal is still useful and achievable at the required quality. The project manager can help remove impediments while the Developers adapt their work plan and negotiate the selected scope with the Product Owner. An original item forecast does not justify managerial task assignment or reduced completion standards. Cancellation is not indicated by the stated facts.",
        "rationales": {
          "A": "It treats the forecast as a fixed task commitment and transfers detailed planning from the self-managing Developers to the project manager.",
          "B": "The problem is reduced capacity, while the goal remains valuable and achievable. Restarting the Sprint is an unnecessary response; the Product Owner's cancellation authority does not make cancellation the best choice.",
          "C": "It protects the selected item list by changing the quality threshold. The case explicitly says the existing Definition of Done can be met by deferring optional scope.",
          "D": "Correct. It preserves the goal, quality, and team accountabilities while adapting the scope and plan to new information."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4, pp. 84–86 (PDF pp. 189–191).",
          "The Scrum Guide (2020), Scrum Team, The Sprint, and Sprint Backlog: https://scrumguides.org/scrum-guide.html"
        ],
        "difficultyReason": "Separates the Sprint Goal from the item forecast and reconciles sponsor pressure with self-management, Product Owner scope decisions, and unchanged quality.",
        "id": "pmp-set2-053",
        "instruction": "Select ONE answer."
      },
      {
        "n": 54,
        "domain": "Process",
        "task": 4,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "stem": "A project is scheduled to perform acceptance measurements with a calibrated test unit next Monday. The approved resource plan lists the unit, but the equipment custodian reports that its mandatory calibration will now finish on Tuesday. A second suitable unit may be available from another department. What should the project manager do next?",
        "options": [
          [
            "A",
            "Keep Monday's booking because the resource plan already assigns the test unit to this project."
          ],
          [
            "B",
            "Confirm the second unit's calibration status and availability with its custodian, then coordinate a feasible allocation and schedule."
          ],
          [
            "C",
            "Move acceptance to Wednesday and update the forecast before checking whether the second unit is available."
          ],
          [
            "D",
            "Ask the team to complete Monday's measurements with the original unit and repeat a sample after calibration."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "A planned assignment does not establish actual availability or suitability. The project manager should verify the alternative unit's condition and calendar, coordinate its allocation, and assess any resulting plan changes. The facts do not yet establish that acceptance must slip, and they do not permit use of equipment awaiting mandatory calibration.",
        "rationales": {
          "A": "It relies on a document despite current evidence that the assigned physical resource will be unavailable.",
          "B": "Correct. It checks actual availability and fitness for use before committing to a resource or schedule response.",
          "C": "A delay may prove necessary, but imposing one before checking a suitable alternative bypasses a practical recovery option.",
          "D": "Repeating a sample later does not satisfy the stated requirement to use a calibrated unit for acceptance measurements."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.5, p. 87 (PDF p. 192), and §2.6.2.3, pp. 82–84 (PDF pp. 187–189)."
        ],
        "difficultyReason": "Distinguishes planned assignment from actual availability of a physical resource and selects the immediate verification step.",
        "id": "pmp-set2-054",
        "instruction": "Select ONE answer."
      },
      {
        "n": 55,
        "domain": "People",
        "task": 2,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "Two projects need the same commissioning engineer during the same shutdown. Their project managers have jointly checked sequencing, substitutes, and external support; none can satisfy both commitments. The engineer's functional manager cannot resolve the business priority. The approved governance plan gives that decision to the portfolio resource owner. The shutdown decision is due tomorrow. What should the project manager do next?",
        "options": [
          [
            "A",
            "Continue negotiating a split allocation with the other project manager until they reach agreement."
          ],
          [
            "B",
            "Ask the functional manager to assign the engineer to whichever project reserved the time first."
          ],
          [
            "C",
            "Present the competing impacts and explored options jointly to the portfolio resource owner for a timely priority decision."
          ],
          [
            "D",
            "Arrange for the two sponsors to give the engineer separate instructions based on their preferred business outcomes."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Collaboration has already established a genuine allocation conflict that the project managers and functional manager lack authority to resolve. A joint, evidence-based escalation to the named decision maker is proportionate and time-sensitive. After the decision, the affected teams can coordinate the resulting commitments and communicate impacts.",
        "rationales": {
          "A": "A split has already been assessed through sequencing and cannot meet both commitments. Repeating negotiation risks missing the decision deadline.",
          "B": "Reservation order is not the stated business-priority rule, and the functional manager lacks the relevant decision authority.",
          "C": "Correct. It respects the completed collaborative work, supplies decision-relevant evidence, and uses the explicitly assigned authority.",
          "D": "Separate directions create competing instructions for the engineer and bypass the designated resource-priority decision maker."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Conflict management, p. 156 (PDF p. 261), and §2.6.2.3, pp. 82–84 (PDF pp. 187–189)."
        ],
        "difficultyReason": "Recognizes when collaborative resolution has reached an authority boundary and escalation is appropriate, rather than treating escalation as always undesirable.",
        "id": "pmp-set2-055",
        "instruction": "Select ONE answer."
      },
      {
        "n": 56,
        "domain": "Business Environment",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "multiple",
        "stem": "An equipment-upgrade project combines planned installation gates with iterative configuration work. Its mandatory testing procedure permits independent Method B tests only after a current Method B qualification is verified and recorded. The assigned employee holds Method A qualification only; a supervisor's waiver or retrospective endorsement is not permitted. A supplier reports that a Method B-qualified contractor is available for Wednesday's gate. The contractor's premium would exceed the project manager's spending authority; an authorized approver can review a request today. Which TWO actions should the project manager take before authorizing the contractor's independent testing?",
        "options": [
          [
            "A",
            "Accept the supplier's general company accreditation as the contractor's qualification evidence and verify individual records after the gate."
          ],
          [
            "B",
            "Verify the contractor's current Method B qualification and record the required authorization for the assigned testing work."
          ],
          [
            "C",
            "Request the sponsor's acceptance of the qualification risk so the Method A-qualified employee can preserve the gate date."
          ],
          [
            "D",
            "Book the contractor under the existing labor budget and report the additional cost in the next scheduled financial review."
          ],
          [
            "E",
            "Assess the premium and schedule implications, and obtain the required spending approval before committing to the contractor."
          ]
        ],
        "correct": [
          "B",
          "E"
        ],
        "explanation": "The potential replacement must satisfy two independent conditions: documented qualification for the actual testing method and authorized funding for the resource commitment. Supplier accreditation is not individual Method B evidence. The deadline does not permit a qualification waiver or a spending commitment outside the project manager's authority. If either condition cannot be met in time, the gate consequences must be managed through the approved process.",
        "rationales": {
          "A": "Company accreditation does not meet the explicit requirement to verify and record the individual's current Method B qualification before independent work.",
          "B": "Correct. It establishes compliance with the stated personnel-qualification prerequisite for the actual method and assignment.",
          "C": "The sponsor's risk acceptance cannot substitute for a waiver that the mandatory procedure expressly disallows.",
          "D": "The premium exceeds the project manager's authority; retrospective reporting does not provide advance approval for the commitment.",
          "E": "Correct. It addresses the resource decision's cost and schedule effects while obtaining the required authorization before spending."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.3, pp. 82–84 (PDF pp. 187–189), especially the conditions for using alternative resources; §2.1.6.2, pp. 18–19 (PDF pp. 123–124)."
        ],
        "difficultyReason": "Applies separate competency-evidence and spending-authority requirements to an attractive deadline-preserving substitute; neither assurance alone is sufficient.",
        "id": "pmp-set2-056",
        "instruction": "Select TWO answers."
      },
      {
        "n": 57,
        "domain": "People",
        "task": 6,
        "approach": "Hybrid",
        "difficulty": "Moderate",
        "format": "single",
        "stem": "During a staged customer-service rollout, development proceeds iteratively and branch transitions follow fixed dates. The customer support team rotates specialists weekly. Response-time targets are being met, but customer satisfaction has fallen because customers repeatedly explain their unresolved cases to a new person. Customers have requested a consistent contact. What should the project manager do?",
        "options": [
          [
            "A",
            "Reconfirm the response-time targets with customers and keep the rotation because the agreed target is being met."
          ],
          [
            "B",
            "Assign one specialist to every case permanently before checking workload or arranging absence cover."
          ],
          [
            "C",
            "Add more frequent response-time reporting so customers can see that the support team is meeting its commitments."
          ],
          [
            "D",
            "Agree a continuity arrangement with customers and the support lead, assign case ownership and cover, and monitor satisfaction."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "Feedback identifies continuity as an unmet expectation that the response-time measure does not capture. The project manager should work with customers and the resource owner on feasible case ownership and coverage, then check whether satisfaction improves. A consistent point of responsibility can be arranged without assuming one individual can handle every case indefinitely.",
        "rationales": {
          "A": "Meeting one performance target does not resolve the specific expectation revealed by customer feedback.",
          "B": "It recognizes the continuity issue but makes an untested staffing promise and creates an avoidable coverage risk.",
          "C": "More reporting of the existing measure does not address repeated explanations or ownership of unresolved cases.",
          "D": "Correct. It uses the customer's stated need to agree a practical service adjustment and a feedback measure."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.1, p. 69 (PDF p. 174), and §2.5.2.4, pp. 72–74 (PDF pp. 177–179)."
        ],
        "difficultyReason": "Responds to explicit customer feedback beyond a satisfied service metric while preserving feasible resource coverage.",
        "id": "pmp-set2-057",
        "instruction": "Select ONE answer."
      },
      {
        "n": 58,
        "domain": "Process",
        "task": 3,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A freight company is rolling out an application in iterations within a fixed terminal-transition plan. Its benefit target is reduced truck waiting time. Two terminals have accepted the software, but cannot use it until a workflow coach completes supervisor preparation. The only available coach can either prepare these terminals next week or help a third terminal produce a nonessential demonstration. All mandatory controls are already satisfied, and both allocations are within the approved plan. What should the project manager recommend?",
        "options": [
          [
            "A",
            "Support the third-terminal demonstration because it increases the number of terminals reporting delivery progress."
          ],
          [
            "B",
            "Prepare the first two terminals for operational use, with the benefits owner tracking waiting-time changes after activation."
          ],
          [
            "C",
            "Split the coach's time equally among all three terminals so that each location receives the same share of resources."
          ],
          [
            "D",
            "Wait until all three terminals are software-ready so that coaching and benefit measurement can begin together."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The scarce resource should address the remaining condition that prevents usable, accepted capability from producing the intended outcome. Preparing the first two terminals allows benefits to begin earlier, while the benefits owner checks actual waiting-time results. Software acceptance and the number of demonstrations are outputs, not evidence that the waiting-time benefit has been realized.",
        "rationales": {
          "A": "It favors visible delivery activity over the stated operational outcome; a nonessential demonstration does not unlock use at the two ready terminals.",
          "B": "Correct. It directs capacity toward realizing an incremental benefit and includes measurement of the actual outcome.",
          "C": "Equal allocation is not justified by the value objective and may leave every terminal short of the preparation needed for use.",
          "D": "The case gives no dependency requiring a simultaneous rollout. Waiting postpones benefits that the first two terminals could realize sooner."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard §2.1.1, pp. 15–16 (PDF pp. 38–39), and §2.1.2, pp. 16–17 (PDF pp. 39–40); Guide §2.4.1, p. 59 (PDF p. 164)."
        ],
        "difficultyReason": "Prioritizes a nonsoftware resource that enables benefits after acceptance, rather than maximizing visible outputs or distributing capacity evenly.",
        "id": "pmp-set2-058",
        "instruction": "Select ONE answer."
      },
      {
        "n": 59,
        "domain": "Business Environment",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A laboratory-expansion project's staffing estimate assumes specialist recruitment takes three weeks at current market rates. Before recruitment starts, two credible agencies report that several regional projects are hiring the same specialists; current lead times are six to eight weeks and rates are rising. No offer or supplier contract has been signed. What should the project manager do next?",
        "options": [
          [
            "A",
            "Validate the market evidence with recruitment and procurement leads, assess cost and schedule exposure, and recommend any required plan changes."
          ],
          [
            "B",
            "Preserve the three-week assumption until an actual vacancy remains unfilled, then record a project issue."
          ],
          [
            "C",
            "Replace the approved staffing budget with the highest quoted market rate and notify the sponsor in the next report."
          ],
          [
            "D",
            "Direct the engineering lead to absorb recruitment delay through shorter installation durations before revisiting the staffing assumptions."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "External labor-market conditions have challenged a planning assumption before a missed commitment occurs. The project manager should validate the evidence, assess the effect on resource availability, cost, and schedule, and use the resulting analysis to recommend responses through the project's decision process. Current evidence warrants analysis; it does not itself authorize a new baseline or justify assumed productivity gains.",
        "rationales": {
          "A": "Correct. It connects an external change to the relevant project assumptions and impact assessment before choosing or authorizing a response.",
          "B": "It postpones preventive action despite credible evidence that the existing assumption may no longer hold.",
          "C": "It substitutes a single worst quote for an impact assessment and changes the budget without the required decision process.",
          "D": "It assumes that unrelated work can be accelerated sufficiently, without validating the resource or schedule consequences."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard §2.2, p. 17 (PDF p. 40); Guide §2.6.2.3, pp. 82–84 (PDF pp. 187–189), and §2.1.6.7, pp. 26–28 (PDF pp. 131–133)."
        ],
        "difficultyReason": "Distinguishes an external change invalidating a planning assumption from an already-realized staffing issue, and separates impact assessment from baseline authorization.",
        "id": "pmp-set2-059",
        "instruction": "Select ONE answer."
      },
      {
        "n": 60,
        "domain": "Process",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "multiple",
        "stem": "Before approval of an integrated project plan, a functional manager emails that 'four engineers will support the project.' The draft schedule assumes all four are available full time during the same six-week period, while the draft cost estimate assumes half-time support. The functional manager also supplies engineers to another project, and dates and skill assignments have not been confirmed. Which TWO actions should the project manager take before seeking approval?",
        "options": [
          [
            "A",
            "Confirm the named skills or roles, dated capacity, and competing assignments with the functional manager and affected planners."
          ],
          [
            "B",
            "Use the schedule's full-time assumption as the commitment because it is more conservative than the cost estimate."
          ],
          [
            "C",
            "Retain the conflicting estimates as separate departmental views and reconcile them during execution reporting."
          ],
          [
            "D",
            "Reconcile the agreed resource assumptions across the schedule, cost estimate, and resource plan, then review the resulting integrated plan."
          ],
          [
            "E",
            "Replace both estimates with a three-quarter-time allocation so the resource assumption is consistent across documents."
          ]
        ],
        "correct": [
          "A",
          "D"
        ],
        "explanation": "The first need is a credible, time-specific resource commitment, including the required skills and any competing allocation. The schedule, cost, and resource components must then use compatible assumptions so the plan can be assessed as a whole. Mathematical consistency alone does not establish availability: averaging unsupported estimates or selecting one without confirmation would create a coherent-looking but unreliable plan.",
        "rationales": {
          "A": "Correct. It replaces an ambiguous headcount statement with the availability and capability information needed for defensible planning.",
          "B": "A larger capacity assumption is not conservative for schedule feasibility, and neither draft creates a commitment by the functional manager.",
          "C": "Approval of an integrated plan should not knowingly preserve a material, unresolved resource inconsistency that affects both time and cost.",
          "D": "Correct. It aligns the interdependent plan components around confirmed assumptions before the approval decision.",
          "E": "An average is not evidence of actual resource availability or skill coverage; consistency cannot replace validation."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.2, pp. 18–19 (PDF pp. 123–124), and §2.6.2.2, p. 82 (PDF p. 187)."
        ],
        "difficultyReason": "Separates confirming a resource commitment from aligning plan components, and rejects both unsupported averaging and internally inconsistent approval.",
        "id": "pmp-set2-060",
        "instruction": "Select TWO answers."
      }
    ]
  },
  {
    "number": 7,
    "sourcePage": "https://chatgpt.com/space/page_72fe21a439f48191800eb85489c54275",
    "caseStudy": {
      "id": "C07",
      "title": "Water-treatment instrumentation renewal",
      "markdown": "A utility is renewing treatment-plant instrumentation under a predictive delivery plan. The steering group is reviewing the end-of-Month-4 financial position. All amounts below use the same currency. Use this record for Questions 061–063. Answer each independently; do not assume that another question's proposed action has occurred.\n\n| Project information | Financial record |\n|---|---|\n| Budget at completion (BAC) | $900,000 for the authorized work; the cost baseline has not changed. |\n| Planned value (PV) | $450,000 of budgeted work was scheduled to be complete by the status date. |\n| Earned value (EV) | $360,000 of budgeted work is complete under the agreed progress-measurement rules. |\n| Actual cost (AC) | $400,000 incurred for the work performed through the same status date; verified accruals are included. |\n| Forecast assumption | Investigation indicates that current cumulative cost efficiency will continue for the remaining authorized work. Schedule recovery will not independently increase the remaining cost. No new bottom-up estimate is available. |\n| Sponsor's interpretation | Because incurred cost is below planned value, the sponsor believes the project has produced savings that can be reassigned. |\n| Next-month cash position | The approved funding-release calendar makes $150,000 available next month. The validated cash-flow plan requires $180,000 next month. These cash figures are separate from cumulative AC and EV. |\n| Authority and commitments | Only the financing committee may change funding-release dates or limits. The project manager may propose feasible resequencing but cannot change contractual payment terms or assume additional cash is authorized. No funding-calendar revision has been approved. |"
    },
    "questions": [
      {
        "n": 61,
        "domain": "Process",
        "task": 6,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "dropdown",
        "caseId": "C07",
        "quantitative": true,
        "stem": "Complete the steering brief: Using the stated continuing-cost-efficiency assumption, the estimate at completion (EAC) is [select the statement that also correctly interprets the to-complete performance index needed to meet the original BAC].",
        "options": [
          [
            "A",
            "$940,000; a TCPI of 1.08 is needed to meet BAC, with future work performed at the original planned cost rate."
          ],
          [
            "B",
            "$1,000,000; a TCPI of 0.90 is needed to meet BAC, so maintaining current cost efficiency is sufficient."
          ],
          [
            "C",
            "$1,150,000; a TCPI of 1.08 is needed to meet BAC, using both current cost and schedule efficiency in the forecast."
          ],
          [
            "D",
            "$1,000,000; a TCPI of 1.08 is needed to meet BAC, requiring better remaining-work cost efficiency than the current 0.90."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "Current cost efficiency is 0.90: divide earned value of $360,000 by actual cost of $400,000. Continuing that efficiency gives an EAC of $1,000,000 by dividing BAC of $900,000 by 0.90. To finish within the original BAC, $540,000 of remaining budgeted work would have to be accomplished with $500,000 left to spend, giving a TCPI of 1.08. That required future efficiency is higher than the achieved 0.90. The calculation identifies a performance gap; it does not establish that the improvement is achievable.",
        "rationales": {
          "A": "$940,000 adds the remaining budgeted work at its original rate to actual cost. That assumes future cost efficiency of 1.00, contrary to the stated continuing-efficiency assumption.",
          "B": "The EAC is correct, but 0.90 is the efficiency required to meet the $1,000,000 forecast, not the original $900,000 BAC.",
          "C": "$1,150,000 results from applying both CPI and SPI to remaining work. The case does not support an additional schedule-efficiency effect on cost.",
          "D": "Correct. It applies the stated forecast assumption and separately calculates the efficiency needed to achieve the original budget target."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Table 5-1, pp. 208–210 (PDF pp. 313–315), and To-complete performance index, p. 206 (PDF p. 311)."
        ],
        "difficultyReason": "Selects the correct forecast model, calculates a separate target-based efficiency requirement, and avoids confusing forecast feasibility with authorization or guaranteed recovery.",
        "id": "pmp-set2-061",
        "instruction": "Select ONE statement from the drop-down."
      },
      {
        "n": 62,
        "domain": "People",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C07",
        "stem": "The sponsor asks finance to prepare a transfer of the apparent savings. The engineering lead objects that completed work is below plan, and both stakeholders say the other's report is misleading. What should the project manager do first?",
        "options": [
          [
            "A",
            "Facilitate a common interpretation of planned work, earned progress, and incurred cost, then agree the evidence needed before treating any amount as available savings."
          ],
          [
            "B",
            "Use the finance report for funding decisions and the engineering report for delivery decisions, allowing each stakeholder to retain a separate definition of savings."
          ],
          [
            "C",
            "Ask the engineering lead to revise the progress expectation to match actual spending so the two reports communicate a consistent position."
          ],
          [
            "D",
            "Send the full earned-value worksheet to both stakeholders and defer the discussion until the next monthly reporting cycle."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The disagreement concerns what the financial figures mean for a proposed decision. Spending less than the budgeted value of scheduled work does not establish savings when less work has been earned. The project manager should align stakeholder expectations and definitions using the same status-date evidence, and agree the decision criteria before anyone relies on the apparent underspend. A report can be arithmetically accurate yet misinterpreted.",
        "rationales": {
          "A": "Correct. It addresses the misunderstanding directly and creates shared expectations about the evidence needed for a resource-allocation decision.",
          "B": "Separate reporting views may be useful, but incompatible definitions of savings leave the funding decision unresolved.",
          "C": "Changing the expectation to match actual spending would hide the difference between planned and accomplished work instead of explaining it.",
          "D": "Additional data without a timely discussion does not resolve the identified misunderstanding before the requested transfer is considered."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.1, p. 69 (PDF p. 174), §2.5.2.4, pp. 72–74 (PDF pp. 177–179), and Earned value analysis, p. 169 (PDF p. 274)."
        ],
        "difficultyReason": "Distinguishes stakeholder alignment from merely distributing accurate figures when different interpretations could lead to an unsupported financial decision.",
        "id": "pmp-set2-062",
        "instruction": "Select ONE answer."
      },
      {
        "n": 63,
        "domain": "Business Environment",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": "C07",
        "stem": "The team has identified next month's cash shortfall before new commitments are made. The sponsor argues that the remaining annual budget is enough to proceed. Which TWO actions should the project manager take?",
        "options": [
          [
            "A",
            "Authorize the planned commitments against the remaining BAC and treat the monthly funding limit as a reporting issue."
          ],
          [
            "B",
            "Instruct suppliers to accept payment in the following month while retaining the current delivery commitments."
          ],
          [
            "C",
            "Present the validated cash profile and the delivery implications of feasible funding or work-sequencing alternatives to the financing committee."
          ],
          [
            "D",
            "Use the next-month cash allowance as a replacement BAC so the financial report cannot show spending above authorization."
          ],
          [
            "E",
            "Keep new commitments within the current funding rules until the authorized funding revision or a compliant work plan is agreed."
          ]
        ],
        "correct": [
          "C",
          "E"
        ],
        "explanation": "An authorized total budget and cash available in a particular period are different constraints. The monthly shortfall requires a decision using the stated funding authority and a feasible time-phased plan. The project manager should provide the committee with the relevant alternatives and impacts, while respecting current commitment limits. Supplier payment terms cannot be changed unilaterally, and changing a reported budget does not create cash.",
        "rationales": {
          "A": "Remaining BAC is not permission to exceed the approved funding-release limit for a particular month.",
          "B": "The case explicitly excludes unilateral changes to contractual payment terms; such an instruction does not resolve the governed funding decision.",
          "C": "Correct. It provides the assigned decision maker with the time-phased funding need and consequences of the available alternatives.",
          "D": "A monthly cash allowance is not the budget for all authorized project work. Replacing BAC would corrupt the performance basis rather than resolve funding.",
          "E": "Correct. It preserves the current authority boundary while the funding or sequencing decision is made."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.4.2.3, p. 64 (PDF p. 169), and Funding limit reconciliation, p. 171 (PDF p. 276)."
        ],
        "difficultyReason": "Applies a funding-release authority separately from the total budget and preserves contractual constraints while preparing a decision.",
        "id": "pmp-set2-063",
        "instruction": "Select TWO answers."
      },
      {
        "n": 64,
        "domain": "Process",
        "task": 6,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "quantitative": true,
        "stem": "An agile team costs $30,000 per two-week iteration, billed only in whole iterations. The project has incurred $120,000 so far and has a $225,000 funding cap. There are 24 comparable items remaining. For a planning scenario, the team agrees to use its recent range of 6–8 completed items per iteration, with unchanged staffing, item mix, and Definition of Done. No other project costs apply. Which forecast and response are best supported?",
        "options": [
          [
            "A",
            "Forecast $90,000 more and a $210,000 total; commit to completing the remaining scope within the cap using the fastest observed rate."
          ],
          [
            "B",
            "Forecast a total project cost of $90,000–$120,000; approve the remaining scope because the range is below the funding cap."
          ],
          [
            "C",
            "Forecast about $102,900 more using 3.43 iterations at the midpoint rate; commit to the cap because the resulting total is about $222,900."
          ],
          [
            "D",
            "Use a $90,000–$120,000 remaining-cost scenario range, or $210,000–$240,000 total; review funding or scope options because the slower scenario exceeds the cap."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "At 8 completed items per iteration, 24 items need 3 iterations; at 6, they need 4. The corresponding remaining cost is $90,000–$120,000, and adding the $120,000 already incurred gives $210,000–$240,000. The slower scenario exceeds the funding cap. This is a conditional planning range, not a statistical confidence interval or a guaranteed bound. The team should revisit it as delivery evidence changes and address the funding exposure before it is realized.",
        "rationales": {
          "A": "The optimistic endpoint is a valid scenario but is insufficient evidence for an unconditional commitment.",
          "B": "It omits the $120,000 already incurred when comparing the forecast with the total funding cap.",
          "C": "The midpoint rate implies more than 3 iterations, but the scenario permits only whole-iteration billing. A fractional-iteration cost is not an available purchasing option.",
          "D": "Correct. It accounts for the remaining work, whole-iteration cost, incurred cost, and the cap without claiming that the historical range guarantees future results."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.4.3, pp. 65–66 (PDF pp. 170–171), Agile release planning, p. 146 (PDF p. 251), and Basis of estimates, p. 115 (PDF p. 220)."
        ],
        "difficultyReason": "Combines throughput scenarios with whole-iteration costs and incurred expenditure, then interprets exposure to a funding cap without false precision.",
        "id": "pmp-set2-064",
        "instruction": "Select ONE answer."
      },
      {
        "n": 65,
        "domain": "People",
        "task": 7,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "matching",
        "stem": "An agile project's cost analyst is rotating to another team. Match each knowledge-continuity need to the MOST directly suitable action. Use each action at most once; one action will remain unused.",
        "prompts": [
          [
            "1",
            "The analyst makes supplier-estimate adjustments using experience that is not explained in the current worksheet."
          ],
          [
            "2",
            "Several copies of the forecast model exist, and the team cannot identify the approved version or its assumptions."
          ],
          [
            "3",
            "Estimators on several teams encounter recurring specialist questions and need an ongoing way to exchange practical experience."
          ],
          [
            "4",
            "The replacement has completed training, but the project manager needs evidence that the replacement can independently produce and reconcile the next forecast."
          ]
        ],
        "options": [
          [
            "A",
            "Have the replacement perform a complete forecast cycle and explain the reconciliation, with feedback on any gaps."
          ],
          [
            "B",
            "Establish an accessible, version-controlled source for the approved model, its assumptions, and supporting records."
          ],
          [
            "C",
            "Send the full archive to the replacement and treat the delivery receipt as evidence of readiness."
          ],
          [
            "D",
            "Discuss worked examples with the outgoing analyst to surface the reasoning behind the adjustments and capture the context."
          ],
          [
            "E",
            "Establish a recurring community-of-practice discussion where estimators compare cases and seek advice."
          ]
        ],
        "correct": {
          "1": "D",
          "2": "B",
          "3": "E",
          "4": "A"
        },
        "explanation": "The needs differ: eliciting experience-based reasoning, controlling explicit information, sustaining peer exchange, and verifying practical capability. A useful handover matches the method to the knowledge gap. Transmitting files can support a handover, but a receipt alone does not show understanding or readiness.",
        "rationales": {
          "A": "Need 4. Demonstrated performance provides evidence that the replacement can apply the knowledge independently.",
          "B": "Need 2. A controlled and accessible reference establishes which explicit model and assumptions should be used.",
          "C": "Unused. A delivered archive does not resolve missing reasoning, conflicting versions, continuing expert support, or demonstrated competence.",
          "D": "Need 1. Worked examples and dialogue help expose experience-based judgments that are difficult to transfer through unexplained figures.",
          "E": "Need 3. An ongoing peer forum supports exchange of contextual knowledge across teams beyond a single handover."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.6, pp. 24–26 (PDF pp. 129–131), and §2.6.2.4.1, p. 84 (PDF p. 189).",
          "PMBOK Guide, Eighth Edition, Guide Information management, p. 173 (PDF p. 278), and Knowledge management, p. 176 (PDF p. 281)."
        ],
        "difficultyReason": "Matches four distinct knowledge needs to practical transfer or verification mechanisms rather than treating all handover as document distribution.",
        "id": "pmp-set2-065",
        "instruction": "Match each row. Use each response at most once; one response is unused."
      },
      {
        "n": 66,
        "domain": "Business Environment",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A hybrid fare-collection project maintains contingency outside its cost baseline but within its total project budget. Its approved financial procedure requires a reserve-release request and a formal baseline update before committing contingency-funded response costs. A previously identified supplier-retest risk has now triggered, and its documented response remains suitable. The reserve is sufficient. What should the project manager do next?",
        "options": [
          [
            "A",
            "Request management reserve because any cost outside the baseline must be treated as an unforeseen event."
          ],
          [
            "B",
            "Confirm the trigger and response with the risk owner, then follow the specified reserve-release and baseline-update steps before committing the response cost."
          ],
          [
            "C",
            "Start the documented response and charge its costs to an unrelated work package until the next reserve review."
          ],
          [
            "D",
            "Commit the response cost immediately because inclusion of contingency in the total project budget provides all necessary spending authority."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "This is an identified risk with a planned response, but the scenario also states how its contingency must be released and incorporated into the baseline. The project manager should use that procedure with the risk owner. The location of contingency in the budget structure does not, by itself, make the event unknown or authorize expenditure. PMBOK 8 describes alternative reserve arrangements; this item's decision follows the arrangement explicitly given.",
        "rationales": {
          "A": "Whether a risk was identified is not determined solely by whether its reserve sits inside the cost baseline. The case identifies a known risk and a contingency response.",
          "B": "Correct. It connects the activated risk response to the stated reserve and authorization process.",
          "C": "Charging an unrelated work package obscures the response cost and bypasses the required release and baseline steps.",
          "D": "Availability in the total budget does not override the explicit requirement for release and a baseline update before commitment."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.4.1, pp. 60–61 (PDF pp. 165–166), including the alternative budget-buildup arrangements in Figure 2-25; §2.1.6.8.1, p. 29 (PDF p. 134)."
        ],
        "difficultyReason": "Distinguishes risk classification, reserve location, and spending authority under an explicitly stated budget structure.",
        "id": "pmp-set2-066",
        "instruction": "Select ONE answer."
      },
      {
        "n": 67,
        "domain": "Process",
        "task": 6,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A planner proposes estimating a new sensor installation by multiplying its quantity by the previous project's total cost per sensor. The earlier project qualified for a large-volume discount and spread a one-time mobilization charge across its units. The new order is below the discount threshold and requires confined-space access arrangements that the earlier project did not need. The current quantities and access requirements are known. How should the project manager improve the estimate?",
        "options": [
          [
            "A",
            "Retain the historical unit rate because the sensor model is unchanged and capture the other differences as general risks."
          ],
          [
            "B",
            "Average the historical unit rate with an expert's percentage uplift and use the midpoint as the approved estimate basis."
          ],
          [
            "C",
            "Separate fixed and quantity-driven costs, validate current rates and access-work estimates, and document the changed assumptions."
          ],
          [
            "D",
            "Carry forward the previous project's total cost as a conservative allowance instead of examining the different cost drivers."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Historical costs are useful when the relationship and relevant conditions remain applicable. The new estimate must account for the lost discount, fixed mobilization cost, and required access work. Separating these drivers and documenting the basis makes the estimate traceable and avoids both linear scaling of fixed costs and omission of known work. Contingency does not replace estimating a known requirement.",
        "rationales": {
          "A": "Identical equipment does not make the installation economics identical. The differences are known cost drivers, not merely unspecified uncertainty.",
          "B": "An average and an unvalidated uplift do not establish that the discount, fixed charge, and access requirements have been treated correctly.",
          "C": "Correct. It uses historical information selectively while validating the current relationship between quantities, conditions, and costs.",
          "D": "A prior total is not automatically conservative for a different scope and working environment; it may conceal material omissions or unjustified excess."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.4.2.2, pp. 62–63 (PDF pp. 167–168); Analogous estimating, pp. 146–147 (PDF pp. 251–252); Parametric estimating, p. 184 (PDF p. 289); Basis of estimates, p. 115 (PDF p. 220)."
        ],
        "difficultyReason": "Evaluates the validity of an estimating relationship using fixed costs, scale effects, and known scope differences instead of mechanically transferring a historical rate.",
        "id": "pmp-set2-067",
        "instruction": "Select ONE answer."
      },
      {
        "n": 68,
        "domain": "People",
        "task": 1,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "stem": "An agile team is improving a public appointment-booking service within a fixed quarterly budget. In a planning discussion, developers describe success as minimizing hosting cost, service representatives describe it as reducing abandoned bookings, and the product owner describes it as demonstrating a larger number of features. Team members are working diligently but disagree about trade-offs. What should the project manager facilitate first?",
        "options": [
          [
            "A",
            "A ranking of individuals by their preferred success measure so the highest-performing group's measure can become the project goal."
          ],
          [
            "B",
            "A shared, current vision of the intended service outcome and financial constraints, with agreement on how trade-offs will support that vision."
          ],
          [
            "C",
            "Separate team targets for cost, booking completion, and feature count, leaving each discipline to optimize its own target."
          ],
          [
            "D",
            "A revised reporting template that combines all three measures without requiring agreement on which outcome the project exists to achieve."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The team lacks a shared interpretation of success. Facilitating agreement on the service outcome and the budget constraint gives members a common basis for decisions. Cost, completion, and delivery measures can all be useful, but a dashboard or separate local targets do not by themselves align the team's purpose.",
        "rationales": {
          "A": "The project's purpose should follow stakeholder needs and agreed objectives, not the status or individual performance of the group proposing a metric.",
          "B": "Correct. It develops a common vision and connects practical trade-offs to that vision within the stated financial boundary.",
          "C": "Independent local optimization preserves the disagreement and can cause one discipline's result to undermine the intended project outcome.",
          "D": "Combining measures improves visibility but leaves their meaning and priority unresolved."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4.1, p. 84 (PDF p. 189), and §2.6.2.4.2, p. 86 (PDF p. 191).",
          "PMBOK Guide, Eighth Edition, Guide Leadership—Establishing and maintaining vision, p. 176 (PDF p. 281)."
        ],
        "difficultyReason": "Recognizes a shared-vision gap behind conflicting success measures and chooses alignment before local optimization.",
        "id": "pmp-set2-068",
        "instruction": "Select ONE answer."
      },
      {
        "n": 69,
        "domain": "Process",
        "task": 9,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "single",
        "stem": "A hybrid equipment-and-software project is preparing a monthly cost-efficiency report. For the equipment work package below, the analyst concludes that performance is favorable and recommends releasing its remaining funds. Which response is best supported before relying on that conclusion?",
        "exhibit": {
          "headers": [
            "Evidence at the same status date",
            "Record"
          ],
          "rows": [
            [
              "Progress-measurement rule",
              "The $100,000 work-package budget earns 30% on design acceptance and 70% on final equipment acceptance; no other progress credit is permitted."
            ],
            [
              "Accepted progress",
              "Design is accepted. Equipment assembly is complete, but required final tests and acceptance are still outstanding."
            ],
            [
              "Cost-recognition rule",
              "Actual cost includes verified costs incurred for work performed, whether paid or not."
            ],
            [
              "Cost records",
              "$20,000 has been paid. An additional $60,000 of work already performed is verified as incurred and is not yet invoiced. There is no overlap between the two amounts."
            ],
            [
              "Draft report",
              "The analyst credits the entire $100,000 as earned value and records only the $20,000 paid as actual cost."
            ]
          ]
        },
        "options": [
          [
            "A",
            "Reconcile earned credit with the acceptance milestones and include verified incurred costs before evaluating performance or recommending release of funds."
          ],
          [
            "B",
            "Keep the full earned value because assembly is complete, but add the verified uninvoiced cost before evaluating performance."
          ],
          [
            "C",
            "Reduce earned credit to the accepted design milestone, but retain cash paid as actual cost until the supplier issues the invoice."
          ],
          [
            "D",
            "Retain both draft values until final acceptance and the supplier invoice occur in the same reporting period."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "Two independent measurement errors invalidate the conclusion. Under the agreed rule, only the design milestone has earned credit; assembly completion does not substitute for final acceptance. Actual cost must include both paid and verified incurred-but-uninvoiced work under the stated recognition policy. After reconciliation, the figures are $30,000 earned value and $80,000 actual cost, so the draft's favorable-cost claim is not supported. These are status-date cost-performance measures, not a complete forecast of the final work-package outcome.",
        "rationales": {
          "A": "Correct. It addresses both the earned-credit rule and the incurred-cost basis before drawing a financial conclusion.",
          "B": "It corrects the cost omission but still awards credit for an acceptance milestone that has not occurred.",
          "C": "It corrects earned value but retains a cash-only measure that conflicts with the explicitly stated actual-cost rule.",
          "D": "Waiting for coincident acceptance and invoicing preserves known errors and is unnecessary because both the measurement rule and incurred-cost evidence are available."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Earned value analysis, p. 169 (PDF p. 274), Table 5-1, p. 207 (PDF p. 312), and §2.1.6.7–2.1.6.7.1, pp. 26–28 (PDF pp. 131–133)."
        ],
        "difficultyReason": "Reconciles progress acceptance and cost recognition across separate evidence records; correcting only one error still produces an unreliable assessment.",
        "id": "pmp-set2-069",
        "instruction": "Select ONE answer."
      },
      {
        "n": 70,
        "domain": "Business Environment",
        "task": 3,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A hybrid facility-modernization project develops its control application iteratively while equipment follows an approved design baseline. A proposed equipment substitution would lower the purchase price and preserve immediate functional performance, but increase expected energy and maintenance costs. The approved business case includes those operating costs, and equipment substitutions require the change authority's decision. The sponsor asks the project manager to accept the lower price as a project saving. What should the project manager do next?",
        "options": [
          [
            "A",
            "Accept the substitution after confirming functional equivalence because operating costs belong to the future operations budget."
          ],
          [
            "B",
            "Record the purchase-price reduction as a realized saving and ask operations to assess the additional costs after installation."
          ],
          [
            "C",
            "Assess purchase, integration, operating-cost, and benefit impacts with finance and operations, then submit the substitution for the required change decision."
          ],
          [
            "D",
            "Reject the substitution without further analysis because an increase in operating cost always outweighs a lower purchase price."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "A lower acquisition price does not establish a net benefit when operating costs form part of the approved business case. The project manager should evaluate the relevant life-cycle effects and affected interfaces with finance and operations, then use the designated change process. Analysis could support either acceptance or rejection; the facts do not justify either outcome before the trade-off is assessed.",
        "rationales": {
          "A": "It excludes costs that the case explicitly includes in the business case and bypasses the required substitution decision.",
          "B": "It labels an unapproved proposal as a realized saving and delays assessment until the decision becomes harder to reverse.",
          "C": "Correct. It assesses the change against the full stated value basis and brings the resulting evidence to the authorized decision maker.",
          "D": "The higher operating cost matters, but it does not establish the net result without considering its amount, timing, and other impacts."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.4.1, pp. 59–61 (PDF pp. 164–166), including life-cycle cost considerations; §2.1.6.8–2.1.6.8.1, pp. 28–29 (PDF pp. 133–134)."
        ],
        "difficultyReason": "Assesses a proposed capital saving across project and operating budgets before applying the change authority, avoiding both automatic acceptance and automatic rejection.",
        "id": "pmp-set2-070",
        "instruction": "Select ONE answer."
      }
    ]
  },
  {
    "number": 8,
    "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch8.md",
    "caseStudy": {
      "id": "pmp-set2-case-08",
      "title": "Shared case for Questions 071–073 — Depot charging pilot",
      "markdown": "A municipal fleet project installs charging equipment against a predictive installation plan while developing its load-management application in iterations. A pilot can start only when both the energized equipment and the application's live telemetry test are ready. Treat each question independently.\n\n| Project record | Evidence |\n|---|---|\n| Common dependency | Both workstreams require the same utility authorization before their final readiness activities can finish. The authorization date remains uncertain. |\n| Readiness forecasts | Separate workstream models each report a 90% chance of readiness by the pilot date. Each model includes the uncertain utility authorization. An analyst multiplies the two percentages and reports 81% combined readiness, assuming independence. |\n| Response trial | A temporary generator has been qualified to reduce the impact of a grid interruption during the pilot. The trial confirms that fuel deliveries would be required every 12 hours. The original grid-interruption risk has not been eliminated, and dependable fuel deliveries have not yet been assessed. |\n| Assessment disagreement | The equipment lead rates grid interruption as low impact using equipment restart time. The application lead rates it as high impact using missed fleet departures. The approved risk plan calls for assessment against the pilot's service objective, but the team has not calibrated its ratings to that objective. |"
    },
    "questions": [
      {
        "n": 71,
        "domain": "Business Environment",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "pmp-set2-case-08",
        "stem": "After the generator trial, the response owner proposes closing the grid-interruption risk because the backup has passed its equipment checks. What should the project manager do next?",
        "options": [
          [
            "A",
            "Close the grid-interruption risk and record fuel availability only if a delivery is missed during the pilot."
          ],
          [
            "B",
            "Keep the original risk open at its pre-response rating because qualifying a backup cannot change risk exposure."
          ],
          [
            "C",
            "Replace the original grid-interruption entry with a fuel-delivery risk so only the most recent concern remains visible."
          ],
          [
            "D",
            "Reassess the remaining grid-interruption exposure and the fuel dependency introduced by the response, with owners and monitoring actions for both."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "A completed response activity is not proof that its underlying threat has disappeared. The generator can reduce the effect of an interruption while leaving residual exposure, and its fuel requirement introduces a secondary risk. The team should assess both using the trial evidence, assign accountable owners, and update the response and monitoring arrangements. Neither exposure has to remain at its original rating.",
        "rationales": {
          "A": "Passing the equipment trial does not establish dependable fuel supply or remove the original interruption exposure; waiting for a missed delivery delays risk identification.",
          "B": "It preserves visibility but ignores evidence that the backup may reduce impact. Monitoring should update the assessment, not freeze the original rating.",
          "C": "The fuel dependency adds an exposure; it does not replace the original grid threat or justify erasing its continuing relevance.",
          "D": "Correct. It assesses the response's effectiveness and the uncertainty the response itself introduces, then maintains appropriate ownership and monitoring."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.7.2.2–2.7.2.6, pp. 96–98 (PDF pp. 201–203): iterative identification, analysis, response implementation, and monitoring."
        ],
        "difficultyReason": "Distinguishes completion of a response from elimination of exposure and recognizes a new risk created by the chosen response.",
        "id": "pmp-set2-071",
        "instruction": "Select ONE answer."
      },
      {
        "n": 72,
        "domain": "People",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "pmp-set2-case-08",
        "stem": "The two leads argue that the other's impact rating is wrong and ask the project manager to settle the disagreement before response priorities are set. What is the best next action?",
        "options": [
          [
            "A",
            "Use the application lead's high rating because choosing the most conservative opinion is the most reliable way to resolve risk disputes."
          ],
          [
            "B",
            "Facilitate a joint review of the interruption scenario and evidence, calibrate impact to the agreed service objective, and then reassess the rating."
          ],
          [
            "C",
            "Average the two ratings and document that compromise as the team's agreed impact assessment."
          ],
          [
            "D",
            "Ask each lead to retain a separate rating and let the sponsor choose whichever rating supports the preferred pilot date."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The disagreement comes from different impact bases, not simply different numerical estimates of the same outcome. A facilitated review should bring the leads back to the pilot's agreed service objective, clarify the scenario and evidence, and apply consistent criteria. Taking the higher rating or averaging inconsistent ratings does not resolve the underlying difference in meaning.",
        "rationales": {
          "A": "A conservative interim assumption can sometimes be useful, but automatically selecting one opinion does not address the incompatible impact definitions identified here.",
          "B": "Correct. It addresses the source of the conflict through shared evidence and consistent assessment criteria.",
          "C": "Averaging ratings based on different objectives produces an apparently precise compromise without establishing a valid common assessment.",
          "D": "It leaves the conflict unresolved and makes the chosen rating depend on a preferred outcome rather than the agreed assessment basis."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Conflict management, pp. 156–157 (PDF pp. 261–262); §2.7.2.3, p. 96 (PDF p. 201)."
        ],
        "difficultyReason": "Resolves a technical conflict by aligning the meaning of the evidence before choosing or combining ratings.",
        "id": "pmp-set2-072",
        "instruction": "Select ONE answer."
      },
      {
        "n": 73,
        "domain": "Process",
        "task": 1,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": "pmp-set2-case-08",
        "stem": "The sponsor wants to use the analyst's 81% combined-readiness figure to authorize the pilot plan. Which action best supports an integrated planning decision?",
        "options": [
          [
            "A",
            "Represent the shared authorization and both readiness paths in a joint model, validate their dependencies, and reassess the pilot-date forecast."
          ],
          [
            "B",
            "Accept 81% because multiplying two readiness probabilities always gives the probability that both workstreams will be ready."
          ],
          [
            "C",
            "Replace 81% with 90% because a shared authorization makes all remaining workstream uncertainty identical."
          ],
          [
            "D",
            "Increase the number of trials in the two separate models and keep multiplying their marginal readiness percentages."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "Multiplication of the two marginal probabilities is justified only if the readiness events are independent. The case provides a shared uncertain dependency, so that assumption is unsupported. A joint model should represent the common authorization and the remaining work on both paths. The two 90% forecasts alone do not establish the joint probability: a common dependency does not prove that every other source of uncertainty is identical, and more trials cannot repair a structural modeling error.",
        "rationales": {
          "A": "Correct. It tests the assumption that determines whether the calculation is valid and integrates the dependency before using the forecast for authorization.",
          "B": "Multiplication of marginal probabilities without a conditional term requires independence, which has not been established.",
          "C": "A joint probability of 90% would require stronger information about the relationship between the two readiness events than the case provides.",
          "D": "More trials may reduce sampling noise within each model, but leave the unsupported independence assumption and missing joint structure unchanged."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.7.2.2–2.7.2.6, pp. 96–98 (PDF pp. 201–203): iterative identification, analysis, response implementation, and monitoring.",
          "PMBOK Guide, Eighth Edition, Guide Schedule network analysis and Simulation, pp. 197–198 (PDF pp. 302–303)."
        ],
        "difficultyReason": "Distinguishes marginal from joint readiness, recognizes shared uncertainty, and rejects a numerically precise forecast built on an unvalidated dependency assumption.",
        "id": "pmp-set2-073",
        "instruction": "Select ONE answer."
      },
      {
        "n": 74,
        "domain": "Process",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "hotspot",
        "quantitative": true,
        "stem": "A predictive project's validated schedule-risk model has produced 1,000 trials. Each count below is cumulative: it includes trials finishing ON OR BEFORE the listed working day. For a planning recommendation, the sponsor requires at least an 80% modeled chance of completion. Select the CUMULATIVE COMPLETIONS cell for the earliest LISTED day that meets the threshold. Do not interpolate between listed days. The result is conditional on the model's current assumptions, not a delivery guarantee.",
        "exhibit": {
          "headers": [
            "Candidate deadline",
            "Cumulative completions"
          ],
          "rows": [
            [
              "End of Day 23",
              "400 [A]"
            ],
            [
              "End of Day 25",
              "650 [B]"
            ],
            [
              "End of Day 27",
              "790 [C]"
            ],
            [
              "End of Day 29",
              "860 [D]"
            ]
          ]
        },
        "options": [
          [
            "A",
            "Day 23 — 400 of 1,000 trials completed"
          ],
          [
            "B",
            "Day 25 — 650 of 1,000 trials completed"
          ],
          [
            "C",
            "Day 27 — 790 of 1,000 trials completed"
          ],
          [
            "D",
            "Day 29 — 860 of 1,000 trials completed"
          ]
        ],
        "correct": [
          "D"
        ],
        "hotspotType": "simulation",
        "hotspotColumn": 1,
        "hotspotInstruction": "Select ONE cumulative-completions cell.",
        "hotspotTarget": {
          "row": "D",
          "column": "cumulative_completions"
        },
        "interactionNote": "Select the numbered cumulative-completions cell, not the deadline cell.",
        "explanation": "The cumulative modeled completion proportions are 40%, 65%, 79%, and 86%. An 80% threshold requires at least 800 of the 1,000 trials to finish by the candidate date. Day 27 falls short by 10 trials; Day 29 is the earliest listed date that meets the threshold. This does not establish Day 29 as the exact 80th-percentile date, because intervening days are not shown, nor does it guarantee delivery.",
        "rationales": {
          "A": "400 of 1,000 is 40%, below the required threshold.",
          "B": "650 of 1,000 is 65%, below the required threshold.",
          "C": "790 of 1,000 is 79%. Rounding up to 80% would change the explicitly stated acceptance rule.",
          "D": "Correct. 860 of 1,000 is 86%, making Day 29 the earliest listed candidate with at least 80% modeled completion."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Schedule network analysis and Simulation, pp. 197–198 (PDF pp. 302–303)."
        ],
        "difficultyReason": "Interprets cumulative simulation output, applies a strict probability threshold, and distinguishes a listed qualifying date from a guarantee or exact percentile.",
        "id": "pmp-set2-074",
        "instruction": "Select ONE marked cell."
      },
      {
        "n": 75,
        "domain": "Business Environment",
        "task": 4,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "matching",
        "stem": "A predictive deployment project reviews four independent records. Match each record to its most appropriate next treatment. Use each response at most once; one response will remain unused.",
        "prompts": [
          [
            "1",
            "A previously identified outage has occurred and is blocking a test. Its approved contingency is within the project manager's authority and is ready to activate."
          ],
          [
            "2",
            "A current cross-department access block remains unresolved after agreed team-level attempts. Only the designated governance owner can authorize access."
          ],
          [
            "3",
            "A supplier reports that an active defect has been fixed, but the agreed resolution check has not been performed."
          ],
          [
            "4",
            "A key employee may be unavailable next month. No absence or current work blockage has occurred, and no approved response trigger has been reached."
          ]
        ],
        "options": [
          [
            "A",
            "Verify the agreed resolution criteria before closing the issue."
          ],
          [
            "B",
            "Assess and manage the uncertainty as a risk, without labeling it an already occurring issue."
          ],
          [
            "C",
            "Record the realized impact as an issue, activate the authorized contingency, and track recovery."
          ],
          [
            "D",
            "Suspend every project activity until the next scheduled governance meeting."
          ],
          [
            "E",
            "Escalate the current block to the designated authority with its impact and the decision required."
          ]
        ],
        "correct": {
          "1": "C",
          "2": "E",
          "3": "A",
          "4": "B"
        },
        "explanation": "The treatment should follow the record's current state and decision authority. An outage that has happened needs issue handling and the authorized response. An unresolved block beyond team authority needs targeted escalation. A claimed fix requires verification before closure. A possible future absence remains an uncertainty to assess and monitor until it occurs or a response trigger is reached.",
        "rationales": {
          "A": "Matches 3: a supplier's assertion does not replace the agreed evidence needed to verify resolution.",
          "B": "Matches 4: the absence is uncertain and has not yet become a current issue.",
          "C": "Matches 1: the risk has materialized, and the response is already authorized and ready.",
          "D": "Unused: none of the records establishes a need to stop all work or wait for a scheduled meeting.",
          "E": "Matches 2: the next decision belongs to the designated authority after team-level resolution attempts have failed."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.7.1, p. 93 (PDF p. 198), and Issue log, p. 123 (PDF p. 228).",
          "PMBOK Guide, Eighth Edition, Guide §2.7.2.2–2.7.2.6, pp. 96–98 (PDF pp. 201–203): iterative identification, analysis, response implementation, and monitoring.",
          "PMI PMBOK Guide Eighth Edition second-printing errata, correction to Guide p. 157: contingent response strategies activate when specified trigger conditions occur."
        ],
        "difficultyReason": "Distinguishes a risk, a realized issue, a blocked decision, and an unverified resolution.",
        "id": "pmp-set2-075",
        "instruction": "Match all four rows."
      },
      {
        "n": 76,
        "domain": "Process",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A predictive project uses a fixed-price equipment contract with an agreed payment for late delivery. The payment covers a specified portion of the buyer's financial loss; it does not provide replacement equipment. A new supplier forecast puts delivery after the date needed for commissioning. The procurement lead recommends closing the delivery risk because the supplier now bears the contractual payment. What should the project manager do?",
        "options": [
          [
            "A",
            "Close the delivery risk and open it again only if the supplier refuses to make the agreed payment."
          ],
          [
            "B",
            "Move the commissioning milestone to the forecast delivery date because the payment provision makes the delay acceptable."
          ],
          [
            "C",
            "Manage the contract with procurement while assessing the remaining commissioning exposure and feasible delivery or recovery responses."
          ],
          [
            "D",
            "Record the expected payment as schedule contingency and retain the original readiness forecast."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "A contractual allocation of specified financial consequences does not supply the missing equipment or eliminate the project's commissioning exposure. Procurement should manage supplier performance and the contractual response while the project evaluates what remains at risk and what actions can protect or recover the delivery objective. Neither a baseline change nor acceptance of the remaining risk follows automatically from the payment clause.",
        "rationales": {
          "A": "It treats recovery of money as complete protection of the project's delivery objective, despite the explicit absence of replacement equipment.",
          "B": "A forecast can change without an approved baseline change; the clause does not itself authorize a new commitment or establish acceptable residual exposure.",
          "C": "Correct. It separates the financial protection in the contract from the schedule consequences the project must still manage.",
          "D": "Money owed cannot be treated as elapsed-time protection, and it does not justify keeping an unsupported readiness forecast."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Strategies for threats, p. 204 (PDF p. 309); §2.7.2.6, p. 98 (PDF p. 203)."
        ],
        "difficultyReason": "Separates the scope of contractual risk transfer from continuing responsibility for the project's delivery outcome.",
        "id": "pmp-set2-076",
        "instruction": "Select ONE answer."
      },
      {
        "n": 77,
        "domain": "People",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "An agile team reports few risks during planning, but retrospectives repeatedly uncover concerns that people had noticed earlier. In private, team members say that raising a concern is treated as a personal commitment to eliminate it without help. The team leader wants earlier disclosure without weakening accountability. Which action is best?",
        "options": [
          [
            "A",
            "Require each person to submit two new risks per iteration and compare individual submission counts."
          ],
          [
            "B",
            "Allow concerns only after the person raising them has produced a fully costed response."
          ],
          [
            "C",
            "Assign all risk responses to the team leader so that team members no longer need to own any follow-up."
          ],
          [
            "D",
            "Welcome early concerns without blame, assess them together, and explicitly agree capable owners and support for the selected follow-up actions."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The reporting behavior is a response to the team's incentives: identifying a risk currently creates an unsupported personal obligation. The leader should make early disclosure safe while retaining explicit ownership of agreed action. Collaborative assessment can separate the person who notices an uncertainty from the person best placed to manage it, and can make the needed support visible.",
        "rationales": {
          "A": "A quota may increase the number of entries without addressing fear of unsupported responsibility or improving the quality of disclosure.",
          "B": "It raises the barrier to early identification and delays discussion until a solution has already been designed.",
          "C": "It may reduce fear but creates a bottleneck and removes distributed accountability rather than making it workable.",
          "D": "Correct. It addresses psychological safety and preserves accountable follow-up through explicit, supported ownership."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.6.1 and Figure 3-5, p. 47 (PDF p. 70); Guide §2.7.2.2, p. 96 (PDF p. 201)."
        ],
        "difficultyReason": "Balances early risk disclosure with accountability instead of choosing between blame-based reporting and leader ownership of every response.",
        "id": "pmp-set2-077",
        "instruction": "Select ONE answer."
      },
      {
        "n": 78,
        "domain": "Process",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "multiple",
        "stem": "An agile inventory team sees an opportunity to reduce stockouts by recommending replenishment quantities. The algorithm performs well on historical data, but the expected business value depends on whether branch staff use its recommendations without creating excessive inventory. A full rollout would consume most of the remaining budget. Which TWO actions best inform the next value-based investment decision?",
        "options": [
          [
            "A",
            "Agree measurable stockout and inventory guardrails, along with evidence that would support expanding, revising, or stopping the approach."
          ],
          [
            "B",
            "Prioritize full rollout because historical predictive accuracy already demonstrates the expected operating benefit."
          ],
          [
            "C",
            "Delay staff feedback until the interface is fully polished so that usability opinions cannot distract from evaluating the opportunity."
          ],
          [
            "D",
            "Run a limited, reversible pilot with representative branch staff and compare observed use and outcomes against the agreed criteria before expanding."
          ],
          [
            "E",
            "Use another vendor's claimed savings as the project's realized benefit so that the team can preserve its remaining budget for rollout."
          ]
        ],
        "correct": [
          "A",
          "D"
        ],
        "explanation": "The uncertain link is between recommendations, staff behavior, and operating outcomes. Decision criteria make the expected value and unacceptable trade-offs testable. A limited, reversible pilot then provides evidence about those uncertainties before the organization commits most of its remaining budget. Historical algorithm performance is useful evidence about one component, but does not by itself demonstrate adoption or net business value.",
        "rationales": {
          "A": "Correct. It defines what value means and what evidence should change the investment decision, including the inventory trade-off.",
          "B": "Predictive accuracy does not establish whether staff will use the recommendations or whether resulting inventory levels are acceptable.",
          "C": "It postpones evidence about the adoption assumption that the case identifies as critical to value.",
          "D": "Correct. It tests the uncertain benefit mechanism with representative users while limiting the scale of commitment.",
          "E": "A vendor claim from a different setting is neither an observed project benefit nor a substitute for testing the project's assumptions."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Strategies for threats, p. 204 (PDF p. 309), including early tests and prototypes to reduce uncertainty; §2.7.2.2–2.7.2.3, p. 96 (PDF p. 201).",
          "PMP Examination Content Outline, July 2026, Process Task 3: value-based delivery, stakeholder feedback, and benefit measurement."
        ],
        "difficultyReason": "Selects complementary evidence and learning actions that test adoption and net value, rather than equating technical performance with realized benefits.",
        "id": "pmp-set2-078",
        "instruction": "Select TWO answers."
      },
      {
        "n": 79,
        "domain": "Process",
        "task": 7,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "quantitative": true,
        "stem": "A predictive project must choose its pre-release test package within a six-hour facility window. The approved quality plan requires Test R in this window; it has no acceptable substitute. Remaining time should maximize the expected rework cost avoided. The other tests address separate defect families, their benefits are additive, all listed test costs are already funded, and each test must run in full. Which package best meets the plan?",
        "exhibit": {
          "headers": [
            "Test",
            "Hours",
            "Decision evidence"
          ],
          "rows": [
            [
              "R — Critical protection verification",
              "3",
              "Mandatory release criterion; benefit is not traded against rework savings."
            ],
            [
              "S — Interface regression",
              "2",
              "Expected rework cost avoided: $7,000."
            ],
            [
              "T — Extended endurance",
              "3",
              "Expected rework cost avoided: $8,000."
            ],
            [
              "U — Configuration checks",
              "1",
              "Expected rework cost avoided: $3,500."
            ]
          ]
        },
        "options": [
          [
            "A",
            "Run S, T, and U: six hours and $18,500 in expected rework cost avoided."
          ],
          [
            "B",
            "Run R, S, and U: six hours, with the mandatory criterion tested and $10,500 in expected rework cost avoided."
          ],
          [
            "C",
            "Run R and T: six hours, with the mandatory criterion tested and $8,000 in expected rework cost avoided."
          ],
          [
            "D",
            "Run R and S: five hours, with the mandatory criterion tested and $7,000 in expected rework cost avoided."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "First satisfy the non-substitutable quality requirement: Test R consumes three of the six hours. Of the feasible optional combinations within the remaining three hours, S plus U avoids $10,500 in expected rework cost, more than T alone at $8,000. R plus S plus U therefore meets the mandatory criterion and makes the best use of the stated optional-test objective. Expected benefits are forecasts, not guaranteed savings or evidence that the tests have already passed.",
        "rationales": {
          "A": "It fits the time window and has the largest listed optional benefit, but omits the mandatory test and therefore fails the quality plan.",
          "B": "Correct. Three plus two plus one equals six hours; the optional expected benefit is $7,000 plus $3,500, or $10,500.",
          "C": "It is feasible and includes R, but T's $8,000 expected benefit is less than the $10,500 from S and U in the same three hours.",
          "D": "It is feasible but leaves one hour unused even though U fits and adds $3,500 in expected benefit."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Test and inspection planning and Testing/product evaluations, p. 205 (PDF p. 310).",
          "PMBOK Guide, Eighth Edition, Guide §2.7.2.2–2.7.2.6, pp. 96–98 (PDF pp. 201–203): iterative identification, analysis, response implementation, and monitoring."
        ],
        "difficultyReason": "Combines a mandatory quality constraint, indivisible test durations, and additive expected benefits; the highest unconstrained benefit and the largest single optional test are both inferior decisions.",
        "id": "pmp-set2-079",
        "instruction": "Select ONE answer."
      },
      {
        "n": 80,
        "domain": "People",
        "task": 8,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "stem": "An agile project's sponsor needs to decide whether to book a launch campaign. The latest forecast gives a range of possible release dates, and the main uncertainty is an unresolved external integration. The team's dashboard currently shows only the most likely date as a single green milestone. What should the project manager change in the next sponsor update?",
        "options": [
          [
            "A",
            "Show the relevant forecast range and assumptions, explain the integration exposure and response, and state when the forecast will be reviewed for the campaign decision."
          ],
          [
            "B",
            "Keep the green milestone and put the uncertainty only in the technical risk register, which the sponsor can request."
          ],
          [
            "C",
            "Replace the most likely date with the latest modeled date and describe that date as guaranteed."
          ],
          [
            "D",
            "Send all model outputs without interpretation so the sponsor can independently infer which uncertainty affects the campaign."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The sponsor needs decision-relevant uncertainty, not just a technically available risk register or a single date that hides the range. A tailored update should connect the forecast and its assumptions to the unresolved integration, explain the response, and identify the next review or decision point. This supports an informed campaign decision without converting a model output into a guarantee.",
        "rationales": {
          "A": "Correct. It gives the sponsor the uncertainty, context, response, and review timing needed for the stated decision.",
          "B": "It leaves the main status view misleading and shifts the burden of discovering decision-critical uncertainty to the sponsor.",
          "C": "A latest modeled date depends on the model and its assumptions; it does not become a guarantee because it is later.",
          "D": "Raw detail without interpretation is poorly tailored to the sponsor's decision and can obscure the important dependency."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Project reporting, p. 191 (PDF p. 296), and Simulation, pp. 197–198 (PDF pp. 302–303)."
        ],
        "difficultyReason": "Selects a transparent, decision-focused forecast update rather than hiding uncertainty or overwhelming the audience.",
        "id": "pmp-set2-080",
        "instruction": "Select ONE answer."
      }
    ]
  },
  {
    "number": 9,
    "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch9.md",
    "caseStudy": {
      "id": "pmp-set2-case-09",
      "title": "Shared case for Questions 081–083 — Service-request intake pilot",
      "markdown": "An agile team is improving a service-request intake application through short iterations. It has piloted a new submission checklist. The project measures completeness of submitted requests and monitors the experience of both desk and field users. Treat each question independently.\n\n| Project record | Evidence |\n|---|---|\n| Metric definition | First-pass acceptance means a unique request meets all completeness checks on its first review, without correction. Final acceptance after correction is reported separately. |\n| Current pilot | 120 unique requests: 102 passed on first review; 18 required correction. Those 18 contained 27 individual defects. All 120 eventually passed after corrections. No requests were excluded from the record. |\n| Earlier comparison | Before the checklist, 96 of 120 requests passed on first review. That earlier group included both new and experienced users; the current pilot included only experienced users. Case complexity was not recorded. |\n| Customer feedback | Desk users welcome the checklist. Field users report that entering its additional detail during on-site visits interrupts their work. Both groups remain within the project’s intended user population. The issue is not a known violation of an agreed mandatory requirement. |\n| Improvement proposal | A team member wants to standardize the checklist across all branches immediately, stating that the pilot proves it caused better first-pass quality. |"
    },
    "questions": [
      {
        "n": 81,
        "domain": "Process",
        "task": 9,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "pmp-set2-case-09",
        "quantitative": true,
        "stem": "The sponsor asks for the current pilot's first-pass acceptance rate. An analyst reports 100% because every request eventually passed. Which correction should the project manager make?",
        "options": [
          [
            "A",
            "Report 77.5% first-pass acceptance by subtracting the 27 individual defects from the 120 requests."
          ],
          [
            "B",
            "Report 85% first-pass acceptance and 100% final acceptance after correction as separate measures."
          ],
          [
            "C",
            "Report 100% first-pass acceptance because the 18 corrected requests are now conforming."
          ],
          [
            "D",
            "Report 15% first-pass acceptance because 18 of 120 requests required correction."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The agreed metric counts unique requests that pass their first review without correction. Thus, 102 of 120 requests, or 85%, passed first time. The eventual 100% acceptance rate is useful but measures a different outcome and includes rework. Counting individual defects as failed requests is invalid because some of the 18 corrected requests had more than one defect.",
        "rationales": {
          "A": "It mixes defect counts with request counts. Twenty-seven defects do not mean 27 separate requests failed.",
          "B": "Correct. It uses the defined numerator and denominator and keeps first-pass quality distinct from eventual acceptance.",
          "C": "Later correction does not change a request's first-review result.",
          "D": "15% is the proportion requiring correction, the complement of first-pass acceptance."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.7, pp. 26–28 (PDF pp. 131–133): performance measurement, analysis, and reporting.",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.5, pp. 23–24 (PDF pp. 128–129): quality assurance, quality control, and process effectiveness."
        ],
        "difficultyReason": "Reconciles three different quantities—requests, defects, and eventual acceptance—using the agreed metric definition.",
        "id": "pmp-set2-081",
        "instruction": "Select ONE answer."
      },
      {
        "n": 82,
        "domain": "People",
        "task": 6,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "pmp-set2-case-09",
        "stem": "The sponsor proposes closing the field-user feedback because all requests eventually passed and desk users are satisfied. What should the project manager do next?",
        "options": [
          [
            "A",
            "Close the feedback because conformance of the submitted requests establishes that both user groups' expectations have been met."
          ],
          [
            "B",
            "Remove the additional detail immediately, before checking which completeness checks depend on it."
          ],
          [
            "C",
            "Ask desk users to approve the next iteration's design on behalf of both groups because they support the checklist."
          ],
          [
            "D",
          "Review field workflows with users and the product owner, assess the quality–usability trade-off, and agree a response and feedback check."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "A request can meet completeness checks while the process of preparing it remains burdensome for an intended user group. The project should investigate the field users' experience and work with the product owner on a response that preserves the necessary quality outcome. Closing the concern or removing controls before assessing the trade-off would each ignore relevant evidence.",
        "rationales": {
          "A": "Technical conformance is not proof that the process satisfies the needs of every intended user group.",
          "B": "It acts on the concern but risks losing needed information before the quality implications are understood.",
          "C": "Desk users' support does not give them sufficient knowledge or authority to represent the field users' working conditions.",
          "D": "Correct. It actively manages the affected users' expectations while retaining an evidence-based assessment of quality and usability."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.4–2.5.2.6, pp. 72–73 (PDF pp. 177–178): engagement, communication, and monitoring stakeholder needs.",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.5, pp. 23–24 (PDF pp. 128–129): quality assurance, quality control, and process effectiveness."
        ],
        "difficultyReason": "Responds to dissatisfaction even when conformance measures are favorable, without assuming that removing the control is the right solution.",
        "id": "pmp-set2-082",
        "instruction": "Select ONE answer."
      },
      {
        "n": 83,
        "domain": "Business Environment",
        "task": 6,
        "approach": "Agile",
        "difficulty": "Very challenging",
        "format": "multiple",
        "caseId": "pmp-set2-case-09",
        "stem": "Before deciding whether to standardize the checklist, which TWO actions best support a defensible continuous-improvement decision?",
        "options": [
          [
            "A",
            "Check how user experience and case complexity differ between the periods, and examine the defects the checklist was intended to prevent."
          ],
          [
            "B",
            "Record the checklist as a proven cause of improvement because the two periods contain the same number of requests."
          ],
          [
            "C",
            "Run a further bounded comparison with comparable users and case types, using agreed first-pass and user-burden measures before deciding whether to standardize."
          ],
          [
            "D",
            "Repeat the pilot only with the same experienced users and treat another favorable result as proof that all branches will benefit equally."
          ],
          [
            "E",
            "Discard the checklist because the noncomparable groups prove that it had no beneficial effect."
          ]
        ],
        "correct": [
          "A",
          "C"
        ],
        "explanation": "First-pass acceptance increased from 80% to 85%, but the groups differ in user experience and case complexity was not tracked. Equal sample sizes do not remove those alternative explanations. Investigating the differences and conducting a more comparable follow-up can test whether the improvement is repeatable and whether its usability cost is acceptable. The current evidence neither proves that the checklist caused the change nor proves that it has no value.",
        "rationales": {
          "A": "Correct. It investigates plausible alternative explanations and connects the proposed intervention to the defects it should affect.",
          "B": "Equal denominators make the rates easy to compare, but do not make the user groups equivalent or establish causation.",
          "C": "Correct. It tests repeatability and relevant side effects with evidence suited to a decision about broader use.",
          "D": "It may confirm performance in one narrow group, but does not resolve applicability to new users or different cases.",
          "E": "Uncertain attribution is not evidence of no effect; rejecting the checklist on that basis is also unsupported."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Continuous improvement, p. 158 (PDF p. 263), and Retrospectives, pp. 194–195 (PDF pp. 299–300).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.5, pp. 23–24 (PDF pp. 128–129): quality assurance, quality control, and process effectiveness.",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.7, pp. 26–28 (PDF pp. 131–133): performance measurement, analysis, and reporting."
        ],
        "difficultyReason": "Separates an observed rate change from a causal claim and selects both diagnostic and follow-up learning actions while retaining a balancing measure.",
        "id": "pmp-set2-083",
        "instruction": "Select TWO answers."
      },
      {
        "n": 84,
        "domain": "Process",
        "task": 2,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A predictive training-facility project has completed the deliverable inspections, and the results meet the approved acceptance criteria. A user representative emails that the facility looks good but requests an additional simulation station. The scope plan assigns formal acceptance to the customer's facilities director, who has not yet reviewed the evidence. What should the project manager do next?",
        "options": [
          [
            "A",
            "Record formal acceptance using the user representative's email and add the station to maintain customer satisfaction."
          ],
          [
            "B",
            "Keep the completed deliverable open until the extra station is installed, treating every customer request as an existing acceptance criterion."
          ],
          [
            "C",
            "Present the verified deliverable and evidence to the designated acceptance authority, and assess the additional station through the agreed change process."
          ],
          [
            "D",
            "Ask quality assurance to replace the customer's acceptance decision because inspections have already demonstrated conformance."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Inspection evidence supports acceptance, but the plan still requires the designated customer's decision. The additional station is a proposed change to assess separately against the agreed scope; a request does not automatically become an existing acceptance criterion. The project manager should seek the authorized acceptance decision using the evidence and route the new request through the applicable change process.",
        "rationales": {
          "A": "It substitutes an unauthorized positive comment for formal acceptance and adds scope without the agreed assessment.",
          "B": "It retroactively changes the acceptance basis before the additional request has been evaluated or approved.",
          "C": "Correct. It distinguishes verified conformance, authorized acceptance, and a request for additional scope.",
          "D": "Quality assurance can support confidence in the process, but does not acquire the customer's acceptance authority by completing inspections."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.2.2.6, p. 44 (PDF p. 149): objective validation and formal acceptance of deliverables.",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.8, pp. 28–29 (PDF pp. 133–134): assessment and management of project changes."
        ],
        "difficultyReason": "Separates three decisions that can be confused: inspection, acceptance authority, and approval of additional scope.",
        "id": "pmp-set2-084",
        "instruction": "Select ONE answer."
      },
      {
        "n": 85,
        "domain": "People",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "stem": "Before a predictive project develops its operating manuals, maintenance requests 'complete technical detail' while operations requests 'quick instructions that are easy to use during a fault.' Both departments must later accept the manuals, but they have not agreed what those descriptions mean in practice. What is the best next action?",
        "options": [
          [
            "A",
            "Facilitate a review of representative fault scenarios and sample pages, then agree observable acceptance criteria with both departments."
          ],
          [
            "B",
            "Choose the maintenance interpretation because a longer manual can contain more information."
          ],
          [
            "C",
            "Ask the author to finish the entire manual first so stakeholders can resolve their expectations at final acceptance."
          ],
          [
            "D",
            "Set an average page-count target between the departments' preferences and use that as the sole acceptance criterion."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The stakeholders are describing different needs that may be compatible—for example, quick fault guidance supported by deeper technical detail—but the project should not assume the solution. Representative scenarios and sample pages give both groups something concrete to evaluate, allowing them to agree observable acceptance criteria before extensive work is completed.",
        "rationales": {
          "A": "Correct. It makes the competing expectations concrete and aligns the acceptance basis before full development.",
          "B": "More content does not establish suitability for operating conditions or agreement between the accepting groups.",
          "C": "It postpones a known ambiguity until changes are more expensive and acceptance is at risk.",
          "D": "Page count is a convenient output measure but does not establish completeness or usability for the required tasks."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.4–2.5.2.6, pp. 72–73 (PDF pp. 177–178): engagement, communication, and monitoring stakeholder needs.",
          "PMBOK Guide, Eighth Edition, Guide §2.2.2.6, p. 44 (PDF p. 149): objective validation and formal acceptance of deliverables."
        ],
        "difficultyReason": "Applies early expectation alignment to vague quality language before deliverable development.",
        "id": "pmp-set2-085",
        "instruction": "Select ONE answer."
      },
      {
        "n": 86,
        "domain": "People",
        "task": 7,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A hybrid project installs inspection equipment to a fixed plan and improves its review software iteratively. Two new reviewers have read the defect-classification procedure but classify the same borderline examples differently from the experienced reviewer. The experienced reviewer uses contextual cues that are not explained in the procedure. Which action best transfers the knowledge needed for consistent decisions?",
        "options": [
          [
            "A",
            "Send the same procedure again and require each reviewer to confirm that it has been read."
          ],
          [
            "B",
            "Let each reviewer retain a personal interpretation until enough customer complaints identify the better method."
          ],
          [
            "C",
          "Work through boundary examples together, document the experienced reviewer's cues, and verify independent classifications against the agreed interpretation."
          ],
          [
            "D",
            "Route every borderline example permanently to the experienced reviewer without developing the other reviewers' judgment."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The missing knowledge is the reasoning used to interpret borderline cases, not access to the written procedure. Working through representative examples makes that tacit judgment visible. Capturing the relevant cues and then checking independent application provides evidence that the knowledge has transferred and exposes any remaining ambiguity. It should not create new acceptance requirements without the appropriate agreement.",
        "rationales": {
          "A": "Read confirmation measures receipt, not whether the implicit decision logic has been understood or can be applied.",
          "B": "It preserves inconsistent decisions and uses customer harm as the feedback mechanism despite an available learning opportunity.",
          "C": "Correct. It combines explanation, capture, and demonstrated application of the knowledge needed for consistent classification.",
          "D": "It can temporarily contain inconsistency but creates ongoing dependence rather than transferring the knowledge."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.6, pp. 24–26 (PDF pp. 129–131): explicit and tacit knowledge, sharing, and integration."
        ],
        "difficultyReason": "Recognizes tacit judgment as the missing capability and verifies transfer through independent application rather than attendance or document distribution.",
        "id": "pmp-set2-086",
        "instruction": "Select ONE answer."
      },
      {
        "n": 87,
        "domain": "Process",
        "task": 7,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "stem": "A predictive project is qualifying a repeatable production process. A qualified analyst confirms that the process is statistically stable under the agreed control-chart rules. Nevertheless, a meaningful proportion of measured output falls outside the customer's specification limits. Nonconforming output is already contained. Which interpretation should guide the project manager's next action?",
        "options": [
          [
            "A",
            "Stable performance demonstrates acceptable quality, so the nonconforming output can be released."
          ],
          [
            "B",
            "The customer specification limits should be replaced by the calculated control limits because the latter describe actual performance."
          ],
          [
            "C",
            "Adjust the process after every within-control-limit variation until the chart displays no variation."
          ],
          [
            "D",
          "Assess and improve conformance to requirements; statistical stability alone does not demonstrate acceptable output."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "Control limits describe process behavior; specification limits express requirements. A process can be predictable and still produce unacceptable output. With containment already in place, the project should assess the process's ability to meet requirements and select an evidence-based improvement. Neither changing requirements to match the process nor reacting to every ordinary fluctuation resolves that gap.",
        "rationales": {
          "A": "It treats predictability as equivalent to meeting the customer requirements, despite direct evidence of nonconformance.",
          "B": "Control limits and specification limits serve different purposes; one cannot automatically replace the other.",
          "C": "Routine adjustment for ordinary variation can destabilize the process and does not address its underlying performance against the requirements.",
          "D": "Correct. It distinguishes stability from conformance and directs improvement toward the demonstrated performance gap."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Control charts, p. 158 (PDF p. 263); §2.1.6.5, pp. 23–24 (PDF pp. 128–129)."
        ],
        "difficultyReason": "Applies the distinction between statistical control and customer requirements to a project qualification decision.",
        "id": "pmp-set2-087",
        "instruction": "Select ONE answer."
      },
      {
        "n": 88,
        "domain": "Business Environment",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "multiple",
        "stem": "A hybrid service-platform project has a fixed approval gate and iterative software releases. Its approved compliance procedure requires evidence for every mandatory access-control requirement on the release version submitted to the gate. The dashboard shows a 98% test pass rate, but the two remaining tests are mandatory access-control tests that were not run. A vendor certificate covers an earlier version. Which TWO actions should the project manager take before reporting compliance readiness?",
        "options": [
          [
            "A",
            "Treat the overall pass rate as compliance evidence because the unexecuted tests are a small percentage of the total."
          ],
          [
            "B",
            "Trace the mandatory requirements to the submitted release and obtain valid evidence for the missing tests under the approved procedure."
          ],
          [
            "C",
            "Use the earlier certificate for the current release without assessing whether the relevant controls have changed."
          ],
          [
            "D",
            "Report the evidence gap to the gate authority and retain the not-ready status until the mandatory evidence requirements are met."
          ],
          [
            "E",
            "Reclassify the two unexecuted tests as optional to make the dashboard consistent with the planned gate date."
          ]
        ],
        "correct": [
          "B",
          "D"
        ],
        "explanation": "The gate's stated rule requires evidence for every mandatory requirement on the submitted version. A high aggregate pass rate cannot substitute for missing mandatory evidence, and an earlier-version certificate is not automatically applicable. The project manager should close the traceability and testing gap through the approved procedure while reporting the current readiness accurately. No waiver or alternative approval path is provided in the scenario.",
        "rationales": {
          "A": "The percentage of other tests passed does not satisfy a specifically mandatory evidence requirement.",
          "B": "Correct. It ties the requirements and test evidence to the actual release being considered.",
          "C": "It assumes applicability of evidence to a different version without the required assessment.",
          "D": "Correct. It makes the unresolved gap visible and avoids claiming readiness before the stated condition is satisfied.",
          "E": "It changes the compliance basis to match the schedule without authority and does not demonstrate compliance."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.5, pp. 23–24 (PDF pp. 128–129): quality assurance, quality control, and process effectiveness.",
          "PMBOK Guide, Eighth Edition, Guide Test and inspection planning and Testing/product evaluations, p. 205 (PDF p. 310).",
          "PMP Examination Content Outline, July 2026, Business Environment Task 2: compliance requirements, supporting methods, and assessment."
        ],
        "difficultyReason": "Reconciles an apparently strong aggregate metric with requirement-level evidence and version applicability at an approval gate.",
        "id": "pmp-set2-088",
        "instruction": "Select TWO answers."
      },
      {
        "n": 89,
        "domain": "People",
        "task": 3,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "stem": "A hybrid project's experienced delivery team can analyze recurring handover defects, but members wait for the project manager to prescribe every corrective action. The manager has become a bottleneck. The team's proposed process experiments fall within already delegated limits and do not change mandatory acceptance criteria. What is the best leadership response?",
        "options": [
          [
            "A",
            "Continue prescribing each corrective action because consistent decisions require the manager to perform the analysis personally."
          ],
          [
            "B",
          "Coach structured problem-solving, clarify decision boundaries, and let the team own the experiment and evidence review."
          ],
          [
            "C",
            "Remove all review points and decision limits so the team becomes fully independent immediately."
          ],
          [
            "D",
            "Assign the most senior specialist sole authority over every improvement and require the rest of the team to wait for instructions."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The team has the technical capability and delegated scope needed to take ownership, but its working pattern remains dependent on the manager. Coaching with clear boundaries and an agreed evidence review develops autonomy while maintaining accountability. Prescribing every action perpetuates the bottleneck; removing all controls is unnecessary because empowerment can operate within defined limits.",
        "rationales": {
          "A": "It preserves the dependency that is slowing improvement and underuses the team's demonstrated capability.",
          "B": "Correct. It combines coaching, delegated ownership, and evidence-based follow-up without changing mandatory quality requirements.",
          "C": "Autonomy does not require abandoning accountability or the project's agreed decision boundaries.",
          "D": "It transfers the bottleneck to another individual rather than building shared problem-solving capability."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4.2, p. 86 (PDF p. 191): shared ownership, collaboration, empowerment, and delegation.",
          "PMBOK Guide, Eighth Edition, Guide Continuous improvement, p. 158 (PDF p. 263), and Retrospectives, pp. 194–195 (PDF pp. 299–300)."
        ],
        "difficultyReason": "Chooses a leadership response suited to a capable but dependent team while preserving meaningful quality boundaries.",
        "id": "pmp-set2-089",
        "instruction": "Select ONE answer."
      },
      {
        "n": 90,
        "domain": "Process",
        "task": 6,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "quantitative": true,
        "stem": "A predictive project is assessing a quality-improvement proposal over exactly 12 operating months. Volumes and requirements are unchanged. The table gives nonoverlapping MONTHLY cost categories in thousands of dollars. The proposed option also requires a one-time $30,000 setup cost at the start; that setup is not included in any monthly amount. Ignore discounting and assume the monthly forecasts apply throughout the 12 months. Which financial assessment should inform the decision?",
        "exhibit": {
          "headers": [
            "Monthly cost category",
            "Current approach ($000)",
            "Proposed approach ($000)"
          ],
          "rows": [
            [
              "Prevention",
              "2",
              "5"
            ],
            [
              "Appraisal",
              "6",
              "4"
            ],
            [
              "Internal and external failure combined",
              "12",
              "7"
            ]
          ]
        },
        "options": [
          [
            "A",
            "Forecast an $18,000 net cost reduction over 12 months; validate the projected failure-cost reduction and track total cost of quality."
          ],
          [
            "B",
            "Forecast a $60,000 net cost reduction over 12 months; use the decrease in failure costs as the complete business case."
          ],
          [
            "C",
            "Forecast a $48,000 net cost reduction over 12 months; treat the one-time setup as already included in the monthly categories."
          ],
          [
            "D",
            "Reject the proposal because its annual prevention cost is $36,000 higher, regardless of the other cost categories."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The current monthly total is $20,000, or $240,000 over 12 months. The proposed monthly total is $16,000, or $192,000, plus the separate $30,000 setup cost: $222,000 in total. The forecast net reduction is therefore $18,000. The $60,000 reduction in failure costs is only one component; monthly prevention and appraisal costs and setup must also be included. Because the reductions are forecasts, the assumptions need validation and subsequent monitoring rather than being recorded as realized savings.",
        "rationales": {
          "A": "Correct. It includes all stated recurring categories and the separate setup cost, while treating the result as a forecast.",
          "B": "It counts only the $5,000 monthly failure-cost reduction and omits changes in the other categories and setup.",
          "C": "It correctly identifies a $4,000 monthly total reduction, but omits the explicitly separate $30,000 setup cost.",
          "D": "It isolates the $3,000 monthly prevention increase and ignores the larger combined reductions in appraisal and failure costs."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Cost of quality and Figure 5-3, pp. 158–159 (PDF pp. 263–264).",
          "PMBOK Guide, Eighth Edition, Guide §2.4.2.2–2.4.2.4, pp. 62–65 (PDF pp. 167–170): cost estimates, budget, and financial monitoring."
        ],
        "difficultyReason": "Reconciles recurring prevention, appraisal, and failure costs with a separate one-time investment and distinguishes expected benefit from realized savings.",
        "id": "pmp-set2-090",
        "instruction": "Select ONE answer."
      }
    ]
  },
  {
    "number": 10,
    "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch10.md",
    "caseStudy": {
      "id": "C10",
      "title": "Condition-monitoring procurement",
      "markdown": "A predictive project is procuring condition-monitoring equipment. The published selection procedure first excludes any bid exceeding $150,000 or a guaranteed support-response time of four hours. Neither gate may be negotiated away at this selection stage. All other mandatory requirements are met. Among eligible bids, the highest weighted score wins: 60% technical score plus 40% service score. Scores are on a 0–100 scale; price is a gate, not another weighted criterion. Treat each question independently.\n\n| Bid | Price and guaranteed response | Technical and service scores |\n|---|---|---|\n| A | $118,000; 8 hours | Technical 92; service 90 |\n| B | $145,000; 4 hours | Technical 86; service 88 |\n| C | $152,000; 2 hours | Technical 96; service 96 |\n| D | $149,000; 3 hours | Technical 91; service 85 |\n\nProcurement controls bidder communications. After award, the project change authority approves baseline changes, while only the designated procurement officer may amend the contract. The project manager holds neither authority."
    },
    "questions": [
      {
        "n": 91,
        "id": "pmp-set2-091",
        "domain": "Process",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": "C10",
        "stem": "Which bid should the project manager recommend under the published selection procedure?",
        "options": [
          [
            "A",
            "Bid A: its weighted score of 91.2 exceeds those of B and D, and it has the lowest price."
          ],
          [
            "B",
            "Bid B: it passes both gates and is the least expensive eligible bid."
          ],
          [
            "C",
            "Bid C: its weighted score of 96 is the highest of all four bids."
          ],
          [
            "D",
            "Bid D: it passes both gates and has the highest eligible weighted score, 88.6."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "Apply eligibility before ranking. A fails the response-time gate and C exceeds the budget ceiling. Eligible B scores 0.60 × 86 + 0.40 × 88 = 86.8; eligible D scores 0.60 × 91 + 0.40 × 85 = 88.6. D therefore wins. The procedure does not authorize substituting lowest price for the published weighted criteria.",
        "rationales": {
          "A": "The calculation is correct, but A is ineligible because its eight-hour response exceeds four hours.",
          "B": "B is eligible, but lowest price does not determine the winner once the gates are satisfied.",
          "C": "C is ineligible because its price exceeds the ceiling, regardless of its superior weighted score.",
          "D": "Correct. D meets both mandatory gates and outranks the other eligible bid."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide X4.5–X4.7: bid processes and source-selection criteria, pp. 248–250 (PDF pp. 353–355).",
          "PMBOK Guide, Eighth Edition, Guide Multicriteria decision analysis, pp. 183 (PDF pp. 288)."
        ],
        "difficultyReason": "Applies two mandatory gates before calculation and resists both the highest unqualified score and the lowest eligible price.",
        "instruction": "Select ONE answer.",
        "quantitative": true
      },
      {
        "n": 92,
        "id": "pmp-set2-092",
        "domain": "People",
        "task": 4,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": "C10",
        "stem": "Independently, consider the period before the bid deadline. One bidder submits a proprietary design sketch with a question that exposes an ambiguity in a requirement. The technical team confirms that the clarification could materially affect every bid. What should the project manager arrange?",
        "options": [
          [
            "A",
            "Send the technical answer only to the bidder that identified the ambiguity, so its initiative is rewarded."
          ],
          [
            "B",
            "Circulate the complete question and proprietary sketch to all bidders to provide identical information."
          ],
          [
            "C",
            "Have procurement issue a common requirement clarification to all bidders, protect the proprietary design, and provide an appropriate common response period."
          ],
          [
            "D",
            "Wait until after the deadline and interpret each proposal against the clarified requirement without reopening communication."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Fair engagement requires that all bidders receive the material requirement clarification through the controlled procurement channel. Equal access to the clarified requirement does not require disclosing one bidder’s proprietary design. Procurement should also consider the time bidders need to respond consistently.",
        "rationales": {
          "A": "This creates unequal access to information that affects proposal preparation.",
          "B": "It shares relevant information but unnecessarily exposes confidential design content.",
          "C": "Correct. It balances equal access, confidentiality, and sufficient response time.",
          "D": "It allows proposals to be prepared against different understandings and assessed against a later interpretation."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide X4.5–X4.7: bid processes and source-selection criteria, pp. 248–250 (PDF pp. 353–355)."
        ],
        "difficultyReason": "Balances transparency with protection of proprietary information, rather than treating either as an absolute override.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 93,
        "id": "pmp-set2-093",
        "domain": "Business Environment",
        "task": 3,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": "C10",
        "stem": "Independently, assume an authorized contract is now in place. The sponsor requests a remote-alarm feature outside the statement of work. The supplier offers to add it at no charge, but it would change cybersecurity testing, integration work, and acceptance criteria. Which TWO actions should the project manager coordinate before the added work begins?",
        "options": [
          [
            "A",
            "Authorize the work from the sponsor’s email because there is no increase in the supplier’s price."
          ],
          [
            "B",
            "Assess the integrated impacts and submit the proposed baseline changes to the project’s change authority."
          ],
          [
            "C",
            "Treat the supplier’s offer as a contract amendment once the project change authority approves the revised baseline."
          ],
          [
            "D",
            "Ask the supplier to begin the feature while the project team documents the change retrospectively."
          ],
          [
            "E",
            "Have the authorized procurement officer formalize the contract change, consistent with the approved project decision."
          ]
        ],
        "correct": [
          "B",
          "E"
        ],
        "explanation": "A zero-price offer can still alter scope, risks, dependencies, and acceptance obligations. The project needs an integrated change decision and an authorized contract amendment. These are distinct authorities in the case. The project manager coordinates both before authorizing implementation through the appropriate channel.",
        "rationales": {
          "A": "The sponsor’s request and zero price do not satisfy either stated approval process.",
          "B": "Correct. It evaluates the full project impact and obtains the required baseline decision.",
          "C": "Project change approval does not itself amend the supplier’s contractual obligations.",
          "D": "Starting first bypasses the required decisions and exposes the project to unapproved work.",
          "E": "Correct. The designated officer must formalize the supplier obligations after the project decision is approved."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: integrated change control, pp. 28–29 (PDF pp. 133–134).",
          "PMBOK Guide, Eighth Edition, Guide Negotiation: procurement negotiation and signing authority, pp. 183 (PDF pp. 288)."
        ],
        "difficultyReason": "Distinguishes project baseline authority from contract authority when a free offer still changes delivery obligations.",
        "instruction": "Select TWO answers."
      },
      {
        "n": 94,
        "id": "pmp-set2-094",
        "domain": "Process",
        "task": 10,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "dropdown",
        "caseId": null,
        "stem": "A predictive project’s equipment has been formally accepted. The final invoice has not been reconciled, and warranty records and support ownership have not been transferred. The organization requires these actions before administrative contract closure; it does not require waiting for the warranty period to expire. The project manager should _____.",
        "options": [
          [
            "A",
            "close the contract now and leave all remaining activities to the supplier"
          ],
          [
            "B",
            "coordinate invoice reconciliation and transfer of warranty records and support responsibility, then complete authorized closure"
          ],
          [
            "C",
            "hold the project open until every warranty period expires even if the required transfers are complete"
          ],
          [
            "D",
            "repeat technical acceptance instead of completing the outstanding administrative activities"
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "Physical acceptance is one closure condition. The stated procedure also requires financial reconciliation and an explicit handover of continuing support responsibilities and records. Completing those actions enables administrative closure without inventing a requirement to keep the project open throughout the warranty period.",
        "rationales": {
          "A": "It leaves required financial and transition activities incomplete.",
          "B": "Correct. It completes the stated administrative conditions and establishes ownership of continuing obligations.",
          "C": "The scenario explicitly excludes that additional closure requirement.",
          "D": "Repeating acceptance does not resolve invoice reconciliation or support handover."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.9–2.1.6.9.1: project and contract closure, pp. 31–32 (PDF pp. 136–137)."
        ],
        "difficultyReason": "Distinguishes acceptance of the deliverable from completion of the stated closure conditions.",
        "instruction": "Select the best completion."
      },
      {
        "n": 95,
        "id": "pmp-set2-095",
        "domain": "People",
        "task": 1,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "An agile supplier team celebrates completed features, while the buyer’s operations team expects shorter customer handover times. Both are meeting their local activity targets, but team members cannot explain how the delivered features support the intended outcome. Existing contract terms allow the teams to agree shared working measures without changing payment or scope. What should the project manager do first?",
        "options": [
          [
            "A",
            "Increase the supplier’s feature target so that a larger output will establish the intended benefit."
          ],
          [
            "B",
            "Facilitate a shared outcome discussion and agree a common vision and observable success measures within the existing agreement."
          ],
          [
            "C",
            "Replace the agreed payment model with a benefits-only arrangement at the next team meeting."
          ],
          [
            "D",
            "Ask operations to stop discussing outcomes until the supplier has finished all planned features."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The immediate gap is a shared understanding of success. Bringing the buyer and supplier together around the intended customer outcome helps connect delivery choices to value. The scenario permits shared working measures, so this action does not require the project manager to invent new commercial authority.",
        "rationales": {
          "A": "More output does not establish that the teams understand or achieve the intended outcome.",
          "B": "Correct. It creates a common direction and a way to assess progress toward that direction.",
          "C": "Changing payment terms exceeds the working agreement described and does not first resolve the shared-vision gap.",
          "D": "It postpones feedback that is needed to guide adaptive delivery."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6: team leadership and shared vision, pp. 84–86 (PDF pp. 189–191).",
          "PMBOK Guide, Eighth Edition, Guide X4.8.1–X4.8.2: fundamental contract models and adaptive arrangements, pp. 251–252 (PDF pp. 356–357)."
        ],
        "difficultyReason": "Identifies a shared-vision gap from conflicting local definitions of success.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 96,
        "id": "pmp-set2-096",
        "domain": "Process",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "matching",
        "caseId": null,
        "stem": "A hybrid program has four procurement packages with different uncertainty and payment needs. Match each stated need to the most suitable arrangement. Use the terms according to their fundamental payment and risk characteristics.",
        "options": [
          [
            "A",
            "Cost-reimbursable contract"
          ],
          [
            "B",
            "Target-cost contract"
          ],
          [
            "C",
            "Fixed-price contract"
          ],
          [
            "D",
            "Outcome-based payment arrangement"
          ],
          [
            "E",
            "Time-and-materials contract"
          ]
        ],
        "correct": {
          "1": "C",
          "2": "A",
          "3": "E",
          "4": "B"
        },
        "explanation": "Package 1 calls for a predetermined total price and seller exposure to estimation overruns: fixed price. Package 2 reimburses allowable costs plus a fee under high uncertainty: cost reimbursable. Package 3 pays actual hours at fixed rates and materials: time and materials, with controls on exposure. Package 4 explicitly shares savings and overruns against a target: target cost. No package makes payment conditional on an observed business outcome.",
        "rationales": {
          "A": "Matches 2. The buyer accepts allowable-cost exposure and pays the agreed fee while scope is uncertain.",
          "B": "Matches 4. The distinguishing feature is the agreed sharing of savings and overruns against a target cost.",
          "C": "Matches 1. The seller agrees to the defined work for a predetermined total price.",
          "D": "Unused. None of the stated needs ties payment to achievement of an observable business outcome.",
          "E": "Matches 3. Payment follows actual labor time at agreed rates and materials, requiring monitoring against the cap."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide X4.8.1–X4.8.2: fundamental contract models and adaptive arrangements, pp. 251–252 (PDF pp. 356–357)."
        ],
        "difficultyReason": "Separates price certainty, reimbursed-cost exposure, hourly payment, and shared target-cost risk without equating agile work with a single contract type.",
        "instruction": "Match each procurement need to the most suitable arrangement. Use each choice at most once; one choice is unused.",
        "prompts": [
          [
            "1",
            "Defined equipment installation: predetermined total price; seller bears estimation cost overruns for the agreed scope."
          ],
          [
            "2",
            "Uncertain research: reimburse allowable actual costs plus an agreed fee; buyer accepts the cost exposure."
          ],
          [
            "3",
            "Temporary specialists: pay actual hours at fixed hourly rates and material costs, monitored against an agreed cap."
          ],
          [
            "4",
            "Integration package: agree a target cost and share savings and overruns using a negotiated formula."
          ]
        ]
      },
      {
        "n": 97,
        "id": "pmp-set2-097",
        "domain": "Business Environment",
        "task": 1,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "An agile supplier agreement allows the product owner to exchange backlog items within purchased capacity. Only the procurement officer may commit additional supplier spending. To meet a new stakeholder request, the product owner promises the supplier two extra specialists beyond the approved capacity and budget. The supplier has not started that work. What should the project manager do next?",
        "options": [
          [
            "A",
            "Clarify the authority boundary and route the additional capacity and funding request through the authorized decision process before a supplier commitment is made."
          ],
          [
            "B",
            "Treat the promise as authorized because backlog ownership includes all supplier spending needed to deliver the backlog."
          ],
          [
            "C",
            "Ask the supplier to start the extra specialists and offset the invoice by removing backlog items later."
          ],
          [
            "D",
            "Prohibit further backlog exchanges until every future iteration has a fixed scope."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "Adaptive prioritization operates within agreed governance. The product owner can exchange work within purchased capacity, but the scenario expressly reserves additional spending commitments to procurement. The project manager should clarify the boundary and seek the necessary decision before the supplier proceeds; permitted work within the current agreement can continue.",
        "rationales": {
          "A": "Correct. It respects adaptive prioritization while applying the stated commercial and funding authority.",
          "B": "The stated delegation covers backlog exchanges, not additional commitments.",
          "C": "It incurs exposure before the authorized decision and assumes later exchanges will offset a separate capacity purchase.",
          "D": "It unnecessarily removes flexibility already permitted by the agreement."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.3–2.1.4: effective governance and investment decisions, pp. 13 (PDF pp. 118).",
          "PMBOK Guide, Eighth Edition, Guide Negotiation: procurement negotiation and signing authority, pp. 183 (PDF pp. 288).",
          "PMBOK Guide, Eighth Edition, Guide X4.8.1–X4.8.2: fundamental contract models and adaptive arrangements, pp. 251–252 (PDF pp. 356–357)."
        ],
        "difficultyReason": "Distinguishes delegated backlog decisions from a separate financial commitment without abandoning adaptive delivery.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 98,
        "id": "pmp-set2-098",
        "domain": "People",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid project’s supplier says late buyer interface information caused a milestone delay; the buyer team says the supplier failed to use information already provided. Neither side has reviewed the dated records together. The agreement requires an initial joint negotiation and allows undisputed work to continue during that process. What should the project manager do first?",
        "options": [
          [
            "A",
            "Reject the supplier’s claim because the buyer team believes the information was available."
          ],
          [
            "B",
            "Accept the supplier’s requested extension immediately to protect the relationship."
          ],
          [
            "C",
            "Stop all supplier work until the disagreement has been resolved through the final escalation level."
          ],
          [
            "D",
            "Bring the parties and authorized procurement representative together to examine the dated records and obligations, negotiate the issue, and continue undisputed work as agreed."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The disagreement contains disputed facts and contractual responsibilities. A joint review of records gives the authorized parties a basis for negotiation without prejudging entitlement. The stated agreement provides both the initial resolution route and permission to continue undisputed work, so neither automatic concession nor blanket stoppage is justified.",
        "rationales": {
          "A": "It substitutes one team’s assertion for a shared review of evidence and obligations.",
          "B": "Maintaining a relationship does not require conceding an unassessed claim.",
          "C": "It bypasses the initial negotiation process and disrupts work the agreement permits to continue.",
          "D": "Correct. It combines evidence-based conflict resolution, appropriate authority, and the stated continuity provisions."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide X4.9.1–X4.9.2: claims, records, negotiation, and dispute resolution, pp. 253–254 (PDF pp. 358–359).",
          "PMBOK Guide, Eighth Edition, Guide Negotiation: procurement negotiation and signing authority, pp. 183 (PDF pp. 288)."
        ],
        "difficultyReason": "Handles a supplier conflict without assuming either party’s account is proven or escalating beyond the agreed initial process.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 99,
        "id": "pmp-set2-099",
        "domain": "Business Environment",
        "task": 8,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A provider used by an agile product announces that, at renewal in six months, its subscription will change to per-transaction pricing. The current contract remains valid and is not breached. Forecast usage under the product roadmap could make operating costs substantially higher than the business case assumed. What should the project manager do next?",
        "options": [
          [
            "A",
            "Report a current contract breach and demand that the provider retain the existing price indefinitely."
          ],
          [
            "B",
            "Wait until the first renewal invoice arrives so that the team can work with actual rather than forecast costs."
          ],
          [
            "C",
            "Assess usage and value impacts with the product owner and sponsor, compare feasible responses before renewal, and route any resulting investment or backlog changes through the appropriate decisions."
          ],
          [
            "D",
            "Remove every high-transaction feature immediately without assessing its customer value or contractual alternatives."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The external pricing change threatens future value, even though current contract performance is unaffected. The remaining six months provide time to examine usage assumptions, alternatives, switching implications, and roadmap trade-offs. Authorized decisions can then adapt investment and delivery plans before the exposure becomes unavoidable.",
        "rationales": {
          "A": "The scenario states there is no current breach and gives no right to indefinite renewal pricing.",
          "B": "It wastes the available planning horizon and may leave too little time to respond.",
          "C": "Correct. It assesses the external change and enables timely, authorized adaptation based on value and alternatives.",
          "D": "It assumes the correct response before evaluating benefits, costs, and available options."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.3–2.1.4: effective governance and investment decisions, pp. 13 (PDF pp. 118).",
          "PMBOK Guide, Eighth Edition, Guide X4.3: make-or-buy analysis and lifecycle considerations, pp. 247 (PDF pp. 352)."
        ],
        "difficultyReason": "Recognizes a future business-case threat without misclassifying it as a present contractual failure.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 100,
        "id": "pmp-set2-100",
        "domain": "Process",
        "task": 1,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid project must release an integrated service at the end of week 8. A supplier offers an adapter ready at the end of week 4; the internal team can build it by the end of week 6. Both routes still require two weeks of end-to-end integration and security testing, performed only by the internal integration team. That team is unavailable until the start of week 7. The supplier quote also excludes data cleansing, whose effort and owner have not been estimated. The sponsor says buying guarantees an earlier release. What should the project manager recommend?",
        "options": [
          [
            "A",
            "Evaluate both routes in an integrated plan, including data-cleansing ownership, total costs and testing capacity; the earlier supplier handoff alone does not advance the stated release window."
          ],
          [
            "B",
            "Buy immediately because the supplier’s week-4 handoff guarantees a release two weeks earlier than an internal build."
          ],
          [
            "C",
            "Choose the internal build immediately because equal test-team availability proves it must have the lower total cost."
          ],
          [
            "D",
            "Accept the supplier offer and remove internal testing from the plan because earlier delivery provides sufficient schedule assurance."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "Under the stated availability, either route reaches the same earliest two-week testing window: weeks 7–8. A week-4 component handoff therefore does not itself produce an earlier integrated release. The unestimated data-cleansing work could further affect feasibility, cost, and responsibilities. An integrated make-or-buy assessment is needed before commitment; the facts establish neither a cheaper internal route nor permission to omit testing.",
        "rationales": {
          "A": "Correct. It distinguishes component availability from release readiness and resolves missing work and resource assumptions before commitment.",
          "B": "It ignores the shared testing-resource constraint and the supplier’s excluded work.",
          "C": "Equal timing for one resource does not establish total cost or overall feasibility.",
          "D": "Earlier component delivery does not replace the stated integration and security testing requirement."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide X4.3–X4.4: make-or-buy analysis and procurement strategy, pp. 247 (PDF pp. 352).",
          "PMBOK Guide, Eighth Edition, Guide resource availability and its effects on project plans, p. 84 (PDF p. 189)."
        ],
        "difficultyReason": "Reconciles delivery dates with a shared constrained resource and excluded scope, while distinguishing a disproven schedule claim from an unsupported buy-or-build conclusion.",
        "instruction": "Select ONE answer."
      }
    ]
  },
  {
    "number": 11,
    "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch11.md",
    "questions": [
      {
        "n": 101,
        "id": "pmp-set2-101",
        "domain": "Business Environment",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive project manager joins a selection panel and discovers that a close relative owns a bidding company. The panel has not scored proposals. The manager believes they can remain objective. Which response best follows PMI’s conflict-of-interest requirements?",
        "options": [
          [
            "A",
            "Tell the panel chair informally, then continue scoring because no preferential treatment has occurred."
          ],
          [
            "B",
            "Disclose the relationship fully to the appropriate stakeholders and refrain from influencing the selection unless an approved mitigation plan and stakeholder consent permit participation."
          ],
          [
            "C",
            "Give the relative’s company a lower score to offset any appearance of favoritism."
          ],
          [
            "D",
            "Withdraw from the final vote but continue recommending the preferred supplier during panel discussions."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "Disclosure alone is insufficient. Participation requires an approved mitigation plan and stakeholder consent; personal confidence in impartiality does not replace these safeguards.",
        "rationales": {
          "A": "An informal notification does not establish the required mitigation and consent.",
          "B": "Correct. It combines disclosure with withdrawal from influence until the required safeguards are approved.",
          "C": "An artificial penalty compromises fair evaluation.",
          "D": "Recommendations still influence the outcome."
        },
        "references": [
          "PMI Code of Ethics and Professional Conduct, effective 17 November 2025, §4.3.1–4.3.2, printed p. 10 (PDF p. 13): https://www.pmi.org/-/media/pmi/documents/public/pdf/ethics/pmi-code-of-ethics.pdf"
        ],
        "difficultyReason": "Distinguishes disclosure from permission to participate and recognizes indirect influence as participation.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 102,
        "id": "pmp-set2-102",
        "domain": "People",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive project’s approved dashboard reports forecast readiness for its launch date, not just progress against the original baseline. Physical work is on schedule, but a required external approval is now forecast three weeks after launch. The sponsor asks for a green status because the team has not missed a construction milestone. The report is due today. What should the project manager do?",
        "options": [
          [
            "A",
            "Report the forecast approval delay and its launch impact using the agreed status criteria, including the assumptions, recovery options, and decision needed."
          ],
          [
            "B",
            "Keep the overall status green and mention the approval only in a separate file that dashboard recipients are not expected to read."
          ],
          [
            "C",
            "Remove the approval from the dashboard until its actual decision date is known."
          ],
          [
            "D",
            "Delay the report until a recovery option has been approved so that no unresolved concern is communicated."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The report’s purpose is forecast launch readiness. Favorable physical progress does not remove a known approval dependency. Timely reporting should make the impact and uncertainty visible and identify the decision or response required. The project manager can discuss the concern constructively with the sponsor while preserving the agreed reporting basis.",
        "rationales": {
          "A": "Correct. It applies the defined reporting purpose and gives decision-makers actionable information.",
          "B": "A green summary would misrepresent launch readiness; a hard-to-find attachment does not correct that message.",
          "C": "Forecast information is relevant precisely because action may be possible before the delay is realized.",
          "D": "An unresolved concern is a reason for transparent reporting, not for withholding the report."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.7: monitoring, analysis, and reporting, pp. 26–28 (PDF pp. 131–133).",
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: stakeholder engagement and communication, pp. 72–73 (PDF pp. 177–178).",
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.6: accountable leadership, pp. 47–48 (PDF pp. 70–71)."
        ],
        "difficultyReason": "Reconciles favorable delivery progress with an unfavorable authorization dependency under the dashboard’s stated purpose.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 103,
        "id": "pmp-set2-103",
        "domain": "Process",
        "task": 2,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "hotspot",
        "caseId": null,
        "stem": "An agile team is refining an upcoming release. Its refinement agreement requires every mandatory requirement to have an identified backlog item, an accountable owner, and a defined, observable verification method before the item is ready for selection. Execution evidence is expected later and is not required at refinement. All four requirements below are mandatory. Which row needs clarification before it can be considered ready?",
        "options": [
          [
            "A",
            "R1 — search response; item 31; owner Mei; verify response within 2 seconds at 200 concurrent users."
          ],
          [
            "B",
            "R2 — keyboard navigation; item 32; owner Luis; verify the documented checkout journey using only the keyboard."
          ],
          [
            "C",
            "R3 — account recovery; item 33; owner Ada; user-friendly recovery with no agreed observable criteria."
          ],
          [
            "D",
            "R4 — export encoding; item 34; owner Sam; verify UTF-8 output with the specified file validator."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "R3 has a backlog item and owner but no observable verification method: “user-friendly” has not been defined. The team should clarify the required behavior and how it will be checked. R1, R2, and R4 have the required refinement information; their tests do not need to have been executed yet.",
        "rationales": {
          "A": "It has a measurable response threshold and a specified load condition.",
          "B": "It identifies the relevant journey and an observable keyboard-only check.",
          "C": "Correct. The proposed verification description cannot yet establish whether the requirement is satisfied.",
          "D": "It states the encoding and how the resulting file will be checked; lack of execution at refinement is not a gap."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.2.2–2.2.2.2: scope definition and requirements analysis, pp. 39–40 (PDF pp. 144–145)."
        ],
        "difficultyReason": "Distinguishes a missing verification definition from execution evidence that is not yet due.",
        "instruction": "Select ONE requirement row.",
        "exhibit": {
          "headers": [
            "Requirement",
            "Refinement record"
          ],
          "rows": [
            [
              "R1: Search response",
              "Item 31; owner Mei; verify response ≤2 seconds at 200 concurrent users."
            ],
            [
              "R2: Keyboard navigation",
              "Item 32; owner Luis; verify completion of the documented checkout journey using only the keyboard."
            ],
            [
              "R3: Account recovery",
              "Item 33; owner Ada; verify that recovery is user-friendly; no agreed observable criteria."
            ],
            [
              "R4: Export encoding",
              "Item 34; owner Sam; verify UTF-8 output using the specified file validator."
            ]
          ]
        },
        "hotspotType": "requirements",
        "hotspotColumn": 1,
        "hotspotInstruction": "Select the refinement record that lacks a required readiness element.",
        "hotspotTarget": {
          "row": "C",
          "column": 1
        }
      },
      {
        "n": 104,
        "id": "pmp-set2-104",
        "domain": "People",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "At an agile team’s retrospective, a junior tester raises a concern about a release decision. A senior engineer interrupts and says that questioning an experienced colleague damages trust. The tester stops speaking. No finding has yet been established. What should the project manager do first?",
        "options": [
          [
            "A",
            "Ask the tester to withdraw the concern unless they can immediately prove the decision was wrong."
          ],
          [
            "B",
            "End the retrospective and send the entire matter to the sponsor before hearing the concern."
          ],
          [
            "C",
            "Accept the senior engineer’s judgment because experience establishes decision authority in a self-managing team."
          ],
          [
            "D",
            "Restore respectful discussion, invite the tester to explain the evidence, and reinforce the team’s expectation that concerns can be raised without ridicule."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The immediate leadership need is a safe, respectful environment for examining the concern. Inviting evidence does not prejudge the release decision or accuse the engineer. It enables the team to learn and take an appropriate next step once the facts are understood.",
        "rationales": {
          "A": "It discourages early reporting and sets an unreasonable threshold for raising a concern.",
          "B": "It escalates before addressing the interaction or understanding the evidence.",
          "C": "Experience does not justify silencing other team members.",
          "D": "Correct. It restores the conditions for constructive, evidence-based discussion."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.6: accountable leadership, pp. 47–48 (PDF pp. 70–71).",
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4: leading the team, pp. 84–86 (PDF pp. 189–191)."
        ],
        "difficultyReason": "Identifies the immediate leadership response to behavior that suppresses a team member’s voice.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 105,
        "id": "pmp-set2-105",
        "domain": "Business Environment",
        "task": 2,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "multiple",
        "caseId": null,
        "stem": "A hybrid project has a fixed field-trial date and an iteratively developed control application. A written trial authorization permits up to 40 participants using simulated equipment. The proposed next release would enroll 60 participants and connect to live equipment. The compliance owner confirms that both changes require revised authorization before that trial; the existing 40-person simulated trial may continue. The sponsor says calling the next release a “pilot” preserves the exemption. Which TWO actions should the project manager coordinate?",
        "options": [
          [
            "A",
            "Use the confirmed applicability conditions to define the revised authorization and evidence needed for the proposed trial, with accountable owners."
          ],
          [
            "B",
            "Record the sponsor’s acceptance of the risk as a replacement for the revised authorization."
          ],
          [
            "C",
            "Apply only the participant limit, because an iterative release cannot change the equipment conditions of an authorization."
          ],
          [
            "D",
            "Integrate the authorization work and decision point into the release plan, keeping activity within the existing permission until the revision is granted."
          ],
          [
            "E",
            "Stop every project activity indefinitely, including the explicitly permitted simulated trial and preparation of the application."
          ]
        ],
        "correct": [
          "A",
          "D"
        ],
        "explanation": "The scenario supplies an explicit interpretation: both the participant increase and live-equipment connection need revised authorization. A different label does not change those conditions. The team should translate the requirements into owned evidence and planned approval work, while preserving the boundary between permitted activity and the proposed trial. Neither sponsor risk acceptance nor blanket suspension follows the stated rules.",
        "rationales": {
          "A": "Correct. It converts confirmed compliance conditions into concrete, owned work.",
          "B": "The scenario does not delegate power to the sponsor to replace the required authorization.",
          "C": "It ignores one of the two expressly confirmed triggers.",
          "D": "Correct. It connects compliance work to delivery sequencing while allowing activity already permitted.",
          "E": "It unnecessarily stops work that the stated authorization still permits."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.2–2.1.4: governance models, metrics, escalation, and investment control, pp. 11–13 (PDF pp. 116–118).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6: governance, integration, and compliance, pp. 15–16 (PDF pp. 120–121)."
        ],
        "difficultyReason": "Applies two independent authorization triggers while distinguishing restricted release activity from permitted ongoing work.",
        "instruction": "Select TWO answers."
      },
      {
        "n": 106,
        "id": "pmp-set2-106",
        "domain": "Process",
        "task": 1,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "matching",
        "caseId": null,
        "stem": "A hybrid project combines iterative feature delivery with formal investment reviews. The team is integrating its plans and has identified four information gaps. Match each gap to the primary artifact that should contain the missing information. These artifacts are complementary; select the best fit for the specific information requested.",
        "options": [
          [
            "A",
            "Integrated milestone schedule"
          ],
          [
            "B",
            "Decision log"
          ],
          [
            "C",
            "Responsibility assignment matrix"
          ],
          [
            "D",
            "Communications management plan"
          ],
          [
            "E",
            "Product backlog"
          ]
        ],
        "correct": {
          "1": "C",
          "2": "A",
          "3": "D",
          "4": "B"
        },
        "explanation": "Ownership and participation belong in a responsibility assignment matrix. Cross-team timing and review dependencies belong in the integrated milestone schedule. Recipients, frequency, and channels belong in the communications plan. A decision log preserves a decision’s rationale, authority, and conditions. The product backlog orders product work but is not the primary home for these four governance records.",
        "rationales": {
          "A": "Matches 2: it connects evidence readiness, review dates, and delivery dependencies.",
          "B": "Matches 4: it records the approved choice and why and under what conditions it was made.",
          "C": "Matches 1: it makes accountable and participating roles explicit.",
          "D": "Matches 3: it specifies how the required information reaches the relevant audiences.",
          "E": "Unused: none of the gaps asks which product feature should be developed next."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.2–2.1.4: governance models, metrics, escalation, and investment control, pp. 11–13 (PDF pp. 116–118).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.2: integrate and align project plans, pp. 18–19 (PDF pp. 123–124).",
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: stakeholder engagement and communication, pp. 72–73 (PDF pp. 177–178)."
        ],
        "difficultyReason": "Distinguishes ownership, dependencies, reporting arrangements, and decision history within one integrated planning context.",
        "instruction": "Match each planning need to its primary artifact. Use each choice at most once; one choice is unused.",
        "prompts": [
          [
            "1",
            "Who is accountable for preparing each investment-review submission, and who must contribute or be consulted?"
          ],
          [
            "2",
            "When must team evidence be ready relative to the investment review and dependent release milestones?"
          ],
          [
            "3",
            "Which audiences receive each governance report, how often, and through which approved channel?"
          ],
          [
            "4",
            "What investment option was authorized, by whom, on what rationale, and subject to which conditions?"
          ]
        ]
      },
      {
        "n": 107,
        "id": "pmp-set2-107",
        "domain": "People",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid project’s external assurance reviewer requests raw employee feedback to validate a training finding. Employees were told that comments would be shared only in de-identified form. The approved assurance protocol allows de-identified records and confidential inspection by a designated internal reviewer; it does not permit external access to identifiable comments. The external reviewer says a summary alone will be insufficient. What should the project manager do next?",
        "options": [
          [
            "A",
            "Send the raw comments privately because an assurance purpose overrides the agreed information-access limits."
          ],
          [
            "B",
            "Bring the reviewer and information owner together to agree a sufficient evidence route within the protocol, such as de-identified records supported by the designated internal review."
          ],
          [
            "C",
            "Refuse all assurance access and close the finding because employees were promised confidentiality."
          ],
          [
            "D",
            "Send a high-level summary and mark the finding verified without checking whether it meets the reviewer’s evidence need."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The stakeholders need to align on both evidence sufficiency and permitted access. The protocol already provides routes beyond a summary while protecting identifiable comments. A discussion with the information owner and reviewer can establish an acceptable method; the project manager should not assume verification or unilaterally override the protocol.",
        "rationales": {
          "A": "A private transfer still violates the stated access boundary.",
          "B": "Correct. It addresses the reviewer’s underlying evidence need and the employees’ confidentiality expectation within the approved process.",
          "C": "Confidentiality does not exclude the permitted assurance methods.",
          "D": "It treats an unresolved expectation gap as if it were an accepted verification result."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: stakeholder engagement and communication, pp. 72–73 (PDF pp. 177–178).",
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.6: accountable leadership, pp. 47–48 (PDF pp. 70–71)."
        ],
        "difficultyReason": "Finds a workable alignment between assurance evidence and confidentiality instead of treating them as mutually exclusive demands.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 108,
        "id": "pmp-set2-108",
        "domain": "Process",
        "task": 6,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive project has a $200,000 approved total budget, but the board has released only $120,000 for commitments at this stage. Under its funding rule, paid costs plus unpaid commitments plus new commitments must not exceed the released amount. The project has paid $55,000 and has $50,000 in unpaid commitments; those categories do not overlap. A required new $22,000 work package is ready to be contracted. No existing commitment can be cancelled or reduced. The later $80,000 tranche has not been authorized for use. Which assessment and action are correct?",
        "options": [
          [
            "A",
            "There is $65,000 available because only paid costs count, so the manager may commit the $22,000 now."
          ],
          [
            "B",
            "There is $95,000 available within the total budget, so no staged-funding decision is needed."
          ],
          [
            "C",
            "Only $15,000 remains within the released authority; seek authorization for at least $7,000 more before committing the full package."
          ],
          [
            "D",
            "The project has exceeded its total budget by $7,000 and must report a realized cost overrun."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The released authority is $120,000. Existing paid costs and unpaid commitments consume $105,000, leaving $15,000. The new $22,000 package would raise the combined amount to $127,000, which exceeds released authority by $7,000. This is a funding-authorization gap, not a demonstrated overrun of the $200,000 total budget and not $7,000 already spent.",
        "rationales": {
          "A": "It subtracts paid costs but ignores the unpaid commitments expressly included in the funding rule.",
          "B": "It uses total-budget headroom in place of the smaller released commitment authority.",
          "C": "Correct. It includes both nonoverlapping categories and obtains the additional authority before commitment.",
          "D": "It confuses a proposed excess over a staged authorization with a realized overrun of the total budget."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.2–2.1.4: governance models, metrics, escalation, and investment control, pp. 11–13 (PDF pp. 116–118).",
          "PMBOK Guide, Eighth Edition, Guide §2.4.2.3–2.4.2.4: budget and financial monitoring, pp. 63–65 (PDF pp. 168–170)."
        ],
        "difficultyReason": "Reconciles total budget, released funding, paid costs, and unpaid commitments without double counting or mislabeling a forecast authorization gap.",
        "instruction": "Select ONE answer.",
        "quantitative": true
      },
      {
        "n": 109,
        "id": "pmp-set2-109",
        "domain": "Business Environment",
        "task": 4,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "An agile team is blocked from testing because it needs a data-access decision. The designated approver is away for two weeks. The governance plan names an authorized delegate for absences and requires unresolved access requests to be escalated after one working day. The request has already waited two days, and the delegate has not been contacted. What should the project manager do next?",
        "options": [
          [
            "A",
            "Wait for the primary approver to return because only that person can exercise the delegated authority."
          ],
          [
            "B",
            "Ask a developer to bypass the access control temporarily and document the exception after testing."
          ],
          [
            "C",
            "Send the request directly to the executive board without using the named delegate or explaining the impact."
          ],
          [
            "D",
            "Record and communicate the testing impact, route the request to the authorized delegate under the escalation rule, and follow up until the blockage is resolved."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The plan supplies a legitimate alternate decision route and an escalation threshold that has already been crossed. The project manager should use that route, communicate the delivery impact, and monitor resolution. The team’s need for rapid feedback does not grant authority to bypass the access control.",
        "rationales": {
          "A": "It ignores the explicit delegation and leaves a removable impediment in place.",
          "B": "It substitutes unauthorized access for an authorized decision.",
          "C": "It skips an available decision-maker and escalates without the information needed to act.",
          "D": "Correct. It uses the agreed authority, makes the impact visible, and actively tracks removal of the impediment."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.2–2.1.4: governance models, metrics, escalation, and investment control, pp. 11–13 (PDF pp. 116–118)."
        ],
        "difficultyReason": "Uses an existing delegated decision route to remove a blocker without unnecessary delay or uncontrolled access.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 110,
        "id": "pmp-set2-110",
        "domain": "Process",
        "task": 10,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "A board formally terminates a predictive project because its business case is no longer viable. Some usable designs exist, and there are open supplier obligations. Organizational policy requires a controlled closure record and transfer of retained materials to named owners. What should the project manager do next?",
        "options": [
          [
            "A",
            "Release everyone immediately and treat the board’s termination decision as completion of all closure activities."
          ],
          [
            "B",
            "Continue building the original deliverables so that the project can qualify for administrative closure."
          ],
          [
            "C",
            "Plan and perform the authorized closure: settle or transfer obligations through the proper owners, record the termination and results, archive required records, and transfer retained designs."
          ],
          [
            "D",
            "Keep the project open indefinitely because an unsuccessful project cannot be formally closed."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "Formal termination changes what work is authorized but does not eliminate closure responsibilities. The project manager should close the project according to its exit decision and policy, including ownership of remaining obligations, retained outputs, and records. There is no justification for continuing cancelled delivery scope or abandoning unfinished administrative work.",
        "rationales": {
          "A": "It leaves obligations, records, and retained outputs without the required closure arrangements.",
          "B": "It continues work that the board has terminated and is not required merely to close the project.",
          "C": "Correct. It implements the termination decision while completing the remaining closure responsibilities.",
          "D": "Closure applies to unsuccessful and terminated projects as well as successful ones."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.9–2.1.6.9.1: closure of successful and unsuccessful projects, pp. 31–32 (PDF pp. 136–137)."
        ],
        "difficultyReason": "Recognizes that project termination still requires controlled closure and ownership of remaining obligations.",
        "instruction": "Select ONE answer."
      }
    ]
  },
  {
    "number": 12,
    "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch12.md",
    "questions": [
      {
        "n": 111,
        "id": "pmp-set2-111",
        "domain": "Process",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "stem": "An agile team can deliver two independent improvements, one at a time without interruption, starting at the beginning of week 1. Each is released at the end of its development period and begins earning its stated benefit the following week. Both meet all release requirements, have equal total development cost regardless of sequence, and require no additional adoption delay. The product owner wants the greatest cumulative benefit through the end of week 6. Using only the table’s forecasts, which sequence and interpretation are correct?",
        "options": [
          [
            "A",
            "Deliver A then B: $61,000, which is preferable because A has the larger weekly benefit."
          ],
          [
            "B",
            "Deliver B then A: $123,000, counting benefit from the week each improvement starts development."
          ],
          [
            "C",
            "Deliver B then A: $70,000, which exceeds the $61,000 forecast from A then B."
          ],
          [
            "D",
            "Either sequence yields $138,000 because both improvements provide benefits for all six weeks."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "B first finishes at the end of week 1 and earns five weeks of benefit: $40,000. A then finishes at the end of week 4 and earns two weeks: $30,000. Total: $70,000. A first finishes at the end of week 3 and earns $45,000 over weeks 4–6; B finishes at the end of week 4 and earns $16,000 over weeks 5–6. Total: $61,000. Earlier access to B outweighs delaying the larger weekly benefit from A under the stated horizon. These are forecasts, not realized benefits.",
        "rationales": {
          "A": "The $61,000 calculation is correct, but choosing only by weekly benefit misses the effect of delivery duration.",
          "B": "It includes benefits before the stated release and benefit-start conditions are satisfied.",
          "C": "Correct. It accounts for each completion date and the remaining benefit weeks.",
          "D": "It assumes both improvements are available from the start, contrary to the sequential development constraint."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.4: Focus on Value, pp. 40–42 (PDF pp. 63–65).",
          "PMBOK Guide, Eighth Edition, Guide §2.3.2.2: sequencing, estimates, and resource constraints, pp. 51–53 (PDF pp. 156–158)."
        ],
        "difficultyReason": "Compares cumulative value over a common horizon, rather than ranking by weekly benefit alone, while respecting benefit-start timing.",
        "instruction": "Select ONE answer.",
        "quantitative": true,
        "exhibit": {
          "headers": [
            "Improvement",
            "Development time",
            "Weekly benefit after release"
          ],
          "rows": [
            [
              "A: Automated reconciliation",
              "3 whole weeks",
              "$15,000"
            ],
            [
              "B: Duplicate-entry prevention",
              "1 whole week",
              "$8,000"
            ]
          ]
        }
      },
      {
        "n": 112,
        "id": "pmp-set2-112",
        "domain": "People",
        "task": 4,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive equipment project will freeze its operator-panel design in three weeks. All feedback so far comes from head-office trainers who can attend weekday demonstrations. The stakeholder analysis also identifies remote operators who will use the panel in low-connectivity conditions, but their shifts prevent attendance. No one has yet gathered their input. What should the project manager do next?",
        "options": [
          [
            "A",
            "Arrange accessible, task-based feedback with representative remote operators before the design decision, using their shift availability and operating conditions."
          ],
          [
            "B",
            "Treat the trainers’ approval as representative because they are more available and understand the training material."
          ],
          [
            "C",
            "Wait until installation to ask remote operators for feedback so the planned design freeze is not disturbed."
          ],
          [
            "D",
            "Send the same invitation again and record nonattendance as agreement with the proposed design."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The missing group has relevant operating conditions that the current participants may not represent. Tailoring how and when input is gathered makes participation practical before a costly design decision. A predictive life cycle still benefits from early feedback; the project manager can organize the review within the existing design process.",
        "rationales": {
          "A": "Correct. It addresses the participation barrier and obtains evidence from the affected user context.",
          "B": "Availability and training expertise do not establish that the trainers represent remote operating conditions.",
          "C": "It delays learning until the design has been committed and changes may be more expensive.",
          "D": "Nonattendance caused by access or scheduling barriers is not informed agreement."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).",
          "PMBOK Guide, Eighth Edition, Guide §2.2.2.2: eliciting and analyzing stakeholder requirements, pp. 40–41 (PDF pp. 145–146)."
        ],
        "difficultyReason": "Tailors engagement to a missing user group without assuming either silence or convenient participants represent all stakeholders.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 113,
        "id": "pmp-set2-113",
        "domain": "Business Environment",
        "task": 7,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": null,
        "stem": "A hybrid service rollout combines planned branch installations with iterative workflow releases. During delivery, the organization approves a restructuring that transfers exception decisions from branches to a central operations unit. The workflow backlog, support plan, and training still assume that branch managers decide exceptions. The restructuring is confirmed, but its transition arrangements have not been assessed by the project. Which TWO actions should the project manager coordinate?",
        "options": [
          [
            "A",
            "Keep the workflow and training unchanged because an internal restructuring cannot affect approved project delivery."
          ],
          [
            "B",
            "Assess with the organizational change lead and affected teams how the new roles, handoffs, readiness, and transition workload affect the rollout."
          ],
          [
            "C",
            "Treat all branch concerns as resistance and replace their representatives with central-office staff."
          ],
          [
            "D",
            "Build the central workflow immediately from the announcement without clarifying transition responsibilities or approval implications."
          ],
          [
            "E",
            "Use the assessment to align the backlog, support and training plans, and rollout decisions through the appropriate project authorities."
          ]
        ],
        "correct": [
          "B",
          "E"
        ],
        "explanation": "The restructuring changes how the delivered service will operate and who must be ready to use it. The project should assess the consequences with the people managing and experiencing the change, then integrate the agreed response into its delivery and transition plans. Neither preserving obsolete assumptions nor immediately building from an incomplete announcement is sufficient.",
        "rationales": {
          "A": "It ignores a confirmed organizational change that directly affects the intended operating model.",
          "B": "Correct. It examines the organizational change’s practical effects on the project.",
          "C": "It discards useful knowledge and prejudges legitimate transition concerns.",
          "D": "It may implement the wrong handoffs or timing before the transition arrangements are understood.",
          "E": "Correct. It turns the assessment into coordinated and authorized project adaptations."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.3: Adopt a Holistic View, pp. 38–40 (PDF pp. 61–63).",
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.2: integrate and align project plans, pp. 18–19 (PDF pp. 123–124)."
        ],
        "difficultyReason": "Connects a confirmed organizational restructuring to both iterative product work and planned operational readiness.",
        "instruction": "Select TWO answers."
      },
      {
        "n": 114,
        "id": "pmp-set2-114",
        "domain": "People",
        "task": 7,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "A predictive rollout team wants to reuse a pilot project’s lesson, “shorten the review checklist.” The repository contains that recommendation but not the pilot’s conditions, supporting evidence, or exceptions. The pilot team is available for a discussion. What should the project manager do before adopting the lesson?",
        "options": [
          [
            "A",
            "Apply the recommendation unchanged because publication in the repository establishes universal applicability."
          ],
          [
            "B",
            "Ignore the repository and recreate every part of the pilot because written lessons cannot be useful."
          ],
          [
            "C",
            "Ask only for the final checklist file and assume its intended use will be clear from its format."
          ],
          [
            "D",
            "Discuss the lesson with the pilot team, capture its context and evidence, and assess whether it applies to the rollout."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "A recommendation without its context can be misapplied. The pilot team can explain the conditions, reasoning, and limits behind the checklist change. Capturing those details helps the rollout team reuse the learning intelligently and improves its usefulness for later teams.",
        "rationales": {
          "A": "A stored recommendation is not proof that the conditions in another project are equivalent.",
          "B": "It discards potentially useful learning instead of recovering the missing context.",
          "C": "The artifact alone may still omit why and when the shortened checklist is appropriate.",
          "D": "Correct. It gathers the knowledge needed to interpret and apply the lesson."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.6: knowledge sharing, context, and organizational learning, pp. 24–26 (PDF pp. 129–131)."
        ],
        "difficultyReason": "Recognizes that useful knowledge transfer includes the reasoning and context behind a documented recommendation.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 115,
        "id": "pmp-set2-115",
        "domain": "Process",
        "task": 8,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive fabrication project’s schedule shows a customer mock-up review on Friday followed by fabrication on Monday. The review is intended to resolve open interface choices before the design is released. The design team confirms that incorporating the expected feedback and verifying the revised drawings requires three working days. That work is absent from the schedule, and fabrication requires the released drawings. What should the project manager do next?",
        "options": [
          [
            "A",
            "Keep Monday’s fabrication start because holding the review satisfies the schedule milestone."
          ],
          [
            "B",
            "Model the feedback incorporation and verification work with its resources and dependencies, assess the milestone impact, and route any required baseline change through the agreed process."
          ],
          [
            "C",
            "Start fabrication from the current drawings and apply the customer’s interface decisions after the affected parts have been made."
          ],
          [
            "D",
            "Move the review to the project closing phase so the fabrication baseline remains achievable."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The review only creates useful learning if the plan provides time to act on it. Here, the required design work and release dependency are known but missing. The project manager should correct the schedule model, evaluate feasible options and effects, and obtain any required approval instead of assuming that a review meeting instantly produces released drawings.",
        "rationales": {
          "A": "It confuses the feedback event with completion of the work resulting from it.",
          "B": "Correct. It makes the missing work and logical dependency visible before an authorized schedule decision.",
          "C": "It knowingly proceeds without the required released design and risks avoidable rework.",
          "D": "It removes the opportunity to resolve interface choices before fabrication."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.3.2.2: sequencing, estimates, and resource constraints, pp. 51–53 (PDF pp. 156–158).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: assess and implement changes, pp. 28–29 (PDF pp. 133–134)."
        ],
        "difficultyReason": "Distinguishes a feedback milestone from the effort and verification needed to use its results in a predictive schedule.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 116,
        "id": "pmp-set2-116",
        "domain": "People",
        "task": 6,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "At a Scrum Sprint Review, a major customer requests a custom report and assumes the team has committed to delivering it in the next Sprint. The Product Owner has not assessed its value against other needs, and the Developers have not assessed feasibility. The customer is becoming frustrated because earlier suggestions seemed to disappear without explanation. How should the project manager support the team?",
        "options": [
          [
            "A",
            "Clarify the request’s intended outcome with the customer and Product Owner, make the evaluation and follow-up visible, and distinguish consideration from a delivery commitment."
          ],
          [
            "B",
            "Promise next-Sprint delivery to restore confidence, leaving the team to resolve the resulting trade-offs later."
          ],
          [
            "C",
            "Tell the customer that feedback can be accepted only at the next Sprint Planning event."
          ],
          [
            "D",
            "Close the request without explanation because a Sprint Review is only a demonstration of completed work."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The customer needs both a fair hearing and a clear expectation about what happens next. Exploring the outcome with the Product Owner and arranging visible follow-up supports useful feedback without promising unassessed work. Scrum’s review is an opportunity to inspect and adapt, while backlog ordering and Sprint planning still require the relevant decisions.",
        "rationales": {
          "A": "Correct. It addresses the request and the broken feedback expectation without making an unsupported commitment.",
          "B": "It creates another expectation before value, capacity, and feasibility have been considered.",
          "C": "It excludes relevant stakeholder feedback from an event designed to support adaptation.",
          "D": "It leaves the expectation gap unresolved and misstates the purpose of the review."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).",
          "The Scrum Guide (2020), Product Owner and Sprint Review: https://scrumguides.org/scrum-guide.html"
        ],
        "difficultyReason": "Balances a dissatisfied customer’s need for visible follow-up with the team’s need to assess work before committing.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 117,
        "id": "pmp-set2-117",
        "domain": "Process",
        "task": 4,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid program delivers comparable configuration packages through design, validation, and deployment. Every package must pass those stages in order. Stable stage capacities are shown below. Validation has a persistent queue of 30 design-complete packages; there is sufficient demand, and deployment has no other bottleneck. Each proposed resource option has the same cost and can be used immediately without startup loss. No quality requirement may be removed. Which option best increases sustainable end-to-end completion capacity?",
        "options": [
          [
            "A",
            "Double design capacity from 12 to 24 packages per week while leaving validation at 4 and deployment at 10."
          ],
          [
            "B",
            "Double deployment capacity from 10 to 20 packages per week while leaving design at 12 and validation at 4."
          ],
          [
            "C",
            "Start twice as many packages in parallel while leaving every stage’s capacity unchanged."
          ],
          [
            "D",
            "Add qualified validation capacity from 4 to 8 packages per week, increasing the system’s limiting capacity to 8."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "With the stated stable capacities and sufficient ready work, validation limits end-to-end output to four packages per week. Increasing validation to eight makes eight the new limiting capacity, below design’s 12 and deployment’s 10. More design, deployment, or work in progress does not remove the four-package validation constraint. Eight is a sustainable capacity under the scenario’s assumptions, not a guarantee about a particular week’s transient completions.",
        "rationales": {
          "A": "It increases arrivals to an already constrained stage without increasing completed throughput.",
          "B": "It adds capacity downstream of the bottleneck while the validation limit remains four.",
          "C": "More work in progress does not create additional processing capacity at validation.",
          "D": "Correct. It increases capacity at the actual constraint while preserving the required validation."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.3: Adopt a Holistic View, pp. 38–40 (PDF pp. 61–63).",
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.3: resource acquisition and availability, pp. 83–84 (PDF pp. 188–189)."
        ],
        "difficultyReason": "Distinguishes local utilization and work starts from system throughput, and identifies the new constraint after a resource change.",
        "instruction": "Select ONE answer.",
        "quantitative": true,
        "exhibit": {
          "headers": [
            "Required stage",
            "Stable capacity"
          ],
          "rows": [
            [
              "Design",
              "12 packages per week"
            ],
            [
              "Validation",
              "4 packages per week"
            ],
            [
              "Deployment",
              "10 packages per week"
            ]
          ]
        }
      },
      {
        "n": 118,
        "id": "pmp-set2-118",
        "domain": "People",
        "task": 1,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "A predictive public-service project’s sponsor has formally approved a revised objective: improve access for residents who cannot travel to the service centre. The charter and high-level scope have already been updated. At design meetings, team members still judge every option mainly by how much it reduces queues inside the centre, the project’s former objective. What should the project manager do first?",
        "options": [
          [
            "A",
            "Continue using the former objective until all detailed designs have been completed, to avoid confusing the team."
          ],
          [
            "B",
            "Reconnect the team and key stakeholders to the revised purpose, translating it into shared outcome measures and practical decision criteria."
          ],
          [
            "C",
            "Ask each department to create its own interpretation of success and reconcile them only at final acceptance."
          ],
          [
            "D",
            "Treat the revised charter’s distribution as sufficient evidence that the team has adopted the new objective."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The authorized objective has changed, but the team’s working understanding has not. The project manager should make the revised vision usable in everyday design decisions, with common outcomes and criteria. Merely distributing the charter does not establish shared understanding.",
        "rationales": {
          "A": "It keeps decisions anchored to an objective that has already been replaced.",
          "B": "Correct. It keeps the common vision current and connects it to the team’s choices.",
          "C": "It permits conflicting interpretations to persist until an expensive late stage.",
          "D": "Receiving a document is not the same as understanding and applying its purpose."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4.1: vision and objectives in team development, pp. 84 (PDF pp. 189).",
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.4: Focus on Value, pp. 40–42 (PDF pp. 63–65)."
        ],
        "difficultyReason": "Identifies a gap between formal approval of a revised objective and the team’s actual decision criteria.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 119,
        "id": "pmp-set2-119",
        "domain": "Process",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": null,
        "stem": "An agile team is developing a booking service. It proposes delivering all page layouts first, then all database work, then integration. Stakeholders need early evidence that users can complete a booking without assistance. The team confirms that a smaller end-to-end journey for one appointment type can meet the existing quality and security requirements within the next delivery period. Which TWO actions best support early value-based learning?",
        "options": [
          [
            "A",
            "Work with the Product Owner and team to prioritize the usable end-to-end journey for one appointment type."
          ],
          [
            "B",
            "Treat completion of all page layouts as evidence that users can successfully complete a booking."
          ],
          [
            "C",
            "Agree how to observe booking completion and assistance needed for the initial journey, then use the results to inform subsequent work."
          ],
          [
            "D",
            "Remove the existing security checks from the initial journey so every appointment type can be shown sooner."
          ],
          [
            "E",
            "Defer all user observation until every appointment type and technical layer has been completed."
          ]
        ],
        "correct": [
          "A",
          "C"
        ],
        "explanation": "A small usable journey can test the intended outcome while keeping the agreed quality and security boundaries. An outcome measure and observation plan make the feedback useful for choosing subsequent work. Completing a technical layer may enable later delivery, but it does not by itself establish that the user can finish a booking.",
        "rationales": {
          "A": "Correct. It selects a feasible slice that can deliver an observable user outcome.",
          "B": "Visible pages alone do not demonstrate completion of the full task.",
          "C": "Correct. It connects the delivery to evidence about the intended benefit and future decisions.",
          "D": "It sacrifices an explicit requirement even though a compliant smaller journey is feasible.",
          "E": "It delays learning that could improve the remaining investment."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.4: Focus on Value, pp. 40–42 (PDF pp. 63–65).",
          "PMBOK Guide, Eighth Edition, Guide §2.2.2.3 and §2.2.3: adaptive scope and iterative refinement, pp. 41–45 (PDF pp. 146–150)."
        ],
        "difficultyReason": "Selects both a usable slice and an outcome-feedback method, rather than mistaking technical progress for demonstrated value.",
        "instruction": "Select TWO answers."
      },
      {
        "n": 120,
        "id": "pmp-set2-120",
        "domain": "Business Environment",
        "task": 6,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid rollout team has tested a new handover practice over three releases. Comparable records show fewer unresolved handover defects without longer lead time, and the receiving teams confirm the benefit. The organization’s standard handover template still requires the superseded process, so new projects continue to repeat the old work. The process owner can authorize changes to that template. What should the project manager do next?",
        "options": [
          [
            "A",
            "Leave the finding in the team’s retrospective notes because organizational templates should change only after every project is closed."
          ],
          [
            "B",
            "Instruct every project to stop following the standard immediately, without consulting its owner or explaining the tested conditions."
          ],
          [
            "C",
            "Present the evidence and applicability limits to the process owner, coordinate an authorized template update, and establish follow-up checks on its use and effects."
          ],
          [
            "D",
            "Delete the old records and circulate only the successful result so future teams will not question the improvement."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The local learning is supported by repeated evidence but has not reached the organizational process asset that guides future work. The project manager should help the authorized owner incorporate it, retain the conditions and evidence supporting it, and check whether the revised practice continues to help. This supports learning beyond one team without assuming unlimited applicability.",
        "rationales": {
          "A": "It leaves a known disconnect between useful learning and the standard process that others use.",
          "B": "It bypasses the designated owner and omits the context needed for appropriate adoption.",
          "C": "Correct. It carries validated learning into the organizational process and maintains a feedback loop.",
          "D": "It removes useful context and weakens the ability to evaluate or adapt the practice later."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide Continuous improvement and Retrospectives, pp. 158, 194–195 (PDF pp. 263, 299–300).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.6: knowledge sharing, context, and organizational learning, pp. 24–26 (PDF pp. 129–131)."
        ],
        "difficultyReason": "Moves from a successful local improvement to an authorized organizational process update with continued feedback.",
        "instruction": "Select ONE answer."
      }
    ]
  },
  {
    "number": 13,
    "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch13.md",
    "questions": [
      {
        "n": 121,
        "id": "pmp-set2-121",
        "domain": "Process",
        "task": 1,
        "approach": "Hybrid",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid project combines a planned control-cabinet build with iterative operator-software design. Fabrication must start at the end of week 4 to meet the approved installation window. The cabinet’s screen opening must then be fixed; changing it after fabrication starts would require substantial rework. User testing of the preferred screen design is currently scheduled for week 6. The software team can test the size-critical interaction with a prototype in week 3, while colors and optional navigation can continue to evolve without changing the opening. What should the project manager recommend?",
        "options": [
          [
            "A",
            "Freeze all software requirements at the end of week 4, including colors and navigation, so both streams use the same planning method."
          ],
          [
            "B",
            "Let fabrication select the opening now and ask the software team to fit its preferred design into the resulting cabinet after week 6."
          ],
          [
            "C",
            "Move all fabrication work after the week-6 software review and report that the approved installation window remains unchanged."
          ],
          [
            "D",
            "Bring the size-critical prototype test before the fabrication decision, agree the physical interface and acceptance evidence jointly, and keep independent software details iterative."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The interface creates an irreversible commitment before the current learning event. The available week-3 test can inform that decision without freezing unrelated software choices. Jointly agreeing the physical constraint and evidence aligns the two streams while preserving useful adaptation. Any unresolved effect on the installation window still needs assessment; changing dates cannot simply be declared impact-free.",
        "rationales": {
          "A": "It controls the physical dependency but unnecessarily freezes software details that do not affect it.",
          "B": "It commits to a physical constraint before using the available evidence about the critical interaction.",
          "C": "It changes a predecessor’s timing without accounting for the stated fabrication lead-time constraint.",
          "D": "Correct. It moves the relevant learning before the commitment and separates coupled decisions from independent choices."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §4.2.3–4.3: hybrid approaches and selection considerations, pp. 65–68 (PDF pp. 88–91).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.2: integrate and align project plans, pp. 18–19 (PDF pp. 123–124).",
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.3: Adopt a Holistic View, pp. 38–40 (PDF pp. 61–63)."
        ],
        "difficultyReason": "Integrates different planning cadences around an irreversible interface decision without freezing unrelated adaptive work.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 122,
        "id": "pmp-set2-122",
        "domain": "People",
        "task": 2,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "On a predictive commissioning project, the installation lead and operations lead repeatedly argue about who should prepare the equipment for inspection. One describes “ready” as physically installed; the other expects cleaning, isolation, and access checks to be complete. Their approved work packages use the word “ready” without defining it. The next inspection has not yet been booked. What should the project manager do first?",
        "options": [
          [
            "A",
            "Assign preparation to the installation lead because installation occurs earlier in the schedule."
          ],
          [
            "B",
            "Facilitate agreement on the handover conditions and responsibilities using the actual inspection needs, then document the agreed boundary."
          ],
          [
            "C",
            "Ask the sponsor to select a lead without discussing the different interpretations with the teams."
          ],
          [
            "D",
            "Require the two leads to alternate responsibility at each inspection to share the burden equally."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "The conflict is sustained by an ambiguous handover definition, not just by personalities. Establishing what inspection readiness requires lets the parties allocate the necessary work and responsibilities consistently. The agreed interpretation should be documented and any consequential scope or plan changes handled through the appropriate process.",
        "rationales": {
          "A": "Sequence alone does not establish responsibility for all preparation activities.",
          "B": "Correct. It resolves the underlying difference in meaning and makes the working agreement explicit.",
          "C": "It may assign a name while leaving the disputed readiness conditions unresolved.",
          "D": "Alternation distributes effort without defining the required work or a consistent handover."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4: team leadership and development, pp. 84–86 (PDF pp. 189–191).",
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178)."
        ],
        "difficultyReason": "Identifies a shared-definition problem beneath a recurring interpersonal disagreement.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 123,
        "id": "pmp-set2-123",
        "domain": "Business Environment",
        "task": 3,
        "approach": "Agile",
        "difficulty": "Moderate",
        "format": "dropdown",
        "caseId": null,
        "stem": "An agile project’s approved governance lets the Product Owner reorder future backlog items within the agreed release outcome, budget, and external commitments. A user-feedback request changes only the order of two unstarted items. The team confirms it affects none of those boundaries and no current iteration commitment. The project manager should _____.",
        "options": [
          [
            "A",
            "submit the reorder to the steering committee because every backlog adjustment requires a new baseline approval"
          ],
          [
            "B",
            "keep the original order until project closure because approving governance removes the need for future prioritization"
          ],
          [
            "C",
            "support the Product Owner’s delegated decision, update the visible backlog, and communicate the revised expectation"
          ],
          [
            "D",
            "allow any developer to change the order privately because adaptive delivery does not require visible decisions"
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The scenario explicitly delegates this kind of decision to the Product Owner. The change should use that approved path and remain visible to those affected. Escalating an in-boundary reorder as if it changed the release commitments would add an approval requirement that the governance does not impose.",
        "rationales": {
          "A": "It applies an approval path that the stated governance does not require for this decision.",
          "B": "It prevents adaptation already permitted by the project’s rules.",
          "C": "Correct. It uses the delegated authority while maintaining transparent records and expectations.",
          "D": "It ignores both the designated decision-maker and the need to communicate the change."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: assess and implement changes, pp. 28–30 (PDF pp. 133–135).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.2: tailored governance models, pp. 11–12 (PDF pp. 116–117)."
        ],
        "difficultyReason": "Applies an explicit delegation boundary to a routine adaptive change.",
        "instruction": "Select the best completion."
      },
      {
        "n": 124,
        "id": "pmp-set2-124",
        "domain": "Process",
        "task": 2,
        "approach": "Predictive",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "Two predictive projects will deliver a usable laboratory. One supplies the building and the other supplies test equipment. The approved requirements require an exhaust connection for the equipment, but a joint scope review finds that neither project’s work breakdown structure includes installing the connecting duct. Each project has assumed the other will provide it. No duct work has been authorized. What should the project manager coordinate next?",
        "options": [
          [
            "A",
            "Clarify the complete connection requirement with both projects and the accountable sponsor, assign its scope ownership, and assess the required plan and approval changes."
          ],
          [
            "B",
            "Remove the exhaust requirement from the joint readiness checklist because it does not appear in either work breakdown structure."
          ],
          [
            "C",
            "Ask whichever team finishes first to install the duct using spare capacity, without revising the scope records."
          ],
          [
            "D",
            "Wait until both projects request final acceptance, when responsibility can be assigned using their remaining budgets."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The required system outcome exposes a scope gap between projects. The requirement has not disappeared merely because neither work breakdown structure includes it. The parties need an agreed owner and defined work, followed by assessment and authorization of the effects on plans, funding, and interfaces. Waiting or assigning informal extra work preserves the ambiguity.",
        "rationales": {
          "A": "Correct. It reconciles the required outcome with the project boundaries and obtains an authorized scope solution.",
          "B": "It changes the apparent requirement to hide an omission rather than resolving the delivery gap.",
          "C": "Spare capacity does not establish ownership, competence, or authority to add the work.",
          "D": "It postpones a known dependency until a late and potentially expensive point."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.2.2.2–2.2.2.4: requirements, scope, and scope structure, pp. 40–43 (PDF pp. 145–148).",
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.3: Adopt a Holistic View, pp. 38–40 (PDF pp. 61–63).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: assess and implement changes, pp. 28–30 (PDF pp. 133–135)."
        ],
        "difficultyReason": "Recognizes missing interface work even when each individual scope structure appears complete.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 125,
        "id": "pmp-set2-125",
        "domain": "Business Environment",
        "task": 7,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "multiple",
        "caseId": null,
        "stem": "A hybrid rollout has technically ready releases and planned site installations. The same site supervisors must coach users for this rollout, implement a separate approved operating-model change, and keep daily services running. The integrated calendar shows the two changes arriving in the same week. Supervisors support both initiatives but cannot provide the required coaching time. Which TWO actions best support adoption?",
        "options": [
          [
            "A",
            "Increase the number of reminder emails because support for the changes guarantees that adoption capacity is sufficient."
          ],
          [
            "B",
            "Assess the combined change workload and readiness with the supervisors, change leads, and operational owners."
          ],
          [
            "C",
            "Record each initiative as ready independently because its technical work is complete."
          ],
          [
            "D",
            "Coordinate a feasible sequence, protected coaching capacity, and support arrangements with the authorized owners, updating rollout decisions as needed."
          ],
          [
            "E",
            "Require supervisors to absorb the overlap through indefinite overtime without revisiting the implementation plans."
          ]
        ],
        "correct": [
          "B",
          "D"
        ],
        "explanation": "The barrier is overlapping demand on the same people, despite their support and the technical readiness of the solutions. The team should assess adoption capacity across the initiatives and coordinate timing or support with the owners who can make those decisions. Independent technical readiness does not establish combined operational readiness.",
        "rationales": {
          "A": "More messages do not create the time needed to coach users and maintain services.",
          "B": "Correct. It establishes the cumulative effect of the organizational changes on the people doing the work.",
          "C": "It ignores the common operational dependency between the initiatives.",
          "D": "Correct. It turns the capacity assessment into coordinated, authorized adoption arrangements.",
          "E": "It assumes an unsustainable response without assessing quality, service, or staffing implications."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §4.2.3–4.3: hybrid approaches and selection considerations, pp. 65–68 (PDF pp. 88–91).",
          "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.3: Adopt a Holistic View, pp. 38–40 (PDF pp. 61–63).",
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.3: resource availability and planning impacts, pp. 83–84 (PDF pp. 188–189)."
        ],
        "difficultyReason": "Distinguishes willingness and technical completion from the shared organizational capacity needed to adopt simultaneous changes.",
        "instruction": "Select TWO answers."
      },
      {
        "n": 126,
        "id": "pmp-set2-126",
        "domain": "People",
        "task": 8,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "Two agile teams contribute to one service release. Each uses its own story-point scale and refines its backlog independently. A sponsor asks the project manager to report that Team A is twice as productive because it completed 40 points while Team B completed 20. No common sizing calibration exists, and release readiness depends on their combined working service. What should the project manager communicate?",
        "options": [
          [
            "A",
            "Confirm the comparison because story points represent the same amount of effort across teams."
          ],
          [
            "B",
            "Convert each team’s points to staff hours using a single assumed rate and publish the comparison as an objective measure."
          ],
          [
            "C",
            "Stop providing release information because different local estimation scales make all reporting impossible."
          ],
          [
            "D",
            "Explain that the point totals are not directly comparable and report shared release outcomes, integration evidence, and dependencies alongside each team’s own trend."
          ]
        ],
        "correct": [
          "D"
        ],
        "explanation": "The local point scales do not provide a common unit for comparing productivity. The sponsor still needs useful information about the release. Shared outcome and integration evidence can support that decision, while each team’s trend can remain useful within its own estimation context. Inventing a conversion rate would create false precision.",
        "rationales": {
          "A": "It assumes a shared scale that the scenario explicitly says does not exist.",
          "B": "It substitutes an unsupported conversion for the missing common basis.",
          "C": "It withholds useful information that can be reported using measures appropriate to the shared release.",
          "D": "Correct. It explains the limitation and replaces the unsupported ranking with decision-relevant reporting."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).",
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.7: performance analysis and reporting, pp. 26–28 (PDF pp. 131–133).",
          "PMBOK Guide, Eighth Edition, Guide §2.3.2.2: estimation methods and their assumptions, pp. 52–53 (PDF pp. 157–158)."
        ],
        "difficultyReason": "Keeps reporting useful while refusing an unsupported comparison between local estimation scales.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 127,
        "id": "pmp-set2-127",
        "domain": "People",
        "task": 3,
        "approach": "Predictive",
        "difficulty": "Moderate",
        "format": "single",
        "caseId": null,
        "stem": "A predictive project’s experienced engineering team has clear work-package outcomes, approved technical standards, and authority to choose its detailed methods within those standards. A new project manager begins approving every routine technical step, creating delays without uncovering quality problems. Which leadership adjustment best fits the situation?",
        "options": [
          [
            "A",
            "Continue approving every step until the team proves it can work without any oversight at all."
          ],
          [
            "B",
            "Remove all standards and progress reviews so the team can work without constraints."
          ],
          [
            "C",
            "Restore the team’s delegated method decisions, agree useful progress and exception checks, and provide support when needed."
          ],
          [
            "D",
            "Transfer all technical choices to the sponsor so the project manager is no longer the bottleneck."
          ]
        ],
        "correct": [
          "C"
        ],
        "explanation": "The team has relevant capability and a defined authority boundary. The project manager should support that delegation with proportionate visibility and help, rather than adding routine approvals. Empowerment works within agreed outcomes and standards; it does not require abandoning oversight.",
        "rationales": {
          "A": "It preserves the unnecessary bottleneck and sets an unrealistic all-or-nothing test for delegation.",
          "B": "It removes legitimate standards and visibility rather than tailoring the leadership approach.",
          "C": "Correct. It matches support and oversight to the team’s capability and authorized responsibilities.",
          "D": "It relocates the bottleneck without making appropriate use of the team’s delegated expertise."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.6.2.4: team leadership and development, pp. 84–86 (PDF pp. 189–191)."
        ],
        "difficultyReason": "Matches leadership and oversight to demonstrated capability within clear boundaries.",
        "instruction": "Select ONE answer."
      },
      {
        "n": 128,
        "id": "pmp-set2-128",
        "domain": "Process",
        "task": 7,
        "approach": "Agile",
        "difficulty": "Challenging",
        "format": "matching",
        "caseId": null,
        "stem": "An agile delivery team wants a quality approach that supports frequent releases. Match each stated need to the most directly suitable activity. The organization distinguishes improving or checking its delivery process from inspecting the product and from obtaining formal customer acceptance.",
        "options": [
          [
            "A",
            "Analyze recurring defect causes and adjust the delivery process"
          ],
          [
            "B",
            "Run product verification tests or inspections"
          ],
          [
            "C",
            "Obtain formal customer acceptance of completed scope"
          ],
          [
            "D",
            "Define measurable quality requirements and verification methods"
          ],
          [
            "E",
            "Audit whether the agreed quality process is being followed"
          ]
        ],
        "correct": {
          "1": "D",
          "2": "E",
          "3": "B",
          "4": "A"
        },
        "explanation": "Before implementation, measurable requirements and verification methods define the quality target. An audit checks whether the agreed process is followed. Product tests or inspections check the actual output against requirements. Investigating recurring causes and modifying the delivery process addresses repeated defects. Formal customer acceptance is a separate decision and is not the primary activity requested by any of the four needs.",
        "rationales": {
          "A": "Matches 4. It addresses the repeated source of defects rather than only correcting individual outputs.",
          "B": "Matches 3. It checks the implemented product behavior against the agreed threshold.",
          "C": "Unused. None of the needs asks the customer to formally accept completed scope.",
          "D": "Matches 1. It makes the target and verification method clear before implementation.",
          "E": "Matches 2. It examines adherence to the agreed process and identifies process departures."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.1.6.5: quality assurance and control, pp. 23–24 (PDF pp. 128–129).",
          "PMBOK Guide, Eighth Edition, Guide §2.2.2.3 and §2.2.2.6: quality requirements and scope acceptance, pp. 41–44 (PDF pp. 146–149)."
        ],
        "difficultyReason": "Separates planning quality, process assurance, product verification, and cause-focused improvement from formal acceptance.",
        "instruction": "Match each quality need to the most directly suitable activity. Use each choice at most once; one choice is unused.",
        "prompts": [
          [
            "1",
            "Before coding, specify the maximum permitted recovery time and the conditions under which it will be checked."
          ],
          [
            "2",
            "Check whether teams are carrying out the peer reviews required by the agreed delivery procedure."
          ],
          [
            "3",
            "Measure the implemented recovery behavior under the specified conditions and compare it with the threshold."
          ],
          [
            "4",
            "After containment, investigate why the same defect class keeps returning and change the process that produces it."
          ]
        ]
      },
      {
        "n": 129,
        "id": "pmp-set2-129",
        "domain": "Business Environment",
        "task": 5,
        "approach": "Predictive",
        "difficulty": "Very challenging",
        "format": "single",
        "caseId": null,
        "stem": "A predictive project is selecting one response to a single financial disruption risk. The event can occur at most once. The approved comparison rule is to minimize the response’s certain upfront cost plus its expected residual loss. All four alternatives satisfy the organization’s other risk limits and are affordable; they are mutually exclusive. Probabilities and losses below are the estimates AFTER applying each alternative. No other costs or benefits differ. Which alternative should be recommended under this rule?",
        "options": [
          [
            "A",
            "Accept the risk: its $0 upfront cost makes it preferable to every paid response."
          ],
          [
            "B",
            "Prevention: its $22,000 expected total cost is lower than the other alternatives."
          ],
          [
            "C",
            "Impact reduction: its $12,000 expected residual loss should be compared directly with prevention’s $22,000 total."
          ],
          [
            "D",
            "Insurance: its $6,000 expected retained loss is the complete expected cost because the premium is certain."
          ]
        ],
        "correct": [
          "B"
        ],
        "explanation": "Include the certain response cost in every comparison. Acceptance costs $0 plus 30% of $120,000, or $36,000. Prevention costs $10,000 plus 10% of $120,000, or $22,000. Impact reduction costs $20,000 plus 30% of $40,000, or $32,000. Insurance costs $24,000 plus 30% of the $20,000 retained loss, or $30,000. Prevention has the smallest expected total under the stated rule. This expectation is a decision measure, not a guaranteed actual loss or a reserve requirement.",
        "rationales": {
          "A": "It ignores the $36,000 expected loss remaining under acceptance.",
          "B": "Correct. It adds the response cost and residual expected loss on a consistent basis.",
          "C": "It omits the $20,000 response cost from the impact-reduction alternative.",
          "D": "It omits the $24,000 premium; certainty is a reason to include that cost, not to exclude it."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide §2.7.2.3–2.7.2.4: risk analysis and response planning, pp. 96–97 (PDF pp. 201–202).",
          "PMBOK Guide, Eighth Edition, Guide Decision tree analysis and Figure 5-5: investment costs and expected values, pp. 163–164 (PDF pp. 268–269)."
        ],
        "difficultyReason": "Compares probability reduction, impact reduction, and transfer using residual exposure plus certain response costs, without equating expected loss with a guarantee.",
        "instruction": "Select ONE answer.",
        "quantitative": true,
        "exhibit": {
          "headers": [
            "Alternative",
            "Upfront cost and residual risk"
          ],
          "rows": [
            [
              "Acceptance",
              "$0 upfront. Event: 30%; loss: $120,000."
            ],
            [
              "Prevention",
              "$10,000 upfront. Event: 10%; loss: $120,000."
            ],
            [
              "Impact reduction",
              "$20,000 upfront. Event: 30%; loss: $40,000."
            ],
            [
              "Insurance",
              "$24,000 premium. Event: 30%; retained loss: $20,000; insurer covers the rest."
            ]
          ]
        }
      },
      {
        "n": 130,
        "id": "pmp-set2-130",
        "domain": "Process",
        "task": 5,
        "approach": "Hybrid",
        "difficulty": "Challenging",
        "format": "single",
        "caseId": null,
        "stem": "A hybrid project has a fixed supplier agreement for an equipment package and iterative configuration services. The agreement makes equipment and configuration separately payable only after their respective acceptance criteria are met. The equipment has been accepted. The configuration has failed its integration criterion. The supplier requests payment for both, citing 95% completion across its combined work. What should the project manager coordinate with the authorized contract administrator?",
        "options": [
          [
            "A",
            "Verify and process the accepted equipment amount under the agreement, keep the unaccepted configuration amount subject to its acceptance condition, and agree corrective work and verification."
          ],
          [
            "B",
            "Pay 95% of the combined value because the supplier’s completion percentage overrides the separate acceptance conditions."
          ],
          [
            "C",
            "Reject every payment until the entire project closes, despite the agreement’s separate payment provisions."
          ],
          [
            "D",
            "Accept the configuration provisionally because iterative work cannot have enforceable completion criteria."
          ]
        ],
        "correct": [
          "A"
        ],
        "explanation": "The agreement supplies separate payment conditions, so an aggregate completion percentage does not establish entitlement for both parts. The accepted equipment can be processed under its provision, while the failed configuration needs correction and verification before its acceptance-based payment condition is satisfied. The project manager coordinates this through the authorized administrator rather than inventing different commercial terms.",
        "rationales": {
          "A": "Correct. It applies the separate contractual conditions and addresses the configuration failure.",
          "B": "It replaces the stated acceptance basis with an unsupported aggregate percentage.",
          "C": "It disregards the payment provision for an already accepted package.",
          "D": "Iterative delivery does not remove the explicit acceptance criterion in the agreement."
        },
        "references": [
          "PMBOK Guide, Eighth Edition, Guide X4.8: contracts and buyer/supplier perspectives, pp. 250–252 (PDF pp. 355–357).",
          "PMBOK Guide, Eighth Edition, Guide X4.9.1: contract terms, records, and communication, pp. 253 (PDF pp. 358)."
        ],
        "difficultyReason": "Distinguishes package-specific acceptance and payment from an aggregate progress claim across different delivery methods.",
        "instruction": "Select ONE answer."
      }
    ]
  },
{
  "number": 14,
  "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch14.md",
  "questions": [
    {
      "n": 131,
      "id": "pmp-set2-131",
      "domain": "Process",
      "task": 7,
      "approach": "Predictive",
      "difficulty": "Very challenging",
      "format": "single",
      "caseId": null,
      "stem": "A planned service-center implementation includes an AI assistant that drafts routing recommendations for staff approval. The agreed acceptance plan requires at least 90% correct recommendations for each of two request categories on an independent sample representative of launch work. A supplier reports 96% overall accuracy. Its test used only common requests, and the same labeled examples were used to tune the assistant. Staff review will remain mandatory after launch. The sponsor asks whether this evidence is enough to accept the assistant. What should the project manager recommend?",
      "options": [
        [
          "A",
          "Accept the assistant because mandatory staff review compensates for any gap in the supplier’s test evidence."
        ],
        [
          "B",
          "Request a larger test using the same labeled examples and accept if overall accuracy remains above 90%."
        ],
        [
          "C",
          "Obtain independent, representative evidence for both categories against the agreed criteria before recommending acceptance."
        ],
        [
          "D",
          "Accept the common-request function now and treat evidence for the second category as a routine post-launch improvement."
        ]
      ],
      "correct": [
        "C"
      ],
      "explanation": "The reported result does not establish either independence or category-level conformance. Reusing tuning examples can overstate performance, and an omitted category has no demonstrated result. Human review is a useful operational control, but the stated acceptance criteria still apply. Representative independent testing is the next evidence needed; acceptance is not yet supported.",
      "rationales": {
        "A": "Human oversight does not itself demonstrate that the agreed acceptance conditions were met.",
        "B": "Increasing the quantity of reused, one-category examples does not correct independence or coverage.",
        "C": "This addresses both evidence defects and applies the agreed criteria without inventing a replacement threshold.",
        "D": "No separate partial acceptance authority or reduced launch scope is stated; the missing evidence cannot simply be deferred."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.5: quality assurance and control, pp. 23–24 (PDF pp. 128–129)."
      ],
      "difficultyReason": "The candidate must distinguish an operational safeguard from acceptance evidence and identify two independent defects in an attractive aggregate result.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 132,
      "id": "pmp-set2-132",
      "domain": "People",
      "task": 4,
      "approach": "Agile",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "An agile team uses an AI summary of consultation notes to identify stakeholder concerns. The summary says warehouse supervisors support a new picking workflow. At the next review, night-shift supervisors say their concerns about staffing and training are missing and stop participating. The original notes are available. What should the project manager do first?",
      "options": [
        [
          "A",
          "Meet the affected supervisors, compare their concerns with the source notes, and agree how corrected concerns and their responses will stay visible."
        ],
        [
          "B",
          "Ask the analyst to improve the summary prompt and circulate a replacement before contacting the supervisors."
        ],
        [
          "C",
          "Ask the operations director to confirm support on behalf of all shifts so the team can continue the current engagement plan."
        ],
        [
          "D",
          "Treat the supervisors’ withdrawal as resistance and add more demonstrations of the workflow’s benefits."
        ]
      ],
      "correct": [
        "A"
      ],
      "explanation": "The immediate problem is loss of trust after stakeholders were misrepresented. Listening to the affected group and checking the primary record restores an evidence-based dialogue. A visible correction and feedback path support continuing engagement; prompt improvements may follow but cannot substitute for it.",
      "rationales": {
        "A": "This combines direct engagement, verification, and a feedback mechanism for the concerns that were lost.",
        "B": "A technical correction without involving the affected stakeholders may repeat the omission and leaves the trust problem unresolved.",
        "C": "A senior representative’s general support does not erase a distinct shift’s needs or repair its misrepresentation.",
        "D": "The evidence points to omitted concerns, so persuasion before understanding them misdiagnoses the problem."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178)."
      ],
      "difficultyReason": "The scenario requires choosing the first relationship-building action over plausible tooling and sponsorship responses.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 133,
      "id": "pmp-set2-133",
      "domain": "Business Environment",
      "task": 2,
      "approach": "Predictive",
      "difficulty": "Moderate",
      "format": "single",
      "caseId": null,
      "stem": "A project analyst wants to upload identifiable customer complaint records to a public AI service to prepare a lessons-learned summary. The organization’s stated policy permits this data only in approved environments; the public service is not approved. An approved internal tool is available. No data has been uploaded. What should the project manager do?",
      "options": [
        [
          "A",
          "Permit the upload if the analyst deletes the public conversation after generating the summary."
        ],
        [
          "B",
          "Permit the upload after replacing customer names, without checking the remaining identifying fields."
        ],
        [
          "C",
          "Ask the sponsor to authorize the upload because the summary is needed for the planned closure date."
        ],
        [
          "D",
          "Use the approved environment and follow the organization’s data-handling requirements for the summary."
        ]
      ],
      "correct": [
        "D"
      ],
      "explanation": "The scenario supplies a clear policy and a compliant available route. Using that route preserves the task’s purpose while respecting the stated restriction. Deleting a conversation or removing only names does not establish compliance, and the sponsor is not described as having exception authority.",
      "rationales": {
        "A": "Deletion afterward does not make an unauthorized disclosure compliant.",
        "B": "Other fields may remain identifying; this option assumes a transformation is sufficient without checking the policy.",
        "C": "Schedule pressure does not establish authority to override the stated data restriction.",
        "D": "This directly satisfies the given policy while enabling the planned analysis."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344)."
      ],
      "difficultyReason": "The candidate applies an explicit organizational restriction with a readily available compliant alternative.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 134,
      "id": "pmp-set2-134",
      "domain": "Process",
      "task": 2,
      "approach": "Hybrid",
      "difficulty": "Challenging",
      "format": "hotspot",
      "caseId": null,
      "stem": "A hybrid project uses signed requirements for a physical inspection station and an iterative backlog for its reporting software. An AI assistant has converted workshop notes into proposed scope statements. The review rule is explicit: a statement presented as agreed scope must have a traceable stakeholder decision supporting its meaning; an inference may remain labeled as a proposal. Select the evidence cell that shows a statement improperly presented as agreed scope.",
      "options": [
        [
          "A",
          "A — Paper report: agreed scope; signed decision R-21 requires one printed report per inspection."
        ],
        [
          "B",
          "B — Automatic rejection: agreed scope; note N-8 requests a warning, but contains no decision authorizing automatic rejection."
        ],
        [
          "C",
          "C — Offline export: proposal awaiting review; the assistant inferred a possible need from workshop discussion."
        ],
        [
          "D",
          "D — Operator confirmation: agreed scope; approved clarification R-24 requires operator confirmation before submission."
        ]
      ],
      "correct": [
        "B"
      ],
      "explanation": "Row B converts a request for a warning into an agreed automatic-rejection requirement without a supporting decision. That changes the meaning and may expand scope. The team should validate the interpretation with the relevant stakeholders before presenting it as agreed scope. Row C is explicitly a proposal, which the review rule permits.",
      "rationales": {
        "A": "The stated signed requirement supports the proposed meaning and status.",
        "B": "The cited note does not authorize the stronger automatic-rejection behavior; its agreed status is unsupported.",
        "C": "An inference is allowed to remain a clearly labeled proposal pending stakeholder review.",
        "D": "The approved clarification provides traceable support for the statement."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.2: scope and requirements, pp. 39–45 (PDF pp. 144–150)."
      ],
      "difficultyReason": "The candidate must compare the meaning of the source with the status of the generated requirement, distinguishing an unsupported commitment from a legitimate proposal.",
      "instruction": "Select ONE evidence cell.",
      "exhibit": {
        "headers": [
          "Generated statement",
          "Decision evidence"
        ],
        "rows": [
          [
            "A — Paper report; agreed scope",
            "Signed R-21 requires one printed report per inspection."
          ],
          [
            "B — Automatic rejection; agreed scope",
            "N-8 requests a warning; no automatic-rejection decision."
          ],
          [
            "C — Offline export; proposal awaiting review",
            "Inferred from discussion; not presented as agreed scope."
          ],
          [
            "D — Operator confirmation; agreed scope",
            "Approved R-24 requires confirmation before submission."
          ]
        ]
      },
      "hotspotType": "requirements",
      "hotspotColumn": 1,
      "hotspotInstruction": "Select the evidence cell for the unsupported agreed scope statement.",
      "hotspotTarget": {
        "row": "B",
        "column": 1
      }
    },
    {
      "n": 135,
      "id": "pmp-set2-135",
      "domain": "People",
      "task": 5,
      "approach": "Hybrid",
      "difficulty": "Challenging",
      "format": "multiple",
      "caseId": null,
      "stem": "A hybrid project is introducing an AI drafting assistant through iterative pilots before a planned organization-wide rollout. Sales leaders expect it to send customer offers automatically; service managers expect every offer to be reviewed by an employee. Both groups approved the broad goal of faster response, but no agreement defines automation boundaries or acceptable errors. Before the pilot’s success criteria are finalized, which TWO actions should the project manager take?",
      "options": [
        [
          "A",
          "Facilitate a discussion of each group’s intended outcomes, concerns, and assumptions about how offers will be produced."
        ],
        [
          "B",
          "Use the vendor’s default settings as the shared operating model because they already support automatic sending."
        ],
        [
          "C",
          "Agree observable pilot outcomes and human decision boundaries with the relevant stakeholders and decision owners."
        ],
        [
          "D",
          "Ask both groups to sign the existing goal statement again so their approval can be used to settle later disputes."
        ],
        [
          "E",
          "Commit to automatic sending for the pilot and use complaints afterward to determine whether expectations differed."
        ]
      ],
      "correct": [
        "A",
        "C"
      ],
      "explanation": "The broad goal hides incompatible expectations. First make those assumptions explicit, then establish an agreed operating boundary and observable success criteria. These actions allow a pilot to test a shared expectation rather than unintentionally choose one stakeholder group’s interpretation.",
      "rationales": {
        "A": "This reveals the distinct expectations that the broad goal failed to reconcile.",
        "B": "A vendor default is not a stakeholder agreement or authorization for the proposed operating model.",
        "C": "This translates aligned expectations into assessable outcomes and accountable decisions.",
        "D": "Reconfirming ambiguous wording leaves the underlying disagreement intact.",
        "E": "This chooses one interpretation before agreement and makes customers bear the consequences of that ambiguity."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178)."
      ],
      "difficultyReason": "Two complementary actions are required: discover the incompatible assumptions and convert agreement into testable boundaries.",
      "instruction": "Select TWO answers."
    },
    {
      "n": 136,
      "id": "pmp-set2-136",
      "domain": "Business Environment",
      "task": 1,
      "approach": "Predictive",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A predictive capital project uses AI to rank proposed changes. The governance plan assigns approval of budget increases to the change control board. The project manager finds that a highly ranked change was approved automatically because the team configured a score threshold as an approval rule. No work has begun. What is the best response?",
      "options": [
        [
          "A",
          "Keep the approval because the ranking criteria were agreed when the tool was selected."
        ],
        [
          "B",
          "Prevent implementation, return the change to the authorized decision body, and correct the workflow so recommendations cannot bypass approval authority."
        ],
        [
          "C",
          "Ask the tool supplier to co-sign the approval, making the supplier accountable for the recommendation."
        ],
        [
          "D",
          "Raise the automatic approval threshold and process this change under the new threshold."
        ]
      ],
      "correct": [
        "B"
      ],
      "explanation": "Agreement on ranking criteria does not delegate approval authority. The configured workflow has crossed the governance boundary. Preventing implementation and restoring the authorized decision process addresses this change; correcting the workflow addresses recurrence. People retain the accountability assigned by governance.",
      "rationales": {
        "A": "Criteria for comparing changes are distinct from authority to commit the project to them.",
        "B": "This restores both the immediate decision path and the control that should enforce it.",
        "C": "The supplier is not the decision body named in the governance plan.",
        "D": "Changing a score threshold does not create delegated authority and does not repair this unauthorized approval."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.1: project governance, pp. 11–13 (PDF pp. 116–118)."
      ],
      "difficultyReason": "The candidate separates automated decision support from decision authority and selects a response that repairs both the instance and the process.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 137,
      "id": "pmp-set2-137",
      "domain": "Process",
      "task": 9,
      "approach": "Agile",
      "difficulty": "Very challenging",
      "format": "single",
      "caseId": null,
      "stem": "An agile team pilots an AI assistant for resolving service requests. The sponsor wants to know whether resolution quality improved. The same definition of a correct resolution was used before and during the pilot, and each request was independently checked. The table shows all checked requests. The pilot’s overall success rate is higher, but the share of simple requests also changed substantially. Which conclusion should the project manager present?",
      "options": [
        [
          "A",
          "The higher overall success rate establishes improved quality, so expand the assistant to all request types."
        ],
        [
          "B",
          "The pilot proves the assistant causes worse quality because both category rates are lower."
        ],
        [
          "C",
          "The overall increase does not establish improvement: both category rates fell, so investigate and compare performance with a consistent request mix before expanding."
        ],
        [
          "D",
          "Average the two overall success rates and use that result as the assistant’s expected quality after rollout."
        ]
      ],
      "correct": [
        "C"
      ],
      "explanation": "Before the pilot, the category rates were 90% for simple requests and 60% for complex requests; during it, they were 80% and 50%. Overall performance rose from about 62.7% to 77.3% because the pilot contained many more simple requests. Neither the pooled increase nor this observational comparison establishes a causal effect. The team needs to investigate category performance and compare like-for-like populations before claiming improvement or expanding.",
      "rationales": {
        "A": "The pooled result is affected by the changed mix and hides deterioration within both categories.",
        "B": "The category results warrant concern, but these observations alone do not isolate the assistant as the cause.",
        "C": "This recognizes the mix effect, reports the unfavorable category evidence, and calls for a defensible comparison.",
        "D": "Averaging pooled results ignores both the changed mix and the cause of the observed difference."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.7: monitor and control project performance, pp. 26–28 (PDF pp. 131–133)."
      ],
      "difficultyReason": "The candidate must reconcile a favorable aggregate with unfavorable subgroup results and avoid both a false improvement claim and an unsupported causal conclusion.",
      "instruction": "Select ONE answer.",
      "quantitative": true,
      "exhibit": {
        "headers": [
          "Request category and period",
          "Correct resolutions / requests checked"
        ],
        "rows": [
          [
            "Simple — before pilot",
            "90 / 100"
          ],
          [
            "Complex — before pilot",
            "600 / 1,000"
          ],
          [
            "Simple — during pilot",
            "800 / 1,000"
          ],
          [
            "Complex — during pilot",
            "50 / 100"
          ]
        ]
      }
    },
    {
      "n": 138,
      "id": "pmp-set2-138",
      "domain": "People",
      "task": 3,
      "approach": "Agile",
      "difficulty": "Moderate",
      "format": "single",
      "caseId": null,
      "stem": "An agile team is piloting an AI assistant for routine analysis. Several experienced analysts say they do not understand how their responsibilities will change and are avoiding the pilot. The organization has not made staffing decisions, and the project manager cannot guarantee future roles. What should the project manager do first?",
      "options": [
        [
          "A",
          "Discuss the analysts’ concerns and expected work changes, then identify learning and participation opportunities with them."
        ],
        [
          "B",
          "Promise that no role will change so the analysts feel safe participating in the pilot."
        ],
        [
          "C",
          "Exclude the reluctant analysts and let the tool supplier decide how their future work should be performed."
        ],
        [
          "D",
          "Make use of the assistant an individual performance target before discussing the concerns."
        ]
      ],
      "correct": [
        "A"
      ],
      "explanation": "The project manager should understand the team’s concerns and support people through changing work. An honest discussion can identify capability gaps and useful opportunities to participate in the pilot. This supports leadership and development without making staffing promises beyond the project manager’s authority.",
      "rationales": {
        "A": "This combines listening, realistic communication, and collaborative skill development.",
        "B": "The project manager cannot truthfully guarantee future roles under the stated conditions.",
        "C": "Excluding experienced team members loses their knowledge and does not address their concerns; the supplier has no stated staffing authority.",
        "D": "An imposed usage target does not establish readiness or resolve uncertainty about responsibilities."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.6.2.4: team leadership and development, pp. 84–86 (PDF pp. 189–191)."
      ],
      "difficultyReason": "The candidate selects an honest, supportive leadership response to explicitly stated uncertainty about changing work.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 139,
      "id": "pmp-set2-139",
      "domain": "Process",
      "task": 1,
      "approach": "Hybrid",
      "difficulty": "Challenging",
      "format": "matching",
      "caseId": null,
      "stem": "A hybrid project is adding AI-assisted document review to a planned approval process. The project manager is integrating the workstream plans before a pilot. Match each identified gap with the response that most directly closes it. Responses describe planning actions, not evidence that approval has already occurred.",
      "options": [
        [
          "A",
          "Plan representative source-data checks and assign responsibility for correcting defects."
        ],
        [
          "B",
          "Add a launch announcement to the communications calendar."
        ],
        [
          "C",
          "Define a named human decision owner and the route for uncertain or contested recommendations."
        ],
        [
          "D",
          "Estimate manual-review capacity and plan a fallback when the assistant is unavailable or its output is unusable."
        ],
        [
          "E",
          "Link the pilot’s start to the approved-data availability milestone and assess the effect of a delay."
        ]
      ],
      "correct": {
        "1": "E",
        "2": "C",
        "3": "A",
        "4": "D"
      },
      "explanation": "The four gaps concern a dependency, decision responsibility, input quality, and operating capacity. Each response addresses the corresponding missing element in the integrated plan. A launch announcement communicates a date but closes none of these four gaps.",
      "rationales": {
        "A": "A addresses gap 3: unreliable input needs planned checks and ownership of corrections.",
        "B": "B is unused: an announcement does not establish dependencies, decision authority, reliable inputs, or fallback capacity.",
        "C": "C addresses gap 2: contested recommendations need accountable human decisions and a resolution path.",
        "D": "D addresses gap 4: the fallback workload must be resourced and planned.",
        "E": "E addresses gap 1: the pilot depends on access to approved data, so the dependency and delay effects must be integrated."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.2: integrate and align project plans, pp. 18–19 (PDF pp. 123–124)."
      ],
      "difficultyReason": "The candidate must distinguish four interacting planning controls and match each to the actual gap, rather than choosing a generic readiness activity.",
      "instruction": "Match each planning gap to its most direct response. Use each choice at most once; one choice is unused.",
      "prompts": [
        [
          "1",
          "The pilot is scheduled before approval of the data it needs, but the schedules show no dependency."
        ],
        [
          "2",
          "No role has authority to resolve disputed AI recommendations."
        ],
        [
          "3",
          "Duplicate and outdated source records have been found, but no validation or correction work is planned."
        ],
        [
          "4",
          "Staff must review documents manually during an outage, but the plan contains no capacity for that work."
        ]
      ]
    },
    {
      "n": 140,
      "id": "pmp-set2-140",
      "domain": "Business Environment",
      "task": 5,
      "approach": "Predictive",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A predictive benefits-application project will use AI to recommend which requests staff review first. A pilot shows that requests from one language group are flagged for extra review much more often. The team has not determined whether the difference reflects legitimate request characteristics, data limitations, or bias. All groups are within launch scope. Staff retain final decisions, but extra review can still delay service. What should the project manager recommend before rollout?",
      "options": [
        [
          "A",
          "Remove language-group information from the dashboard and proceed because staff retain final decision authority."
        ],
        [
          "B",
          "Declare the tool discriminatory and permanently abandon it without examining the source data or outcomes."
        ],
        [
          "C",
          "Proceed with the rollout because a difference in flagging rates does not by itself prove bias."
        ],
        [
          "D",
          "Record and assess the potential unequal-impact risk with relevant experts and affected stakeholders, investigate the data and outcomes, and agree safeguards and release criteria."
        ]
      ],
      "correct": [
        "D"
      ],
      "explanation": "The observed difference is a risk signal requiring investigation, not proof of a specific cause. Human final decisions do not eliminate harm from unequal delays. The project should assess the exposure, examine relevant evidence, involve appropriate perspectives, and define safeguards and release conditions before extending use.",
      "rationales": {
        "A": "Hiding the comparison removes useful risk evidence; staff approval does not remove the delay effect.",
        "B": "The evidence warrants investigation and control, but does not yet establish the cause or justify an irreversible conclusion.",
        "C": "Lack of proof of bias is not evidence that the observed exposure is acceptable.",
        "D": "This responds proportionately to the signal and creates an evidence-based path to a release decision."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X3.1.1 and X3.3: AI adoption, review, bias, privacy, and accountability, pp. 238–239 (PDF pp. 343–344).",
        "PMBOK Guide, Eighth Edition, Guide §2.7: risk analysis and responses, pp. 96–97 (PDF pp. 201–202)."
      ],
      "difficultyReason": "The candidate must respond to a meaningful risk signal without treating it either as proven causation or as harmless uncertainty.",
      "instruction": "Select ONE answer."
    }
  ]
},
{
  "number": 15,
  "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch15.md",
  "questions": [
    {
      "n": 141,
      "id": "pmp-set2-141",
      "domain": "Process",
      "task": 3,
      "approach": "Hybrid",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A hybrid energy-management project has installed meters through a planned construction phase and is releasing optimization features iteratively. The business case targets a sustained reduction in energy used per unit of comparable production. The dashboard tracks meters installed and features released, but no one has agreed the reference operating conditions or who will evaluate savings after handover. What should the project manager prioritize?",
      "options": [
        [
          "A",
          "Declare the benefit achieved when the planned meters and optimization features have been accepted."
        ],
        [
          "B",
          "Work with the sponsor and operations to establish comparable baseline conditions, outcome measures, a benefits owner, and a measurement schedule."
        ],
        [
          "C",
          "Use the first month’s total electricity bill as the sole measure of project success."
        ],
        [
          "D",
          "Add more optimization features before defining the measurement approach so the benefit will be easier to demonstrate."
        ]
      ],
      "correct": [
        "B"
      ],
      "explanation": "The delivery measures show outputs, not the targeted sustained outcome. A benefits measurement system needs a meaningful reference, suitable metrics, ownership, and timing. Establishing these with the receiving organization makes it possible to assess the intended benefit after delivery and interpret changes in operating conditions.",
      "rationales": {
        "A": "Acceptance of equipment and features does not by itself demonstrate sustained energy improvement.",
        "B": "This closes the gaps in measuring and sustaining the business-case outcome.",
        "C": "A bill is affected by tariffs and production conditions and is not the stated energy-intensity outcome.",
        "D": "Additional features do not resolve missing benefit definitions and may add investment without evidence of value."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide: benefits management plan and business case, pp. 115–116 (PDF pp. 220–221).",
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.4: Focus on Value, pp. 40–42 (PDF pp. 63–65)."
      ],
      "difficultyReason": "The candidate must distinguish delivery evidence from benefit evidence and connect measurement design with operational accountability.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 142,
      "id": "pmp-set2-142",
      "domain": "People",
      "task": 4,
      "approach": "Predictive",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A predictive facility project proposes consolidating deliveries to reduce fuel consumption. The proposed route passes a residential area early in the morning. The logistics contractor and sponsor support the change, but residents and a nearby care facility were not included in the stakeholder analysis. No route decision has been approved. What should the project manager do next?",
      "options": [
        [
          "A",
          "Proceed with the preferred route because the sponsor and contractor represent the parties responsible for delivery performance."
        ],
        [
          "B",
          "Send residents a notice explaining the fuel reduction after the route is approved."
        ],
        [
          "C",
          "Reject consolidation immediately because any local inconvenience makes a sustainability initiative unacceptable."
        ],
        [
          "D",
          "Include the affected groups in the stakeholder analysis, understand their concerns, and assess route and timing alternatives before the decision."
        ]
      ],
      "correct": [
        "D"
      ],
      "explanation": "The proposal creates potential impacts for stakeholders who were omitted. Including them and exploring their needs allows the decision to account for environmental, operational, and social effects. The project manager should neither assume sponsor support represents all affected parties nor decide that the proposal must fail before evaluating alternatives.",
      "rationales": {
        "A": "Those parties do not represent the interests of every affected group.",
        "B": "Notification after approval denies the affected groups a timely opportunity to inform the choice.",
        "C": "A possible impact calls for analysis and alternatives, not an unsupported blanket rejection.",
        "D": "This expands engagement to the relevant affected groups while keeping feasible trade-offs open."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.7: Integrate Sustainability Within All Project Areas, pp. 48–52 (PDF pp. 71–75).",
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178)."
      ],
      "difficultyReason": "The candidate must recognize missing stakeholders despite strong internal support and choose engagement before commitment.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 143,
      "id": "pmp-set2-143",
      "domain": "Process",
      "task": 2,
      "approach": "Agile",
      "difficulty": "Challenging",
      "format": "multiple",
      "caseId": null,
      "stem": "An agile product team has a high-priority backlog item reading, “Make the customer portal sustainable.” The product owner agrees that reducing operating energy is the intended outcome, while the existing response-time commitment must still be met. Developers interpret the item differently and cannot determine whether it is done. Which TWO refinements are most useful before selecting the item for delivery?",
      "options": [
        [
          "A",
          "Define an observable energy-use target under agreed workload conditions while retaining the required response time."
        ],
        [
          "B",
          "Replace the item with “Use the newest hosting platform” and treat platform migration as proof of sustainability."
        ],
        [
          "C",
          "Clarify the behavior or service boundary being changed and agree the evidence used to verify the requirement with relevant stakeholders."
        ],
        [
          "D",
          "Estimate the item first and allow each developer to decide independently what sustainable means during implementation."
        ],
        [
          "E",
          "Add every possible environmental improvement to the item so no later sustainability work is needed."
        ]
      ],
      "correct": [
        "A",
        "C"
      ],
      "explanation": "The team needs a sufficiently clear scope boundary and verifiable outcomes. A target under agreed conditions makes energy performance assessable without sacrificing the existing service constraint; agreement on scope and evidence gives developers a common understanding. A technology choice or an unrestricted expansion of work does not establish the required outcome.",
      "rationales": {
        "A": "This turns the intended outcome into a measurable requirement and preserves the stated service constraint.",
        "B": "A newer platform is a solution choice, not evidence of lower energy use under the required conditions.",
        "C": "This establishes what the item covers and how stakeholders will assess conformance.",
        "D": "An estimate does not resolve conflicting interpretations or provide shared acceptance evidence.",
        "E": "An unbounded item obscures priorities and prevents a usable definition of the intended work."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.7: Integrate Sustainability Within All Project Areas, pp. 48–52 (PDF pp. 71–75).",
        "PMBOK Guide, Eighth Edition, Guide §2.2: scope and requirements, pp. 39–45 (PDF pp. 144–150)."
      ],
      "difficultyReason": "The candidate must select complementary scope and verification refinements while preserving an existing constraint.",
      "instruction": "Select TWO answers."
    },
    {
      "n": 144,
      "id": "pmp-set2-144",
      "domain": "Business Environment",
      "task": 8,
      "approach": "Predictive",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A predictive heat-recovery project was approved partly because of a utility incentive. Before the next major equipment commitment, the utility announces that this project is no longer eligible. The delivery team is on schedule, and 35% of the budget has already been spent. The sponsor retains authority to continue, change, or stop the investment. What should the project manager do?",
      "options": [
        [
          "A",
          "Update the remaining costs, benefits, and alternatives with the loss of the incentive and take a recommendation to the sponsor before the commitment."
        ],
        [
          "B",
          "Continue as planned because spending 35% of the budget establishes that the project must be completed."
        ],
        [
          "C",
          "Cancel the project immediately because the loss of any original benefit automatically invalidates approval."
        ],
        [
          "D",
          "Keep the original incentive in the forecast until the next scheduled annual business-case review."
        ]
      ],
      "correct": [
        "A"
      ],
      "explanation": "The external change may alter business viability and should inform the imminent commitment. The project manager should provide a current assessment and recommendation to the authorized decision maker. Prior expenditure does not prove that further investment is worthwhile, and the change does not itself establish that cancellation is best.",
      "rationales": {
        "A": "This evaluates the external change in time to inform the next consequential decision through the proper authority.",
        "B": "Prior spending is not a sufficient justification for future spending.",
        "C": "The remaining value and alternatives have not yet been evaluated, and the sponsor holds the decision authority.",
        "D": "Deferring the update would knowingly base a new commitment on an invalid assumption."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide: benefits management plan and business case, pp. 115–116 (PDF pp. 220–221).",
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.4: Focus on Value, pp. 40–42 (PDF pp. 63–65)."
      ],
      "difficultyReason": "The candidate must respond to an external change before commitment while separating sunk expenditure from future viability and respecting authority.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 145,
      "id": "pmp-set2-145",
      "domain": "Process",
      "task": 6,
      "approach": "Predictive",
      "difficulty": "Very challenging",
      "format": "single",
      "caseId": null,
      "stem": "A predictive equipment project is selecting one of four technically acceptable packages. The approved rule is to choose the lowest five-year total present-value cost among packages with forecast five-year emissions no greater than 100 tonnes. All packages are affordable and their estimates use the same service duty, horizon, and discount basis. The values shown are already present values; do not discount again. A prior $40,000 study cost is unrecoverable and identical for every option. Which recommendation applies the rule correctly?",
      "options": [
        [
          "A",
          "Advanced, at $170,000, because its disposal credit gives the lowest total present-value cost."
        ],
        [
          "B",
          "Reused, at $190,000, because it has the lowest purchase cost among packages meeting the emissions limit."
        ],
        [
          "C",
          "Efficient, at $180,000, because it has the lowest total present-value cost among packages meeting the emissions limit."
        ],
        [
          "D",
          "Standard, at $180,000, because its lower purchase cost offsets its higher operating and end-of-life costs."
        ]
      ],
      "correct": [
        "C"
      ],
      "explanation": "The five-year totals are Standard $180,000, Efficient $180,000, Reused $190,000, and Advanced $170,000. Standard and Advanced exceed the 100-tonne limit, leaving Efficient and Reused. Efficient has the lower qualifying total. The common unrecoverable study cost does not change this forward-looking comparison, and the supplied amounts must not be discounted a second time.",
      "rationales": {
        "A": "Advanced has the lowest cost but exceeds the mandatory emissions limit.",
        "B": "Reused meets the limit, but minimizing purchase cost alone is not the approved rule.",
        "C": "Efficient meets the limit and has the lower total cost of the two qualifying packages.",
        "D": "Standard exceeds the limit; its purchase-cost advantage does not make it eligible."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.7: Integrate Sustainability Within All Project Areas, pp. 48–52 (PDF pp. 71–75).",
        "PMBOK Guide, Eighth Edition, Guide §2.4: finance planning and analysis, pp. 63–65 (PDF pp. 168–170)."
      ],
      "difficultyReason": "The candidate must screen eligibility before comparing life-cycle cost, treat a disposal credit correctly, and avoid both double discounting and a sunk-cost distraction.",
      "instruction": "Select ONE answer.",
      "quantitative": true,
      "exhibit": {
        "headers": [
          "Package",
          "Five-year estimates"
        ],
        "rows": [
          [
            "Standard",
            "Purchase $80,000; operation $90,000; disposal cost $10,000; emissions 115 tonnes."
          ],
          [
            "Efficient",
            "Purchase $120,000; operation $55,000; disposal cost $5,000; emissions 85 tonnes."
          ],
          [
            "Reused",
            "Purchase $100,000; operation $70,000; disposal cost $20,000; emissions 95 tonnes."
          ],
          [
            "Advanced",
            "Purchase $150,000; operation $35,000; disposal credit $15,000; emissions 105 tonnes."
          ]
        ]
      }
    },
    {
      "n": 146,
      "id": "pmp-set2-146",
      "domain": "People",
      "task": 1,
      "approach": "Hybrid",
      "difficulty": "Moderate",
      "format": "single",
      "caseId": null,
      "stem": "A hybrid public-service project combines a planned building upgrade with iterative service redesign. Facilities staff describe success as a low-energy building; service staff describe it as accessible, reliable service. Both outcomes are included in the approved business case, but the teams now talk as if they are competing project purposes. What should the project manager do first?",
      "options": [
        [
          "A",
          "Ask the facilities team to own the project vision because the building work has the larger budget."
        ],
        [
          "B",
          "Remove the energy objective so that the service team’s purpose becomes the single measure of success."
        ],
        [
          "C",
          "Let each team retain its own purpose and reconcile any conflicts only at final acceptance."
        ],
        [
          "D",
          "Bring the teams together to connect both outcomes to a shared project vision and explain how their work contributes to it."
        ]
      ],
      "correct": [
        "D"
      ],
      "explanation": "The approved purpose includes both outcomes. The project manager should develop a shared understanding of how the work contributes to that purpose instead of allowing separate workstreams to redefine success. This creates a basis for later trade-offs without removing an approved objective.",
      "rationales": {
        "A": "Budget size does not determine which approved outcome defines the project’s purpose.",
        "B": "An approved objective should not be removed simply to avoid discussing alignment.",
        "C": "Deferring alignment allows conflicting priorities to persist throughout delivery.",
        "D": "This re-establishes a common vision around the approved outcomes."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.4: Focus on Value, pp. 40–42 (PDF pp. 63–65).",
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.7: Integrate Sustainability Within All Project Areas, pp. 48–52 (PDF pp. 71–75)."
      ],
      "difficultyReason": "The scenario states that both outcomes are approved, so the appropriate first step is restoring a common vision.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 147,
      "id": "pmp-set2-147",
      "domain": "Business Environment",
      "task": 5,
      "approach": "Agile",
      "difficulty": "Challenging",
      "format": "multiple",
      "caseId": null,
      "stem": "An agile team is piloting reusable delivery containers. The forecast benefit assumes customers return each container enough times to offset its production and washing impacts. Actual return rates and washing resource use are not yet known. The product owner wants evidence before expanding the pilot. Which TWO actions best manage the uncertainty?",
      "options": [
        [
          "A",
          "Treat reuse as environmentally beneficial by definition and expand immediately."
        ],
        [
          "B",
          "Document the key return-rate and washing assumptions, identify exposure if they fail, and agree monitoring triggers for reconsidering expansion."
        ],
        [
          "C",
          "Measure only how many reusable containers are distributed, because that is fully within the team’s control."
        ],
        [
          "D",
          "Replace all uncertain estimates with the most optimistic supplier values so the forecast is consistent."
        ],
        [
          "E",
          "Run a bounded pilot that measures return cycles and washing impacts with relevant operational expertise, then reassess the benefit forecast."
        ]
      ],
      "correct": [
        "B",
        "E"
      ],
      "explanation": "The benefit depends on uncertain life-cycle conditions. Making those assumptions and response triggers explicit provides a risk-management basis; a bounded pilot supplies evidence to revise the assessment. Distribution volume alone is an output measure and cannot establish repeated use or the associated environmental result.",
      "rationales": {
        "A": "Reuse is not sufficient evidence that production and washing impacts will be offset under actual conditions.",
        "B": "This identifies the uncertainty, its consequences, and when the team should reconsider its response.",
        "C": "Distribution count does not test the conditions that determine the forecast benefit.",
        "D": "Optimistic values conceal uncertainty rather than manage it.",
        "E": "This obtains relevant evidence in a limited exposure before committing to expansion."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.7: Integrate Sustainability Within All Project Areas, pp. 48–52 (PDF pp. 71–75).",
        "PMBOK Guide, Eighth Edition, Guide §2.7: risk analysis and responses, pp. 96–97 (PDF pp. 201–202)."
      ],
      "difficultyReason": "The candidate must combine explicit risk assumptions and triggers with evidence-gathering that tests the actual benefit mechanism.",
      "instruction": "Select TWO answers."
    },
    {
      "n": 148,
      "id": "pmp-set2-148",
      "domain": "People",
      "task": 6,
      "approach": "Agile",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "An agile service project introduces digital renewal forms to reduce paper and improve completion rates. In the pilot, paper use falls as expected, but users who rely on assisted service abandon renewals more often. The agreed outcome includes maintaining access for these users. Their representatives report that the new support instructions are confusing. What should the project manager do next?",
      "options": [
        [
          "A",
          "Declare the pilot successful because the paper-reduction target was met."
        ],
        [
          "B",
          "Review the affected users’ experience with their representatives and the product owner, adapt support through the backlog, and monitor whether access recovers."
        ],
        [
          "C",
          "Remove assisted-service users from the reported completion measure so the pilot can be compared with digital-only usage."
        ],
        [
          "D",
          "Restore every old process permanently without investigating the specific support problem."
        ]
      ],
      "correct": [
        "B"
      ],
      "explanation": "The pilot has not maintained an agreed customer outcome for a specific group. The project manager should respond to that feedback, work with the product owner on a targeted adaptation, and check its effect. Environmental improvement does not replace the promised service access, and the evidence points to a problem that can be investigated rather than an automatic need to abandon every change.",
      "rationales": {
        "A": "Meeting one target does not establish success against the separate access expectation.",
        "B": "This responds to actual customer experience and maintains a feedback loop for the agreed outcome.",
        "C": "Excluding the affected users hides the unmet expectation.",
        "D": "A permanent wholesale reversal is premature before examining and testing the reported support issue."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).",
        "PMBOK Guide, Eighth Edition, The Standard for Project Management §3.7: Integrate Sustainability Within All Project Areas, pp. 48–52 (PDF pp. 71–75)."
      ],
      "difficultyReason": "The candidate must maintain an agreed customer expectation while responding proportionately to evidence from iterative delivery.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 149,
      "id": "pmp-set2-149",
      "domain": "People",
      "task": 8,
      "approach": "Predictive",
      "difficulty": "Moderate",
      "format": "single",
      "caseId": null,
      "stem": "A predictive process-improvement project reports monthly energy results. Before the change, the operation produced 10,000 units using 100 MWh. This month it produced 15,000 comparable units using 120 MWh. The sponsor asks for both energy intensity and total energy use. Which report accurately presents the observed results without claiming the project caused them?",
      "options": [
        [
          "A",
          "Total energy use fell by 20%, showing that both requested measures improved."
        ],
        [
          "B",
          "Energy intensity increased by 20% because total energy use increased from 100 MWh to 120 MWh."
        ],
        [
          "C",
          "Energy per unit fell by 20%, while total energy use rose by 20%; the figures alone do not isolate the project’s contribution."
        ],
        [
          "D",
          "The project saved 30 MWh, so report this as a verified reduction in actual total energy use."
        ]
      ],
      "correct": [
        "C"
      ],
      "explanation": "Energy intensity changed from 10 kWh per unit to 8 kWh per unit, a 20% decrease. Actual total use rose from 100 MWh to 120 MWh, a 20% increase. A projection of prior intensity at current output would be 150 MWh, but its 30 MWh difference from actual use is not a decrease in actual total use and is not, by itself, proof of project attribution.",
      "rationales": {
        "A": "Actual total use increased; this reverses the direction of the observed change.",
        "B": "Intensity includes production volume, which rose faster than total energy use.",
        "C": "This reports both requested measures accurately and avoids an unsupported causal claim.",
        "D": "This confuses an output-adjusted comparison with actual total-use reduction and asserts attribution without sufficient evidence."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).",
        "PMBOK Guide, Eighth Edition, Guide: benefits management plan and business case, pp. 115–116 (PDF pp. 220–221)."
      ],
      "difficultyReason": "The candidate performs simple normalization and reports two explicitly requested measures without overstating what they show.",
      "instruction": "Select ONE answer.",
      "quantitative": true
    },
    {
      "n": 150,
      "id": "pmp-set2-150",
      "domain": "Process",
      "task": 10,
      "approach": "Hybrid",
      "difficulty": "Very challenging",
      "format": "single",
      "caseId": null,
      "stem": "A hybrid water-efficiency project has accepted its equipment and final software release. Its closure plan requires accepted deliverables, operational readiness, and a funded handover of benefits monitoring; achieving the forecast annual saving is not a closure condition because it requires twelve months of operation. Operators are trained. An operations manager has agreed to own benefit reporting, but the staff time and meter-maintenance budget needed for it have not been authorized. The sponsor proposes closing now because the owner is named, while another stakeholder insists the project must remain open until the annual benefit is proven. What should the project manager recommend?",
      "options": [
        [
          "A",
          "Resolve and verify the missing monitoring resources through the authorized handover process, then close when the stated conditions are met and track benefits in operations."
        ],
        [
          "B",
          "Close immediately because a named benefits owner satisfies the remaining handover requirement."
        ],
        [
          "C",
          "Keep the entire delivery team assigned for twelve months until the forecast saving is demonstrated."
        ],
        [
          "D",
          "Declare the annual saving realized when the equipment is accepted so both stakeholders can approve closure."
        ]
      ],
      "correct": [
        "A"
      ],
      "explanation": "The stated conditions separate project closure from later benefits realization, but require a funded monitoring handover. Naming an owner without the needed resources leaves that condition unmet. The project manager should resolve this specific gap and verify readiness, then close under the agreed criteria while operational benefit tracking continues. Neither automatic closure nor retaining the whole delivery team for the benefit horizon follows the stated plan.",
      "rationales": {
        "A": "This satisfies the actual handover gap while preserving the distinction between delivery closure and later benefit verification.",
        "B": "A named owner does not supply the unapproved staff time or maintenance funding required by the closure plan.",
        "C": "The plan does not require realized annual savings before closure; holding the full team for twelve months adds an unsupported condition.",
        "D": "Accepted outputs do not prove a future annual saving."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide: benefits management plan and business case, pp. 115–116 (PDF pp. 220–221).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137)."
      ],
      "difficultyReason": "The candidate must reject two competing but incomplete closure arguments, identify an unmet funding condition, and separate the project horizon from the benefits horizon.",
      "instruction": "Select ONE answer."
    }
  ]
},
{
  "number": 16,
  "sourcePage": "https://github.com/UpSkillSprint-Consulting/upskill-sprint/blob/codex/pmp-set2-batches01-05/docs/pmp-set2-batch16.md",
  "questions": [
    {
      "n": 151,
      "id": "pmp-set2-151",
      "domain": "Business Environment",
      "task": 4,
      "approach": "Hybrid",
      "difficulty": "Very challenging",
      "format": "single",
      "caseId": null,
      "stem": "A hybrid project must complete a planned equipment installation before an iterative software trial. The site’s shared lifting equipment has become unavailable. The project manager can authorize resequencing that preserves safety and approved scope, but only the portfolio director can allocate a replacement shared crane. A safe resequencing option preserves two days of work; the replacement must be confirmed within one day to protect the installation window. The director’s normal review is in four days. What should the project manager do?",
      "options": [
        [
          "A",
          "Use the two-day resequencing option and wait for the normal portfolio review before requesting the replacement."
        ],
        [
          "B",
          "Promise the replacement crane to the installation team now and obtain the director’s approval after the work is protected."
        ],
        [
          "C",
          "Start the authorized resequencing and escalate the crane decision now through the urgent route with impact, options, and the one-day decision deadline."
        ],
        [
          "D",
          "Suspend all project work until the director has decided which equipment to allocate."
        ]
      ],
      "correct": [
        "C"
      ],
      "explanation": "The project manager can contain part of the disruption within existing authority, but that action does not remove the earlier deadline for the cross-project resource decision. Acting on the safe option and seeking an urgent authorized decision in parallel protects available work without claiming authority to allocate the crane. Escalation should make the decision needed and its timing explicit.",
      "rationales": {
        "A": "The four-day review occurs after the one-day decision deadline; temporary containment does not buy four days.",
        "B": "The project manager lacks the stated authority to promise the shared crane.",
        "C": "This combines authorized containment with timely escalation of the decision outside project authority.",
        "D": "The scenario provides useful safe work that can proceed without that decision."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.1.3–2.1.4: governance mechanisms and escalation, pp. 13 (PDF pp. 118).",
        "PMBOK Guide, Eighth Edition, Guide Section 4: issue log, pp. 123 (PDF pp. 228)."
      ],
      "difficultyReason": "The candidate must distinguish a containment duration from a decision deadline and coordinate two actions governed by different authorities.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 152,
      "id": "pmp-set2-152",
      "domain": "People",
      "task": 2,
      "approach": "Agile",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "Two agile teams share an integration environment. After an external service outage compresses their test windows, each team reserves the environment for the same afternoon. Both need it to verify a release dependency, and neither has authority over the other. The teams begin arguing about whose sprint commitment matters more. What should the project manager do first?",
      "options": [
        [
          "A",
          "Give the environment to the team with the higher velocity because it will probably finish more work."
        ],
        [
          "B",
          "Facilitate a discussion of the actual test dependencies, time needs, and shared release objective to agree a workable allocation."
        ],
        [
          "C",
          "Tell both teams to keep their reservations and let the environment administrator choose at the start time."
        ],
        [
          "D",
          "Escalate the personalities involved to their functional managers before examining the scheduling conflict."
        ]
      ],
      "correct": [
        "B"
      ],
      "explanation": "The immediate conflict concerns a scarce shared resource under changed conditions. A facilitated discussion of dependencies and needs provides a basis for agreement around the shared outcome. Neither velocity nor an arbitrary last-minute choice establishes the best allocation, and the scenario does not yet justify treating the conflict as a personnel issue.",
      "rationales": {
        "A": "Team velocity is not a fair or sufficient measure of the urgency of these integration tests.",
        "B": "This addresses the substantive conflict and seeks a shared, workable agreement.",
        "C": "Leaving conflicting reservations intact defers the problem until the resource is needed.",
        "D": "Escalating individuals before analyzing the resource conflict misses its stated source."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: stakeholder engagement and communication, pp. 72–73 (PDF pp. 177–178).",
        "PMBOK Guide, Eighth Edition, Guide §2.6.2.4: team leadership and development, pp. 84–86 (PDF pp. 189–191)."
      ],
      "difficultyReason": "The candidate must resolve a resource-driven conflict using shared dependencies rather than apparent team productivity or hierarchy.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 153,
      "id": "pmp-set2-153",
      "domain": "Process",
      "task": 8,
      "approach": "Predictive",
      "difficulty": "Very challenging",
      "format": "single",
      "caseId": null,
      "stem": "After a delivery disruption, a predictive project has two independent remaining paths that both must finish before handover. Path P takes 12 working days; path Q takes 11. The required handover is in 10 working days. The approved recovery budget is $9,000. The only available acceleration actions are listed; reductions are additive within a path and do not affect the other path. Resources for the actions are available, and scope and quality remain unchanged. Which action set meets the date within budget?",
      "options": [
        [
          "A",
          "Accelerate P by two days for $6,000; leave Q unchanged."
        ],
        [
          "B",
          "Accelerate P by one day and Q by one day for a combined $5,000."
        ],
        [
          "C",
          "Accelerate Q by two days for $4,000; leave P unchanged."
        ],
        [
          "D",
          "Accelerate P by two days and Q by one day for a combined $8,000."
        ]
      ],
      "correct": [
        "D"
      ],
      "explanation": "Handover waits for both paths. P must fall from 12 to 10 days, and Q from 11 to 10. The combined cost is $6,000 plus $2,000, or $8,000, within the $9,000 limit. Shortening only the initially longest path leaves Q at 11 days, so it does not achieve the required finish.",
      "rationales": {
        "A": "P reaches 10 days but Q remains at 11, leaving handover one day late.",
        "B": "P remains at 11 days, so the combined work still misses the date.",
        "C": "P remains at 12 days; shortening Q alone does not change the handover date.",
        "D": "Both paths reach 10 days and the $8,000 cost is within budget."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Section 5: schedule compression, pp. 196–197 (PDF pp. 301–302).",
        "PMBOK Guide, Eighth Edition, Guide §2.3: schedule sequencing and estimates, pp. 51–53 (PDF pp. 156–158)."
      ],
      "difficultyReason": "The candidate must reassess the controlling path after compression and satisfy both the finish constraint and the recovery budget.",
      "instruction": "Select ONE answer.",
      "quantitative": true,
      "exhibit": {
        "headers": [
          "Path",
          "Available acceleration"
        ],
        "rows": [
          [
            "P — 12 days",
            "Up to 2 days shorter; $3,000 for each day removed."
          ],
          [
            "Q — 11 days",
            "Up to 2 days shorter; $2,000 for each day removed."
          ]
        ]
      }
    },
    {
      "n": 154,
      "id": "pmp-set2-154",
      "domain": "Business Environment",
      "task": 3,
      "approach": "Predictive",
      "difficulty": "Moderate",
      "format": "dropdown",
      "caseId": null,
      "stem": "An authorized emergency change board approves a replacement component after the specified part becomes unavailable. The approval includes revised verification requirements and an installation date. The project manager has confirmed that the decision is valid under the change procedure. Before the installation team proceeds, the project manager should _____.",
      "options": [
        [
          "A",
          "communicate the approved decision and update the affected controlled plans and work instructions so the team uses the revised requirements"
        ],
        [
          "B",
          "ask each engineer to decide which version of the specification to follow"
        ],
        [
          "C",
          "retain the old instructions until project closure to preserve a record of the original baseline"
        ],
        [
          "D",
          "send the replacement directly to installation and treat verification as optional because the change was urgent"
        ]
      ],
      "correct": [
        "A"
      ],
      "explanation": "An approved change must be translated into the current controlled information and communicated to those implementing it. The original baseline can remain in the historical record while the team works from the approved revision. Urgency does not remove the verification requirements stated in the approval.",
      "rationales": {
        "A": "This makes the authorized change usable and consistent across implementation and verification.",
        "B": "Individual interpretation does not substitute for controlled implementation of the approved change.",
        "C": "Preserving history does not justify giving the team obsolete instructions.",
        "D": "The approval expressly includes verification; the emergency does not waive it."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: assess and implement changes, pp. 28–30 (PDF pp. 133–135)."
      ],
      "difficultyReason": "The authorization is already established, so the candidate applies the next implementation and communication steps.",
      "instruction": "Select the best completion."
    },
    {
      "n": 155,
      "id": "pmp-set2-155",
      "domain": "People",
      "task": 4,
      "approach": "Hybrid",
      "difficulty": "Challenging",
      "format": "multiple",
      "caseId": null,
      "stem": "A hybrid project’s planned site work is delayed by a regional transport interruption. A software pilot can continue remotely, but the delay changes access arrangements for a tenant and the availability of a commissioning specialist shared with another project. The current engagement plan covers the sponsor and delivery team only. Which TWO actions should the project manager take to support a workable recovery decision?",
      "options": [
        [
          "A",
          "Wait to contact the tenant until a revised date has been committed internally."
        ],
        [
          "B",
          "Identify the newly affected stakeholders and assess their constraints, influence, and information needs."
        ],
        [
          "C",
          "Send the same detailed technical schedule to everyone and treat distribution as completed engagement."
        ],
        [
          "D",
          "Let the software team set the site date because its work can continue."
        ],
        [
          "E",
          "Engage the tenant and the specialist’s resource owner early to assess feasible access and allocation options with the delivery leads."
        ]
      ],
      "correct": [
        "B",
        "E"
      ],
      "explanation": "The disruption changes who is affected and whose participation is needed to make recovery feasible. Updating the stakeholder analysis and involving the relevant parties before commitment exposes constraints that an internal schedule alone cannot resolve. Communication should enable a decision, not merely distribute information.",
      "rationales": {
        "A": "A date committed without understanding access constraints may be infeasible.",
        "B": "This updates the engagement basis to reflect the changed situation.",
        "C": "Identical information distribution does not establish that the right stakeholders can inform the decision.",
        "D": "The software team does not control tenant access or the shared specialist’s allocation.",
        "E": "This brings the parties who control key recovery constraints into the decision early."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: stakeholder engagement and communication, pp. 72–73 (PDF pp. 177–178)."
      ],
      "difficultyReason": "The candidate must identify changed stakeholder needs and select active involvement of the people who control recovery constraints.",
      "instruction": "Select TWO answers."
    },
    {
      "n": 156,
      "id": "pmp-set2-156",
      "domain": "Process",
      "task": 4,
      "approach": "Agile",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "An agile team has six completed changes waiting for security review after an external review service becomes unavailable. The team’s agreement limits this queue to three. Two developers are qualified to perform the required review independently of the changes they authored, and the product owner can defer starting new features. What should the project manager support?",
      "options": [
        [
          "A",
          "Work with the team and product owner to reduce new starts and temporarily direct qualified capacity to independent reviews of the waiting changes."
        ],
        [
          "B",
          "Start additional features so every developer remains fully utilized while the review queue waits."
        ],
        [
          "C",
          "Remove the review requirement until the external service returns so the queue falls immediately."
        ],
        [
          "D",
          "Assign every developer to review their own changes because that avoids coordination time."
        ]
      ],
      "correct": [
        "A"
      ],
      "explanation": "The bottleneck is qualified review capacity, not lack of development work. The scenario provides a compliant internal resource option and the ability to control new starts. Temporarily adjusting allocation can reduce the queue while retaining the required independent review. Maximizing new development would add work ahead of an already constrained step.",
      "rationales": {
        "A": "This addresses the actual capacity constraint while preserving reviewer qualifications and independence.",
        "B": "More new work would tend to increase the backlog at the constrained review step.",
        "C": "The outage does not authorize removal of the stated review requirement.",
        "D": "Self-review violates the independence condition provided in the scenario."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.6: resource management, pp. 83–86 (PDF pp. 188–191)."
      ],
      "difficultyReason": "The candidate must optimize flow under a capacity disruption while preserving explicit qualification and independence constraints.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 157,
      "id": "pmp-set2-157",
      "domain": "Process",
      "task": 5,
      "approach": "Predictive",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A supplier on a predictive project misses a confirmed delivery and says it cannot provide a reliable recovery date. The contract requires a formal notice and a three-day opportunity to present a recovery plan before the buyer may use the stated replacement remedy. The procurement manager controls notices and replacement orders. An alternative supplier may have stock, but compatibility is unverified. What should the project manager do next?",
      "options": [
        [
          "A",
          "Order the alternative immediately and assume the missed date voids the original contract."
        ],
        [
          "B",
          "Wait until the original supplier volunteers a firm date before informing procurement."
        ],
        [
          "C",
          "Coordinate the required notice with procurement, assess delivery impact, and verify the alternative’s suitability and availability for an authorized decision."
        ],
        [
          "D",
          "Tell the original supplier that it must pay any alternative-supplier price, regardless of the contract terms."
        ]
      ],
      "correct": [
        "C"
      ],
      "explanation": "The missed delivery is an issue requiring action under the stated agreement. The project manager can coordinate the contractual process and investigate a feasible alternative in parallel, without prematurely exercising a remedy or committing an unverified replacement. The procurement manager retains the stated ordering and notice authority.",
      "rationales": {
        "A": "The missed date does not automatically waive the specified remedy conditions or ordering authority.",
        "B": "Waiting passively delays both the contractual response and assessment of recovery options.",
        "C": "This follows the contractual path while developing reliable evidence for the recovery decision.",
        "D": "The scenario does not establish such an unlimited cost-recovery right."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Appendix X4: procurement contracts and claims, pp. 247–254 (PDF pp. 352–359).",
        "PMBOK Guide, Eighth Edition, Guide Section 4: issue log, pp. 123 (PDF pp. 228)."
      ],
      "difficultyReason": "The candidate must separate preparation of recovery options from authority to exercise a contractual remedy.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 158,
      "id": "pmp-set2-158",
      "domain": "Business Environment",
      "task": 4,
      "approach": "Agile",
      "difficulty": "Moderate",
      "format": "matching",
      "caseId": null,
      "stem": "An agile project reviews four impediment situations. Match each to the most direct management response. The team’s agreed practice is to assign an owner and track actual impediments until their resolution is verified.",
      "options": [
        [
          "A",
          "Escalate the unresolved decision to the authority that can resolve the cross-team conflict."
        ],
        [
          "B",
          "Verify the fix and affected work, then update the issue’s resolution status."
        ],
        [
          "C",
          "Record and assess the uncertain event as a risk with an appropriate response approach."
        ],
        [
          "D",
          "Record the active impediment, assign an owner, and act to restore progress."
        ],
        [
          "E",
          "Close the item because it has been discussed in the daily meeting."
        ]
      ],
      "correct": {
        "1": "D",
        "2": "A",
        "3": "B",
        "4": "C"
      },
      "explanation": "An event that has already blocked work needs active issue management. A decision outside the team’s authority needs escalation. A reported fix needs verification before closure. A possible future event remains a risk while uncertain. Discussion alone is not evidence that any impediment has been resolved.",
      "rationales": {
        "A": "A fits situation 2: the designated higher authority can resolve the resource conflict.",
        "B": "B fits situation 3: verification is needed before declaring the impediment resolved.",
        "C": "C fits situation 4: the event has not happened and its occurrence remains uncertain.",
        "D": "D fits situation 1: current blocked work needs an owner and a response.",
        "E": "E is unused: a meeting discussion does not establish resolution."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide Section 4: issue log, pp. 123 (PDF pp. 228).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.3–2.1.4: governance mechanisms and escalation, pp. 13 (PDF pp. 118).",
        "PMBOK Guide, Eighth Edition, Guide §2.7: risk management, pp. 96–97 (PDF pp. 201–202)."
      ],
      "difficultyReason": "The candidate classifies four explicitly described states and applies the corresponding issue or risk response.",
      "instruction": "Match each situation to its most direct management response. Use each choice at most once; one choice is unused.",
      "prompts": [
        [
          "1",
          "The test service is down now and today’s validation work cannot proceed."
        ],
        [
          "2",
          "Two teams need an indivisible shared resource; attempts to agree have failed, and the portfolio lead holds allocation authority."
        ],
        [
          "3",
          "An owner reports that access has been restored, but the affected team has not yet checked it."
        ],
        [
          "4",
          "A provider warns that a possible strike next month could interrupt service; no interruption has occurred."
        ]
      ]
    },
    {
      "n": 159,
      "id": "pmp-set2-159",
      "domain": "People",
      "task": 6,
      "approach": "Hybrid",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A hybrid implementation’s hardware delivery is delayed. The customer still needs an agreed minimum operating capability for a training event, while later software enhancements can be deferred. The team believes a temporary configuration could support the minimum capability, but it has not yet been verified. What should the project manager do when discussing expectations with the customer?",
      "options": [
        [
          "A",
          "Promise the temporary configuration for the event to maintain confidence, then ask the team to make it work."
        ],
        [
          "B",
          "Tell the customer the original commitment remains unchanged until the temporary configuration fails testing."
        ],
        [
          "C",
          "Announce that all customer outcomes must move to the new hardware date without considering the stated minimum capability."
        ],
        [
          "D",
          "Explain the impact and uncertainty, validate the temporary option with the team, and agree an evidence-based revised commitment and follow-up with the customer."
        ]
      ],
      "correct": [
        "D"
      ],
      "explanation": "The customer’s minimum outcome may still be achievable, but the proposed route is not yet proven. The project manager should be transparent about the disruption and uncertainty, investigate the relevant option, and establish a realistic commitment with the customer. Neither unsupported reassurance nor blanket postponement manages the stated expectation well.",
      "rationales": {
        "A": "An unverified option does not support a firm promise.",
        "B": "Withholding the known impact prevents the customer from planning around material uncertainty.",
        "C": "The scenario identifies a potentially valuable alternative that should be assessed before dismissing the minimum outcome.",
        "D": "This maintains the customer outcome as the focus while making commitments depend on verified feasibility."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: stakeholder engagement and communication, pp. 72–73 (PDF pp. 177–178).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: assess and implement changes, pp. 28–30 (PDF pp. 133–135)."
      ],
      "difficultyReason": "The candidate must preserve the customer’s priority outcome without presenting an untested workaround as a commitment.",
      "instruction": "Select ONE answer."
    },
    {
      "n": 160,
      "id": "pmp-set2-160",
      "domain": "Process",
      "task": 9,
      "approach": "Predictive",
      "difficulty": "Challenging",
      "format": "single",
      "caseId": null,
      "stem": "A predictive project’s approved finish baseline is 30 November. A supply interruption moves the current forecast to 12 December. The team has identified a recovery option that could finish on 5 December, but its funding is not yet approved. At the status review, the sponsor asks for the most useful representation of the project’s position. What should the project manager report?",
      "options": [
        [
          "A",
          "Show 5 December as the committed finish because reporting a recovery target encourages the team to achieve it."
        ],
        [
          "B",
          "Show the approved baseline, the current forecast and variance, and the conditional recovery scenario with its assumptions and required funding decision."
        ],
        [
          "C",
          "Replace the baseline with 12 December so the report no longer shows an unfavorable variance."
        ],
        [
          "D",
          "Report only the completed work percentage until the recovery funding decision is made."
        ]
      ],
      "correct": [
        "B"
      ],
      "explanation": "The status should distinguish the reference commitment, the current evidence-based forecast, and an option that depends on a future decision. This gives the sponsor an accurate view of performance and the action needed to change it. An unapproved recovery scenario is not yet a commitment, and replacing the baseline to hide variance undermines reporting.",
      "rationales": {
        "A": "The recovery date depends on funding that has not been authorized.",
        "B": "This separates actual status from conditional recovery and identifies the decision needed.",
        "C": "A baseline should not be replaced merely to remove unfavorable variance.",
        "D": "Completed-work percentage alone omits the known finish impact and the decision the sponsor needs to consider."
      },
      "references": [
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.7: monitor and control project performance, pp. 26–28 (PDF pp. 131–133).",
        "PMBOK Guide, Eighth Edition, Guide §2.1.6.8: assess and implement changes, pp. 28–30 (PDF pp. 133–135)."
      ],
      "difficultyReason": "The candidate must distinguish baseline, forecast, and a conditional recovery scenario while retaining decision-useful variance reporting.",
      "instruction": "Select ONE answer."
    }
  ]
}
];
  global.PMP_BANK2_SOURCE = batches;
})(typeof window !== 'undefined' ? window : globalThis);
