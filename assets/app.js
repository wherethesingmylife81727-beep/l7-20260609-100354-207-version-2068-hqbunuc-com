(function () {
  function each(list, callback) {
    Array.prototype.forEach.call(list, callback);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return (root || document).querySelectorAll(selector);
  }

  var mobileToggle = qs('[data-mobile-toggle]');
  var mobilePanel = qs('[data-mobile-panel]');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  each(qsa('[data-search-form]'), function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = qs('input[name="q"]', form);
      var value = input ? input.value.trim() : '';
      var url = './search.html';
      if (value) {
        url += '?q=' + encodeURIComponent(value);
      }
      window.location.href = url;
    });
  });

  var hero = qs('[data-hero]');
  if (hero) {
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      each(slides, function (slide, position) {
        slide.classList.toggle('is-active', position === current);
      });
      each(dots, function (dot, position) {
        dot.classList.toggle('is-active', position === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    each(dots, function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var filterGrid = qs('[data-filter-grid]');
  if (filterGrid) {
    var searchInput = qs('[data-filter-search]');
    var typeSelect = qs('[data-filter-type]');
    var yearSelect = qs('[data-filter-year]');
    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get('q') || '';

    if (searchInput && queryValue) {
      searchInput.value = queryValue;
    }

    function normalize(value) {
      return String(value || '').toLowerCase();
    }

    function filterCards() {
      var query = normalize(searchInput ? searchInput.value : '');
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      each(qsa('.movie-card', filterGrid), function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' '));
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchType = !type || card.getAttribute('data-type') === type;
        var matchYear = !year || card.getAttribute('data-year') === year;
        card.classList.toggle('is-hidden', !(matchQuery && matchType && matchYear));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterCards);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', filterCards);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', filterCards);
    }
    filterCards();
  }
}());

function startMoviePlayer(root, source) {
  if (!root || !source) {
    return;
  }

  var video = root.querySelector('video');
  var button = root.querySelector('.player-overlay');
  var attached = false;
  var hlsInstance = null;

  if (!video) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    attached = true;
  }

  function play() {
    attach();
    if (button) {
      button.classList.add('is-hidden');
    }
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (!attached || video.paused) {
      play();
    }
  });

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  video.addEventListener('emptied', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    attached = false;
  });
}
