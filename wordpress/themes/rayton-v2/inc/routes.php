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
		),
		'en' => array(
			'solar' => 'Solar for business', 'storage' => 'Energy storage', 'projects' => 'Projects',
			'financing' => 'Financing', 'investors' => 'For investors', 'media' => 'Media',
			'blog' => 'Blog', 'about' => 'About us', 'contact' => 'Contact us', 'solutions' => 'Solutions',
			'business' => 'For business', 'company' => 'Company', 'contacts' => 'Contacts',
		),
		'ru' => array(
			'solar' => 'СЭС для бизнеса', 'storage' => 'Накопители энергии', 'projects' => 'Проекты',
			'financing' => 'Кредитование', 'investors' => 'Для инвесторов', 'media' => 'Медиа',
			'blog' => 'Блог', 'about' => 'О нас', 'contact' => 'Связаться', 'solutions' => 'Решения',
			'business' => 'Для бизнеса', 'company' => 'Компания', 'contacts' => 'Контакты',
		),
	);
	$locale = rayton_v2_current_locale();
	$locale = isset( $dictionary[ $locale ] ) ? $locale : 'en';
	return isset( $dictionary[ $locale ][ $key ] ) ? $dictionary[ $locale ][ $key ] : $key;
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
	if ( is_front_page() ) {
		return 'home';
	}
	if ( is_home() || is_archive() || is_search() || is_singular( 'post' ) ) {
		return 'blog';
	}

	$current_slug = get_post_field( 'post_name', get_queried_object_id() );
	foreach ( rayton_v2_page_map() as $key => $definition ) {
		if ( empty( $definition['part'] ) || empty( $definition['slugs'] ) ) {
			continue;
		}
		foreach ( $definition['slugs'] as $slug ) {
			if ( $current_slug === $slug ) {
				return $key;
			}
		}
	}

	return '';
}

function rayton_v2_page_url( $key, $fragment = '' ) {
	$map = rayton_v2_page_map();
	if ( ! isset( $map[ $key ] ) ) {
		return '';
	}
	if ( 'home' === $key ) {
		$url = home_url( '/' );
	} elseif ( 'blog' === $key && get_option( 'page_for_posts' ) ) {
		$url = get_permalink( (int) get_option( 'page_for_posts' ) );
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
				return home_url( '/' . trailingslashit( $map[ $key ]['slugs'][0] ) ) . $fragment;
			}
			return '';
		}
		$page_id = (int) $page->ID;
		if ( function_exists( 'pll_get_post' ) ) {
			$translated_id = pll_get_post( $page_id, rayton_v2_current_locale() );
			$page_id       = $translated_id ? (int) $translated_id : $page_id;
		}
		$url = get_permalink( $page_id );
	}

	return $url ? $url . $fragment : '';
}

function rayton_v2_language_urls() {
	if ( ! function_exists( 'pll_the_languages' ) ) {
		return array();
	}
	$languages = pll_the_languages( array( 'raw' => 1 ) );
	return is_array( $languages ) ? $languages : array();
}

function rayton_v2_body_classes( $classes ) {
	$key = rayton_v2_current_page_key();
	if ( 'uk' === rayton_v2_current_locale() && $key ) {
		$classes[] = 'page--' . sanitize_html_class( $key );
	}
	return $classes;
}
add_filter( 'body_class', 'rayton_v2_body_classes' );
