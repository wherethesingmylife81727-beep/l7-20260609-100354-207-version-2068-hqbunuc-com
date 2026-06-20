(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    ready(function () {
        var toggle = document.querySelector('[data-nav-toggle]');
        var mobileNav = document.querySelector('[data-mobile-nav]');

        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                mobileNav.classList.toggle('is-open');
            });
        }

        document.querySelectorAll('img').forEach(function (image) {
            image.addEventListener('error', function () {
                image.classList.add('image-error');
            });
        });

        document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
            var prev = carousel.querySelector('[data-hero-prev]');
            var next = carousel.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, itemIndex) {
                    slide.classList.toggle('is-active', itemIndex === index);
                });
                dots.forEach(function (dot, itemIndex) {
                    dot.classList.toggle('is-active', itemIndex === index);
                });
            }

            function play() {
                clearInterval(timer);
                timer = setInterval(function () {
                    show(index + 1);
                }, 5000);
            }

            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                    play();
                });
            }

            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                    play();
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener('click', function () {
                    show(dotIndex);
                    play();
                });
            });

            show(0);
            play();
        });

        var activeChip = '';

        function runFilter(scope) {
            var input = scope.querySelector('[data-search-input]') || document.querySelector('[data-search-input]');
            var query = normalize(input ? input.value : '');
            var chip = normalize(activeChip);
            var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .category-panel, .category-strip'));

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search') || card.textContent);
                var matchedQuery = !query || text.indexOf(query) !== -1;
                var matchedChip = !chip || text.indexOf(chip) !== -1;
                card.classList.toggle('is-filtered', !(matchedQuery && matchedChip));
            });
        }

        document.querySelectorAll('[data-search-input]').forEach(function (input) {
            input.addEventListener('input', function () {
                runFilter(document);
            });
        });

        document.querySelectorAll('[data-chip]').forEach(function (chip) {
            chip.addEventListener('click', function () {
                var row = chip.closest('[data-chip-row]');
                activeChip = chip.getAttribute('data-chip') || '';
                if (row) {
                    row.querySelectorAll('[data-chip]').forEach(function (item) {
                        item.classList.toggle('is-active', item === chip);
                    });
                }
                runFilter(document);
            });
        });

        document.querySelectorAll('[data-player]').forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('[data-play-button]');
            var hls = null;
            var attached = false;

            function attach() {
                if (!video || attached) {
                    return;
                }
                var source = video.getAttribute('data-src');
                if (!source) {
                    return;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
                attached = true;
            }

            function start() {
                attach();
                if (button) {
                    button.classList.add('is-hidden');
                }
                if (video) {
                    video.controls = true;
                    var result = video.play();
                    if (result && result.catch) {
                        result.catch(function () {});
                    }
                }
            }

            if (button) {
                button.addEventListener('click', start);
            }

            if (video) {
                video.addEventListener('click', function () {
                    if (!attached || video.paused) {
                        start();
                    }
                });
                video.addEventListener('play', function () {
                    if (button) {
                        button.classList.add('is-hidden');
                    }
                });
                video.addEventListener('ended', function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        });
    });
})();
