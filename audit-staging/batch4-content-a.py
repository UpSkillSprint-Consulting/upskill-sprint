# Reviewed original scenarios: Batch 4, canonical Q76–100 only.
# Additional assumptions are explicit in stems, not silently attributed to the originals.
P=[]
def add(n,stem,options,why,rationales,trap,loc,issues,refs=None):
    assert len(options)==len(rationales)==4
    P.append(dict(number=n,stem=stem,options=options,why=why,optionRationales=rationales,trap=trap,locator=loc,issues=issues,refs=refs or []))

add(76,
"A vending operator loses completed-project reports when Black Belts leave because the reports are stored only on personal drives. Some reports contain restricted customer data. The closure process already verifies benefit claims and assigns ongoing control-plan owners; it has no records-transfer requirement. Which additional closure control best preserves reusable knowledge without making restricted data generally accessible?",
[
"Back up each Belt's personal folder centrally and retain its existing file names, leaving retrieval, access decisions and interpretation to whoever requests the material later.",
"Upload all project files to a company-wide folder with unrestricted access, so any future team can reuse the original customer data without seeking permission.",
"Store only approved financial summaries in a searchable repository and discard the supporting methods, control plans and failed trials once benefit verification is complete.",
"Require an indexed organizational archive with a named custodian, versioned evidence and reusable lessons, plus risk-appropriate access and retention rules verified before records transfer is accepted."
],
"The missing control is organizational custody and usable retrieval of project knowledge, not another benefit-approval gate. An indexed archive should retain the evidence and context needed for reuse, with ownership, access and retention controls appropriate to the information. A backup alone does not ensure findability or interpretability. Restricting sensitive records while sharing suitable lessons preserves both confidentiality and learning; indefinite unrestricted retention is not required.",
[
"A backup reduces loss risk but leaves the stated retrieval, access and knowledge-transfer controls unresolved.",
"Unrestricted access conflicts with the explicit confidentiality constraint; reusability does not require disclosing restricted customer records.",
"Financial summaries do not preserve the methods, unsuccessful approaches and control-plan context needed by later teams.",
"Correct. This establishes organizational custody, usable knowledge transfer and proportionate information controls at closure."
],
"Distinguish backup from a governed knowledge archive: custody, indexing, context and controlled access must survive the original project leader's departure.",
"III.A.2; III.B.1",["Recall-level item and implausible distractors","Missing custody, retrieval and confidentiality constraints","Correct-option length cue"])

add(77,
"A mattress manufacturer is comparing automated stitching equipment with continuing its current process. Year 1 incremental amounts are purchase $350,000, installation $40,000, retraining $15,000 and maintenance $20,000, all cash outflows. A six-week changeover also causes $60,000 of unrecoverable lost contribution margin after avoided variable costs; it is not an additional cash payment and is not counted elsewhere. All amounts fall within the defined first-year horizon. Ignore tax and discounting. What are the total first-year economic cost and the incremental cash-outlay budget, respectively?",
[
"$425,000 and $425,000: exclude the lost contribution from both measures because there is no separate invoice or additional payment for it.",
"$485,000 and $425,000: include lost contribution once as an opportunity cost in the economic comparison, but not as an additional cash payment.",
"$485,000 and $485,000: include lost contribution in both measures because every economic cost must also appear as a separate cash-outlay requirement.",
"$465,000 and $405,000: exclude the maintenance amount from both first-year measures because recurring costs belong only in later years of the evaluation."
],
"Cash outlays total $350,000+$40,000+$15,000+$20,000=$425,000. Adding the $60,000 forgone contribution once gives $485,000 of first-year economic cost relative to continuing the existing process. The opportunity cost affects the economic cash-flow comparison but is not an additional payment to fund. These are first-year figures, not lifetime total cost of ownership or NPV. Later cash flows and their timing would be needed for a full life-cycle appraisal, and the same lost contribution must not also be subtracted from forecast benefits.",
[
"Forgone contribution is relevant to choosing between alternatives even though it is not an additional invoice or payment.",
"Correct. Cash outlays are $425,000; the distinct $60,000 opportunity cost raises the economic total to $485,000 without double counting.",
"This mistakes reduced cash inflow for an additional cash payment. The cash-outlay budget remains $425,000.",
"The stated maintenance payment occurs in Year 1. Recurrence does not justify removing that year's $20,000 from the defined horizon."
],
"Use incremental amounts and a common horizon. Lost revenue is not automatically lost contribution, opportunity cost is not another invoice, and a first-year total is not lifetime TCO.",
"III.C.1–2; II.F.1",["Ambiguous lost-production valuation and double-counting risk","First-year cost mislabeled as full lifetime TCO","Economic cost confused with investment funding","Cross-question reference in explanation","Weak distractors"],["relevant-cash"])

