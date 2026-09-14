<?php /** Shared redesign footer chrome. */ ?>
<footer class="site-footer">
  <div class="container">

    <div class="footer__top">
      <div class="footer__brand">
        <a class="footer__logo" href="<?php echo esc_url( rayton_v2_page_url( 'home', '' ) ); ?>" aria-label="Rayton">
          <svg><use href="#i-logo-white"></use></svg>
        </a>
		<p class="footer__about"><?php echo esc_html( rayton_v2_ui( 'footer_about' ) ); ?></p>
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
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'solutions', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'all_solutions' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'solar' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'industrial_solar' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-roof', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'rooftop_solar' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'self_consumption' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'uze', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'storage' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'hybrid', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'hybrid_systems' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'autonomous', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'autonomous_solutions' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'services', '#monitoring' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'service_monitoring' ) ); ?></a></li>
          </ul>
        </div>

        <div class="footer__col">
          <p class="footer__title"><?php echo esc_html( rayton_v2_ui( 'business' ) ); ?></p>
          <ul class="footer__links">
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'production' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-roof', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'warehouses' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-roof', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'logistics' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'agriculture' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'fuel_stations' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'shopping_centres' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'offices' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-consumption', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'hotels_restaurants' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'food_industry' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'ses-industrial', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'metalworking' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'uze', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'data_centres' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'autonomous', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'condominiums' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'hybrid', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'utility_companies' ) ); ?></a></li>
          </ul>
        </div>

        <div class="footer__col">
          <p class="footer__title"><?php echo esc_html( rayton_v2_ui( 'company' ) ); ?></p>
          <ul class="footer__links">
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'about', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'about' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'services', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'services' ) ); ?></a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'projects', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'projects' ) ); ?></a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'blog', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'blog' ) ); ?></a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'youtube', '' ) ); ?>">YouTube</a></li>
            <li><a href="<?php echo esc_url( rayton_v2_page_url( 'financing', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'financing' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'calculator', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'payback_calculator' ) ); ?></a></li>
			<li><a href="<?php echo esc_url( rayton_v2_page_url( 'faq', '' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'questions_answers' ) ); ?></a></li>
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
			  <svg><use href="#i-c-pin"></use></svg><?php echo esc_html( rayton_v2_ui( 'address' ) ); ?></span>
            <span class="footer__contact footer__contact--muted">
			  <svg><use href="#i-c-clock"></use></svg><?php echo esc_html( rayton_v2_ui( 'hours' ) ); ?></span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__bottom-inner">
		<p><?php echo esc_html( rayton_v2_ui( 'copyright' ) ); ?></p>
		<nav class="footer__legal" aria-label="<?php echo esc_attr( rayton_v2_ui( 'legal' ) ); ?>">
		  <a href="#"><?php echo esc_html( rayton_v2_ui( 'privacy' ) ); ?></a>
		  <a href="#"><?php echo esc_html( rayton_v2_ui( 'terms' ) ); ?></a>
        </nav>
      </div>
    </div>

  </div>
</footer>
