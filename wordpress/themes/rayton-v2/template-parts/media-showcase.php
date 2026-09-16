<?php
/** Shared media showcase: latest WordPress articles and verified channel videos. */
$en = 'en' === rayton_v2_current_locale();
$category = rayton_v2_blog_category_id();
$posts = $category ? get_posts( array(
	'post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 7,
	'cat' => $category, 'orderby' => 'date', 'order' => 'DESC', 'suppress_filters' => false,
) ) : array();
$videos = require get_theme_file_path( 'inc/media-videos.php' );
$groups = array( $posts, $videos );
$showcase_id = wp_unique_id( 'rayton-showcase-' );
$tv = ! empty( $args['tv'] );
?>
<section class="section section--dark section-showcase<?php echo $tv ? ' media-tv-showcase' : ''; ?>" id="projects">
 <div class="container">
  <div class="showcase" id="<?php echo esc_attr( $showcase_id ); ?>">
   <div class="showcase__main">
    <div class="section-head"><p class="eyebrow">Rayton <?php echo $tv ? 'TV' : ''; ?></p><h2 class="section-head__title"><?php echo esc_html( $en ? 'Latest articles and videos' : 'Останні статті та відео' ); ?></h2></div>
    <div class="tabs tabs--light showcase__tabs" data-tabs="#<?php echo esc_attr( $showcase_id ); ?>" role="tablist" aria-label="<?php echo esc_attr( $en ? 'Media' : 'Медіа' ); ?>">
     <button class="tabs__btn is-active" type="button" role="tab" aria-selected="true"><?php echo esc_html( $en ? 'Articles' : 'Статті' ); ?></button>
     <button class="tabs__btn" type="button" role="tab" aria-selected="false"><?php echo esc_html( $en ? 'Videos' : 'Відео' ); ?></button>
    </div>
    <?php foreach ( $groups as $panel => $items ) : ?>
     <?php if ( $items ) : $item = $items[0];
      $title = $panel ? $item['title'] : get_the_title( $item );
      $url = $panel ? 'https://www.youtube.com/watch?v=' . $item['id'] : get_permalink( $item );
      $img = $panel ? 'https://i.ytimg.com/vi/' . $item['id'] . '/hqdefault.jpg' : get_the_post_thumbnail_url( $item, 'large' );
     ?>
     <a class="showcase__feature<?php echo $panel ? ' showcase__feature--video is-hidden' : ''; ?>" data-tab-panel="<?php echo (int) $panel; ?>" href="<?php echo esc_url( $url ); ?>"<?php if ( $panel ) : ?> data-media-video="<?php echo esc_attr( $item['id'] ); ?>"<?php endif; ?>>
      <?php if ( $img ) : ?><img src="<?php echo esc_url( $img ); ?>" alt="" width="746" height="535" loading="lazy"><?php endif; ?>
      <?php if ( $panel ) : ?><span class="showcase__play" aria-hidden="true"><svg><use href="#i-play"></use></svg></span><?php endif; ?>
      <div class="showcase__feature-body">
       <h3 class="showcase__feature-title"><?php echo esc_html( $title ); ?></h3>
       <?php if ( ! $panel ) : ?><p class="showcase__feature-text"><?php echo esc_html( wp_trim_words( wp_strip_all_tags( get_the_excerpt( $item ) ), 28 ) ); ?></p><p class="showcase__meta"><?php echo esc_html( get_the_date( '', $item ) ); ?></p><?php endif; ?>
       <span class="btn btn--primary"><?php echo esc_html( $panel ? ( $en ? 'Watch video' : 'Дивитися відео' ) : ( $en ? 'Read more' : 'Читати більше' ) ); ?></span>
      </div>
     </a>
     <?php else : ?>
      <p data-tab-panel="<?php echo (int) $panel; ?>" class="media-empty<?php echo $panel ? ' is-hidden' : ''; ?>"><?php echo esc_html( $en ? 'No articles have been published yet.' : 'Матеріалів поки немає.' ); ?></p>
     <?php endif; ?>
    <?php endforeach; ?>
   </div>
   <?php foreach ( $groups as $panel => $items ) : ?>
    <div class="showcase__list<?php echo $panel ? ' is-hidden' : ''; ?>" data-tab-panel="<?php echo (int) $panel; ?>" tabindex="0">
     <?php foreach ( array_slice( $items, 1, 6 ) as $item ) :
      $title = $panel ? $item['title'] : get_the_title( $item );
      $url = $panel ? 'https://www.youtube.com/watch?v=' . $item['id'] : get_permalink( $item );
      $img = $panel ? 'https://i.ytimg.com/vi/' . $item['id'] . '/hqdefault.jpg' : get_the_post_thumbnail_url( $item, 'medium' );
     ?>
      <a class="media-row" href="<?php echo esc_url( $url ); ?>"<?php if ( $panel ) : ?> data-media-video="<?php echo esc_attr( $item['id'] ); ?>"<?php endif; ?>>
       <?php if ( $img ) : ?><span class="media-row__media"><img src="<?php echo esc_url( $img ); ?>" alt="" width="160" height="90" loading="lazy"></span><?php endif; ?>
       <span class="media-row__body"><span class="media-row__date"><?php echo esc_html( $panel ? 'Rayton Sun' : get_the_date( '', $item ) ); ?></span><span class="media-row__title"><?php echo esc_html( $title ); ?></span></span>
      </a>
     <?php endforeach; ?>
    </div>
   <?php endforeach; ?>
  </div>
 </div>
</section>
