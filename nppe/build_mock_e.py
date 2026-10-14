#!/usr/bin/env python3
"""Build original NPPE Set 3, Mock E. Does not read or copy Mock D items into the bank."""
import json, re, pathlib
ROOT = pathlib.Path('/tmp/upskill-sprint')
items = []

def add(code, diff, stem, correct, wrongs, why):
    items.append({
        'code': code, 'diff': diff, 'stem': stem,
        'correct': correct, 'wrongs': wrongs, 'why': why
    })

# Each wrong is (text, rebuttal). The correct choice must contain the decision.
# --- I Professionalism, scored ---
add('I.1','medium',
 'A trade contractor tells a homeowner, "My crew are the professionals. A licence is only a card the association sells." The homeowner is about to hire the crew to design a retaining wall. What is the best correction?',
 'Design of that wall is professional engineering. A trade ticket is not a licence, and a profession is more than skilled paid work.',
 [('Anyone paid for skilled work is a professional in the same sense as a licensee.','Payment for skill does not create a profession or a licence.'),
  ('The association only sells an optional card, so the wall needs no licensed designer.','The card is not optional where the Act reserves the practice.'),
  ('The crew may design the wall if the homeowner signs a waiver of the licence.','A private waiver does not replace a licence the Act requires.')],
 'A profession combines special knowledge used in the public interest, a code, and accountability to the regulator. Calling a crew professional does not authorize reserved practice.')

add('I.1','medium',
 'A council member proposes that the government write the technical standards and hear all complaints, so members can stop doing that work. What is the main problem with the proposal?',
 'Self-regulation continues only while members set and apply the standards. Giving that work away gives up the privilege.',
 [('Members are forbidden to write standards. Only government lawyers may do it.','Members are how a self-regulating profession sets its standards.'),
  ('Complaint hearings already belong to the criminal courts, so council committees are unlawful.','Discipline is a regulatory process, not a criminal prosecution.'),
  ('Once a profession is recognized, the statute cannot be changed and the privilege cannot be lost.','The privilege depends on the statute and on how members use it.')],
 'Staff can administer the body. They do not replace the members\' role in standards and discipline. The privilege is not permanent if members abandon it.')

add('I.2','hard',
 'A licensee is writing a school-site report. The developer\'s lawyer asks her to leave out a solvent plume that reaches the playground, because a partner in the project "already knows." Children will use the yard. What is the most appropriate action?',
 'Keep the plume in the report others will rely on. Hiding it from the users of the site breaks her duty to them.',
 [('Leave it out. Her only duty is to the client who pays, and one partner already knows.','The people who will use the yard are part of her duty, not only the paying client.'),
  ('Leave it out if the lawyer says that hiding the plume is not a crime.','A lawful-looking omission can still breach the duty to be truthful about a hazard.'),
  ('Tell only the partner, and leave the report that the school will use silent.','A private aside does not correct a report others will rely on.')],
 'Public welfare comes before a request to conceal a contamination path. Knowledge by one partner does not inform the school community.')

add('I.2','hard',
 'A licensee asks a summer student to tell her if any borehole log "looks odd." She signs the foundation summary without reading the logs. A shear zone in two logs is missed, and a wall moves. What is the best judgment?',
 'She is responsible. Asking a student for a glance, and not reading the logs she relied on, was not a review.',
 [('Only the student is responsible, because the student was the person who saw the logs.','The student did not accept professional responsibility. She signed the summary.'),
  ('No one is responsible. A summer student is not allowed to open a borehole file.','The fault is her decision to sign work she did not review.'),
  ('She is responsible only if the student was already licensed.','Her signature, not the student\'s status, is what she failed to support with a review.')],
 'Signing the summary was an acceptance of the work. Delegation of a glance is not that acceptance.')

add('I.3','easy',
 'Which body grants a licence to practise professional engineering or professional geoscience in a Canadian province?',
 'The provincial or territorial regulator, under that jurisdiction\'s Act.',
 [('Engineers Canada, which issues the one licence valid in every province.','Engineers Canada is a national organization. It does not license individuals.'),
  ('The university that granted the degree, for as long as the degree remains valid.','A degree is not a licence to practise.'),
  ('A federal companies registry, for work anywhere in Canada.','There is no federal licence that replaces provincial and territorial regulators.')],
 'Licensing is provincial and territorial. A degree, a national organization, or a companies registry does not grant the right to practise.')

add('I.3','hard',
 'A licensee registered only in Ontario agrees to seal the design of a dam in British Columbia next month. She says an Ontario licence covers British Columbia because both regulators are Canadian. What is the best judgment?',
 'She needs authority from the British Columbia regulator before she practises or seals that dam there.',
 [('She is right. Any Canadian licence is a national licence for dams.','There is no single national dam licence.'),
  ('She may seal the dam if the owner writes that the Ontario licence is accepted.','An owner\'s letter does not grant a licence.'),
  ('She may seal it if she finishes the drawings in Ontario and mails them to British Columbia.','The location of the desk does not move the project out of British Columbia\'s Act.')],
 'Practice and sealing follow the law of the place of the project. Another province\'s licence is not authority there until that regulator says so.')

add('I.3','hard',
 'Before a two-week trip, a licensee gives a partner the password to her digital seal "so the tender set can go out." The partner seals sheets she has not seen. What is wrong?',
 'The seal is hers alone. She must not let someone else apply it to work she has not reviewed and accepted.',
 [('A password may be shared inside a partnership, because the firm owns the seal.','The firm does not own her seal. The seal is her personal mark.'),
  ('A digital seal may be applied by any partner. Only a rubber stamp is personal.','The form of the seal does not make it transferable.'),
  ('Nothing is wrong if the partner is also licensed, even though she has not seen the sheets.','Another licence does not authorize use of her seal on work she has not accepted.')],
 'Sharing the password so someone else can seal unseen sheets is a misuse of the seal.')

add('I.4','hard',
 'A licensee is comparing two waste-rock piles. The cheaper pile will generate acid for decades after closure. The costlier pile can be covered in a way she believes the operator can maintain. The owner says, "Show only the cheap pile. Closure is someone else\'s problem." What is the most appropriate action?',
 'Show both piles, including the long-term acid risk, so the owner is not choosing from an incomplete comparison.',
 [('Show only the cheap pile. Her duty ends when production stops.','The consequences after closure are part of the comparison she was asked to make.'),
  ('Show only the cheap pile if the owner waives future environmental claims.','A waiver does not justify hiding a risk she has already identified.'),
  ('Do not mention acid generation. Long-term effect is a political preference, not a professional concern.','A known long-term harm is an engineering and geoscience fact, not a preference.')],
 'Sustainable practice here means she does not conceal a decades-long impact in order to make the cheap pile look complete.')

# --- II Ethics ---
add('II.1','medium',
 'Counsel tells a licensee that leaving a known crack out of a bridge report would not be a crime on these facts. She is about to treat that advice as the end of the matter. What is the best correction?',
 'Not being a crime does not end the question. She can still have a duty not to hide a defect others will rely on.',
 [('Counsel is right. If conduct is not a crime, the code cannot apply.','The code can demand more than the criminal law.'),
  ('The code applies only after a criminal conviction.','A conviction is not a precondition for a professional duty.'),
  ('A legal opinion replaces the code when the client paid for it.','Advice about criminal law does not repeal the code.')],
 'Lawful is not the same word as ethical. The report still has to be honest about a defect the owner and the public may rely on.')

add('II.2','hard',
 'A community centre will lose its grant unless the filed soil report says "no metals above the criterion." Two samples are above it. A colleague says changing those two numbers does more good than harm. What is the best judgment?',
 'She must not change the results. A useful project does not justify a false report.',
 [('She should change the numbers. The centre\'s benefit outweighs two samples.','A good purpose is not a licence to falsify data others will use.'),
  ('She should change the numbers if the grant officer will not see the laboratory sheets.','Hiding the sheets makes the false report worse, not acceptable.'),
  ('She may change the numbers. The code always prefers the greatest total benefit.','The code does not authorize a lie because the outcome is popular.')],
 'Honesty in the report is the duty. The funding consequence is not a reason to alter the samples.')

add('II.1','hard',
 'A Canadian licensee is told by a client abroad to leave a known foundation defect out of the local filing. The local statute does not require that line. The building will be occupied. What is the best response?',
 'She does not file a report she knows is misleading. Silence in a local statute does not cancel her duty.',
 [('She omits the defect. A Canadian code has no force outside Canada.','Her obligation as a licensee travels with her. A foreign silence is not permission to mislead.'),
  ('She omits the defect if the local form has no box for it.','The shape of a form does not justify a report she knows is incomplete on a safety point.'),
  ('She omits the defect. A licensee must follow every local custom, including concealment.','She complies with local law. She does not adopt concealment.')],
 'She can meet local filing rules without signing a document that hides a defect in an occupied building.')

add('II.2','medium',
 'A licensee missed a required concrete inspection. A supervisor says, "Date the report yesterday. Everyone does that when the pour runs late." She refuses because she would not accept every licensee doing the same. Which reading fits?',
 'She is refusing a private exception she could not accept as a rule for every licensee.',
 [('She is thinking only of a lawsuit, and lawsuit risk is the whole ethical question.','Her reason is whether the practice could be universal, not only whether she might be sued.'),
  ('She is wrong. A common schedule practice is ethical because it is common.','Common use does not make a backdated inspection honest.'),
  ('She should backdate it. The concrete was placed, so the date on the report does not matter.','The report states that she inspected. A true pour is not a true inspection.')],
 'Backdating would state an inspection that did not happen. She is right to reject a rule she could not offer to every licensee.')

add('II.2','hard',
 'A manager asks a licensee to leave a known unguarded nip in service so one operator can hold a production quota. The operator has not been told. The manager says the quota helps the whole plant. What is the best judgment?',
 'She does not leave a known hazard on one person so a production number can be met.',
 [('She agrees. The plant\'s benefit outweighs an untold risk to one operator.','A quota does not justify leaving a person in a hazard that has been hidden from them.'),
  ('She agrees if the quota is written into the manager\'s employment contract.','An employment target does not change the hazard.'),
  ('She agrees. The code measures only the plant\'s output.','The code does not measure safety by output alone.')],
 'She may look for a way to meet the quota without the nip. She may not trade the operator\'s safety for the number.')

add('II.3','easy',
 'An employer handbook says commercial instructions prevail when they conflict with the regulator\'s code of ethics. Which statement is correct?',
 'The code, made under the Act, governs her professional conduct. The handbook cannot cancel it.',
 [('The handbook prevails because the employer pays her salary.','Pay does not put a private handbook above the code.'),
  ('The handbook prevails if human resources approved it.','Internal approval does not amend the Act.'),
  ('There is no code until the employer copies one into the handbook.','The code exists under the regulator\'s Act, not because the employer published it.')],
 'Employment terms can add rules. They cannot instruct her to abandon the code.')

