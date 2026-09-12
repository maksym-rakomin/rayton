<?php
/** Locale-safe Page dispatcher. */

$page_key = rayton_v2_current_page_key();
$page_map = rayton_v2_page_map();

if ( rayton_v2_current_locale() !== 'uk' || ! $page_key || empty( $page_map[ $page_key ]['part'] ) ) {
	echo '<main class="site-main">';
	the_content();
	echo '</main>';
	return;
}

get_template_part( 'template-parts/pages/' . $page_map[ $page_key ]['part'] );
