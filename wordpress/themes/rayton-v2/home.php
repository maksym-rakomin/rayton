<?php
/** Redesigned, data-driven posts index. */
$rayton_is_english = 'en' === rayton_v2_current_locale();
$rayton_copy       = $rayton_is_english
	? array(
		'home' => 'Home', 'media' => 'Media', 'blog' => 'Blog', 'eyebrow' => 'Rayton Media',
		'title' => 'Energy insights for business',
		'lead' => 'Practical articles, market analysis and real-world experience with solar power and energy storage.',
		'more' => 'Read more', 'empty' => 'No articles have been published yet.',
	)
	: array(
		'home' => 'Головна', 'media' => 'Медіа', 'blog' => 'Блог', 'eyebrow' => 'Rayton Media',
		'title' => 'Енергетика для бізнесу без зайвої складності',
		'lead' => 'Практичні матеріали, аналітика ринку та реальний досвід із сонячними електростанціями й системами накопичення енергії.',
		'more' => 'Детальніше', 'empty' => 'Матеріалів поки немає.',
	);
get_header();
?>
<main class="rayton-media-blog">
	<section class="media-blog-hero">
		<div class="container">
			<ol class="breadcrumbs">
				<li><a href="<?php echo esc_url( rayton_v2_page_url( 'home' ) ); ?>"><?php echo esc_html( $rayton_copy['home'] ); ?></a></li>
				<li><span><?php echo esc_html( $rayton_copy['media'] ); ?></span></li>
				<li><span aria-current="page"><?php echo esc_html( $rayton_copy['blog'] ); ?></span></li>
			</ol>
			<div class="media-blog-intro">
				<p class="eyebrow"><?php echo esc_html( $rayton_copy['eyebrow'] ); ?></p>
				<h1><?php echo esc_html( $rayton_copy['title'] ); ?></h1>
				<p><?php echo esc_html( $rayton_copy['lead'] ); ?></p>
			</div>
		</div>
	</section>
	<section class="media-blog-content">
		<div class="container">
			<p class="eyebrow"><?php echo esc_html( $rayton_copy['blog'] ); ?></p>
			<?php if ( have_posts() ) : ?>
				<ul class="grid grid--3 media-blog-grid" id="media-articles">
					<?php while ( have_posts() ) : the_post(); ?>
						<li>
							<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card media-post' ); ?>>
								<a class="post-card__media" href="<?php the_permalink(); ?>">
									<?php if ( has_post_thumbnail() ) : ?>
										<?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
									<?php else : ?>
										<img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media/article-8673.jpg' ) ); ?>" alt="" width="411" height="237" loading="lazy">
									<?php endif; ?>
									<?php $rayton_categories = get_the_category(); ?>
									<?php if ( $rayton_categories ) : ?><span class="tag tag--solid tag--yellow"><?php echo esc_html( $rayton_categories[0]->name ); ?></span><?php endif; ?>
								</a>
								<div class="post-card__body">
									<h2 class="post-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
									<div class="post-card__text"><?php the_excerpt(); ?></div>
									<div class="media-post__meta"><div><span>Rayton</span><time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></div></div>
									<a class="btn btn--outline media-post__link" href="<?php the_permalink(); ?>"><?php echo esc_html( $rayton_copy['more'] ); ?> <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span></a>
								</div>
							</article>
						</li>
					<?php endwhile; ?>
				</ul>
				<div class="media-pagination"><?php the_posts_pagination(); ?></div>
			<?php else : ?>
				<p class="media-empty"><?php echo esc_html( $rayton_copy['empty'] ); ?></p>
				<?php get_template_part( 'template-parts/content-none' ); ?>
			<?php endif; ?>
		</div>
	</section>
</main>
<?php get_footer(); ?>
