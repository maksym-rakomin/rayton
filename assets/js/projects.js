/* Catalogue filters and project routing. Run before main.js plans reveals. */
(function () {
  'use strict';
  var projects = window.RAYTON_PROJECTS || [];
  var grid = document.querySelector('.projects-grid');
  if (!grid || !projects.length) return;
  var detail = document.body.classList.contains('page--project');
  var translations = window.RAYTON_PROJECT_TRANSLATIONS || {};
  function locale() { return window.RaytonI18n ? window.RaytonI18n.getLocale() : 'uk'; }
  function localise(project, field) {
    var language = locale();
    if (language === 'uk' || !translations[language]) return project[field];
    if (field === 'title') return translations[language].categories[project.category] || project.title;
    var group = field === 'category' ? 'categories' : 'regions';
    return translations[language][group][project[field]] || project[field];
  }
  function ui(uk, ru, en) { return locale() === 'ru' ? ru : locale() === 'en' ? en : uk; }
  function power(project) { return locale() === 'en' ? project.power.replace('кВт', 'kW') : project.power; }
  // Rebuild all data-driven labels from their Ukrainian source after a language change.
  // The selected locale is persisted by i18n.js before the reload.
  window.addEventListener('rayton:localechange', function (event) {
    var url = new URL(location.href);
    url.searchParams.set('lang', event.detail.locale);
    location.replace(url.href);
  });
  function href(project) { return 'project.html?id=' + encodeURIComponent(project.id); }
  function fillCard(card, project) {
    card.querySelectorAll('a').forEach(function (a) { a.href = href(project); });
    card.querySelector('.project-card__title').textContent = localise(project, 'title');
    var img = card.querySelector('img');
    img.src = project.image; img.alt = localise(project, 'title');
    card.querySelector('.project-card__type').textContent = localise(project, 'category');
    var tags = card.querySelectorAll('.project-card__specs .tag');
    tags[0].textContent = power(project); tags[1].textContent = localise(project, 'region');
  }
  if (detail) {
    var id = new URLSearchParams(location.search).get('id');
    var project = id ? projects.find(function (p) { return p.id === id; }) : projects[0];
    if (!project) {
      document.querySelector('.hero__title').textContent = ui('Проєкт не знайдено', 'Проект не найден', 'Project not found');
      document.querySelector('.hero__lead').textContent = ui('Перейдіть до каталогу, щоб обрати реалізований об’єкт.', 'Перейдите в каталог, чтобы выбрать реализованный объект.', 'Open the catalogue to choose a completed project.');
      document.querySelector('.breadcrumbs [aria-current]').textContent = document.querySelector('.hero__title').textContent;
      document.querySelector('.hero__tags').hidden = true;
      document.querySelector('main > .section').hidden = true;
      document.title = ui('Проєкт не знайдено — Rayton', 'Проект не найден — Rayton', 'Project not found — Rayton');
    } else {
      var title = localise(project, 'title');
      document.title = title + ui(' — проєкт Rayton', ' — проект Rayton', ' — Rayton project');
      document.querySelector('.hero__title').textContent = title;
      document.querySelector('.breadcrumbs [aria-current]').textContent = title;
      var lead = ui('Сонячна електростанція потужністю ', 'Солнечная электростанция мощностью ', 'Solar power plant with a capacity of ') + power(project) + '. ' + localise(project, 'category') + ' · ' + localise(project, 'region') + '.';
      document.querySelector('.hero__lead').textContent = lead;
      document.querySelector('meta[name="description"]').content = title + '. ' + lead;
      var tags = document.querySelectorAll('.hero__tags .tag');
      [power(project), localise(project, 'category'), localise(project, 'region')].forEach(function (text, i) { tags[i].textContent = text; });
      // Only the original case has an engineering description in the source.
      if (project !== projects[0]) {
        var section = document.querySelector('main > .section');
        section.querySelector('.section-head__title').textContent = ui('Про реалізований об’єкт', 'О реализованном объекте', 'About this project');
        var items = section.querySelectorAll('.grid > li');
        [[ui('Потужність станції','Мощность станции','Plant capacity'), power(project)], [ui('Тип об’єкта','Тип объекта','Project type'), localise(project, 'category')], [ui('Регіон','Регион','Region'), localise(project, 'region')]].forEach(function (pair, i) {
          items[i].querySelector('h3').textContent = pair[0];
          items[i].querySelector('p').textContent = pair[1];
        });
        items[3].remove();
      }
      var figure = document.createElement('figure');
      figure.className = 'project-cover';
      var img = document.createElement('img');
      img.src = project.image; img.alt = title; img.width = 612; img.height = 886;
      figure.appendChild(img);
      document.querySelector('main > .section .container').prepend(figure);
    }
    var related = projects.filter(function (p) { return p !== project; }).slice(0, 4);
    grid.querySelectorAll('.project-card').forEach(function (card, i) { fillCard(card, related[i]); });
    return;
  }
  var cards = Array.from(grid.children);
  cards.forEach(function (li, i) { fillCard(li, projects[i]); });
  var groups = Array.from(document.querySelectorAll('.project-filters'));
  var selected = ['', ''];
  var status = document.querySelector('.projects-status');
  groups.forEach(function (group, index) {
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', index ? ui('Регіон проєкту','Регион проекта','Project region') : ui('Тип об’єкта','Тип объекта','Project type'));
    if (index) {
      var all = document.createElement('button');
      all.type = 'button'; all.className = 'tabs__btn is-active'; all.textContent = ui('Всі регіони','Все регионы','All regions');
      group.prepend(all);
    }
    var buttons = Array.from(group.querySelectorAll('button'));
    buttons.forEach(function (button, i) {
      button.setAttribute('aria-pressed', String(i === 0));
      button.addEventListener('click', function () {
        selected[index] = i ? (index ? projects.find(function(p){return localise(p,'region')===button.textContent.trim();})?.region : projects.find(function(p){return localise(p,'category')===button.textContent.trim();})?.category) || '' : '';
        buttons.forEach(function (b) { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
        var count = 0;
        cards.forEach(function (li, n) {
          var p = projects[n];
          var show = (!selected[0] || p.category === selected[0]) && (!selected[1] || p.region === selected[1]);
          li.hidden = !show;
          if (show) {
            count++;
            // A filtered item may still be pending in the scroll observer.
            li.classList.add('is-in', 'is-done');
          }
        });
        status.textContent = count ? ui('Знайдено проєктів: ','Найдено проектов: ','Projects found: ') + count : ui('За цими фільтрами проєктів немає. Оберіть інший тип або всі регіони.','По этим фильтрам проектов нет. Выберите другой тип или все регионы.','No projects match these filters. Choose another type or all regions.');
      });
    });
  });
}());
