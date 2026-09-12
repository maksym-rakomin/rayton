<?php
/** Generated from the index static source; source remains read-only. */
?>
<main>

  <!-- ==================== HERO ==================== -->
  <section class="hero">
    <!-- two layers: a sharp plate plus a blurred copy faded in by a mask,
         which reproduces the progressive blur from the artboard -->
    <div class="hero__media">
      <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/hero-home.jpg' ) ); ?>" alt="" width="1920" height="1080" fetchpriority="high">
      <img class="hero__media-blur" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/hero-home.jpg' ) ); ?>" alt="" aria-hidden="true" width="1920" height="1080">
    </div>

    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__eyebrow"><span class="dot"></span>Комплексні енергетичні рішення для бізнесу</p>

        <h1 class="hero__title">Сонячні електростанції<br>та промислові УЗЕ <span class="accent">під ключ</span></h1>

        <p class="hero__lead">Проєктуємо, будуємо та запускаємо <b>СЕС і системи накопичення енергії</b>
          для українських підприємств. Зменшуємо витрати на електроенергію та
          підвищуємо автономність бізнесу.</p>

        <div class="hero__actions">
          <a class="btn btn--primary" href="#calculator">
            Розрахувати проєкт
            <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
          </a>
          <a class="btn btn--outline-light" href="#projects">
            Переглянути кейси
            <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
          </a>
        </div>

        <ul class="stats">
          <li class="stats__item">
            <span class="stats__value"><span class="mark mark--plain"><span data-count="2500">0</span>+</span></span>
            <span class="stats__label">реалізованих проєктів</span>
          </li>
          <li class="stats__item">
            <span class="stats__value"><span class="mark mark--plain"><span data-count="15">0</span>+</span></span>
            <span class="stats__label">років досвіду</span>
          </li>
          <li class="stats__item">
            <span class="stats__value"><span class="mark mark--plain">до <span data-count="30">0</span></span></span>
            <span class="stats__label">років гарантії</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ==================== ПРО КОМПАНІЮ ==================== -->
  <section class="section section-about">
    <div class="container">

      <div class="section-head-row">
        <div class="section-head">
          <p class="eyebrow">Про компанію</p>
          <h2 class="section-head__title">Rayton будує <span class="mark">енергонезалежність</span> українського бізнесу</h2>
        </div>
        <p class="section-head-row__aside">Rayton — інжинірингова компанія, що спеціалізується на сонячних
          електростанціях та промислових системах накопичення енергії. Ми беремо на себе повний цикл:
          аудит, проєктування, підбір обладнання, монтаж, запуск, документацію, моніторинг і сервіс.</p>
      </div>

      <div class="about-showcase">
        <img class="about-showcase__bg" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/about-company.jpg' ) ); ?>" alt="Монтаж сонячних панелей командою Rayton" width="1920" height="998" loading="lazy">

        <ul class="about-showcase__cards">
          <li class="glass-card">
            <span class="glass-card__num">01</span>
            <div class="glass-card__body">
              <div class="glass-card__head">
                <h3 class="glass-card__title">Повний цикл</h3>
                <p class="glass-card__text">Від першої консультації до запуску та сервісу. Один підрядник — одна відповідальність.</p>
              </div>
              <div class="tag-row tag-row--tight">
                <span class="tag">аудит</span>
                <span class="tag">проєкт</span>
                <span class="tag">монтаж</span>
                <span class="tag">запуск</span>
                <span class="tag">сервіс</span>
              </div>
            </div>
          </li>

          <li class="glass-card">
            <span class="glass-card__num">02</span>
            <div class="glass-card__body">
              <div class="glass-card__head">
                <h3 class="glass-card__title">Інженерний підхід</h3>
                <p class="glass-card__text">Розрахунок під реальне споживання, дах, графік роботи та пікові навантаження.</p>
              </div>
              <div class="tag-row tag-row--tight">
                <span class="tag">симуляція</span>
                <span class="tag">профіль навантаження</span>
                <span class="tag">BIM-модель даху</span>
              </div>
            </div>
          </li>

          <li class="glass-card">
            <span class="glass-card__num">03</span>
            <div class="glass-card__body">
              <div class="glass-card__head">
                <h3 class="glass-card__title">Фінансовий фокус</h3>
                <p class="glass-card__text">Показуємо економіку проєкту, окупність і можливі варіанти фінансування.</p>
              </div>
              <div class="tag-row tag-row--tight">
                <span class="tag">NPV / IRR</span>
                <span class="tag">лізинг</span>
                <span class="tag">кредит 5–7–9%</span>
                <span class="tag">грант</span>
              </div>
            </div>
          </li>

          <li class="glass-card">
            <span class="glass-card__num">04</span>
            <div class="glass-card__body">
              <div class="glass-card__head">
                <h3 class="glass-card__title">Сервіс після запуску</h3>
                <p class="glass-card__text">Моніторинг, перевірки, гарантійна підтримка та технічний супровід.</p>
              </div>
              <div class="tag-row tag-row--tight">
                <span class="tag">моніторинг 24/7</span>
                <span class="tag">SLA</span>
                <span class="tag">регламент</span>
                <span class="tag">запчастини</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </section>

  <!-- ==================== РІШЕННЯ ==================== -->
  <section class="section section-solutions" id="solutions">
    <div class="container">

      <div class="section-head">
        <p class="eyebrow">Рішення</p>
        <h2 class="section-head__title">Оберіть енергетичне <span class="mark">рішення під ваш об’єкт</span></h2>
      </div>

      <ul class="solutions-grid">
        <li>
          <article class="solution-card">
            <div class="solution-card__media">
              <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/solution-1.jpg' ) ); ?>" alt="СЕС для бізнесу" width="612" height="459" loading="lazy">
            </div>
            <div class="solution-card__body">
              <h3 class="solution-card__title">СЕС для бізнесу</h3>
              <p class="solution-card__text">Сонячні електростанції для підприємств, виробництв, складів, АЗС,
                агрооб’єктів, торговельних і офісних приміщень.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>">Підібрати рішення <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </article>
        </li>
        <li>
          <article class="solution-card">
            <div class="solution-card__media">
              <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/solution-2.jpg' ) ); ?>" alt="Промислові СЕС" width="612" height="459" loading="lazy">
            </div>
            <div class="solution-card__body">
              <h3 class="solution-card__title">Промислові СЕС</h3>
              <p class="solution-card__text">Проєктування і будівництво сонячних електростанцій під комерційне
                споживання, дахові або наземні об’єкти.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>">Підібрати рішення <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </article>
        </li>
        <li>
          <article class="solution-card">
            <div class="solution-card__media">
              <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/solution-3.jpg' ) ); ?>" alt="УЗЕ" width="612" height="459" loading="lazy">
            </div>
            <div class="solution-card__body">
              <h3 class="solution-card__title">УЗЕ</h3>
              <p class="solution-card__text">Промислові системи накопичення електроенергії для резерву, стабільної
                роботи та зниження залежності від мережі.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'uze', '' ) ); ?>">Підібрати рішення <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </article>
        </li>
        <li>
          <article class="solution-card">
            <div class="solution-card__media">
              <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/solution-4.jpg' ) ); ?>" alt="СЕС + УЗЕ" width="612" height="459" loading="lazy">
            </div>
            <div class="solution-card__body">
              <h3 class="solution-card__title">СЕС + УЗЕ</h3>
              <p class="solution-card__text">Комплексне рішення для бізнесу, якому потрібна не тільки економія,
                а й автономність під час нестабільної роботи мережі.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'hybrid', '' ) ); ?>">Підібрати рішення <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </article>
        </li>
      </ul>

      <div class="cta-banner">
        <div class="cta-banner__text">
          <p class="cta-banner__title">Не знаєте, яке рішення потрібне саме вам?</p>
          <p class="cta-banner__note">Залиште заявку — ми підкажемо, що краще для вашого об’єкта:
            СЕС, УЗЕ або комбінована система.</p>
        </div>
        <a class="btn btn--primary" href="#calculator">
          Розрахувати проєкт
          <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
        </a>
      </div>

    </div>
  </section>

  <!-- ==================== ЯК МИ ПРАЦЮЄМО ==================== -->
  <section class="section section-process">
    <div class="container">

      <div class="section-head">
        <p class="eyebrow">Як ми працюємо</p>
        <h2 class="section-head__title">Від енергоаудиту до <span class="mark">запуску системи</span></h2>
      </div>

      <ol class="process-grid">
        <li class="step">
          <span class="step__num">01</span>
          <div class="step__body">
            <h3 class="step__title">Аудит</h3>
            <p class="step__text">Аналізуємо споживання, об’єкт, дах або територію, графік роботи та цілі бізнесу.</p>
          </div>
        </li>
        <li class="step">
          <span class="step__num">02</span>
          <div class="step__body">
            <h3 class="step__title">Проєкт</h3>
            <p class="step__text">Готуємо технічне рішення, схему підключення та економіку проєкту.</p>
          </div>
        </li>
        <li class="step">
          <span class="step__num">03</span>
          <div class="step__body">
            <h3 class="step__title">Обладнання</h3>
            <p class="step__text">Підбираємо панелі, інвертори та накопичувачі під бюджет об’єкта.</p>
          </div>
        </li>
        <li class="step">
          <span class="step__num">04</span>
          <div class="step__body">
            <h3 class="step__title">Монтаж</h3>
            <p class="step__text">Виконуємо монтажні та електромонтажні роботи власною бригадою.</p>
          </div>
        </li>
        <li class="step step--accent">
          <span class="step__num">05</span>
          <div class="step__body">
            <h3 class="step__title">Запуск</h3>
            <p class="step__text">Підключаємо систему, перевіряємо її роботу та передаємо документацію.</p>
          </div>
        </li>
      </ol>

    </div>
  </section>

  <!-- ==================== РЕАЛІЗОВАНІ ОБ'ЄКТИ ==================== -->
  <!-- WP: табы переключают весь блок. Панель «Статті» тянет последние записи,
       панель «Відео» — ролики с YouTube (data-youtube = ID ролика). -->
  <section class="section section--dark section-showcase" id="projects">
    <div class="container">

      <div class="showcase" id="showcase">

        <div class="showcase__main">
          <div class="section-head">
            <p class="eyebrow">Реалізовані об’єкти</p>
            <h2 class="section-head__title">Приклади <span class="mark mark--dark">проєктів Rayton</span></h2>
          </div>

          <div class="tabs tabs--light showcase__tabs" data-tabs="#showcase" role="tablist">
            <button class="tabs__btn is-active" type="button" role="tab" aria-selected="true">Статті</button>
            <button class="tabs__btn" type="button" role="tab" aria-selected="false">Відео</button>
          </div>

          <article class="showcase__feature" data-tab-panel="0">
            <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/projects-video.jpg' ) ); ?>" alt="СЕС + УЗЕ = енергія" width="1492" height="995" loading="lazy">
            <div class="showcase__feature-body">
              <h3 class="showcase__feature-title">СЕС + УЗЕ = енергія</h3>
              <p class="showcase__feature-text">Розбираємо, як синергія технологій створює нові можливості
                для сталого майбутнього.</p>
              <p class="showcase__meta"><svg><use href="#i-calendar"></use></svg>24 травня 2026</p>
            </div>
          </article>

          <article class="showcase__feature showcase__feature--video is-hidden" data-tab-panel="1"
                   data-youtube="dQw4w9WgXcQ" data-youtube-title="СЕС + УЗЕ = енергія">
            <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/projects-video.jpg' ) ); ?>" alt="Відео: СЕС + УЗЕ = енергія" width="1492" height="995" loading="lazy">
            <button class="showcase__play" type="button" aria-label="Дивитися відео">
              <svg><use href="#i-play"></use></svg>
            </button>
            <div class="showcase__feature-body">
              <h3 class="showcase__feature-title">СЕС + УЗЕ = енергія</h3>
              <p class="showcase__feature-text">Розбираємо, як синергія технологій створює нові можливості
                для сталого майбутнього.</p>
              <p class="showcase__meta"><svg><use href="#i-calendar"></use></svg>24 травня 2026</p>
            </div>
          </article>
        </div>

        <div class="showcase__list" data-tab-panel="0" tabindex="0">
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-1.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Майбутнє енергетики: погляд у 2030</span>
              <span class="media-row__note">5 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-2.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Наземна СЕС для агропідприємства</span>
              <span class="media-row__note">6 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-3.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Дахова СЕС на 1,2 МВт: як це працює</span>
              <span class="media-row__note">4 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-4.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">УЗЕ для складського комплексу</span>
              <span class="media-row__note">7 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-5.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Гібридна система для виробництва</span>
              <span class="media-row__note">5 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-6.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Енергоаудит: з чого почати</span>
              <span class="media-row__note">3 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-7.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Сервіс СЕС: регламент і моніторинг</span>
              <span class="media-row__note">6 хв на читання</span>
            </span>
          </a>
          <a class="media-row" href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-8.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Скільки коштує СЕС для бізнесу</span>
              <span class="media-row__note">8 хв на читання</span>
            </span>
          </a>
        </div>

        <div class="showcase__list is-hidden" data-tab-panel="1" tabindex="0">
          <a class="media-row media-row--video" href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-2.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Як монтується промислова СЕС</span>
              <span class="media-row__note">4:12</span>
            </span>
          </a>
          <a class="media-row media-row--video" href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-5.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">УЗЕ на об’єкті: розпакування та запуск</span>
              <span class="media-row__note">6:38</span>
            </span>
          </a>
          <a class="media-row media-row--video" href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-3.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Дахова станція 1,2 МВт — огляд</span>
              <span class="media-row__note">3:05</span>
            </span>
          </a>
          <a class="media-row media-row--video" href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-7.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Rayton Control: як працює моніторинг</span>
              <span class="media-row__note">5:47</span>
            </span>
          </a>
          <a class="media-row media-row--video" href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-4.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Гібридна система: СЕС + УЗЕ + генератор</span>
              <span class="media-row__note">8:21</span>
            </span>
          </a>
          <a class="media-row media-row--video" href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">
            <span class="media-row__media"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media-8.jpg' ) ); ?>" alt="" width="500" height="388" loading="lazy"></span>
            <span class="media-row__body">
              <span class="media-row__date">24 травня 2026</span>
              <span class="media-row__title">Скільки економить бізнес на СЕС</span>
              <span class="media-row__note">4:59</span>
            </span>
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- ==================== ОСТАННІ СТАТТІ ==================== -->
  <section class="section section-posts">
    <div class="container">

      <div class="section-head-row posts__head">
        <div class="posts__head-text">
          <div class="section-head">
            <p class="eyebrow">Корисні матеріали</p>
            <h2 class="section-head__title">Останні статті, кейси <span class="mark">та відео Rayton</span></h2>
          </div>
          <p class="posts__lead">Пояснюємо простою мовою, як бізнесу підготуватись до встановлення
            СЕС, УЗЕ та комплексних енергетичних рішень.</p>
        </div>
        <a class="btn-line" href="<?php echo esc_url( rayton_v2_page_url( 'blog', '' ) ); ?>">Усі матеріали <svg><use href="#i-arrow-ur"></use></svg></a>
      </div>

      <div class="posts">
        <a class="post-row" href="<?php echo esc_url( rayton_v2_page_url( 'blog', '' ) ); ?>">
          <span class="post-row__media">
            <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/article-1.jpg' ) ); ?>" alt="" width="392" height="261" loading="lazy">
            <span class="tag tag--solid tag--glass">Стаття</span>
          </span>
          <span class="post-row__body">
            <span class="post-row__date">12 травня, 2026</span>
            <span class="post-row__title">Промислові УЗЕ: коли бізнесу потрібен накопичувач</span>
            <span class="post-row__text">Розбираємо, коли система накопичення дійсно окупається, а коли краще почати з СЕС.</span>
          </span>
          <span class="icon-btn"><svg><use href="#i-arrow-ur"></use></svg></span>
        </a>

        <a class="post-row" href="<?php echo esc_url( rayton_v2_page_url( 'blog', '' ) ); ?>">
          <span class="post-row__media">
            <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/article-2.jpg' ) ); ?>" alt="" width="392" height="261" loading="lazy">
            <span class="tag tag--solid tag--glass">Кейс</span>
          </span>
          <span class="post-row__body">
            <span class="post-row__date">12 травня, 2026</span>
            <span class="post-row__title">Дахова СЕС для виробництва: розрахунок і результат</span>
            <span class="post-row__text">Показуємо економіку об’єкта: споживання, потужність станції та фактичну економію.</span>
          </span>
          <span class="icon-btn"><svg><use href="#i-arrow-ur"></use></svg></span>
        </a>

        <a class="post-row" href="<?php echo esc_url( rayton_v2_page_url( 'blog', '' ) ); ?>">
          <span class="post-row__media">
            <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/article-3.jpg' ) ); ?>" alt="" width="392" height="261" loading="lazy">
            <span class="tag tag--solid tag--glass">Відео</span>
          </span>
          <span class="post-row__body">
            <span class="post-row__date">12 травня, 2026</span>
            <span class="post-row__title">Як обрати інвертор для комерційної станції</span>
            <span class="post-row__text">Коротко про типи інверторів, запас потужності та сумісність із накопичувачем.</span>
          </span>
          <span class="icon-btn"><svg><use href="#i-arrow-ur"></use></svg></span>
        </a>
      </div>

    </div>
  </section>

  <!-- ==================== КАЛЬКУЛЯТОР ==================== -->
  <section class="section section-calc" id="calculator">
      <div class="section-bg" aria-hidden="true">
        <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/calculator-bg.jpg' ) ); ?>" alt="" width="1537" height="1023" loading="lazy">
      </div>

    <div class="container">

      <div class="section-head-row calc__head">
        <h2 class="section-head__title calc__title">Калькулятор окупності <span class="mark mark--dark">СЕС</span></h2>
        <p class="section-head-row__aside calc__aside">Введіть середньомісячне споживання або суму витрат
          на електроенергію, щоб отримати попередній розрахунок вартості, економії, окупності
          та кредитного сценарію.</p>
      </div>

      <div class="calc">
        <form class="calc__card" action="<?php echo esc_url( rayton_v2_page_url( 'calculator', '' ) ); ?>" method="get">
          <p class="calc__variant"><span class="dot"></span>Варіант розрахунку 1</p>

          <div class="calc__fields">
            <label class="field">
              <span class="field__label">Середньомісячне споживання</span>
              <span class="field__control">
                <input type="text" name="monthlyConsumptionKwh" inputmode="decimal" placeholder="Наприклад: 5000">
                <span class="field__unit">кВт·год</span>
              </span>
            </label>

            <label class="field">
              <span class="field__label">Поточний тариф із розподілом, передачею та ПДВ</span>
              <span class="field__control">
                <input type="text" name="tariff" inputmode="decimal" placeholder="Наприклад: 4.32">
                <span class="field__unit">грн/кВт·год</span>
              </span>
            </label>
          </div>

          <button class="btn btn--primary calc__submit" type="submit">Розрахувати</button>
        </form>

        <form class="calc__card" action="<?php echo esc_url( rayton_v2_page_url( 'calculator', '' ) ); ?>" method="get">
          <p class="calc__variant"><span class="dot"></span>Варіант розрахунку 2</p>

          <div class="calc__fields">
            <label class="field">
              <span class="field__label">Середньомісячні витрати на електроенергію</span>
              <span class="field__control">
                <input type="text" name="monthlyCostUAH" inputmode="decimal" placeholder="Наприклад: 25000">
                <span class="field__unit">грн</span>
              </span>
            </label>
            <p class="field__hint">* Введіть загальну суму з рахунку за електроенергію
              включно з усіма складовими.</p>
          </div>

          <button class="btn btn--primary calc__submit" type="submit">Розрахувати</button>
        </form>
      </div>

      <p class="calc__disclaimer">Розрахунок є попереднім. Точні параметри залежать від об’єкта, графіку
        споживання, тарифу, обладнання, умов фінансування та технічного рішення.</p>

    </div>
  </section>

  <!-- ==================== SEO + FAQ ==================== -->
  <section class="section section-seo">
    <div class="container seo">

      <div class="seo__text">
        <h2 class="seo__title">СЕС та УЗЕ для енергонезалежності бізнесу в Україні</h2>
        <div class="seo__body">
          <p>Rayton розробляє та впроваджує комплексні енергетичні рішення для українських підприємств:
            сонячні електростанції для бізнесу, промислові системи накопичення електроенергії,
            гібридні рішення СЕС + УЗЕ, проєктування, монтаж, запуск і сервісний супровід.</p>
          <p>Ми працюємо з підприємствами, які хочуть зменшити витрати на електроенергію, підвищити
            стабільність роботи, підготуватись до можливих відключень та зробити енергоспоживання
            більш прогнозованим. Для кожного об’єкта рішення підбирається індивідуально: з урахуванням
            споживання, площі даху або території, графіку роботи, критичних навантажень і фінансових
            цілей бізнесу.</p>
        </div>
      </div>

      <div class="accordion seo__faq">
        <div class="accordion__item">
          <h3>
            <button class="accordion__trigger" type="button" aria-expanded="false">
              Що входить у рішення Rayton?
              <svg><use href="#i-arrow-down"></use></svg>
            </button>
          </h3>
          <div class="accordion__panel"><div>
            <div class="accordion__content">
              <p>Енергоаудит об’єкта, технічне рішення та проєкт, підбір і постачання обладнання,
                монтаж, пусконалагодження, документація, моніторинг і подальший сервіс.</p>
            </div>
          </div></div>
        </div>

        <div class="accordion__item">
          <h3>
            <button class="accordion__trigger" type="button" aria-expanded="false">
              Для кого підходять СЕС та УЗЕ?
              <svg><use href="#i-arrow-down"></use></svg>
            </button>
          </h3>
          <div class="accordion__panel"><div>
            <div class="accordion__content">
              <p>Виробництвам, складським і логістичним комплексам, агропідприємствам, АЗС,
                торговельним та офісним об’єктам — усім, хто має стабільне денне споживання
                або критичні навантаження.</p>
            </div>
          </div></div>
        </div>
      </div>

    </div>
  </section>

</main>
