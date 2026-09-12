(function () {
  'use strict';
  var config = window.raytonV2 || {};
  var projects = window.RAYTON_PROJECTS || [];
  var grid = document.querySelector('.projects-grid');
  if (!grid || !projects.length) return;
  var cards = Array.from(grid.querySelectorAll('.project-card'));

  function imageUrl(project) {
    return (config.assetsUrl || '') + '/' + project.image;
  }
  function href(project) {
    return (config.projectsUrl || location.pathname) + '#' + encodeURIComponent(project.id);
  }
  function fillCard(card, project) {
    if (!card || !project) return;
    card.querySelectorAll('a').forEach(function (link) { link.href = href(project); });
    var title = card.querySelector('.project-card__title');
    var image = card.querySelector('img');
    var type = card.querySelector('.project-card__type');
    var tags = card.querySelectorAll('.project-card__specs .tag');
    if (title) title.textContent = project.title;
    if (image) { image.src = imageUrl(project); image.alt = project.title; }
    if (type) type.textContent = project.category;
    if (tags[0]) tags[0].textContent = project.power;
    if (tags[1]) tags[1].textContent = project.region;
  }
  cards.forEach(function (card, index) { fillCard(card, projects[index]); });

  function showDetail() {
    var slug = decodeURIComponent(location.hash.slice(1));
    var project = projects.find(function (item) { return item.id === slug; });
    var oldDetail = document.querySelector('.project-hash-detail');
    if (oldDetail) oldDetail.remove();
    if (!project) return;
    var section = document.createElement('section');
    section.className = 'section project-hash-detail';
    section.innerHTML = '<div class="container"><p class="eyebrow">Реалізований об’єкт</p><h2 class="section-head__title"></h2><div class="hero__tags"><span class="tag"></span><span class="tag"></span><span class="tag"></span></div><figure class="project-cover"><img width="612" height="886"></figure></div>';
    section.querySelector('h2').textContent = project.title;
    var tags = section.querySelectorAll('.tag');
    tags[0].textContent = project.power;
    tags[1].textContent = project.category;
    tags[2].textContent = project.region;
    var image = section.querySelector('img');
    image.src = imageUrl(project);
    image.alt = project.title;
    grid.closest('.section').before(section);
    section.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', showDetail);
  showDetail();
}());
