/* Shared header: hover menus on desktop; click, keyboard and touch everywhere. */
(function () {
  'use strict';
  var header = document.getElementById('site-header');
  if (!header) return;
  var compact = window.matchMedia('(max-width: 1320px)');
  var nav = header.querySelector('.rh-nav');
  var burger = header.querySelector('.rh-burger');
  var dropdowns = Array.from(header.querySelectorAll('.rh-dropdown'));
  function opensOnDesktopHover(dropdown) {
    return dropdown.classList.contains('rh-media') ||
      dropdown.classList.contains('rh-notifications') ||
      dropdown.classList.contains('rh-contact');
  }
  function setOpen(dropdown, open) {
    dropdown.querySelector('.rh-trigger').setAttribute('aria-expanded', String(open));
    dropdown.querySelector('.rh-panel').hidden = !open;
  }
  function closeAll(except) {
    dropdowns.forEach(function (dropdown) { if (dropdown !== except) setOpen(dropdown, false); });
  }
  function setNav(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (!open) closeAll();
  }
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.rh-trigger');
    trigger.addEventListener('click', function (event) {
      var open = trigger.getAttribute('aria-expanded') !== 'true';
      // A mouse click after pointerenter must keep a desktop hover menu open.
      if (opensOnDesktopHover(dropdown) && !compact.matches && event.detail > 0 && event.pointerType !== 'touch') open = true;
      closeAll(dropdown);
      setOpen(dropdown, open);
    });
    if (opensOnDesktopHover(dropdown)) {
      dropdown.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'touch' || compact.matches) return;
        closeAll(dropdown);
        setOpen(dropdown, true);
      });
      dropdown.addEventListener('pointerleave', function (event) {
        if (event.pointerType === 'touch' || compact.matches) return;
        setOpen(dropdown, false);
      });
    }
    dropdown.addEventListener('focusout', function (event) {
      if (!dropdown.contains(event.relatedTarget)) setOpen(dropdown, false);
    });
    var close = dropdown.querySelector('.rh-close');
    if (close) close.addEventListener('click', function () { setOpen(dropdown, false); trigger.focus(); });
  });
  burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('click', function (event) {
    dropdowns.forEach(function (dropdown) { if (!dropdown.contains(event.target)) setOpen(dropdown, false); });
    if (!header.contains(event.target)) setNav(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var open = dropdowns.find(function (dropdown) { return !dropdown.querySelector('.rh-panel').hidden; });
    if (open) { setOpen(open, false); open.querySelector('.rh-trigger').focus(); }
    else if (nav.classList.contains('is-open')) { setNav(false); burger.focus(); }
  });
  header.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setNav(false); });
    if (link.getAttribute('href') === (location.pathname.split('/').pop() || 'index.html')) link.setAttribute('aria-current', 'page');
  });
  compact.addEventListener('change', function () { setNav(false); });
})();
