<?php get_header(); ?>
<main class="site-main">
	<h1><?php esc_html_e( 'Page not found', 'rayton-v2' ); ?></h1>
	<p><?php esc_html_e( 'The requested page could not be found.', 'rayton-v2' ); ?></p>
	<p><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', 'rayton-v2' ); ?></a></p>
</main>
<?php get_footer(); ?>
