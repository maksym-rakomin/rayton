<?php $en = 'en' === rayton_v2_current_locale(); ?>
<dialog class="media-player" aria-labelledby="media-player-title">
 <div class="media-player__head"><h2 id="media-player-title">Rayton TV</h2><button type="button" class="media-player__close" aria-label="<?php echo esc_attr( $en ? 'Close video' : 'Закрити відео' ); ?>">×</button></div>
 <div class="media-player__screen"></div>
 <a class="media-player__original" href="https://www.youtube.com/@RaytonSun" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $en ? 'Watch on YouTube' : 'Дивитися на YouTube' ); ?></a>
</dialog>
