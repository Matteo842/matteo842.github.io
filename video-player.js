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

    let mousedown = false;
    progressContainer.addEventListener('click', scrub);
    progressContainer.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progressContainer.addEventListener('mousedown', () => mousedown = true);
    progressContainer.addEventListener('mouseup', () => mousedown = false);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Only trigger if we are viewing the video or it's focused, or fullscreen
        // Simple heuristic: if element is in viewport interaction distance
        const rect = container.getBoundingClientRect();
        const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight);
        const isFullscreen = document.fullscreenElement === container;

        // If user is typing in an input, ignore
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Global shortcuts usually annoying, limiting to when player is active/visible
        // But user asked for "Youtube style". 
        // On YouTube, K/J/L work globally? No, usually require focus. 
        // But F usually works if page focused.

        if (e.code === 'Space') {
            // Only if container focused or fullscreen?
            // Or if user intends to play.
            // We'll require player to have been interacted with or be in fullscreen
            // To be safe, we'll implement standard behavior: Space = Toggle Play
            // prevent scroll
            if (isFullscreen || container.matches(':hover') || document.activeElement === container) {
                e.preventDefault();
                togglePlay();
            }
        }

        if (e.code === 'KeyF') {
            // "F" key for fullscreen
            if (isFullscreen || container.matches(':hover') || document.activeElement === container) {
                toggleFullscreen();
            }
        }
    });
});