add(78,
"A hearing aid manufacturer has found projects passing DMAIC gates on schedule despite missing evidence: unsigned scope changes, unverified measurement adequacy and untested sustainment arrangements. The MBB must replace a generic 'phase complete' checklist. Projects differ in regulatory exposure and complexity. Which audit design best makes gate decisions evidence-based while allowing justified tailoring?",
[
"Use the same number of mandatory documents for every project and approve a gate when all boxes are checked, even when the submitted evidence does not support the decision.",
"Map phase-specific exit criteria to evidence, reviewers and decision rules; scale depth to risk, document approved exceptions and corrective actions, and check whether the gate process detects recurring omissions.",
"Keep substantive criteria advisory and let each project leader waive unmet requirements privately, provided the reported schedule and budget remain within the original authorization.",
"Apply a detailed financial and schedule review at each gate, then defer measurement, cause-validation and sustainment evidence until final closure to avoid interrupting project momentum."
],
"The observed failure is approval without the evidence needed for that phase, not a shortage of checkboxes. Gate criteria should identify the decision, required evidence, accountable reviewer and treatment of gaps. Risk-based tailoring can be appropriate when the authority and rationale are documented; it is not an undocumented waiver. Review how well the checklist detects failures and update it when experience warrants. No checklist guarantees that every possible failure will be caught.",
[
"Document counts can be satisfied without adequate technical evidence and impose the same burden regardless of project risk.",
"Correct. It connects each gate decision to substantive evidence and accountable handling of gaps, with controlled tailoring and improvement.",
"Private waivers remove the oversight needed to distinguish justified exceptions from unaddressed risks.",
"Delaying technical and sustainment checks until closure allows unsupported downstream decisions to proceed."
],
"A gate verifies decision-relevant evidence, not document volume. Tailoring needs explicit authority and a rationale; checklist completion is not a guarantee of project validity.",
"III.A.1–2",["Cross-question and whole-domain dependence","Unsupported claim checklist would catch every failure","MC selection mislabeled as demonstrated Create-level production","Length-cued distractors"])

add(79,
"A rapidly growing drone-delivery startup has local project lists but no cross-team view of shared specialists, dependencies or release commitments. It can initially support only a lightweight portfolio system. Management requires that new commitments be checked against available capacity and that material risks reach an authorized decision maker. Which initial architecture best meets those requirements and remains scalable?",
[
"Establish a common project register, shared definitions, dependency and capacity checks, and named escalation owners; use proportionate tools and review triggers to expand the system as its needs change.",
"Buy a comprehensive portfolio platform first and let its default workflow define approval authority, capacity measures and escalation thresholds after local teams begin entering commitments.",
"Combine local lists into a central dashboard but leave intake and escalation entirely local, using the dashboard to explain conflicting commitments after release dates have been promised.",
"Apply fixed project-count limits uniformly to all teams and revisit the system annually, without considering differences in specialist effort, dependencies or material changes between reviews."
],
"A lightweight implementation still needs the capabilities that address the stated risks: shared information, comparable measures, capacity-aware intake and timely decision authority. Software can support these controls but cannot define the organization's decision rights by itself. Project counts are not interchangeable units of effort. Establish change triggers and ownership so the system can mature as scale and dependencies evolve, without assuming that either maximum complexity or no governance is appropriate.",
[
"Correct. It installs the required information and decision controls first, with tools and expansion proportionate to actual needs.",
"Default software settings cannot substitute for deliberately assigned authority and locally meaningful capacity measures.",
"Visibility after commitments are made does not provide the required intake check or timely escalation.",
"Uniform counts ignore unequal workload, while annual-only review misses material changes between scheduled assessments."
],
"Scale the implementation, not away the essential controls. A shared dashboard is insufficient unless common definitions, intake decisions and escalation responsibilities are usable.",
"III.B.1; III.B.4–5; III.B.8",["Cross-domain question references","Universal architecture claim without decision constraints","Length-cued and implausible distractors"])

