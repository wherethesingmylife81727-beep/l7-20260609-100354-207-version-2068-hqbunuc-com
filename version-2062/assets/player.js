function initMoviePlayer(source) {
  var video = document.getElementById("movie-player");
  var overlay = document.getElementById("play-overlay");
  var started = false;

  function attachSource() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }
    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }
    video.src = source;
  }

  function start() {
    if (!started) {
      attachSource();
      started = true;
    }
    if (overlay) {
      overlay.classList.add("hidden");
    }
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", start);
  }
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
}
