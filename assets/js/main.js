/* ==========================================================================
   Rayton — front-end behaviour
   Vanilla JS, no dependencies. Safe to enqueue in WordPress with `defer`.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- */
  /* Sticky header                                                     */
  /* ---------------------------------------------------------------- */
  var header = document.getElementById('site-header');

  if (header) {
    var threshold = 120;
    var ticking = false;

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-stuck', window.scrollY > threshold);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------- */
  /* Mobile navigation                                                 */
  /* ---------------------------------------------------------------- */
  var burger = document.querySelector('.header__burger');

  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('is-nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeMega();
    });

    document.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.dataset.menu && isCompact()) return;   // handled by the mega logic
        document.body.classList.remove('is-nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* mark the entry that matches the current document */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link[href]').forEach(function (link) {
    if (link.getAttribute('href') === here) link.setAttribute('aria-current', 'page');
  });

  /* ---------------------------------------------------------------- */
  /* Mega menu                                                         */
  /* ---------------------------------------------------------------- */
  var backdrop = document.querySelector('.mega-backdrop');
  var openItem = null;
  var closeTimer = null;

  function isCompact() { return window.matchMedia('(max-width: 1024px)').matches; }

  function panelOf(trigger) {
    var id = trigger.dataset.menu || trigger.dataset.menuToggle;
    return id ? document.getElementById(id) : null;
  }

  function closeMega() {
    if (!openItem) return;
    var link = openItem.querySelector('[data-menu]');
    var panel = link && panelOf(link);
    openItem.classList.remove('nav__item--open');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
    if (header) header.classList.remove('has-menu-open');
    document.body.classList.remove('has-mega-open');
    if (backdrop) backdrop.hidden = true;
    openItem = null;
  }

  function openMega(item) {
    if (openItem === item) return;
    closeMega();
    var link = item.querySelector('[data-menu]');
    var panel = link && panelOf(link);
    if (!panel) return;
    item.classList.add('nav__item--open');
    link.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    if (!isCompact()) {
      if (header) header.classList.add('has-menu-open');
      document.body.classList.add('has-mega-open');
      if (backdrop) backdrop.hidden = false;
    }
    openItem = item;
  }

  document.querySelectorAll('.nav__item--has-menu').forEach(function (item) {
    var link = item.querySelector('[data-menu]');
    var toggle = item.querySelector('[data-menu-toggle]');
    var panel = link && panelOf(link);
    if (!link || !panel) return;

    /* desktop: hover and keyboard focus reveal the panel, the link still navigates */
    var enter = function () { if (isCompact()) return; clearTimeout(closeTimer); openMega(item); };
    var leave = function () { if (isCompact()) return; closeTimer = setTimeout(closeMega, 160); };

    item.addEventListener('mouseenter', enter);
    item.addEventListener('mouseleave', leave);
    panel.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    panel.addEventListener('mouseleave', leave);
    link.addEventListener('focus', enter);

    /* compact: the chevron expands, the link keeps navigating */
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (item.classList.contains('nav__item--open')) closeMega();
        else openMega(item);
      });
    }
  });

  if (backdrop) backdrop.addEventListener('click', closeMega);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeMega();
    if (document.body.classList.contains('is-nav-open')) {
      document.body.classList.remove('is-nav-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', closeMega);

  /* ---------------------------------------------------------------- */
  /* Accordions                                                        */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('.accordion').forEach(function (accordion) {
    var single = accordion.dataset.single !== 'false';

    accordion.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion__item');
        var willOpen = !item.classList.contains('is-open');

        if (single) {
          accordion.querySelectorAll('.accordion__item.is-open').forEach(function (other) {
            if (other === item) return;
            other.classList.remove('is-open');
            var t = other.querySelector('.accordion__trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }

        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  });

  /* ---------------------------------------------------------------- */
  /* Tab groups — buttons switch panels marked with data-tab-panel     */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var scope = tabs.dataset.tabs ? document.querySelector(tabs.dataset.tabs) : null;

    tabs.querySelectorAll('.tabs__btn').forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.tabs__btn').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        if (!scope) return;
        /* every panel tagged with this index becomes visible — a tab can swap
           several regions at once (feature card + side list) */
        scope.querySelectorAll('[data-tab-panel]').forEach(function (panel, i) {
          var owner = panel.dataset.tabPanel === '' ? String(i) : panel.dataset.tabPanel;
          panel.classList.toggle('is-hidden', owner !== String(index));
        });
      });
    });
  });

  /* ---------------------------------------------------------------- */
  /* Counters — numbers spin up once they scroll into view             */
  /* ---------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.dataset.count) || 0;
      var dur = parseInt(el.dataset.countDuration, 10) || 1400;
      if (still) { el.textContent = String(target); return; }

      var start = null;
      var step = function (now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);          // easeOutCubic
        el.textContent = String(Math.round(target * eased));
        if (t < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { io.observe(el); });
    } else {
      counters.forEach(run);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Движение при прокрутке: параллакс и появление блоков              */
  /*                                                                    */
  /* Список целей живёт здесь, а не в разметке — так его правят в одном */
  /* месте и шаблоны темы остаются чистыми. Сами эффекты описаны        */
  /* в assets/css/motion.css.                                           */
  /* ---------------------------------------------------------------- */
  var motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!motionOff) {
    /* какие фото едут медленнее контента */
    var PARALLAX = [
      ['.hero__media', 'hero'],
      ['.about-showcase__bg, .section-bg img', 'section']
    ];

    /* что проявляется при входе в экран */
    var REVEAL = [
      '.section-head', '.section-head-row__aside', '.posts__lead', '.models__lead',
      '.projects__lead', '.control__lead', '.about-showcase', '.cta-banner',
      '.showcase__feature', '.showcase__list', '.posts', '.calc', '.calc__disclaimer',
      '.quote', '.compare', '.seo__text', '.seo__faq', '.control__scheme', '.benefits'
    ].join(',');

    /* сетки: дети выезжают друг за другом */
    var STAGGER = [
      '.solutions-grid', '.process-grid', '.projects-grid', '.models-grid',
      '.audience-grid', '.choose-grid', '.whatis-grid', '.pick-grid',
      '.control__grid', '.about-showcase__cards'
    ].join(',');

    document.documentElement.classList.add('has-motion');

    PARALLAX.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        el.setAttribute('data-parallax', pair[1]);
      });
    });

    document.querySelectorAll(REVEAL).forEach(function (el) {
      el.setAttribute('data-reveal', '');
    });

    document.querySelectorAll(STAGGER).forEach(function (grid) {
      grid.setAttribute('data-reveal-stagger', '');
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.setAttribute('data-reveal', '');
        child.style.setProperty('--reveal-delay', Math.min(i, 4) * 0.08 + 's');
      });
    });

    /* --- появление ------------------------------------------------- */
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    /* то, что уже на экране, показываем сразу и без перехода — иначе при
       загрузке первый экран собирается на глазах */
    var vh0 = window.innerHeight;
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh0 * 0.9) {
        el.classList.add('is-instant', 'is-in');
      }
    });

    if ('IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealIO.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

      targets.forEach(function (el) {
        if (!el.classList.contains('is-in')) revealIO.observe(el);
      });
    } else {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* --- параллакс -------------------------------------------------- */
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'))
      .map(function (el) {
        return { el: el, kind: el.getAttribute('data-parallax'),
                 amount: parseFloat(getComputedStyle(el).getPropertyValue('--px')) || 24 };
      });

    if (layers.length) {
      var pending = false;

      var paint = function () {
        pending = false;
        var vh = window.innerHeight;

        /* сначала все чтения, потом все записи — иначе браузер пересчитывает
           геометрию на каждом элементе по очереди */
        var boxes = layers.map(function (l) { return l.el.getBoundingClientRect(); });

        layers.forEach(function (l, i) {
          var box = boxes[i];
          if (box.bottom < -240 || box.top > vh + 240) return;

          var shift;
          if (l.kind === 'hero') {
            /* герой стоит наверху: при нулевом скролле смещения нет */
            shift = clamp(-box.top / vh, 0, 1) * l.amount;
          } else {
            /* остальные: −amount на входе в экран, +amount на выходе */
            var progress = (vh - box.top) / (vh + box.height);
            shift = (clamp(progress, 0, 1) * 2 - 1) * l.amount;
          }

          l.el.style.setProperty('--py', shift.toFixed(1) + 'px');
        });
      };

      var schedule = function () {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(paint);
      };

      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      paint();
    }
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

  /* ---------------------------------------------------------------- */
  /* YouTube facade — the iframe is only created on demand             */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('[data-youtube]').forEach(function (holder) {
    var id = holder.dataset.youtube;
    if (!id) return;

    holder.addEventListener('click', function () {
      if (holder.classList.contains('is-playing')) return;
      var frame = document.createElement('iframe');
      frame.className = 'showcase__iframe';
      frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      frame.title = holder.dataset.youtubeTitle || 'Відео Rayton';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      holder.appendChild(frame);
      holder.classList.add('is-playing');
    });
  });

  /* ---------------------------------------------------------------- */
  /* "Показати ще" toggle for the УЗЕ comparison table                 */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('[data-expand]').forEach(function (btn) {
    var target = document.querySelector(btn.dataset.expand);
    if (!target) return;

    btn.addEventListener('click', function () {
      var expanded = target.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      var label = btn.querySelector('[data-expand-label]');
      if (label) label.textContent = expanded ? btn.dataset.labelLess || 'Згорнути' : btn.dataset.labelMore || 'Показати всі';
      btn.classList.toggle('is-expanded', expanded);

      var counter = document.getElementById('compare-shown');
      if (counter) {
        var rows = target.querySelectorAll('tbody tr');
        var hidden = target.querySelectorAll('tbody tr.compare-table__extra');
        counter.textContent = expanded ? rows.length : rows.length - hidden.length;
      }
    });
  });

}());
