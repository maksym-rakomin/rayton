<?php
/**
 * Blog redesign. The shell mirrors blog.html; cards come from WordPress.
 *
 * @package Rayton_V2
 */

$rayton_blog_english = 'en' === rayton_v2_current_locale();
$rayton_blog_copy    = $rayton_blog_english
	? array(
		'home' => 'Home', 'media' => 'Media', 'blog' => 'Blog', 'our_blog' => 'Our blog',
		'case' => 'Real case', 'title' => 'Energy independence for “Kyivhuma”',
		'lead' => 'How Rayton keeps manufacturing running without interruption through on-site solar generation, energy storage and staged energy-system development.',
		'power' => 'Solar capacity', 'storage' => 'Storage capacity', 'done' => 'Completed',
		'story' => 'View the full story', 'all' => 'All', 'solar' => 'Solar for business', 'uze' => 'Energy storage',
		'hybrid' => 'Solar + storage', 'finance' => 'Financing', 'news' => 'News', 'demian' => 'Demian Krutchenko’s blog',
		'olha' => 'Olha Lesko’s blog', 'more' => 'Read more', 'empty' => 'No articles have been published yet.',
		'results' => 'articles', 'of' => 'of', 'previous' => 'Previous', 'next' => 'Next',
	)
	: array(
		'home' => 'Головна', 'media' => 'Медіа', 'blog' => 'Блог', 'our_blog' => 'Наш блог',
		'case' => 'Реальний кейс', 'title' => 'Енергонезалежність для «Київгума»',
		'lead' => 'Як Rayton допомагає виробництву працювати без перебоїв: власна сонячна генерація, накопичення енергії та поетапний розвиток енергосистеми підприємства.',
		'power' => 'Потужність СЕС', 'storage' => 'Ємність УЗЕ', 'done' => 'Реалізовано',
		'story' => 'Дивитися повну історію', 'all' => 'Усі', 'solar' => 'СЕС для бізнесу', 'uze' => 'УЗЕ',
		'hybrid' => 'СЕС + УЗЕ', 'finance' => 'Фінансування', 'news' => 'Новини', 'demian' => 'Блог Дем’яна Крутченко',
		'olha' => 'Блог Ольги Лесько', 'more' => 'Детальніше', 'empty' => 'Матеріалів поки немає.',
		'results' => 'матеріалів', 'of' => 'із', 'previous' => 'Назад', 'next' => 'Далі',
	);

$rayton_blog_category_id = rayton_v2_blog_category_id();
$rayton_blog_page        = rayton_v2_blog_page_number();
$rayton_blog_page_size   = 6;
$rayton_blog_topics      = array();
$rayton_active_topic     = '';

if ( $rayton_blog_category_id ) {
	$rayton_blog_topics = get_categories(
		array(
			'parent'       => $rayton_blog_category_id,
			'hide_empty'   => true,
			'orderby'      => 'name',
			'order'        => 'ASC',
			'hierarchical' => false,
		)
	);
	$rayton_requested_topic = isset( $_GET['blog_topic'] ) ? sanitize_title( wp_unslash( $_GET['blog_topic'] ) ) : '';
	foreach ( $rayton_blog_topics as $rayton_blog_topic ) {
		if ( $rayton_requested_topic && $rayton_requested_topic === $rayton_blog_topic->slug ) {
			$rayton_active_topic = $rayton_requested_topic;
			break;
		}
	}
}

$rayton_blog_query_args = array(
	'post_type'           => 'post',
	'post_status'         => 'publish',
	'posts_per_page'      => $rayton_blog_page_size,
	'paged'               => $rayton_blog_page,
	'ignore_sticky_posts' => true,
	'suppress_filters'    => false,
);
if ( $rayton_blog_category_id ) {
	$rayton_blog_query_args['cat'] = $rayton_blog_category_id;
	if ( $rayton_active_topic ) {
		foreach ( $rayton_blog_topics as $rayton_blog_topic ) {
			if ( $rayton_active_topic === $rayton_blog_topic->slug ) {
				$rayton_blog_query_args['cat'] = (int) $rayton_blog_topic->term_id;
				break;
			}
		}
	}
} else {
	/* Never fill an untranslated blog with legacy portfolio posts. */
	$rayton_blog_query_args['post__in'] = array( 0 );
}
$rayton_blog_query = new WP_Query( $rayton_blog_query_args );

