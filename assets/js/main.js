/* ==========================================================================
   Rayton — front-end behaviour
   Vanilla JS, no dependencies. Safe to enqueue in WordPress with `defer`.

   Правило по анимациям: JS переключает только классы, длительности живут
   в CSS (--dur / --dur-lg / --reveal-dur). Ничего не прячем через
   display/hidden в момент, когда рядом что-то едет, — иначе половина жеста
   происходит за кадр, а половина за 250 мс.
   ========================================================================== */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var compact = window.matchMedia('(max-width: 1024px)');

  function isCompact() { return compact.matches; }
  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

  /* ---------------------------------------------------------------- */
  /* Один слушатель прокрутки на всё                                   */
  /*                                                                    */
  /* Раньше их было два, каждый со своим rAF: шапка успевала поменять   */
  /* класс ровно перед тем, как параллакс начинал мерить геометрию, —   */
  /* и кадр переключения был самым дорогим за всю прокрутку.            */
  /* ---------------------------------------------------------------- */
  var scrollJobs = [];
  var scrollPending = false;

  function runScrollJobs() {
    scrollPending = false;
    for (var i = 0; i < scrollJobs.length; i++) scrollJobs[i]();
  }

  function scheduleScroll() {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(runScrollJobs);
  }

  function onScroll(fn) {
    scrollJobs.push(fn);
    fn();
  }

  window.addEventListener('scroll', scheduleScroll, { passive: true });

  /* ---------------------------------------------------------------- */
  /* Sticky header                                                     */
  /*                                                                    */
  /* Шапка теперь всегда position: fixed (см. layout.css), поэтому здесь */
  /* остаётся только цвет. Порог с гистерезисом, чтобы у самой границы  */
  /* фон не мигал туда-сюда на инерционной прокрутке.                   */
  /* ---------------------------------------------------------------- */
  var header = document.getElementById('site-header');

  if (header) {
    var STUCK_ON = 120;
    var STUCK_OFF = 88;
    var stuck = false;

    onScroll(function () {
      var y = window.scrollY;
      if (!stuck && y > STUCK_ON) stuck = true;
      else if (stuck && y < STUCK_OFF) stuck = false;
      else return;
      header.classList.toggle('is-stuck', stuck);
    });
  }

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
    var buttons = Array.prototype.slice.call(tabs.querySelectorAll('.tabs__btn'));

    buttons.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          if (b.getAttribute('role') === 'tab') b.setAttribute('aria-selected', 'false');
          else b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        if (btn.getAttribute('role') === 'tab') btn.setAttribute('aria-selected', 'true');
        else btn.setAttribute('aria-pressed', 'true');

        if (!scope) return;
        /* every panel tagged with this index becomes visible — a tab can swap
           several regions at once (feature card + side list) */
        scope.querySelectorAll('[data-tab-panel]').forEach(function (panel, i) {
          var owner = panel.dataset.tabPanel === '' ? String(i) : panel.dataset.tabPanel;
          var show = owner === String(index);
          var wasHidden = panel.classList.contains('is-hidden');

          if (!show) {
            /* уходящая панель не должна продолжать играть видео за кадром */
            stopVideo(panel);
            panel.classList.add('is-hidden');
            return;
          }

          panel.classList.remove('is-hidden');
          if (!wasHidden) return;

          /* появление на те же 250 мс, что заливка кнопки */
          panel.classList.remove('is-tab-in');
          void panel.offsetWidth;                      // рестарт анимации
          panel.classList.add('is-tab-in');
          panel.addEventListener('animationend', function done() {
            panel.classList.remove('is-tab-in');
            panel.removeEventListener('animationend', done);
          });
        });
      });
    });
  });

  /* ---------------------------------------------------------------- */
  /* Движение при прокрутке: параллакс и появление блоков              */
  /*                                                                    */
  /* Что появляется — считается от разметки, а не от списка классов.    */
  /* Единица показа — прямой ребёнок `.section > .container`: заголовок  */
  /* с подводкой, сетка карточек, баннер. Так связанные вещи всегда     */
  /* едут вместе, а не «заголовок поехал, а текст рядом стоит».         */
  /*                                                                    */
  /* Сами эффекты описаны в assets/css/motion.css.                      */
  /* ---------------------------------------------------------------- */
  var STAGGER_SEL = [
    '.solutions-grid', '.process-grid', '.projects-grid', '.models-grid',
    '.audience-grid', '.choose-grid', '.whatis-grid', '.pick-grid',
    '.control__grid', '.about-showcase__cards', '.grid', '.posts__grid'
  ].join(',');

  /* блоки, которые не должны разъезжаться на части и не должны появляться
     вовсе (шапки секций-героев, абсолютные подложки) */
  var SKIP_SEL = '.section-bg, .hero, .site-header, .mega, .mega-backdrop';

  if (!still.matches) {
    document.documentElement.classList.add('has-motion');

    /* --- параллакс: разметка ---------------------------------------- */
    [['.hero__media', 'hero'], ['.about-showcase__bg, .section-bg img', 'section']]
      .forEach(function (pair) {
        document.querySelectorAll(pair[0]).forEach(function (el) {
          el.setAttribute('data-parallax', pair[1]);
        });
      });

    /* --- появление: разметка ---------------------------------------- */
    function isStaggerGrid(el) {
      if (el.matches(STAGGER_SEL)) return true;
      if (el.tagName !== 'UL' && el.tagName !== 'OL') return false;
      if (el.children.length < 2) return false;
      var display = getComputedStyle(el).display;
      return display === 'grid' || display === 'flex';
    }

    function tag(el) {
      if (el.hasAttribute('data-reveal')) return;
      /* ни вложенности, ни перекрытия: иначе ребёнок едет 22px внутри
         родителя, который сам едет 22px, и прозрачности перемножаются */
      if (el.parentElement && el.parentElement.closest('[data-reveal]')) return;
      if (el.querySelector('[data-reveal]')) return;
      el.setAttribute('data-reveal', '');
    }

    var roots = Array.prototype.slice.call(document.querySelectorAll('.section > .container > *'));
    var vhPlan = window.innerHeight || document.documentElement.clientHeight || 0;

    /* Высоты снимаем одним проходом заранее: решения ниже на них опираются, а
       чередовать чтение геометрии с записью атрибутов нельзя — каждая запись
       заставляет браузер пересчитывать вёрстку заново. */
    var heights = new Map();
    (function measureTree(list, depth) {
      list.forEach(function (el) {
        heights.set(el, el.getBoundingClientRect().height);
        if (depth < 2) measureTree(Array.prototype.slice.call(el.children), depth + 1);
      });
    }(roots, 0));

    /* Обходим блоки секции сверху вниз и спускаемся ровно там, где внутри
       лежит сетка карточек или слой параллакса. Так «шапка + сетка» внутри
       .posts ведёт себя так же, как .solutions-grid прямо в контейнере, —
       иначе две одинаковые на вид сетки появлялись бы по-разному. */
    function plan(block, depth) {
      if (block.matches(SKIP_SEL)) return;
      if (block.hasAttribute('data-parallax')) return;

      var cs = getComputedStyle(block);
      if (cs.display === 'none') return;
      /* Только на верхнем уровне: там абсолютные дети контейнера — это
         декоративные подложки. Ниже мы спускаемся осознанно, и абсолютный
         блок может быть содержимым (.about-showcase__cards на десктопе). */
      if (depth === 0 && (cs.position === 'absolute' || cs.position === 'fixed')) return;

      if (isStaggerGrid(block)) {
        block.setAttribute('data-reveal-stagger', '');
        Array.prototype.forEach.call(block.children, tag);
        return;
      }

      /* Блок выше экрана нельзя показывать одним куском: пока пользователь
         доскроллит до его низа, анимация давно кончилась, и нижняя половина
         просто возникает готовой. */
      var tall = vhPlan && (heights.get(block) || 0) > vhPlan * 0.9;
      var inside = block.querySelector(STAGGER_SEL + ',[data-parallax]');

      /* У блока своя прокрутка (список материалов) — показываем его целиком.
         Видимость его детей зависит от внутреннего скролла, а не от положения
         страницы: разметив их по отдельности, мы оставили бы нижние строки
         прозрачными до тех пор, пока человек не прокрутит список внутри. */
      if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') { tall = false; }

      if ((inside || tall) && depth < 2 && block.children.length && block.children.length <= 8) {
        Array.prototype.forEach.call(block.children, function (child) { plan(child, depth + 1); });
        return;
      }

      tag(block);
    }

    roots.forEach(function (block) { plan(block, 0); });

    /* --- появление: запуск ------------------------------------------ */
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    /* Что уже на экране при загрузке, показываем сразу и без анимации: первый
       экран не должен «собираться» на глазах.

       Сначала все чтения, потом все записи. Раньше цикл чередовал
       getBoundingClientRect и classList.add — до полусотни принудительных
       пересчётов вёрстки одной пачкой прямо на загрузке. */
    var vh0 = window.innerHeight || document.documentElement.clientHeight || 0;

    /* Высоты экрана может ещё не быть: фоновая вкладка, нулевой iframe,
       часть webview, prerender. Тогда мерить не от чего — решение отдаём
       первому отчёту IntersectionObserver, у него геометрия уже настоящая. */
    var firstPass = !vh0;

    /* Возвращает true, если судьба элемента решена, — иначе он остаётся под
       наблюдением и появится при входе в экран. */
    function classify(el, box) {
      /* display: none (скрытая вкладка) — коробки нет, и rect.top === 0.
         По старому условию такой блок считался «уже на экране»; теперь он
         просто не участвует, а его появление делает переключатель вкладок. */
      if (!box.width && !box.height) { el.classList.add('is-done'); return true; }
      if (box.top < vh0 * 0.9) { el.classList.add('is-instant', 'is-in'); return true; }
      return false;
    }

    if (!firstPass) {
      var boxes = targets.map(function (el) { return el.getBoundingClientRect(); });
      targets.forEach(function (el, i) { classify(el, boxes[i]); });
    }

    function markDone(el) {
      el.classList.add('is-done');
      el.style.removeProperty('--reveal-delay');
    }

    function reveal(el) {
      el.classList.add('is-in');
      var fallback = setTimeout(function () { markDone(el); }, 2000);
      el.addEventListener('animationend', function done(e) {
        if (e.target !== el) return;
        clearTimeout(fallback);
        el.removeEventListener('animationend', done);
        markDone(el);
      });
    }

    if ('IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (entries) {
        /* геометрию при загрузке снять не удалось — первый отчёт наблюдателя
           и есть замер: что видно, показываем без анимации, остальное ждёт */
        if (firstPass) {
          var vh = window.innerHeight || document.documentElement.clientHeight || 0;
          /* Наблюдатель присылает первый отчёт всегда, даже когда мерить ещё
             нечего. Такой отчёт ничего не решает — ждём следующего, иначе
             флаг сгорит впустую и страховка ниже уже не сработает. */
          if (!vh) return;
          firstPass = false;
          vh0 = vh;
          entries.forEach(function (e) {
            /* снимаем с наблюдения только то, с чем разобрались */
            if (classify(e.target, e.boundingClientRect)) revealIO.unobserve(e.target);
          });
          return;
        }

        var batch = entries.filter(function (e) { return e.isIntersecting; })
                           .map(function (e) { return e.target; });
        if (!batch.length) return;

        /* Лесенка считается по пачке, а не по номеру ребёнка в разметке.
           Раньше задержка была прибита к индексу: вторая строка сетки
           въезжала в экран отдельно, но всё равно ждала свои 0.16–0.32 с —
           получалась мёртвая пауза и потом рывок всей строкой сразу. */
        var groups = new Map();
        batch.forEach(function (el) {
          var parent = el.parentElement;
          var key = parent && parent.hasAttribute('data-reveal-stagger') ? parent : el;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(el);
        });

        groups.forEach(function (list) {
          list.sort(function (a, b) {
            return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
          });
          list.forEach(function (el, i) {
            revealIO.unobserve(el);
            if (i) el.style.setProperty('--reveal-delay', (Math.min(i, 4) * 0.07).toFixed(2) + 's');
            reveal(el);
          });
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });

      targets.forEach(function (el) {
        if (!el.classList.contains('is-in') && !el.classList.contains('is-done')) revealIO.observe(el);
      });

      /* страховка: если отрисовки так и не случилось и наблюдатель молчит,
         через три секунды просто показываем страницу — пустой она остаться
         не может ни при каких обстоятельствах */
      if (firstPass) {
        setTimeout(function () {
          if (!firstPass) return;
          firstPass = false;
          targets.forEach(function (el) {
            revealIO.unobserve(el);
            el.classList.add('is-instant', 'is-in');
          });
        }, 3000);
      }
    } else {
      targets.forEach(function (el) { el.classList.add('is-in', 'is-done'); });
    }

    /* --- параллакс: счёт -------------------------------------------- */
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'))
      .map(function (el) {
        return { el: el, kind: el.getAttribute('data-parallax'), amount: 0, shift: 0 };
      });

    function measure() {
      layers.forEach(function (l) {
        /* именно isNaN, а не `|| 24`: медиазапрос вправе выставить --px: 0,
           чтобы погасить ход там, где картинке не хватает запаса за рамкой */
        var px = parseFloat(getComputedStyle(l.el).getPropertyValue('--px'));
        l.amount = isNaN(px) ? 24 : px;
      });
    }

    if (layers.length) {
      measure();

      onScroll(function () {
        var vh = window.innerHeight;
        if (!vh) return;                      /* фоновая вкладка: делить не на что */

        /* сначала все чтения, потом все записи — иначе браузер пересчитывает
           геометрию на каждом элементе по очереди */
        var boxes = layers.map(function (l) { return l.el.getBoundingClientRect(); });

        layers.forEach(function (l, i) {
          var box = boxes[i];
          /* rect уже включает наш собственный сдвиг — вычитаем его, иначе
             каждый кадр считается от предыдущего и амплитуда «недобирает» */
          var top = box.top - l.shift;
          if (box.bottom < -240 || box.top > vh + 240) return;

          var shift;
          if (l.kind === 'hero') {
            /* герой стоит наверху: при нулевом скролле смещения нет */
            shift = clamp(-top / vh, 0, 1) * l.amount;
          } else {
            /* остальные: −amount на входе в экран, +amount на выходе */
            var progress = (vh - top) / (vh + box.height);
            shift = (clamp(progress, 0, 1) * 2 - 1) * l.amount;
          }

          l.shift = shift;
          l.el.style.setProperty('--py', shift.toFixed(1) + 'px');
        });
      });
    }

    /* амплитуда зависит от медиазапроса — после смены ширины её надо
       перечитать, иначе фото ездит на «десктопные» пиксели в мобильной рамке */
    window.addEventListener('resize', function () {
      measure();
      scheduleScroll();
    });
  }

  /* ---------------------------------------------------------------- */
  /* Counters — numbers spin up once they scroll into view             */
  /*                                                                    */
  /* Пороги те же, что у появления блоков: раньше плашка начинала       */
  /* проявляться на 5% видимости, а цифры стартовали только на 40% —    */
  /* число «догоняло» уже проявившийся блок.                            */
  /* ---------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.dataset.count) || 0;
      var dur = parseInt(el.dataset.countDuration, 10) || 1400;

      /* моноширинные цифры: иначе на каждом кадре меняется ширина разрядов
         и число мелко дрожит внутри своей колонки */
      el.style.fontVariantNumeric = 'tabular-nums';

      if (still.matches) { el.textContent = String(target); return; }

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
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
      counters.forEach(function (el) { io.observe(el); });
    } else {
      counters.forEach(run);
    }
  }

  /* ---------------------------------------------------------------- */
  /* YouTube facade — the iframe is only created on demand             */
  /* ---------------------------------------------------------------- */
  function stopVideo(scope) {
    scope.querySelectorAll('.showcase__iframe').forEach(function (frame) {
      var holder = frame.parentElement;
      frame.remove();
      if (holder) holder.classList.remove('is-playing');
    });
  }

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
      /* кадр проявляется только когда действительно загрузился — обложка
         в это время гаснет, и между ними не остаётся голой картинки.
         Таймер на случай, если `load` так и не придёт: показать пустой
         плеер лучше, чем оставить прозрачную дыру на месте обложки. */
      var show = function () { frame.classList.add('is-ready'); };
      var safety = setTimeout(show, 2500);
      frame.addEventListener('load', function () { clearTimeout(safety); show(); });
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

      /* проявление — только на разворот и только один раз */
      if (expanded) {
        var rows = Array.prototype.slice.call(target.querySelectorAll('.compare-table__extra'));
        rows.forEach(function (row) { row.classList.remove('is-row-in'); });
        void target.offsetWidth;                     // один рефлоу на всю пачку
        rows.forEach(function (row) {
          row.classList.add('is-row-in');
          row.addEventListener('animationend', function done() {
            row.classList.remove('is-row-in');
            row.removeEventListener('animationend', done);
          });
        });
      }

      var counter = document.getElementById('compare-shown');
      if (counter) {
        var rows = target.querySelectorAll('tbody tr');
        var hidden = target.querySelectorAll('tbody tr.compare-table__extra');
        counter.textContent = expanded ? rows.length : rows.length - hidden.length;
      }
    });
  });

}());
