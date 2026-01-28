// ========================================
// Portfolio: The Architect of Systems
// Main JavaScript - Animations & Interactivity
// ========================================

// ---- Initialize GSAP ----
gsap.registerPlugin(ScrollTrigger);

// ---- Hex Stream Background Generator ----
function generateHexStream() {
    const container = document.getElementById('hex-stream');
    if (!container) return;

    const hexChars = '0123456789ABCDEF';
    const columnCount = Math.floor(window.innerWidth / 25);

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'hex-column';
        column.style.left = `${(i / columnCount) * 100}%`;
        column.style.animationDuration = `${15 + Math.random() * 20}s`;
        column.style.animationDelay = `${-Math.random() * 20}s`;

        // Generate hex content
        let content = '';
        for (let j = 0; j < 100; j++) {
            let line = '';
            for (let k = 0; k < 8; k++) {
                line += hexChars[Math.floor(Math.random() * 16)];
            }
            content += line + '\n';
        }
        column.textContent = content;
        container.appendChild(column);
    }
}

// ---- Custom Context Menu ----
const contextMenu = document.getElementById('context-menu');
let menuVisible = false;

function showContextMenu(x, y) {
    // Adjust position to stay within viewport
    const menuWidth = 180;
    const menuHeight = 120;

    if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
    }

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add('active');
    menuVisible = true;

    // GSAP animation
    gsap.fromTo(contextMenu,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' }
    );
}

function hideContextMenu() {
    if (!menuVisible) return;

    gsap.to(contextMenu, {
        scale: 0.8,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
            contextMenu.classList.remove('active');
            menuVisible = false;
        }
    });
}

// Prevent default context menu and show custom one
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
});

// Hide menu on click outside
document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        hideContextMenu();
    }
});

// Hide menu on scroll
document.addEventListener('scroll', hideContextMenu);

// Language selection from context menu
document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const lang = e.currentTarget.dataset.lang;
        updateLanguage(lang);

        // Update active state
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        hideContextMenu();
    });
});

// ---- Mobile Language Toggle ----
const mobileToggle = document.getElementById('mobile-lang-toggle');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'de' : 'en';
        updateLanguage(newLang);

        // Update context menu active states
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === newLang);
        });

        // Animate toggle
        gsap.fromTo(mobileToggle,
            { scale: 0.9 },
            { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
        );
    });
}

// ---- GSAP Scroll Animations ----
function initScrollAnimations() {
    // Hero content fade in
    gsap.from('.hero-content', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
    });

    // Section fade-in animations
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Staggered card animations
    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Parallax effect on hero background
    gsap.to('.hex-stream', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        ease: 'none'
    });

    // Floating animation for specific elements
    gsap.utils.toArray('.floating').forEach((el, i) => {
        gsap.to(el, {
            y: -15,
            duration: 2 + i * 0.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.2
        });
    });
}

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]:not(#init-profile-btn)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: target, offsetY: 50 },
                ease: 'power2.inOut'
            });
        }
    });
});

// ---- Glitch Effect Enhancement ----
const crownJewel = document.querySelector('.crown-jewel');
if (crownJewel) {
    crownJewel.addEventListener('mouseenter', () => {
        gsap.to(crownJewel, {
            duration: 0.1,
            x: () => Math.random() * 4 - 2,
            y: () => Math.random() * 4 - 2,
            repeat: 5,
            yoyo: true,
            ease: 'none',
            onComplete: () => {
                gsap.set(crownJewel, { x: 0, y: 0 });
            }
        });
    });
}

// ---- Code Background Generator ----
function generateCodeBackground() {
    const codeBg = document.querySelector('.code-bg');
    if (!codeBg) return;

    const codeSnippets = [
        'def extract_save(hdd_image, offset):',
        '    cluster = read_fat_entry(0x00FE)',
        '    data = bytes()',
        '    while cluster != 0xFFFF:',
        '        data += read_cluster(cluster)',
        '        cluster = get_next_cluster(cluster)',
        '    return decompress_xsave(data)',
        '',
        'class FATXParser:',
        '    SECTOR_SIZE = 512',
        '    CLUSTER_SHIFT = 5',
        '    ',
        '    def parse_header(self):',
        '        magic = self.read(4)',
        '        assert magic == b"FATX"',
        '        self.root_cluster = unpack("<I")',
        '',
        '# Orphan cluster recovery',
        'def scan_orphans(fat_table):',
        '    orphans = []',
        '    for i, entry in enumerate(fat_table):',
        '        if entry == 0x0000:',
        '            orphans.append(i)',
        '    return orphans',
    ];

    codeBg.textContent = codeSnippets.join('\n').repeat(8);
}

