<?php
/**
 * Locale-aware page mapping and URL helpers.
 *
 * @package Rayton_V2
 */

function rayton_v2_current_locale() {
	if ( function_exists( 'pll_current_language' ) ) {
		$language = pll_current_language( 'slug' );
		if ( is_string( $language ) && '' !== $language ) {
			return strtolower( $language );
		}
	}

	$locale = strtolower( str_replace( '-', '_', determine_locale() ) );
	if ( 0 === strpos( $locale, 'uk' ) ) {
		return 'uk';
	}
	if ( 0 === strpos( $locale, 'en' ) ) {
		return 'en';
	}
	if ( 0 === strpos( $locale, 'ru' ) ) {
		return 'ru';
	}

	return 'unknown';
}

function rayton_v2_ui( $key ) {
	$dictionary = array(
		'uk' => array(
			'solar' => 'СЕС для бізнесу', 'storage' => 'УЗЕ для бізнесу', 'projects' => 'Проєкти',
			'financing' => 'Кредитування', 'investors' => 'Для інвесторів', 'media' => 'Медіа',
			'blog' => 'Блог', 'about' => 'Про нас', 'contact' => 'Зв’язатись', 'solutions' => 'Рішення',
			'business' => 'Для бізнесу', 'company' => 'Компанія', 'contacts' => 'Контакти',
			'navigation' => 'Головне меню', 'notifications' => 'Новини', 'latest_media' => 'Останні новини та відео',
			'close' => 'Закрити', 'view_media' => 'Перейти до медіа', 'language' => 'Мова',
			'contact_title' => 'Зв’язатись з нами', 'contact_description' => 'Отримайте консультацію або розрахунок вашого проєкту.',
			'calculate' => 'Розрахувати проєкт', 'socials' => 'Соціальні мережі', 'write' => 'Написати нам', 'menu' => 'Меню',
			'all_solutions' => 'Усі рішення', 'industrial_solar' => 'Промислові СЕС', 'rooftop_solar' => 'Дахові СЕС',
			'self_consumption' => 'СЕС для власного споживання', 'hybrid_systems' => 'Гібридні системи',
			'autonomous_solutions' => 'Автономні рішення', 'service_monitoring' => 'Сервіс і моніторинг',
			'services' => 'Послуги', 'payback_calculator' => 'Калькулятор окупності', 'questions_answers' => 'Запитання та відповіді',
			'footer_about' => 'Інжинірингова компанія з проєктування та впровадження СЕС і УЗЕ для бізнесу в Україні',
			'address' => 'Київ, вул. Велика Васильківська, 72', 'hours' => 'Пн-Пт: 9:00 – 18:00',
			'copyright' => '© 2026 Rayton. Усі права захищені', 'legal' => 'Правова інформація',
			'privacy' => 'Політика конфіденційності', 'terms' => 'Умови використання',
			'production' => 'Виробництва', 'warehouses' => 'Склади', 'logistics' => 'Логістичні комплекси',
			'agriculture' => 'Агропідприємства', 'fuel_stations' => 'АЗС та автокомплекси', 'shopping_centres' => 'Торгові центри',
			'offices' => 'Офісні будівлі', 'hotels_restaurants' => 'Готелі й ресторани', 'food_industry' => 'Харчова промисловість',
			'metalworking' => 'Металообробка', 'data_centres' => 'Дата-центри', 'condominiums' => 'ОСББ',
			'utility_companies' => 'Комунальні підприємства', 'latest_video_title' => '897кВт сонця + 2090кВт·год накопичення',
		),
		'en' => array(
			'solar' => 'Solar for business', 'storage' => 'Energy storage', 'projects' => 'Projects',
			'financing' => 'Financing', 'investors' => 'For investors', 'media' => 'Media',
			'blog' => 'Blog', 'about' => 'About us', 'contact' => 'Contact us', 'solutions' => 'Solutions',
			'business' => 'For business', 'company' => 'Company', 'contacts' => 'Contacts',
			'navigation' => 'Main menu', 'notifications' => 'News', 'latest_media' => 'Latest news and videos',
			'close' => 'Close', 'view_media' => 'View all media', 'language' => 'Language',
			'contact_title' => 'Contact us', 'contact_description' => 'Get advice or a calculation for your project.',
			'calculate' => 'Calculate your project', 'socials' => 'Social networks', 'write' => 'Write to us', 'menu' => 'Menu',
			'all_solutions' => 'All solutions', 'industrial_solar' => 'Industrial solar', 'rooftop_solar' => 'Rooftop solar',
			'self_consumption' => 'Solar for self-consumption', 'hybrid_systems' => 'Hybrid systems',
			'autonomous_solutions' => 'Autonomous solutions', 'service_monitoring' => 'Service and monitoring',
			'services' => 'Services', 'payback_calculator' => 'Payback calculator', 'questions_answers' => 'Questions and answers',
			'footer_about' => 'Engineering company designing and delivering solar and BESS solutions for businesses in Ukraine',
			'address' => '72 Velyka Vasylkivska St, Kyiv', 'hours' => 'Mon–Fri: 9:00–18:00',
			'copyright' => '© 2026 Rayton. All rights reserved', 'legal' => 'Legal information',
			'privacy' => 'Privacy policy', 'terms' => 'Terms of use',
			'production' => 'Manufacturing', 'warehouses' => 'Warehouses', 'logistics' => 'Logistics facilities',
			'agriculture' => 'Agricultural businesses', 'fuel_stations' => 'Fuel and service stations', 'shopping_centres' => 'Shopping centres',
			'offices' => 'Office buildings', 'hotels_restaurants' => 'Hotels and restaurants', 'food_industry' => 'Food industry',
			'metalworking' => 'Metalworking', 'data_centres' => 'Data centres', 'condominiums' => 'Condominiums',
			'utility_companies' => 'Utility companies', 'latest_video_title' => '897 kW solar + 2,090 kWh energy storage',
		),
		'ru' => array(
			'solar' => 'СЭС для бизнеса', 'storage' => 'Накопители энергии', 'projects' => 'Проекты',
			'financing' => 'Кредитование', 'investors' => 'Для инвесторов', 'media' => 'Медиа',
			'blog' => 'Блог', 'about' => 'О нас', 'contact' => 'Связаться', 'solutions' => 'Решения',
			'business' => 'Для бизнеса', 'company' => 'Компания', 'contacts' => 'Контакты',
			'navigation' => 'Главное меню', 'notifications' => 'Новости', 'latest_media' => 'Последние новости и видео',
			'close' => 'Закрыть', 'view_media' => 'Перейти к медиа', 'language' => 'Язык',
			'contact_title' => 'Связаться с нами', 'contact_description' => 'Получите консультацию или расчёт вашего проекта.',
			'calculate' => 'Рассчитать проект', 'socials' => 'Социальные сети', 'write' => 'Написать нам', 'menu' => 'Меню',
			'all_solutions' => 'Все решения', 'industrial_solar' => 'Промышленные СЭС', 'rooftop_solar' => 'Крышные СЭС',
			'self_consumption' => 'СЭС для собственного потребления', 'hybrid_systems' => 'Гибридные системы',
			'autonomous_solutions' => 'Автономные решения', 'service_monitoring' => 'Сервис и мониторинг',
			'services' => 'Услуги', 'payback_calculator' => 'Калькулятор окупаемости', 'questions_answers' => 'Вопросы и ответы',
			'footer_about' => 'Инжиниринговая компания по проектированию и внедрению СЭС и СНЭ для бизнеса в Украине',
			'address' => 'Киев, ул. Большая Васильковская, 72', 'hours' => 'Пн–Пт: 9:00–18:00',
			'copyright' => '© 2026 Rayton. Все права защищены', 'legal' => 'Правовая информация',
			'privacy' => 'Политика конфиденциальности', 'terms' => 'Условия использования',
			'production' => 'Производства', 'warehouses' => 'Склады', 'logistics' => 'Логистические комплексы',
			'agriculture' => 'Агропредприятия', 'fuel_stations' => 'АЗС и автокомплексы', 'shopping_centres' => 'Торговые центры',
			'offices' => 'Офисные здания', 'hotels_restaurants' => 'Гостиницы и рестораны', 'food_industry' => 'Пищевая промышленность',
			'metalworking' => 'Металлообработка', 'data_centres' => 'Дата-центры', 'condominiums' => 'ОСМД',
			'utility_companies' => 'Коммунальные предприятия', 'latest_video_title' => '897 кВт солнца + 2090 кВт·ч накопления',
		),
	);
	$locale = rayton_v2_current_locale();
	$locale = isset( $dictionary[ $locale ] ) ? $locale : 'en';
	return isset( $dictionary[ $locale ][ $key ] ) ? $dictionary[ $locale ][ $key ] : $key;
}