add('II.3','hard',
 'A licensee holds licences in two provinces. The people at risk are in Province A, and Province A\'s code requires a report of this hazard. Province B\'s wording is looser. She wants to rely on Province B and stay silent. What is the best advice?',
 'On this project she follows Province A\'s code, because that is where she is practising, and she reports as that code requires.',
 [('She may choose the looser code. Two licences entitle her to the easier text.','She does not shop the codes for the easier duty.'),
  ('Only one national wording exists, so the difference cannot matter.','Provincial codes share a core and still differ. The difference matters here.'),
  ('She follows the client\'s policy and ignores both codes.','A client policy does not select the code.')],
 'The code of the province where the work and the risk are located is the one she applies to this assignment.')

add('II.3','medium',
 'A proposal she is asked to sign says she "designed the hospital mechanical systems." She coordinated the consultants. A mechanical licensee designed those systems. The principal calls the sentence ordinary marketing. What is the most appropriate action?',
 'Correct the sentence before she signs. She must not claim a design she did not do.',
 [('Sign it. Marketing language is not a professional statement.','A signed proposal is a professional statement.'),
  ('Sign it unless the mechanical licensee objects within one day.','Her own signature does not wait on someone else\'s silence.'),
  ('Sign it. Coordination and design are the same thing.','Coordinating consultants is not designing their systems.')],
 'The proposal must describe her role accurately. Marketing is not a licence to claim another discipline\'s design.')

add('II.3','hard',
 'A mining client asks a structural licensee to seal a mine-ventilation review. She has never done that work. A ventilation specialist in another office can take it. What is the most appropriate action?',
 'She does not seal it. She leaves it with a licensee who is competent and who will be responsible for the review.',
 [('She seals it. Any P.Eng. may seal every discipline.','A licence is not competence in every field.'),
  ('She seals it after reading one chapter the night before the issue.','A chapter is not competence for a mine-ventilation review.'),
  ('She seals it because the client accepted a structural resume.','The client\'s acceptance does not create competence she does not have.')],
 'The specialist is available. Taking the seal herself would be practice outside her competence.')

add('II.3','hard',
 'A licensee learns a colleague is sealing municipal bridge drawings while his licence is suspended. He calls it a personnel matter. The drawings are about to be issued. What does she do?',
 'She does not stay silent while suspended practice is about to be relied on. She uses a channel that can stop the issue, including the regulator if it will still go out.',
 [('She says nothing. Reporting another member is always unprofessional.','Staying silent while the public is about to rely on a suspended member is the failure.'),
  ('She calls the police first. Practising while suspended is always a crime before it is a regulatory matter.','It is a regulatory breach. It is not automatically a criminal case she must file first.'),
  ('She seals his drawings herself without reading them, so the issue date is kept.','A second unread seal does not cure a suspension.')],
 'Personnel process may run as well. It does not replace a warning that can stop unlicensed issue of a public bridge.')

add('II.3','easy',
 'Which item is not a duty under the professional codes?',
 'Putting the employer\'s profit ahead of the safety of people.',
 [('Working only within her competence.','That is a core duty.'),
  ('Being truthful in documents others will use.','That is a core duty.'),
  ('Keeping her knowledge current for the work she accepts.','That is a core duty.')],
 'The codes put the public first. Profit is a proper business interest. It is not a duty that outranks safety.')

add('II.4','hard',
 'A licensee is choosing the tester for a public project. She owns a substantial share of the one laboratory she plans to name. She believes it is capable, and she plans to say nothing. What is the most appropriate action?',
 'Tell the client about the ownership before the choice is made, and do not be the person who makes that choice.',
 [('Name the laboratory and say nothing. Her belief that it is capable removes the conflict.','A sincere belief does not erase an ownership conflict.'),
  ('Name it. Disclosure is required only if she owns more than half.','A substantial interest is enough to disclose. Half is not a universal cutoff.'),
  ('Name it if the price is competitive. A low price cancels a conflict.','Price does not cancel an undisclosed interest.')],
 'She can recommend criteria. She should not be the undisclosed owner and the person who selects the winner.')

add('II.4','hard',
 'After hours, a licensee uses her employer\'s software licence and the employer\'s client list to quote that same client a lower price. She says evening hours are her own. What is the best judgment?',
 'She must not use the employer\'s confidential list or its software licence to compete with the employer.',
 [('Evening work is outside the code, so the list and the software are hers to use.','The hour does not transfer the employer\'s confidential list or its licence.'),
  ('She may do it on her own computer, even though the list and the licence are the employer\'s.','The computer does not change whose list and whose licence she is using.'),
  ('She may do it. The client, not the employer, owns every relationship.','A client relationship does not authorize use of the employer\'s confidential pricing tools.')],
 'Her own time does not include the employer\'s confidential commercial information or a licence she is not allowed to use that way.')

add('II.4','hard',
 'An owner\'s representative, who is not licensed, deletes a hold point from her inspection plan and tells her to sign the completion certificate. The hold point was never performed. What is the most appropriate action?',
 'She refuses to sign a certificate that treats the missed hold point as done.',
 [('She signs. The representative may erase a hold point, and her signature only copies his instruction.','His instruction does not make an unperformed hold point complete.'),
  ('She signs because the project is late.','Schedule pressure does not complete an inspection.'),
  ('She signs and keeps a private note. The private note makes the certificate true.','A private note does not correct a certificate other people will rely on.')],
 'The certificate says the hold point was met. She cannot sign that statement.')

add('II.4','hard',
 'Her water tests exceed a standard at a connection that will serve homes next week. She has reported it twice inside the company. Nothing has changed. What is the most appropriate action?',
 'Report the facts to the authority that can stop the connection.',
 [('Stop. Two internal reports end her duty, whatever happens next.','Internal silence does not end the duty while homes are about to be connected.'),
  ('Wait until someone is ill. A report before injury is premature.','She does not wait for illness when the connection is imminent.'),
  ('Publish the laboratory sheets on social media before telling the authority.','The authority that can act is the report. A public post is not the first controlled step.')],
 'She has the results and the dates. The next step is the body that can keep the connection from proceeding on those facts.')

add('II.4','hard',
 'Readings she takes show a dam moving past the threshold in her report. The contract says she will not disclose site data. The owner forbids her to tell the downstream authority. People live below the dam. What is the most appropriate action?',
 'Tell the authority that can act. The confidentiality clause does not require her to hide this risk.',
 [('Stay silent. A confidentiality clause outranks people living downstream.','Confidentiality yields when silence leaves people exposed to a danger she has measured.'),
  ('Stay silent until the contract expires.','The movement is happening now. Expiry is not a safety plan.'),
  ('Tell only the owner\'s insurer, and no one who can warn the residents.','An insurer is not a substitute for the authority that can act for the people at risk.')],
 'She discloses what is needed to address the danger. She does not publish the rest of the owner\'s confidential file.')

add('II.4','medium',
 'A hospital asks her to review a mechanical design. The original engineer has left the country and does not answer. She finds no immediate danger, and she has comments that should be settled before tender. What is the most appropriate action?',
 'Do the review, label it as a review, record that she tried to reach the original engineer, and state the comments fairly.',
 [('Refuse. One licensee must never comment on another licensee\'s design.','A review is proper work. A ban on comment is not the rule.'),
  ('Do the review and do not record the attempt to give notice.','She records the attempt. She does not pretend notice was impossible without trying.'),
  ('Call the original engineer incompetent so the hospital will change firms.','Disagreement is not a reason to attack the other engineer.')],
 'Notice was attempted. The review can proceed if it is fair, identified as a review, and limited to the comments.')

add('II.4','hard',
 'A vendor asks her to seal an anchor calculation because the vendor is on a prequalified list. She has not checked the calculation against this building. What is the most appropriate action?',
 'She does not seal it until she has checked it and is willing to be responsible for it. The list is not a review.',
 [('Seal it. Prequalification means the calculation is already her work.','A vendor list does not transfer the calculation to her.'),
  ('Seal it if the vendor\'s insurer names the owner.','Insurance is not a technical review.'),
  ('Seal it after changing the title block so the page looks like hers.','A new title block without a review is a false claim of authorship.')],
 'She may seal work she has reviewed and accepts. The prequalified status does not do that review.')

add('II.4','hard',
 'Abroad, a local code allows a lower factor of safety for an occupied stand than she is willing to accept. The client tells her to seal that lower number because it is lawful there. She believes the stand would be unsafe. What is the most appropriate action?',
 'She does not seal a design she believes is unsafe. A lower lawful number does not force her seal.',
 [('She must seal it. A licensee adopts every local number, including one she believes will fail.','She obeys local law. She does not seal work she believes will fail.'),
  ('She seals it if the client signs a waiver.','A waiver does not make an unsafe stand acceptable for her seal.'),
  ('She seals it. Her professional duty ends when another country\'s code is more permissive.','A more permissive number does not end her judgment about safety.')],
 'If she cannot accept the lower figure, she says so and does not seal it. She does not pretend the local permission is her own conclusion.')

# --- III Professional practice ---
add('III.1','medium',
 'Her proposal limits her to a visual review of an arena roof from the floor. It says she will not analyze the members. The owner later tells a lender she guaranteed the roof. What is the best judgment?',
 'The accepted scope is a visual review, not a guarantee. She corrects the owner before the lender relies on that claim.',
 [('She guaranteed the roof. Any visit by a licensee is a warranty of the structure.','A defined visual review is not a warranty.'),
  ('She has no duty to correct the owner. A lender is a stranger to her proposal.','She knows the owner is misstating her work to someone who will rely on it.'),
  ('The guarantee arises because she sent an invoice. Payment turns a limited review into a warranty.','An invoice does not enlarge the scope she accepted.')],
 'She is responsible for the review she accepted. She is not responsible for a guarantee she did not give, and she does not leave the misstatement standing.')

add('III.1','hard',
 'A geoscientist logged the rock under a set of piles. The structural engineer will seal the steel schedule. The owner asks the geoscientist to seal that schedule as well, "so the set has one seal." What is the most appropriate action?',
 'She seals the geoscience she accepts. She does not seal the structural schedule.',
 [('She seals the schedule. One seal on a set is a professional preference the owner may demand.','The owner cannot require her to seal another discipline.'),
  ('She seals the schedule because she stood on the site. Presence is the same as structural design.','Being on site is not design of the steel.'),
  ('She seals it if the structural engineer is busy. A busy colleague transfers the seal.','Another person\'s schedule does not transfer their work to her seal.')],
 'Each licensee seals the work that person prepared or supervised and accepts. The rock log is hers. The steel schedule is not.')

add('III.1','hard',
 'She copies an ore strength from a supplier brochure into a heap-leach design. The brochure is for a different ore. She does not notice. The pad settles. She says the brochure is responsible, not her. What is the best judgment?',
 'She is responsible for the value she used. A brochure she did not check against this ore is not a defence.',
 [('The brochure author is the engineer of record for every design that copies it.','A supplier brochure is not the engineer of record for her pad.'),
  ('She is responsible only if the brochure promised this ore.','She chose the number. The brochure\'s silence is not her defence.'),
  ('She is not responsible. Published trade numbers may be used without checking the material.','A number for a different ore is not a checked input.')],
 'Inputs she adopts are hers. The settlement does not move that responsibility to the printer of the brochure.')

