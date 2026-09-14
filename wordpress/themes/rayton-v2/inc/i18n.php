<?php
/** Server-side localization for packaged redesign pages. */

function rayton_v2_page_translations( $page_key ) {
	static $translations = null;
	if ( null === $translations ) {
		$file         = get_theme_file_path( 'assets/i18n/en.json' );
		$decoded      = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
		$translations = is_array( $decoded ) ? $decoded : array();
	}
	$common = isset( $translations['common'] ) && is_array( $translations['common'] ) ? $translations['common'] : array();
	$page   = isset( $translations['pages'][ $page_key ] ) && is_array( $translations['pages'][ $page_key ] ) ? $translations['pages'][ $page_key ] : array();
	return array_merge( $common, $page );
}

function rayton_v2_translate_page_markup( $markup, $page_key ) {
	if ( 'en' !== rayton_v2_current_locale() ) {
		return $markup;
	}
	$translations = rayton_v2_page_translations( $page_key );
	if ( ! $translations ) {
		return $markup;
	}

	$markup = preg_replace_callback(
		'/>([^<]+)</u',
		function ( $matches ) use ( $translations ) {
			$original = $matches[1];
			$key      = preg_replace( '/\s+/u', ' ', trim( html_entity_decode( $original, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ) );
			if ( '' === $key || ! isset( $translations[ $key ] ) ) {
				return $matches[0];
			}
			preg_match( '/^\s*/u', $original, $leading );
			preg_match( '/\s*$/u', $original, $trailing );
			return '>' . $leading[0] . esc_html( $translations[ $key ] ) . $trailing[0] . '<';
		},
		$markup
	);

	return preg_replace_callback(
		'/\b(aria-label|alt|placeholder|title)=([\'\"])([^\'\"]*)\2/u',
		function ( $matches ) use ( $translations ) {
			$key = html_entity_decode( $matches[3], ENT_QUOTES | ENT_HTML5, 'UTF-8' );
			return isset( $translations[ $key ] )
				? $matches[1] . '=' . $matches[2] . esc_attr( $translations[ $key ] ) . $matches[2]
				: $matches[0];
		},
		$markup
	);
}

function rayton_v2_render_packaged_page( $page_key ) {
	ob_start();
	get_template_part( 'template-parts/pages/' . $page_key );
	$markup = ob_get_clean();
	echo rayton_v2_translate_page_markup( $markup, $page_key ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
