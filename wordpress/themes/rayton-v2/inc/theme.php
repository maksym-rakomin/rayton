<?php
/**
 * Theme supports and navigation locations.
 *
 * @package Rayton_V2
 */

function rayton_v2_setup() {
	load_theme_textdomain( 'rayton-v2', get_theme_file_path( 'languages' ) );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'rayton-v2' ),
			'footer'  => __( 'Footer menu', 'rayton-v2' ),
		)
	);
}
add_action( 'after_setup_theme', 'rayton_v2_setup' );
