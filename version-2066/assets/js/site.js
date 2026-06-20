(function () {
  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var show = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    };

    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    start();
  }

  var menuButton = document.querySelector('[data-menu-toggle]');
  var menuPanel = document.querySelector('[data-menu-panel]');

  if (menuButton && menuPanel) {
    menuButton.addEventListener('click', function () {
      menuPanel.classList.toggle('is-open');
    });
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterInput && filterList) {
    var filterItems = Array.prototype.slice.call(filterList.children);

    filterInput.addEventListener('input', function () {
      var keyword = filterInput.value.trim().toLowerCase();

      filterItems.forEach(function (item) {
        var text = item.getAttribute('data-search') || item.textContent.toLowerCase();
        item.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  }
})();
