/* Incremental translations: untranslated page content stays in Ukrainian. */
(function () {
  'use strict';
  var messages = window.RaytonMessages || {};
  // Russian copy stays available in the source dictionary, but is not exposed on the site.
  var supported = ['uk', 'en'];
  var locale = 'uk';
  function lookup(language, key) {
    return key.split('.').reduce(function (value, part) { return value && value[part]; }, messages[language]);
  }
  function t(key) { return lookup(locale, key) || lookup('uk', key) || key; }
  function apply(root) {
    root.querySelectorAll('[data-i18n]').forEach(function (element) {
      var value = t(element.dataset.i18n);
      if (element.querySelector('b')) {
        var space = value.indexOf(' ');
        var bold = document.createElement('b');
        bold.textContent = value.slice(0, space);
        element.replaceChildren(bold, document.createTextNode(value.slice(space)));
      } else element.textContent = value;
      element.lang = lookup(locale, element.dataset.i18n) ? locale : 'uk';
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (element) { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
    root.querySelectorAll('[data-locale]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.locale === locale)); });
    var header = document.getElementById('site-header');
    if (header) header.lang = locale;
    document.documentElement.lang = locale;
  }
  function setLocale(next) {
    if (!supported.includes(next)) return;
    locale = next;
    try { localStorage.setItem('rayton.locale', locale); } catch (_) { /* Private browsing may disable storage. */ }
    apply(document);
    window.dispatchEvent(new CustomEvent('rayton:localechange', { detail: { locale: locale } }));
  }
  try {
    var requested = new URLSearchParams(location.search).get('lang');
    var saved = requested || localStorage.getItem('rayton.locale');
    if (supported.includes(saved)) locale = saved;
  } catch (_) { /* Ukrainian remains the fallback. */ }
  document.querySelectorAll('[data-locale]').forEach(function (button) { button.addEventListener('click', function () { setLocale(button.dataset.locale); }); });
  window.RaytonI18n = { t: t, setLocale: setLocale, apply: apply, getLocale: function () { return locale; }, supportedLocales: supported.slice() };
  apply(document);
})();
