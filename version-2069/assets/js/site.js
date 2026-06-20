(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-menu]");
    var topSearch = document.querySelector(".top-search");

    if (menuButton && menu) {
      menuButton.addEventListener("click", function () {
        menu.classList.toggle("is-open");
        if (topSearch) {
          topSearch.classList.toggle("is-open");
        }
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      }

      function startHero() {
        clearInterval(timer);
        timer = setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
          startHero();
        });
      });

      showSlide(0);
      startHero();
    }

    var params = new URLSearchParams(window.location.search);
    var urlQuery = params.get("q") || "";
    var scopes = document.querySelectorAll("[data-filter-scope]");

    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var yearSelect = scope.querySelector("[data-year-select]");
      var regionSelect = scope.querySelector("[data-region-select]");
      var typeSelect = scope.querySelector("[data-type-select]");
      var grid = document.querySelector("[data-card-grid]");
      var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll("[data-card]")) : [];

      if (input && urlQuery && !input.value) {
        input.value = urlQuery;
      }

      function applyFilter() {
        var text = normalize(input ? input.value : "");
        var year = normalize(yearSelect ? yearSelect.value : "");
        var region = normalize(regionSelect ? regionSelect.value : "");
        var type = normalize(typeSelect ? typeSelect.value : "");

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-tags")
          ].join(" "));
          var okText = !text || haystack.indexOf(text) !== -1;
          var okYear = !year || normalize(card.getAttribute("data-year")) === year;
          var okRegion = !region || normalize(card.getAttribute("data-region")) === region;
          var okType = !type || normalize(card.getAttribute("data-type")) === type;
          card.classList.toggle("is-hidden", !(okText && okYear && okRegion && okType));
        });
      }

      [input, yearSelect, regionSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });

      applyFilter();
    });
  });
})();