/** Use the redesign for every locale currently exposed by the theme switcher. */
function rayton_v2_use_packaged_page() {
	return in_array( rayton_v2_current_locale(), array( 'uk', 'en' ), true );
}

function rayton_v2_page_map() {
	return array(
		'home'            => array( 'slugs' => array( '' ), 'part' => 'home', 'required' => true ),
		'solutions'       => array( 'slugs' => array( 'solutions' ), 'part' => 'solutions' ),
		'ses'             => array( 'slugs' => array( 'rayton-business', 'ses' ), 'part' => 'ses', 'required' => true ),
		'ses-industrial'  => array( 'slugs' => array( 'ses-industrial' ), 'part' => 'ses-industrial' ),
		'ses-roof'        => array( 'slugs' => array( 'ses-roof' ), 'part' => 'ses-roof' ),
		'ses-consumption' => array( 'slugs' => array( 'ses-consumption' ), 'part' => 'ses-consumption' ),
		'uze'             => array( 'slugs' => array( 'avtonomnist', 'uze' ), 'part' => 'uze', 'required' => true ),
		'hybrid'          => array( 'slugs' => array( 'hybrid' ), 'part' => 'hybrid' ),
		'autonomous'      => array( 'slugs' => array( 'autonomous' ), 'part' => 'autonomous' ),
		'services'        => array( 'slugs' => array( 'services' ), 'part' => 'services' ),
		'financing'       => array( 'slugs' => array( 'calculator', 'financing' ), 'part' => 'financing', 'required' => true ),
		'projects'        => array( 'slugs' => array( 'rayton-portfolio', 'projects' ), 'part' => 'projects', 'required' => true, 'destination' => 'projects-hash-detail' ),
		'youtube'         => array( 'slugs' => array( 'youtube' ), 'part' => 'youtube', 'required' => true ),
		'about'           => array( 'slugs' => array( 'about-us', 'about' ), 'part' => 'about', 'required' => true ),
		'contacts'        => array( 'slugs' => array( 'rayton_contact', 'contacts' ), 'part' => 'contacts', 'required' => true ),
		'calculator'      => array( 'slugs' => array( 'okupnist', 'calculator' ), 'part' => 'calculator', 'required' => true ),
		'faq'             => array( 'slugs' => array( 'q_a', 'faq' ), 'part' => 'faq' ),
		'investments'     => array( 'slugs' => array( 'investments' ), 'part' => 'investments', 'required' => true ),
		'bank-content'    => array( 'slugs' => array( 'financing-raiffeisen' ), 'destination' => 'wordpress-content' ),
		'blog'            => array( 'slugs' => array( 'blogs', 'blog' ), 'destination' => 'wordpress-posts', 'required' => true ),
	);
}

