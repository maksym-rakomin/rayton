<?php
/**
 * Site header.
 *
 * @package Rayton_V2
 */

$rayton_latest_posts = get_posts(
	array(
		'numberposts'      => 1,
		'post_status'      => 'publish',
		'suppress_filters' => false,
	)
);
$rayton_latest_post  = $rayton_latest_posts ? $rayton_latest_posts[0] : null;
$rayton_article_url  = $rayton_latest_post ? get_permalink( $rayton_latest_post ) : rayton_v2_page_url( 'blog' );
$rayton_article_name = $rayton_latest_post ? get_the_title( $rayton_latest_post ) : rayton_v2_ui( 'blog' );
$rayton_article_date = $rayton_latest_post ? get_the_date( get_option( 'date_format' ), $rayton_latest_post ) : '';
$rayton_article_iso  = $rayton_latest_post ? get_the_date( 'c', $rayton_latest_post ) : '';
$rayton_article_img  = $rayton_latest_post ? get_the_post_thumbnail_url( $rayton_latest_post, 'medium' ) : '';
if ( ! $rayton_article_img ) {
	$rayton_article_img = rayton_v2_asset_url( 'assets/img/media/article-8673.jpg' );
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php get_template_part( 'template-parts/sprite' ); ?>
<header class="site-header" id="site-header">
	<div class="rh-inner">
		<a class="rh-logo" href="<?php echo esc_url( rayton_v2_page_url( 'home' ) ); ?>" aria-label="Rayton"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28883-imgRaytonWhiteLogo.svg' ) ); ?>" alt="" width="155" height="39"></a>
		<nav class="rh-nav" id="header-navigation" aria-label="<?php echo esc_attr( rayton_v2_ui( 'navigation' ) ); ?>">
			<div class="rh-primary">
				<a class="rh-link rh-link--dot" href="<?php echo esc_url( rayton_v2_page_url( 'ses' ) ); ?>"><img class="rh-dot" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28883-imgEllipse9.svg' ) ); ?>" alt="" width="10" height="10"><span><?php echo esc_html( rayton_v2_ui( 'solar' ) ); ?></span></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link rh-link--dot" href="<?php echo esc_url( rayton_v2_page_url( 'uze' ) ); ?>"><img class="rh-dot" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28883-imgEllipse9.svg' ) ); ?>" alt="" width="10" height="10"><span><?php echo esc_html( rayton_v2_ui( 'storage' ) ); ?></span></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'projects' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'projects' ) ); ?></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'financing' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'financing' ) ); ?></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'investments' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'investors' ) ); ?></a>
			</div>
			<div class="rh-dropdown rh-media">
				<button class="rh-link rh-trigger" type="button" aria-expanded="false" aria-controls="header-media"><span><?php echo esc_html( rayton_v2_ui( 'media' ) ); ?></span><img class="rh-chevron" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28883-imgChevronDown.svg' ) ); ?>" alt="" width="11" height="11"></button>
				<div class="rh-panel rh-media-panel" id="header-media" hidden>
					<img class="rh-panel-pointer" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22689-imgPolygon2.svg' ) ); ?>" alt="" width="14" height="10">
					<a href="<?php echo esc_url( rayton_v2_page_url( 'blog' ) ); ?>"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28970-imgFileText.svg' ) ); ?>" alt="" width="24" height="24"><span><?php echo esc_html( rayton_v2_ui( 'blog' ) ); ?></span></a>
					<hr>
					<a href="<?php echo esc_url( rayton_v2_page_url( 'youtube' ) ); ?>"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28970-imgPlayCircle.svg' ) ); ?>" alt="" width="24" height="24"><span>Rayton TV</span></a>
				</div>
			</div>
			<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'about' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'about' ) ); ?></a>
			<span class="rh-nav-divider" aria-hidden="true"></span>
		</nav>
		<div class="rh-actions">
			<div class="rh-dropdown rh-notifications">
				<button class="rh-notification-button rh-trigger" type="button" aria-expanded="false" aria-controls="header-notifications" aria-label="<?php echo esc_attr( rayton_v2_ui( 'notifications' ) ); ?>">
					<img class="rh-bell rh-bell--new" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22555-imgBell.svg' ) ); ?>" alt="" width="24" height="24">
					<img class="rh-bell rh-bell--open" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22663-imgBellOpen.svg' ) ); ?>" alt="" width="24" height="24">
				</button>
				<div class="rh-panel rh-notifications-panel" id="header-notifications" hidden>
					<img class="rh-panel-pointer" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22689-imgPolygon2.svg' ) ); ?>" alt="" width="14" height="10">
					<div class="rh-panel-heading"><strong><?php echo esc_html( rayton_v2_ui( 'latest_media' ) ); ?></strong><button type="button" class="rh-close" aria-label="<?php echo esc_attr( rayton_v2_ui( 'close' ) ); ?>"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28945-imgX.svg' ) ); ?>" alt="" width="19" height="19"></button></div>
					<a class="rh-news-card" href="<?php echo esc_url( $rayton_article_url ); ?>">
						<img class="rh-news-card__image" src="<?php echo esc_url( $rayton_article_img ); ?>" alt="" width="135" height="90">
						<span class="rh-news-card__body"><span class="rh-news-card__type"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28970-imgFileText.svg' ) ); ?>" alt="" width="24" height="24"><span><?php echo esc_html( rayton_v2_ui( 'blog' ) ); ?></span></span><span class="rh-news-card__title"><?php echo esc_html( $rayton_article_name ); ?></span><?php if ( $rayton_article_date ) : ?><time class="rh-news-card__date" datetime="<?php echo esc_attr( $rayton_article_iso ); ?>"><?php echo esc_html( $rayton_article_date ); ?></time><?php endif; ?></span>
						<span class="rh-news-card__arrow" aria-hidden="true">›</span>
					</a>
					<hr>
					<a class="rh-news-card" href="<?php echo esc_url( rayton_v2_page_url( 'youtube' ) ); ?>">
						<span class="rh-news-card__visual"><img class="rh-news-card__image" src="https://i.ytimg.com/vi/zd-Ys6yoXh0/hq720.jpg" alt="" width="135" height="90"><span class="rh-news-card__play" aria-hidden="true"><img class="rh-news-card__play-circle" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22718-imgVideoPlayCircle.svg' ) ); ?>" alt=""><img class="rh-news-card__play-triangle" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22719-imgVideoPlayTriangle.svg' ) ); ?>" alt=""></span></span>
						<span class="rh-news-card__body"><span class="rh-news-card__type"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28970-imgPlayCircle.svg' ) ); ?>" alt="" width="24" height="24"><span>Rayton TV</span></span><span class="rh-news-card__title"><?php echo esc_html( rayton_v2_ui( 'latest_video_title' ) ); ?></span><span class="rh-news-card__date">Rayton Sun · 1:05</span></span>
						<span class="rh-news-card__arrow" aria-hidden="true">›</span>
					</a>
					<hr>
					<a class="rh-all-media" href="<?php echo esc_url( rayton_v2_page_url( 'blog' ) ); ?>"><span><?php echo esc_html( rayton_v2_ui( 'view_media' ) ); ?></span><span aria-hidden="true">›</span></a>
				</div>
			</div>
			<?php $rayton_languages = rayton_v2_language_urls(); ?>
			<?php if ( $rayton_languages ) : ?>
				<div class="rh-languages" role="group" aria-label="<?php echo esc_attr( rayton_v2_ui( 'language' ) ); ?>">
					<?php foreach ( $rayton_languages as $rayton_language ) : ?>
						<a href="<?php echo esc_url( $rayton_language['url'] ); ?>" lang="<?php echo esc_attr( $rayton_language['slug'] ); ?>"<?php echo ! empty( $rayton_language['current_lang'] ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( strtoupper( 'uk' === $rayton_language['slug'] ? 'ua' : $rayton_language['slug'] ) ); ?></a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<div class="rh-dropdown rh-contact">
				<button class="rh-contact-button rh-trigger" type="button" aria-expanded="false" aria-controls="header-contact"><span><?php echo esc_html( rayton_v2_ui( 'contact' ) ); ?></span><span class="rh-arrow"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28883-imgDownArrow34787511.svg' ) ); ?>" alt="" width="13" height="13"></span></button>
				<div class="rh-panel rh-contact-panel" id="header-contact" hidden>
					<img class="rh-panel-pointer" src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/896-22689-imgPolygon2.svg' ) ); ?>" alt="" width="14" height="10">
					<div class="rh-panel-heading"><strong><?php echo esc_html( rayton_v2_ui( 'contact_title' ) ); ?></strong><button type="button" class="rh-close" aria-label="<?php echo esc_attr( rayton_v2_ui( 'close' ) ); ?>"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28945-imgX.svg' ) ); ?>" alt="" width="19" height="19"></button></div>
					<p><?php echo esc_html( rayton_v2_ui( 'contact_description' ) ); ?></p>
					<hr>
					<a class="rh-contact-link" href="tel:+380732422343"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28945-imgPhone.svg' ) ); ?>" alt="" width="24" height="24"><span>+38 (073) 242-23-43</span></a>
					<a class="rh-calculate" href="<?php echo esc_url( rayton_v2_page_url( 'calculator' ) ); ?>"><span><?php echo esc_html( rayton_v2_ui( 'calculate' ) ); ?></span><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28883-imgDownArrow34787511.svg' ) ); ?>" alt="" width="13" height="13"></a>
					<hr>
					<div class="rh-socials" aria-label="<?php echo esc_attr( rayton_v2_ui( 'socials' ) ); ?>">
						<a href="https://www.facebook.com/raytonFEE" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg aria-hidden="true"><use href="#i-social-1"></use></svg></a>
						<a href="https://www.instagram.com/rayton_sun/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg aria-hidden="true"><use href="#i-social-2"></use></svg></a>
						<a href="https://www.linkedin.com/company/73173918/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg aria-hidden="true"><use href="#i-social-3"></use></svg></a>
						<a href="https://www.youtube.com/@RaytonSun" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg aria-hidden="true"><use href="#i-social-4"></use></svg></a>
					</div>
					<a class="rh-contact-link" href="mailto:sales@rayton.com.ua"><img src="<?php echo esc_url( rayton_v2_asset_url( 'assets/icons/header/871-28945-imgMail.svg' ) ); ?>" alt="" width="24" height="24"><span><?php echo esc_html( rayton_v2_ui( 'write' ) ); ?></span></a>
					<a class="rh-all-media" href="<?php echo esc_url( rayton_v2_page_url( 'contacts' ) ); ?>"><span><?php echo esc_html( rayton_v2_ui( 'contacts' ) ); ?></span><span aria-hidden="true">›</span></a>
				</div>
			</div>
			<button class="rh-burger" type="button" aria-label="<?php echo esc_attr( rayton_v2_ui( 'menu' ) ); ?>" aria-expanded="false" aria-controls="header-navigation"><span></span><span></span><span></span></button>
		</div>
	</div>
</header>
