(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = $('.mobile-menu-button');
  var mobilePanel = $('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  var hero = $('.hero');

  if (hero) {
    var slides = $all('.hero-slide', hero);
    var dots = $all('.hero-dot', hero);
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }
  }

  function initPlayer(player) {
    var video = $('video', player);
    var cover = $('.player-cover', player);
    var source = player.getAttribute('data-source');
    var attached = false;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        player._hls = hls;
      } else {
        video.src = source;
      }
    }

    function startPlayback() {
      attachSource();
      if (cover) {
        cover.hidden = true;
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
  }

  $all('.video-player').forEach(initPlayer);

  var searchableGrid = $('.searchable-grid');

  if (searchableGrid) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim().toLowerCase();
    var input = $('input[name="q"]');
    var cards = $all('.movie-card', searchableGrid);
    var title = $('.search-title');
    var empty = $('.empty-state');

    if (input && query) {
      input.value = query;
    }

    function filterCards(value) {
      var term = value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var matched = !term || haystack.indexOf(term) !== -1;
        card.classList.toggle('hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (title) {
        title.textContent = term ? '搜索结果：' + value : '全部影片搜索';
      }

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    filterCards(query);

    if (input) {
      input.addEventListener('input', function () {
        filterCards(input.value);
      });
    }
  }
})();
