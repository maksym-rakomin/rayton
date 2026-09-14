<?php
/** Locale-safe Page dispatcher. */

$page_key = rayton_v2_current_page_key();
$page_map = rayton_v2_page_map();

if ( ! $page_key || empty( $page_map[ $page_key ]['part'] ) || ! rayton_v2_use_packaged_page() ) {
	echo '<main class="site-main site-main--wordpress-content">';
	the_content();
	echo '</main>';
	return;
}

rayton_v2_render_packaged_page( $page_map[ $page_key ]['part'] );