add('III.1','hard',
 'She is in another city. She tells an engineer-in-training to phone before any tunnel-support change. He phones, describes the rock, and she approves lighter support without the photos or the mapping. The support fails. Who is professionally responsible for that approval?',
 'She is. She approved the change on a description she did not check.',
 [('Only the trainee, because he was underground and she was not.','She gave the approval. Distance does not move it to him.'),
  ('No one. A phone call cannot create professional responsibility.','The call is how she chose to approve the work. It does.'),
  ('Only the contractor, because the contractor bought the support.','Buying the support is not the professional approval she gave.')],
 'The trainee followed her instruction to call. The unchecked approval was hers.')

add('III.1','medium',
 'A town will set building elevations from her flood study. Before she issues it, which description of her care is the best?',
 'The care a competent peer would take before issuing that study, including the data and the limits of the method.',
 [('Any effort is enough if the file says the study is in progress.','An unfinished study is not ready for the town to adopt.'),
  ('Due diligence applies only to consultants, not to an employee of the town.','Employment does not remove the care required of the person who issues the study.'),
  ('The study must guarantee that no flood will ever exceed the line she draws.','Care is not a promise that nature will never exceed a stated event.')],
 'Issuing the study means she has finished the checks a competent peer would require, and she has stated the limits.')

add('III.2','hard',
 'While employed, she learns from her employer\'s file that a city is about to score a landfill-gas proposal. She bids through a company she owns and uses the city\'s unpublished scoring notes. What is the best judgment?',
 'She must not use the employer\'s confidential scoring notes to bid against the process she learned from inside.',
 [('She may bid. Information learned at work is hers to use the same day.','Unpublished scoring notes are not hers to carry into her own bid.'),
  ('She may bid if her company has a separate bank account.','A bank account does not clean the use of the notes.'),
  ('She may bid because the city, not the employer, wrote the notes.','How she obtained the notes, through the employer\'s file, is the problem.')],
 'She can compete later on public information. She cannot use the confidential notes.')

add('III.2','medium',
 'After she resigns, a former client asks her to keep working. Her new firm does not have the file. She still has the old firm\'s unreleased rate sheets on a personal drive, and she plans to use them to set the new price. What is the most appropriate action?',
 'She does not use the old firm\'s rate sheets. A new engagement does not transfer that confidential pricing.',
 [('She may use the sheets. Resignation makes the old firm\'s pricing hers.','Resignation does not assign the firm\'s confidential rates.'),
  ('She may use the sheets if the client asks her to "match the old price."','The client\'s wish does not authorize use of the firm\'s rate file.'),
  ('She may use the sheets because no safety issue is involved, and confidentiality applies only to hazards.','Commercial confidentiality is still a duty. It is not limited to hazards.')],
 'Whether the client and the old firm can transfer the technical file is their issue. The rate sheets are not hers to reuse.')

add('III.2','hard',
 'A town needs a culvert review before the spring melt, three weeks away. She has not opened the file. She is using the time on a private hotel that pays more. What is the most appropriate action?',
 'Tell the town now if she cannot finish before the melt, and do not silently give the hotel the time the town needs.',
 [('Finish the hotel first. A higher fee decides the order of professional duties.','She accepted the town\'s deadline. A better fee does not erase it.'),
  ('Say nothing until the melt starts. The town can hire someone else without being told.','Silence leaves the town believing she is doing the review.'),
  ('The town has no timing claim. Public clients must wait behind private ones.','A public client is not second in line because the fee is lower.')],
 'If she cannot meet the melt, the town needs that news while there is still time to hire someone who can.')

add('III.2','easy',
 'An advertisement she is asked to approve says the firm "guarantees permit approval." She cannot control the authority. What is the best judgment?',
 'Take the guarantee out. She must not advertise a result the authority controls.',
 [('Leave it in. Advertising is not a professional statement.','An advertisement in her name is a professional statement.'),
  ('Leave it in if the font is smaller than the firm\'s name.','Type size does not make a guarantee true.'),
  ('Leave it in. A guarantee of approval is ordinary puffery and cannot mislead.','A specific promise of approval is not harmless puffery.')],
 'She may describe her service. She may not promise a permit.')

add('III.2','hard',
 'She recommends a well screen. The supplier pays her a referral fee she has not mentioned. She thinks the screen is suitable. What is the most appropriate action?',
 'Tell the client about the fee before the client relies on the recommendation.',
 [('Say nothing. A suitable product cancels an undisclosed fee.','Suitability does not hide the fee.'),
  ('Say nothing unless the fee is more than her professional invoice.','The size of the fee is not the test. The fact of the fee is.'),
  ('Tell the supplier, and do not tell the client. Disclosure to the payer is enough.','The person who must hear it is the client who is relying on her.')],
 'The client can then decide whether the advice is independent. She does not make that decision by silence.')

add('III.3','hard',
 'A client says a graduate who has passed the technical exams, but is not licensed, should take responsibility for a permafrost foundation so the licensee can leave. What is the most appropriate response?',
 'Passing exams is not a licence. She cannot hand the design to someone who is not licensed to accept it.',
 [('The graduate may take it. Technical exams are the same thing as a licence.','The regulator licenses. The exams are only a step.'),
  ('She may seal the drawings without reviewing them, because the graduate\'s exams replace her review.','Exams do not replace her review, and they do not let her seal unread work.'),
  ('The client is right whenever the graduate is careful. Care by an unlicensed person is professional responsibility.','Care is not a licence to accept the responsibility.')],
 'She may supervise a graduate. She may not transfer the professional responsibility the law places on a licensee.')

add('III.3','hard',
 'A hydrogeologist is asked to write, on a drawing, that a heritage facade can carry a new floor. She does not practise structural engineering. A structural licensee is available. What is the most appropriate action?',
 'She declines the note. The facade is structural work for a licensee who is competent in it.',
 [('She writes the note. A geoscience licence covers structural statements about old buildings.','The licence does not create competence in facade capacity.'),
  ('She writes the note if she adds the words "to the best of my knowledge."','A hedge does not turn a structural opinion into geoscience.'),
  ('She writes the note because the building is historic, and historic work is unregulated.','Age of the building does not remove the practice.')],
 'She may describe the ground. She does not certify the facade.')

add('III.3','medium',
 'She has read another expert\'s report and disagrees with the conclusion. At a hearing she says that expert fabricated the tests. She has no basis for that charge. What is the best judgment?',
 'She may disagree with the conclusion. She must not accuse the other expert of fabrication without a basis.',
 [('She may say it. Disagreement is proof that the other tests were invented.','A different conclusion is not evidence of fabrication.'),
  ('She may say it if her client wants the panel to distrust the other expert.','The client\'s wish does not supply a basis.'),
  ('She must adopt the other report. Disagreement at a hearing is always improper.','Disagreement is proper. The unsupported attack is not.')],
 'Fair comment attacks the opinion, with reasons. It does not invent dishonesty.')

add('III.4','medium',
 'A fire code sets a 45-minute door for this room. She has calculated that the room will store oxidizers the code table does not list, and that the 45-minute door will not protect the exit. A colleague says meeting the table is the whole duty. What is the best correction?',
 'The table is a minimum. It does not excuse the oxidizer hazard she has already calculated.',
 [('She is right to stop at the table. Going past a code table creates liability.','Dealing with a hazard the table misses is the duty.'),
  ('She must stop at the table unless the owner writes a request for more.','The owner\'s silence does not close a hazard she has calculated.'),
  ('She is right. A code table replaces judgment on every material, listed or not.','An unlisted oxidizer is exactly where judgment continues.')],
 'She provides the door the table requires and she deals with the oxidizers the table does not cover.')

add('III.4','medium',
 'The client\'s specification names a coating that has been discontinued, and the substitute the client wrote in the margin is incompatible with the substrate she tested. What is the most appropriate action?',
 'She tells the client the named substitute will not work on this substrate, and she does not swap it in silently.',
 [('She installs the margin substitute. A handwritten note by the client amends the chemistry.','The note does not change the test result.'),
  ('She picks any available coating and says nothing. Availability is a specification.','A silent swap hides the incompatibility.'),
  ('She follows the discontinued name and leaves the substrate question for the painter.','She already knows the substitute fails. Passing it to the painter does not answer it.')],
 'The specification is the contract starting point. A product that fails her test has to be raised, not buried.')

add('III.4','hard',
 'An official asks her to model a wall as if it contained insulation that is not in the wall, so the energy model will pass. The owner is pleased. What is the most appropriate action?',
 'She models the wall that will be built. She does not insert insulation that is not there.',
 [('She runs the false model. An official may direct the inputs of an energy model.','The official does not get to invent the wall.'),
  ('She runs the false model if the owner emails approval.','The owner cannot approve a model she knows is false.'),
  ('She runs the false model and labels it "illustrative," which makes the false insulation acceptable.','A label does not put insulation in the wall.')],
 'If the real wall fails, she says so and she offers a design that actually passes.')

add('III.5','medium',
 'A negligent design cracks a wall. A visitor also trips on a loose mat in the lobby, which has nothing to do with the design. The firm has a professional-liability policy and a commercial general liability policy. Which notice is the right one for the crack?',
 'Notify the professional-liability insurer about the crack. The mat claim is a different kind of loss.',
 [('Notify only the general-liability insurer. Design errors are an ordinary premises claim.','A design error is the professional policy\'s subject, not a mat in the lobby.'),
  ('Notify neither. Holding two policies means each excludes the other\'s claims automatically.','Two policies exist because the losses differ. She still gives notice of the crack.'),
  ('Notify the general-liability insurer and say nothing to the professional insurer, so the premium will not change.','Hiding the claim from the professional insurer is not a strategy the policies support.')],
 'The crack is a professional service claim. The trip is not. She does not use one policy as a substitute for the other.')

add('III.5','hard',
 'Her professional-liability policy excludes services she knew were outside her competence. A client asks her to take a blast design she has never done. She says the policy is permission because the firm pays the premium. What is the best judgment?',
 'The policy is not permission. She does not take a blast design she knows is outside her competence.',
 [('She takes it. Payment of a premium authorizes every service the firm sells.','The premium does not create competence, and this exclusion says the opposite.'),
  ('She takes it if she names the insurer on the drawing.','The insurer\'s name is not a qualification.'),
  ('She takes it. An exclusion applies only after a claim, so it does not affect the decision to accept the work.','The exclusion describes work she should not have accepted. It is not a reason to accept it.')],
 'Insurance responds to insured work. It is not a licence to practise outside her competence.')

