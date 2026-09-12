<?php
/**
 * Existing Caldera Forms integration.
 *
 * @package Rayton_V2
 */

function rayton_v2_caldera_form_ids() {
	return array(
		'uk' => 'CF62f6024bbb1dd',
		'en' => 'CF630c5867c8dcd',
		'ru' => 'CF65901a68cf806',
	);
}

function rayton_v2_render_enquiry_form( $context = 'contact' ) {
	$ids       = rayton_v2_caldera_form_ids();
	$locale    = rayton_v2_current_locale();
	$form_id   = isset( $ids[ $locale ] ) ? $ids[ $locale ] : '';
	$available = '' !== $form_id && shortcode_exists( 'caldera_form' );
	$form_html = $available ? do_shortcode( '[caldera_form id="' . esc_attr( $form_id ) . '"]' ) : '';

	get_template_part(
		'template-parts/forms/enquiry',
		null,
		array(
			'available' => $available,
			'context'   => $context,
			'form_id'   => $form_id,
			'form_html' => $form_html,
		)
	);
}
