(function () {
  'use strict';

  const LESSONS = [
    {
      marker: 'data-engineering-data-science-analysis-protocol',
      sectionId: 'ai-for-work',
      path: '/lessons/ai-for-work/engineering-data-science-analysis-protocol',
      topic: 'ai-for-work',
      level: 'advanced',
      interactive: 'true',
      search: 'engineering data science analysis protocol ai for work artificial intelligence prompts data quality model validation engineering analytics decision support reproducibility confounding grouped validation advanced interactive',
      meta: '<span>Advanced</span><span>Interactive</span><span>90 min</span><span>AI for Work</span>',
      title: 'Engineering Data Science Analysis Protocol',
      description: 'Apply a gated, AI-assisted workflow from decision framing and data quality through model validation, engineering interpretation, and reproducible delivery.'
    },
    {
      marker: 'data-introduction-to-analytics',
      sectionId: 'data-analytics',
      path: '/lessons/data-analytics/introduction-to-analytics',
      topic: 'data-analytics',
      level: 'beginner',
      interactive: 'true',
      search: 'introduction to analytics data analytics data analysis data science data mining descriptive diagnostic predictive prescriptive D2P3 analytics lifecycle data cleaning patterns trends seasonality correlation clustering anomalies associations business intelligence beginner interactive wall posters',
      meta: '<span>Beginner</span><span>Interactive</span><span>32 min</span><span>4 downloadable posters</span>',
      title: 'Introduction to Analytics',
      description: 'See how analytics turns raw data into decisions through visual models, an editable factory example, four downloadable wall posters, and an interactive pattern explorer.'
    },
    {
      marker: 'data-hierarchical-data-analysis-steel-charpy',
      sectionId: 'data-analytics',
      path: '/lessons/data-analytics/hierarchical-data-analysis-steel-charpy',
      topic: 'data-analytics',
      level: 'advanced',
      interactive: 'true',
      search: 'hierarchical data analysis mixed effects multilevel model nested crossed levels predictors charpy steel pseudoreplication cluster bootstrap gee robust covariance excel minitab python r advanced interactive',
      meta: '<span>Advanced</span><span>Interactive</span><span>75 min</span><span>Excel + Minitab + Python + R</span>',
      title: 'Hierarchical Data Analysis for Steel Charpy',
      description: 'Build a defensible model for nested or crossed engineering data with a flexible scenario configurator, method ranking, diagnostics, software playbooks, and practice data.'
    },
    {
      marker: 'data-after-the-model',
      sectionId: 'data-analytics',
      path: '/lessons/data-analytics/after-the-model',
      topic: 'data-analytics',
      level: 'advanced',
      interactive: 'true',
      search: 'after the model prediction confidence interval prediction interval response optimization desirability solver robust design taguchi monte carlo capability cpk confirmation runs spc drift monitoring dmaic minitab predict excel data analytics advanced interactive',
      meta: '<span>Advanced</span><span>Interactive</span><span>55 min</span><span>Minitab + Excel + Python</span>',
      title: 'After the Model \u2014 Prediction, Optimization & Beyond',
      description: 'Turn a fitted model into decisions: predict with the right interval, optimize and robustify settings, simulate capability, confirm against reality, and monitor for drift.'
    },
    {
      marker: 'data-model-tuning-and-evaluation',
      sectionId: 'data-analytics',
      path: '/lessons/data-analytics/model-tuning-and-evaluation',
      topic: 'data-analytics',
      level: 'intermediate',
      interactive: 'true',
      search: 'model tuning evaluation overfitting underfitting cross validation holdout bias variance hyperparameter regularization grid search regression metrics mae mse rmse r2 classification precision recall f1 roc auc confusion matrix clustering silhouette quantile pinball regression diagnostics residuals normality durbin watson condition number multicollinearity vif groupkfold conditional mean data analytics intermediate interactive posters',
      meta: '<span>Intermediate</span><span>Interactive</span><span>45 min</span><span>4 downloadable posters</span>',
      title: 'Model Tuning & Evaluation',
      description: 'Judge whether a model is actually good: what it predicts, honest validation and tuning, the right metric for the problem, and how to read regression diagnostics \u2014 with interactive widgets and four downloadable posters.'
    },
    {
      marker: 'data-dealing-with-outliers',
      sectionId: 'data-analytics',
      path: '/lessons/data-analytics/dealing-with-outliers',
      topic: 'data-analytics',
      level: 'intermediate',
      interactive: 'true',
      search: 'dealing with outliers outlier detection z-score modified z-score median absolute deviation mad iqr tukey fences grubbs test boxplot masking swamping winsorizing trimming influential point special cause variation steel mining data analytics intermediate interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>45 min</span><span>Excel + Minitab</span>',
      title: 'Dealing with Outliers: A Steel & Mining Detective\u2019s Guide',
      description: 'Hunt down rogue data points with Z-scores, Modified Z-scores, Tukey fences, and Grubbs\u2019 test using a live steel-mill and mine-site investigation lab with switchable chart views.'
    },
    {
      marker: 'data-anova-analysis-one-stop-shop',
      sectionId: 'statistics',
      path: '/lessons/statistics/anova-analysis-one-stop-shop',
      topic: 'statistics',
      level: 'intermediate',
      interactive: 'true',
      search: 'anova analysis of variance one way two way factorial welch repeated measures ancova manova mancova interaction f statistic p value effect size tukey post hoc excel analysis toolpak minitab statistics',
      meta: '<span>Intermediate</span><span>Interactive</span><span>90–110 min</span><span>Excel + Minitab</span>',
      title: 'ANOVA Analysis: One-Stop Masterclass',
      description: 'Select, calculate, diagnose and interpret one-way, factorial, repeated-measures, ANCOVA, MANOVA and MANCOVA—with Excel and Minitab guidance.'
    },
    {
      marker: 'data-chi-square-goodness-of-fit',
      sectionId: 'statistics',
      path: '/lessons/statistics/chi-square-goodness-of-fit-test',
      topic: 'statistics',
      level: 'intermediate',
      interactive: 'true',
      search: 'chi square goodness of fit test observed expected counts probabilities degrees of freedom p value calculator distribution graph worked example quiz statistics',
      meta: '<span>Intermediate</span><span>Interactive</span>',
      title: 'Chi-Square Goodness-of-Fit Test',
      description: 'Test whether observed category counts fit an expected distribution using a live calculator, graph, worked example, and quiz.'
    },
    {
      marker: 'data-permutations-combinations',
      sectionId: 'statistics',
      path: '/lessons/statistics/permutations-and-combinations',
      topic: 'statistics',
      level: 'beginner',
      interactive: 'true',
      search: 'permutations combinations counting methods factorial npr ncr order replacement repetition probability statistics beginner interactive excel minitab',
      meta: '<span>Beginner</span><span>Interactive</span><span>25 min</span><span>Excel + Minitab</span>',
      title: 'Permutations & Combinations',
      description: 'Master order, replacement, and repetition with live counting visuals, worked examples, decision rules, Excel and Minitab implementation, and interactive practice.'
    },
    {
      marker: 'data-normal-distribution',
      sectionId: 'statistics',
      path: '/lessons/statistics/the-normal-distribution-meet-the-bell-curve',
      topic: 'statistics',
      level: 'beginner',
      interactive: 'true',
      search: 'normal distribution bell curve gaussian empirical rule 68 95 99.7 z score standard deviation probability percentile statistics basics beginner interactive calculator',
      meta: '<span>Beginner</span><span>Interactive</span><span>15 min</span>',
      title: 'The Normal Distribution: Meet the Bell Curve',
      description: 'Master the bell curve, the 68-95-99.7 rule, and z-scores with interactive graphs, a live calculator, worked examples, and a quiz.'
    },
    {
      marker: 'data-resampling-in-minitab',
      sectionId: 'statistics',
      path: '/lessons/statistics/resampling-in-minitab',
      topic: 'statistics',
      level: 'beginner',
      interactive: 'true',
      search: 'resampling bootstrap randomization test permutation test confidence interval p value minitab excel simulation statistics beginner interactive',
      meta: '<span>Beginner</span><span>Interactive</span><span>90 min</span><span>Minitab + Excel</span>',
      title: 'Resampling in Minitab',
      description: 'Learn bootstrap confidence intervals and randomization tests through five guided Minitab labs, editable datasets, live simulations, and coached interpretation.'
    },
    {
      marker: 'data-chebyshev-empirical-rule',
      sectionId: 'statistics',
      path: '/lessons/statistics/chebyshev-inequality-vs-empirical-rule',
      topic: 'statistics',
      level: 'beginner',
      interactive: 'true',
      search: 'chebyshev inequality theorem empirical rule 68 95 99.7 distribution bounds mean standard deviation normal non-normal probability statistics beginner interactive calculator',
      meta: '<span>Beginner</span><span>Interactive</span><span>22 min</span>',
      title: 'Chebyshev vs. the Empirical Rule',
      description: 'Compare guaranteed and normal-distribution coverage with live overlaid curves, distribution shapes, bounds, and practice challenges.'
    },
    {
      marker: 'data-pearson-spearman-kendall-correlation',
      sectionId: 'statistics',
      path: '/lessons/statistics/pearson-spearman-kendall-correlation-coefficients',
      topic: 'statistics',
      level: 'intermediate',
      interactive: 'true',
      search: 'pearson correlation spearman rank correlation kendall tau correlation coefficient concordant discordant pairs monotonic relationship linear relationship nonparametric correlation correlation vs causation outliers ranks excel minitab statistics intermediate interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>~50 min</span><span>Excel + Minitab</span>',
      title: 'Pearson, Spearman & Kendall Correlation',
      description: 'Compare linear, monotonic, and rank-based association with a live relationship explorer, a concordant/discordant pairs demo, a paste-your-own-data calculator, and Excel + Minitab guidance.'
    },
    {
      marker: 'data-beyond-the-bell',
      sectionId: 'statistics',
      path: '/lessons/statistics/beyond-the-bell-the-normal-distribution-and-its-relatives',
      topic: 'statistics',
      level: 'intermediate',
      interactive: 'true',
      search: 'beyond the bell normal related distributions central limit theorem clt weibull lognormal student t binomial poisson exponential chi square standard error sampling distribution reliability density pdf cdf intermediate interactive simulator',
      meta: '<span>Intermediate</span><span>Interactive</span><span>20 min</span>',
      title: 'Beyond the Bell: The Normal Distribution and Its Relatives',
      description: 'See how the normal connects to the Weibull, lognormal, t, binomial and more — with a live Central Limit Theorem simulator.'
    },
    {
      marker: 'data-minitab-best-predictive-regression-model',
      sectionId: 'statistics',
      path: '/lessons/minitab-best-predictive-regression-model',
      topic: 'statistics',
      level: 'advanced',
      interactive: 'true',
      search: 'minitab best predictive regression model model selection polynomial regression interactions squares cubic hierarchy forward selection cross validation grouped folds validation r squared rmse mad vif residuals MARS discover best model automated machine learning statistics advanced interactive',
      meta: '<span>Advanced</span><span>Interactive</span><span>30–40 min</span><span>Minitab</span>',
      title: 'Finding the Best Predictive Regression Model in Minitab',
      description: 'Build, validate, challenge, and select an interpretable predictive model using polynomial regression, grouped cross-validation, MARS, and automated model comparison.'
    },
    {
      marker: 'data-choosing-right-regression-analysis-minitab',
      sectionId: 'statistics',
      path: '/lessons/statistics/choosing-the-right-regression-analysis-in-minitab',
      topic: 'statistics',
      level: 'intermediate',
      interactive: 'true',
      search: 'choosing right regression analysis minitab fitted line plot fit regression model stepwise forward selection backward elimination forward information criteria validation best subsets nonlinear regression interactions hierarchy polynomial intermediate statistics',
      meta: '<span>Intermediate</span><span>Interactive</span><span>60 min</span><span>Minitab</span>',
      title: 'Choosing the Right Regression Analysis in Minitab',
      description: 'Choose among fitted line plots, multiple regression, stepwise methods, Best Subsets, validation, interactions, polynomial models, and nonlinear regression.'
    },
    {
      marker: 'data-minitab-control-chart-master-guide',
      sectionId: 'power-bi-excel-sql',
      path: '/lessons/power-bi-excel-sql/minitab-control-chart-selection-analysis',
      topic: 'power-bi-excel-sql',
      level: 'intermediate',
      interactive: 'true',
      search: 'minitab control chart master guide control charts spc chart selection xbar r xbar s i mr i-mr-r-s between within p np c u laney ewma cusum zone rare event g t multivariate power bi excel sql intermediate interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>55 min</span><span>Minitab</span>',
      title: 'Minitab Control Chart Master Guide',
      description: 'Choose the right control chart, prepare your worksheet, navigate Minitab, and interpret special-cause signals with confidence.'
    },
    {
      marker: 'data-process-capability',
      sectionId: 'lean-six-sigma',
      path: '/lessons/lean-six-sigma/process-capability-cp-and-cpk',
      topic: 'lean-six-sigma',
      level: 'beginner',
      interactive: 'true',
      search: 'process capability cp cpk capability index specification limits usl lsl voice of customer voice of process six sigma capability analysis 1.33 ppk pp minitab excel lean six sigma beginner interactive',
      meta: '<span>Beginner</span><span>Interactive</span><span>15 min</span>',
      title: 'Process Capability: Will Your Process Meet the Spec?',
      description: 'Learn Cp and Cpk with a live capability explorer: specs, spread, centering, the 1.33 benchmark, and Excel & Minitab how-tos.'
    },
    {
      marker: 'data-overall-equipment-effectiveness',
      sectionId: 'lean-six-sigma',
      path: '/lessons/overall-equipment-effectiveness-oee',
      topic: 'lean-six-sigma',
      level: 'intermediate',
      interactive: 'true',
      search: 'oee overall equipment effectiveness availability performance quality eight losses six big losses tpm total productive maintenance small stops minor stoppages setup adjustment reduced speed ideal cycle time run time planned production time teep downtime threshold logged lost excel minitab pareto lean six sigma asq cssbb cqe interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>28 min</span>',
      title: 'Overall Equipment Effectiveness (OEE) and the Eight Losses',
      description: 'Six live interactives: calculate OEE three ways, map all eight TPM losses, and settle why small stops are a performance loss while setup is an availability loss.'
    },
    {
      marker: 'data-introduction-doe',
      sectionId: 'lean-six-sigma',
      path: '/lessons/introduction-to-design-of-experiment-doe',
      topic: 'lean-six-sigma',
      level: 'intermediate',
      interactive: 'true',
      search: 'doe design of experiment design of experiments factorial design two factor two level three factor two level 2x2 2 cubed main effects interaction effects cube minitab excel lean six sigma interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>30 min</span>',
      title: 'Introduction to Design of Experiment (DOE)',
      description: 'DOE, Design of Experiment'
    },
    {
      marker: 'data-short-run-spc-control-charts',
      sectionId: 'lean-six-sigma',
      path: '/lessons/lean-six-sigma/short-run-spc-control-charts',
      topic: 'lean-six-sigma',
      level: 'intermediate',
      interactive: 'true',
      search: 'short run spc short-run control charts high mix low volume x nominal x target dnom z mr z-mr z w standardized p np c u chart selection product family steel mill minitab excel lean six sigma intermediate interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>50 min</span><span>Excel + Minitab</span>',
      title: 'Short-Run SPC: Control Charts for High-Mix, Low-Volume Processes',
      description: 'Select, calculate, and interpret short-run SPC charts using a clickable decision flowchart, product-family checks, and steel-mill examples.'
    },
    {
      marker: 'data-understanding-dot-notation',
      sectionId: 'statistics',
      path: '/lessons/statistics/understanding-dot-notation',
      topic: 'statistics',
      level: 'beginner',
      interactive: 'true',
      search: 'dot notation anova doe row total column total grand total summation sum then square square then sum squared total sum of squared observations correction factor raw sum of squares excel sumsq minitab beginner general interactive',
      meta: '<span>Beginner</span><span>General</span><span>10 min</span>',
      title: 'Understanding Dot Notation',
      description: 'Dot notation'
    },
    {
      marker: 'data-gauge-rr-study',
      sectionId: 'quality-engineering',
      path: '/lessons/quality-engineering/gauge-rr-study',
      topic: 'quality-engineering',
      level: 'beginner',
      interactive: 'true',
      search: 'gage r&r gauge r&r measurement system analysis msa repeatability reproducibility bias linearity stability ndc percent study variation percent tolerance crossed nested minitab excel quality engineering beginner interactive',
      meta: '<span>Beginner</span><span>Interactive</span><span>75 min</span><span>Minitab + Excel</span>',
      title: 'Gage R&R for Beginners',
      description: 'See repeatability, reproducibility, bias, linearity, and stability change in real time, then design and interpret a defensible Gage R&R study.'
    },
    {
      marker: 'data-cost-of-poor-quality',
      sectionId: 'quality-engineering',
      path: '/lessons/quality-engineering/cost-of-poor-quality',
      topic: 'quality-engineering',
      level: 'intermediate',
      interactive: 'true',
      search: 'cost of poor quality copq cost of quality coq prevention appraisal failure paf model juran internal failure cost external failure cost quality costs cssbb cqe intermediate interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>40 min</span>',
      title: 'Cost of Poor Quality (COPQ)',
      description: 'Learn the Prevention-Appraisal-Failure model, calculate COPQ, and practice classifying quality costs with a dive-the-iceberg interactive.'
    },
    {
      marker: 'data-essential-quality-tools',
      sectionId: 'quality-engineering',
      path: '/lessons/7-essential-quality-tools',
      topic: 'quality-engineering',
      level: 'beginner',
      interactive: 'true',
      search: '7 essential quality tools seven basic qc tools flowchart process map check sheet stratification pareto fishbone histogram scatter plot control chart quality engineering ASQ CSSBB CQE interactive',
      meta: '<span>Beginner</span><span>Interactive</span><span>30 min</span>',
      title: 'The 7 Essential Quality Tools',
      description: 'Learn when and why to use each QC tool through live simulators, a tool-selection wizard, and a steel tensile-failure investigation.'
    },
    {
      marker: 'data-management-planning-tools',
      sectionId: 'quality-engineering',
      path: '/lessons/7-management-planning-tools',
      topic: 'quality-engineering',
      level: 'intermediate',
      interactive: 'true',
      search: '7 management planning tools affinity diagram interrelationship digraph tree diagram prioritization matrix matrix diagram PDPC activity network quality engineering ASQ CQE CSSBB interactive',
      meta: '<span>Intermediate</span><span>Interactive</span><span>35 min</span>',
      title: 'The 7 Management & Planning Tools',
      description: 'Turn a confirmed cause into an executable plan with affinity grouping, weighted prioritization, RACI ownership, PDPC, and critical-path logic.'
    },
    {
      marker: 'data-complete-quality-toolbox',
      sectionId: 'quality-engineering',
      path: '/lessons/complete-14-quality-tools-project',
      topic: 'quality-engineering',
      level: 'advanced',
      interactive: 'true',
      search: 'complete 14 quality tools project integrated quality engineering root cause corrective action capstone QC tools management planning tools ASQ CSSBB CQE advanced interactive',
      meta: '<span>Advanced</span><span>Interactive</span><span>45 min</span>',
      title: 'The Complete Quality Toolbox: All 14 Tools',
      description: 'Run an end-to-end quality investigation from process mapping and root-cause evidence through corrective-action planning and sustainment.'
    }
  ];

  function isLessonsPage() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/lessons' || path.endsWith('/lessons.html');
  }

  function normalise(value) {
    return String(value || '').toLowerCase().trim();
  }

  function ensureLessonList(section) {
    let list = section && section.querySelector('.lesson-list');
    if (list) return list;

    const emptyTopic = section && section.querySelector('.empty-topic');
    if (!section || !emptyTopic) return null;

    emptyTopic.remove();
    section.removeAttribute('data-empty-category');
    section.setAttribute('data-category-section', '');
    list = document.createElement('div');
    list.className = 'lesson-list';
    section.appendChild(list);
    return list;
  }

  function updateCounts() {
    document.querySelectorAll('[data-category-section]').forEach(function (section) {
      const total = section.querySelectorAll('[data-lesson-item]').length;
      const categoryCount = section.querySelector('.category-count');
      if (categoryCount) categoryCount.textContent = total + (total === 1 ? ' lesson' : ' lessons');
    });

    const visibleCount = Array.from(document.querySelectorAll('[data-lesson-item]')).filter(function (lesson) {
      return !lesson.hidden;
    }).length;
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) resultsCount.textContent = visibleCount + (visibleCount === 1 ? ' lesson' : ' lessons');
  }

  function createLessonRow(definition) {
    const row = document.createElement('a');
    row.className = 'lesson-row';
    row.href = definition.path;
    row.setAttribute('data-lesson-item', '');
    row.setAttribute('data-topic', definition.topic);
    row.setAttribute('data-level', definition.level);
    row.setAttribute('data-interactive', definition.interactive);
    row.setAttribute(definition.marker, 'true');
    row.setAttribute('data-search', definition.search);
    row.innerHTML = `
      <div>
        <div class="lesson-meta">${definition.meta}</div>
        <h3>${definition.title}</h3>
        <p>${definition.description}</p>
      </div>
      <span class="lesson-action">Start lesson</span>`;
    return row;
  }

  const FEATURED_CATEGORY_NAMES = {
    'data-analytics': 'Data Analytics',
    'quality-engineering': 'Quality Engineering',
    'lean-six-sigma': 'Lean Six Sigma',
    'statistics': 'Statistics',
    'power-bi-excel-sql': 'Power BI, Excel & SQL',
    'project-management': 'Project Management',
    'business-decision-making': 'Business Decision-Making',
    'ai-for-work': 'AI for Work'
  };

  function titleCaseWord(value) {
    return String(value || '').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  // Pick a random lesson to feature on each visit / refresh (was a static "ANOVA in Plain English").
  function featureRandomLesson() {
    const section = document.getElementById('featured-section');
    const heading = document.getElementById('featured-heading');
    if (!section || !heading || !Array.isArray(LESSONS) || !LESSONS.length) return;
    const card = section.querySelector('.featured-lesson');
    if (!card) return;

    const pick = LESSONS[Math.floor(Math.random() * LESSONS.length)];
    if (!pick || !pick.title || !pick.path) return;

    heading.textContent = pick.title;

    const textColumn = heading.parentElement;
    const description = textColumn && textColumn.querySelector('p:not(.featured-label)');
    if (description && pick.description) description.textContent = pick.description;

    const meta = card.querySelector('.featured-meta');
    if (meta) {
      const category = FEATURED_CATEGORY_NAMES[pick.topic] || titleCaseWord(pick.topic);
      const level = titleCaseWord(pick.level);
      const parts = [category, level];
      if (pick.interactive === 'true' || pick.interactive === true) parts.push('Interactive');
      meta.textContent = '';
      parts.forEach(function (label) {
        const span = document.createElement('span');
        span.textContent = label;
        meta.appendChild(span);
      });
    }

    const action = card.querySelector('.featured-action');
    if (action) action.setAttribute('href', pick.path);
  }

  function installLessons() {
    if (!isLessonsPage()) return;

    featureRandomLesson();

    const managedRows = [];
    const affectedSections = new Set();

    LESSONS.forEach(function (definition) {
      const section = document.getElementById(definition.sectionId);
      const list = ensureLessonList(section);
      if (!section || !list) return;

      affectedSections.add(section);
      let row = list.querySelector('[' + definition.marker + ']');
      if (!row) {
        row = createLessonRow(definition);
        list.appendChild(row);
      }
      managedRows.push(row);
    });

    if (!managedRows.length) return;

    const searchInput = document.getElementById('lesson-search');
    const topicFilter = document.getElementById('topic-filter');
    const levelFilter = document.getElementById('level-filter');
    const interactiveFilter = document.getElementById('interactive-filter');
    const clearButton = document.getElementById('clear-filters');
    const noResults = document.getElementById('no-results');

    function syncLessons() {
      const query = normalise(searchInput && searchInput.value);
      const topic = topicFilter ? topicFilter.value : '';
      const level = levelFilter ? levelFilter.value : '';
      const interactiveOnly = Boolean(interactiveFilter && interactiveFilter.checked);

      managedRows.forEach(function (row) {
        const matches = (
          (!query || normalise(row.dataset.search).includes(query)) &&
          (!topic || row.dataset.topic === topic) &&
          (!level || row.dataset.level === level) &&
          (!interactiveOnly || row.dataset.interactive === 'true')
        );
        row.hidden = !matches;
      });

      affectedSections.forEach(function (section) {
        const hasVisibleLesson = Array.from(section.querySelectorAll('[data-lesson-item]')).some(function (lesson) {
          return !lesson.hidden;
        });
        section.hidden = !hasVisibleLesson;
      });

      updateCounts();

      if (noResults) {
        const visibleLessons = Array.from(document.querySelectorAll('[data-lesson-item]')).some(function (lesson) {
          return !lesson.hidden;
        });
        const visibleEmptySection = Array.from(document.querySelectorAll('[data-empty-category]')).some(function (emptySection) {
          return !emptySection.hidden;
        });
        noResults.hidden = visibleLessons || visibleEmptySection;
      }
    }

    [searchInput, topicFilter, levelFilter, interactiveFilter].forEach(function (control) {
      if (!control || control.dataset.dynamicLessonListener === 'true') return;
      control.dataset.dynamicLessonListener = 'true';
      control.addEventListener(control.type === 'search' ? 'input' : 'change', syncLessons);
    });

    if (clearButton && clearButton.dataset.dynamicLessonListener !== 'true') {
      clearButton.dataset.dynamicLessonListener = 'true';
      clearButton.addEventListener('click', function () {
        window.setTimeout(syncLessons, 0);
      });
    }

    syncLessons();
    window.setTimeout(function () {
      syncLessons();
      updateCounts();
    }, 0);
    window.requestAnimationFrame(updateCounts);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installLessons, { once: true });
  } else {
    installLessons();
  }
}());