add(80,
"A casket manufacturer's portfolio includes optional equipment investments and mandatory safety upgrades, with different lives, cash-flow timing and uncertain benefits. Finance wants a common evaluation template without forcing a misleading single ranking across all candidates. Which design best supports comparable, forward-looking decisions?",
[
"Use a common horizon and record benefit uncertainty, but allocate historical sunk costs to candidates and rank all projects by payback so previously invested resources remain visible in selection.",
"Model incremental cash flows and risk-adjusted NPV, but convert released staff capacity into cash savings at salary rates even when no payment is avoided and no additional output is realizable.",
"Document incremental cash flows, timing, horizon, relevant life-cycle costs and benefit types; assess uncertainty, exclude sunk costs, separate mandatory constraints and compare feasible portfolios using decision-appropriate financial measures.",
"Document incremental cash flows and mandatory constraints, but treat the highest individual IRR as the best choice for mutually exclusive projects and ignore conflicts with total NPV."
],
"Comparable appraisal requires explicit horizons, timing, relevant incremental costs and credible benefit realization, not identical use of every metric on every decision. Sunk costs do not change with the current choice. Released capacity is not automatically a cash saving. NPV, payback and IRR answer different questions, and ranking conflicts or portfolio constraints require appropriate analysis. Mandatory safety obligations belong in eligibility and compliance decisions rather than being overridden by a purely discretionary financial ranking.",
[
"Sunk costs are not incremental to the current decision, and payback alone omits later cash flows and generally the time value of money.",
"Released time is not a cash saving unless the stated realization conditions support avoided outlays or additional economic benefit.",
"Correct. This specifies the common evidence while allowing the decision model to reflect timing, uncertainty, obligations and portfolio constraints.",
"Individual IRR ranking can conflict with value maximization for mutually exclusive projects; the conflict cannot be dismissed."
],
"Standardize financial evidence and assumptions, not a universal metric rule. Distinguish cash realization, incremental value, mandatory obligations and feasible portfolio choices.",
"III.C.1–2; II.F.1",["Universal requirement to use both NPV and payback","Repeated wording in keyed option","Whole-domain and numbered-question references","Vague savings realization and financial-comparison assumptions","Implausible distractors"],["relevant-cash"])

add(81,
"A hospital has funding for 50 Green Belt training places. The proposed list uses seniority alone, while departments differ in performance gaps, existing skills and opportunities to apply learning. No assessment has determined whether the gaps require training or changes to the work system. Which first step best supports a defensible allocation of these places?",
[
"Compare required and demonstrated competencies, distinguish skill gaps from work-system barriers, and assess sponsorship and application opportunities before using transparent criteria to select the initial cohort.",
"Select the 50 longest-serving staff first, then use their course evaluations to infer which departments had the greatest unmet capability needs before training began.",
"Rank departments only by their recent defect totals and assign places proportionally, without checking differences in exposure, existing competence or opportunities to apply the training.",
"Accept each manager's preferred nominees and use a common post-course examination, treating the examination as a substitute for assessing needs before allocating the training places."
],
"The allocation should follow a comparison of needed and demonstrated capability and an assessment of whether training can address the gap. Work-system barriers may require a non-training intervention. Sponsorship and realistic application opportunities affect how an initial cohort can use new skills. Seniority, raw defect totals and nominations can provide context but are not sufficient selection evidence. A later examination does not retrospectively validate the original allocation decision.",
[
"Correct. It links selection to actual capability requirements, the nature of the gap and conditions for applying learning.",
"Course reactions from a seniority-selected group cannot establish the original distribution of unmet training needs.",
"Unadjusted defect totals may reflect workload or system conditions rather than a trainable skill gap.",
"A common examination assesses later performance; it does not determine who most needed the initial investment."
],
"Needs assessment asks whether training is the right response as well as who needs it. Nomination, tenure and performance totals are inputs, not stand-alone selection criteria.",
"IV.A",["Recall-level item","Training assumed to be the solution","Missing transparent selection and application constraints","Weak distractors"],["cdc-needs"])

