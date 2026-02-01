// ---- ASCII Rain Background Generator (Layered Parallax) for About Page ----
let rainAnimationId; // Store ID to cancel loop on resize
const frontDrops = []; // Store front drop objects

function initAboutRain() {
    const container = document.getElementById('about-rain-container');
    const aboutBox = document.querySelector('.about-container');

    if (!container) return;
    if (rainAnimationId) cancelAnimationFrame(rainAnimationId);

    container.innerHTML = ''; // Clear content
    frontDrops.length = 0; // Clear array

    // Create Layers
    const layers = ['layer-back', 'layer-mid', 'layer-front'];
    const layerElements = {};

    layers.forEach(layerClass => {
        const layer = document.createElement('div');
        layer.className = `rain-layer ${layerClass}`;
        container.appendChild(layer);
        layerElements[layerClass] = layer;
    });

    const asciiChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;

    // --- 1. Generate Back & Mid Layers (CSS Animated) ---
    const cssLayersConfig = {
        'layer-back': {
            density: 8000,
            sizeRange: [8, 14],
            speedRange: [6, 12],
            opacityAdd: 0
        },
        'layer-mid': {
            density: 12000,
            sizeRange: [12, 18],
            speedRange: [4, 7],
            opacityAdd: 0.1
        }
    };

    Object.keys(cssLayersConfig).forEach(layerKey => {
        const settings = cssLayersConfig[layerKey];
        const count = Math.floor(area / settings.density);
        const layerEl = layerElements[layerKey];

        for (let i = 0; i < count; i++) {
            const drop = document.createElement('div');
            drop.className = 'ascii-drop';
            drop.textContent = asciiChars[Math.floor(Math.random() * asciiChars.length)];
            drop.style.color = 'rgba(67, 194, 239, 0.7)'; // Increased opacity for back layers visibility
            drop.style.left = `${Math.random() * 100}%`;

            const size = settings.sizeRange[0] + Math.random() * (settings.sizeRange[1] - settings.sizeRange[0]);
            drop.style.fontSize = `${size}px`;

            const speed = settings.speedRange[0] + Math.random() * (settings.speedRange[1] - settings.speedRange[0]);
            drop.style.animationDuration = `${speed}s`;
            drop.style.animationDelay = `-${Math.random() * speed}s`;
            drop.style.opacity = Math.random() * 0.5 + 0.3 + settings.opacityAdd;

            layerEl.appendChild(drop);
        }
    });

    // --- 2. Generate Front Layer (JS Animated) ---
    const frontSettings = {
        density: 50000, // Reduced density (was 20000)
        sizeRange: [16, 24],
        speedRange: [3, 5] // Roughly pixels per frame? No, we'll map speed to pixels
    };

    const frontCount = Math.floor(area / frontSettings.density);
    const frontLayerEl = layerElements['layer-front'];

    for (let i = 0; i < frontCount; i++) {
        const dropEl = document.createElement('div');
        dropEl.className = 'front-drop';
        dropEl.textContent = asciiChars[Math.floor(Math.random() * asciiChars.length)];
        dropEl.style.color = 'rgba(67, 194, 239, 0.95)'; // Front layer brighter

        const size = frontSettings.sizeRange[0] + Math.random() * (frontSettings.sizeRange[1] - frontSettings.sizeRange[0]);
        dropEl.style.fontSize = `${size}px`;
        dropEl.style.opacity = Math.random() * 0.3 + 0.7;

        frontLayerEl.appendChild(dropEl);

        // Physics properties
        const speedMultiplier = Math.random() * (1.5 - 0.8) + 0.8;
        const speed = (height / 200) * speedMultiplier; // px per frame approx

        frontDrops.push({
            element: dropEl,
            x: Math.random() * width,
            y: Math.random() * height * -1, // Start above viewport
            speed: speed,
            resetY: Math.random() * -500 - 50 // Reset position
        });
    }

    // --- 3. Animation Loop ---
    function animate() {
        if (!aboutBox) {
            // If box not found (e.g. wrong page), just fall
            updateRainNoCollision(height);
        } else {
            // Check collision
            const boxRect = aboutBox.getBoundingClientRect();
            // We only care about the top border area
            // boxRect.top is relative to viewport
            updateRainWithCollision(height, boxRect, frontLayerEl);
        }

        rainAnimationId = requestAnimationFrame(animate);
    }

    animate();
}

function updateRainWithCollision(windowHeight, boxRect, container) {
    const splashThreshold = 10; // Hitbox height at top of box

    frontDrops.forEach(drop => {
        drop.y += drop.speed;

        // Apply Transform
        drop.element.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0)`;

        // Collision Check
        // 1. Check if vertically at the top border of the box
        if (drop.y >= boxRect.top && drop.y <= boxRect.top + drop.speed + splashThreshold) {
            // 2. Check if horizontally within the box
            if (drop.x >= boxRect.left && drop.x <= boxRect.right) {
                // COLLISION!
                createSplash(drop.x, boxRect.top, container);

                // Reset Drop
                drop.y = drop.resetY;
                drop.x = Math.random() * window.innerWidth;
                return; // Next drop
            }
        }

        // Reset if off screen bottom
        if (drop.y > windowHeight) {
            drop.y = drop.resetY;
            drop.x = Math.random() * window.innerWidth;
        }
    });
}

function updateRainNoCollision(windowHeight) {
    frontDrops.forEach(drop => {
        drop.y += drop.speed;
        drop.element.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0)`;
        if (drop.y > windowHeight) {
            drop.y = drop.resetY;
            drop.x = Math.random() * window.innerWidth;
        }
    });
}

function createSplash(x, y, container) {
    const splash = document.createElement('div');
    splash.className = 'rain-splash';
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    container.appendChild(splash);

    // Auto remove after animation
    setTimeout(() => {
        splash.remove();
    }, 400);
}

// Initialize on load and resize
document.addEventListener('DOMContentLoaded', () => {
    initAboutRain();
});

let resizeTimeoutRain;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeoutRain);
    resizeTimeoutRain = setTimeout(() => {
        initAboutRain();
    }, 250);
});
