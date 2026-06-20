(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startHero() {
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function resetHero() {
      if (timer) {
        window.clearInterval(timer);
      }
      startHero();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var nextIndex = Number(dot.getAttribute('data-hero-dot') || 0);
        showSlide(nextIndex);
        resetHero();
      });
    });

    hero.addEventListener('mouseenter', function () {
      if (timer) {
        window.clearInterval(timer);
      }
    });

    hero.addEventListener('mouseleave', function () {
      resetHero();
    });

    showSlide(0);
    startHero();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  forms.forEach(function (form) {
    var list = form.parentElement;
    while (list && !list.nextElementSibling) {
      list = list.parentElement;
    }

    var scope = document;
    var section = form.closest('main');
    if (section) {
      scope = section;
    }

    var input = form.querySelector('[data-search-input]');
    var yearFilter = form.querySelector('[data-year-filter]');
    var sortSelect = form.querySelector('[data-sort-select]');
    var movieLists = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-list]'));
    var emptyStates = Array.prototype.slice.call(scope.querySelectorAll('[data-empty-state]'));

    function textOf(item) {
      return [
        item.getAttribute('data-title') || '',
        item.getAttribute('data-year') || '',
        item.getAttribute('data-region') || '',
        item.getAttribute('data-genre') || '',
        item.textContent || ''
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var keyword = (input && input.value ? input.value : '').trim().toLowerCase();
      var year = yearFilter && yearFilter.value ? yearFilter.value : '';
      var visibleTotal = 0;

      movieLists.forEach(function (movieList) {
        var items = Array.prototype.slice.call(movieList.querySelectorAll('.movie-item'));
        items.forEach(function (item) {
          var matchKeyword = !keyword || textOf(item).indexOf(keyword) !== -1;
          var matchYear = !year || (item.getAttribute('data-year') || '') === year;
          var visible = matchKeyword && matchYear;
          item.classList.toggle('hidden', !visible);
          if (visible) {
            visibleTotal += 1;
          }
        });
      });

      emptyStates.forEach(function (state) {
        state.style.display = visibleTotal ? 'none' : 'block';
      });
    }

    function sortCards() {
      if (!sortSelect) {
        return;
      }
      var mode = sortSelect.value;
      movieLists.forEach(function (movieList) {
        var items = Array.prototype.slice.call(movieList.querySelectorAll('.movie-item'));
        items.sort(function (left, right) {
          if (mode === 'year-desc') {
            return Number(right.getAttribute('data-year') || 0) - Number(left.getAttribute('data-year') || 0);
          }
          if (mode === 'title-asc') {
            return (left.getAttribute('data-title') || '').localeCompare(right.getAttribute('data-title') || '', 'zh-CN');
          }
          return 0;
        });
        items.forEach(function (item) {
          movieList.appendChild(item);
        });
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      sortCards();
      applyFilter();
    });

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (yearFilter) {
      yearFilter.addEventListener('change', applyFilter);
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        sortCards();
        applyFilter();
      });
    }
  });
})();
