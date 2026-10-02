(function () {
  'use strict';
  var frame = document.getElementById('excel-introduction-frame');
  if (!frame) return;
  var cleanup;
  function connect() {
    if (cleanup) cleanup();
    var doc;
    try { doc = frame.contentDocument; } catch (_) { return; }
    if (!doc || !doc.body) return;
    var pending = 0;
    function resize() {
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = 0;
        // Measure the body, rather than the viewport, so shorter modules shrink.
        var height = Math.ceil(doc.body.getBoundingClientRect().height) + 2;
        if (height > 0) frame.style.height = height + 'px';
      });
    }
    function navigate(event) {
      if (!event.target.closest('[data-go]')) return;
      resize();
      requestAnimationFrame(function () {
        var nav = doc.querySelector('nav.steps');
        if (!nav) return;
        frame.contentWindow.scrollTo(0, 0);
        window.scrollTo({
          top: frame.getBoundingClientRect().top + window.scrollY + nav.getBoundingClientRect().top - 80,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      });
    }
    var observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
    if (observer) observer.observe(doc.body);
    doc.addEventListener('click', navigate);
    doc.addEventListener('input', resize);
    doc.addEventListener('change', resize);
    window.addEventListener('resize', resize);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(resize);
    cleanup = function () {
      if (observer) observer.disconnect();
      cancelAnimationFrame(pending);
      doc.removeEventListener('click', navigate);
      doc.removeEventListener('input', resize);
      doc.removeEventListener('change', resize);
      window.removeEventListener('resize', resize);
    };
    resize();
  }
  frame.addEventListener('load', connect);
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') connect();
})();
