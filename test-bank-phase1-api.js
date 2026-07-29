(function () {
  'use strict';

  function status() {
    const style = document.getElementById('tb-feedback-loop-styles');
    const overview = document.getElementById('tb-overview');
    const feedback = document.getElementById('tb-feedback-loop');
    return {
      initialized: Boolean(style && overview),
      feedbackRendered: Boolean(feedback),
      reviewAvailable: Boolean(feedback && feedback.querySelector('[data-open-review],[data-review-tab]')),
      retryAvailable: Boolean(feedback && feedback.querySelector('[data-retry-missed]'))
    };
  }

  window.__TBFeedbackLoop = {
    status: status,
    healthy: function () {
      const current = status();
      return current.initialized && (!current.feedbackRendered || current.reviewAvailable);
    }
  };
}());
