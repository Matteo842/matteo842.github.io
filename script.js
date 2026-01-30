// ========================================
// Portfolio: The Architect of Systems
// Main JavaScript - Animations & Interactivity
// ========================================

// ---- Initialize GSAP ----
gsap.registerPlugin(ScrollTrigger);

// ---- ASCII Stars Background Generator ----
function generateHexStream() {
    const container = document.getElementById('hex-stream');
    if (!container) return;

    // Caratteri ASCII casuali - mix di simboli, lettere, numeri
    const asciiChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    // Colori casuali per le "stelle"
    const colors = [
        '#00d4ff',  // cyan
        '#a855f7',  // purple
        '#ec4899',  // pink
        '#22c55e',  // green
        '#f59e0b',  // orange
        '#3b82f6',  // blue
        '#ef4444',  // red
        '#10b981',  // emerald
        '#8b5cf6',  // violet
        '#06b6d4'   // cyan-500
    ];

    // Calcola quante "stelle" creare in base alla dimensione dello schermo
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'ascii-star';

        // Posizione casuale
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Carattere casuale
        star.textContent = asciiChars[Math.floor(Math.random() * asciiChars.length)];

        // Colore casuale
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.color = randomColor;

        // Durata animazione casuale (tra 2 e 6 secondi)
        star.style.animationDuration = `${2 + Math.random() * 4}s`;

        // Delay casuale per non farle partire tutte insieme
        star.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(star);
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

// ---- Sticky Nav Scroll Effect ----
const stickyNav = document.querySelector('.sticky-nav');
if (stickyNav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            stickyNav.classList.add('scrolled');
        } else {
            stickyNav.classList.remove('scrolled');
        }
    });
}

// ---- Mobile Menu Toggle ----
const mobileBtn = document.getElementById('mobile-menu-toggle');
const mobileDropdown = document.getElementById('mobile-dropdown');

if (mobileBtn && mobileDropdown) {
    const toggleMenu = (e) => {
        // Prevent default only for touchstart to avoid ghost clicks,
        // but keep propagation stopped for both.
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        e.stopPropagation();
        mobileDropdown.classList.toggle('active');
    };

    mobileBtn.addEventListener('click', toggleMenu);
    mobileBtn.addEventListener('touchstart', toggleMenu, { passive: false });

    // Close menu when clicking a link
    mobileDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileDropdown.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!mobileDropdown.contains(e.target) && !mobileBtn.contains(e.target)) {
            mobileDropdown.classList.remove('active');
        }
    };

    document.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', closeMenu, { passive: true });
}

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

