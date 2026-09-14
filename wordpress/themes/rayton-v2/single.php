<?php
/**
 * WordPress/Polylang can classify legacy translated Pages as `single`.
 * Preserve the redesign even if another template filter leaves that legacy
 * classification in place.
 */
$rayton_page_key = rayton_v2_packaged_page_key();
$rayton_page_map = rayton_v2_page_map();
if ( $rayton_page_key && ! empty( $rayton_page_map[ $rayton_page_key ]['part'] ) ) {
	get_header();
	rayton_v2_render_packaged_page( $rayton_page_map[ $rayton_page_key ]['part'] );
	get_footer();
	return;
}

get_header();
?>
<main class="single-post">
	<?php while ( have_posts() ) : the_post(); ?>
		<?php
		$rayton_english    = 'en' === rayton_v2_current_locale();
		$rayton_categories = get_the_category();
		$rayton_category   = $rayton_categories ? $rayton_categories[0]->name : ( $rayton_english ? 'Article' : 'Стаття' );
		$rayton_excerpt    = trim( (string) get_the_excerpt() );
		$rayton_words      = preg_match_all( '/[\p{L}\p{N}]+/u', wp_strip_all_tags( get_the_content() ), $rayton_word_matches );
		$rayton_minutes    = max( 1, (int) ceil( $rayton_words / 180 ) );
		$rayton_author_id  = (int) get_the_author_meta( 'ID' );
		$rayton_author     = get_the_author();
		$rayton_bio        = trim( (string) get_the_author_meta( 'description', $rayton_author_id ) );
		$rayton_initials   = function_exists( 'mb_substr' ) ? mb_substr( $rayton_author, 0, 2 ) : substr( $rayton_author, 0, 2 );
		$rayton_url        = get_permalink();
		$rayton_copy       = $rayton_english
			? array(
				'home' => 'Home', 'blog' => 'Blog', 'back' => 'Back to the blog', 'minutes' => 'min read',
				'cta_title' => 'Want to test this for your facility?',
				'cta_text' => 'Send us a request and Rayton will assess which solution fits your business: solar, energy storage, or an integrated system.',
				'consultation' => 'Get a consultation', 'author_articles' => 'All author articles',
				'related' => 'Related articles', 'more' => 'More articles', 'read_more' => 'Read article', 'all' => 'All articles',
			)
			: array(
				'home' => 'Головна', 'blog' => 'Блог', 'back' => 'Повернутись до блогу', 'minutes' => 'хв читання',
				'cta_title' => 'Хочете перевірити це на своєму об’єкті?',
				'cta_text' => 'Залиште заявку — Rayton допоможе оцінити, яке рішення підійде вашому бізнесу: СЕС, УЗЕ або комплексна система.',
				'consultation' => 'Отримати консультацію', 'author_articles' => 'Всі статті автора',
				'related' => 'Пов’язані матеріали', 'more' => 'Ще матеріали', 'read_more' => 'Читати матеріал', 'all' => 'Усі матеріали',
			);
		$rayton_related_args = array(
				'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 3,
				'post__not_in' => array( get_the_ID() ), 'ignore_sticky_posts' => true, 'suppress_filters' => false,
			);
		$rayton_related_category_id = rayton_v2_blog_category_id();
		if ( $rayton_related_category_id ) {
			$rayton_related_args['cat'] = $rayton_related_category_id;
		} else {
			$rayton_related_args['post__in'] = array( 0 );
		}
		$rayton_related = new WP_Query( $rayton_related_args );
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'rayton-article' ); ?>>
			<section class="hero hero--sub hero--plain">
				<div class="container hero__inner">
					<ol class="breadcrumbs">
						<li><a href="<?php echo esc_url( rayton_v2_page_url( 'home' ) ); ?>"><?php echo esc_html( $rayton_copy['home'] ); ?></a></li>
						<li><a href="<?php echo esc_url( rayton_v2_page_url( 'blog' ) ); ?>"><?php echo esc_html( $rayton_copy['blog'] ); ?></a></li>
						<li><span aria-current="page"><?php the_title(); ?></span></li>
					</ol>
					<div class="hero__content">
						<p class="hero__eyebrow"><span class="dot"></span><?php echo esc_html( $rayton_category ); ?></p>
						<h1 class="hero__title"><?php the_title(); ?></h1>
						<?php if ( $rayton_excerpt ) : ?><p class="hero__lead"><?php echo esc_html( $rayton_excerpt ); ?></p><?php endif; ?>
						<div class="hero__meta">
							<span><?php echo esc_html( $rayton_author ); ?></span>
							<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
							<span><?php echo esc_html( $rayton_minutes . ' ' . $rayton_copy['minutes'] ); ?></span>
						</div>
						<div class="hero__actions"><a class="btn btn--outline" href="<?php echo esc_url( rayton_v2_page_url( 'blog' ) ); ?>"><?php echo esc_html( $rayton_copy['back'] ); ?><span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span></a></div>
					</div>
				</div>
			</section>

			<section class="section">
				<div class="container">
					<div class="article">
						<div class="article__main">
							<figure class="article__banner">
								<?php if ( has_post_thumbnail() ) : the_post_thumbnail( 'full' ); else : ?><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media/article-8673.jpg' ) ); ?>" alt="" width="826" height="460"><?php endif; ?>
							</figure>
							<nav class="share" aria-label="<?php echo esc_attr( $rayton_english ? 'Share' : 'Поділитися' ); ?>">
								<a class="share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo rawurlencode( $rayton_url ); ?>" target="_blank" rel="noopener noreferrer">LinkedIn</a>
								<a class="share__btn" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo rawurlencode( $rayton_url ); ?>" target="_blank" rel="noopener noreferrer">Facebook</a>
								<a class="share__btn" href="https://t.me/share/url?url=<?php echo rawurlencode( $rayton_url ); ?>&amp;text=<?php echo rawurlencode( get_the_title() ); ?>" target="_blank" rel="noopener noreferrer">Telegram</a>
							</nav>
							<div class="prose entry-content"><?php the_content(); ?></div>
							<div class="article__cta">
								<p class="article__cta-title"><?php echo esc_html( $rayton_copy['cta_title'] ); ?></p>
								<p class="article__cta-text"><?php echo esc_html( $rayton_copy['cta_text'] ); ?></p>
								<a class="btn btn--primary" href="<?php echo esc_url( rayton_v2_page_url( 'contacts' ) ); ?>"><?php echo esc_html( $rayton_copy['consultation'] ); ?><span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span></a>
							</div>
							<div class="rayton-post-navigation"><?php the_post_navigation(); ?></div>
						</div>

						<aside class="article__aside">
							<div class="person-card">
								<span class="person-card__avatar"><?php echo esc_html( $rayton_initials ); ?></span>
								<div class="person-card__body">
									<h2 class="person-card__name"><?php echo esc_html( $rayton_author ); ?></h2>
									<?php if ( $rayton_bio ) : ?><p class="person-card__text"><?php echo esc_html( $rayton_bio ); ?></p><?php endif; ?>
									<p class="person-card__links"><a class="link-arrow" href="<?php echo esc_url( get_author_posts_url( $rayton_author_id ) ); ?>"><?php echo esc_html( $rayton_copy['author_articles'] ); ?> <svg><use href="#i-arrow-right"></use></svg></a></p>
								</div>
							</div>
							<?php if ( $rayton_related->have_posts() ) : ?>
								<div class="related"><p class="related__title"><?php echo esc_html( $rayton_copy['related'] ); ?></p><div class="related__links">
									<?php while ( $rayton_related->have_posts() ) : $rayton_related->the_post(); ?><a class="link-arrow" href="<?php the_permalink(); ?>"><?php the_title(); ?> <svg><use href="#i-arrow-right"></use></svg></a><?php endwhile; ?>
								</div></div>
							<?php endif; wp_reset_postdata(); ?>
						</aside>
					</div>
				</div>
			</section>
		</article>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