$rayton_case_posts = get_posts(
	array(
		'name'             => 'kejs-rayton-yak-my-zabezpechyly-energetychnu-avtonomiyu-dlya-tov-kyyivguma',
		'post_type'        => 'post',
		'post_status'      => 'publish',
		'numberposts'      => 1,
		'suppress_filters' => false,
	)
);
$rayton_case_url = rayton_v2_page_url( 'blog' );
if ( $rayton_case_posts ) {
	$rayton_case_id = (int) $rayton_case_posts[0]->ID;
	if ( function_exists( 'pll_get_post' ) ) {
		$rayton_translated_case_id = (int) pll_get_post( $rayton_case_id, rayton_v2_current_locale() );
		$rayton_case_id = $rayton_translated_case_id ? $rayton_translated_case_id : ( 'uk' === rayton_v2_current_locale() ? $rayton_case_id : 0 );
	}
	if ( $rayton_case_id ) {
		$rayton_case_url = get_permalink( $rayton_case_id );
	}
}
?>
<main>
	<div class="media-blog-hero">
		<div class="container">
			<ol class="breadcrumbs">
				<li><a href="<?php echo esc_url( rayton_v2_page_url( 'home' ) ); ?>"><?php echo esc_html( $rayton_blog_copy['home'] ); ?></a></li>
				<li><span><?php echo esc_html( $rayton_blog_copy['media'] ); ?></span></li>
				<li><span aria-current="page"><?php echo esc_html( $rayton_blog_copy['blog'] ); ?></span></li>
			</ol>
		</div>
		<section class="partner-project">
			<div class="container partner-project__grid">
				<div class="partner-project__media">
					<img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media/article-8270.jpg' ) ); ?>" alt="<?php echo esc_attr( $rayton_blog_copy['title'] ); ?>" width="896" height="1200" fetchpriority="high">
					<a class="showcase__play" href="https://www.youtube.com/watch?v=OZbjrOOwNBc" data-media-video="OZbjrOOwNBc" aria-label="<?php echo esc_attr( $rayton_blog_copy['story'] ); ?>"><svg><use href="#i-play"></use></svg></a>
				</div>
				<div class="partner-project__content">
					<p class="fin-kicker"><?php echo esc_html( $rayton_blog_copy['case'] ); ?></p>
					<h1 class="fin-title"><?php echo esc_html( $rayton_blog_copy['title'] ); ?></h1>
					<p><?php echo esc_html( $rayton_blog_copy['lead'] ); ?></p>
					<div class="partner-project__stats">
						<div class="partner-project__stat"><b>760 кВт</b><span><?php echo esc_html( $rayton_blog_copy['power'] ); ?></span></div>
						<div class="partner-project__stat"><b>232 кВт·год</b><span><?php echo esc_html( $rayton_blog_copy['storage'] ); ?></span></div>
						<div class="partner-project__stat"><b>2025</b><span><?php echo esc_html( $rayton_blog_copy['done'] ); ?></span></div>
					</div>
					<a class="btn btn--primary" href="<?php echo esc_url( $rayton_case_url ); ?>"><?php echo esc_html( $rayton_blog_copy['story'] ); ?> <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span></a>
				</div>
			</div>
		</section>
	</div>

	<section class="media-blog-content">
		<div class="container">
			<p class="eyebrow"><?php echo esc_html( $rayton_blog_copy['our_blog'] ); ?></p>
			<?php if ( $rayton_blog_topics ) : ?>
				<nav class="tabs tabs--wrap media-filters" aria-label="<?php echo esc_attr( $rayton_blog_copy['blog'] ); ?>">
					<a class="tabs__btn<?php echo $rayton_active_topic ? '' : ' is-active'; ?>" href="<?php echo esc_url( rayton_v2_page_url( 'blog' ) ); ?>"<?php echo $rayton_active_topic ? '' : ' aria-current="page"'; ?>><?php echo esc_html( $rayton_blog_copy['all'] ); ?></a>
					<?php foreach ( $rayton_blog_topics as $rayton_blog_topic ) : ?>
						<a class="tabs__btn<?php echo $rayton_active_topic === $rayton_blog_topic->slug ? ' is-active' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'blog_topic', $rayton_blog_topic->slug, rayton_v2_page_url( 'blog' ) ) ); ?>"<?php echo $rayton_active_topic === $rayton_blog_topic->slug ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $rayton_blog_topic->name ); ?></a>
					<?php endforeach; ?>
				</nav>
			<?php endif; ?>

			<?php if ( $rayton_blog_query->have_posts() ) : ?>
				<ul class="grid grid--3 media-blog-grid" id="media-articles">
					<?php while ( $rayton_blog_query->have_posts() ) : $rayton_blog_query->the_post(); ?>
						<?php $rayton_categories = get_the_category(); ?>
						<li>
							<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card media-post' ); ?>>
								<a class="post-card__media" href="<?php the_permalink(); ?>">
									<?php if ( has_post_thumbnail() ) : the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); else : ?>
										<img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/img/media/article-8673.jpg' ) ); ?>" alt="" width="411" height="237" loading="lazy">
									<?php endif; ?>
									<?php if ( $rayton_categories ) : ?><span class="tag tag--solid tag--yellow"><?php echo esc_html( $rayton_categories[0]->name ); ?></span><?php endif; ?>
								</a>
								<div class="post-card__body">
									<h2 class="post-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
									<div class="post-card__text"><?php the_excerpt(); ?></div>
									<div class="media-post__meta"><div><span>Rayton</span><time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></div></div>
									<a class="btn btn--outline media-post__link" href="<?php the_permalink(); ?>"><?php echo esc_html( $rayton_blog_copy['more'] ); ?> <span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span></a>
								</div>
							</article>
						</li>
					<?php endwhile; ?>
				</ul>
				<?php
					$rayton_total_posts     = (int) $rayton_blog_query->found_posts;
					$rayton_result_start    = ( ( $rayton_blog_page - 1 ) * $rayton_blog_page_size ) + 1;
					$rayton_result_end      = min( $rayton_blog_page * $rayton_blog_page_size, $rayton_total_posts );
					$rayton_pagination_base = trailingslashit( rayton_v2_page_url( 'blog' ) ) . 'page/%#%/';
					if ( $rayton_active_topic ) {
						$rayton_pagination_base = add_query_arg( 'blog_topic', $rayton_active_topic, $rayton_pagination_base );
					}
					$rayton_page_links = paginate_links(
						array(
							'base'      => $rayton_pagination_base,
							'format'    => '',
							'current'   => $rayton_blog_page,
							'total'     => max( 1, (int) $rayton_blog_query->max_num_pages ),
							'type'      => 'array',
							'prev_text' => $rayton_blog_copy['previous'],
							'next_text' => $rayton_blog_copy['next'],
						)
					);
				?>
				<?php if ( $rayton_page_links ) : ?>
					<nav class="media-pagination" aria-label="<?php echo esc_attr( $rayton_blog_copy['blog'] ); ?>">
						<?php foreach ( $rayton_page_links as $rayton_page_link ) : ?><?php echo wp_kses_post( $rayton_page_link ); ?><?php endforeach; ?>
					</nav>
				<?php endif; ?>
				<p class="media-results" aria-live="polite"><?php echo esc_html( $rayton_result_start . '–' . $rayton_result_end . ' ' . $rayton_blog_copy['of'] . ' ' . $rayton_total_posts . ' ' . $rayton_blog_copy['results'] ); ?></p>
			<?php else : ?>
				<p class="media-empty"><?php echo esc_html( $rayton_blog_copy['empty'] ); ?></p>
			<?php endif; ?>
			<?php wp_reset_postdata(); ?>
		</div>
	</section>
</main>
