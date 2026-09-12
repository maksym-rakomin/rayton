<?php
/**
 * Public theme assets.
 *
 * @package Rayton_V2
 */

function rayton_v2_asset_url( $relative_path ) {
	return get_theme_file_uri( ltrim( $relative_path, '/' ) );
}

function rayton_v2_asset_version( $relative_path ) {
	$file = get_theme_file_path( ltrim( $relative_path, '/' ) );
	return is_file( $file ) ? (string) filemtime( $file ) : wp_get_theme()->get( 'Version' );
}

function rayton_v2_enqueue_assets() {
	$styles = array(
		'assets/css/fonts.css',
		'assets/css/base.css',
		'assets/css/layout.css',
		'assets/css/components.css',
		'assets/css/pages.css',
		'assets/css/motion.css',
		'assets/css/responsive.css',
		'assets/css/header.css',
	);
	$key    = function_exists( 'rayton_v2_current_page_key' ) ? rayton_v2_current_page_key() : '';
	$extra  = array(
		'ses'         => array( 'assets/css/business.css', 'assets/css/calculator.css' ),
		'uze'         => array( 'assets/css/business.css' ),
		'financing'   => array( 'assets/css/financing-figma.css' ),
		'projects'    => array( 'assets/css/projects.css' ),
		'youtube'     => array( 'assets/css/financing-figma.css', 'assets/css/media.css' ),
		'about'       => array( 'assets/css/company.css' ),
		'contacts'    => array( 'assets/css/company.css' ),
		'calculator'  => array( 'assets/css/calculator.css' ),
		'investments' => array( 'assets/css/investments.css', 'assets/css/quote.css' ),
	);
	if ( isset( $extra[ $key ] ) ) {
		$styles = array_merge( $styles, $extra[ $key ] );
	}

	$dependency = array();
	foreach ( $styles as $stylesheet ) {
		$handle = 'rayton-v2-' . basename( $stylesheet, '.css' );
		wp_enqueue_style( $handle, rayton_v2_asset_url( $stylesheet ), $dependency, rayton_v2_asset_version( $stylesheet ) );
		$dependency = array( $handle );
	}
	wp_enqueue_style( 'rayton-v2', rayton_v2_asset_url( 'style.css' ), $dependency, rayton_v2_asset_version( 'style.css' ) );

	wp_enqueue_script( 'rayton-v2-header', rayton_v2_asset_url( 'assets/js/header.js' ), array(), rayton_v2_asset_version( 'assets/js/header.js' ), true );
	wp_enqueue_script( 'rayton-v2-main', rayton_v2_asset_url( 'assets/js/main.js' ), array(), rayton_v2_asset_version( 'assets/js/main.js' ), true );

	if ( in_array( $key, array( 'ses', 'calculator' ), true ) ) {
		wp_enqueue_script( 'rayton-v2-solar-calc', rayton_v2_asset_url( 'assets/js/solar-calc.js' ), array(), rayton_v2_asset_version( 'assets/js/solar-calc.js' ), true );
		wp_enqueue_script( 'rayton-v2-calculator', rayton_v2_asset_url( 'assets/js/calculator.js' ), array( 'rayton-v2-solar-calc' ), rayton_v2_asset_version( 'assets/js/calculator.js' ), true );
		wp_localize_script(
			'rayton-v2-calculator',
			'raytonV2',
			array(
				'calculatorUrl' => rayton_v2_page_url( 'calculator' ),
				'locale'        => rayton_v2_current_locale(),
			)
		);
	}

	if ( in_array( $key, array( 'ses', 'uze' ), true ) ) {
		wp_enqueue_script( 'rayton-v2-business', rayton_v2_asset_url( 'assets/js/business.js' ), array(), rayton_v2_asset_version( 'assets/js/business.js' ), true );
	}
	if ( 'youtube' === $key ) {
		wp_enqueue_script( 'rayton-v2-media', rayton_v2_asset_url( 'assets/js/media.js' ), array(), rayton_v2_asset_version( 'assets/js/media.js' ), true );
	}
	if ( 'projects' === $key ) {
		wp_enqueue_script( 'rayton-v2-projects-data', rayton_v2_asset_url( 'assets/js/projects-data.js' ), array(), rayton_v2_asset_version( 'assets/js/projects-data.js' ), true );
		wp_enqueue_script( 'rayton-v2-projects', rayton_v2_asset_url( 'assets/js/projects.js' ), array( 'rayton-v2-projects-data' ), rayton_v2_asset_version( 'assets/js/projects.js' ), true );
		wp_localize_script(
			'rayton-v2-projects',
			'raytonV2',
			array(
				'projectsUrl' => rayton_v2_page_url( 'projects' ),
				'assetsUrl'   => untrailingslashit( rayton_v2_asset_url( 'assets' ) ),
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'rayton_v2_enqueue_assets' );