add(82,
"A logistics company's observed-work assessment confirms that dispatch supervisors can map processes but often choose the wrong hypothesis test and interpret a nonsignificant result as proof of no effect. Their roles require using test results in improvement decisions. Training time is limited, and prerequisite numeracy varies. Which curriculum response most directly addresses the demonstrated gap?",
[
"Move directly to an advanced DOE module using statistical software defaults, with a final attendance check to confirm that each supervisor has received the same technical exposure.",
"Repeat the process-mapping module for the whole cohort and add a brief glossary of statistical terms, using self-rated confidence to determine whether further instruction is needed.",
"Give every supervisor the unchanged full curriculum and assess only aggregate course scores, allowing strength in process mapping to compensate for incorrect inferential decisions.",
"Check prerequisite skills, provide targeted bridges, and practice test selection, assumptions and interpretation on dispatch cases, with feedback and objective checks of the required decisions."
],
"The demonstrated deficit concerns selecting and interpreting inferential procedures, not process mapping or attendance. Prerequisite checks allow targeted support without assuming that everyone needs identical remediation. Job-relevant decisions, practice and feedback should be aligned with the required competence. A nonsignificant result alone does not establish absence of an effect; uncertainty, power and practical relevance still matter. Assessment should verify the specific inference skills rather than letting unrelated strengths hide them.",
[
"Advanced software exposure without prerequisites or decision checks does not correct the demonstrated selection and interpretation errors.",
"Repeating an already demonstrated strength and measuring confidence does not verify improvement in inferential decisions.",
"Aggregate scores can conceal failure on the very competency the needs assessment identified as essential.",
"Correct. It targets the demonstrated skill gap with appropriate foundations, relevant practice, feedback and aligned assessment."
],
"Map a demonstrated gap to a specific objective, practice task and assessment. Failure to reject a null hypothesis is not proof that there is no meaningful effect.",
"IV.A; IV.B",["Simple targeted-training recall","Missing prerequisite and competency-assessment detail","Weak distractors"],["cdc-qts"])

add(83,
"A retail chain selected a Green Belt cohort using only self-rated statistical proficiency. Ratings were high, but performance on course exercises was poor. The survey and exercise requirements have not yet been compared, and delivery conditions were not evaluated. Which revision to the next needs assessment is most defensible?",
[
"Retain self-ratings as the sole skill measure but ask employees to explain their confidence, treating longer explanations as evidence of stronger statistical competence.",
"Replace self-ratings with managers' unaided ratings, treating those judgments as objective measurements that need no common criteria or comparison with direct performance.",
"Conclude that overconfidence caused the poor results and lower all self-ratings by the same amount, without checking the assessment alignment or training-delivery conditions.",
"Triangulate self-ratings with role-aligned performance tasks and rubric-based work review, and examine assessment and delivery fit before attributing the discrepancy to a particular cause."
],
"The discrepancy shows that self-ratings alone did not provide an adequate basis for this selection decision. It does not establish overconfidence as the unique cause: construct mismatch, prerequisites or delivery conditions are alternatives. Direct role-aligned performance and calibrated work review provide complementary evidence. Manager opinion is another judgment source, not automatically an objective test. Retain useful self-report information while checking what each measure actually assesses.",
[
"The length of a confidence explanation does not verify the statistical decisions the role requires.",
"Unstructured managerial ratings can introduce different biases and do not become objective merely by changing the rater.",
"A uniform correction assumes an unverified cause and magnitude rather than investigating the discrepancy.",
"Correct. It adds direct, aligned evidence and checks alternative explanations without treating one source as infallible."
],
"A disagreement between confidence and performance is evidence to investigate, not proof of a single bias. Manager ratings also need criteria and calibration.",
"IV.A",["Overconfidence asserted as proven cause","Manager evaluation incorrectly grouped as inherently objective","Weak distractors"],["cdc-needs"])

