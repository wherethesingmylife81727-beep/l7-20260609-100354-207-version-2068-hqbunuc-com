(function () {
  window.initializePlayer = function (source) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var button = document.querySelector('[data-player-button]');
    var isAttached = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    var attach = function () {
      if (isAttached) {
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

      isAttached = true;
    };

    var start = function () {
      attach();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var playTask = video.play();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('emptied', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
      isAttached = false;
    });
  };
})();
