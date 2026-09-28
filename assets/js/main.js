// Small progressive enhancements. Every page is fully readable without JavaScript.
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  function readStore(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function writeStore(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

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

  // ---- View lens: strategy | bd | investing ----
  // Priority: ?lens= in the URL (shareable links) > last choice > default in the HTML.
  var LENSES = ['strategy', 'bd', 'investing'];

  function setLens(lens, updateUrl) {
    if (LENSES.indexOf(lens) === -1) return;
    root.setAttribute('data-lens', lens);
    document.querySelectorAll('[data-lens-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lens-btn') === lens ? 'true' : 'false');
    });
    // Carry the view onto internal links (case studies, back links, CV page)
    document.querySelectorAll('a[data-keep-lens]').forEach(function (a) {
      var href = a.getAttribute('href');
      var url = new URL(href, location.href);
      url.searchParams.set('lens', lens);
      a.setAttribute('href', href.split('?')[0].split('#')[0] + url.search + url.hash);
    });
    writeStore('aa-lens', lens);
    if (updateUrl && window.history && history.replaceState) {
      var u = new URL(location.href);
      u.searchParams.set('lens', lens);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    }
    // Case pages and the CV page title follow the view too
    if (document.body.hasAttribute('data-cv')) {
      var names = { strategy: 'Strategy', bd: 'Business Development', investing: 'Investing' };
      document.title = 'Ali Almasi - CV - ' + names[lens];
    }
  }

  var urlLens = new URLSearchParams(location.search).get('lens');
  var hasUrlLens = LENSES.indexOf(urlLens) > -1;
  setLens(hasUrlLens ? urlLens : (readStore('aa-lens') || root.getAttribute('data-lens') || 'strategy'));

  document.querySelectorAll('[data-lens-btn]').forEach(function (b) {
    b.addEventListener('click', function () { setLens(b.getAttribute('data-lens-btn'), true); });
  });

  // ---- Welcome guide (home page only) ----
  // Shown once to first-time visitors who did not arrive through a view-specific link.
  var welcome = document.getElementById('welcome');
  if (welcome) {
    var steps = welcome.querySelectorAll('.welcome-step');
    var lastFocus = null;

    var showStep = function (n) {
      steps.forEach(function (s) { s.hidden = s.getAttribute('data-step') !== String(n); });
      // Focus the panel itself (not the first option, which would look pre-selected);
      // Tab then moves through the options.
      var panel = welcome.querySelector('.welcome-panel');
      if (panel) panel.focus();
    };
    var open = function () {
      lastFocus = document.activeElement;
      welcome.hidden = false;
      document.body.classList.add('modal-open');
      showStep(1);
    };
    var close = function () {
      welcome.hidden = true;
      document.body.classList.remove('modal-open');
      writeStore('aa-welcome-seen', '1');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    welcome.querySelectorAll('[data-welcome-lens]').forEach(function (b) {
      b.addEventListener('click', function () {
        setLens(b.getAttribute('data-welcome-lens'), true);
        showStep(2);
      });
    });
    welcome.querySelectorAll('[data-welcome-close]').forEach(function (b) { b.addEventListener('click', close); });
    var casesBtn = welcome.querySelector('[data-welcome-cases]');
    if (casesBtn) casesBtn.addEventListener('click', function () {
      close();
      var work = document.getElementById('work');
      if (work) {
        work.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var table = work.querySelector('.work-table');
        if (table) { table.classList.remove('spotlight'); void table.offsetWidth; table.classList.add('spotlight'); }
      }
    });
    welcome.addEventListener('click', function (e) { if (e.target === welcome) close(); });
    document.addEventListener('keydown', function (e) {
      if (welcome.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {   // keep focus inside the dialog
        var f = [].slice.call(welcome.querySelectorAll('.welcome-step:not([hidden]) button'));
        if (!f.length) return;
        var i = f.indexOf(document.activeElement);
        if (i === -1) { e.preventDefault(); (e.shiftKey ? f[f.length - 1] : f[0]).focus(); }
        else if (e.shiftKey && i === 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    document.querySelectorAll('[data-welcome-open]').forEach(function (b) { b.addEventListener('click', open); });

    if (!hasUrlLens && !readStore('aa-welcome-seen')) open();
  }

  // ---- Footer year ----
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
