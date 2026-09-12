(function () {
  'use strict';
  var header = document.getElementById('site-header');
  if (!header) return;
  var nav = header.querySelector('.rh-nav');
  var burger = header.querySelector('.rh-burger');
  var dropdowns = Array.from(header.querySelectorAll('.rh-dropdown'));
  function setOpen(dropdown, open) {
    dropdown.querySelector('.rh-trigger').setAttribute('aria-expanded', String(open));
    dropdown.querySelector('.rh-panel').hidden = !open;
  }
  function closeAll(except) {
    dropdowns.forEach(function (dropdown) { if (dropdown !== except) setOpen(dropdown, false); });
  }
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.rh-trigger');
    trigger.addEventListener('click', function () {
      var open = trigger.getAttribute('aria-expanded') !== 'true';
      closeAll(dropdown);
      setOpen(dropdown, open);
    });
  });
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (!open) closeAll();
  });
  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) closeAll();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAll();
  });
}());
