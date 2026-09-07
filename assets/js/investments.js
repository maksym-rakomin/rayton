/* Static-site enquiry: prepare an email; never claim a server submission. */
(function () {
  'use strict';
  var form = document.getElementById('investment-enquiry');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var fields = [['name', 'Ім’я'], ['phone', 'Телефон'], ['email', 'Email'], ['budget', 'Орієнтовний бюджет'], ['interest', 'Напрямок'], ['comment', 'Коментар']];
    var body = fields.map(function (entry) { return entry[1] + ': ' + String(data.get(entry[0]) || '').trim(); }).join('\n');
    var draftUrl = 'mailto:sales@rayton.com.ua?subject=' + encodeURIComponent('Заявка інвестора — Rayton') + '&body=' + encodeURIComponent(body);
    var status = document.getElementById('investment-form-status');
    status.replaceChildren(document.createTextNode('Заявку підготовлено. Надішліть лист із вашої поштової програми. Якщо вона не відкрилась, '));
    var link = document.createElement('a');
    link.href = draftUrl;
    link.textContent = 'відкрийте підготовлений лист';
    status.append(link, document.createTextNode('. Дані форми залишаються доступними для копіювання.'));
    status.hidden = false;
    window.location.href = draftUrl;
  });
})();
