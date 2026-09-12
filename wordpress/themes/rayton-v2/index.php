<?php get_header(); ?>
<main class="site-main">
	<?php while ( have_posts() ) : the_post(); ?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
			<?php the_content(); ?>
		</article>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
