// ---- ASCII Rain Background Generator (Layered Parallax) for About Page ----
function initAboutRain() {
    const container = document.getElementById('about-rain-container');
    if (!container) return;

    container.innerHTML = ''; // Clear content

    // Create Layers
    const layers = ['layer-back', 'layer-mid', 'layer-front'];
    const layerElements = {};

    layers.forEach(layerClass => {
        const layer = document.createElement('div');
        layer.className = `rain-layer ${layerClass}`;
        container.appendChild(layer);
        layerElements[layerClass] = layer;
    });

    // Configuration for each layer
    const config = {
        'layer-back': {
            density: 8000, // Higher number = fewer drops (divisor)
            sizeRange: [8, 14], // px
            speedRange: [6, 12], // seconds (Slower)
            opacityAdd: 0 // CSS handles base opacity
        },
        'layer-mid': {
            density: 12000,
            sizeRange: [12, 18],
            speedRange: [4, 7], // Medium
            opacityAdd: 0.1
        },
        'layer-front': {
            density: 20000,
            sizeRange: [16, 24],
            speedRange: [2, 4], // Faster
            opacityAdd: 0.2
        }
    };

    const asciiChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const colors = [
        '#00d4ff', '#a855f7', '#ec4899', '#22c55e', '#f59e0b',
        '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4'
    ];

    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;

    // Generate Drops for each layer
    layers.forEach(layerClass => {
        const settings = config[layerClass];
        const dropCount = Math.floor(area / settings.density);
        const layerEl = layerElements[layerClass];

        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'ascii-drop';

            // Random Content & color
            drop.textContent = asciiChars[Math.floor(Math.random() * asciiChars.length)];
            drop.style.color = colors[Math.floor(Math.random() * colors.length)];

            // Position
            drop.style.left = `${Math.random() * 100}%`;

            // Size
            const size = settings.sizeRange[0] + Math.random() * (settings.sizeRange[1] - settings.sizeRange[0]);
            drop.style.fontSize = `${size}px`;

            // Speed
            const speed = settings.speedRange[0] + Math.random() * (settings.speedRange[1] - settings.speedRange[0]);
            drop.style.animationDuration = `${speed}s`;

            // Delay (Negative to start mid-animation)
            drop.style.animationDelay = `-${Math.random() * speed}s`;

            // Slight opacity variation within layer
            drop.style.opacity = Math.random() * 0.5 + 0.3 + settings.opacityAdd;

            layerEl.appendChild(drop);
        }
    });
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
