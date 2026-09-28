// Small progressive enhancements. The site works fully without JavaScript.
(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header border once the page is scrolled
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal on scroll. Fail-safe: only elements below the fold are ever hidden,
  // and they are revealed by a plain scroll/resize check (no rendering-dependent APIs).
  var pending = [];
  if (window.innerHeight > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pending'); pending.push(el); }
    });
  }
  var checkReveal = function () {
    if (!pending.length) return;
    var limit = window.innerHeight * 0.94;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { el.classList.remove('pending'); return false; }
      return true;
    });
  };
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal);
  window.addEventListener('hashchange', function () { setTimeout(checkReveal, 50); });
  // Printing or saving the page should always show everything
  window.addEventListener('beforeprint', function () { pending.forEach(function (el) { el.classList.remove('pending'); }); pending = []; });

  // ---- Direction lens: strategy | bd | investing ----
  // Priority: ?lens= in the URL (shareable links) > last choice > default in the HTML.
  var LENSES = ['strategy', 'bd', 'investing'];
  var root = document.documentElement;
  var STORE = 'aa-lens';

  function readStored() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(STORE, v); } catch (e) {} }

  function setLens(lens, opts) {
    if (LENSES.indexOf(lens) === -1) return;
    var apply = function () {
      root.setAttribute('data-lens', lens);
      document.querySelectorAll('[data-lens-btn]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-lens-btn') === lens ? 'true' : 'false');
      });
      // Carry the lens onto internal links (case studies, back links, CV page)
      document.querySelectorAll('a[data-keep-lens]').forEach(function (a) {
        var url = new URL(a.getAttribute('href'), location.href);
        url.searchParams.set('lens', lens);
        a.setAttribute('href', a.getAttribute('href').split('?')[0].split('#')[0] + url.search + url.hash);
      });
    };
    apply();
    if (opts && opts.animate) {
      document.querySelectorAll('[data-lens-anim]').forEach(function (el) {
        el.classList.remove('lens-fade'); void el.offsetWidth; el.classList.add('lens-fade');
      });
    }
    store(lens);
    if (opts && opts.updateUrl && window.history && history.replaceState) {
      var u = new URL(location.href);
      u.searchParams.set('lens', lens);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    }
  }

  var fromUrl = new URLSearchParams(location.search).get('lens');
  var initial = LENSES.indexOf(fromUrl) > -1 ? fromUrl : (readStored() || root.getAttribute('data-lens') || 'strategy');
  setLens(initial);

  document.querySelectorAll('[data-lens-btn]').forEach(function (b) {
    b.addEventListener('click', function () {
      setLens(b.getAttribute('data-lens-btn'), { animate: true, updateUrl: true });
    });
  });

  // Show the compact switcher in the header once the hero switcher scrolls away
  var heroBar = document.querySelector('.lens-bar');
  if (header && heroBar) {
    var checkHero = function () {
      header.classList.toggle('past-hero', heroBar.getBoundingClientRect().bottom < header.offsetHeight);
    };
    checkHero();
    window.addEventListener('scroll', checkHero, { passive: true });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
