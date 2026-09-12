<?php /** Shared redesign footer chrome. */ ?>
<footer class="site-footer">
  <div class="container">

    <div class="footer__top">
      <div class="footer__brand">
        <a class="footer__logo" href="<?php echo esc_url( rayton_v2_page_url( 'home', '' ) ); ?>" aria-label="Rayton">
          <svg><use href="#i-logo-white"></use></svg>
        </a>
        <p class="footer__about">Інжинірингова компанія з проєктування та впровадження
          СЕС і УЗЕ для бізнесу в Україні</p>
        <div class="socials">
          <a class="socials__link" href="#" aria-label="Facebook"><svg><use href="#i-social-1"></use></svg></a>
          <a class="socials__link" href="#" aria-label="Instagram"><svg><use href="#i-social-2"></use></svg></a>
          <a class="socials__link" href="#" aria-label="LinkedIn"><svg><use href="#i-social-3"></use></svg></a>
          <a class="socials__link" href="#" aria-label="YouTube"><svg><use href="#i-social-4"></use></svg></a>
        </div>
      </div>

      <div class="footer__nav">
        <div class="footer__col">
          <p class="footer__title"><?php echo esc_html( rayton_v2_ui( 'solutions' ) ); ?></p>
          <ul class="footer__links">
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'solutions', '' ) ); ?>">Усі рішення</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>">СЕС для бізнесу</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>">Промислові СЕС</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-roof', '' ) ); ?>">Дахові СЕС</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>">СЕС для власного споживання</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'uze', '' ) ); ?>">УЗЕ</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'hybrid', '' ) ); ?>">Гібридні системи</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'autonomous', '' ) ); ?>">Автономні рішення</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'services', '#monitoring' ) ); ?>">Сервіс і моніторинг</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <p class="footer__title"><?php echo esc_html( rayton_v2_ui( 'business' ) ); ?></p>
          <ul class="footer__links">
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>">Виробництва</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-roof', '' ) ); ?>">Склади</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-roof', '' ) ); ?>">Логістичні комплекси</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>">Агропідприємства</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>">АЗС та автокомплекси</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>">Торгові центри</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>">Офісні будівлі</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>">Готелі й ресторани</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>">Харчова промисловість</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>">Металообробка</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'uze', '' ) ); ?>">Дата-центри</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'autonomous', '' ) ); ?>">ОСББ</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'hybrid', '' ) ); ?>">Комунальні підприємства</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <p class="footer__title"><?php echo esc_html( rayton_v2_ui( 'company' ) ); ?></p>
          <ul class="footer__links">
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'about', '' ) ); ?>">Про нас</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'services', '' ) ); ?>">Послуги</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'projects' ) ); ?></a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'blog', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'blog' ) ); ?></a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">YouTube</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'financing', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'financing' ) ); ?></a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'calculator', '' ) ); ?>">Калькулятор окупності</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'faq', '' ) ); ?>">Запитання та відповіді</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'contacts', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'contacts' ) ); ?></a></li>
          </ul>
        </div>

        <div class="footer__col">
          <p class="footer__title"><?php echo esc_html( rayton_v2_ui( 'contacts' ) ); ?></p>
          <div class="footer__contacts">
            <a class="footer__contact" href="tel:+380732422343">
              <svg><use href="#i-c-phone"></use></svg>+38 (073) 242-23-43</a>
            <a class="footer__contact" href="mailto:sales@rayton.com.ua">
              <svg><use href="#i-c-mail"></use></svg>sales@rayton.com.ua</a>
            <span class="footer__contact">
              <svg><use href="#i-c-pin"></use></svg>Київ, вул. Велика Васильківська, 72</span>
            <span class="footer__contact footer__contact--muted">
              <svg><use href="#i-c-clock"></use></svg>Пн-Пт: 9:00 – 18:00</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__bottom-inner">
        <p>© 2026 Rayton. Усі права захищені</p>
        <nav class="footer__legal" aria-label="Правова інформація">
          <a href="#">Політика конфіденційності</a>
          <a href="#">Умови використання</a>
        </nav>
      </div>
    </div>

  </div>
</footer>