add('III.5','hard',
 'A laboratory gauge failed its calibration last week. She nonetheless seals a fill-density report based on that gauge because the crew is waiting. What is the best judgment?',
 'She does not seal densities from a gauge she knows failed its calibration.',
 [('She seals them. A failed calibration is presumed to have passed once a report is issued.','Issuing the report does not repair the calibration.'),
  ('She seals them if the crew signs the field sheet. The crew\'s signature replaces the calibration.','The crew cannot calibrate the gauge by signing.'),
  ('She seals them. Calibration is an office preference, not a technical control.','The calibration is the reason the numbers can be used.')],
 'She waits for a valid calibration or she uses a method she has actually checked.')

add('III.5','hard',
 'A geotechnical report she wants to use is addressed to a different client and a different site, and it says others may not rely on it. She seals a foundation that uses its bearing values anyway. What is the best judgment?',
 'She does not rely on a report that forbids that reliance and that was not prepared for this site.',
 [('She may rely on it. Bearing values travel from site to site without a new investigation.','The report itself says this site was not the subject.'),
  ('She may rely on it if she retypes the numbers onto her letterhead.','Retyping does not create a new investigation.'),
  ('She may rely on it because both sites are in the same city.','A city boundary is not a geotechnical boundary.')],
 'She obtains an investigation she is prepared to rely on, or she limits her foundation to data that actually apply.')

add('III.6','hard',
 'A demolition spec she is writing will be used by the abatement contractor. She knows a coating contains asbestos. The owner asks her to call it "mineral fibre" so the abatement section can be deleted. What is the most appropriate action?',
 'Name the asbestos. She does not relabel it to drop the abatement.',
 [('Use the owner\'s words. The owner owns the building and may name the materials.','Ownership does not change what the coating is.'),
  ('Use "mineral fibre" if the laboratory sheet stays in her private file.','A private sheet does not protect the people who will strip the coating.'),
  ('Delete the abatement section and say nothing. Disclosure of asbestos is optional on a private demolition.','The spec is how the contractor learns the hazard. Silence is not optional.')],
 'The specification has to tell the truth about the material the workers will disturb.')

add('III.6','hard',
 'She has calculated that a cheaper coastal-road alignment will be lost to erosion inside the design life she was given. A setback alignment lasts that life and costs more. The owner says, "Draw only the cheap line. Do not show the erosion." What is the most appropriate action?',
 'Show the erosion result with the cheap line, and show the setback, so the choice is not hidden.',
 [('Draw only the cheap line. Erosion after opening day is outside a road designer\'s duty.','She has already calculated a loss inside the design life. Hiding it is the breach.'),
  ('Draw only the cheap line if the owner accepts maintenance. An oral acceptance erases the erosion result.','Oral optimism does not erase the calculation she was asked to hide.'),
  ('Refuse to discuss erosion. Climate and shoreline change are not engineering subjects.','The loss of the road is an engineering result on this assignment.')],
 'She does not have to force the setback. She does have to put the design-life loss in front of the person who will choose.')

add('III.6','medium',
 'She smells solvent in a monitoring well. The contractor asks her to hold the sample until the holding time expires, so the result cannot be used. What is the most appropriate action?',
 'Keep the chain of custody and report the condition. She does not age the sample out to hide a result.',
 [('Hold the sample. The contractor controls the well, so the contractor controls the data.','Control of the drill does not include destroying the usefulness of her sample.'),
  ('Hold the sample if she writes "contractor request" in a diary no one else sees.','A private diary is not a substitute for a valid sample and a report.'),
  ('Discard the sample. An odour is not data until a laboratory confirms it, so there is nothing to protect.','The odour is why the sample has to be handled properly, not why it can be discarded.')],
 'She protects the sample and she tells the party who needs the result. Delay as a way to spoil evidence is not a professional option.')

add('III.7','hard',
 'She seals a signal-timing plan from software she has not learned. She does not compare the output with the traffic counts. She says the software is widely used, so the output is hers. What is the best judgment?',
 'She does not seal it. The software is a tool, and she is responsible for the counts and for whether the timing fits this intersection.',
 [('She may seal it. A widely used program is the engineer of record for the sheets it prints.','The program is not a licensee and is not the engineer of record.'),
  ('She may seal it if the vendor warrants the output in the licence.','A vendor warranty does not review her counts.'),
  ('She may seal it after changing the north arrow, so the sheet looks hand-drawn.','A cosmetic change is not a check.')],
 'Wide use is not a review. She seals the timing only after she has checked the inputs and the result.')

add('III.7','medium',
 'A code publisher licensed one user to a digital code. A colleague asks her to post that copy on the project server for the whole team. The colleague says the firm bought the book. What is the most appropriate action?',
 'Refuse. The licence is for one user. Buying a book does not include posting the digital copy for the team.',
 [('Post it. A project server is private, so copyright does not apply.','A private server is still copying beyond the licence.'),
  ('Post it for one week. A short breach is not a breach.','The duration does not create a right to copy.'),
  ('Post it. Any firm that owns one licence may copy it for every employee.','One user means one user, unless the licence says otherwise.')],
 'She can ask the publisher for a licence that covers the team. She does not post the file she has.')

add('III.8','hard',
 'She issues a field instruction that changes a reinforcement detail. The shop keeps cutting from the sealed drawing, which she does not update. The superintendent says the drawing still governs because it is sealed. What is the most appropriate action?',
 'Update or clearly supersede the sealed drawing. A field instruction left beside a conflicting sealed sheet is how the wrong steel gets built.',
 [('Leave the sealed drawing as it is. A seal freezes the sheet forever, even after she has changed the detail.','A later instruction she issued has to replace the sheet people are building from.'),
  ('Rely on the superintendent to guess which document wins.','Guessing is not document control.'),
  ('Email the change only to a friend at the shop, and leave the site copy untouched.','The people cutting the steel need the change on the document they are using.')],
 'The field instruction and the sealed sheet cannot conflict in silence. She makes the issued set match the change.')

add('III.8','medium',
 'A fabricator starts cutting steel from a sketch she marked "not for construction." The client says those words were only a style. What is the most appropriate action?',
 'Tell the fabricator to stop using the sketch, and issue a document that is actually for construction.',
 [('Do nothing. Once cutting starts, a "not for construction" note expires.','Use by the shop does not convert the sketch.'),
  ('Send an invoice for the sketch. An invoice is issued-for-construction status.','Payment status is not a revision status.'),
  ('Let the cutting continue. A client may waive the note orally.','An oral waiver does not make an unfinished sketch a construction document.')],
 'She stops the reliance she knows about, and she replaces the sketch with a document she is prepared to have built.')

add('III.9','hard',
 'A report she sealed says a boil-water advisory can be lifted. She then finds she transcribed the laboratory result wrongly. The city is about to lift the advisory. What is the most appropriate action?',
 'Tell the city at once, in writing, that the result was transcribed wrongly and that the advisory advice must not be used.',
 [('Call a friend at the laboratory and leave the city to act on the sealed report.','The city is the body about to rely on it. A private call does not correct the record.'),
  ('Wait until someone becomes ill, so the correction has a fact to attach to.','She corrects it before the advisory is lifted.'),
  ('Replace the page quietly and do not say a sealed report went out wrong.','The city needs to know the version it has is wrong.')],
 'The correction goes to the user of the report, in time, and it states what was wrong.')

add('III.10','hard',
 'Her yield estimate is valid only if the well is built as she specified. The owner wants a one-page letter to a lender that states the number and deletes the condition. What is the most appropriate action?',
 'Keep the condition in anything the lender will see. The number alone is not her conclusion.',
 [('Delete the condition. A lender wants a single number, and a single number is always the whole opinion.','The condition is part of the opinion. Cutting it changes the opinion.'),
  ('Delete the condition if the owner promises to mention it verbally.','A verbal aside is not what the lender receives.'),
  ('Delete the condition. Limitations are for the file copy, not for the people who will rely on the letter.','The person who will rely on it is exactly who must see the limit.')],
 'She can write a short letter. The short letter still has to carry the condition that limits the yield.')

add('III.1','medium',
 'A client demands that she destroy her only copy of the calculations behind a seal, and keep no note of them. The report itself may stay with the client. What is the best judgment?',
 'She does not destroy the only record of a calculation she may have to explain. The client can hold the report without erasing that record.',
 [('She destroys it. The client owns every note once the invoice is paid.','Payment does not require her to erase the work she may have to stand behind.'),
  ('She destroys it if the client says the notes are embarrassing.','Embarrassment is not a reason to leave herself unable to explain the seal.'),
  ('She destroys it. A seal is valid only if no calculation survives.','The seal does not depend on destroying the calculation.')],
 'Retention rules vary by engagement and by law. The point here is that she does not agree to wipe out the only explanation of work she authenticated.')

# --- IV Law ---
add('IV.1','easy',
 'A client says a dispute over an unpaid professional invoice is a criminal matter, and that the police, not a civil court, decide the fee. What is the best correction?',
 'A fee dispute is a civil matter, in the court or the forum the contract chooses. It is not a criminal charge.',
 [('The client is right. Every broken contract is a crime.','Breach of contract is civil, not automatically criminal.'),
  ('The regulator\'s discipline panel is the only body that can decide a fee.','Discipline is about conduct. It is not the court for a private invoice.'),
  ('The client is right if the invoice is more than ten thousand dollars. That amount makes the claim criminal.','The size of the invoice does not turn it into a crime.')],
 'She may sue or follow the contract\'s dispute clause. She does not call the police to collect a fee.')

add('IV.2','medium',
 'No proposal is signed. For a month the client directs her work, she does it, and the client pays the first invoice. The client then says there is no contract because nothing was signed. What is the best judgment?',
 'A signature is not the only way a contract can arise. Performing and paying, as they did, can show an agreement.',
 [('The client is right. Canadian professional contracts are valid only if both parties sign a seal.','A seal is not required for this kind of agreement.'),
  ('The client is right. Email and conduct can never form a contract.','Conduct and payment can form one.'),
  ('There is a contract only if a lawyer witnessed the first meeting.','Witnessing is not a general requirement here.')],
 'The facts of request, performance, and payment matter. The missing signature is not, by itself, the end of the claim.')

add('IV.2','hard',
 'A buyer\'s written authority stops at five thousand dollars. The buyer tells her she is awarded a forty-thousand-dollar assignment. Procurement has not confirmed it. What is the most appropriate action?',
 'She does not treat the assignment as awarded until someone with authority commits the organization.',
 [('She starts. Apparent enthusiasm is the same thing as authority.','Enthusiasm does not raise the buyer\'s limit.'),
  ('She starts if she confirms the conversation in her own email. Her email creates the buyer\'s authority.','Her email does not give the buyer a power the organization withheld.'),
  ('She starts. A spending limit binds only employees, not the people who receive the award.','The limit is about who can bind the organization. She is about to rely on a person who cannot.')],
 'She may ask procurement to confirm. She does not spend the month on an award the buyer could not make.')

