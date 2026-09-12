<?php /** Site header. @package Rayton_V2 */ ?>
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
		<nav class="rh-nav" id="header-navigation" aria-label="<?php echo esc_attr( rayton_v2_ui( 'media' ) ); ?>">
			<div class="rh-primary">
				<a class="rh-link rh-link--dot" href="<?php echo esc_url( rayton_v2_page_url( 'ses' ) ); ?>"><span class="dot"></span><?php echo esc_html( rayton_v2_ui( 'solar' ) ); ?></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link rh-link--dot" href="<?php echo esc_url( rayton_v2_page_url( 'uze' ) ); ?>"><span class="dot"></span><?php echo esc_html( rayton_v2_ui( 'storage' ) ); ?></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'projects' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'projects' ) ); ?></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'financing' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'financing' ) ); ?></a>
				<span class="rh-divider" aria-hidden="true"></span>
				<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'investments' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'investors' ) ); ?></a>
			</div>
			<div class="rh-dropdown rh-media">
				<button class="rh-link rh-trigger" type="button" aria-expanded="false" aria-controls="header-media"><?php echo esc_html( rayton_v2_ui( 'media' ) ); ?> <span aria-hidden="true">⌄</span></button>
				<div class="rh-panel rh-media-panel" id="header-media" hidden><a href="<?php echo esc_url( rayton_v2_page_url( 'blog' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'blog' ) ); ?></a><hr><a href="<?php echo esc_url( rayton_v2_page_url( 'youtube' ) ); ?>">Rayton TV</a></div>
			</div>
			<a class="rh-link" href="<?php echo esc_url( rayton_v2_page_url( 'about' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'about' ) ); ?></a>
		</nav>
		<div class="rh-actions">
			<?php $rayton_languages = rayton_v2_language_urls(); ?>
			<?php if ( $rayton_languages ) : ?>
				<div class="rh-languages" role="group" aria-label="Мова">
					<?php foreach ( $rayton_languages as $rayton_language ) : ?>
						<a href="<?php echo esc_url( $rayton_language['url'] ); ?>" lang="<?php echo esc_attr( $rayton_language['slug'] ); ?>"<?php echo ! empty( $rayton_language['current_lang'] ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( strtoupper( 'uk' === $rayton_language['slug'] ? 'ua' : $rayton_language['slug'] ) ); ?></a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<a class="rh-contact-button" href="<?php echo esc_url( rayton_v2_page_url( 'contacts' ) ); ?>"><?php echo esc_html( rayton_v2_ui( 'contact' ) ); ?></a>
			<button class="rh-burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="header-navigation"><span></span><span></span><span></span></button>
		</div>
	</div>
</header>
