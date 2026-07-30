    (() => {
      'use strict';

      const byId = (id) => document.getElementById(id);

      const selectorForm = byId('selector-form');
      const dataFamily = byId('data-family');
      const continuousStructure = byId('continuous-structure');
      const continuousGoal = byId('continuous-goal');
      const attributeType = byId('attribute-type');
      const sampleSizePattern = byId('sample-size-pattern');
      const dispersionStatus = byId('dispersion-status');
      const multivariateGoal = byId('multivariate-goal');
      const rareType = byId('rare-type');
      const selectorResult = byId('selector-result');

      const groups = {
        continuousStructure: byId('continuous-structure-group'),
        continuousGoal: byId('continuous-goal-group'),
        attributeType: byId('attribute-type-group'),
        sampleSize: byId('sample-size-group'),
        dispersion: byId('dispersion-group'),
        multivariateGoal: byId('multivariate-goal-group'),
        rareType: byId('rare-type-group')
      };

      const recommendations = {
        'Xbar-R': {
          path: 'Stat > Control Charts > Variables Charts for Subgroups > Xbar-R',
          layout: 'Continuous observations plus subgroup IDs, or one subgroup per worksheet row.',
          order: 'Read R first, then Xbar.',
          anchor: '#chart-xbar-r'
        },
        'Xbar-S': {
          path: 'Stat > Control Charts > Variables Charts for Subgroups > Xbar-S',
          layout: 'Continuous observations plus subgroup IDs, or one subgroup per worksheet row.',
          order: 'Read S first, then Xbar.',
          anchor: '#chart-xbar-s'
        },
        'I-MR-R/S (Between/Within)': {
          path: 'Stat > Control Charts > Variables Charts for Subgroups > I-MR-R/S (Between/Within)',
          layout: 'Repeated measurements nested within each distinct part, batch, coil, or unit.',
          order: 'Read R/S first, MR second, I last.',
          anchor: '#chart-imrrs'
        },
        'Xbar': {
          path: 'Stat > Control Charts > Variables Charts for Subgroups > Xbar',
          layout: 'Subgrouped continuous observations.',
          order: 'Verify dispersion on a separate R or S chart before interpreting Xbar.',
          anchor: '#chart-xbar'
        },
        'R': {
          path: 'Stat > Control Charts > Variables Charts for Subgroups > R',
          layout: 'At least two continuous observations per smaller subgroup.',
          order: 'Interpret changes in within-subgroup range.',
          anchor: '#chart-r'
        },
        'S': {
          path: 'Stat > Control Charts > Variables Charts for Subgroups > S',
          layout: 'Larger subgroups of continuous observations.',
          order: 'Interpret changes in within-subgroup standard deviation.',
          anchor: '#chart-s'
        },
        'I-MR': {
          path: 'Stat > Control Charts > Variables Charts for Individuals > I-MR',
          layout: 'One chronological continuous observation per row.',
          order: 'Read MR first, then I.',
          anchor: '#chart-imr'
        },
        'Individuals': {
          path: 'Stat > Control Charts > Variables Charts for Individuals > Individuals',
          layout: 'One chronological continuous observation per row.',
          order: 'Use only after variation is assessed separately.',
          anchor: '#chart-individuals'
        },
        'Moving Range': {
          path: 'Stat > Control Charts > Variables Charts for Individuals > Moving Range',
          layout: 'One chronological continuous observation per row.',
          order: 'Interpret changes between consecutive observations.',
          anchor: '#chart-mr'
        },
        'Z-MR': {
          path: 'Stat > Control Charts > Variables Charts for Individuals > Z-MR',
          layout: 'Observation column plus product/run identifiers and defensible product-specific reference values.',
          order: 'Read MR of standardized observations, then Z.',
          anchor: '#chart-zmr'
        },
        'EWMA': {
          path: 'Stat > Control Charts > Time-Weighted Charts > EWMA',
          layout: 'Chronological individual values or subgroup means.',
          order: 'Investigate weighted-average signals using the process timeline.',
          anchor: '#chart-ewma'
        },
        'P': {
          path: 'Stat > Control Charts > Attributes Charts > P',
          layout: 'Number defective plus number inspected for every subgroup.',
          order: 'Interpret proportion defective and changing limits when sample sizes vary.',
          anchor: '#chart-p'
        },
        'NP': {
          path: 'Stat > Control Charts > Attributes Charts > NP',
          layout: 'Number defective with one constant subgroup size.',
          order: 'Interpret the count defective.',
          anchor: '#chart-np'
        },
        'Laney P′': {
          path: 'Stat > Control Charts > Attributes Charts > Laney P′',
          layout: 'Number defective plus number inspected.',
          order: 'Interpret the adjusted proportion-defective limits and dispersion factor.',
          anchor: '#chart-laney-p'
        },
        'U': {
          path: 'Stat > Control Charts > Attributes Charts > U',
          layout: 'Number of defects plus inspection opportunity for every subgroup.',
          order: 'Interpret defects per unit and changing limits.',
          anchor: '#chart-u'
        },
        'C': {
          path: 'Stat > Control Charts > Attributes Charts > C',
          layout: 'Number of defects with constant inspection opportunity.',
          order: 'Interpret the defect count.',
          anchor: '#chart-c'
        },
        'Laney U′': {
          path: 'Stat > Control Charts > Attributes Charts > Laney U′',
          layout: 'Number of defects plus inspection opportunity.',
          order: 'Interpret the adjusted defects-per-unit limits and dispersion factor.',
          anchor: '#chart-laney-u'
        },
        'T²-Generalized Variance': {
          path: 'Stat > Control Charts > Multivariate Charts > T²-Generalized Variance',
          layout: 'Each correlated continuous variable in a separate column, aligned by time or subgroup.',
          order: 'Read Generalized Variance first, then T².',
          anchor: '#chart-t2gv'
        },
        'T²': {
          path: 'Stat > Control Charts > Multivariate Charts > T²',
          layout: 'Each correlated variable in a separate column.',
          order: 'Investigate joint-mean signals, then identify contributing variables.',
          anchor: '#chart-t2'
        },
        'Generalized Variance': {
          path: 'Stat > Control Charts > Multivariate Charts > Generalized Variance',
          layout: 'Each correlated variable in a separate column with valid subgroups.',
          order: 'Investigate changes in joint variation and covariance.',
          anchor: '#chart-gv'
        },
        'Multivariate EWMA': {
          path: 'Stat > Control Charts > Multivariate Charts > Multivariate EWMA',
          layout: 'Each correlated variable in a separate chronological column.',
          order: 'Investigate small joint-mean shifts and identify contributors.',
          anchor: '#chart-mewma'
        },
        'G': {
          path: 'Stat > Control Charts > Rare Event Charts > G',
          layout: 'Event dates, whole-day spacing, or discrete opportunities between events.',
          order: 'Low spacing can indicate a worsening event rate.',
          anchor: '#chart-g'
        },
        'T': {
          path: 'Stat > Control Charts > Rare Event Charts > T',
          layout: 'Exact date-time stamps or continuous elapsed time between events.',
          order: 'Short elapsed times can indicate a worsening event rate.',
          anchor: '#chart-t'
        }
      };

      function updateSelectorVisibility() {
        const family = dataFamily.value;
        const isContinuous = family === 'continuous';
        const isAttribute = family === 'attribute';
        groups.continuousStructure.hidden = !isContinuous;
        groups.continuousGoal.hidden = !isContinuous;
        groups.attributeType.hidden = !isAttribute;
        groups.sampleSize.hidden = !isAttribute;
        groups.dispersion.hidden = !isAttribute;
        groups.multivariateGoal.hidden = family !== 'multivariate';
        groups.rareType.hidden = family !== 'rare';
      }

      function determineRecommendation() {
        const family = dataFamily.value;
        let chart = '';
        let rationale = '';

        if (family === 'continuous') {
          const structure = continuousStructure.value;
          const goal = continuousGoal.value;
          if (goal === 'small-shift') {
            chart = 'EWMA';
            rationale = 'The data are continuous and the primary objective is early detection of a small sustained mean shift.';
          } else if (goal === 'mixed-products') {
            chart = 'Z-MR';
            rationale = 'Different products or short runs require standardization before combining observations on one chart.';
          } else if (structure === 'nested') {
            chart = 'I-MR-R/S (Between/Within)';
            rationale = 'Repeated measurements are nested within distinct parts or batches, so within-unit and between-unit variation should be separated.';
          } else if (structure === 'individual') {
            chart = goal === 'mean-only' ? 'Individuals' : goal === 'variation-only' ? 'Moving Range' : 'I-MR';
            rationale = 'There is one continuous observation per time point.';
          } else if (structure === 'subgroup-small') {
            chart = goal === 'mean-only' ? 'Xbar' : goal === 'variation-only' ? 'R' : 'Xbar-R';
            rationale = 'The data are continuous with rational subgroups of 2–8.';
          } else {
            chart = goal === 'mean-only' ? 'Xbar' : goal === 'variation-only' ? 'S' : 'Xbar-S';
            rationale = 'The data are continuous with larger rational subgroups.';
          }
        } else if (family === 'attribute') {
          const type = attributeType.value;
          const pattern = sampleSizePattern.value;
          const dispersed = dispersionStatus.value === 'yes';
          if (type === 'defectives') {
            chart = dispersed ? 'Laney P′' : pattern === 'constant' ? 'NP' : 'P';
            rationale = dispersed
              ? 'The response is proportion defective and dispersion exceeds or falls below the traditional binomial expectation.'
              : pattern === 'constant'
                ? 'The response is a count of defective units with constant sample size.'
                : 'The response is a proportion of defective units with varying sample size.';
          } else {
            chart = dispersed ? 'Laney U′' : pattern === 'constant' ? 'C' : 'U';
            rationale = dispersed
              ? 'The response is defects per unit and dispersion differs from the traditional Poisson expectation.'
              : pattern === 'constant'
                ? 'The response is a count of defects with constant inspection opportunity.'
                : 'The response is defects per unit with varying inspection opportunity.';
          }
        } else if (family === 'multivariate') {
          const goal = multivariateGoal.value;
          chart = goal === 'mean' ? 'T²' : goal === 'variation' ? 'Generalized Variance' : goal === 'small-shifts' ? 'Multivariate EWMA' : 'T²-Generalized Variance';
          rationale = 'The process is described by two or more correlated continuous variables that should be monitored jointly.';
        } else {
          chart = rareType.value === 'continuous-time' ? 'T' : 'G';
          rationale = chart === 'T'
            ? 'Exact elapsed time or date-time information is available between rare events.'
            : 'The spacing is recorded as discrete opportunities, units, or whole days between rare events.';
        }

        return { chart, rationale, ...recommendations[chart] };
      }

      function showRecommendation(rec) {
        selectorResult.dataset.state = 'ready';
        selectorResult.innerHTML = `
          <p class="kicker">Recommended chart</p>
          <h3 class="recommendation-name">${rec.chart}</h3>
          <p>${rec.rationale}</p>
          <p><strong>Minitab navigation</strong></p>
          <div class="path">${rec.path}</div>
          <p><strong>Required data layout:</strong> ${rec.layout}</p>
          <p><strong>Interpretation order:</strong> ${rec.order}</p>
          <p><a class="button-link" href="${rec.anchor}">Open the detailed chart guide</a></p>`;
      }

      dataFamily.addEventListener('change', updateSelectorVisibility);
      selectorForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showRecommendation(determineRecommendation());
      });
      selectorForm.addEventListener('reset', () => {
        window.setTimeout(() => {
          updateSelectorVisibility();
          selectorResult.dataset.state = '';
          selectorResult.innerHTML = '<p class="kicker">Recommendation</p><h3>Complete the selector</h3><p>Your recommended chart, Minitab navigation path, data layout, and interpretation order will appear here.</p>';
        }, 0);
      });
      updateSelectorVisibility();

      const practiceButton = byId('reveal-practice');
      const practiceAnswer = byId('practice-answer');
      practiceButton.addEventListener('click', () => {
        const expanded = practiceButton.getAttribute('aria-expanded') === 'true';
        practiceButton.setAttribute('aria-expanded', String(!expanded));
        practiceButton.textContent = expanded ? 'Reveal answer' : 'Hide answer';
        practiceAnswer.hidden = expanded;
      });

    })();