// ---- GitHub Stats Fetcher ----
async function fetchGitHubStats() {
    try {
        // Fetch repository data from GitHub API
        const response = await fetch('https://api.github.com/repos/Matteo842/SaveState');
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub data');
        }
        
        const data = await response.json();
        
        // Update stars count
        const stars = data.stargazers_count;
        const starsElements = document.querySelectorAll('[data-i18n="savestate_stars"]');
        starsElements.forEach(el => {
            el.textContent = `${stars}+ GitHub Stars`;
        });
        
        // Fetch releases for download count
        const releasesResponse = await fetch('https://api.github.com/repos/Matteo842/SaveState/releases');
        
        if (releasesResponse.ok) {
            const releases = await releasesResponse.json();
            
            // Calculate total downloads from all releases
            let totalDownloads = 0;
            releases.forEach(release => {
                release.assets.forEach(asset => {
                    totalDownloads += asset.download_count;
                });
            });
            
            // Update downloads count
            const downloadsElements = document.querySelectorAll('[data-i18n="savestate_downloads"]');
            downloadsElements.forEach(el => {
                el.textContent = `${totalDownloads.toLocaleString()}+ Downloads`;
            });
            
            // Update stats in demo section
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers.length >= 2) {
                statNumbers[0].textContent = `${totalDownloads.toLocaleString()}+`;
                statNumbers[1].textContent = `${stars}+`;
            }
        }
        
        console.log('GitHub stats updated successfully');
    } catch (error) {
        console.warn('Could not fetch GitHub stats:', error);
        // Keep default values if fetch fails
    }
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    generateHexStream();
    generateCodeBackground();
    initScrollAnimations();

    // Set initial active language in context menu
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang);
    });

    // ---- Chaos Word Handler ----
    initChaosWord();
    
    // ---- Fetch GitHub Stats ----
    fetchGitHubStats();
});

// ---- Chaos Word Effect (Outer Wilds style) ----
const ChaosEffect = {
    letters: [],
    flyAwayTargets: [],
    isExploded: false,
    isReturning: false,
    originalPositions: [],
    flyAwayAnimations: [],

    init() {
        const chaosWord = document.getElementById('chaos-word');
        const initBtn = document.getElementById('init-profile-btn');

        if (!chaosWord || !initBtn) return;

        // Set data-content for glitch effect
        initBtn.setAttribute('data-content', initBtn.innerText.trim());

        this.letters = Array.from(chaosWord.querySelectorAll('.chaos-letter'));

        // Fixed directions for each letter - moderate distances for visible explosion
        const directions = [
            { x: -300, y: -200, rot: -180 },  // C - top left
            { x: 250, y: -250, rot: 120 },    // h - top right  
            { x: -280, y: 180, rot: 90 },     // a - bottom left
            { x: 320, y: 150, rot: -150 },    // o - right
            { x: 80, y: 280, rot: 200 }       // s - bottom
        ];

        this.flyAwayTargets = this.letters.map((_, i) => directions[i] || directions[0]);

        // Store original positions (all at 0,0 since we'll use transforms)
        this.originalPositions = this.letters.map(() => ({ x: 0, y: 0, rot: 0 }));

        // Start flying away after a short delay to ensure page is loaded
        setTimeout(() => this.flyAway(), 500);

        // Button click handler - bring letters back (can be called anytime)
        initBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Allow return even if explosion is still in progress
            if (!this.isReturning) {
                this.returnLetters();
            }
        });
    },

    flyAway() {
        this.isExploded = true;
        this.flyAwayAnimations = [];

        // Animate each letter to fly away and store the animation
        this.letters.forEach((letter, i) => {
            const target = this.flyAwayTargets[i];

            // Create and store the animation so we can kill it later if needed
            const anim = gsap.to(letter, {
                x: target.x,
                y: target.y,
                rotation: target.rot,
                opacity: 0.7,
                duration: 5,
                delay: i * 0.15,
                ease: 'power1.out'
            });

            this.flyAwayAnimations.push(anim);
        });
    },

    returnLetters() {
        const chaosWord = document.getElementById('chaos-word');
        const initBtn = document.getElementById('init-profile-btn');

        // If already resolved, just scroll immediately
        if (chaosWord.classList.contains('resolved')) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: '#projects', offsetY: -20 },
                ease: 'power2.inOut'
            });
            return;
        }

        // Prevent multiple simultaneous returns
        if (this.isReturning) return;
        
        this.isReturning = true;

        // Kill all ongoing fly-away animations
        this.flyAwayAnimations.forEach(anim => {
            if (anim) anim.kill();
        });
        this.flyAwayAnimations = [];

        // Animate letters back to original positions from wherever they are
        this.letters.forEach((letter, i) => {
            gsap.to(letter, {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                delay: i * 0.05,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    // Restore styles
                    letter.style.position = '';
                    letter.style.left = '';
                    letter.style.top = '';
                    letter.style.width = '';
                    letter.style.margin = '';
                    letter.style.zIndex = '';
                    letter.style.transform = '';
                }
            });
        });

        const lettersReturnTime = 900;

        // Sequence: Resolve -> Glitch Button -> Scroll
        setTimeout(() => {
            chaosWord.classList.add('resolved');

            // Activate glitch on button
            if (initBtn) {
                initBtn.classList.add('btn-glitch-active');

                // Wait while glitch plays, then scroll
                setTimeout(() => {
                    initBtn.classList.remove('btn-glitch-active');

                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: { y: '#projects', offsetY: -20 },
                        ease: 'power2.inOut'
                    });
                }, 800);
            }

            this.isExploded = false;
            this.isReturning = false;
        }, lettersReturnTime);
    }
};

