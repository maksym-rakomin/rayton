<?php
/** Theme-owned page fallback for routes that are not backed by a WP Page yet. */
get_header();
rayton_v2_render_packaged_page( rayton_v2_current_page_key() );
get_footer();
