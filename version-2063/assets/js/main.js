(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var empty = scope.querySelector('[data-no-result]');

        if (!input || !cards.length) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
            input.value = initialQuery;
        }

        function filter() {
            var query = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year'),
                    card.textContent
                ].join(' ').toLowerCase();
                var matched = !query || haystack.indexOf(query) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        input.addEventListener('input', filter);
        filter();
    });

    function loadHls(callback) {
        if (window.Hls) {
            callback();
            return;
        }
        var existing = document.querySelector('script[data-hls-loader]');
        if (existing) {
            existing.addEventListener('load', callback, { once: true });
            return;
        }
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
        script.defer = true;
        script.setAttribute('data-hls-loader', 'true');
        script.addEventListener('load', callback, { once: true });
        document.head.appendChild(script);
    }

    function initPlayer(player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var message = player.querySelector('[data-player-message]');
        var source = player.getAttribute('data-video-src');
        var hlsInstance = null;

        if (!video || !button) {
            return;
        }

        function setMessage(text) {
            if (message) {
                message.textContent = text || '';
            }
        }

        function playNative() {
            video.src = source;
            video.play().then(function () {
                player.classList.add('is-playing');
                setMessage('');
            }).catch(function () {
                setMessage('请再次点击播放');
            });
        }

        function playWithHls() {
            if (!window.Hls || !window.Hls.isSupported()) {
                playNative();
                return;
            }
            if (hlsInstance) {
                hlsInstance.destroy();
            }
            hlsInstance = new window.Hls({
                maxBufferLength: 30,
                enableWorker: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().then(function () {
                    player.classList.add('is-playing');
                    setMessage('');
                }).catch(function () {
                    setMessage('请再次点击播放');
                });
            });
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setMessage('播放源暂时无法加载');
                }
            });
        }

        function startPlayback() {
            if (!source) {
                setMessage('播放源暂时无法加载');
                return;
            }
            setMessage('正在加载播放源');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                playNative();
            } else {
                loadHls(playWithHls);
            }
        }

        button.addEventListener('click', startPlayback);
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener('play', function () {
            player.classList.add('is-playing');
        });
    }

    document.querySelectorAll('[data-player]').forEach(initPlayer);
})();
