(function () {
  'use strict';
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var count = document.querySelector('.pager span');
  var progress = document.querySelector('.progress i');
  var current = 0;
  var scrolling = false;
  var supportsSmooth = 'scrollBehavior' in document.documentElement.style;

  function scrollToPanel(index) {
    var target = panels[Math.max(0, Math.min(panels.length - 1, index))];
    if (!target) return;
    if (supportsSmooth && target.scrollIntoView) {
      try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; } catch (ignore) {}
    }
    window.scrollTo(0, target.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0));
  }
  function update() {
    var viewport = window.innerHeight || document.documentElement.clientHeight;
    var position = window.pageYOffset || document.documentElement.scrollTop || 0;
    var best = 0, distance = Infinity;
    panels.forEach(function (panel, index) {
      var d = Math.abs(panel.getBoundingClientRect().top);
      if (d < distance) { distance = d; best = index; }
    });
    current = best;
    count.innerHTML = '0' + (current + 1) + ' <i>/</i> 05';
    progress.style.width = ((current + 1) / panels.length * 100) + '%';
    scrolling = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrolling) { scrolling = true; window.requestAnimationFrame ? window.requestAnimationFrame(update) : window.setTimeout(update, 50); }
  }, false);
  document.getElementById('next').addEventListener('click', function () { scrollToPanel(current + 1); });
  document.getElementById('prev').addEventListener('click', function () { scrollToPanel(current - 1); });
  document.querySelector('.menu').addEventListener('click', function () {
    document.body.classList.toggle('nav-open');
  });
  Array.prototype.forEach.call(document.querySelectorAll('nav a,.brand'), function (link) {
    link.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
  });
  window.addEventListener('keydown', function (event) {
    var key = event.key || event.keyCode;
    if (key === 'ArrowDown' || key === 'PageDown' || key === 40 || key === 34) { event.preventDefault(); scrollToPanel(current + 1); }
    if (key === 'ArrowUp' || key === 'PageUp' || key === 38 || key === 33) { event.preventDefault(); scrollToPanel(current - 1); }
  }, false);
  update();
}());
