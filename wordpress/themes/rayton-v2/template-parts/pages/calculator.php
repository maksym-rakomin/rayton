<?php
/** Generated from the calculator static source; source remains read-only. */
?>
<main>

  <!-- ==================== КАЛЬКУЛЯТОР ==================== -->
  <section class="section section-calc" id="calc">
      <div class="section-bg" aria-hidden="true">
        <img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/calculator-bg.jpg' ) ); ?>" alt="" width="1537" height="1023" loading="lazy">
      </div>

    <div class="container">

      <div class="section-head-row calc__head">
        <div class="section-head">
          <p class="eyebrow">Розрахунок</p>
          <h1 class="section-head__title calc__title">Калькулятор окупності
            <span class="mark mark--dark">сонячної електростанції</span></h1>
        </div>
        <p class="section-head-row__aside calc__aside">Введіть середньомісячне споживання або суму витрат
          на електроенергію, щоб отримати попередній розрахунок вартості, економії, окупності
          та кредитного сценарію.</p>
      </div>

      <div class="calc">
        <form class="calc__card" action="<?php echo esc_url( rayton_v2_page_url( 'calculator', '' ) ); ?>" method="get">
          <p class="calc__variant"><span class="dot"></span>Варіант розрахунку №1</p>

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
          <p class="calc__variant"><span class="dot"></span>Варіант розрахунку №2</p>

          <div class="calc__fields">
            <label class="field">
              <span class="field__label">Середньомісячні витрати на електроенергію</span>
              <span class="field__control">
                <input type="text" name="monthlyCostUAH" inputmode="decimal" placeholder="Наприклад: 25000">
                <span class="field__unit">грн з ПДВ</span>
              </span>
            </label>
            <p class="field__hint">Введіть загальну суму з рахунку за електроенергію
              включно з усіма складовими.</p>
          </div>

          <button class="btn btn--primary calc__submit" type="submit">Розрахувати</button>
        </form>
      </div>

      <p class="calc__disclaimer">Розрахунок є попереднім. Точні параметри залежать від об’єкта, графіку
        споживання, тарифу, обладнання, умов фінансування та технічного рішення.</p>

    </div>
  </section>

  <section class="solar-results" id="solar-results" aria-labelledby="solar-results-title" hidden>
    <div class="container">
      <p class="solar-results__eyebrow">Результати розрахунку</p>
      <h2 class="solar-results__heading" id="solar-results-title" tabindex="-1">Результати розрахунку <span>сонячної електростанції</span></h2>
      <div class="solar-results__grid"></div>
      <div class="solar-results__summary"></div>
      <p class="solar-results__note">Усі результати є попередніми та використовуються лише для первинної оцінки. Для точного розрахунку Rayton проводить аналіз об’єкта, графіку споживання та технічних умов.</p>
    </div>
  </section>

  <!-- ==================== ДАЛІ ==================== -->
  <section class="section">
    <div class="container">

      <div class="section-head">
        <p class="eyebrow">Наступний крок</p>
        <h2 class="section-head__title">Від цифр — до <span class="mark">реального проєкту</span></h2>
      </div>

      <div class="split-cta grid">
        <div class="split-cta__panel">
          <p class="eyebrow">Фінансування</p>
          <h3 class="split-cta__title">Плануєте реалізацію в кредит?</h3>
          <p class="split-cta__text">Перегляньте умови банків-партнерів і можливі сценарії
            фінансування СЕС або УЗЕ.</p>
          <div class="split-cta__actions">
            <a class="btn btn--primary" href="<?php echo esc_url( rayton_v2_page_url( 'financing', '' ) ); ?>">
              Варіанти фінансування
              <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
            </a>
          </div>
        </div>

        <div class="split-cta__panel">
          <p class="eyebrow">Консультація</p>
          <h3 class="split-cta__title">Потрібна перевірка розрахунку інженером?</h3>
          <p class="split-cta__text">Залиште заявку — ми перевіримо вхідні дані, врахуємо особливості
            об’єкта та підготуємо уточнений розрахунок.</p>
          <div class="split-cta__actions">
            <a class="btn btn--outline" href="<?php echo esc_url( rayton_v2_page_url( 'contacts', '' ) ); ?>">
              Зв’язатися з Rayton
              <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ==================== РІШЕННЯ ==================== -->
  <section class="section section-soft">
    <div class="container">

      <div class="section-head">
        <p class="eyebrow">Рішення</p>
        <h2 class="section-head__title">Що можна <span class="mark">порахувати</span></h2>
      </div>

      <ul class="grid grid--3">
        <li>
          <div class="feature-card">
            <span class="icon-chip icon-chip--yellow"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/i-solar.svg' ) ); ?>" alt="" width="24" height="24" loading="lazy"></span>
            <div class="feature-card__body">
              <h3 class="feature-card__heading">СЕС для бізнесу</h3>
              <p class="feature-card__text">Власна генерація для зменшення витрат на електроенергію.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>">Детальніше <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </div>
        </li>
        <li>
          <div class="feature-card">
            <span class="icon-chip icon-chip--yellow"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/i-shield.svg' ) ); ?>" alt="" width="24" height="24" loading="lazy"></span>
            <div class="feature-card__body">
              <h3 class="feature-card__heading">Промислові УЗЕ</h3>
              <p class="feature-card__text">Накопичення енергії для резерву та стабільної роботи
                критичних процесів.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'uze', '' ) ); ?>">Детальніше <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </div>
        </li>
        <li>
          <div class="feature-card">
            <span class="icon-chip icon-chip--yellow"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/i-modules.svg' ) ); ?>" alt="" width="24" height="24" loading="lazy"></span>
            <div class="feature-card__body">
              <h3 class="feature-card__heading">Гібридні системи</h3>
              <p class="feature-card__text">СЕС + УЗЕ + мережа + генератор під керуванням
                єдиної системи.</p>
              <a class="link-arrow" href="<?php echo esc_url( rayton_v2_page_url( 'hybrid', '' ) ); ?>">Детальніше <svg><use href="#i-arrow-right"></use></svg></a>
            </div>
          </div>
        </li>
      </ul>

    </div>
  </section>

  <!-- ==================== ФІНАЛЬНИЙ ПРИЗИВ ==================== -->
  <section class="section section-cta">
    <div class="container">

      <div class="cta-wide">
        <div class="cta-wide__text">
          <h2 class="cta-wide__title">Готові перейти від цифр до реального проєкту?</h2>
          <p class="cta-wide__lead">Залиште контакти — і Rayton допоможе перетворити попередній
            розрахунок на реальне технічне рішення для вашого бізнесу.</p>
          <div class="cta-wide__actions">
            <a class="btn btn--primary" href="<?php echo esc_url( rayton_v2_page_url( 'contacts', '' ) ); ?>">
              Зв’язатися з Rayton
              <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
            </a>
            <a class="btn btn--outline-light" href="<?php echo esc_url( rayton_v2_page_url( 'financing', '' ) ); ?>">
              Варіанти фінансування
              <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>
            </a>
          </div>
        </div>

        <div class="cta-wide__aside">
          <div class="contact-list">
            <div class="contact-list__item">
              <span class="contact-list__label">Основний телефон</span>
              <a class="contact-list__value" href="tel:+380732422343">+38 (073) 242-23-43</a>
            </div>
            <div class="contact-list__item">
              <span class="contact-list__label">Пошта</span>
              <a class="contact-list__value" href="mailto:sales@rayton.com.ua">sales@rayton.com.ua</a>
            </div>
            <div class="contact-list__item">
              <span class="contact-list__label">Графік роботи</span>
              <span class="contact-list__value">Пн–Пт: 9:00 – 18:00</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

</main>