function initChaosWord() {
    ChaosEffect.init();
}

// ---- Handle Resize ----
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Regenerate hex stream on resize
        const hexStream = document.getElementById('hex-stream');
        if (hexStream) {
            hexStream.innerHTML = '';
            generateHexStream();
        }

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
    }, 250);
});

// ========================================
// SAVESTATE INTERACTIVE DEMO
// ========================================

const SaveStateDemo = {
    // State: 1 = empty, 2 = popup, 3 = one profile, 4 = final
    currentState: 1,

    // DOM Elements
    elements: {
        screenshot: null,
        dropZone: null,
        gameShortcut: null,
        gameWrapper: null,
        popupOverlay: null,
        popupConfirm: null,
        backupOverlay: null,
        descriptionPanel: null,
        demoHint: null
    },

    // Asset paths
    assets: {
        empty: 'assets/savestate-empty.png',
        oneProfile: 'assets/savestate-one-profile.png',
        full: 'assets/SaveState.png'
    },

    init() {
        // Get DOM elements
        this.elements.screenshot = document.getElementById('app-screenshot');
        this.elements.dropZone = document.getElementById('drop-zone');
        this.elements.gameShortcut = document.getElementById('game-shortcut');
        this.elements.gameWrapper = document.getElementById('game-shortcut-wrapper');
        this.elements.popupOverlay = document.getElementById('game-popup-overlay');
        this.elements.popupConfirm = document.getElementById('popup-confirm');
        this.elements.backupOverlay = document.getElementById('backup-overlay');
        this.elements.descriptionPanel = document.getElementById('description-panel');
        this.elements.demoHint = document.getElementById('demo-hint');

        // Check if elements exist
        if (!this.elements.screenshot || !this.elements.gameShortcut) {
            console.warn('SaveState demo elements not found');
            return;
        }

        this.setupDragAndDrop();
        this.setupPopup();
        this.setupBackupButton();

        // Activate drop zone
        this.elements.dropZone.classList.add('active');
    },

    setupDragAndDrop() {
        const { gameShortcut, dropZone, screenshot } = this.elements;

        // Drag start
        gameShortcut.addEventListener('dragstart', (e) => {
            gameShortcut.classList.add('dragging');
            e.dataTransfer.setData('text/plain', 'game');
            e.dataTransfer.effectAllowed = 'move';
        });

        // Drag end
        gameShortcut.addEventListener('dragend', () => {
            gameShortcut.classList.remove('dragging');
            dropZone.classList.remove('drag-over');
        });

        // Drop zone events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            if (this.currentState === 1) {
                this.showPopup();
            }
        });

        // Also allow dropping on the screenshot itself
        screenshot.addEventListener('dragover', (e) => {
            if (this.currentState === 1) {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            }
        });

        screenshot.addEventListener('drop', (e) => {
            if (this.currentState === 1) {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                this.showPopup();
            }
        });
    },

    setupPopup() {
        const { popupConfirm } = this.elements;

        popupConfirm.addEventListener('click', () => {
            this.hidePopup();
            this.transitionToState3();
        });
    },

    setupBackupButton() {
        const { backupOverlay } = this.elements;

        backupOverlay.addEventListener('click', () => {
            if (this.currentState === 3) {
                this.transitionToState4();
            }
        });
    },

    showPopup() {
        this.currentState = 2;
        const { popupOverlay, gameWrapper, demoHint } = this.elements;

        // Hide game shortcut
        gsap.to(gameWrapper, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            onComplete: () => {
                gameWrapper.classList.add('hidden');
            }
        });

        // Show popup
        popupOverlay.classList.remove('hidden');
        gsap.fromTo(popupOverlay.querySelector('.game-popup'),
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
        );

        // Update hint
        demoHint.innerHTML = '<span class="hint-icon">✓</span> <span>Click OK to continue</span>';
    },

    hidePopup() {
        const { popupOverlay } = this.elements;

        gsap.to(popupOverlay.querySelector('.game-popup'), {
            scale: 0.9,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                popupOverlay.classList.add('hidden');
            }
        });
    },

    transitionToState3() {
        this.currentState = 3;
        const { screenshot, backupOverlay, dropZone, demoHint } = this.elements;

        // Hide drop zone
        dropZone.classList.remove('active');

        // Change screenshot with animation
        gsap.to(screenshot, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                screenshot.src = this.assets.oneProfile;
                gsap.to(screenshot, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });

        // Show backup button overlay with delay
        setTimeout(() => {
            backupOverlay.classList.remove('hidden');

            // Add attention animation
            gsap.fromTo(backupOverlay,
                { scale: 0.9 },
                { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }
            );
        }, 500);

        // Update hint
        demoHint.innerHTML = '<span class="hint-icon">💾</span> <span data-i18n="demo_hint_backup">Click the Backup button</span>';
    },

    transitionToState4() {
        this.currentState = 4;
        const { screenshot, backupOverlay, descriptionPanel, demoHint } = this.elements;

        // Hide backup overlay
        backupOverlay.classList.add('hidden');

        // Flash effect on click
        gsap.to(screenshot, {
            filter: 'brightness(1.5)',
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        // Change to final screenshot
        setTimeout(() => {
            gsap.to(screenshot, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                onComplete: () => {
                    screenshot.src = this.assets.full;
                    gsap.to(screenshot, {
                        opacity: 1,
                        x: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });
        }, 200);

        // Show description panel
        setTimeout(() => {
            descriptionPanel.classList.remove('hidden');
            gsap.fromTo(descriptionPanel,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
            );
        }, 500);

        // Hide hint
        gsap.to(demoHint, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                demoHint.style.display = 'none';
            }
        });
    },

    // Reset demo to initial state
    reset() {
        this.currentState = 1;
        const { screenshot, dropZone, gameWrapper, backupOverlay, descriptionPanel, demoHint } = this.elements;

        // Reset screenshot
        screenshot.src = this.assets.empty;
        gsap.set(screenshot, { opacity: 1, x: 0, filter: 'none' });

        // Show drop zone
        dropZone.classList.add('active');
        dropZone.classList.remove('drag-over');

        // Show game shortcut
        gameWrapper.classList.remove('hidden');
        gsap.set(gameWrapper, { opacity: 1, scale: 1 });

        // Hide backup overlay
        backupOverlay.classList.add('hidden');

        // Hide description
        descriptionPanel.classList.add('hidden');

        // Reset hint
        demoHint.style.display = '';
        demoHint.innerHTML = '<span class="hint-icon">👆</span> <span data-i18n="demo_hint_drag">Drag the game into SaveState</span>';
        gsap.set(demoHint, { opacity: 1 });
    }
};

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SaveStateDemo.init();
});


// ---- Video Player Handler ----
function initVideoPlayer() {
    const trigger = document.getElementById('video-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
        if (this.classList.contains('playing')) return;

        const videoId = this.dataset.videoId;
        const start = this.dataset.start || 0;
        const thumb = this.querySelector('.youtube-thumb');

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${start}&rel=0`;
        iframe.title = "YouTube video player";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;

        // Clear thumb content and append iframe
        thumb.innerHTML = '';
        thumb.appendChild(iframe);

        // Add playing class to remove hover effects
        this.classList.add('playing');
    });
}

document.addEventListener('DOMContentLoaded', initVideoPlayer);