add('IV.2','hard',
 'A bidder\'s price is missing a zero. The error is plain on the face of the form. The owner asks her to accept it quickly before the bidder notices. What is the best judgment?',
 'She tells the owner not to snap up a price that is plainly wrong, and she leaves the legal step to the owner\'s counsel.',
 [('She urges the owner to accept at once. A bidder is bound by every mistake, however obvious.','An obvious mistake is not a prize she helps the owner seize.'),
  ('She changes the digit herself so the bid looks consistent, then recommends acceptance.','Altering the bid is not her role.'),
  ('She says nothing. Her duty is to the owner\'s bargain, even when the price is an obvious slip.','Helping to trap the bidder is not professional service.')],
 'She does not decide the contract law on her own. She does not assist a snap acceptance of a patent error.')

add('IV.2','medium',
 'The owner wants a credit for deleted paving and tells her to revise the drawing now and "price it later." She is about to issue the drawing as if the credit were already agreed. What is the most appropriate action?',
 'Issue the drawing change only with the status clear. Do not state a credit that has not been agreed.',
 [('State the credit as agreed. An instruction to revise the drawing settles the price.','A drawing change is not a price agreement.'),
  ('Refuse to revise the drawing until the project is over. No change may be drawn before the price.','She can show the change. She cannot invent the money.'),
  ('Pick a credit herself and insert it. The professional sets the owner\'s price.','She does not award the owner\'s money.')],
 'Scope and price are different lines. She keeps them distinct.')

add('IV.2','hard',
 'The contract says she will rely on the owner\'s survey, and that the owner warrants it. The survey is wrong. She did not notice a conflict that was obvious on the face of the drawing. The owner says a professional may never rely on owner information. What is the best judgment?',
 'She was entitled to rely on the survey the contract warranted. She was not entitled to ignore a conflict that was obvious on the drawing.',
 [('The owner is right. Reliance on any owner-supplied fact is negligence, whatever the contract says.','The contract allocated that reliance. The contract is not irrelevant.'),
  ('She is not responsible even for a conflict she saw and set aside. The warranty covers her silence.','A warranty does not excuse her from a clash she actually noticed.'),
  ('The surveyor is automatically the only defendant. She drops out of every claim the moment a survey is wrong.','A wrong survey does not, by itself, end a claim about a conflict she ignored.')],
 'The allocation in the contract matters. So does the conflict she could see and did not resolve.')

add('IV.3','easy',
 'Her contract says every claim against her expires thirty days after the invoice. She tells the client this sentence replaces the provincial limitation statute, whatever that statute says. What is the best correction?',
 'A contract clause does not automatically replace the limitation statute. Whether a shortened period is effective depends on that statute and on the wording.',
 [('She is right. Private contracts always defeat limitation statutes.','The statute still has to be read. A clause does not repeal it.'),
  ('She is right. Thirty days is the national professional limitation period.','There is no national thirty-day period.'),
  ('She is wrong because no contract may ever mention a time limit. Time limits in contracts are forbidden.','A time limit can be part of a bargain. It is not automatically forbidden, and it is not automatically supreme.')],
 'She does not advise the client that the invoice date has replaced the Act.')

add('IV.3','hard',
 'She specified a bolt. The contractor never installed that bolt. The contractor installed a different bolt she did not approve, and that bolt failed. The owner sues her for the failure. What is the best judgment?',
 'Her error, if she made one, did not cause this failure. The contractor built something she did not specify.',
 [('She is liable for any failure on the project because her name is on a drawing.','A drawing does not make her the insurer of a substitution she did not approve.'),
  ('She is liable because the contractor\'s bolt was installed on a site she once visited.','A visit does not adopt the substitution.'),
  ('She is liable unless she supervised the contractor\'s employees day to day.','Day-to-day employment of the crew is not the test. Causation is.')],
 'Causation is required. The failure came from a bolt she did not choose.')

add('IV.3','hard',
 'She uses a lining method that is not yet an accepted method, and she does not tell the client it is unproven. The client says he thought it was ordinary practice. What is the best judgment?',
 'She needed the client\'s informed acceptance before using an unproven method. Silence is not that acceptance.',
 [('She is protected. Any method a licensee chooses is accepted practice by definition.','Calling it hers does not make it accepted practice.'),
  ('She is protected if the method later becomes accepted. Later acceptance rewrites the day she chose it.','The question is what she told the client at the time.'),
  ('She had no duty to mention the uncertainty. Clients hire a result, not a method.','The uncertainty was part of the advice.')],
 'An accepted method needs no special warning of novelty. This method was not accepted, and she hid that.')

add('IV.3','hard',
 'Her report is addressed to "the purchaser" of a named house. She knows the purchaser will use it to decide whether to buy. The report overstates capacity. The purchaser sues. She says she owed a duty only to the seller who paid her. What is the best judgment?',
 'She can owe a duty to that purchaser. She addressed the report to the purchaser and knew it would be used for the purchase.',
 [('She is right. A professional owes a duty only to the person who pays the invoice.','Payment is not the only source of a duty. She aimed the report at the purchaser.'),
  ('She owes the purchaser a duty only if the purchaser is a licensed professional.','The purchaser\'s licence is irrelevant.'),
  ('She owes no duty because a house purchase is not a commercial transaction.','The use she knew about, not the label "house," is what matters.')],
 'Knowing reliance by the person she addressed is enough to found a duty. The seller\'s cheque does not close it.')

add('IV.3','hard',
 'She marked a lane "not ready." The owner opened the lane anyway. Her curing specification was also below the standard of care, and both causes contributed to the damage. The owner says her fault must be ignored because the owner was also at fault. What is the best judgment?',
 'Where both contributed, responsibility can be divided. The owner\'s own decision can reduce the damages. It does not automatically erase hers.',
 [('The owner is right. Any fault by a plaintiff cancels the whole claim.','Contributory fault can apportion. It does not always bar the claim.'),
  ('She is fully liable. A defendant pays one hundred percent whenever she is at fault at all.','Apportionment exists so that a shared cause is shared.'),
  ('The court must pick one cause and ignore the other.','Both causes can be recognized.')],
 'The owner\'s opening of the lane matters. So does her specification. The law can give weight to each.')

add('IV.4','medium',
 'An owner retains her as an expert and offers a fee that is paid only if the owner wins. What is the most appropriate action?',
 'Decline a fee that depends on which party wins. Her opinion cannot be bought by the result.',
 [('Accept. An expert is the client\'s advocate, and advocates may be paid only if they win.','An expert\'s role is not the advocate\'s role. The fee must not depend on the verdict.'),
  ('Accept if the percentage is under ten percent. A small contingent fee is not contingent.','The percentage does not change the dependence on winning.'),
  ('Accept. Independence is required only of judges, not of expert witnesses.','The expert\'s independence is the point of the evidence.')],
 'She can be paid for her time. She does not sell the outcome.')

add('IV.2','medium',
 'An owner tells a contractor that holdback need not be retained because the contractor is a friend. The applicable Act requires a holdback on this project. What is the best judgment?',
 'A friendship does not waive a holdback the Act requires. The owner still has to follow that statute.',
 [('The owner is right. Holdback is a custom, and friends may skip a custom.','Where the Act requires it, it is not a custom they may skip.'),
  ('The owner is right if the friend sends an email. An email repeals a holdback statute.','A private email does not repeal the Act.'),
  ('Holdback is a federal tax. Friendship is irrelevant, and so is the provincial Act.','Holdback here is a provincial lien-statute concept, not a federal tax.')],
 'She does not advise the owner that friendship displaces the statute. Whether this project is covered depends on that Act, and on these facts it is.')

add('IV.2','medium',
 'An owner holds a performance bond on the contractor. A design error by the licensee causes a loss. The owner says the performance bond is her professional-liability insurance. What is the best judgment?',
 'The performance bond secures the contractor\'s performance. It is not her professional-liability policy.',
 [('The owner is right. Any bond on a project pays for professional negligence.','A performance bond and a professional policy answer different obligations.'),
  ('The owner is right if the bond names the project. Naming the project converts it into her insurance.','The name of the project does not change the obligation bonded.'),
  ('The bond pays her deductible and nothing else, so she need not carry insurance.','The bond is not a deductible arrangement for her negligence.')],
 'She looks at her own policy for a professional claim. She does not point the owner to the contractor\'s bond as if it were hers.')

add('IV.4','medium',
 'The contract does not assign copyright. She wants to reuse a standard detail she drew on a later, unrelated project. The client says payment means she may never reuse any detail. What is the best judgment?',
 'Unless copyright was assigned, she keeps it. Payment gave the client a right to use the work on this project, not ownership of every later use of her standard detail.',
 [('The client is right. Payment assigns copyright even when the contract says nothing.','Payment of a fee is not, by itself, an assignment of copyright.'),
  ('She is right to reuse the client\'s site-specific borehole coordinates as if they were a standard detail.','Site-specific confidential data is not her standard detail. The detail and the data are different.'),
  ('Copyright in engineering drawings lasts five years from the invoice.','That is not the term. She should not invent a five-year rule.')],
 'She may reuse her standard detail if she did not assign it and she does not carry over the client\'s confidential, site-specific information.')

add('IV.4','easy',
 'She invents a sensor and wants to stop others from making it. A colleague says a patent lasts twenty years from the first sale, and that she should wait to file until sales begin. What is the best correction?',
 'A patent\'s term runs twenty years from the filing date, not from the first sale. Waiting to file can cost her the right.',
 [('The colleague is right. The twenty years start when the first unit is sold.','The term is measured from filing.'),
  ('The colleague is right. A trade secret and a patent are the same right under two names.','A published patent is not a secret, and a secret is not a patent monopoly.'),
  ('She needs no filing. Selling the sensor creates a patent automatically.','A patent is granted on an application. A sale does not create one.')],
 'If she wants the monopoly, she files. Sale is not the start of the twenty-year term, and sale is not a substitute for filing.')

add('IV.4','medium',
 'Their contract says disputes will be arbitrated. The client sues in court anyway. She asks what the clause does. What is the best judgment?',
 'The clause is a promise to arbitrate, not to mediate. The other party can ask the court to stay the lawsuit so the arbitration can proceed.',
 [('The clause is a mediation. Any recommendation would bind both parties as an award.','Mediation is not what this clause says, and a mediator\'s recommendation is not an award.'),
  ('The clause is a finding that she was negligent. Arbitration words decide the merits.','The clause chooses a forum. It does not decide who is at fault.'),
  ('The clause is void. Canadian parties cannot agree to arbitrate a professional dispute.','They can agree to arbitrate. The clause is not void for that reason.')],
 'She does not ignore the lawsuit. She also does not treat the clause as a mediation or as a confession.')

add('IV.4','hard',
 'The paper calls her an independent contractor. The company sets her hours, her method, and her tools, and she has no other clients. A manager says the label on the paper controls. What is the best judgment?',
 'The label does not control. These facts describe an employee, whatever the paper is called.',
 [('The manager is right. The word on the first page decides the relationship for every purpose.','Courts and tribunals look at the facts, not only the title.'),
  ('She is a contractor because she is paid by invoice rather than by payroll.','An invoice does not outweigh hours, method, tools, and a single client.'),
  ('She is a contractor if the paper uses the word "professional."','The word professional is not the test.')],
 'How the work is actually controlled is the question. This arrangement is employment in substance.')

