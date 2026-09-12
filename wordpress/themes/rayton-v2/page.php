<?php get_header(); ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<?php if ( 'uk' !== rayton_v2_current_locale() ) : ?>
			<main class="site-main"><?php the_content(); ?></main>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content', 'page' ); ?>
		<?php endif; ?>
	<?php endwhile; ?>
<?php get_footer(); ?>
