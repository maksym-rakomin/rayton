(function () {
  'use strict';
  var config = window.raytonV2 || {};
  var model = window.RaytonSolar;
  var results = document.getElementById('solar-results');
  var forms = Array.from(document.querySelectorAll('.calc__card'));
  if (!model || !forms.length) return;
  var currentLocale = copyLocale(config.locale);
  function copyLocale(locale) { return ['uk', 'en', 'ru'].includes(locale) ? locale : 'uk'; }
  var copy = {
    uk: {
      locale: 'uk-UA', currency: ' грн', kw: ' кВт', years: ' р.', months: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
      savings: 'Економія', monthlySavings: 'Щомісячна економія', own: 'Власні кошти', credit: 'Кредитні кошти, внесок {n}%',
      power: 'Потужність СЕС по модулях, кВт', cost: 'Вартість СЕС, грн', average: 'Середньомісячна економія, грн', payment: 'Щомісячний кредитний платіж, грн', annual: 'Річна економія, грн', payback: 'Окупність, років', profit: 'Прибуток за 30 років, грн', deposit: 'Сума внеску {n}%, грн',
      income: 'Середньомісячний прибуток від генерації СЕС', averageNote: 'усереднена економія', creditPayment: 'Щомісячний платіж по кредиту', creditNote: 'внесок 0%, 84 міс.', balance: 'Залишок після оплати кредиту', balanceNote: 'економія мінус платіж',
      invalid: 'Введіть додатне число у кожне поле. Можна використовувати кому або крапку.', tooSmall: 'За цих даних потужність СЕС округлюється до нуля. Перевірте споживання або суму рахунку.'
    },
    ru: {
      locale: 'ru-RU', currency: ' грн', kw: ' кВт', years: ' г.', months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      savings: 'Экономия', monthlySavings: 'Ежемесячная экономия', own: 'Собственные средства', credit: 'Кредитные средства, взнос {n}%',
      power: 'Мощность СЭС по модулям, кВт', cost: 'Стоимость СЭС, грн', average: 'Среднемесячная экономия, грн', payment: 'Ежемесячный кредитный платёж, грн', annual: 'Годовая экономия, грн', payback: 'Окупаемость, лет', profit: 'Прибыль за 30 лет, грн', deposit: 'Сумма взноса {n}%, грн',
      income: 'Среднемесячная прибыль от генерации СЭС', averageNote: 'средняя экономия', creditPayment: 'Ежемесячный платёж по кредиту', creditNote: 'взнос 0%, 84 мес.', balance: 'Остаток после оплаты кредита', balanceNote: 'экономия минус платёж',
      invalid: 'Введите положительное число в каждое поле. Можно использовать запятую или точку.', tooSmall: 'При этих данных мощность СЭС округляется до нуля. Проверьте потребление или сумму счёта.'
    },
    en: {
      locale: 'en-GB', currency: ' UAH', kw: ' kW', years: ' yrs', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      savings: 'Savings', monthlySavings: 'Monthly savings', own: 'Own funds', credit: 'Credit financing, {n}% deposit',
      power: 'Solar capacity by modules, kW', cost: 'Solar system cost, UAH', average: 'Average monthly savings, UAH', payment: 'Monthly loan payment, UAH', annual: 'Annual savings, UAH', payback: 'Payback period, years', profit: 'Profit over 30 years, UAH', deposit: '{n}% deposit, UAH',
      income: 'Average monthly solar generation income', averageNote: 'average savings', creditPayment: 'Monthly loan payment', creditNote: '0% deposit, 84 months', balance: 'Balance after loan payment', balanceNote: 'savings minus payment',
      invalid: 'Enter a positive number in every field. You can use a comma or a decimal point.', tooSmall: 'With these inputs, the solar capacity rounds down to zero. Check the consumption or bill amount.'
    }
  };
  function t(key, value) { return copy[currentLocale][key].replace('{n}', value == null ? '' : value); }
  function money(n) { return Math.round(n).toLocaleString(copy[currentLocale].locale) + copy[currentLocale].currency; }
  function years(n) { return '~' + n.toLocaleString(copy[currentLocale].locale, { maximumFractionDigits: 1 }) + copy[currentLocale].years; }
  function parse(value) {
    var cleaned = value.trim().replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
    return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(cleaned) ? Number(cleaned) : NaN;
  }
  function inputFromForm(form) {
    var monthlyCost = form.querySelector('[name="monthlyCostUAH"]');
    if (monthlyCost) return { monthlyCostUAH: parse(monthlyCost.value) };
    return {
      monthlyConsumptionKwh: parse(form.querySelector('[name="monthlyConsumptionKwh"]').value),
      tariff: parse(form.querySelector('[name="tariff"]').value)
    };
  }
  function row(label, value, accent) {
    return '<div class="solar-card__row' + (accent ? ' solar-card__row--accent' : '') + '"><dt>' + label + '</dt><dd>' + value + '</dd></div>';
  }
  var chartId = 0;
  function chart(r, payment) {
    var max = Math.max.apply(null, r.monthlyData.concat([payment || 0, 1])) * 1.12;
    var id = 'solar-tooltip-' + (++chartId);
    var months = copy[currentLocale].months;
    var html = '<div class="solar-chart" role="group" aria-label="' + t('monthlySavings') + '"><div class="solar-chart__tooltip" id="' + id + '" role="tooltip" hidden></div><div class="solar-chart__plot">';
    r.monthlyData.forEach(function (v, i) {
      html += '<button type="button" class="solar-chart__month" data-month="' + months[i] + '" data-value="' + v + '" aria-label="' + months[i] + ': ' + t('savings').toLowerCase() + ' ' + money(v) + '"><span class="solar-chart__bar" style="height:' + (v / max * 100) + '%"></span><span class="solar-chart__label">' + months[i] + '</span></button>';
    });
    html += '<div class="solar-chart__line" style="bottom:' + r.avgMonthlySavings / max * 100 + '%"></div>';
    if (payment != null) html += '<div class="solar-chart__line solar-chart__line--credit" style="bottom:' + payment / max * 100 + '%"></div>';
    return html + '</div></div>';
  }
  function bindCharts() {
    results.querySelectorAll('.solar-chart').forEach(function (chart) {
      var tooltip = chart.querySelector('.solar-chart__tooltip');
      var buttons = Array.from(chart.querySelectorAll('.solar-chart__month'));
      function hide() {
        tooltip.hidden = true;
        buttons.forEach(function (button) { button.classList.remove('is-active'); button.removeAttribute('aria-describedby'); });
      }
      function show(button) {
        hide();
        button.classList.add('is-active');
        button.setAttribute('aria-describedby', tooltip.id);
        tooltip.replaceChildren();
        var month = document.createElement('strong');
        month.textContent = button.dataset.month;
        var value = document.createElement('span');
        value.textContent = t('savings') + ': ' + money(Number(button.dataset.value));
        tooltip.append(month, value);
        tooltip.hidden = false;
        var center = button.offsetLeft + button.offsetWidth / 2;
        tooltip.style.left = Math.max(0, Math.min(center - tooltip.offsetWidth / 2, chart.clientWidth - tooltip.offsetWidth)) + 'px';
      }
      buttons.forEach(function (button, index) {
        button.addEventListener('pointerenter', function () { show(button); });
        button.addEventListener('focus', function () { show(button); });
        button.addEventListener('click', function () { show(button); });
        button.addEventListener('keydown', function (event) {
          var next = event.key === 'ArrowRight' ? (index + 1) % 12 : event.key === 'ArrowLeft' ? (index + 11) % 12 : event.key === 'Home' ? 0 : event.key === 'End' ? 11 : null;
          if (next !== null) { event.preventDefault(); buttons[next].focus(); }
          if (event.key === 'Escape') { event.preventDefault(); hide(); }
        });
      });
      chart.addEventListener('pointerleave', hide);
      chart.addEventListener('focusout', function (event) { if (!chart.contains(event.relatedTarget)) hide(); });
    });
  }
  function card(r, credit) {
    var title = credit ? t('credit', credit.dpPercent) : t('own');
    var html = '<article class="solar-card' + (credit && credit.dpPercent === 0 ? ' solar-card--featured' : '') + '"><h3>' + title + '</h3><div class="solar-card__body"><dl>';
    html += row(t('power'), r.powerKw.toLocaleString(copy[currentLocale].locale) + copy[currentLocale].kw);
    html += row(t('cost'), money(r.systemCost));
    html += row(t('average'), money(r.avgMonthlySavings), !credit);
    if (credit) html += row(t('payment'), money(credit.monthlyPayment), true);
    html += row(t('annual'), money(r.annualSavings));
    html += row(t('payback'), years(credit ? credit.payback : r.paybackOwn));
    html += row(t('profit'), money(credit ? credit.profit30 : r.profit30Own));
    if (credit && credit.dpPercent) html += row(t('deposit', credit.dpPercent), money(credit.downPayment));
    return html + '</dl>' + chart(r, credit ? credit.monthlyPayment : null) + '</div></article>';
  }
  function summary(label, value, note, accent) {
    return '<div class="solar-summary' + (accent ? ' solar-summary--accent' : '') + '"><p>' + label + '</p><strong>' + money(value) + '</strong><p>' + note + '</p></div>';
  }
  function render(input) {
    var r = model.calculateSolarPayback(input);
    if (!Number.isFinite(r.systemCost) || r.powerKw <= 0 || r.annualSavings <= 0) return false;
    results.querySelector('.solar-results__grid').innerHTML = card(r) + r.creditScenarios.map(function (c) { return card(r, c); }).join('');
    bindCharts();
    var credit = r.creditScenarios[0];
    results.querySelector('.solar-results__summary').innerHTML = summary(t('income'), r.avgMonthlySavings, t('averageNote')) + summary(t('creditPayment'), credit.monthlyPayment, t('creditNote')) + summary(t('balance'), credit.netMonthly, t('balanceNote'), true);
    results.hidden = false;
    return true;
  }
  forms.forEach(function (form, index) {
    var inputs = Array.from(form.querySelectorAll('input'));
    var error = document.createElement('p');
    error.className = 'calc__error';
    error.id = 'calc-error-' + index;
    error.setAttribute('role', 'alert');
    error.hidden = true;
    form.appendChild(error);
    inputs.forEach(function (field) {
      field.setAttribute('aria-describedby', error.id);
      field.addEventListener('input', function () { field.removeAttribute('aria-invalid'); error.hidden = true; });
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var invalid = inputs.find(function (field) { var value = parse(field.value); return !Number.isFinite(value) || value <= 0 || value > 1e12; });
      if (invalid) {
        error.textContent = t('invalid');
        error.hidden = false;
        invalid.setAttribute('aria-invalid', 'true');
        invalid.focus();
        return;
      }
      var input = inputFromForm(form);
      var checked = model.calculateSolarPayback(input);
      if (checked.powerKw <= 0 || checked.annualSavings <= 0) {
        error.textContent = t('tooSmall');
        error.hidden = false;
        return;
      }
      var params = new URLSearchParams(input);
      if (!results) { window.location.assign((config.calculatorUrl || location.pathname) + '?' + params + '#solar-results'); return; }
      render(input);
      history.replaceState(null, '', '?' + params + '#solar-results');
      results.scrollIntoView({ behavior: 'auto', block: 'start' });
      results.querySelector('h2').focus({ preventScroll: true });
    });
  });
  if (!results) return;
  var params = new URLSearchParams(location.search);
  var input = {};
  ['monthlyConsumptionKwh', 'tariff', 'monthlyCostUAH'].forEach(function (key) { if (params.has(key)) input[key] = parse(params.get(key)); });
  var valid = Object.keys(input).length && Object.values(input).every(function (v) { return Number.isFinite(v) && v > 0 && v <= 1e12; }) && (input.monthlyCostUAH || (input.monthlyConsumptionKwh && input.tariff));
  if (valid) {
    if (input.monthlyCostUAH) document.querySelector('[name="monthlyCostUAH"]').value = input.monthlyCostUAH;
    else {
      document.querySelector('[name="monthlyConsumptionKwh"]').value = input.monthlyConsumptionKwh;
      document.querySelector('[name="tariff"]').value = input.tariff;
    }
    if (render(input)) requestAnimationFrame(function () { results.scrollIntoView({ block: 'start' }); });
  }
})();
