document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.video-container');
    if (!container) return; // Guard clause if section not present

    const video = container.querySelector('.video-player');
    const playBtn = container.querySelector('.toggle-play');
    const playOverlay = container.querySelector('.play-overlay');
    const progressBar = container.querySelector('.progress-bar');
    const progressContainer = container.querySelector('.progress-container');
    const timeDisplay = container.querySelector('.time-display');
    const fullscreenBtn = container.querySelector('.toggle-fullscreen');

    // Initial State
    container.classList.remove('playing');
    container.classList.add('paused');

    // Functions
    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function updatePlayButton() {
        if (video.paused) {
            container.classList.add('paused');
            container.classList.remove('playing');
            playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; // Play Icon
        } else {
            container.classList.remove('paused');
            container.classList.add('playing');
            playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; // Pause Icon
        }
    }

    function handleProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;

        // Time Display
        const currentMins = Math.floor(video.currentTime / 60);
        const currentSecs = Math.floor(video.currentTime % 60);
        const totalMins = Math.floor(video.duration / 60) || 0;
        const totalSecs = Math.floor(video.duration % 60) || 0;

        timeDisplay.textContent = `${currentMins}:${currentSecs < 10 ? '0' : ''}${currentSecs} / ${totalMins}:${totalSecs < 10 ? '0' : ''}${totalSecs}`;
    }

    function scrub(e) {
        const scrubTime = (e.offsetX / progressContainer.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Event Listeners
    video.addEventListener('click', togglePlay);
    video.addEventListener('play', updatePlayButton);
    video.addEventListener('pause', updatePlayButton);
    video.addEventListener('timeupdate', handleProgress);

    playBtn.addEventListener('click', togglePlay);
    playOverlay.addEventListener('click', togglePlay); // Allow clicking the big button

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Double click to toggle fullscreen (Desktop)
    container.addEventListener('dblclick', toggleFullscreen);

    let mousedown = false;
    progressContainer.addEventListener('click', scrub);
    progressContainer.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progressContainer.addEventListener('mousedown', () => mousedown = true);
    progressContainer.addEventListener('mouseup', () => mousedown = false);

    // Mobile Swipe to Seek
    let touchStartX = 0;
    let initialVideoTime = 0;
    let isSwiping = false;

    container.addEventListener('touchstart', (e) => {
        // Ignore if touching controls
        if (e.target.closest('.video-controls')) return;

        touchStartX = e.touches[0].clientX;
        initialVideoTime = video.currentTime;
        isSwiping = true;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        const touchCurrentX = e.touches[0].clientX;
        const deltaX = touchCurrentX - touchStartX;

        // Threshold to start seeking (prevent accidental touches)
        if (Math.abs(deltaX) > 10) {
            // Seek sensitivity: 1px = 0.5s or similar?
            // Let's make it proportional to width but scalable.
            // Say full width = 60 seconds seek range?
            const containerWidth = container.offsetWidth;
            const seekPercent = deltaX / containerWidth;
            const seekTime = seekPercent * 60; // +/- 30 seconds max per swipe stroke usually

            video.currentTime = Math.max(0, Math.min(video.duration, initialVideoTime + seekTime));

            // Prevent scrolling if we are swiping horizontally?
            // "passive: false" is needed on touchstart to preventDefault here, 
            // but we used passive: true above. 
            // If user wants standard behavior (prevent scroll), we should prevent default.
            if (e.cancelable) e.preventDefault();
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        isSwiping = false;
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const isFullscreen = document.fullscreenElement === container;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
            if (isFullscreen || container.matches(':hover') || document.activeElement === container) {
                e.preventDefault();
                togglePlay();
            }
        }

        if (e.code === 'ArrowRight') {
            if (isFullscreen || container.matches(':hover') || document.activeElement === container) {
                e.preventDefault();
                video.currentTime += 5;
            }
        }

        if (e.code === 'ArrowLeft') {
            if (isFullscreen || container.matches(':hover') || document.activeElement === container) {
                e.preventDefault();
                video.currentTime -= 5;
            }
        }

        if (e.code === 'KeyF') {
            if (isFullscreen || container.matches(':hover') || document.activeElement === container) {
                toggleFullscreen();
            }
        }
    });

    // XTool Title Animation
    const title = document.querySelector('.xtool-title');
    if (title) {
        let originalText = title.textContent.trim() || "XEMU TOOLS PROJECT";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let revealInterval = null;
        let idleInterval = null;
        let isRevealed = false;

        function setRandomText() {
            if (isRevealed) return;
            title.innerText = originalText
                .split("")
                .map((char) => {
                    if (char === " ") return " ";
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
        }

        // Start idle continuous scrambling
        // Run every 80ms for a "matrix-like" flux feel
        idleInterval = setInterval(setRandomText, 80);

        function revealText() {
            if (isRevealed) return;
            isRevealed = true;
            let iteration = 0;

            // Stop the idle scrambling immediately
            clearInterval(idleInterval);
            clearInterval(revealInterval);

            revealInterval = setInterval(() => {
                title.innerText = originalText
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (originalText[index] === " ") return " ";
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(revealInterval);
                    title.classList.add('revealed');
                }

                // Slower reveal: decreased from 1/3 to 1/8
                iteration += 1 / 8;
            }, 30);
        }

        video.addEventListener('play', revealText);
        playBtn.addEventListener('click', revealText);
        playOverlay.addEventListener('click', revealText);
    }
});
