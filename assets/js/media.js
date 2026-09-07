/* Local article pagination and click-to-play YouTube; shared tabs remain in main.js. */
(function () {
  'use strict';
  document.querySelectorAll('.media-blog-content, .media-tv-videos').forEach(function (section) {
    var buttons = Array.from(section.querySelectorAll('[data-media-filter]'));
    var grid = section.querySelector('.grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll('[data-media-category]'));
    var status = section.querySelector('.media-results');
    var empty = section.querySelector('.media-empty');
    var pagination = section.querySelector('.media-pagination');
    var pageButtons = pagination ? Array.from(pagination.querySelectorAll('[data-media-page]')) : [];
    var pageSize = pagination ? 6 : cards.length;
    var activeCategory = 'all';
    var currentPage = 1;
    function render() {
      var filtered = cards.filter(function (card) {
        return activeCategory === 'all' || card.dataset.mediaCategory.split(' ').includes(activeCategory);
      });
      var pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      currentPage = Math.min(currentPage, pages);
      var start = (currentPage - 1) * pageSize;
      var visible = filtered.slice(start, start + pageSize);
      cards.forEach(function (card) { card.hidden = !visible.includes(card); });
      buttons.forEach(function (button) {
        var active = button.dataset.mediaFilter === activeCategory;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      pageButtons.forEach(function (button) {
        var number = Number(button.dataset.mediaPage);
        button.hidden = number > pages;
        if (number === currentPage) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      if (status) status.textContent = filtered.length ? (start + 1) + '–' + (start + visible.length) + ' із ' + filtered.length : 'Матеріалів поки немає';
      if (empty) empty.hidden = filtered.length > 0;
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeCategory = button.dataset.mediaFilter;
        currentPage = 1;
        render();
      });
    });
    pageButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        currentPage = Number(button.dataset.mediaPage);
        render();
        grid.scrollIntoView({block: 'start', behavior: 'auto'});
      });
    });
    render();
  });

  var dialog = document.querySelector('.media-player');
  if (!dialog || !dialog.showModal) return;
  var screen = dialog.querySelector('.media-player__screen');
  var close = dialog.querySelector('.media-player__close');
  var origin = dialog.querySelector('.media-player__original');
  var title = dialog.querySelector('#media-player-title');
  var opener;
  document.querySelectorAll('[data-media-video]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      // Preserve normal open-in-new-tab/link behaviour.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      var id = link.dataset.mediaVideo;
      if (!/^[\w-]{11}$/.test(id)) return;
      event.preventDefault();
      opener = link;
      var heading = link.querySelector('h2, h3, .media-row__title');
      var name = heading ? heading.textContent : link.getAttribute('aria-label') || 'Відео Rayton Sun';
      title.textContent = name;
      origin.href = 'https://www.youtube.com/watch?v=' + id;
      var frame = document.createElement('iframe');
      frame.title = name;
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      screen.replaceChildren(frame);
      dialog.showModal();
      document.documentElement.classList.add('media-player-open');
      close.focus();
    });
  });
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () {
    screen.replaceChildren(); // Stop playback, including when Escape closes the dialog.
    document.documentElement.classList.remove('media-player-open');
    if (opener) opener.focus({preventScroll:true});
  });
}());