function rayton_v2_current_page_key() {
	$virtual_key = rayton_v2_virtual_page_key();
	if ( $virtual_key ) {
		return $virtual_key;
	}
	if ( is_front_page() ) {
		return 'home';
	}
	if ( is_home() || is_archive() || is_search() || is_singular( 'post' ) ) {
		return 'blog';
	}

	$current_id   = (int) get_queried_object_id();
	$current_slug = get_post_field( 'post_name', $current_id );
	foreach ( rayton_v2_page_map() as $key => $definition ) {
		if ( empty( $definition['part'] ) || empty( $definition['slugs'] ) ) {
			continue;
		}
		foreach ( $definition['slugs'] as $slug ) {
			if ( $current_slug === $slug ) {
				return $key;
			}
			$source_page = get_page_by_path( $slug );
			if ( $source_page && function_exists( 'pll_get_post' ) ) {
				$translated_id = (int) pll_get_post( (int) $source_page->ID, rayton_v2_current_locale() );
				if ( $translated_id && $translated_id === $current_id ) {
					return $key;
				}
			}
		}
	}

	return '';
}

/**
 * Resolve theme-owned pages that may not exist in the WordPress database yet.
 */
function rayton_v2_virtual_page_key() {
	$request_path = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/', PHP_URL_PATH );
	$request_path = trim( (string) $request_path, '/' );
	$home_path    = trim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
	if ( $home_path && 0 === strpos( $request_path, $home_path . '/' ) ) {
		$request_path = substr( $request_path, strlen( $home_path ) + 1 );
	}
	$segments = array_values( array_filter( explode( '/', $request_path ) ) );
	if ( $segments && in_array( $segments[0], array( 'uk', 'en' ), true ) ) {
		array_shift( $segments );
	}

	if ( 1 !== count( $segments ) ) {
		return '';
	}

	foreach ( rayton_v2_page_map() as $key => $definition ) {
		if ( ! empty( $definition['slugs'] ) && in_array( $segments[0], $definition['slugs'], true ) ) {
			return $key;
		}
	}

	return '';
}

/**
 * Keep theme-owned routes inside the redesign even when a WP Page or Polylang
 * relation has not been created yet.
 */
function rayton_v2_virtual_page_template( $template ) {
	$virtual_key = rayton_v2_virtual_page_key();
	if ( ! $virtual_key || ! rayton_v2_use_packaged_page() ) {
		return $template;
	}

	if ( 'blog' === $virtual_key ) {
		return get_theme_file_path( 'home.php' );
	}

	$page_map = rayton_v2_page_map();
	if ( empty( $page_map[ $virtual_key ]['part'] ) ) {
		return $template;
	}

	global $wp_query;
	if ( is_404() ) {
		status_header( 200 );
	}

	/*
	 * Some production stacks can leave a pretty Page URL classified as the
	 * posts index after a theme switch. Route every packaged Page explicitly,
	 * rather than limiting the fallback to requests classified as a 404.
	 */
	$wp_query->is_404        = false;
	$wp_query->is_home       = false;
	$wp_query->is_posts_page = false;

	return get_theme_file_path( 'template-virtual-page.php' );
}
add_filter( 'template_include', 'rayton_v2_virtual_page_template' );