// ---- Animate Number Counter ----
function animateNumber(element, targetValue, duration = 2000, suffix = '+', prefix = '') {
    const startValue = 0;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);

        // Format with thousands separator
        const formattedValue = currentValue.toLocaleString();
        element.textContent = `${prefix}${formattedValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Ensure final value is exact
            element.textContent = `${prefix}${targetValue.toLocaleString()}${suffix}`;
        }
    }

    requestAnimationFrame(updateNumber);
}

// ---- GitHub Stats Fetcher ----
let statsData = null;
let statsAnimationTriggered = false;

async function fetchGitHubStats() {
    try {
        // Fetch repository data from GitHub API
        const response = await fetch('https://api.github.com/repos/Matteo842/SaveState');

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const data = await response.json();

        // Get stars count
        const stars = data.stargazers_count;

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

            // Store data for later animation
            statsData = {
                downloads: totalDownloads,
                stars: stars
            };

            // Setup ScrollTrigger to animate when card is visible
            setupStatsAnimation();
        }

        console.log('GitHub stats fetched successfully');
    } catch (error) {
        console.warn('Could not fetch GitHub stats:', error);
        // Keep default values if fetch fails
    }
}

function setupStatsAnimation() {
    if (!statsData) return;

    const saveStateCard = document.getElementById('savestate');
    if (!saveStateCard) return;

    // Create ScrollTrigger that fires once when card enters viewport
    ScrollTrigger.create({
        trigger: saveStateCard,
        start: 'top 80%',
        once: true,
        onEnter: () => {
            if (statsAnimationTriggered) return;
            statsAnimationTriggered = true;

            // Animate downloads count in badges
            const downloadsElements = document.querySelectorAll('[data-i18n="savestate_downloads"]');
            downloadsElements.forEach(el => {
                animateNumber(el, statsData.downloads, 2000, '+ Downloads', '');
            });

            // Animate stars count in badges
            const starsElements = document.querySelectorAll('[data-i18n="savestate_stars"]');
            starsElements.forEach(el => {
                animateNumber(el, statsData.stars, 2000, '+ GitHub Stars', '');
            });

            // Animate stats in demo section
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers.length >= 2) {
                animateNumber(statNumbers[0], statsData.downloads, 2000, '+', '');
                animateNumber(statNumbers[1], statsData.stars, 2000, '+', '');
            }
        }
    });
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

        // Detect mobile to reduce explosion radius
        const isMobile = window.innerWidth < 768;
        const scale = isMobile ? 0.4 : 1;

        // Fixed directions for each letter - scaled for mobile
        const directions = [
            { x: -300 * scale, y: -200 * scale, rot: -180 },  // C - top left
            { x: 250 * scale, y: -250 * scale, rot: 120 },    // h - top right  
            { x: -280 * scale, y: 180 * scale, rot: 90 },     // a - bottom left
            { x: 320 * scale, y: 150 * scale, rot: -150 },    // o - right
            { x: 80 * scale, y: 280 * scale, rot: 200 }       // s - bottom
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

        // Mouse drag events
        gameShortcut.addEventListener('dragstart', (e) => {
            gameShortcut.classList.add('dragging');
            e.dataTransfer.setData('text/plain', 'game');
            e.dataTransfer.effectAllowed = 'move';

            // Fix for Chrome: create a custom drag image
            const dragImage = gameShortcut.cloneNode(true);
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, 55, 55);

            // Clean up the temporary element after drag starts
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);
        });

        gameShortcut.addEventListener('dragend', (e) => {
            e.preventDefault();
            gameShortcut.classList.remove('dragging');
            dropZone.classList.remove('drag-over');
        });

        // Make both dropZone and screenshot accept drops
        const dropTargets = [dropZone, screenshot];

        dropTargets.forEach(target => {
            target.addEventListener('dragenter', (e) => {
                if (this.currentState === 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.classList.add('drag-over');
                }
            });

            target.addEventListener('dragover', (e) => {
                if (this.currentState === 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'move';
                }
            });

            target.addEventListener('dragleave', (e) => {
                if (this.currentState === 1) {
                    // Check if we're really leaving (not just entering a child)
                    const rect = target.getBoundingClientRect();
                    if (e.clientX < rect.left || e.clientX >= rect.right ||
                        e.clientY < rect.top || e.clientY >= rect.bottom) {
                        dropZone.classList.remove('drag-over');
                    }
                }
            });

            target.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');

                if (this.currentState === 1) {
                    this.showPopup();
                }
            });
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;
        let clone = null;

        gameShortcut.addEventListener('touchstart', (e) => {
            if (this.currentState !== 1) return;

            isDragging = true;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;

            // Create a visual clone for dragging
            clone = gameShortcut.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.pointerEvents = 'none';
            clone.style.zIndex = '10000';
            clone.style.opacity = '0.8';
            clone.style.transform = 'scale(0.9)';
            clone.style.left = `${touchStartX - 55}px`;
            clone.style.top = `${touchStartY - 55}px`;
            document.body.appendChild(clone);

            gameShortcut.classList.add('dragging');
            e.preventDefault();
        });

        gameShortcut.addEventListener('touchmove', (e) => {
            if (!isDragging || this.currentState !== 1) return;

            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;

            // Move the clone
            if (clone) {
                clone.style.left = `${currentX - 55}px`;
                clone.style.top = `${currentY - 55}px`;
            }

            // Check if over drop zone
            const dropZoneRect = dropZone.getBoundingClientRect();
            const isOverDropZone = (
                currentX >= dropZoneRect.left &&
                currentX <= dropZoneRect.right &&
                currentY >= dropZoneRect.top &&
                currentY <= dropZoneRect.bottom
            );

            if (isOverDropZone) {
                dropZone.classList.add('drag-over');
            } else {
                dropZone.classList.remove('drag-over');
            }

            e.preventDefault();
        });

        const touchEnd = (e) => {
            if (!isDragging || this.currentState !== 1) return;

            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;

            // Remove clone
            if (clone) {
                clone.remove();
                clone = null;
            }

            gameShortcut.classList.remove('dragging');

            // Check if dropped on drop zone
            const dropZoneRect = dropZone.getBoundingClientRect();
            const isOverDropZone = (
                endX >= dropZoneRect.left &&
                endX <= dropZoneRect.right &&
                endY >= dropZoneRect.top &&
                endY <= dropZoneRect.bottom
            );

            dropZone.classList.remove('drag-over');

            if (isOverDropZone) {
                this.showPopup();
            }

            isDragging = false;
        };

        gameShortcut.addEventListener('touchend', touchEnd);
        gameShortcut.addEventListener('touchcancel', touchEnd);
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

        if (!thumb) return;

        // Create iframe with proper parameters
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${start}&rel=0&modestbranding=1&enablejsapi=1`;
        iframe.title = "YouTube video player";
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';

        // Clear thumb content and append iframe
        thumb.innerHTML = '';
        thumb.appendChild(iframe);

        // Add playing class to remove hover effects
        this.classList.add('playing');
    });
}

