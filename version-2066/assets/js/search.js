(function () {
  var params = new URLSearchParams(window.location.search);
  var keyword = (params.get('q') || '').trim();
  var input = document.getElementById('searchPageInput');
  var results = document.getElementById('searchResults');
  var title = document.getElementById('searchResultTitle');

  if (!results || !title || !Array.isArray(SEARCH_ITEMS)) {
    return;
  }

  if (input) {
    input.value = keyword;
  }

  var escapeHtml = function (value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  var renderCard = function (item) {
    var tags = (item.tags || []).slice(0, 2).map(function (tag) {
      return '<span class="tag-pill">' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card movie-card-medium">' +
        '<a class="movie-card-link" href="' + escapeHtml(item.url) + '">' +
          '<div class="movie-cover">' +
            '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
            '<div class="movie-cover-shade"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>' +
          '</div>' +
          '<div class="movie-card-body">' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p>' + escapeHtml(item.summary) + '</p>' +
            '<div class="movie-card-meta"><span class="type-pill">' + escapeHtml(item.type) + '</span><span class="genre-text">' + escapeHtml(item.genre) + '</span></div>' +
            '<div class="movie-card-tags">' + tags + '</div>' +
          '</div>' +
        '</a>' +
      '</article>';
  };

  var normalized = keyword.toLowerCase();
  var matched = SEARCH_ITEMS.filter(function (item) {
    if (!normalized) {
      return true;
    }

    return item.search.indexOf(normalized) !== -1;
  }).slice(0, 120);

  title.textContent = keyword ? '搜索结果：' + keyword : '推荐内容';
  results.innerHTML = matched.map(renderCard).join('');
})();
