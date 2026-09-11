(function () {
  'use strict';

  const models = {
    'ress-125-261': {
      name: 'RESS 125-261',
      subtitle: 'Компактна система накопичення електроенергії',
      image: 'assets/img/ress-1125-2170.png',
      description: 'RESS 125-261 — це компактне all in one рішення, яке робить ваше підприємство незалежним від блекаутів та дозволяє заробляти, окуповуючи само себе. Система підходить для підприємств малого та середнього масштабу, де критично важливо забезпечити резерв живлення, підтримати роботу обладнання під час відключень або оптимізувати використання енергії від сонячної електростанції.',
      specs: [['Потужність інверторів', '125 кВт'], ['Потужність акумуляторних блоків', '261 кВт·год'], ['Тип рішення', 'Промислова система накопичення енергії'], ['Інтеграція', 'СЕС / мережа / генератор / гібридна система']],
      groups: [{ title: 'Основні переваги', items: ['Резерв живлення під час перебоїв і відключень', 'Зниження пікових навантажень на вводі', 'Оптимізація власного споживання електроенергії', 'Інтеграція з сонячною електростанцією', 'Робота в режимі без електромережі', 'Надійна та безпечна експлуатація', 'Можливість масштабування – до 20 систем'] }, { title: 'Для кого підходить', items: ['Малий та середній бізнес', 'Виробничі приміщення', 'Склади та логістичні об’єкти', 'Комерційні об’єкти', 'Локальні критичні навантаження'] }],
      en: { subtitle: 'Compact energy storage system', description: 'RESS 125-261 is a compact all-in-one solution that helps make your business independent of blackouts and can pay for itself. It is suitable for small and medium-sized businesses where backup power, equipment continuity during outages, or optimising solar energy use is critical.', specs: [['Inverter power', '125 kW'], ['Battery capacity', '261 kWh'], ['Solution type', 'Industrial energy storage system'], ['Integration', 'Solar / grid / generator / hybrid system']], groups: [{ title: 'Key benefits', items: ['Backup power during disruptions and outages', 'Peak-load reduction at the connection point', 'Optimisation of on-site electricity consumption', 'Integration with a solar power plant', 'Off-grid operation', 'Reliable and safe operation', 'Scalability — up to 20 systems'] }, { title: 'Who it is for', items: ['Small and medium-sized businesses', 'Manufacturing facilities', 'Warehouses and logistics sites', 'Commercial properties', 'Local critical loads'] }] }
    },
    'ress-1125-2170': {
      name: 'RESS 1125-2170',
      subtitle: 'Промислова система накопичення електроенергії',
      image: 'assets/img/ress-125-261.png',
      description: 'RESS 1125-2170 — це комерційне рішення для накопичення електроенергії з мережі або фотополя в акумуляторних батареях з допомогою силової електроніки для подальшого її використання в години із високою ціною електроенергії, для покриття пікових навантажень, оптимізації власного споживання електроенергії, резервного живлення у разі аварійних відключень, а також для роботи в режимі без електромережі.',
      specs: [['Потужність інверторів', '1125 кВт'], ['Потужність акумуляторних блоків', '2170 кВт·год'], ['Тип рішення', 'Промислова система накопичення енергії'], ['Інтеграція', 'СЕС / мережа / генератор / гібридна система']],
      groups: [{ title: 'Основні складові установки', items: ['Елемент живлення', 'Акумуляторні блоки', 'Перетворюючий модуль PDU DC/DC', 'Перетворюючий модуль PSC AC/DC', 'Вбудована EMS система УЗЕ', 'Система рідинного охолодження', 'Система активного пожежогасіння'] }, { title: 'Особливості системи Rayton', items: ['Модульність та контейнерний формат', 'Можливість розширення потужності', 'Надійна та стабільна робота', 'Підбір конфігурації під потреби об’єкта'] }],
      en: { subtitle: 'Industrial energy storage system', description: 'RESS 1125-2170 is a commercial energy storage solution that stores energy from the grid or solar field in battery units using power electronics. It can then be used during high-price hours, to cover peak loads, optimise on-site consumption, provide backup power during outages, or operate off-grid.', specs: [['Inverter power', '1125 kW'], ['Battery capacity', '2170 kWh'], ['Solution type', 'Industrial energy storage system'], ['Integration', 'Solar / grid / generator / hybrid system']], groups: [{ title: 'Core system components', items: ['Power cell', 'Battery units', 'PDU DC/DC conversion module', 'PSC AC/DC conversion module', 'Integrated BESS EMS', 'Liquid cooling system', 'Active fire-suppression system'] }, { title: 'Rayton system features', items: ['Modular, containerised format', 'Expandable power capacity', 'Reliable and stable operation', 'Configuration tailored to the site’s needs'] }] }
    },
    'ress-1000-4180': {
      name: 'RESS 1000-4180',
      subtitle: 'Промислова система накопичення електроенергії',
      image: 'assets/img/ress-2500-5015.png',
      description: 'RESS 1000-4180 — це комерційне рішення для накопичення електроенергії з мережі або фотополя в акумуляторних батареях з допомогою силової електроніки для подальшого її використання в години із високою ціною електроенергії, для покриття пікових навантажень, оптимізації власного споживання електроенергії, резервного живлення у разі аварійних відключень, а також для роботи в режимі без електромережі.',
      specs: [['Потужність інверторів', 'від 1000 кВт'], ['Потужність акумуляторних блоків', '4180 кВт·год'], ['Тип рішення', 'Промислова система накопичення енергії'], ['Інтеграція', 'СЕС / мережа / генератор / гібридна система']],
      groups: [{ title: 'Основні складові установки', items: ['Елемент живлення', 'Акумуляторні блоки', 'Перетворюючий модуль PDU DC/DC', 'Перетворюючий модуль PSC AC/DC', 'Вбудована EMS система УЗЕ', 'Система рідинного охолодження', 'Система активного пожежогасіння'] }, { title: 'Особливості системи', items: ['All-in-one формат та масштабованість', 'Можливість розширення потужності', 'Робота у відкритому повітрі', 'Додавання додаткових модулів за потреби'] }],
      en: { subtitle: 'Industrial energy storage system', description: 'RESS 1000-4180 is a commercial energy storage solution that stores energy from the grid or solar field in battery units using power electronics. It can then be used during high-price hours, to cover peak loads, optimise on-site consumption, provide backup power during outages, or operate off-grid.', specs: [['Inverter power', 'from 1000 kW'], ['Battery capacity', '4180 kWh'], ['Solution type', 'Industrial energy storage system'], ['Integration', 'Solar / grid / generator / hybrid system']], groups: [{ title: 'Core system components', items: ['Power cell', 'Battery units', 'PDU DC/DC conversion module', 'PSC AC/DC conversion module', 'Integrated BESS EMS', 'Liquid cooling system', 'Active fire-suppression system'] }, { title: 'System features', items: ['All-in-one format and scalability', 'Expandable power capacity', 'Outdoor operation', 'Additional modules can be added as needed'] }] }
    },
    'ress-2500-5015': {
      name: 'RESS 2500-5015',
      subtitle: 'Промислова система накопичення електроенергії',
      image: 'assets/img/ress-1000-4180.png',
      description: 'RESS 2500-5015 — це комерційне рішення для накопичення електроенергії з мережі або фотополя в акумуляторних батареях з допомогою силової електроніки для подальшого її використання в години із високою ціною електроенергії, для покриття пікових навантажень, оптимізації власного споживання електроенергії, резервного живлення у разі аварійних відключень, а також для роботи в режимі без електромережі.',
      specs: [['Потужність інверторів', '2500 кВт'], ['Потужність акумуляторних блоків', '5015 кВт·год'], ['Тип рішення', 'Промислова система накопичення енергії'], ['Інтеграція', 'СЕС / мережа / генератор / гібридна система']],
      groups: [{ title: 'Основні складові установки', items: ['Елемент живлення', 'Акумуляторні блоки', 'Перетворюючий модуль PDU DC/DC', 'Перетворюючий модуль PSC AC/DC', 'Вбудована EMS система УЗЕ', 'Система рідинного охолодження', 'Система активного пожежогасіння'] }, { title: 'Особливості системи', items: ['All-in-one формат та масштабованість', 'Можливість розширення потужності', 'Надійна та стабільна робота', 'Підбір конфігурації під потреби об’єкта'] }],
      en: { subtitle: 'Industrial energy storage system', description: 'RESS 2500-5015 is a commercial energy storage solution that stores energy from the grid or solar field in battery units using power electronics. It can then be used during high-price hours, to cover peak loads, optimise on-site consumption, provide backup power during outages, or operate off-grid.', specs: [['Inverter power', '2500 kW'], ['Battery capacity', '5015 kWh'], ['Solution type', 'Industrial energy storage system'], ['Integration', 'Solar / grid / generator / hybrid system']], groups: [{ title: 'Core system components', items: ['Power cell', 'Battery units', 'PDU DC/DC conversion module', 'PSC AC/DC conversion module', 'Integrated BESS EMS', 'Liquid cooling system', 'Active fire-suppression system'] }, { title: 'System features', items: ['All-in-one format and scalability', 'Expandable power capacity', 'Reliable and stable operation', 'Configuration tailored to the site’s needs'] }] }
    }
  };

  const modal = document.querySelector('#uze-modal');
  if (!modal) return;
  const panel = modal.querySelector('.uze-modal__panel');
  const title = modal.querySelector('#uze-modal-title');
  const subtitle = modal.querySelector('.uze-modal__subtitle');
  const image = modal.querySelector('.uze-modal__image');
  const specs = modal.querySelector('.uze-modal__specs dl');
  const description = modal.querySelector('.uze-modal__description');
  const scrollArea = modal.querySelector('.uze-modal__scroll');
  let opener = null;
  let closeTimer = null;
  let activeModelKey = null;

  const chrome = {
    uk: { eyebrow: 'УЗЕ / СИСТЕМА НАКОПИЧЕННЯ ЕНЕРГІЇ', specs: 'Технічні характеристики', cta: 'Консультуватись з нами', close: 'Закрити' },
    en: { eyebrow: 'BESS / ENERGY STORAGE SYSTEM', specs: 'Technical specifications', cta: 'Contact us for advice', close: 'Close' }
  };
  const pageCopy = {
    uk: [
      ['Компактне all-in-one рішення для накопичення електроенергії, резервного живлення, зниження пікових навантажень і роботи із СЕС.', 'Малий та середній бізнес, виробничі приміщення, склади, комерційні об’єкти та локальні критичні навантаження.'],
      ['Комерційне рішення для накопичення електроенергії, оптимізації споживання, покриття пікових навантажень і резервного живлення.', 'Середній та великий бізнес, виробничі підприємства, логістичні комплекси, великі комерційні об’єкти.'],
      ['Комерційна система для накопичення електроенергії, зниження витрат, покриття пікових навантажень і резервного живлення.', 'Великі підприємства, промислові комплекси, агробізнес, об’єкти з тривалим високим енергоспоживанням.'],
      ['Комерційне рішення для накопичення електроенергії з мережі або сонячної станції, зниження витрат, покриття пікових навантажень і резервного живлення.', 'Великі заводи, енергоємні виробництва, промислові підприємства, критична та енергетична інфраструктура.']
    ],
    en: [
      ['Compact all-in-one solution for energy storage, backup power, peak-load reduction and solar integration.', 'Small and medium-sized businesses, manufacturing facilities, warehouses, commercial properties and local critical loads.'],
      ['Commercial solution for energy storage, consumption optimisation, peak-load management and backup power.', 'Medium and large businesses, manufacturing facilities, logistics complexes and major commercial properties.'],
      ['Commercial energy storage system for reducing costs, covering peak loads and providing backup power.', 'Large enterprises, industrial complexes, agribusinesses and sites with sustained high energy demand.'],
      ['Commercial solution for storing energy from the grid or a solar power plant, reducing costs, covering peak loads and providing backup power.', 'Large factories, energy-intensive manufacturers, industrial enterprises, and critical and energy infrastructure.']
    ]
  };
  const tableCopy = {
    uk: [['125 кВт', 'Малий / середній бізнес', 'Резерв живлення, пікові навантаження, інтеграція з СЕС'], ['1125 кВт', 'Середній / великий бізнес', 'Пікові навантаження, оптимізація споживання, резервне живлення'], ['від 1000 кВт', 'Великі підприємства / промислові об’єкти', 'Масштабоване резервне живлення, пікові навантаження'], ['2500 кВт', 'Великі промислові об’єкти / інфраструктура', 'Високі навантаження, оптимізація споживання, резервне живлення']],
    en: [['125 kW', 'Small / medium business', 'Backup power, peak-load management and solar integration'], ['1125 kW', 'Medium / large business', 'Peak-load management, consumption optimisation and backup power'], ['from 1000 kW', 'Large enterprises / industrial sites', 'Scalable backup power and peak-load management'], ['2500 kW', 'Large industrial facilities / infrastructure', 'High loads, consumption optimisation and backup power']]
  };

  function locale() { return window.RaytonI18n && window.RaytonI18n.getLocale() === 'en' ? 'en' : 'uk'; }

  function applyChrome(language) {
    const copy = chrome[language];
    modal.querySelector('.uze-modal__eyebrow').textContent = copy.eyebrow;
    modal.querySelector('#uze-modal-specs-title').textContent = copy.specs;
    modal.querySelector('.uze-modal__cta').firstChild.textContent = copy.cta + ' ';
    modal.querySelector('.uze-modal__close').setAttribute('aria-label', copy.close);
  }

  function applyPageCopy(language) {
    document.querySelectorAll('.model-card').forEach((card, index) => {
      const copy = pageCopy[language][index];
      card.querySelector('.model-card__text').textContent = copy[0];
      card.querySelector('.model-card__note').textContent = copy[1];
    });
    document.querySelectorAll('.compare-table tbody tr').forEach((row, index) => {
      const copy = tableCopy[language][index];
      row.children[1].textContent = copy[0];
      row.children[3].textContent = copy[1];
      row.children[4].textContent = copy[2];
    });
  }

  function render(model) {
    const copy = locale() === 'en' ? model.en : model;
    title.textContent = model.name;
    subtitle.textContent = copy.subtitle;
    image.src = model.image;
    image.alt = model.name;
    specs.innerHTML = copy.specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    description.innerHTML = `<p class="uze-modal__intro">${copy.description}</p>${copy.groups.map(group => `<section class="uze-modal__group"><h3>${group.title}</h3><ul>${group.items.map(item => `<li>${item}</li>`).join('')}</ul></section>`).join('')}`;
  }

  function open(modelKey, button) {
    const model = models[modelKey];
    if (!model) return;
    opener = button;
    activeModelKey = modelKey;
    window.clearTimeout(closeTimer);
    modal.classList.remove('is-closing');
    render(model);
    modal.hidden = false;
    document.body.classList.add('is-uze-modal-open');
    scrollArea.scrollTop = 0;
    panel.focus();
  }

  function close() {
    if (modal.hidden || modal.classList.contains('is-closing')) return;
    modal.classList.add('is-closing');
    closeTimer = window.setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      document.body.classList.remove('is-uze-modal-open');
      if (opener) opener.focus();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-uze-model]');
    if (button) open(button.dataset.uzeModel, button);
    if (event.target.closest('[data-uze-modal-close]')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
  window.addEventListener('rayton:localechange', event => {
    const language = event.detail.locale === 'en' ? 'en' : 'uk';
    applyChrome(language);
    applyPageCopy(language);
    if (!modal.hidden && activeModelKey) render(models[activeModelKey]);
  });
  function applyCurrentLocale() {
    applyChrome(locale());
    applyPageCopy(locale());
    if (!modal.hidden && activeModelKey) render(models[activeModelKey]);
  }
  applyCurrentLocale();
  document.addEventListener('DOMContentLoaded', applyCurrentLocale);
}());
