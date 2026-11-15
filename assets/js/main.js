/* Lonar Trading Company Limited: site behaviour and motion.
   Everything animates with transform / opacity / clip-path only, in one
   requestAnimationFrame loop, and switches off for "reduce motion". */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  if (reduce) root.classList.add('still');

  /* ---------- Settings: edit these two lines when details change ---------- */
  var WHATSAPP_NUMBER = '2348081008667';   // international format, digits only
  var WEB3FORMS_KEY = '';                  // paste a Web3Forms access key here to send enquiries by email

  /* ---------- Page curtain: reveal on load, cover on leave ---------- */
  function ready() { root.classList.add('is-ready'); }
  var readyTimer = setTimeout(ready, 600);
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function () { clearTimeout(readyTimer); setTimeout(ready, 120); });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { root.classList.remove('is-leaving'); ready(); }
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || reduce) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // same-page anchor
    if (!/\.html?$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    closeMenu();
    root.classList.add('is-leaving');
    setTimeout(function () { location.href = url.href; }, 560);
  });

  /* ---------- Smooth scrolling (mouse / trackpad only) ---------- */
  var lenis = null;
  function initLenis() {
    if (lenis || reduce || !finePointer || !window.Lenis) return;
    try {
      lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    } catch (err) { lenis = null; }
  }
  initLenis();
  window.addEventListener('load', initLenis);

  // In-page links glide to their target, below the fixed header.
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var offset = -((parseInt(getComputedStyle(root).getPropertyValue('--header-h'), 10) || 76) + 16);
      if (lenis) lenis.scrollTo(target, { offset: offset });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- Header + mobile menu ---------- */
  var header = $('.site-header');
  var menuBtn = $('.menu-btn');
  var menu = $('#mobile-menu');
  var hideables = $$('main, .site-footer, .wa-float');

  function openMenu() {
    root.classList.add('menu-open');
    if (header) { header.classList.remove('is-hidden'); headerHidden = false; }
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.querySelector('.sr-only').textContent = 'Close menu';
    menu.removeAttribute('aria-hidden');
    hideables.forEach(function (el) { el.setAttribute('inert', ''); });
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    var first = menu.querySelector('a');
    if (first) setTimeout(function () { first.focus(); }, 300);
  }
  function closeMenu() {
    if (!root.classList.contains('menu-open')) return;
    root.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.sr-only').textContent = 'Open menu';
    menu.setAttribute('aria-hidden', 'true');
    hideables.forEach(function (el) { el.removeAttribute('inert'); });
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }
  if (menuBtn && menu) {
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.addEventListener('click', function () {
      root.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { closeMenu(); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) closeMenu(); });
  }

  /* ---------- Split headings into words ---------- */
  function splitWords(el, cls, onWord) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var parts = node.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          onWord(frag, p);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        splitWords(node, cls, onWord);
      }
    });
  }
  $$('[data-split]').forEach(function (el) {
    var i = 0;
    splitWords(el, 'w', function (frag, word) {
      var outer = document.createElement('span'); outer.className = 'w';
      var inner = document.createElement('span'); inner.textContent = word;
      inner.style.setProperty('--wi', i++);
      outer.appendChild(inner); frag.appendChild(outer);
    });
  });
  var scrubs = $$('.scrub').map(function (el) {
    var words = [];
    splitWords(el, 'sw', function (frag, word) {
      var s = document.createElement('span'); s.className = 'sw'; s.textContent = word;
      words.push(s); frag.appendChild(s);
    });
    return { el: el, words: words, lit: -1 };
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal], [data-split]');
  if ('IntersectionObserver' in window && !reduce) {
    // Clipped elements are watched through their parent, because a fully
    // clipped element never reports itself as visible.
    var watch = new Map();
    revealEls.forEach(function (el) {
      var t = el.getAttribute('data-reveal') === 'clip' ? el.parentElement : el;
      if (!watch.has(t)) watch.set(t, []);
      watch.get(t).push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        (watch.get(en.target) || []).forEach(function (el) { el.classList.add('in'); });
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    watch.forEach(function (_, t) { io.observe(t); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Stagger children of [data-stagger] groups.
  $$('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
    $$('[data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--d', i * step); });
  });

  /* ---------- Process steps: active step + meter ---------- */
  var steps = $$('.step');
  var meterNum = $('.meter-num span');
  var meterBar = $('.meter-bar');
  var stepsList = $('.steps');
  if (steps.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        steps.forEach(function (s) { s.classList.remove('is-active'); });
        en.target.classList.add('is-active');
        var n = steps.indexOf(en.target);
        if (meterNum) meterNum.textContent = String(n + 1).padStart(2, '0');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- Pop-in children get an index for their delay ---------- */
  $$('[data-pop]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--ci', i); });
  });

  /* ---------- Footer word: split into letters ---------- */
  $$('.footer-word').forEach(function (el) {
    var t = el.textContent.trim(); el.textContent = '';
    t.split('').forEach(function (ch, i) { var sp = document.createElement('span'); sp.textContent = ch; sp.style.setProperty('--ci', i); el.appendChild(sp); });
  });

  /* ---------- 3D tilt on cards (mouse / trackpad only) ---------- */
  if (finePointer && !reduce) {
    $$('[data-tilt]').forEach(function (card) {
      var max = parseFloat(card.getAttribute('data-tilt')) || 7;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        var ang = Math.min(1, Math.hypot(x, y) * 2) * max;
        card.classList.add('tilting');
        card.style.setProperty('--tilt', (-y).toFixed(3) + ' ' + x.toFixed(3) + ' 0 ' + ang.toFixed(2) + 'deg');
        card.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('tilting');
        card.style.setProperty('--tilt', '0 0 1 0deg');
      });
    });

    /* Buttons drift a little toward the pointer */
    $$('.btn, .wa-float').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(1) + 'px');
        b.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 6).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  }

  /* ---------- Hero 3D scene ---------- */
  var scene = $('.scene');
  var scenePanels = scene ? $$('.panel', scene) : [];
  var sceneBox = scene ? scene.parentElement : null;
  var ptrX = 0, ptrY = 0, rotX = 0, rotY = 0;
  if (scene && finePointer && !reduce) {
    window.addEventListener('pointermove', function (e) {
      ptrX = e.clientX / window.innerWidth - 0.5;
      ptrY = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  var progressBar = $('.progress');
  var giants = $$('.hero-giant, .page-hero-giant');

  /* ---------- Moving word bands ---------- */
  var bands = $$('.band').map(function (band) {
    var track = $('.band-track', band);
    var item = $('.band-item', band);
    if (!track || !item) return null;
    // Repeat the phrase so the band never runs out.
    for (var k = 0; k < 3; k++) {
      var c = item.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
    }
    return { el: band, track: track, item: item, dir: band.getAttribute('data-dir') === 'right' ? 1 : -1, w: 0 };
  }).filter(Boolean);
  function measureBands() { bands.forEach(function (b) { b.w = b.item.getBoundingClientRect().width; }); }
  measureBands();

  /* ---------- Parallax ---------- */
  var parallax = $$('[data-parallax]').map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0.1 };
  });

  /* ---------- Main animation loop ---------- */
  var lastY = window.scrollY, vel = 0, headerHidden = false;
  var floatBtn = $('.wa-float');
  var vh = window.innerHeight;
  window.addEventListener('resize', function () { vh = window.innerHeight; measureBands(); }, { passive: true });

  function frame(time) {
    if (lenis) lenis.raf(time);
    var y = window.scrollY;
    var dy = y - lastY;
    vel += (dy - vel) * 0.12;
    lastY = y;

    // Header states
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      if (!root.classList.contains('menu-open')) {
        if (dy > 4 && y > 520 && !headerHidden) { header.classList.add('is-hidden'); headerHidden = true; }
        else if ((dy < -4 || y < 200) && headerHidden) { header.classList.remove('is-hidden'); headerHidden = false; }
      }
    }
    if (floatBtn) floatBtn.classList.toggle('show', y > 500 || reduce);
    if (progressBar) {
      var maxY = document.documentElement.scrollHeight - vh;
      progressBar.style.setProperty('--p', maxY > 0 ? Math.min(1, y / maxY).toFixed(4) : 0);
    }

    if (!reduce) {
      // Bands slide only when the visitor scrolls (no constant motion), and lean with scroll speed
      bands.forEach(function (b) {
        if (!b.w) return;
        var r = b.el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var x = ((y * 0.5) % b.w);
        var skew = Math.max(-8, Math.min(8, vel * 0.35));
        b.track.style.transform = 'translate3d(' + (b.dir < 0 ? -x : x - b.w) + 'px,0,0) skewX(' + (-skew * b.dir) + 'deg)';
      });

      // Parallax
      parallax.forEach(function (p) {
        var r = p.el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var off = (r.top + r.height / 2 - vh / 2) * -p.speed;
        p.el.style.translate = '0 ' + off.toFixed(1) + 'px';
      });

      // Scrub text
      scrubs.forEach(function (s) {
        var r = s.el.getBoundingClientRect();
        var start = vh * 0.88, end = vh * 0.38;
        var prog = (start - r.top) / (start - end + r.height * 0.6);
        prog = Math.max(0, Math.min(1, prog));
        var lit = Math.round(prog * s.words.length);
        if (lit !== s.lit) {
          s.words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
          s.lit = lit;
        }
      });

      // Process meter
      if (meterBar && stepsList) {
        var sr = stepsList.getBoundingClientRect();
        var p = (vh * 0.5 - sr.top) / sr.height;
        meterBar.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      }

      // Hero scene: tilt toward the pointer, and spread the panels apart as the hero scrolls away
      if (scene) {
        var sr2 = sceneBox.getBoundingClientRect();
        if (sr2.bottom > 0 && sr2.top < vh) {
          var sp = Math.max(0, Math.min(1, -sr2.top / (sr2.height * 0.9)));
          rotX += ((-ptrY * 10 + sp * 14) - rotX) * 0.08;
          rotY += ((ptrX * 14 - sp * 10) - rotY) * 0.08;
          scene.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
          scenePanels.forEach(function (pn) {
            var depth = parseFloat(pn.getAttribute('data-depth')) || 0;
            pn.style.translate = (ptrX * depth * 26).toFixed(1) + 'px ' + (ptrY * depth * 20 - sp * depth * 60).toFixed(1) + 'px ' + (sp * depth * 120).toFixed(1) + 'px';
          });
        }
      }

      // Giant outline words drift sideways with scroll
      giants.forEach(function (g) { g.style.translate = (-y * 0.18).toFixed(1) + 'px 0'; });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Products sub-navigation highlight ---------- */
  var subLinks = $$('.subnav a');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        subLinks.forEach(function (a) { a.classList.remove('on'); });
        if (map[en.target.id]) map[en.target.id].classList.add('on');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var t = document.getElementById(id); if (t) pio.observe(t); });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Pre-select product on the quote form from ?product= ---------- */
  var form = $('#quote-form');
  if (form) {
    try {
      var want = new URLSearchParams(location.search).get('product');
      var sel = form.querySelector('#f-category');
      if (want && sel) {
        Array.prototype.forEach.call(sel.options, function (o) { if (o.getAttribute('data-slug') === want) sel.value = o.value; });
      }
    } catch (err) { /* ignore */ }
    initForm(form);
  }

  /* ---------- Quote form: validation, loading, success, errors ---------- */
  function initForm(form) {
    var status = $('.form-status', form);
    var btn = $('button[type="submit"]', form);
    var btnLabel = $('.label-text', btn);
    var fields = $$('.field', form);

    function check(field) {
      var input = $('input, select, textarea', field);
      if (!input) return true;
      var ok = input.checkValidity();
      if (ok && input.type === 'tel' && input.value.trim()) ok = input.value.replace(/[^\d]/g, '').length >= 7;
      field.classList.toggle('invalid', !ok);
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }
    fields.forEach(function (f) {
      var input = $('input, select, textarea', f);
      if (!input) return;
      input.addEventListener('blur', function () { if (input.value) check(f); });
      input.addEventListener('input', function () { if (f.classList.contains('invalid')) check(f); });
    });

    function setStatus(type, html) {
      status.className = 'form-status ' + type;
      status.innerHTML = html;
      status.setAttribute('tabindex', '-1');
      status.focus();
    }

    function summary(data) {
      var lines = [
        'Quote request from the Lonar website',
        '',
        'Name: ' + data.get('name'),
        'Company: ' + data.get('company'),
        'Email: ' + data.get('email'),
        'Phone: ' + data.get('phone'),
        'Product category: ' + data.get('category'),
        'Material / specification: ' + (data.get('specification') || '-'),
        'Quantity: ' + (data.get('quantity') || '-'),
        'Delivery location: ' + (data.get('location') || '-'),
        '',
        (data.get('message') || '')
      ];
      return lines.join('\n').trim();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('.hp input', form) && $('.hp input', form).value) return; // spam trap
      var firstBad = null;
      fields.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) {
        setStatus('bad', 'Please check the highlighted fields and try again.');
        var inp = $('input, select, textarea', firstBad); if (inp) inp.focus();
        return;
      }
      var data = new FormData(form);
      btn.classList.add('is-loading'); btn.disabled = true;
      if (btnLabel) btnLabel.textContent = 'Sending…';

      function done() { btn.classList.remove('is-loading'); btn.disabled = false; if (btnLabel) btnLabel.textContent = 'Send enquiry'; }

      if (WEB3FORMS_KEY) {
        data.append('access_key', WEB3FORMS_KEY);
        data.append('subject', 'New quote request: ' + data.get('company'));
        fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: data })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
          .then(function (res) {
            done();
            if (res.ok) { form.reset(); setStatus('ok', '<strong>Thank you, your enquiry has been sent.</strong> Our team will review your requirements and reply as soon as possible.'); }
            else throw new Error('send failed');
          })
          .catch(function () {
            done();
            setStatus('bad', 'Sorry, your enquiry could not be sent. Please try again, or message us on <a href="https://wa.me/' + WHATSAPP_NUMBER + '">WhatsApp</a>.');
          });
      } else {
        // No email service yet: hand the enquiry over to WhatsApp, already written out.
        // Opened straight away (inside the click) so pop-up blockers allow it.
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(summary(data));
        window.open(url, '_blank', 'noopener');
        setTimeout(function () {
          done();
          setStatus('ok', '<strong>Your enquiry is ready.</strong> WhatsApp has opened with your details filled in. Just press send. ' +
            'If it did not open, <a href="' + url + '" target="_blank" rel="noopener">tap here to send it on WhatsApp</a>.');
        }, 400);
      }
    });
  }
})();