add(84,
"A manufacturer still uses the training-needs assessment from its deployment launch three years ago. New product lines, revised processes and staff turnover have changed several roles. Some capabilities remain relevant, but no owner checks whether assessed requirements still match current work. Which maintenance process best closes this gap?",
[
"Repeat the original survey on a fixed annual date using unchanged role requirements, so year-to-year comparisons remain consistent despite changes in the work.",
"Replace the entire curriculum immediately because the assessment is three years old, without checking which competencies or existing evidence are still applicable.",
"Reassess needs only when examination pass rates fall, because stable pass rates are sufficient evidence that the curriculum covers all current role requirements.",
"Assign an owner to scheduled and material-change reviews of role requirements and capability evidence, retaining valid findings and updating priorities when work or workforce needs change."
],
"The issue is uncontrolled relevance, not age alone. Review triggers should include material role, process or workforce changes, alongside a proportionate review schedule. Compare current requirements with current evidence, preserve what remains valid and document changed priorities. An examination can remain easy to pass while measuring obsolete requirements. Repeating an unchanged instrument or discarding the entire curriculum would not provide a reasoned assessment of the changed needs.",
[
"A consistent questionnaire can repeatedly measure the wrong requirements if it is not updated for changed roles.",
"Elapsed time alone does not establish that every part of the curriculum or assessment is invalid.",
"Pass rates only address what the examination tests; they do not verify coverage of newly required competencies.",
"Correct. It provides accountable, change-sensitive maintenance while preserving evidence that remains applicable."
],
"Refresh the requirement-to-capability comparison when material conditions change. Assessment age is a review signal, not proof that every previous finding is obsolete.",
"IV.A; IV.B",["Cross-question principle dependence","Age treated as automatic invalidity","Missing review accountability and triggers","Weak distractors"],["cdc-needs"])

add(85,
"An employer's internal Black Belt program specifies objectives for interpreting analyses and leading an improvement project. Its certificate is intended to attest to those competencies, but the plan contains only content, attendance rules and dates. Before delivery, which assessment design best supports that intended claim?",
[
"Award the competency certificate for attendance and a satisfaction survey, then leave later supervisors to decide informally whether the employee can perform the stated tasks.",
"Map objectives to aligned knowledge and performance evidence, set defensible criteria and calibrated reviews, and provide feedback and reassessment before making the internal competency-certification decision.",
"Use a difficult multiple-choice test as the sole evidence for both statistical interpretation and observed project leadership, without checking its coverage of the stated performance objectives.",
"Let each instructor choose a passing threshold after viewing cohort scores and certify a fixed percentage of participants, regardless of whether they meet the required competencies."
],
"Assessment should support the specific claim the employer intends to make. Interpretation can be assessed through suitable problems, while demonstrated leadership requires appropriate performance evidence. Criteria, coverage and reviewer consistency should be planned before the decision, with feedback and an appropriate reassessment route. Attendance, satisfaction or a post hoc pass quota do not establish competence. This case concerns an employer's internal credential, not ASQ certification requirements.",
[
"Attendance and satisfaction do not establish the statistical and leadership capabilities claimed by the certificate.",
"Correct. It aligns evidence and criteria to the intended competency claim and addresses consistency and remediation.",
"A difficult test is not necessarily a valid measure of every objective, particularly observed leadership performance.",
"Post hoc thresholds and pass quotas are not criterion-based evidence that individuals meet the required standard."
],
"Specify what the credential claims, then align assessments and standards to that claim. Course completion, proficiency and demonstrated change in learning are different conclusions.",
"IV.B; IV.D",["Internal credential confused with general certification","Assessment presence treated as sufficient without validity or criteria","Cross-question explanation reference","Weak distractors"],["cdc-qts","cdc-eval"])

