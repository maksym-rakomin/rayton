<?php get_header(); ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<?php if ( rayton_v2_use_packaged_page() ) : ?>
			<?php rayton_v2_render_packaged_page( 'home' ); ?>
		<?php else : ?>
			<main class="site-main site-main--wordpress-content">
				<?php the_content(); ?>
			</main>
		<?php endif; ?>
	<?php endwhile; ?>
<?php get_footer(); ?>
