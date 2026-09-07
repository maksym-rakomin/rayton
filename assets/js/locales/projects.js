/* Page copy shared by the projects catalogue and individual project pages. */
(function () {
  'use strict';

  var ru = {
    'Головна':'Главная','Проєкти':'Проекты','Реальні':'Реальные','об’єкти Rayton':'объекты Rayton',
    'Показуємо реалізовані СЕС та енергетичні рішення для українського бізнесу: потужність, тип об’єкта та результати.':'Показываем реализованные СЭС и энергетические решения для украинского бизнеса: мощность, тип объекта и результаты.',
    'Обговорити свій об’єкт':'Обсудить свой объект','Реалізовані об’єкти':'Реализованные объекты','Проєкти Rayton':'Проекты Rayton','по всій Україні':'по всей Украине',
    'Всі':'Все','Виробництво':'Производство','Агро':'Агро','Склади':'Склады','Харчова промисловість':'Пищевая промышленность',
    'Київська область':'Киевская область','Рівненська область':'Ровненская область','Львівська область':'Львовская область','Інші регіони':'Другие регионы',
    'Детальніше':'Подробнее','Кейс':'Кейс','Промислова СЕС':'Промышленная СЭС','Хочу схожий проєкт':'Хочу похожий проект','Усі проєкти':'Все проекты',
    'Деталі проєкту':'Детали проекта','Як ми':'Как мы','реалізували об’єкт':'реализовали объект','Задача клієнта':'Задача клиента',
    'Зменшити витрати на електроенергію для скловиробного виробництва з високим споживанням.':'Снизить расходы на электроэнергию для стекольного производства с высоким потреблением.',
    'Технічне рішення':'Техническое решение','Проєктування та будівництво мережевої дахової СЕС потужністю 1405 кВт з оптимізацією під графік роботи заводу.':'Проектирование и строительство сетевой крышной СЭС мощностью 1405 кВт с оптимизацией под график работы завода.',
    'Обладнання':'Оборудование','Монокристалічні панелі, стрінгові інвертори, алюмінієві кріплення, система моніторингу.':'Монокристаллические панели, стринговые инверторы, алюминиевые крепления и система мониторинга.',
    'Результат':'Результат','Станція компенсує значну частину денного споживання підприємства та забезпечує щорічну економію.':'Станция компенсирует значительную часть дневного потребления предприятия и обеспечивает ежегодную экономию.',
    'Інші об’єкти':'Другие объекты','Схожі':'Похожие','проєкти Rayton':'проекты Rayton',
    'Розрахуйте свій проєкт вже сьогодні':'Рассчитайте свой проект уже сегодня','Отримайте безкоштовний аналіз енергоспоживання та попередній розрахунок СЕС або системи накопичення енергії для вашого об’єкта.':'Получите бесплатный анализ энергопотребления и предварительный расчёт СЭС или системы накопления энергии для вашего объекта.',
    'Розрахувати проєкт':'Рассчитать проект','Зв’язатися з Rayton':'Связаться с Rayton','2 години — час відповіді':'Ответим в течение 2 часов',
    'Безкоштовний попередній розрахунок':'Бесплатный предварительный расчёт','Персональний інженер-консультант':'Персональный инженер-консультант','Консультація без зобов’язань':'Консультация без обязательств',
    'Інжинірингова компанія з проєктування та впровадження СЕС і УЗЕ для бізнесу в Україні':'Инжиниринговая компания по проектированию и внедрению СЭС и СНЭ для бизнеса в Украине',
    'Рішення':'Решения','Усі рішення':'Все решения','СЕС для бізнесу':'СЭС для бизнеса','Промислові СЕС':'Промышленные СЭС','Дахові СЕС':'Крышные СЭС','СЕС для власного споживання':'СЭС для собственного потребления','УЗЕ':'СНЭ','Гібридні системи':'Гибридные системы','Автономні рішення':'Автономные решения','Сервіс і моніторинг':'Сервис и мониторинг',
    'Для бізнесу':'Для бизнеса','Виробництва':'Производства','Логістичні комплекси':'Логистические комплексы','Агропідприємства':'Агропредприятия','АЗС та автокомплекси':'АЗС и автокомплексы','Торгові центри':'Торговые центры','Офісні будівлі':'Офисные здания','Готелі й ресторани':'Отели и рестораны','Металообробка':'Металлообработка','Дата-центри':'Дата-центры','Комунальні підприємства':'Коммунальные предприятия',
    'Компанія':'Компания','Про нас':'О нас','Послуги':'Услуги','Блог':'Блог','Фінансування':'Финансирование','Калькулятор окупності':'Калькулятор окупаемости','Запитання та відповіді':'Вопросы и ответы','Контакти':'Контакты',
    'Київ, вул. Велика Васильківська, 72':'Киев, ул. Большая Васильковская, 72','Пн-Пт: 9:00 – 18:00':'Пн–Пт: 9:00–18:00','© 2026 Rayton. Усі права захищені':'© 2026 Rayton. Все права защищены','Політика конфіденційності':'Политика конфиденциальности','Умови використання':'Условия использования'
  };
  var en = {
    'Головна':'Home','Проєкти':'Projects','Реальні':'Real','об’єкти Rayton':'Rayton projects',
    'Показуємо реалізовані СЕС та енергетичні рішення для українського бізнесу: потужність, тип об’єкта та результати.':'Explore completed solar and energy projects for Ukrainian businesses, including capacity, project type, and results.',
    'Обговорити свій об’єкт':'Discuss your site','Реалізовані об’єкти':'Completed projects','Проєкти Rayton':'Rayton projects','по всій Україні':'across Ukraine',
    'Всі':'All','Виробництво':'Manufacturing','Агро':'Agriculture','Склади':'Warehouses','Харчова промисловість':'Food production',
    'Київська область':'Kyiv region','Рівненська область':'Rivne region','Львівська область':'Lviv region','Інші регіони':'Other regions',
    'Детальніше':'Learn more','Кейс':'Case study','Промислова СЕС':'Industrial solar','Хочу схожий проєкт':'I want a similar project','Усі проєкти':'All projects',
    'Деталі проєкту':'Project details','Як ми':'How we','реалізували об’єкт':'delivered the project','Задача клієнта':'Client objective',
    'Зменшити витрати на електроенергію для скловиробного виробництва з високим споживанням.':'Reduce electricity costs for an energy-intensive glass manufacturing facility.',
    'Технічне рішення':'Technical solution','Проєктування та будівництво мережевої дахової СЕС потужністю 1405 кВт з оптимізацією під графік роботи заводу.':'Design and construction of a 1,405 kW grid-connected rooftop solar plant, optimised for the factory’s operating schedule.',
    'Обладнання':'Equipment','Монокристалічні панелі, стрінгові інвертори, алюмінієві кріплення, система моніторингу.':'Monocrystalline panels, string inverters, aluminium mounting, and a monitoring system.',
    'Результат':'Result','Станція компенсує значну частину денного споживання підприємства та забезпечує щорічну економію.':'The plant offsets a significant share of the facility’s daytime consumption and delivers annual savings.',
    'Інші об’єкти':'Other projects','Схожі':'Similar','проєкти Rayton':'Rayton projects',
    'Розрахуйте свій проєкт вже сьогодні':'Calculate your project today','Отримайте безкоштовний аналіз енергоспоживання та попередній розрахунок СЕС або системи накопичення енергії для вашого об’єкта.':'Get a free energy-consumption analysis and a preliminary solar or battery storage estimate for your site.',
    'Розрахувати проєкт':'Calculate project','Зв’язатися з Rayton':'Contact Rayton','2 години — час відповіді':'Response within 2 hours',
    'Безкоштовний попередній розрахунок':'Free preliminary estimate','Персональний інженер-консультант':'Dedicated engineering consultant','Консультація без зобов’язань':'No-obligation consultation',
    'Інжинірингова компанія з проєктування та впровадження СЕС і УЗЕ для бізнесу в Україні':'Engineering company designing and delivering solar and battery storage solutions for businesses in Ukraine',
    'Рішення':'Solutions','Усі рішення':'All solutions','СЕС для бізнесу':'Business solar','Промислові СЕС':'Industrial solar','Дахові СЕС':'Rooftop solar','СЕС для власного споживання':'Self-consumption solar','УЗЕ':'BESS','Гібридні системи':'Hybrid systems','Автономні рішення':'Off-grid solutions','Сервіс і моніторинг':'Service and monitoring',
    'Для бізнесу':'For business','Виробництва':'Manufacturing','Логістичні комплекси':'Logistics centres','Агропідприємства':'Agribusiness','АЗС та автокомплекси':'Fuel stations and auto centres','Торгові центри':'Shopping centres','Офісні будівлі':'Office buildings','Готелі й ресторани':'Hotels and restaurants','Металообробка':'Metalworking','Дата-центри':'Data centres','Комунальні підприємства':'Municipal enterprises',
    'Компанія':'Company','Про нас':'About us','Послуги':'Services','Блог':'Blog','Фінансування':'Financing','Калькулятор окупності':'Payback calculator','Запитання та відповіді':'FAQ','Контакти':'Contacts',
    'Київ, вул. Велика Васильківська, 72':'72 Velyka Vasylkivska St, Kyiv','Пн-Пт: 9:00 – 18:00':'Mon–Fri: 9:00–18:00','© 2026 Rayton. Усі права захищені':'© 2026 Rayton. All rights reserved','Політика конфіденційності':'Privacy policy','Умови використання':'Terms of use'
  };

  var copy = { ru: ru, en: en };
  var originals = new WeakMap();
  var roots = [document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);
  function normalise(value) { return value.replace(/\s+/g, ' ').trim(); }
  roots.forEach(function (root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), node;
    while ((node = walker.nextNode())) originals.set(node, node.nodeValue);
  });
  function translate(root, locale) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), node;
    while ((node = walker.nextNode())) {
      var original = originals.get(node);
      if (original == null) continue;
      var value = copy[locale] && copy[locale][normalise(original)];
      var leading = (original.match(/^\s*/) || [''])[0], trailing = (original.match(/\s*$/) || [''])[0];
      node.nodeValue = locale === 'uk' || !value ? original : leading + value + trailing;
    }
  }
  var meta = {
    projects: {
      uk: ['Реалізовані проєкти Rayton — СЕС для бізнесу в Україні','Реалізовані сонячні електростанції та енергетичні рішення Rayton для українського бізнесу: потужність, тип об’єкта, регіон і результати.'],
      ru: ['Реализованные проекты Rayton — СЭС для бизнеса в Украине','Реализованные солнечные электростанции и энергетические решения Rayton для украинского бизнеса: мощность, тип объекта, регион и результаты.'],
      en: ['Completed Rayton projects — business solar in Ukraine','Completed Rayton solar plants and energy solutions for Ukrainian businesses: capacity, project type, region, and results.']
    }
  };
  function apply(locale) {
    locale = copy[locale] ? locale : 'uk';
    roots.forEach(function (root) { translate(root, locale); });
    if (document.body.classList.contains('page--projects')) {
      document.title = meta.projects[locale][0];
      var description = document.querySelector('meta[name="description"]');
      if (description) description.content = meta.projects[locale][1];
    }
  }
  window.RaytonProjectsI18n = { apply: apply, copy: copy };
  window.addEventListener('rayton:localechange', function (event) { apply(event.detail.locale); });
  document.addEventListener('DOMContentLoaded', function () { apply(window.RaytonI18n ? window.RaytonI18n.getLocale() : 'uk'); });
}());
