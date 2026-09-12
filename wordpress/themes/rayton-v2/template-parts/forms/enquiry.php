<?php
/**
 * Shared Caldera enquiry form shell.
 *
 * Caldera owns fields, validation, anti-spam, transport, and status messages.
 *
 * @package Rayton_V2
 */

$available = ! empty( $args['available'] );
$context   = isset( $args['context'] ) ? sanitize_html_class( $args['context'] ) : 'contact';
$form_id   = isset( $args['form_id'] ) ? $args['form_id'] : '';
$form_html = isset( $args['form_html'] ) ? $args['form_html'] : '';
$messages  = array(
	'uk' => 'Форма тимчасово недоступна. Зателефонуйте або напишіть нам.',
	'en' => 'The form is temporarily unavailable. Please call or email us.',
	'ru' => 'Форма временно недоступна. Позвоните или напишите нам.',
);
$locale    = rayton_v2_current_locale();
$message   = isset( $messages[ $locale ] ) ? $messages[ $locale ] : $messages['en'];
?>
<div class="rayton-enquiry rayton-enquiry--<?php echo esc_attr( $context ); ?>">
	<?php if ( $available ) : ?>
		<?php echo $form_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted plugin shortcode output. ?>
	<?php else : ?>
		<div class="rayton-enquiry__fallback" role="status" data-reason="form_unavailable">
			<p><?php echo esc_html( $message ); ?></p>
			<p><a href="tel:+380732422343">+38 (073) 242-23-43</a> · <a href="mailto:sales@rayton.com.ua">sales@rayton.com.ua</a></p>
		</div>
	<?php endif; ?>
</div>