add(86,
"An insurance company's review of unsuccessful improvement projects assigns each project one primary failure category, as shown in the table. These retrospective classifications are not experimental proof of cause. The current Green Belt course allocates 90% of time to statistical tools and 10% to stakeholder work. Technical minimum competencies must still be met. Which response to this evidence is most defensible?",
[
"Set the next course's instructional percentages equal to the failure-category percentages, treating the retrospective distribution as the optimal allocation without checking gaps or learning outcomes.",
"Validate the attributed skill and work-system gaps, then pilot more applied stakeholder practice while preserving technical competencies; assess learning, transfer and project outcomes before broader reallocation.",
"Retain the 90/10 allocation and lower the technical passing standard, so more participants finish training even though the identified stakeholder-performance concern remains unaddressed.",
"Remove all statistical instruction and move its time to stakeholder engagement, assuming the largest failure category makes the other required competencies unnecessary for future projects."
],
"The table is a prioritization signal for further needs analysis and a targeted pilot, not a causal estimate or an instructional optimization model. Failure categories can reflect organizational barriers as well as trainable skills. Validate the interpretation, preserve required technical competence and evaluate a revised approach using aligned learning and workplace measures. The 70% attribution does not imply that 70% of teaching time is optimal, and the categories do not establish a universal curriculum split.",
[
"Failure attribution shares and optimal instructional time are different quantities; directly copying the percentages lacks a justified model.",
"Correct. It investigates the signal and tests a targeted change without sacrificing required technical competence or asserting causation.",
"Lowering a passing standard neither addresses the stakeholder gap nor preserves the defined technical requirement.",
"The largest retrospective category does not eliminate the need for statistical competence or prove that training alone resolves the failures."
],
"Do not convert retrospective failure percentages directly into curriculum weights. Verify the gap and pilot the response while preserving required competencies.",
"IV.A; IV.B; IV.D",["Failure attribution treated as established root cause","Percentages lack a defined denominator and decision limits","No protection for required technical competencies","Table readability and caption missing","Weak distractors"],["cdc-qts"])

add(87,
"A DFSS course on QFD and robust design assumes that learners can interpret variation, use basic statistical reasoning and describe customer requirements. Several new entrants struggle with those tasks; no prerequisite skills or bridging route were specified. Employees may have acquired the skills through different credentials or work experience. Which admission-and-support policy best addresses the gap?",
[
"Define and assess the entry competencies, accept credible equivalent evidence, and offer targeted bridging before advanced work rather than using one credential as the only route.",
"Require an existing Green Belt certificate as the sole entry condition and waive prerequisite assessment, because the certificate necessarily establishes every skill assumed by this particular course.",
"Keep admission unrestricted and slow every advanced session to repeat all foundations, without checking who needs support or whether the advanced learning objectives can still be met.",
"Admit only employees with prior DFSS job titles and treat that experience label as sufficient evidence, even when they cannot perform the specified prerequisite tasks."
],
"The missing element is an explicit match between the course's assumed competencies and entrants' demonstrated readiness, together with a way to close gaps. Relevant experience or another credential can provide equivalent evidence, but neither a title nor a Green Belt certificate automatically covers every prerequisite of this course. DFSS does not universally require a particular DMAIC credential. Targeted bridges preserve access and rigor without automatically abandoning the advanced objectives.",
[
"Correct. It verifies the actual prerequisite skills and offers an equitable route to acquire missing foundations.",
"The stated course prerequisites must be verified; one certificate is not automatically sufficient or the only valid evidence.",
"Unassessed repetition can consume the advanced course without efficiently addressing individual prerequisite gaps.",
"A job title does not override direct evidence that the required entry competencies have not been demonstrated."
],
"Prerequisites should describe what learners must be able to do. Accept equivalent evidence and support missing foundations rather than imposing an unsupported universal credential rule.",
"IV.B; IV.C.2",["DFSS implied to universally require DMAIC/Green Belt background","Missing competency-based alternatives and support","Weak distractors"],["cdc-qts"])
