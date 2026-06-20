(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));

  function attachStream(video) {
    if (video.dataset.ready === '1') {
      return;
    }

    var stream = video.getAttribute('data-stream');
    if (!stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    video.dataset.ready = '1';
  }

  players.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');

    if (!video || !button) {
      return;
    }

    function start() {
      attachStream(video);
      shell.classList.add('is-playing');
      video.controls = true;
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
  });
})();