add('IV.1','easy',
 'A company policy says it replaces the provincial engineering Act for employees of that company. Which statement is correct?',
 'A company policy cannot replace the Act. The Act still applies unless the Act itself creates an exemption that covers the work.',
 [('The policy is right. Private policies prevail over provincial statutes inside a workplace.','A workplace policy does not repeal a statute.'),
  ('The policy is right if the board of directors approved it.','Board approval does not amend the Act.'),
  ('The Act applies only to consultants, so the policy is unnecessary but harmless.','Employment does not, by itself, take the work out of the Act.')],
 'She looks at the Act for any real exemption. She does not look at the policy as if it were the Act.')

add('IV.3','medium',
 'Two methods were both accepted practice on the day she chose. She used one, and she wrote down why. A later claim says she was negligent because the other method also existed. What is the best judgment?',
 'Negligence is not shown merely because another accepted method existed. She used an accepted method and recorded why.',
 [('The claimant is right. Choosing either of two accepted methods is negligence.','The standard allows accepted practice. It does not demand the one method a later critic prefers.'),
  ('She is negligent because a better method was published five years later.','The standard is the practice at the time of the work.'),
  ('She is negligent unless she used the method the client now prefers.','Hindsight preference is not the standard of care.')],
 'The recorded choice of an accepted method is a defence to this particular attack. It is not a defence if the method was carried out carelessly.')

add('IV.3','medium',
 'The contract called for a standard pump. The owner now claims the cost of a premium pump with features the contract did not require. Her specification of the standard pump was late, and the owner says lateness makes her pay for the upgrade. What is the best judgment?',
 'Lateness, if proved, does not automatically make her pay for a better system than the one that was contracted.',
 [('The owner is right. Any delay converts the contract scope into the owner\'s later wish list.','Damages follow the loss the delay caused, not an upgrade the contract never included.'),
  ('She pays the premium pump because professionals guarantee the client\'s preferences.','A preference is not the measure of damages.'),
  ('She pays nothing for delay, even for rental costs the delay actually caused, because delay damages are unlawful.','Real delay costs can be recoverable. The upgrade is the part that does not follow.')],
 'She does not concede the upgrade. The owner can pursue proven delay loss. The owner does not get a better pump for free.')

add('IV.2','medium',
 'A letter says it is not a contract except for a confidentiality paragraph. The client tells her to start the paid field work because "the letter shows we are agreed." What is the most appropriate action?',
 'Do not start the paid work on the strength of a letter that says it is not a contract. Confidentiality can bind without the rest binding.',
 [('Start. A sentence that denies a contract is ordinary politeness and does not mean what it says.','The sentence means the commercial deal is not yet made.'),
  ('Start if she replies "excited to proceed." Her excitement accepts an offer the letter refused to make.','Polite enthusiasm does not create the contract the letter withheld.'),
  ('Ignore the confidentiality paragraph as well. A non-binding letter binds nothing at all.','The letter carved confidentiality in. That part can bind.')],
 'She may protect confidential information as the letter says. She does not mobilize the field crew until the work itself is awarded.')

add('IV.1','medium',
 'A client starts a civil lawsuit over a design and also files a complaint with the regulator about the same events. The client says the regulator must stop because a judge is involved. What is the best judgment?',
 'The lawsuit and the complaint are different proceedings. One does not automatically cancel the other.',
 [('The client is right. A civil filing freezes every regulator.','The regulator\'s duty to the public is not adjourned forever by a private suit.'),
  ('The client is right. The first body to open a file is the only body allowed to continue.','There is no first-to-file rule that merges a lawsuit and a discipline complaint.'),
  ('The judge will decide the complaint as part of the civil trial, so the regulator has no role.','The judge decides the civil claim. The regulator decides the complaint under its Act.')],
 'She responds to each in its own forum. She does not assume the complaint disappears because she has been sued.')

add('IV.4','medium',
 'She describes a process in a paper she publishes. She then tells a client the same process is a trade secret the client must pay to know. What is the best judgment?',
 'What she has published is no longer a secret. She cannot sell published text as a trade secret.',
 [('She can. Publication and secrecy are compatible if she says the paper was "informal."','Calling the paper informal does not unpublish it.'),
  ('She can. A trade secret lasts twenty years from publication, the same as a patent.','Publication destroys the secret. A patent term is a different right, measured from filing.'),
  ('She can if the client did not attend the conference. A secret depends on each listener\'s attendance.','Once she has published, the secret is gone. It does not depend on who sat in the room.')],
 'She may still charge for advice and for work. She may not pretend the published process is secret.')

add('IV.2','medium',
 'The contract caps her liability at the fee. The client says every Canadian liability cap is automatically void, so the sentence does not matter. What is the best judgment?',
 'A cap is not automatically void. It is part of the bargain unless a statute or a court finds that this cap cannot stand.',
 [('The client is right. Every limitation of a professional\'s liability is void in every province.','There is no national rule that voids every cap.'),
  ('The client is right if the loss is larger than the fee. Size alone deletes the clause.','A larger loss is why the clause matters. It does not delete it by itself.'),
  ('She may ignore the cap because professionals cannot agree to any limit.','She can agree to a limit. Whether this wording holds is a legal question, not a reason to pretend it was never written.')],
 'She does not tell the client the cap is meaningless. She also does not promise that every cap survives. The clause has to be read.')

# --- V Professional law ---
add('V.1','medium',
 'A person who is not registered as an engineer-in-training prints "Engineer in Training" on a proposal. He says the words describe his studies. What is the best judgment?',
 'That title is reserved for a person the regulator has admitted in that category. Studies alone do not confer it.',
 [('He is right. Any student may use the title.','The category is created by the regulator, not by enrolment in a course.'),
  ('He is right if a licensed engineer works somewhere in the same city.','Another person\'s licence does not lend him the title.'),
  ('He is right if the proposal is unpaid. An unpaid document has no title rules.','The title is restricted whether or not he is paid for this page.')],
 'He stops using the title until the regulator admits him.')

add('V.1','easy',
 'Which statement about titles is correct?',
 'Professional engineer, P.Eng., professional geoscientist, and P.Geo. are reserved for people the regulator has licensed.',
 [('The titles are courtesy styles. Anyone with a degree may print them.','They are reserved titles, not courtesy styles.'),
  ('Only P.Eng. is reserved. Geoscience titles are free to use.','Geoscience titles are reserved as well.'),
  ('A foreign licence automatically includes the Canadian title in every province.','A foreign licence does not print a Canadian title.')],
 'The letters and the full titles are the regulator\'s to grant.')

add('V.1','hard',
 'An unlicensed person, for a fee, signs a flood-elevation certificate that a municipality will rely on for a named lot. She calls the certificate "general information" and does not use the title P.Eng. What is the best judgment?',
 'Offering that certificate for others to rely on is the practice. Avoiding the title does not make it lawful.',
 [('She is right. The Act restricts the title and never the work.','The practice is reserved, not only the title.'),
  ('She is right if each homeowner initials the page. Initials replace a licence.','Initials are not a licence.'),
  ('She is right until a flood occurs. Unlicensed practice is lawful before damage.','The offence is the unlicensed practice, not the later flood.')],
 'The municipality is being asked to rely on her certificate. That is reserved practice, title or no title.')

add('V.2','hard',
 'Two licensed engineers offer groundwater studies to the public. Neither is a geoscientist. No licensed geoscientist will take responsibility. Their province requires a permit to practise for a firm offering professional services. They have no permit. What is the best judgment?',
 'They need a licensed geoscientist who is responsible for that work, and they need the permit the Act requires before the firm offers it.',
 [('They are covered. Any engineering licence authorizes geoscience, and a permit is only a business licence from the city.','Geoscience is its own licence. A city business licence is not the professional permit.'),
  ('They are covered if the reports are signed "the partners." A firm signature replaces a personal licence.','The firm still needs a licensed professional responsible for the geoscience.'),
  ('They are covered because both partners are licensed in some discipline. One licence covers every profession the firm sells.','A structural or civil licence is not a geoscience licence.')],
 'The offer to the public is the problem. The missing geoscientist and the missing permit are both real, where this Act requires the permit.')

add('V.2','hard',
 'An engineer-in-training stamps "reviewed by EIT" on an issued set. The licensee then adds her seal without looking, and says the trainee\'s stamp was the review. What is the best judgment?',
 'The trainee cannot accept the responsibility, and her own seal without a review is not a review.',
 [('The trainee\'s stamp is enough. An EIT may seal issued-for-construction work.','An EIT does not seal the professional work.'),
  ('Her unread seal is enough because the trainee is employed by the same firm.','Employment does not review the drawings for her.'),
  ('The pair may offer the same service to the public on weekends under the trainee\'s name.','The trainee has no licence to offer that practice.')],
 'She either reviews and accepts the work under her own seal, or the set does not go out as professional work.')

add('V.3','hard',
 'She is registered in one province. She says the Canadian Free Trade Agreement lets her print P.Eng. and seal a project in another province before that regulator has authorized her. What is the best judgment?',
 'Mobility does not let her use the title or the seal there until that regulator authorizes her.',
 [('She is right. The agreement is a national licence.','It is a mobility framework, not a licence she already holds in the second province.'),
  ('She is right if the project is privately owned. Public projects are the only ones that need the second licence.','Private ownership does not skip the second regulator.'),
  ('She is right for ninety days. The agreement includes a universal grace period.','There is no universal ninety-day right to seal. She follows that regulator\'s process.')],
 'She applies under the mobility rules the second regulator actually has. She does not start by sealing.')

add('V.3','hard',
 'A federal employee designs a public building for a town and says a federal paycheque is an exemption from the provincial engineering Act. The drawings will be filed with the town. What is the best judgment?',
 'A federal paycheque is not, by itself, an exemption. She has to look at the statute that governs this work.',
 [('She is right. Every federal employee is outside every provincial engineering Act.','There is no such blanket exemption.'),
  ('She is right if the building is under four storeys. Height creates a federal exemption.','Height is not the test.'),
  ('She is wrong because only geoscientists need a licence. Engineering never requires one.','Engineering practice is reserved.')],
 'Some federal works have their own legal setting. She does not assume the paycheque answers the question. The Act that covers this building is the one she reads.')

add('V.4','medium',
 'Her licence is suspended. She says the suspension allows her to seal "internal" drawings, and a contractor will build from them. What is the best judgment?',
 'The suspension stops her from practising. Sealing drawings a contractor will use is practice.',
 [('She is right. Internal means any drawing that is not filed in court.','The contractor\'s use is practice, whatever word she puts on the title block.'),
  ('She is right if she seals with a note that she is suspended. The note restores the licence.','A confession of the suspension does not lift it.'),
  ('She is right until the suspension is printed in a newspaper. Until then it has no effect.','The regulator\'s order is effective without a newspaper.')],
 'She does not seal. The contractor does not get professional drawings from a suspended licensee.')

