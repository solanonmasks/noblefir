/* ==========================================================================
   Noble Fir Homes — page behaviour
   --------------------------------------------------------------------------
   Plain JavaScript, no libraries, no build step. Two halves:

     PART A — the interactive bits (estimate form, process tabs, FAQ,
              newsletter). These always run.
     PART B — the motion (scroll reveals, parallax, count-up, magnetic
              buttons, cursor badge). These are skipped entirely for anyone
              whose system asks for reduced motion.

   Nothing here is required for the page to be readable — if this file fails
   to load, every section still shows and the form still submits normally.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     SETTINGS — the two things you are most likely to want to change
     ------------------------------------------------------------------ */

  // Show the sticky green call bar along the bottom of the screen.
  // This is the biggest mobile conversion lever, so it is on by default.
  var SHOW_CALL_BAR = true;

  // Collapse the estimate form into a single step instead of two.
  // Two steps usually wins on total submissions; one step can win on
  // high-intent traffic. Worth A/B testing.
  var ONE_STEP_FORM = false;

  /* ------------------------------------------------------------------ */

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var PHONE = '778-686-0311';

  // Sends a conversion event to Google Analytics / GTM if either is installed.
  // Harmless if neither is — it just does nothing.
  function track(name, data) {
    try {
      if (typeof window.gtag === 'function') { window.gtag('event', name, data || {}); }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(Object.assign({ event: name }, data || {}));
      }
    } catch (err) { /* analytics must never break the page */ }
  }

  // Reveal a panel that started out collapsed, or collapse it again.
  // The first call also drops the data-collapsed attribute, after which the
  // standard `hidden` property is what controls it.
  function setCollapsed(el, collapsed) {
    if (!el) return;
    el.removeAttribute('data-collapsed');
    el.hidden = !!collapsed;
  }


  /* ======================================================================
     PART A1 — ESTIMATE FORM
     Two steps: pick a project type, then leave contact details.
     ====================================================================== */

  function initEstimateForm() {
    var form = $('#estimate-form');
    if (!form) return;

    var card        = form.parentNode;
    var stepLabel   = $('#quote-step-label');
    var progress    = $('[data-progress-fill]', form);
    var panel1      = $('[data-step="1"]', form);
    var panel2      = $('[data-step="2"]', form);
    var pickedOut   = $('[data-picked]', form);
    var errorOut    = $('[data-error]', form);
    var nextBtn     = $('[data-next]', form);
    var backBtn     = $('[data-back]', form);
    var submitBtn   = $('[data-submit]', form);
    var success     = $('[data-success]', card);
    var successText = $('[data-success-text]', card);
    var endpoint    = (form.getAttribute('data-endpoint') || '').trim();

    var service = '';
    var step = 1;
    var startedTracked = false;

    function render() {
      if (ONE_STEP_FORM) {
        setCollapsed(panel1, false);
        setCollapsed(panel2, false);
        if (nextBtn) nextBtn.hidden = true;
        if (backBtn) backBtn.hidden = true;
        if (stepLabel) stepLabel.textContent = 'Free estimate request';
        if (progress) progress.style.width = '100%';
        return;
      }

      setCollapsed(panel1, step !== 1);
      setCollapsed(panel2, step !== 2);
      if (stepLabel) stepLabel.textContent = 'Step ' + step + ' of 2';
      if (progress) progress.style.width = step === 1 ? '50%' : '100%';
    }

    // --- Step 1: choosing a project type ---
    $$('[data-service]', form).forEach(function (btn) {
      btn.addEventListener('click', function () {
        service = btn.getAttribute('data-service');

        $$('[data-service]', form).forEach(function (other) {
          other.setAttribute('aria-pressed', String(other === btn));
        });

        if (pickedOut) pickedOut.textContent = 'Selected: ' + service;

        if (!startedTracked) {
          startedTracked = true;
          track('estimate_start', { service: service });
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (!service) service = 'Renovation';
        step = 2;
        render();
        track('estimate_step_2', { service: service });
        var firstField = $('input[name="first"]', panel2);
        if (firstField) firstField.focus();
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        step = 1;
        render();
      });
    }

    // --- Validation ---
    // Deliberately forgiving: we want the lead, not a perfect record.
    function validate(values) {
      var problems = [];
      clearInvalid();

      if (!values.first) {
        problems.push('your first name');
        markInvalid('first');
      }

      // Something@something.something — enough to catch real typos.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
        problems.push('a valid email address');
        markInvalid('email');
      }

      // At least 10 digits, ignoring spaces, dashes and brackets.
      if (values.phone.replace(/\D/g, '').length < 10) {
        problems.push('a phone number we can reach you on');
        markInvalid('phone');
      }

      return problems;
    }

    function markInvalid(name) {
      var field = form.elements[name];
      if (field) field.setAttribute('aria-invalid', 'true');
    }

    function clearInvalid() {
      ['first', 'email', 'phone'].forEach(function (name) {
        var field = form.elements[name];
        if (field) field.removeAttribute('aria-invalid');
      });
      if (errorOut) errorOut.textContent = '';
    }

    // Clear the warning as soon as someone starts fixing the field.
    ['first', 'email', 'phone'].forEach(function (name) {
      var field = form.elements[name];
      if (field) field.addEventListener('input', function () {
        field.removeAttribute('aria-invalid');
      });
    });

    function showSuccess(first, chosen) {
      if (successText) {
        successText.innerHTML =
          'Thanks ' + escapeHtml(first || 'there') + ' &mdash; we’ll be in touch about your ' +
          escapeHtml((chosen || 'renovation').toLowerCase()) +
          ' project within one business day. If it’s urgent, call us directly at ' + PHONE + '.';
      }
      form.hidden = true;
      if (success) success.hidden = false;
      card.scrollIntoView({ block: 'nearest' });
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }

    // --- Submitting ---
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var values = {
        first:   (form.elements.first.value || '').trim(),
        last:    (form.elements.last.value || '').trim(),
        email:   (form.elements.email.value || '').trim(),
        phone:   (form.elements.phone.value || '').trim(),
        area:    (form.elements.area.value || '').trim(),
        service: service || 'Renovation'
      };

      // Honeypot: only a bot fills in the hidden "Company" field. Pretend it
      // worked so the bot moves on, but send nothing.
      if ((form.elements.company.value || '').trim() !== '') {
        showSuccess(values.first, values.service);
        return;
      }

      var problems = validate(values);
      if (problems.length) {
        if (errorOut) {
          errorOut.textContent = 'Please add ' + problems.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.';
        }
        var firstBad = $('[aria-invalid="true"]', form);
        if (firstBad) firstBad.focus();
        return;
      }

      // No endpoint configured yet, so there is nowhere to send this.
      // Show the thank-you message so the page can be demonstrated end to end.
      if (!endpoint) {
        track('estimate_submit', { service: values.service, delivered: false });
        showSuccess(values.first, values.service);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed: ' + response.status);
          track('estimate_submit', { service: values.service, delivered: true });
          showSuccess(values.first, values.service);
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request my estimate';
          if (errorOut) {
            errorOut.textContent =
              'Sorry, that didn’t send. Please try again, or call us on ' + PHONE + '.';
          }
        });
    });

    render();
  }


  /* ======================================================================
     PART A2 — PROCESS TABS
     Arrow keys move between tabs, as a tab list should.
     ====================================================================== */

  function initProcessTabs() {
    var tabs = $$('[role="tab"]');
    if (!tabs.length) return;

    function select(tab, moveFocus) {
      tabs.forEach(function (other) {
        var chosen = other === tab;
        other.setAttribute('aria-selected', String(chosen));
        other.tabIndex = chosen ? 0 : -1;
        setCollapsed(document.getElementById(other.getAttribute('aria-controls')), !chosen);
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(tab, false); });

      tab.addEventListener('keydown', function (event) {
        var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (step) {
          event.preventDefault();
          select(tabs[(index + step + tabs.length) % tabs.length], true);
        } else if (event.key === 'Home') {
          event.preventDefault();
          select(tabs[0], true);
        } else if (event.key === 'End') {
          event.preventDefault();
          select(tabs[tabs.length - 1], true);
        }
      });
    });

    // Apply the starting state, collapsing the two inactive panels.
    var current = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
    select(current || tabs[0], false);
  }


  /* ======================================================================
     PART A3 — FAQ ACCORDION
     One open at a time; clicking the open one closes it.
     ====================================================================== */

  function initFaq() {
    var triggers = $$('.faq__trigger');
    if (!triggers.length) return;

    function setOpen(trigger, open) {
      trigger.setAttribute('aria-expanded', String(open));
      var sign = $('.faq__sign', trigger);
      if (sign) sign.textContent = open ? '−' : '+';
      setCollapsed(document.getElementById(trigger.getAttribute('aria-controls')), !open);
    }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener('click', function () {
        var willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach(function (other) { setOpen(other, false); });
        if (willOpen) setOpen(trigger, true);
      });
      // The first question starts open.
      setOpen(trigger, index === 0);
    });
  }


  /* ======================================================================
     PART A4 — NEWSLETTER
     ====================================================================== */

  function initSubscribe() {
    var form = $('#subscribe-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var label = $('[data-sub-label]', form);
      var email = (form.elements.subEmail.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        form.elements.subEmail.focus();
        return;
      }
      // Nothing is sent anywhere yet — see README, "Connecting the estimate
      // form", for how to point this at a mailing-list provider.
      if (label) label.textContent = 'Subscribed ✓';
      track('newsletter_subscribe', {});
    });
  }


  /* ======================================================================
     PART A5 — PHONE CLICK TRACKING + CALL BAR TOGGLE
     ====================================================================== */

  function initMisc() {
    $$('[data-analytics="phone_click"]').forEach(function (link) {
      link.addEventListener('click', function () { track('phone_click', {}); });
    });

    if (!SHOW_CALL_BAR) {
      var bar = $('.callbar');
      if (bar) bar.remove();
    }
  }


  /* ======================================================================
     PART B — MOTION
     Everything below is decoration. It is skipped completely for anyone
     who has asked their system to reduce motion.
     ====================================================================== */

  function initMotion() {
    var cleanup = [];
    function on(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      cleanup.push(function () { target.removeEventListener(type, fn, opts); });
    }

    /* --- Scroll reveals ------------------------------------------------
       Each target starts faded and nudged down, then settles as it enters
       the viewport. Items sharing a parent stagger slightly.
       ------------------------------------------------------------------ */

    var targets = $$('[data-reveal], h2, blockquote');
    var seenPerParent = new Map();

    targets.forEach(function (el) {
      var parent = el.parentElement;
      var index = seenPerParent.get(parent) || 0;
      seenPerParent.set(parent, index + 1);

      el.classList.add('js-reveal');
      if (el.getAttribute('data-reveal') === 'clip') el.classList.add('js-reveal--clip');
      el.style.transitionDelay = (Math.min(index, 5) * 0.075) + 's';
    });

    var pending = new Set(targets);

    function reveal(el, instant) {
      if (!pending.has(el)) return;
      pending.delete(el);
      if (instant) el.classList.add('is-instant');
      el.classList.add('is-in');
      observer.unobserve(el);
      window.setTimeout(function () {
        el.style.willChange = 'auto';
        el.classList.remove('js-reveal--clip');
      }, instant ? 60 : 1500);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) reveal(entry.target, false);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
    cleanup.push(function () { observer.disconnect(); });

    // Safety net. Without this, an anchor jump or a restored scroll position
    // can skip past a section and leave it permanently blank, because the
    // observer never sees it enter. Runs on every frame of the loop below.
    function sweepMissedReveals() {
      if (!pending.size) return;
      var viewportHeight = window.innerHeight;
      Array.from(pending).forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < viewportHeight * 0.9) reveal(el, rect.bottom < 0);
      });
    }

    /* --- Count-up on the hero stats ----------------------------------- */

    var counters = $$('[data-count]');

    function runCount(el) {
      var raw = el.getAttribute('data-count');
      var decimals = raw.indexOf('.') > -1 ? 1 : 0;
      var suffix = raw.slice(-1) === '%' ? '%' : '';
      var end = parseFloat(raw);
      // The little sage "+" or "★" is a child element; writing textContent
      // wipes it, so it gets put back after every frame.
      var extra = el.querySelector('span');
      var start = performance.now();

      (function tick(now) {
        var p = Math.min((now - start) / 1400, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (end * eased).toFixed(decimals) + suffix;
        if (extra) el.appendChild(extra);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }

    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
    cleanup.push(function () { countObserver.disconnect(); });

    /* --- One scroll loop for parallax, the progress rail and the header --
       Deliberately a single self-scheduling requestAnimationFrame ticker.
       Gating it behind a flag set by the scroll event would latch and freeze
       the whole loop if one frame never fires (hidden tab, throttling).
       ------------------------------------------------------------------ */

    var parallaxImages = $$('[data-parallax]');
    var rail = $('[data-progress]');
    var header = $('.header');
    var isCompact = null;

    function frame() {
      var viewportHeight = window.innerHeight;

      parallaxImages.forEach(function (img) {
        var host = img.parentElement || img;
        var rect = host.getBoundingClientRect();

        // How far the host section has travelled through the viewport,
        // 0 when it is entering, 1 when it is leaving.
        var span = rect.height + viewportHeight;
        var p = span > 0 ? Math.max(0, Math.min(1, (viewportHeight - rect.top) / span)) : 0.5;

        // Travel can never exceed the image's real overhang. Without this
        // clamp the transform drags bare section background into view.
        var cap = Math.max(0, img.offsetHeight - host.offsetHeight) / 2;
        var offscreen = rect.bottom < -100 || rect.top > viewportHeight + 100;
        var offset = offscreen ? 0 : cap * (1 - 2 * p);

        img.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
      });

      sweepMissedReveals();

      if (rail) {
        var max = document.documentElement.scrollHeight - viewportHeight;
        rail.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
      }

      if (header) {
        var wantCompact = window.scrollY > 60;
        if (wantCompact !== isCompact) {
          isCompact = wantCompact;
          header.classList.toggle('is-compact', wantCompact);
        }
      }
    }

    var alive = true;
    var rafId = 0;

    // Every frame is wrapped, so one thrown error can never kill the loop.
    function safeFrame() {
      try { frame(); } catch (err) { /* keep going */ }
    }

    (function loop() {
      if (!alive) return;
      safeFrame();
      rafId = requestAnimationFrame(loop);
    })();

    on(window, 'scroll', safeFrame, { passive: true });
    on(window, 'resize', safeFrame);
    on(document, 'visibilitychange', safeFrame);
    cleanup.push(function () {
      alive = false;
      if (rafId) cancelAnimationFrame(rafId);
    });

    /* --- Pointer-only extras ------------------------------------------ */

    var finePointer = window.matchMedia('(pointer: fine)').matches;

    if (finePointer) {
      // Magnetic pull on the primary calls to action.
      $$('[data-magnet]').forEach(function (el) {
        el.classList.add('is-magnet');

        on(el, 'mousemove', function (event) {
          var rect = el.getBoundingClientRect();
          var dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          var dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
          el.classList.add('is-tracking');
          el.style.transform = 'translate(' + (dx * 9).toFixed(1) + 'px,' + (dy * 6).toFixed(1) + 'px)';
        });

        on(el, 'mouseleave', function () {
          el.classList.remove('is-tracking');
          el.style.transform = 'none';
        });
      });

      // A pill that follows the cursor across the project tiles.
      var tiles = $$('[data-project]');
      if (tiles.length) {
        var badge = document.createElement('div');
        badge.className = 'project-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = 'View project';
        document.body.appendChild(badge);
        cleanup.push(function () { badge.remove(); });

        var bx = 0, by = 0, badgeRaf = 0;
        function moveBadge() {
          badgeRaf = 0;
          badge.style.left = bx + 'px';
          badge.style.top = by + 'px';
        }

        tiles.forEach(function (tile) {
          on(tile, 'mouseenter', function () { badge.classList.add('is-on'); });
          on(tile, 'mouseleave', function () { badge.classList.remove('is-on'); });
          on(tile, 'mousemove', function (event) {
            bx = event.clientX;
            by = event.clientY;
            if (!badgeRaf) badgeRaf = requestAnimationFrame(moveBadge);
          });
        });
      }
    }

    window.addEventListener('pagehide', function () {
      cleanup.forEach(function (fn) { fn(); });
    });
  }


  /* ======================================================================
     START
     ====================================================================== */

  initEstimateForm();
  initProcessTabs();
  initFaq();
  initSubscribe();
  initMisc();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initMotion();
  }

})();
