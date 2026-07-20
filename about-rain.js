// ---- ASCII Rain Background Generator (Layered Parallax) for About Page ----
let rainAnimationId; // Store ID to cancel loop on resize
const frontDrops = []; // Store front drop objects
let lastRainTime = 0;

function initAboutRain() {
    const container = document.getElementById('about-rain-container');
    const aboutBox = document.querySelector('.about-container');

    if (!container) return;
    if (rainAnimationId) cancelAnimationFrame(rainAnimationId);

    container.innerHTML = ''; // Clear content
    frontDrops.length = 0; // Clear array
    lastRainTime = 0;

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
            drop.style.color = 'rgba(67, 194, 239, 0.7)';
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

    // --- 2. Generate Front Layer (JS Animated, frame-rate independent) ---
    // Speed matches the old per-frame formula at 60fps (live Firefox feel),
    // but expressed in px/s so Chrome @144Hz stays the same.
    const frontSettings = {
        density: 50000,
        sizeRange: [16, 24]
    };

    const frontCount = Math.floor(area / frontSettings.density);
    const frontLayerEl = layerElements['layer-front'];

    for (let i = 0; i < frontCount; i++) {
        const dropEl = document.createElement('div');
        dropEl.className = 'front-drop';
        dropEl.textContent = asciiChars[Math.floor(Math.random() * asciiChars.length)];
        dropEl.style.color = 'rgba(67, 194, 239, 0.95)';

        const size = frontSettings.sizeRange[0] + Math.random() * (frontSettings.sizeRange[1] - frontSettings.sizeRange[0]);
        dropEl.style.fontSize = `${size}px`;
        dropEl.style.opacity = Math.random() * 0.3 + 0.7;

        frontLayerEl.appendChild(dropEl);

        const speedMultiplier = 0.8 + Math.random() * 0.7; // 0.8–1.5
        // Old per-frame @ ~60fps → px/s, then ×1.25 toward live Firefox feel
        const speed = (height / 200) * speedMultiplier * 60 * 1.25;

        frontDrops.push({
            element: dropEl,
            x: Math.random() * width,
            y: Math.random() * height * -1,
            speed: speed,
            size: size,
            resetY: Math.random() * -500 - 50
        });
    }

    // --- 3. Animation Loop (delta-time so 60Hz ≈ 144Hz) ---
    function animate(now) {
        if (!lastRainTime) lastRainTime = now;
        // Cap dt so tabbing back in doesn't teleport drops
        const dt = Math.min((now - lastRainTime) / 1000, 0.05);
        lastRainTime = now;

        if (!aboutBox) {
            updateRainNoCollision(height, dt);
        } else {
            const boxRect = aboutBox.getBoundingClientRect();
            updateRainWithCollision(height, boxRect, frontLayerEl, dt);
        }

        rainAnimationId = requestAnimationFrame(animate);
    }

    rainAnimationId = requestAnimationFrame(animate);
}

function updateRainWithCollision(windowHeight, boxRect, container, dt) {
    const roof = boxRect.top;

    frontDrops.forEach(drop => {
        const prevY = drop.y;
        const step = drop.speed * dt;
        drop.y += step;

        // Hit with the glyph bottom (not the transform origin / old -50px offset)
        const glyphBottom = drop.size * 0.85;
        const prevHit = prevY + glyphBottom;
        const hit = drop.y + glyphBottom;

        if (prevHit < roof && hit >= roof
            && drop.x >= boxRect.left && drop.x <= boxRect.right) {
            const snapY = roof - glyphBottom;
            drop.element.style.transform = `translate3d(${drop.x}px, ${snapY}px, 0)`;
            createShatter(drop.x, roof, container, drop);
            drop.y = drop.resetY;
            drop.x = Math.random() * window.innerWidth;
            return;
        }

        drop.element.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0)`;

        if (drop.y > windowHeight) {
            drop.y = drop.resetY;
            drop.x = Math.random() * window.innerWidth;
        }
    });
}

function updateRainNoCollision(windowHeight, dt) {
    frontDrops.forEach(drop => {
        drop.y += drop.speed * dt;
        drop.element.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0)`;
        if (drop.y > windowHeight) {
            drop.y = drop.resetY;
            drop.x = Math.random() * window.innerWidth;
        }
    });
}

const SHARD_CHARS = '!@#$%&*+=<>?/\\|01Xx';

function createShatter(x, y, container, drop) {
    const pieceCount = 2 + Math.floor(Math.random() * 2); // 2 or 3
    const baseSize = drop.size || 16;
    const sourceChar = drop.element.textContent;

    for (let i = 0; i < pieceCount; i++) {
        const shard = document.createElement('div');
        shard.className = 'rain-shard';
        shard.textContent = i === 0
            ? sourceChar
            : SHARD_CHARS[Math.floor(Math.random() * SHARD_CHARS.length)];

        const angle = (-Math.PI * 0.85) + Math.random() * (Math.PI * 0.7);
        const dist = 18 + Math.random() * 36;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 8;
        const rot = (Math.random() * 140 - 70).toFixed(0) + 'deg';
        const size = Math.max(8, baseSize * (0.45 + Math.random() * 0.35));

        shard.style.left = `${x}px`;
        shard.style.top = `${y}px`;
        shard.style.fontSize = `${size}px`;
        shard.style.setProperty('--dx', `${dx.toFixed(1)}px`);
        shard.style.setProperty('--dy', `${dy.toFixed(1)}px`);
        shard.style.setProperty('--rot', rot);
        shard.style.setProperty('--dur', `${0.35 + Math.random() * 0.2}s`);

        container.appendChild(shard);
        shard.addEventListener('animationend', () => shard.remove(), { once: true });
    }
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
