/* Static-site enquiry, matching the existing investment form's email flow. */
(function () {
  'use strict';
  var form = document.getElementById('contact-enquiry');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    ['name', 'phone', 'question'].forEach(function (name) {
      var field = form.elements[name];
      field.value = field.value.trim();
    });
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var locale = window.RaytonI18n ? window.RaytonI18n.getLocale() : 'uk';
    var labels = {
      uk: ['П.І.Б', 'Телефон', 'Email', 'Запитання'],
      ru: ['Ф.И.О.', 'Телефон', 'Email', 'Вопрос'],
      en: ['Full name', 'Phone', 'Email', 'Question']
    }[locale];
    var fields = ['name', 'phone', 'email', 'question'].map(function (name, index) { return [name, labels[index]]; });
    var body = fields.map(function (field) { return field[1] + ': ' + String(data.get(field[0]) || '').trim(); }).join('\n');
    var subjects = { uk: 'Звернення з сайту Rayton', ru: 'Обращение с сайта Rayton', en: 'Enquiry from the Rayton website' };
    var url = 'mailto:sales@rayton.com.ua?subject=' + encodeURIComponent(subjects[locale]) + '&body=' + encodeURIComponent(body);
    var status = document.getElementById('contact-form-status');
    var link = document.createElement('a');
    link.href = url;
    var copy = {
      uk: ['Звернення підготовлено. Надішліть його з вашої поштової програми. ', 'Відкрити підготовлений лист'],
      ru: ['Обращение подготовлено. Отправьте его из вашей почтовой программы. ', 'Открыть подготовленное письмо'],
      en: ['Your enquiry is ready. Send it from your email app. ', 'Open the prepared email']
    }[locale];
    link.textContent = copy[1];
    status.replaceChildren(document.createTextNode(copy[0]), link);
    status.hidden = false;
    window.location.href = url;
  });
})();