add('V.1','medium',
 'A person entitled to use "ing." in Quebec prints that title on oilfield drawings for a site in Alberta and says the Quebec title is an Alberta licence. What is the best judgment?',
 'The Quebec title is not an Alberta licence. Alberta practice needs Alberta\'s authorization.',
 [('She is right. A reserved title in one province is a licence in every other province.','Each regulator grants its own authority.'),
  ('She is right if the drawings are stamped in Montreal and emailed to Alberta.','The desk does not move the oilfield out of Alberta.'),
  ('She is right because oilfield work is federal and no province licenses it.','She cannot assume the oilfield is outside Alberta\'s Act.')],
 'She asks the Alberta regulator what her Quebec qualification allows. She does not start by treating the title as local authority.')

# --- VI Discipline ---
add('VI.1','medium',
 'A client asks a discipline committee to rewrite a commercial contract and to insert a new fee. The client says discipline exists to repair business deals. What is the best judgment?',
 'Discipline is about conduct and fitness to practise. It is not a forum for rewriting the contract.',
 [('The client is right. The committee sits as a commercial court.','The committee does not renegotiate fees.'),
  ('The client is right if both parties consent. Consent turns discipline into arbitration of the price.','Consent does not change the committee\'s statutory job.'),
  ('The committee must insert the fee if the client files the complaint first.','First filing does not create a power to rewrite the bargain.')],
 'The client can sue on the contract. The committee can deal with the conduct, if the Act covers it.')

add('VI.1','medium',
 'A panel finds poor practice on one kind of work. Which order is the proper kind of order?',
 'An order the Act allows, such as a reprimand, a fine, supervised practice, or a limit on that work. It does not jail her, and it does not order the employer to demote her.',
 [('The panel sentences her to thirty days in jail.','Discipline is not a criminal sentence of imprisonment.'),
  ('The panel orders the employer to demote her. A restriction works only if her job title changes.','The order runs against her practice, not against the employer\'s organization chart.'),
  ('The panel has no power short of revocation. Any narrower order is unlawful everywhere.','Narrower orders exist where the Act provides them.')],
 'The precise list is in that province\'s Act. Jail and a demotion order are not the tools.')

add('VI.2','hard',
 'The complainant asks to sit as a voting member of the panel that will decide his own complaint. He says the person who brought the case should help decide it. What is the best judgment?',
 'The person who decides should not be the accuser. He does not vote on his own complaint.',
 [('He may vote. A complainant is the prosecutor and the judge in discipline.','Those roles are separated.'),
  ('He may vote if he promises to be fair. A promise cures the conflict.','The conflict is structural. A promise does not remove him from the panel.'),
  ('He may vote because discipline does not use rules about bias.','Bias rules apply. A panel must be, and appear, impartial.')],
 'He can be a witness to what he knows. He does not cast a vote.')

add('VI.2','easy',
 'A member tells the panel it cannot look at her own sealed drawing unless the drawing is notarized. What is the best correction?',
 'A discipline hearing is not a rule that every document must be notarized. She may challenge reliability. The missing stamp does not exclude her drawing automatically.',
 [('She is right. Unnotarized paper is invisible to every Canadian tribunal.','Notarization is not a universal condition of admission.'),
  ('She is right. Only a criminal court may look at a sealed drawing.','The panel can consider the drawing in its own proceeding.'),
  ('She is right if she objects. An objection by itself excludes the document.','An objection is heard. It does not automatically win.')],
 'The panel decides the weight of the drawing. It does not need a notary\'s stamp before it may look.')

add('VI.2','hard',
 'After an investigator asks for her field book, she changes dates in it so the entries match a later story. She says the book is hers to edit. What is the best judgment?',
 'She must not alter a record an investigation has asked for.',
 [('She may edit it. A field book is a draft until she decides it is final.','Once the investigation wants it, altering it is the offence. It was never a private draft she could rewrite.'),
  ('She may edit it if she keeps a photo of the old page at home and shows no one.','A hidden photo does not authorize the alteration.'),
  ('She may edit it if she resigns the same day. Resignation makes the change lawful.','Resignation does not legalize the alteration.')],
 'She produces the book as it is. She does not improve the story.')

add('VI.3','hard',
 'A complaint concerns work she did while licensed in Province A. She later becomes licensed in Province B and says Province A loses jurisdiction on the day she joins Province B. What is the best judgment?',
 'Province A may still deal with conduct that occurred while she was its member. A new licence elsewhere does not erase that conduct.',
 [('She is right. A member can be answerable to only one regulator, the latest one.','The later licence does not vacate the earlier conduct.'),
  ('She is right if she resigns Province A before the hearing is called. Resignation is an acquittal.','Resignation is not an acquittal.'),
  ('Province B must hear the Province A complaint, because she lives there now.','The conduct belongs to the regulator under whose licence it occurred.')],
 'She answers Province A about Province A work. Province B does not inherit that file by the fact of her move.')

add('VI.4','medium',
 'She wants to appeal a suspension. She files immediately in the Supreme Court of Canada and says that court is the automatic next step. What is the best judgment?',
 'She follows the appeal path named in the Act that made the order. The Supreme Court is not the automatic next step.',
 [('She is right. Every professional suspension is appealed straight to that court.','The Act names the route. It is not automatically the Supreme Court.'),
  ('She is right if the suspension is longer than a month. Length chooses the court.','Length does not skip the appeal the Act provides.'),
  ('A neighbouring province\'s council is the appeal body for every Canadian suspension.','Another province does not sit on this order.')],
 'She reads the appeal section and uses it. She does not invent a national shortcut.')

add('VI.3','medium',
 'A complainant tells her he will "prosecute" the discipline case himself, and that the regulator is only the courtroom. What is the best correction?',
 'The regulator carries the discipline proceeding. The complainant is not the prosecutor in his private capacity.',
 [('He is right. Discipline is a private prosecution by the person who was disappointed.','The case belongs to the regulator.'),
  ('He is right if he hires a lawyer. His lawyer becomes the association.','Hiring counsel does not make him the association.'),
  ('He is right. The regulator may act only when he personally conducts the hearing.','The regulator conducts the proceeding under its Act.')],
 'He may be a witness. He does not take over the case.')

add('VI.5','medium',
 'While her suspension is in force, she asks the regulator for a letter stating that she is in good standing, so she can attach it to a proposal. What is the best judgment?',
 'The regulator should not describe a suspended licence as good standing.',
 [('She is entitled to the letter. Good standing means she once held a licence.','Good standing is not a former status she can still print.'),
  ('She is entitled to the letter if the proposal is for work outside the suspension.','A letter that hides the suspension is still misleading.'),
  ('She may draft the letter herself on the regulator\'s letterhead she copied.','Copying the letterhead would be a false statement.')],
 'She can say what the register actually shows. She cannot obtain a letter that denies the suspension.')

# --- experimental, unscored, still original ---
add('I.2','medium',
 'A licensee on a closed industrial site says the gate means her only duty is to the owner. Workers are in a confined space she has certified, and a vent she approved is blocked. What is the best judgment?',
 'The gate does not end her duty. The workers who rely on her certificate are within it.',
 [('She is right. A locked site has no public, so the code is silent.','The workers are people her certificate puts at risk.'),
  ('She is right if the owner is a private company. The code applies only on government sites.','Private ownership does not close the duty.'),
  ('She owes a duty only to visitors who have no safety training. Trained workers are outside it.','Training does not remove her responsibility for a vent she approved and that is now blocked.')],
 'She deals with the blocked vent. The fence is not the boundary of the duty.')

add('II.3','hard',
 'A schedule she did not prepare is attached to a letter she is asked to sign. The schedule inflates quantities. The principal says she is signing only the letter, not the attachment. What is the most appropriate action?',
 'She does not sign until the schedule is corrected or clearly excluded. An attachment she knows is wrong is part of what she would be sending.',
 [('Sign. A letter never includes its attachments.','People will read the package. The wrong schedule rides with the letter.'),
  ('Sign if she adds "quantities approximate," even though she knows they are inflated rather than approximate.','A hedge she knows is false does not fix the schedule.'),
  ('Sign. Quantity inflation is a commercial matter, and the code covers only calculations.','A known inflation in a document she sends is a honesty problem.')],
 'She either corrects the package or she refuses to sign it.')

add('II.4','hard',
 'After she specifies a roofing membrane, the manufacturer sends a gift card to her home. The specification is already issued. She plans to keep the card and say nothing. What is the best judgment?',
 'She discloses the gift and does not keep a payment tied to the product she specified.',
 [('She keeps it. A gift after the issue date is ordinary customer mail.','The card is tied to the specification. The date does not clean it.'),
  ('She keeps it if she gives the points to a charity and still redeems them.','Redeeming it is still keeping it.'),
  ('She keeps it if the membrane was the only product that met the spec. Fitness of the product erases the gift.','A suitable product does not make a secret gift acceptable.')],
 'She tells the client. The specification can stand on its technical reasons. The card cannot.')

add('III.2','hard',
 'The owner will pay her a bonus if the construction cost comes in under a budget she sets. She is also the person who will certify the contractor\'s invoices against that budget. What is the most appropriate action?',
 'She does not both set the bonus target and certify the invoices that decide the bonus. She discloses the offer and steps out of one of the two roles.',
 [('She accepts both roles. A bonus for a low cost is always in the owner\'s interest, so there is no conflict.','Her certificate decides whether she is paid the bonus. That is the conflict.'),
  ('She accepts if the bonus is paid to her firm. A firm cannot have this conflict.','The firm\'s receipt does not separate her certificate from the bonus.'),
  ('She accepts and certifies high, so the bonus is never paid. Silent self-denial cures the conflict.','Quietly aiming the certificate is not a cure. The owner needs the conflict removed.')],
 'The owner can choose a certifier who is not paid by the result she certifies.')

add('III.8','hard',
 'Her template still shows the previous client\'s name and site address on drawings for a new client. She does not read the title block. She seals the set because the software subscription is paid. What is the most appropriate action?',
 'She corrects the title block before she seals. A paid subscription does not review whose project the sheet names.',
 [('Seal it. Title-block text is the software vendor\'s statement, not hers.','Her seal adopts the sheet, including the name on it.'),
  ('Seal it. A previous client\'s name on a new site is harmless metadata.','The wrong client and the wrong site are not metadata she can ignore.'),
  ('Seal it if the new client does not notice. Silence by the client corrects the block.','The client\'s failure to notice does not review the sheet.')],
 'She reads the title block. The new client\'s project has to be the one named on the sheet she seals.')

add('III.1','hard',
 'A welder texts a photo and asks her to certify today\'s joint. The photo is of a different joint, from last month, and she has not seen today\'s weld. What is the most appropriate action?',
 'She does not certify today\'s weld. A photo of another joint is not this inspection.',
 [('Certify it. A photo of any weld on the project covers the rest.','Another joint is not this weld.'),
  ('Certify it if the welder writes "same procedure." His sentence replaces the inspection.','A sentence is not the weld she was asked to certify.'),
  ('Certify it and add "photo only" in a footnote the form does not show.','A hidden footnote does not turn the other photo into this inspection.')],
 'She looks at the joint, or she refuses the certificate.')

