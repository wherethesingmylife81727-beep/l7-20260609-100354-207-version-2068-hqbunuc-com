function setupMoviePlayer(videoId, streamUrl) {
  var video = document.getElementById(videoId);
  var trigger = document.querySelector("[data-play-trigger]");
  var attached = false;
  var hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function attachStream() {
    if (attached) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    attached = true;
  }

  function beginPlay() {
    attachStream();
    video.controls = true;
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener("click", beginPlay);
  }

  video.addEventListener("click", function () {
    if (!attached) {
      beginPlay();
    }
  });

  video.addEventListener("play", function () {
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
