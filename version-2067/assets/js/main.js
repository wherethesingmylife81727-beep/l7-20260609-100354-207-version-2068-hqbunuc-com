(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupSearchForms() {
    document.querySelectorAll(".site-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var action = form.getAttribute("data-search-action") || "search.html";
        var query = input ? input.value.trim() : "";
        var target = action + (query ? "?q=" + encodeURIComponent(query) : "");
        window.location.href = target;
      });
    });
  }

  function setupMobileMenu() {
    var button = document.querySelector("[data-mobile-menu-button]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-thumb]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("is-active", thumbIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        activate(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("mouseenter", function () {
        activate(Number(thumb.getAttribute("data-hero-thumb")) || 0);
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        activate(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        activate(current + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    activate(0);
    start();
  }

  function setupPageFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    if (!panel) {
      return;
    }
    var keywordInput = panel.querySelector(".js-filter-input");
    var yearSelect = panel.querySelector(".js-year-filter");
    var typeSelect = panel.querySelector(".js-type-filter");
    var countNode = panel.querySelector("[data-visible-count]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var visible = 0;

      cards.forEach(function (card) {
        var search = normalize(card.getAttribute("data-search"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardType = normalize(card.getAttribute("data-type"));
        var matched = true;

        if (keyword && search.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear.indexOf(year) === -1) {
          matched = false;
        }
        if (type && cardType.indexOf(type) === -1) {
          matched = false;
        }

        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = String(visible);
      }
    }

    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  }

  function setupPlayer() {
    document.querySelectorAll("[data-player-shell]").forEach(function (shell) {
      var button = shell.querySelector("[data-video-url]");
      var video = shell.querySelector("video");
      var message = shell.querySelector("[data-player-message]");
      var hlsInstance = null;

      if (!button || !video) {
        return;
      }

      function setMessage(text) {
        if (message) {
          message.textContent = text || "";
        }
      }

      button.addEventListener("click", function () {
        var url = button.getAttribute("data-video-url");
        if (!url) {
          setMessage("当前影片缺少播放地址。");
          return;
        }

        button.classList.add("is-hidden");
        setMessage("正在加载播放源...");

        if (hlsInstance && typeof hlsInstance.destroy === "function") {
          hlsInstance.destroy();
          hlsInstance = null;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage("");
            video.play().catch(function () {
              setMessage("浏览器阻止了自动播放，请再次点击视频播放按钮。");
            });
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              setMessage("播放源加载失败，请稍后重试或更换浏览器。");
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          video.addEventListener("loadedmetadata", function () {
            setMessage("");
            video.play().catch(function () {
              setMessage("浏览器阻止了自动播放，请再次点击视频播放按钮。");
            });
          }, { once: true });
        } else {
          video.src = url;
          setMessage("当前浏览器不支持 HLS，请使用支持 HLS 的浏览器或开启网络访问 hls.js。");
        }
      });
    });
  }

  function setupBackToTop() {
    document.querySelectorAll("[data-back-to-top]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    });
  }

  ready(function () {
    setupSearchForms();
    setupMobileMenu();
    setupHero();
    setupPageFilters();
    setupPlayer();
    setupBackToTop();
  });
})();
