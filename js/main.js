/* ============================================================
   D'PARTY — main.js
   Vanilla JS · language switch · WhatsApp · form · animations
   ============================================================ */
(function () {
  'use strict';

  /* ---- CONFIG (edit here) ------------------------------------------------ */
  var WA_NUMBER = '16783009112'; // WhatsApp number, digits only
  var WA_MSG = {
    en: 'Hello D’Party! I would like information and pricing for an upcoming event.',
    es: '¡Hola D’Party! Me gustaría recibir información y precios para un próximo evento.',
    pt: 'Olá D’Party! Gostaria de receber informações e preços para um próximo evento.'
  };
  // Text shown to the user after a successful form submit
  var SUCCESS = {
    en: 'Thank you! Your sweet request has been received. We’ll reply within 24 hours. 🎀',
    es: '¡Gracias! Recibimos tu solicitud. Te responderemos dentro de 24 horas. 🎀',
    pt: 'Obrigado! Recebemos seu pedido. Respondemos em até 24 horas. 🎀'
  };
  var ERRORS = {
    en: { required: 'This field is required.', email: 'Please enter a valid email.', phone: 'Please enter a valid phone number.' },
    es: { required: 'Este campo es obligatorio.', email: 'Ingresa un correo válido.', phone: 'Ingresa un teléfono válido.' },
    pt: { required: 'Este campo é obrigatório.', email: 'Digite um e-mail válido.', phone: 'Digite um telefone válido.' }
  };
  var CHECK_FIELDS = {
    en: 'Please check the highlighted fields.',
    es: 'Por favor revisa los campos marcados.',
    pt: 'Por favor, revise os campos destacados.'
  };
  var SUBMIT_FAIL = {
    en: 'Something went wrong sending your request. Please text us instead.',
    es: 'Hubo un problema al enviar tu solicitud. Escríbenos por WhatsApp.',
    pt: 'Algo deu errado ao enviar seu pedido. Fale com a gente no WhatsApp.'
  };
  var SUPPORTED = { en: 1, es: 1, pt: 1 };

  /* Contact channel: English audience prefers SMS; ES/PT prefer WhatsApp. */
  var SMS_NUMBER = '+16783009112';
  var SMS_MSG = {
    en: "Hi D'Party! I'd like info and pricing for an upcoming event.",
    es: "¡Hola D'Party! Quisiera información y precios para un próximo evento.",
    pt: "Olá D'Party! Gostaria de informações e preços para um próximo evento."
  };

  // Icons injected by JS so switching language can swap SMS <-> WhatsApp glyphs.
  var ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.15-1.7-.83-2-.93s-.46-.15-.65.15-.75.92-.92 1.11-.34.22-.63.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.06c-.17-.3 0-.45.13-.6s.3-.34.44-.51.19-.3.29-.5.05-.37 0-.52-.65-1.57-.9-2.15-.47-.48-.65-.49h-.56a1.06 1.06 0 0 0-.77.36 3.2 3.2 0 0 0-1 2.4 5.6 5.6 0 0 0 1.17 2.95 12.8 12.8 0 0 0 4.9 4.33c.68.3 1.22.47 1.64.6a3.9 3.9 0 0 0 1.8.12c.55-.09 1.7-.7 1.94-1.36a2.4 2.4 0 0 0 .17-1.37c-.07-.13-.26-.2-.55-.35zM12 2a10 10 0 0 0-8.6 15.05L2 22l5.05-1.32A10 10 0 1 0 12 2z"/></svg>';
  var ICON_SMS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/><path d="M8 10h0M12 10h0M16 10h0"/></svg>';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- LANGUAGE SWITCHER ------------------------------------------------- */
  var lang = 'en';
  var stored = null;
  try { stored = localStorage.getItem('dparty-lang'); } catch (e) {}
  if (stored && SUPPORTED[stored]) lang = stored;

  function applyLang(next, persist) {
    lang = SUPPORTED[next] ? next : 'en';
    document.documentElement.lang = lang;

    // Text content (innerHTML — dictionary is trusted, no user input)
    $$('[data-en]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
    // Placeholders
    $$('[data-en-ph]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang + '-ph');
      if (v !== null) el.setAttribute('placeholder', v);
    });
    // Aria labels
    $$('[data-en-aria]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang + '-aria');
      if (v !== null) el.setAttribute('aria-label', v);
    });

    // Button states
    $$('.lang__btn').forEach(function (b) {
      var active = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    updateContact();
    if (persist) { try { localStorage.setItem('dparty-lang', lang); } catch (e) {} }
  }

  // Header switcher (EN / ES / PT) — persists the choice
  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });

  /* ---- CONTACT LINKS (SMS for EN · WhatsApp for ES/PT) ------------------- */
  function contactHref() {
    if (lang === 'en') {
      return 'sms:' + SMS_NUMBER + '?&body=' + encodeURIComponent(SMS_MSG.en);
    }
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_MSG[lang]);
  }
  function updateContact() {
    var isSms = (lang === 'en');
    $$('[data-contact]').forEach(function (a) {
      a.setAttribute('href', contactHref());
      a.classList.toggle('is-sms', isSms);
      a.classList.toggle('is-wa', !isSms);
      if (isSms) { a.removeAttribute('target'); a.removeAttribute('rel'); }
      else { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
      var ico = a.querySelector('.contact-btn__ico, .contact-float__ico');
      if (ico) ico.innerHTML = isSms ? ICON_SMS : ICON_WA;
    });
  }

  // "Request Pricing" cards jump to the form AND preselect the treat
  $$('[data-treat]').forEach(function (a) {
    if (a.hasAttribute('data-wa')) return; // whatsapp variant handled above
    a.addEventListener('click', function () {
      var treat = a.getAttribute('data-treat');
      var box = $$('.chips input').filter(function (i) { return i.value === treat; })[0];
      if (box) box.checked = true;
      var details = $('#f-details');
      if (details && !details.value) {
        details.value = (lang === 'es' ? 'Me interesa: ' : 'Interested in: ') + treat;
      }
    });
  });

  /* ---- STICKY NAV + MOBILE MENU ----------------------------------------- */
  var nav = $('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = $('.nav__toggle');
  var mobile = $('#mobileMenu');
  function closeMobileMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobile.classList.remove('is-open'); mobile.hidden = true;
  }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) { closeMobileMenu(); }
    else {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      mobile.hidden = false; mobile.classList.add('is-open');
    }
  });
  $$('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', closeMobileMenu);
  });
  // Picking a language in the mobile menu applies it (via the shared .lang__btn
  // handler below) and also closes the menu, since the user is likely done with it.
  $$('.mobile-lang__btn').forEach(function (b) {
    b.addEventListener('click', closeMobileMenu);
  });

  /* ---- SCROLL REVEAL ----------------------------------------------------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = $$('.reveal');
  function showAll() { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }

  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    // Reveal anything already within the viewport at load (covers observers
    // that don't emit an initial callback for on-screen elements).
    requestAnimationFrame(function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      reveals.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('is-visible');
      });
    });

    // Failsafe: never leave content hidden if the observer never fires.
    setTimeout(showAll, 2200);
  }

  /* ---- FLOATING PETALS (lightweight, hero only) -------------------------- */
  var petalBox = $('[data-petals]');
  if (petalBox && !reduce) {
    var COUNT = window.innerWidth < 720 ? 6 : 11;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var size = 8 + Math.round(Math.random() * 10);
      p.style.left = Math.round(Math.random() * 100) + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = (9 + Math.random() * 8).toFixed(1) + 's';
      p.style.animationDelay = (-Math.random() * 12).toFixed(1) + 's';
      p.style.opacity = (0.35 + Math.random() * 0.3).toFixed(2);
      petalBox.appendChild(p);
    }
  }

  /* ---- FORM VALIDATION + SUBMIT ------------------------------------------ */
  var form = $('#inquiryForm');
  var msg = $('#formMsg');

  function setError(field, text) {
    field.classList.add('is-invalid');
    var e = $('.err', field);
    if (e) e.textContent = text || '';
  }
  function clearError(field) {
    field.classList.remove('is-invalid');
    var e = $('.err', field);
    if (e) e.textContent = '';
  }
  function fieldOf(input) { return input.closest('.field'); }

  function validateInput(input) {
    var field = fieldOf(input);
    if (!field) return true;
    var val = (input.value || '').trim();
    var E = ERRORS[lang];

    if (input.hasAttribute('required') && !val) { setError(field, E.required); return false; }
    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setError(field, E.email); return false; }
    if (input.type === 'tel' && val && !/[0-9]{7,}/.test(val.replace(/[^0-9]/g, ''))) { setError(field, E.phone); return false; }
    clearError(field);
    return true;
  }

  if (form) {
    // Validate on blur (not on every keystroke)
    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('blur', function () { validateInput(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('is-invalid')) validateInput(input);
      });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      msg.hidden = true; msg.className = 'form__msg';

      var required = $$('[required]', form);
      var firstBad = null;
      required.forEach(function (input) {
        if (!validateInput(input) && !firstBad) firstBad = input;
      });

      if (firstBad) {
        firstBad.focus();
        msg.hidden = false;
        msg.classList.add('is-error');
        msg.textContent = CHECK_FIELDS[lang];
        return;
      }

      var btn = $('button[type="submit"]', form);
      btn.setAttribute('aria-busy', 'true');

      // Honeypot: bots fill every field, real visitors never see this one.
      // Quietly drop the submission without sending anything.
      var honeypot = form.querySelector('[name="bot-field"]');
      if (honeypot && honeypot.value) {
        btn.removeAttribute('aria-busy');
        showSuccess();
        return;
      }

      /* Submits to Web3Forms (web3forms.com) — works on any static host
         (GitHub Pages, Netlify, anywhere), no backend needed. Where the
         email lands is controlled by the access_key hidden field on the
         form itself, not here. */
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) { return r.json(); })
        .then(function (data) {
          btn.removeAttribute('aria-busy');
          if (data.success) showSuccess(); else showSubmitError();
        }).catch(function () {
          btn.removeAttribute('aria-busy');
          showSubmitError();
        });
    });
  }

  function showSuccess() {
    form.reset();
    $$('.field', form).forEach(clearError);
    msg.hidden = false;
    msg.className = 'form__msg is-success';
    msg.textContent = SUCCESS[lang];
    msg.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  function showSubmitError() {
    msg.hidden = false;
    msg.className = 'form__msg is-error';
    msg.textContent = SUBMIT_FAIL[lang];
    msg.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  /* ---- FOOTER YEAR ------------------------------------------------------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- CONFETTI (celebratory burst on language choice) ------------------- */
  function burstConfetti() {
    if (reduce) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var colors = ['#EC8AA6', '#8FC0E0', '#7FC9AD', '#F2CE6B', '#B79BDD', '#F0A585', '#C6868C', '#FBEBEC'];
    var narrow = W < 600;
    // Launch velocity scales to the screen height so confetti reaches ~90% up,
    // filling tall/narrow phone screens instead of dying near the bottom.
    var g = 0.34;
    var vUp = Math.sqrt(2 * g * H * 0.92);
    // Bottom corners + bottom-center cannons, all firing upward and spreading.
    var origins = [
      { x: W * 0.10, y: H + 8, base: -1.05 },
      { x: W * 0.90, y: H + 8, base: -(Math.PI - 1.05) },
      { x: W * 0.50, y: H + 8, base: -Math.PI / 2 }
    ];
    var perOrigin = narrow ? 60 : 55;
    var parts = [];
    origins.forEach(function (o) {
      for (var i = 0; i < perOrigin; i++) {
        var ang = o.base + (Math.random() - 0.5) * 0.8;
        var sp = vUp * (0.55 + Math.random() * 0.55);
        parts.push({
          x: o.x, y: o.y,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          g: g * (0.85 + Math.random() * 0.4),
          s: (narrow ? 8 : 7) + Math.random() * 8,
          rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.5,
          color: colors[(Math.random() * colors.length) | 0],
          shape: Math.random() < 0.5 ? 'r' : 'c',
          drift: (Math.random() - 0.5) * 0.6
        });
      }
    });
    var start = null, DUR = 3200;
    function frame(t) {
      if (start === null) start = t;
      var el = t - start;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vy += p.g; p.vx += p.drift * 0.1; p.vx *= 0.992;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - (el / DUR) * (el / DUR));
        ctx.fillStyle = p.color;
        if (p.shape === 'r') ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.55);
        else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 6.283); ctx.fill(); }
        ctx.restore();
      }
      if (el < DUR) requestAnimationFrame(frame);
      else if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
    requestAnimationFrame(frame);
    // Guaranteed cleanup even if rAF is throttled/paused (e.g. tab blurred).
    setTimeout(function () { if (canvas.parentNode) canvas.parentNode.removeChild(canvas); }, DUR + 700);
  }

  /* ---- LANGUAGE GATE (first visit) --------------------------------------- */
  var gate = $('#langGate');

  function closeGate() {
    if (!gate) return;
    gate.classList.add('is-closing');
    document.body.classList.remove('is-locked');
    var done = function () { gate.hidden = true; gate.classList.remove('is-closing'); };
    gate.addEventListener('animationend', done, { once: true });
    setTimeout(done, 600); // fallback if animationend doesn't fire
  }

  function openGate() {
    if (!gate) return;
    gate.hidden = false;
    document.body.classList.add('is-locked');
    var first = gate.querySelector('.lang-gate__btn');
    if (first) { try { first.focus(); } catch (e) {} }
  }

  if (gate) {
    $$('.lang-gate__btn', gate).forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.getAttribute('data-lang'), true); // persist the explicit choice
        burstConfetti();                               // 🎉 celebrate the choice
        closeGate();
      });
    });
  }

  // Header globe reopens the welcome language chooser at any time.
  var reopen = $('#langReopen');
  if (reopen) reopen.addEventListener('click', openGate);

  /* ---- INIT -------------------------------------------------------------- */
  if (stored && SUPPORTED[stored]) {
    // Returning visitor — apply saved language, no gate.
    applyLang(stored, false);
  } else {
    // First visit — render in default English, then ask for a language.
    applyLang('en', false);
    openGate();
  }
})();
