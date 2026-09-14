<?php
/** Theme-owned page fallback for routes that are not backed by a WP Page yet. */
get_header();
get_template_part( 'template-parts/pages/' . rayton_v2_current_page_key() );
get_footer();