/** Turn /blogs/ and /blog/ into the real posts index regardless of old Page content. */
function rayton_v2_prepare_blog_query( $query ) {
	if ( is_admin() || ! $query->is_main_query() || 'blog' !== rayton_v2_virtual_page_key() ) {
		return;
	}

	$query->set( 'post_type', 'post' );
	$query->set( 'page_id', '' );
	$query->set( 'pagename', '' );
	$query->set( 'name', '' );
	$query->is_page = false;
	$query->is_404  = false;
	$query->is_home = true;
}
add_action( 'pre_get_posts', 'rayton_v2_prepare_blog_query' );

function rayton_v2_page_url_for_locale( $key, $locale, $fragment = '' ) {
	$map = rayton_v2_page_map();
	if ( ! isset( $map[ $key ] ) ) {
		return '';
	}
	$locale = in_array( $locale, array( 'uk', 'en' ), true ) ? $locale : 'uk';
	$base_url = function_exists( 'pll_home_url' ) ? pll_home_url( $locale ) : home_url( '/' );
	if ( 'home' === $key ) {
		$page_id = (int) get_option( 'page_on_front' );
		if ( $page_id ) {
			if ( function_exists( 'pll_get_post' ) ) {
				$translated_id = pll_get_post( $page_id, $locale );
				if ( $translated_id ) {
					$page_id = (int) $translated_id;
				} elseif ( $locale !== rayton_v2_current_locale() ) {
					return trailingslashit( $base_url ) . $fragment;
				}
			}
			$url = get_permalink( $page_id );
		} else {
			$url = $base_url;
		}
	} elseif ( 'blog' === $key && get_option( 'page_for_posts' ) ) {
		$page_id = (int) get_option( 'page_for_posts' );
		if ( function_exists( 'pll_get_post' ) ) {
			$translated_id = pll_get_post( $page_id, $locale );
			if ( $translated_id ) {
				$page_id = (int) $translated_id;
			} elseif ( $locale !== rayton_v2_current_locale() ) {
				return trailingslashit( $base_url ) . trailingslashit( $map[ $key ]['slugs'][0] ) . $fragment;
			}
		}
		$url = get_permalink( $page_id );
	} else {
		$page = null;
		foreach ( $map[ $key ]['slugs'] as $slug ) {
			$page = get_page_by_path( $slug );
			if ( $page ) {
				break;
			}
		}
		if ( ! $page ) {
			if ( ! empty( $map[ $key ]['required'] ) && ! empty( $map[ $key ]['slugs'][0] ) ) {
				return trailingslashit( $base_url ) . trailingslashit( $map[ $key ]['slugs'][0] ) . $fragment;
			}
			return '';
		}
		$page_id = (int) $page->ID;
		if ( function_exists( 'pll_get_post' ) ) {
			$translated_id = pll_get_post( $page_id, $locale );
			if ( $translated_id ) {
				$page_id = (int) $translated_id;
			} elseif ( $locale !== rayton_v2_current_locale() ) {
				return trailingslashit( $base_url ) . trailingslashit( $map[ $key ]['slugs'][0] ) . $fragment;
			}
		}
		$url = get_permalink( $page_id );
	}

	return $url ? $url . $fragment : '';
}

function rayton_v2_page_url( $key, $fragment = '' ) {
	return rayton_v2_page_url_for_locale( $key, rayton_v2_current_locale(), $fragment );
}

function rayton_v2_language_urls() {
	if ( ! function_exists( 'pll_the_languages' ) ) {
		return array();
	}
	$languages = pll_the_languages( array( 'raw' => 1 ) );
	if ( ! is_array( $languages ) ) {
		return array();
	}

	$languages = array_values(
		array_filter(
			$languages,
			function ( $language ) {
				return isset( $language['slug'] ) && in_array( $language['slug'], array( 'uk', 'en' ), true );
			}
		)
	);

	$current_key = rayton_v2_current_page_key();
	if ( $current_key && ! is_singular( 'post' ) && ! is_archive() && ! is_search() ) {
		foreach ( $languages as &$language ) {
			$language['url'] = rayton_v2_page_url_for_locale( $current_key, $language['slug'] );
		}
		unset( $language );
	}

	return $languages;
}

function rayton_v2_body_classes( $classes ) {
	$key = rayton_v2_current_page_key();
	if ( $key ) {
		$classes[] = 'page--' . sanitize_html_class( $key );
	}
	return $classes;
}
add_filter( 'body_class', 'rayton_v2_body_classes' );
