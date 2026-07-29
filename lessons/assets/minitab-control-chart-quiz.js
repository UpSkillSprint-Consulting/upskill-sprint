    (() => {
      'use strict';
      const byId = (id) => document.getElementById(id);
      const quizForm = byId('quiz-form');
      const quizScore = byId('quiz-score');
      const quizQuestions = [...document.querySelectorAll('.quiz-question')];

      quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let score = 0;
        let answered = 0;
        quizQuestions.forEach((question) => {
          question.classList.remove('correct', 'incorrect');
          const selected = question.querySelector('input[type="radio"]:checked');
          const explanation = question.querySelector('.quiz-explanation');
          explanation.hidden = false;
          if (!selected) return;
          answered += 1;
          if (selected.value === question.dataset.answer) {
            score += 1;
            question.classList.add('correct');
          } else {
            question.classList.add('incorrect');
          }
        });
        if (answered < quizQuestions.length) {
          quizScore.textContent = `You answered ${answered} of ${quizQuestions.length}. Complete all questions for a final score.`;
        } else {
          const percent = Math.round((score / quizQuestions.length) * 100);
          quizScore.textContent = `Score: ${score}/${quizQuestions.length} (${percent}%). ${score === 5 ? 'Excellent chart-selection discipline.' : score >= 4 ? 'Strong result. Review the explanation for the missed item.' : 'Review the selector and category guides, then retry.'}`;
        }
      });

      byId('reset-quiz').addEventListener('click', () => {
        quizForm.reset();
        quizQuestions.forEach((question) => {
          question.classList.remove('correct', 'incorrect');
          question.querySelector('.quiz-explanation').hidden = true;
        });
        quizScore.textContent = 'Select one answer for each question, then submit.';
      });

    })();
