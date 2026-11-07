(function () {
  // The dateline, as on the app's feed.
  var today = new Date();
  var dateline = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.querySelectorAll('.js-dateline').forEach(function (el) {
    el.textContent = dateline;
    if (el.tagName === 'TIME') el.dateTime = today.toISOString().slice(0, 10);
  });

  // The plates drift a breath toward the pointer, then settle back into place.
  var still = window.matchMedia('(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)');
  window.addEventListener('pointermove', function (e) {
    if (still.matches) return;
    var root = document.documentElement.style;
    root.setProperty('--press-nx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
    root.setProperty('--press-ny', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
  }, { passive: true });
})();
