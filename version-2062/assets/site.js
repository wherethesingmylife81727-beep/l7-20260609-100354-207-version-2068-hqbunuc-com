(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function initBackTop() {
    var button = document.querySelector("[data-back-top]");
    if (!button) {
      return;
    }
    window.addEventListener("scroll", function () {
      if (window.scrollY > 360) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
      }
    });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";
        if (!value) {
          event.preventDefault();
          if (input) {
            input.focus();
          }
          return;
        }
        event.preventDefault();
        var target = form.getAttribute("action") || "search.html";
        window.location.href = target + "?q=" + encodeURIComponent(value);
      });
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (item) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[item];
    });
  }

  function initSearchPage() {
    var results = document.getElementById("search-results");
    if (!results || typeof MovieIndex === "undefined") {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.getElementById("search-page-input");
    var heading = document.getElementById("search-heading");
    if (input) {
      input.value = query;
    }
    if (!query) {
      return;
    }
    var keyword = query.toLowerCase();
    var matched = MovieIndex.filter(function (movie) {
      return movie.searchText.toLowerCase().indexOf(keyword) !== -1;
    }).slice(0, 120);
    if (heading) {
      heading.textContent = "搜索结果：“" + query + "”";
    }
    if (!matched.length) {
      results.innerHTML = "<div class='empty-state'>没有找到匹配影片，可尝试更换关键词或浏览分类。</div>";
      return;
    }
    results.innerHTML = matched.map(function (movie) {
      return "<article class='movie-card'>" +
        "<a href='" + movie.url + "' class='card-link'>" +
        "<div class='poster-frame'>" +
        "<img src='" + movie.cover + "' alt='" + escapeHtml(movie.title) + "' loading='lazy'>" +
        "<span class='rating-badge'>★ " + escapeHtml(movie.rating) + "</span>" +
        "<span class='year-badge'>" + escapeHtml(movie.year) + "</span>" +
        "</div>" +
        "<div class='movie-card-body'>" +
        "<h3>" + escapeHtml(movie.title) + "</h3>" +
        "<p class='card-meta'>" + escapeHtml(movie.meta) + "</p>" +
        "<p class='card-desc'>" + escapeHtml(movie.oneLine) + "</p>" +
        "<div class='tag-row'><span>" + escapeHtml(movie.channel) + "</span><span>" + escapeHtml(movie.genre) + "</span></div>" +
        "</div>" +
        "</a>" +
        "</article>";
    }).join("");
  }

  ready(function () {
    initMenu();
    initBackTop();
    initSearchForms();
    initHero();
    initSearchPage();
  });
})();
