(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return [
      '<article class="movie-card">',
      '  <a class="poster-frame" href="' + escapeHtml(movie.href) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-type">' + escapeHtml(movie.type) + '</span>',
      '    <span class="poster-play">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h3><a href="' + escapeHtml(movie.href) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join("
");
  }

  function searchMovies(query) {
    var keyword = normalize(query);
    if (!keyword) {
      return [];
    }
    return MOVIE_DATA.filter(function (movie) {
      var blob = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        (movie.tags || []).join(" "),
        movie.oneLine
      ].join(" ");
      return normalize(blob).indexOf(keyword) !== -1;
    });
  }

  function render(query) {
    var input = document.querySelector("[data-search-page-form] input");
    var resultsNode = document.getElementById("search-results");
    var summary = document.querySelector("[data-search-summary]");

    if (input) {
      input.value = query;
    }

    if (!resultsNode || !summary) {
      return;
    }

    if (!query) {
      summary.textContent = "请输入关键词开始搜索。";
      resultsNode.innerHTML = "";
      return;
    }

    var results = searchMovies(query);
    summary.textContent = "关键词“" + query + "”共找到 " + results.length + " 部影片。";
    resultsNode.innerHTML = results.slice(0, 240).map(movieCard).join("
");

    if (results.length > 240) {
      summary.textContent += " 当前显示前 240 部，可继续输入更精确关键词。";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-search-page-form]");
    var query = getQuery();

    render(query);

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var nextQuery = input ? input.value.trim() : "";
        var url = nextQuery ? "search.html?q=" + encodeURIComponent(nextQuery) : "search.html";
        window.history.pushState({}, "", url);
        render(nextQuery);
      });
    }
  });
})();
