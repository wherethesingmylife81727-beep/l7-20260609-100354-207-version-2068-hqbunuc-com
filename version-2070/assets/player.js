function initVideoPlayer(streamUrl) {
  var video = document.getElementById('movie-video');
  var shell = document.querySelector('.video-shell');
  var overlay = document.querySelector('.player-overlay');
  var prepared = false;
  var hlsInstance = null;

  if (!video || !shell || !overlay || !streamUrl) {
    return;
  }

  function attachStream() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function startPlayback() {
    attachStream();
    shell.classList.add('playing');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        shell.classList.remove('playing');
      });
    }
  }

  overlay.addEventListener('click', startPlayback);
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });
  video.addEventListener('play', function () {
    shell.classList.add('playing');
  });
  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      shell.classList.remove('playing');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
