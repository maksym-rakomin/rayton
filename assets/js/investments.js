/* Static-site enquiry: prepare an email; never claim a server submission. */
(function () {
  'use strict';
  var form = document.getElementById('investment-enquiry');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var locale = window.RaytonI18n ? window.RaytonI18n.getLocale() : 'uk';
    var labels = {
      uk: ['Ім’я', 'Телефон', 'Email', 'Орієнтовний бюджет', 'Напрямок', 'Коментар'],
      ru: ['Имя', 'Телефон', 'Email', 'Ориентировочный бюджет', 'Направление', 'Комментарий'],
      en: ['Name', 'Phone', 'Email', 'Estimated budget', 'Interest', 'Comment']
    }[locale];
    var fields = ['name', 'phone', 'email', 'budget', 'interest', 'comment'].map(function (name, index) { return [name, labels[index]]; });
    var body = fields.map(function (entry) { return entry[1] + ': ' + String(data.get(entry[0]) || '').trim(); }).join('\n');
    var subject = { uk: 'Заявка інвестора — Rayton', ru: 'Заявка инвестора — Rayton', en: 'Investor enquiry — Rayton' }[locale];
    var draftUrl = 'mailto:sales@rayton.com.ua?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    var status = document.getElementById('investment-form-status');
    var statusCopy = {
      uk: ['Заявку підготовлено. Надішліть лист із вашої поштової програми. Якщо вона не відкрилась, ', 'відкрийте підготовлений лист', '. Дані форми залишаються доступними для копіювання.'],
      ru: ['Заявка подготовлена. Отправьте письмо из вашей почтовой программы. Если она не открылась, ', 'откройте подготовленное письмо', '. Данные формы остаются доступными для копирования.'],
      en: ['Your enquiry is ready. Send it from your email app. If the app did not open, ', 'open the prepared email', '. The form data remains available to copy.']
    }[locale];
    status.replaceChildren(document.createTextNode(statusCopy[0]));
    var link = document.createElement('a');
    link.href = draftUrl;
    link.textContent = statusCopy[1];
    status.append(link, document.createTextNode(statusCopy[2]));
    status.hidden = false;
    window.location.href = draftUrl;
  });
})();
