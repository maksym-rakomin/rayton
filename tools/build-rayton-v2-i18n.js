'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const locales = path.join(root, 'assets/js/locales');
const output = path.join(root, 'wordpress/themes/rayton-v2/assets/i18n/en.json');

function objectAssignedTo(source, variable) {
  const marker = new RegExp(`\\bvar\\s+${variable}\\s*=`).exec(source);
  if (!marker) throw new Error(`Missing ${variable}`);
  const start = source.indexOf('{', marker.index + marker[0].length);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') quote = char;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return vm.runInNewContext(`(${source.slice(start, index + 1)})`);
  }
  throw new Error(`Unclosed object ${variable}`);
}

function read(file) {
  return fs.readFileSync(path.join(locales, file), 'utf8');
}

const business = read('business.js');
const shared = objectAssignedTo(business, 'shared').en;
const calculator = objectAssignedTo(read('calculator.js'), 'copy').en;
const investments = objectAssignedTo(read('investments.js'), 'copy').en;
const company = objectAssignedTo(read('company.js'), 'en');
const financing = objectAssignedTo(read('financing.js'), 'en');
const projects = objectAssignedTo(read('projects.js'), 'en');
const ses = objectAssignedTo(business, 'ses').en;
const uze = objectAssignedTo(business, 'uze').en;
const common = { ...shared, ...calculator, ...investments, ...company, ...financing, ...projects, ...ses, ...uze };
const pages = {
  home: { ...common },
  solutions: { ...common },
  ses: { ...common, ...shared, ...ses },
  'ses-industrial': { ...common },
  'ses-roof': { ...common },
  'ses-consumption': { ...common },
  uze: { ...common, ...shared, ...uze },
  hybrid: { ...common },
  autonomous: { ...common },
  services: { ...common },
  financing: { ...common, ...financing },
  projects: { ...common, ...projects },
  youtube: { ...common },
  about: { ...common, ...investments, ...company },
  contacts: { ...common, ...investments, ...company },
  calculator: { ...common, ...calculator },
  faq: { ...common },
  investments: { ...common, ...investments },
};