add('IV.2','medium',
 'Her accepted quote excludes a pump station. A later purchase order adds the pump station and keeps the old fee. She is about to start the extra because the purchase order is signed. What is the best judgment?',
 'She reconciles the conflict before she starts the pump station. A signed purchase order that adds excluded work is a change, not a silent acceptance.',
 [('She starts. The later signature always wipes the quote, including the fee.','She does not assume the old fee now buys the extra.'),
  ('She starts the extra at the old fee. Professionals absorb scope that a form adds later.','Added scope is a change to be priced, not a gift.'),
  ('She ignores the purchase order completely, including the part that matches the quote.','The matching work can proceed. The added pump station cannot hide inside it.')],
 'She tells the client the pump station is outside the quote and she waits for a change before that work begins.')

add('IV.3','hard',
 'At a public meeting she tells a resident, "That slope is stable. Cancel the review you booked." She has not examined the slope. The resident cancels. What is the best judgment?',
 'She can owe a duty for that statement. She knew he would rely on it, and she had no basis for it.',
 [('She owes nothing. Words at a public meeting are never professional advice.','She gave a conclusion and told him to cancel a review. That is advice.'),
  ('She owes nothing unless he paid her at the meeting.','Payment is not required when she invited reliance.'),
  ('She owes nothing because a slope is a natural feature and natural features are outside the practice.','Stability advice about a slope is the practice.')],
 'She tells him she had not examined it, and she does not leave the cancellation standing on her sentence.')

add('V.1','medium',
 'A technician who is not licensed signs a shoring drawing "P.Eng." because the title block style uses those letters. A licensee in another department has not seen the drawing. What is the best judgment?',
 'He has used a reserved title on work he is not licensed to sign. The unused style of a title block does not authorize it.',
 [('He is right. Title-block styles are outside the Act.','The letters are the title. The location on the page does not matter.'),
  ('He is right if the other department employs a licensee. Employment nearby lends the title.','A colleague\'s licence does not sign this drawing.'),
  ('He is right. Shoring drawings are a trade document, never professional engineering.','Shoring design relied on by the site is professional work.')],
 'The drawing needs a licensee who reviews it and takes responsibility. The technician stops using the title.')

add('VI.1','medium',
 'A panel finds that she failed to keep the records the engagement required. The quality of her structural calculations was not in issue. Which order fits?',
 'The panel may order a records practice it is allowed to impose, such as supervision of her files. It does not have to ban the structural work the hearing did not examine.',
 [('The panel must revoke her structural practice because every record failure is a design failure.','The hearing did not examine the calculations. The order can address the records.'),
  ('The panel orders her bookkeeper to resign. A records order works only if the bookkeeper goes.','The order is about her practice, not the bookkeeper\'s job.'),
  ('The panel has no power except a national ban from every project.','A records finding does not produce a national ban.')],
 'The finding was about the records. The order can match that finding.')

def tighten(text):
    protected = (text.replace('P.Eng.', 'PENG')
                     .replace('P.Geo.', 'PGEO')
                     .replace('e.g.', 'EG'))
    parts = re.split(r'(?<=\.)\s+', protected.strip())
    if len(parts) > 1 and len(parts[0]) >= 95:
        protected = parts[0]
    return protected.replace('PENG', 'P.Eng.').replace('PGEO', 'P.Geo.').replace('EG', 'e.g.')

for item in items:
    item['correct'] = tighten(item['correct'])
    item['wrongs'] = [(tighten(t), r) for t, r in item['wrongs']]

def balance(item):
    correct = item['correct']
    wrongs = [list(pair) for pair in item['wrongs']]
    used = set()
    for _ in range(4):
        wrong_lens = [len(pair[0]) for pair in wrongs]
        gap = len(correct) - max(wrong_lens)
        if gap <= 12:
            break
        order = sorted(range(3), key=lambda i: (i in used, wrong_lens[i]))
        placed = False
        for index in order:
            if index in used:
                continue
            text, rebuttal = wrongs[index]
            extra = rebuttal.strip().rstrip('.')
            if not extra or extra.lower() in text.lower():
                used.add(index)
                continue
            room = max(len(correct) - len(text) - 1, 0)
            if room < 20:
                used.add(index)
                continue
            piece = extra if len(extra) <= room else extra[:room].rsplit(' ', 1)[0]
            if len(piece) < 20:
                used.add(index)
                continue
            sentence = piece[0].upper() + piece[1:]
            if sentence[-1] not in '.?!':
                sentence += '.'
            wrongs[index][0] = text.rstrip() 
            if not wrongs[index][0].endswith('.'):
                wrongs[index][0] += '.'
            wrongs[index][0] += ' ' + sentence
            used.add(index)
            placed = True
            break
        if not placed:
            break
    item['wrongs'] = [tuple(pair) for pair in wrongs]

for item in items:
    balance(item)

SUB = {
    'I': 'nppe-professionalism', 'II': 'nppe-ethics', 'III': 'nppe-practice',
    'IV': 'nppe-law', 'V': 'nppe-professional-law', 'VI': 'nppe-discipline'
}

def keys_for(n):
    targets = [28, 27, 28, 27]
    counts = [0, 0, 0, 0]
    prev = None
    out = []
    for _ in range(n):
        choices = [k for k in range(4) if k != prev and counts[k] < targets[k]]
        if not choices:
            choices = [k for k in range(4) if k != prev]
        k = min(choices, key=lambda i: (counts[i], i))
        out.append(k)
        counts[k] += 1
        prev = k
    return out

LETTERS = 'ABCD'
places = keys_for(len(items))

def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

def html_p(s):
    return '<p>' + s.replace('&', '&').replace('<', '<').replace('>', '>') + '</p>'

blocks = []
for index, item in enumerate(items):
    n = 611 + index
    area = item['code'].split('.')[0]
    experimental = index >= 100
    key = places[index]
    options = [None] * 4
    rationales = [None] * 4
    options[key] = item['correct']
    rationales[key] = item['why']
    wi = 0
    for i in range(4):
        if i == key:
            continue
        text, rebuttal = item['wrongs'][wi]
        wi += 1
        options[i] = text
        rationales[i] = rebuttal + ' ' + item['why'].split('. ')[0] + '.'
    why_html = html_p(item['why']) + '<p><strong>Blueprint:</strong> ' + item['code'] + '. This is an original practice item, not an official NPPE question' + (', and it is unscored' if experimental else '') + '. A raw score on this form is not the scaled NPPE cut of 65.</p>'
    block = """    {{
      qid: 'nppe:set-3:{n}',
      legacyId: 'NPPE-{n}',
      sub: '{sub}',
      blueprint: '{code}',
      area: '{area}',
      form: 'mock-e',
      authorSet: 3,
      scored: {scored},
      experimental: {exp},
      difficulty: '{diff}',
      stem: '{stem}',
      options: [
{opts}
      ],
      answer: {answer},
      why: '{why}',
      optionRationales: [
{rats}
      ],
      keyPoint: '{keypoint}',
      trap: '{trap}',
      original: true,
      sourceDocument: 'Original UpSkill Sprint item for NPPE Set 3, Mock E. Grounded in the 2017 NPPE blueprint and Canadian professional practice principles. Not a regulator item and not copied from a publisher test bank.'
    }}""".format(
        n=n, sub=SUB[area], code=item['code'], area=area,
        scored='false' if experimental else 'true',
        exp='true' if experimental else 'false',
        diff=item['diff'], stem=esc(item['stem']),
        opts=',\n'.join("        '" + esc(o) + "'" for o in options),
        answer=key, why=esc(why_html),
        rats=',\n'.join("        '" + esc(r) + "'" for r in rationales),
        keypoint=esc(item['why'].split('. ')[0] + '.'),
        trap=esc(options[(key + 1) % 4])
    )
    blocks.append(block)

file = """/*
 * NPPE author Set 3 — Mock E only.
 * Complete form: NPPE-611 through NPPE-720 (110).
 * Scored: 100. Unscored experimental: NPPE-711 through NPPE-720.
 * Do not show the candidate which ten are unscored.
 * These items stay inside Set 3. They must not be copied into Set 1 or Set 2.
 * No item repeats a Mock D question.
 * Length must not identify the keyed choice. Letters are mixed.
 * Each wrong choice explains that choice.
 * Original questions. Not affiliated with any Canadian engineering or geoscience regulator.
 * A raw percentage is not the equated NPPE scaled score, and 65 is not a raw-percent guarantee.
 */
(function (global) {{
  'use strict';
  var questions = [
{body}
  ];
  var REQUIRED = 110;
  var SCORED = 100;
  questions.forEach(function (q, index) {{
    var expected = 'nppe:set-3:' + String(611 + index);
    if (q.qid !== expected) throw new Error('NPPE Set 3 id sequence broken at ' + q.qid);
    if (q.form !== 'mock-e' || q.authorSet !== 3) throw new Error('NPPE Set 3 bank mismatch at ' + q.qid);
    if (!q.options || q.options.length !== 4) throw new Error('NPPE Set 3 option count at ' + q.qid);
    if (q.answer < 0 || q.answer > 3) throw new Error('NPPE Set 3 answer at ' + q.qid);
    if (q.experimental !== (index >= SCORED) || q.scored === q.experimental) throw new Error('NPPE Set 3 scored flag at ' + q.qid);
    if (!q.optionRationales || q.optionRationales.length !== 4) throw new Error('NPPE Set 3 rationales at ' + q.qid);
    q.optionRationales.forEach(function (r, i) {{
      if (i !== q.answer && r.indexOf('Not the best answer') === 0) throw new Error('generic rationale ' + q.qid);
    }});
  }});
  global.NPPE_SET3 = questions;
  global.NPPE_MOCK_E = questions;
  global.registerNPPESet3 = function (exam) {{
    if (!exam) return;
    var releasedItems = questions.slice();
    var complete = releasedItems.length === REQUIRED;
    exam.forms = Object.assign({{}}, exam.forms, {{ 'mock-e': releasedItems }});
    exam.setPlans = Object.assign({{}}, exam.setPlans, {{
      3: {{
        form: 'mock-e',
        target: REQUIRED,
        released: releasedItems.length,
        scored: releasedItems.filter(function (q) {{ return q.scored; }}).length,
        experimental: releasedItems.filter(function (q) {{ return q.experimental; }}).length,
        label: 'Mock E — ' + releasedItems.length + ' of ' + REQUIRED,
        launchable: complete
      }}
    }});
    exam.mockLaunchable = Object.assign({{}}, exam.mockLaunchable, {{ 'mock-e': complete }});
  }};
}})(typeof window !== 'undefined' ? window : globalThis);
""".format(body=',\n'.join(blocks))

out = ROOT / 'test-bank-nppe-set3.js'
out.write_text(file)
print('wrote', out, 'bytes', out.stat().st_size)