document.addEventListener('DOMContentLoaded', initVideoPlayer);


// ========================================
// LUNA'S APARTMENT INTERACTIVE DEMO
// ========================================

const LunaDemo = {
    // State: 1 = main page (initial), 2 = booking page, 3 = glitched price, 4 = final (back to main + description)
    currentState: 1,

    // DOM Elements
    elements: {
        screenshot: null,
        bookOverlay: null,
        confirmOverlay: null,
        demoHint: null,
        stage: null,
        descriptionPanel: null
    },

    // Asset paths
    assets: {
        // Desktop assets
        main: 'assets/lunas-apartment.png',
        booking: 'assets/lunas-apartment-booking.png',
        glitched: 'assets/lunas-apartment-gliched.png',

        // Mobile assets
        mainMobile: 'assets/lunas-apartment-mobile.jpg',
        bookingMobile: 'assets/lunas-apartment-mobile-booking.png',
        glitchedMobile: 'assets/lunas-apartment-mobile-gliched.png'
    },

    // Check if mobile
    isMobile() {
        return window.innerWidth <= 900;
    },

    // Get the right asset based on device
    getAsset(type) {
        if (this.isMobile()) {
            return this.assets[type + 'Mobile'] || this.assets[type];
        }
        return this.assets[type];
    },

    init() {
        // Get DOM elements
        this.elements.screenshot = document.getElementById('luna-screenshot');
        this.elements.bookOverlay = document.getElementById('luna-book-overlay');
        this.elements.confirmOverlay = document.getElementById('luna-confirm-overlay');
        this.elements.demoHint = document.getElementById('luna-demo-hint');
        this.elements.stage = document.getElementById('luna-stage');
        this.elements.descriptionPanel = document.getElementById('luna-description-panel');

        // Check if elements exist
        if (!this.elements.screenshot || !this.elements.bookOverlay) {
            console.warn('Luna demo elements not found');
            return;
        }

        // Set initial state class
        if (this.elements.stage) {
            this.elements.stage.classList.add('state-main');
        }

        // Cleanup srcset to prevent conflicts with JS state changes
        this.elements.screenshot.removeAttribute('srcset');

        // Set initial screenshot based on device
        this.elements.screenshot.src = this.getAsset('main');

        this.setupBookButton();
        this.setupConfirmButton();

        // Update screenshot on resize
        window.addEventListener('resize', () => {
            if (this.currentState === 1) {
                this.elements.screenshot.src = this.getAsset('main');
            }
        });
    },

    setupBookButton() {
        const { bookOverlay } = this.elements;

        bookOverlay.addEventListener('click', () => {
            if (this.currentState === 1) {
                this.transitionToBooking();
            }
        });
    },

    setupConfirmButton() {
        const { confirmOverlay } = this.elements;

        confirmOverlay.addEventListener('click', () => {
            if (this.currentState === 3) {
                this.transitionToFinal();
            }
        });
    },

    transitionToBooking() {
        this.currentState = 2;
        const { screenshot, bookOverlay, demoHint, stage } = this.elements;

        // Hide book button
        bookOverlay.classList.add('hidden');

        // Change to booking screenshot with animation
        gsap.to(screenshot, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                // DISABLE TRANSITIONS to prevent visible sliding while fading in
                screenshot.style.transition = 'none';

                // Update state class (move from Low to High position instantly)
                if (stage) {
                    stage.classList.remove('state-main');
                    stage.classList.add('state-booking');
                }

                // Change image
                screenshot.src = this.getAsset('booking');

                // Force Reflow to apply transform instantly
                void screenshot.offsetWidth;

                // Animate Fade In
                gsap.to(screenshot, {
                    opacity: 1,
                    duration: 0.3,
                    onComplete: () => {
                        // After animation, after a delay, restore transitions if needed or prep for glitch
                        setTimeout(() => {
                            screenshot.style.transition = '';
                            this.applyGlitchEffect();
                        }, 1000);
                    }
                });
            }
        });

        // Update hint
        demoHint.innerHTML = '<span class="hint-icon">⚡</span> <span>Watch the price...</span>';
    },

    applyGlitchEffect() {
        this.currentState = 3;
        const { screenshot, demoHint, confirmOverlay, stage } = this.elements;

        // Update state class
        if (stage) {
            stage.classList.remove('state-booking');
            stage.classList.add('state-glitched');
        }

        // Add glitch animation class
        screenshot.classList.add('glitch-active');

        // During glitch, change to glitched screenshot
        setTimeout(() => {
            screenshot.src = this.getAsset('glitched');
        }, 400);

        // Remove glitch class after animation and show confirm button
        setTimeout(() => {
            screenshot.classList.remove('glitch-active');

            // Update hint
            demoHint.innerHTML = '<span class="hint-icon">✨</span> <span>Price hacked! Click "Confirm and Proceed"</span>';

            // Show confirm button
            confirmOverlay.classList.remove('hidden');
        }, 800);
    },

    transitionToFinal() {
        this.currentState = 4;
        const { screenshot, demoHint, descriptionPanel, confirmOverlay, stage } = this.elements;

        // Hide confirm button & hint
        confirmOverlay.classList.add('hidden');
        gsap.to(demoHint, { opacity: 0, duration: 0.3, onComplete: () => { demoHint.style.display = 'none'; } });

        // Fade out current screenshot
        gsap.to(screenshot, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                // 1. Prepare Layout & Content

                // DISABLE TRANSITIONS (Prevent slide from High to Low)
                screenshot.style.transition = 'none';

                // Update state class to main (fixes vertical position instantly)
                if (stage) {
                    stage.classList.remove('state-glitched');
                    stage.classList.add('state-main');
                }

                // Change image source
                screenshot.src = this.getAsset('main');

                // Clear any leftover transforms from previous GSAP animations
                gsap.set(screenshot, { clearProps: "transform,x" });

                // Force Reflow
                void screenshot.offsetWidth;

                // 2. Animate Layout (Right Panel Slide-in) & Fade In Screenshot

                const rightPanel = document.querySelector('.luna-demo-section .right-panel');
                if (rightPanel) {
                    rightPanel.style.display = 'block';
                    descriptionPanel.classList.remove('hidden');

                    const tl = gsap.timeline();

                    // Expand panel width (Push content to left)
                    tl.fromTo(rightPanel,
                        { width: 0, opacity: 0 },
                        { width: 400, opacity: 1, duration: 0.8, ease: 'power2.out' }
                    );

                    // Fade in description content
                    tl.fromTo(descriptionPanel,
                        { opacity: 0, x: 20 },
                        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
                        "-=0.5"
                    );

                    // Fade in screenshot in parallel
                    // Using a small delay to ensure layout expansion has started visually
                    gsap.to(screenshot, {
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.1,
                        ease: 'power2.out',
                        onComplete: () => {
                            screenshot.style.transition = '';
                        }
                    });
                } else {
                    // Fallback
                    gsap.to(screenshot, {
                        opacity: 1,
                        duration: 0.5,
                        onComplete: () => { screenshot.style.transition = ''; }
                    });
                }
            }
        });
    }
};

// Initialize Luna demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LunaDemo.init();
});
