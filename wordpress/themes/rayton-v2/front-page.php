<?php get_header(); ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<?php if ( 'uk' === rayton_v2_current_locale() ) : ?>
			<?php get_template_part( 'template-parts/pages/home' ); ?>
		<?php else : ?>
			<main class="site-main"><?php the_content(); ?></main>
		<?php endif; ?>
	<?php endwhile; ?>
<?php get_footer(); ?>
