<?php get_header(); ?>
<main class="site-main single-post">
	<?php while ( have_posts() ) : the_post(); ?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<header class="entry-header">
				<p class="entry-meta"><time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></p>
				<h1><?php the_title(); ?></h1>
				<?php the_category( ', ' ); ?>
			</header>
			<?php if ( has_post_thumbnail() ) : ?><figure class="entry-thumbnail"><?php the_post_thumbnail( 'full' ); ?></figure><?php endif; ?>
			<div class="entry-content"><?php the_content(); ?></div>
		</article>
		<?php the_post_navigation(); ?>
		<?php // Comments are intentionally omitted until moderation and anti-spam requirements are known. ?>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
