(function () {
  var body = document.body;
  var menuButton = document.querySelector('.menu-button');

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      body.classList.toggle('mobile-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]')).forEach(function (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var activeType = '';
    var activeRegion = '';

    function applyFilters() {
      var query = input ? input.value.trim().toLowerCase() : '';

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();

        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesType = !activeType || card.getAttribute('data-type') === activeType;
        var matchesRegion = !activeRegion || card.getAttribute('data-region') === activeRegion;

        card.classList.toggle('hidden', !(matchesQuery && matchesType && matchesRegion));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    Array.prototype.slice.call(panel.querySelectorAll('[data-filter-type]')).forEach(function (button) {
      button.addEventListener('click', function () {
        activeType = button.getAttribute('data-filter-type') || '';
        Array.prototype.slice.call(panel.querySelectorAll('[data-filter-type]')).forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilters();
      });
    });

    Array.prototype.slice.call(panel.querySelectorAll('[data-filter-region]')).forEach(function (button) {
      button.addEventListener('click', function () {
        activeRegion = button.getAttribute('data-filter-region') || '';
        Array.prototype.slice.call(panel.querySelectorAll('[data-filter-region]')).forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilters();
      });
    });

    applyFilters();
  });

  var searchInput = document.getElementById('page-search-input');
  var searchResults = document.getElementById('search-results');
  var searchRecommend = document.getElementById('search-recommend');

  if (searchInput && searchResults && window.SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function renderSearch() {
      var query = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';

      if (!query) {
        if (searchRecommend) {
          searchRecommend.style.display = '';
        }
        return;
      }

      if (searchRecommend) {
        searchRecommend.style.display = 'none';
      }

      var matches = window.SEARCH_INDEX.filter(function (item) {
        return item.text.indexOf(query) !== -1;
      }).slice(0, 80);

      if (!matches.length) {
        searchResults.innerHTML = '<p class="meta-line">没有找到匹配内容</p>';
        return;
      }

      matches.forEach(function (item) {
        var link = document.createElement('a');
        link.className = 'search-item';
        link.href = item.url;
        link.innerHTML = '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '"><div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.meta) + '</p><p>' + escapeHtml(item.line) + '</p></div>';
        searchResults.appendChild(link);
      });
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    searchInput.addEventListener('input', renderSearch);
    renderSearch();
  }
})();
