/* Keep the original model data; filter by inverter power, not model name. */
(function () {
  'use strict';
  var table = document.getElementById('compare-table');
  if (!table) return;
  var buttons = Array.from(document.querySelectorAll('.compare__tabs button'));
  var rows = Array.from(table.querySelectorAll('tbody tr'));
  var toggle = document.querySelector('[data-business-expand]');
  var selected = 0;
  var expanded = false;
  function locale() { return window.RaytonI18n ? window.RaytonI18n.getLocale() : 'uk'; }
  function labels() {
    return {
      uk: { less: 'Згорнути', more: 'Показати всі моделі' },
      ru: { less: 'Свернуть', more: 'Показать все модели' },
      en: { less: 'Show less', more: 'Show all models' }
    }[locale()];
  }
  function render() {
    var matching = rows.filter(function (row) {
      var power = parseFloat(row.cells[1].textContent);
      return selected === 0 ? power <= 300 : power >= 300;
    });
    rows.forEach(function (row) {
      var index = matching.indexOf(row);
      row.classList.remove('compare-table__extra');
      row.hidden = index < 0 || (!expanded && index >= 6);
    });
    buttons.forEach(function (button, index) {
      button.classList.toggle('is-active', index === selected);
      button.setAttribute('aria-pressed', String(index === selected));
    });
    document.getElementById('compare-shown').textContent = expanded ? matching.length : Math.min(6, matching.length);
    document.getElementById('compare-total').textContent = matching.length;
    toggle.hidden = matching.length <= 6;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.classList.toggle('is-expanded', expanded);
    var copy = labels();
    toggle.querySelector('[data-expand-label]').textContent = expanded ? copy.less : copy.more;
  }
  buttons.forEach(function (button, index) {
    button.addEventListener('click', function () { selected = index; expanded = false; render(); });
  });
  toggle.addEventListener('click', function () { expanded = !expanded; render(); });
  window.addEventListener('rayton:localechange', render);
  render();
}());
