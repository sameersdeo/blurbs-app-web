(function () {
  // The dateline, as on the app's feed.
  var today = new Date();
  var dateline = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.querySelectorAll('.js-dateline').forEach(function (el) {
    el.textContent = dateline;
    if (el.tagName === 'TIME') el.dateTime = today.toISOString().slice(0, 10);
  });

  // The practice sheet. Same rule as the compose screen: the fifty-first word doesn't go in.
  var LIMIT = 50;
  var draft = document.getElementById('draft');
  var count = document.getElementById('count');
  var bar = document.getElementById('bar');
  var limit = document.getElementById('limit');

  function words(text) {
    return (text.match(/\S+/g) || []).length;
  }

  // Cut where the next word would begin, so a long paste is trimmed too.
  function clip(text) {
    var seen = 0;
    var match;
    var word = /\S+/g;
    while ((match = word.exec(text))) {
      seen += 1;
      if (seen > LIMIT) return text.slice(0, match.index);
    }
    return text;
  }

  function update() {
    var clipped = clip(draft.value);
    if (clipped !== draft.value) {
      var caret = draft.selectionStart;
      draft.value = clipped;
      draft.setSelectionRange(Math.min(caret, clipped.length), Math.min(caret, clipped.length));
    }
    var n = words(draft.value);
    var full = n >= LIMIT;
    count.textContent = n + ' / ' + LIMIT + ' words';
    bar.style.width = (n / LIMIT) * 100 + '%';
    draft.parentElement.classList.toggle('full', full);
    limit.textContent = full ? 'That’s fifty words.' : '';
  }

  draft.addEventListener('input', update);
  update();

  // The plates drift a breath toward the pointer, then settle back into place.
  var still = window.matchMedia('(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)');
  window.addEventListener('pointermove', function (e) {
    if (still.matches) return;
    var root = document.documentElement.style;
    root.setProperty('--press-nx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
    root.setProperty('--press-ny', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
  }, { passive: true });
})();
