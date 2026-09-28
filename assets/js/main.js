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

  // ---- Footer year ----
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
