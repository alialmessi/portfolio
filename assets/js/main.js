// Small progressive enhancements. Every page is fully readable without JavaScript.
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  // ---- Mobile menu ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---- Private views ----
  // A view (strategy | bd | vc) is chosen only by the link that was sent,
  // e.g. alialmessi.github.io/bd -> /?lens=bd. It is kept while the visitor browses
  // (case studies, CV page) but never shown or offered as a switch.
  var LENSES = ['strategy', 'bd', 'vc'];
  var lens = new URLSearchParams(location.search).get('lens');
  if (LENSES.indexOf(lens) > -1) {
    root.setAttribute('data-lens', lens);
    document.querySelectorAll('a[data-keep-lens]').forEach(function (a) {
      var href = a.getAttribute('href');
      var url = new URL(href, location.href);
      url.searchParams.set('lens', lens);
      a.setAttribute('href', href.split('?')[0].split('#')[0] + url.search + url.hash);
    });
  }

  // ---- Scroll cue ----
  // A small "Scroll for more" prompt at the bottom of the screen, so visitors know
  // the page continues. Shown only while at the top of a page that has more below.
  var cue = document.createElement('button');
  cue.type = 'button';
  cue.className = 'scroll-cue';
  cue.setAttribute('aria-label', 'Scroll down for more');
  cue.innerHTML = '<span>Scroll for more</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  document.body.appendChild(cue);
  var updateCue = function () {
    var vh = window.innerHeight;
    var more = vh > 0 && document.documentElement.scrollHeight - vh - window.scrollY > 160;
    cue.classList.toggle('show', window.scrollY < 40 && more);
  };
  cue.addEventListener('click', function () { window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: 'smooth' }); });
  updateCue();
  window.addEventListener('scroll', updateCue, { passive: true });
  window.addEventListener('resize', updateCue);
  window.addEventListener('load', updateCue);

  // ---- Footer year ----
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
