(function () {
  'use strict';

  var LESSON = '/lessons/project-management/pmp-formula-encyclopedia';
  var PMP_NOTE = 'Practice lookup. The real PMP exam does not provide this sheet.';
  var SOURCE = {
  "sections": [
    {
      "key": "People",
      "id": "pmp-people",
      "name": "People",
      "anchor": "section-pe"
    },
    {
      "key": "Process",
      "id": "pmp-process",
      "name": "Process",
      "anchor": "section-pr"
    },
    {
      "key": "Business Environment",
      "id": "pmp-business",
      "name": "Business Environment",
      "anchor": "section-be"
    }
  ],
  "formulas": [
    {
      "id": "PMP-CV",
      "num": "CV",
      "title": "Cost variance",
      "section": "Process",
      "family": "Earned value",
      "latex": "CV=EV-AC",
      "use": "Subtract actual cost from earned value.",
      "trap": "A negative result means the work completed cost more than its budget. Reversing the subtraction flips the meaning.",
      "aliases": [
        "Cost variance",
        "cost variance",
        "cv"
      ]
    },
    {
      "id": "PMP-SV",
      "num": "SV",
      "title": "Schedule variance",
      "section": "Process",
      "family": "Earned value",
      "latex": "SV=EV-PV",
      "use": "Subtract planned value from earned value.",
      "trap": "This variance is in the budget units of work, not in days. A negative result means less work is done than was planned by the data date.",
      "aliases": [
        "Schedule variance",
        "schedule variance",
        "sv"
      ]
    },
    {
      "id": "PMP-CPI",
      "num": "CPI",
      "title": "Cost performance index",
      "section": "Process",
      "family": "Earned value",
      "latex": "CPI=\\frac{EV}{AC}",
      "use": "Divide earned value by actual cost.",
      "trap": "A result below 1 means the completed work cost more than its budget. Actual cost does not belong in the numerator.",
      "aliases": [
        "Cost performance index",
        "cost performance index",
        "cpi"
      ]
    },
    {
      "id": "PMP-SPI",
      "num": "SPI",
      "title": "Schedule performance index",
      "section": "Process",
      "family": "Earned value",
      "latex": "SPI=\\frac{EV}{PV}",
      "use": "Divide earned value by planned value.",
      "trap": "A result below 1 means the project is behind the planned work. Planned value is the denominator, not actual cost.",
      "aliases": [
        "Schedule performance index",
        "schedule performance index",
        "spi"
      ]
    },
    {
      "id": "PMP-VAC",
      "num": "VAC",
      "title": "Variance at completion",
      "section": "Process",
      "family": "Earned value",
      "latex": "VAC=BAC-EAC",
      "use": "Subtract the estimate at completion from the budget at completion.",
      "trap": "A negative result means the forecast finishes over budget. Do not subtract the budget from the forecast.",
      "aliases": [
        "Variance at completion",
        "variance at completion",
        "vac"
      ]
    },
    {
      "id": "PMP-EAC-CPI",
      "num": "EAC",
      "title": "Estimate at completion, current cost efficiency",
      "section": "Process",
      "family": "Forecasting",
      "latex": "EAC=\\frac{BAC}{CPI}",
      "use": "Use this when the cost efficiency so far is expected to continue through the rest of the work.",
      "trap": "Do not add actual cost again. Dividing the budget by CPI already estimates the whole project.",
      "aliases": [
        "Estimate at completion, current cost efficiency",
        "estimate at completion",
        "current cost efficiency"
      ]
    },
    {
      "id": "PMP-EAC-BUDGET",
      "num": "EAC",
      "title": "Estimate at completion, budgeted rate for remaining work",
      "section": "Process",
      "family": "Forecasting",
      "latex": "EAC=AC+BAC-EV",
      "use": "Use this when the remaining work is expected to proceed at the original budgeted rate.",
      "trap": "This is not the budget divided by CPI. That other form assumes the current cost efficiency continues.",
      "aliases": [
        "Estimate at completion, budgeted rate for remaining work",
        "estimate at completion",
        "budgeted rate"
      ]
    },
    {
      "id": "PMP-EAC-BOTTOM",
      "num": "EAC",
      "title": "Estimate at completion, bottom-up remaining work",
      "section": "Process",
      "family": "Forecasting",
      "latex": "EAC=AC+\\text{bottom-up ETC}",
      "use": "Use this when the original plan is no longer valid and the remaining work is estimated again from the bottom up.",
      "trap": "Bottom-up ETC is a new estimate of what is left. It is not EAC minus AC taken from an older forecast, and a reestimate is not its own equation.",
      "aliases": [
        "Estimate at completion, bottom-up remaining work",
        "estimate at completion",
        "bottom-up"
      ]
    },
    {
      "id": "PMP-EAC-BOTH",
      "num": "EAC",
      "title": "Estimate at completion, cost and schedule efficiency",
      "section": "Process",
      "family": "Forecasting",
      "latex": "EAC=AC+\\frac{BAC-EV}{CPI\\times SPI}",
      "use": "Use this when both the cost efficiency and the schedule efficiency are expected to affect the remaining work.",
      "trap": "The denominator multiplies CPI by SPI. Adding the two indexes is a different number.",
      "aliases": [
        "Estimate at completion, cost and schedule efficiency",
        "estimate at completion",
        "cost and schedule efficiency"
      ]
    },
    {
      "id": "PMP-ETC",
      "num": "ETC",
      "title": "Estimate to complete",
      "section": "Process",
      "family": "Forecasting",
      "latex": "ETC=EAC-AC",
      "use": "Subtract actual cost from the estimate at completion you are using.",
      "trap": "ETC is the cost still to come. It is not the total at completion.",
      "aliases": [
        "Estimate to complete",
        "estimate to complete"
      ]
    },
    {
      "id": "PMP-TCPI-BAC",
      "num": "TCPI",
      "title": "To-complete performance index against the budget",
      "section": "Process",
      "family": "Forecasting",
      "latex": "TCPI=\\frac{BAC-EV}{BAC-AC}",
      "use": "This is the cost efficiency the remaining work must achieve to finish at the original budget.",
      "trap": "The denominator is the budget still unused, not the earned value.",
      "aliases": [
        "To-complete performance index against the budget",
        "to-complete performance index",
        "tcpi"
      ]
    },
    {
      "id": "PMP-TCPI-EAC",
      "num": "TCPI",
      "title": "To-complete performance index against the forecast",
      "section": "Process",
      "family": "Forecasting",
      "latex": "TCPI=\\frac{BAC-EV}{EAC-AC}",
      "use": "This is the cost efficiency the remaining work must achieve to finish at the current estimate at completion.",
      "trap": "Once the forecast replaces the budget as the goal, the denominator is EAC minus AC, not BAC minus AC.",
      "aliases": [
        "To-complete performance index against the forecast",
        "to-complete performance index",
        "tcpi"
      ]
    },
    {
      "id": "PMP-TRI",
      "num": "TRI",
      "title": "Triangular expected value",
      "section": "Process",
      "family": "Estimating",
      "latex": "t_E=\\frac{t_O+t_M+t_P}{3}",
      "use": "Add the optimistic, most likely, and pessimistic values, then divide by 3. The guide prints this for duration and the same algebra for cost.",
      "trap": "Do not put a 4 on the most likely value. That weight belongs to the beta form.",
      "aliases": [
        "Triangular expected value",
        "triangular",
        "three-point"
      ]
    },
    {
      "id": "PMP-BETA",
      "num": "BETA",
      "title": "Beta expected value",
      "section": "Process",
      "family": "Estimating",
      "latex": "c_E=\\frac{c_O+4c_M+c_P}{6}",
      "use": "The 6th edition prints this weighted average for a three-point cost estimate. The same weights are the expected-time form a duration question means by PERT.",
      "trap": "Dividing by 3 is the triangular card. The 4 belongs on the most likely estimate, not on the optimistic or pessimistic one.",
      "aliases": [
        "Beta expected value",
        "beta distribution",
        "pert"
      ]
    },
    {
      "id": "PMP-SIGMA",
      "num": "σ",
      "title": "PERT standard deviation",
      "section": "Process",
      "family": "Estimating",
      "latex": "\\sigma=\\frac{P-O}{6}",
      "use": "Subtract the optimistic estimate from the pessimistic estimate and divide by 6. Variance is that result squared. A path standard deviation is the square root of the sum of the activity variances.",
      "trap": "This is not the expected duration. The triangular and beta averages are other cards. Do not square the range before dividing by 6.",
      "aliases": [
        "PERT standard deviation",
        "standard deviation",
        "pert"
      ]
    },
    {
      "id": "PMP-TF",
      "num": "TF",
      "title": "Total float",
      "section": "Process",
      "family": "Schedule",
      "latex": "TF=LS-ES=LF-EF",
      "use": "Subtract the early start from the late start, or the early finish from the late finish. On the day-1 network, Activity B is 11 minus 6 and 15 minus 10, both 5 days.",
      "trap": "Total float is not free float. Free float looks only at the next activity. A negative result means the late date is already before the early date.",
      "aliases": [
        "Total float",
        "total float"
      ]
    },
    {
      "id": "PMP-FF",
      "num": "FF",
      "title": "Free float",
      "section": "Process",
      "family": "Schedule",
      "latex": "FF=ES_{\\text{successor}}-EF",
      "use": "Subtract this activity's early finish from the earliest early start of the activities that follow it.",
      "trap": "On a day-1 network, subtract one more day. Activity B finishes on day 10 and Activity D starts on day 16, so 16 minus 10 minus 1 is the figure's 5 days of free float. Late dates belong to total float, not this card.",
      "aliases": [
        "Free float",
        "free float"
      ]
    },
    {
      "id": "PMP-CH",
      "num": "n",
      "title": "Communication channels",
      "section": "Process",
      "family": "Communications",
      "latex": "\\text{Channels}=\\frac{n(n-1)}{2}",
      "use": "n is the number of people. Six people make 6 times 5 divided by 2, which is 15 channels.",
      "trap": "Do not use n squared, and do not forget to divide by 2. Adding one person adds a channel to every existing person, not a single new line.",
      "aliases": [
        "Communication channels",
        "communication channels"
      ]
    },
    {
      "id": "PMP-EMV",
      "num": "EMV",
      "title": "Expected monetary value",
      "section": "Business Environment",
      "family": "Risk",
      "latex": "\\mathrm{EMV}=\\sum(P\\times\\text{monetary outcome})",
      "use": "A chance node is the sum of each probability times its monetary outcome. Subtract an investment that is not already inside those outcomes, the way the decision-tree figure does.",
      "trap": "Do not choose the branch with the largest single payoff. Weight every outcome by its probability before the branches are compared.",
      "aliases": [
        "Expected monetary value",
        "expected monetary value",
        "emv",
        "decision tree"
      ]
    },
    {
      "id": "PMP-NPV",
      "num": "NPV",
      "title": "Net present value",
      "section": "Business Environment",
      "family": "Selection",
      "latex": "NPV=\\sum\\frac{CF_t}{(1+r)^t}",
      "use": "Discount each cash flow to today and add the results. A single present value is the future amount divided by (1 plus the rate) to the power of the period. When the question says to maximize value, the higher NPV wins.",
      "trap": "Do not compare undiscounted totals. A larger far-future payoff can lose once it is discounted. NPV is not the benefit-cost ratio.",
      "aliases": [
        "Net present value",
        "net present value",
        "npv"
      ]
    },
    {
      "id": "PMP-ROI",
      "num": "ROI",
      "title": "Return on investment",
      "section": "Business Environment",
      "family": "Selection",
      "latex": "ROI=\\frac{\\text{benefit}-\\text{cost}}{\\text{cost}}",
      "use": "Subtract cost from benefit, then divide by cost.",
      "trap": "ROI is not benefits divided by costs. That quotient is the benefit-cost ratio. A result of 1 is not the same statement as a benefit-cost ratio of 1.",
      "aliases": [
        "Return on investment",
        "return on investment",
        "roi"
      ]
    },
    {
      "id": "PMP-IRR",
      "num": "IRR",
      "title": "Internal rate of return",
      "section": "Business Environment",
      "family": "Selection",
      "latex": "0=\\sum\\frac{CF_t}{(1+\\mathrm{IRR})^t}",
      "use": "IRR is the discount rate that makes net present value zero. Compare it with the hurdle rate in the question. A typical series of cash flows has no closed-form rearrangement.",
      "trap": "Do not treat IRR as profit divided by cost. That is return on investment. A higher IRR is not automatically the choice when the question says to maximize net present value.",
      "aliases": [
        "Internal rate of return",
        "internal rate of return",
        "irr"
      ]
    },
    {
      "id": "PMP-PBP",
      "num": "PB",
      "title": "Payback period",
      "section": "Business Environment",
      "family": "Selection",
      "latex": "\\text{Payback}=\\frac{\\text{investment}}{\\text{annual net cash flow}}",
      "use": "When net cash flow is the same every year, divide the investment by that annual amount. When the cash flow changes by year, count the years until the investment is recovered.",
      "trap": "Payback ignores cash after the investment is recovered. It does not discount unless the question says discounted payback.",
      "aliases": [
        "Payback period",
        "payback period",
        "payback"
      ]
    },
    {
      "id": "PMP-BCR",
      "num": "BCR",
      "title": "Benefit-cost ratio",
      "section": "Business Environment",
      "family": "Selection",
      "latex": "BCR=\\frac{\\text{benefits}}{\\text{costs}}",
      "use": "Divide benefits by costs. A result above 1 means benefits exceed costs.",
      "trap": "Do not subtract cost from benefit before dividing. That subtraction is return on investment. A ratio of 1.2 is not a 120 percent return on investment.",
      "aliases": [
        "Benefit-cost ratio",
        "benefit-cost ratio",
        "benefit cost ratio",
        "bcr"
      ]
    }
  ]
};
  var SUB = {
    'pmp-people': 'pmp-people',
    'pmp-process': 'pmp-process',
    'pmp-business': 'pmp-business'
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      .replace(/"/g, '"').replace(/'/g, '&#39;');
  }

  function fold(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/[‐‑‒–—−-]/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function sectionByKey(key) {
    for (var i = 0; i < SOURCE.sections.length; i += 1) {
      if (SOURCE.sections[i].key === key) return SOURCE.sections[i];
    }
    return null;
  }

  function sectionById(id) {
    for (var i = 0; i < SOURCE.sections.length; i += 1) {
      if (SOURCE.sections[i].id === id) return SOURCE.sections[i];
    }
    return SOURCE.sections[1];
  }

  function sectionOf(item) {
    return sectionByKey(item.section) || SOURCE.sections[1];
  }

  function questionSection(question) {
    if (!question) return null;
    if (SUB[question.sub]) return sectionById(SUB[question.sub]);
    return null;
  }

  function aliasHit(stem, alias) {
    var folded = fold(alias);
    if (!folded) return 0;
    var haystack = ' ' + fold(stem) + ' ';
    return haystack.indexOf(' ' + folded + ' ') >= 0 ? folded.length : 0;
  }

  function bestAlias(item, stem) {
    var best = 0;
    (item.aliases || []).forEach(function (alias) {
      best = Math.max(best, aliasHit(stem, alias));
    });
    return best;
  }

  function recommend(stem, section) {
    var ranked = SOURCE.formulas.map(function (item) {
      return { item: item, score: bestAlias(item, stem), here: section && sectionOf(item).id === section.id };
    }).filter(function (row) { return row.score > 0; });
    ranked.sort(function (a, b) {
      if (a.here !== b.here) return a.here ? -1 : 1;
      return b.score - a.score;
    });
    var best = ranked.reduce(function (max, row) { return Math.max(max, row.score); }, 0);
    return ranked.filter(function (row) {
      return row.here || row.score >= best - 3;
    }).slice(0, 4).map(function (row) { return row.item; });
  }

  function searchText(item) {
    return fold([item.id, item.num, item.title, item.family, item.latex, item.use, item.trap, (item.aliases || []).join(' ')].join(' '));
  }

  function lessonHref(id) {
    return LESSON + '#formula=' + encodeURIComponent(id);
  }

  function formulaHtml(item, current) {
    return '<article class="tb-refitem tb-fcard' + (current ? ' is-current' : '') + '" data-formula-id="' + esc(item.id) + '">' +
      '<div class="tb-fhead"><div class="tb-refn">' + esc(item.title) + '</div>' +
      (current ? '<span class="tb-fbadge">Current question</span>' : '') + '</div>' +
      '<div class="tb-reff tb-fmath">\\[' + esc(item.latex) + '\\]</div>' +
      '<div class="tb-refnote2"><strong>Use when:</strong> ' + esc(item.use) + '</div>' +
      '<div class="tb-fcaution"><strong>Watch for:</strong> ' + esc(item.trap) + '</div>' +
      '<div class="tb-fqmap"><a href="' + esc(lessonHref(item.id)) + '" target="_blank" rel="noopener">Open in the PMP Formula Encyclopedia</a></div>' +
      '</article>';
  }

  function peopleNote() {
    return '<div class="tb-fconcept"><strong>The People domain has no calculation.</strong>' +
      '<span>Neither guide prints one for team, stakeholder, or conflict work. Search the box to look through Process and Business Environment.</span>' +
      '<a href="' + esc(LESSON + '#section-pe') + '" target="_blank" rel="noopener">Open the People note in the PMP Formula Encyclopedia</a></div>';
  }

  function refsGroups() {
    return SOURCE.sections.map(function (section) {
      var items = SOURCE.formulas.filter(function (item) { return item.section === section.key; }).map(function (item) {
        return { n: item.title, f: item.latex, note: item.use + ' Watch for: ' + item.trap };
      });
      if (!items.length) {
        items.push({
          n: 'No calculation',
          f: 'Neither guide prints a People formula.',
          note: 'Search Process and Business Environment when a question names a formula.'
        });
      }
      return { group: section.name, items: items };
    });
  }

  function typesetPane(host) {
    if (!host || !window.UpskillMath || typeof window.UpskillMath.typeset !== 'function') return;
    var job = window.UpskillMath.typeset([host]);
    if (job && typeof job.catch === 'function') job.catch(function () {});
  }

  function renderContextualPane(query) {
    var host = document.getElementById('tb-reflist');
    var drawer = document.getElementById('tb-formulas');
    if (!host || !drawer || drawer.hidden) return;
    var note = drawer.querySelector('.tb-refnote');
    if (note) note.textContent = PMP_NOTE;
    var api = window.__TB_FORMULAS_TEST__;
    var context = api && typeof api.getContext === 'function' ? api.getContext() : { question: null, sessionQuestion: null, set: null };
    var section = questionSection(context.question) || sectionById('pmp-process');
    var stem = context.question && context.question.stem || '';
    var q = fold(query == null ? ((document.getElementById('tb-refsearch') || {}).value || '') : query);
    var html = '<div class="tb-fcontextbar"><span>' + esc(section.name) + '</span>' +
      (context.set ? '<span>Exam Set ' + esc(context.set) + '</span>' : '') +
      '<span><a href="' + esc(LESSON) + '" target="_blank" rel="noopener">Full encyclopedia</a></span></div>';

    var picked = [];
    if (!q) {
      html += '<section class="tb-refgroup tb-currentgroup"><h4>Recommended for the current question</h4>';
      if (section.id === 'pmp-people') {
        html += peopleNote();
      } else {
        picked = recommend(stem, section);
        if (picked.length) {
          html += picked.map(function (item) { return formulaHtml(item, true); }).join('');
        } else {
          html += '<div class="tb-fconcept"><strong>Question ' + esc(context.sessionQuestion || '') + ' did not name a formula.</strong>' +
            '<span>The list below is this domain\'s sheet. It does not reveal the answer.</span></div>';
        }
      }
      html += '</section>';
    }

    if (!q && section.id === 'pmp-people') {
      host.innerHTML = html;
      typesetPane(host);
      return;
    }

    var pool = q ? SOURCE.formulas : SOURCE.formulas.filter(function (item) { return sectionOf(item).id === section.id; });
    var groups = {};
    pool.forEach(function (item) {
      if (!q && picked.some(function (chosen) { return chosen.id === item.id; })) return;
      if (q && searchText(item).indexOf(q) < 0) return;
      var name = sectionOf(item).name;
      groups[name] = groups[name] || [];
      groups[name].push(item);
    });
    var names = SOURCE.sections.map(function (item) { return item.name; }).filter(function (name) { return groups[name] && groups[name].length; });
    if (!names.length) {
      html += '<p class="tb-refempty">No formula matches “' + esc(query || '') + '”.</p>';
    } else {
      names.forEach(function (name) {
        html += '<section class="tb-refgroup"><h4>' + esc(q ? name : 'Formulas for ' + name) + '</h4>';
        html += groups[name].map(function (item) { return formulaHtml(item, false); }).join('');
        html += '</section>';
      });
    }
    host.innerHTML = html;
    typesetPane(host);
  }

  function installRefs() {
    var tb = window.__TB;
    if (!tb || !tb.REFS) return false;
    tb.REFS.pmp = refsGroups();
    return true;
  }

  var installed = false;
  function initialize(attempt) {
    attempt = attempt || 0;
    if (installed) return;
    if (!window.__TB) {
      if (attempt < 400) window.setTimeout(function () { initialize(attempt + 1); }, 25);
      return;
    }
    installed = true;
    installRefs();
  }

  window.__TB_PMP_FORMULAS = {
    lesson: LESSON,
    formulas: SOURCE.formulas,
    sections: SOURCE.sections,
    recommend: recommend,
    questionSection: questionSection,
    renderContextualPane: renderContextualPane,
    installRefs: installRefs
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initialize(0); }, { once: true });
  else initialize(0);
}());
