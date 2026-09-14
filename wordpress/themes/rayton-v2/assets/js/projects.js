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
  function fillCard(card, project) {
    if (!card || !project) return;
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
}());
