/* The power-filter tabs are temporarily hidden; show every comparison row. */
(function () {
  'use strict';
  var table = document.getElementById('compare-table');
  if (!table) return;
  var rows = Array.from(table.querySelectorAll('tbody tr'));
  function render() {
    rows.forEach(function (row) {
      row.classList.remove('compare-table__extra');
      row.hidden = false;
    });
    document.getElementById('compare-shown').textContent = rows.length;
    document.getElementById('compare-total').textContent = rows.length;
  }
  window.addEventListener('rayton:localechange', render);
  render();
}());