const extras = {
  uze: {
    'Компактне all-in-one рішення для накопичення електроенергії, резервного живлення, зниження пікових навантажень і роботи із СЕС.': 'A compact all-in-one solution for energy storage, backup power, peak shaving, and operation with solar.',
    'Малий та середній бізнес, виробничі приміщення, склади, комерційні об’єкти та локальні критичні навантаження.': 'Small and medium businesses, production facilities, warehouses, commercial sites, and local critical loads.',
    'Комерційне рішення для накопичення електроенергії, оптимізації споживання, покриття пікових навантажень і резервного живлення.': 'A commercial energy storage solution for consumption optimisation, peak shaving, and backup power.',
    'Середній та великий бізнес, виробничі підприємства, логістичні комплекси, великі комерційні об’єкти.': 'Medium and large businesses, manufacturing companies, logistics centres, and large commercial sites.',
    'Комерційна система для накопичення електроенергії, зниження витрат, покриття пікових навантажень і резервного живлення.': 'A commercial energy storage system for cost reduction, peak shaving, and backup power.',
    'Великі підприємства, промислові комплекси, агробізнес, об’єкти з тривалим високим енергоспоживанням.': 'Large companies, industrial complexes, agribusinesses, and sites with sustained high energy consumption.',
    'Комерційне рішення для накопичення електроенергії з мережі або сонячної станції, зниження витрат, покриття пікових навантажень і резервного живлення.': 'A commercial solution for storing grid or solar energy, reducing costs, shaving peak loads, and providing backup power.',
    'Великі заводи, енергоємні виробництва, промислові підприємства, критична та енергетична інфраструктура.': 'Large factories, energy-intensive facilities, industrial companies, and critical energy infrastructure.',
    'Резерв живлення, пікові навантаження, інтеграція з СЕС': 'Backup power, peak shaving, solar integration',
    'Середній / великий бізнес': 'Medium / large business',
    'Пікові навантаження, оптимізація споживання, резервне живлення': 'Peak shaving, consumption optimisation, backup power',
    'від 1000 кВт': 'from 1,000 kW',
    'Великі підприємства / промислові об’єкти': 'Large companies / industrial sites',
    'Масштабоване резервне живлення, пікові навантаження': 'Scalable backup power, peak shaving',
    'Великі промислові об’єкти / інфраструктура': 'Large industrial sites / infrastructure',
    'Високі навантаження, оптимізація споживання, резервне живлення': 'High loads, consumption optimisation, backup power',
    'УЗЕ / СИСТЕМА НАКОПИЧЕННЯ ЕНЕРГІЇ': 'BESS / ENERGY STORAGE SYSTEM',
    'Технічні характеристики': 'Technical specifications',
    'Консультуватись з нами': 'Contact us',
  },
  financing: {
    'Європейський лідер у фінансуванні «зелених» проєктів для зменшення постійних витрат та собівартості продукції вашого бізнесу.': 'A European leader in financing green projects that reduce operating and production costs.',
    'Міжнародний банк з індивідуальним підходом до кредитування сонячних рішень із високою рентабельністю та окупністю.': 'An international bank offering tailored financing for profitable solar projects with attractive payback periods.',
    'Стійкі фінансові інструменти для екологізації бізнесу, скорочення викидів CO₂ та легкого виходу на європейські ринки.': 'Sustainable finance for greener operations, lower CO₂ emissions, and easier access to European markets.',
    'Провідний експерт в агросекторі та промисловості, що пропонує вигідні програми енергонезалежності підприємств.': 'A leading agriculture and industry specialist offering competitive business energy-independence programmes.',
    'Швидкі комерційні кредити для бізнесу на будівництво сонячних станцій та УЗЕ для забезпечення повної автономії генерації.': 'Fast commercial loans for solar and BESS projects that support greater energy autonomy.',
    'Державна підтримка та пільгові програми розвитку відновлюваної енергетики для українських підприємств.': 'Government-backed and preferential renewable-energy programmes for Ukrainian businesses.',
    'Зручні цифрові рішення та доступне фінансування СЕС та УЗЕ для оперативного старту генерації чистого прибутку.': 'Convenient digital services and accessible solar and BESS financing for a fast project launch.',
    'Гнучкі умови фінансування енергоефективності для оптимізації виробничих витрат корпоративних клієнтів.': 'Flexible energy-efficiency financing that helps corporate customers optimise production costs.',
    'Технологічні фінансові рішення для швидкого переходу компаній на власні джерела чистої електроенергії.': 'Technology-driven finance that helps companies switch quickly to their own clean electricity generation.',
    'БІЗБАНК': 'BIZBANK',
  },
  investments: {
    'Rayton створює енергетичні активи для інвесторів: сонячні електростанції (СЕС), промислові установки зберігання енергії (УЗЕ) та комплексні рішення СЕС + УЗЕ.': 'Rayton creates energy assets for investors: solar power plants, industrial battery energy storage systems, and integrated solar + BESS solutions.',
    'Ми беремо на себе повний цикл реалізації — від підбору ділянки та фінансової моделі до будівництва, запуску й супроводу проєкту.': 'We deliver the full project cycle, from site selection and financial modelling to construction, commissioning, and ongoing support.',
    'Висока дохідність': 'Strong returns',
    'Проєкти у сфері СЕС, УЗЕ та гібридних систем мають привабливу економіку за правильної конфігурації, підключення та моделі продажу електроенергії.': 'Solar, BESS, and hybrid projects can deliver attractive economics when correctly configured and connected with the right electricity sales model.',
  },
  about: {
    'Майбутнє енергетики: погляд у 2030': 'The future of energy: a view toward 2030',
    '5 хв на читання': '5 min read',
    'Наземна СЕС для агропідприємства': 'Ground-mounted solar for an agricultural business',
    '6 хв на читання': '6 min read',
    'Дахова СЕС на 1,2 МВт: як це працює': 'How a 1.2 MW rooftop solar plant works',
    '4 хв на читання': '4 min read',
    'УЗЕ для складського комплексу': 'BESS for a warehouse complex',
    '7 хв на читання': '7 min read',
    'Гібридна система для виробництва': 'A hybrid system for manufacturing',
    'Енергоаудит: з чого почати': 'Energy audit: where to start',
    '3 хв на читання': '3 min read',
    'Сервіс СЕС: регламент і моніторинг': 'Solar maintenance: procedures and monitoring',
    'Скільки коштує СЕС для бізнесу': 'How much business solar costs',
    '8 хв на читання': '8 min read',
    'Як монтується промислова СЕС': 'How an industrial solar plant is installed',
    'УЗЕ на об’єкті: розпакування та запуск': 'BESS on site: delivery and commissioning',
    'Дахова станція 1,2 МВт — огляд': '1.2 MW rooftop solar plant overview',
    'Rayton Control: як працює моніторинг': 'Rayton Control: how monitoring works',
    'Гібридна система: СЕС + УЗЕ + генератор': 'Hybrid system: solar + BESS + generator',
    'Скільки економить бізнес на СЕС': 'How much businesses save with solar',
    'Стаття': 'Article',
    'Розбираємо, коли система накопичення дійсно окупається, а коли краще почати з СЕС.': 'We explain when battery storage pays off and when it is better to start with solar.',
    'Кейс': 'Case study',
    'Показуємо економіку об’єкта: споживання, потужність станції та фактичну економію.': 'A real project breakdown: consumption, plant capacity, and actual savings.',
    'Коротко про типи інверторів, запас потужності та сумісність із накопичувачем.': 'A quick guide to inverter types, power reserve, and battery compatibility.',
    'СЕС та УЗЕ для енергонезалежності бізнесу в Україні': 'Solar and BESS for business energy independence in Ukraine',
    'Rayton розробляє та впроваджує комплексні енергетичні рішення для українських підприємств: сонячні електростанції для бізнесу, промислові системи накопичення електроенергії, гібридні рішення СЕС + УЗЕ, проєктування, монтаж, запуск і сервісний супровід.': 'Rayton designs and delivers integrated energy solutions for Ukrainian businesses: commercial solar plants, industrial battery storage, hybrid solar + BESS systems, engineering, installation, commissioning, and service.',
    'Ми працюємо з підприємствами, які хочуть зменшити витрати на електроенергію, підвищити стабільність роботи, підготуватись до можливих відключень та зробити енергоспоживання більш прогнозованим. Для кожного об’єкта рішення підбирається індивідуально: з урахуванням споживання, площі даху або території, графіку роботи, критичних навантажень і фінансових цілей бізнесу.': 'We work with companies seeking to reduce electricity costs, improve operational reliability, prepare for outages, and make energy use more predictable. Every solution is tailored to the site’s consumption, available roof or land area, operating schedule, critical loads, and financial goals.',
    'Що входить у рішення Rayton?': 'What does a Rayton solution include?',
    'Енергоаудит об’єкта, технічне рішення та проєкт, підбір і постачання обладнання, монтаж, пусконалагодження, документація, моніторинг і подальший сервіс.': 'Site energy audit, technical design, equipment selection and supply, installation, commissioning, documentation, monitoring, and ongoing service.',
    'Для кого підходять СЕС та УЗЕ?': 'Who are solar and BESS solutions for?',
    'Виробництвам, складським і логістичним комплексам, агропідприємствам, АЗС, торговельним та офісним об’єктам — усім, хто має стабільне денне споживання або критичні навантаження.': 'Manufacturing, warehouses and logistics centres, agriculture, fuel stations, retail, and offices — any business with steady daytime consumption or critical loads.',
  },
};
for (const [page, copy] of Object.entries(extras)) Object.assign(pages[page], copy);

const attributes = {
  'Навігаційний ланцюжок': 'Breadcrumb',
  'Навігаційний ланцюжок сторінки': 'Breadcrumb',
  'Хлібні крихти': 'Breadcrumb',
  'Правова інформація': 'Legal information',
  'Наприклад: 5000': 'For example: 5000',
  'Наприклад: 4.32': 'For example: 4.32',
  'Наприклад: 25000': 'For example: 25000',
  'Схема системи Rayton Control': 'Rayton Control system diagram',
  'СЕС': 'Solar',
  'УЗЕ': 'BESS',
  'Пн–Пт: 9:00 – 18:00': 'Mon–Fri: 9:00–18:00',
};
const commonWithAttributes = { ...common, ...attributes };
for (const page of Object.values(pages)) Object.assign(page, attributes);

const compactPages = {};
for (const [pageName, copy] of Object.entries(pages)) {
  compactPages[pageName] = Object.fromEntries(
    Object.entries(copy).filter(([key, value]) => commonWithAttributes[key] !== value),
  );
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify({ common: commonWithAttributes, pages: compactPages }, null, 2)}\n`);
process.stdout.write(`${path.relative(root, output)}\n`);
