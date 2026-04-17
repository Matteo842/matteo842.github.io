/* taste-interactions.js
   Micro-interazioni CSS-driven (v2):
   - Spotlight border su .glass-card (tramite CSS vars --mx / --my)
   - Tilt 3D leggero su .glass-card
   - Magnetic hover su .neon-btn.chromatic-btn (hero CTA) e .nav-cta
   - Staggered reveal via IntersectionObserver su [data-v2-reveal]
   Tutte le scritture DOM passano per transform/opacity (hardware accel).
*/
(function () {
    'use strict';

    if (!document.body.classList.contains('theme-v2')) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    /* ---------- 1. Spotlight + subtle tilt on cards ---------- */
    const cards = document.querySelectorAll('.theme-v2 .glass-card, body.theme-v2 .glass-card');
    const applyCardFX = !prefersReduced && !isCoarse;

    if (applyCardFX) {
        /* Skip .crown-jewel and .floating since GSAP already animates their transform.
           Running our tilt on top would fight GSAP's timeline. */
        document.querySelectorAll('.glass-card:not(.crown-jewel):not(.floating)').forEach((card) => {
            let rafId = 0;
            let mx = 50, my = 50, rx = 0, ry = 0;

            const update = () => {
                card.style.setProperty('--mx', mx + '%');
                card.style.setProperty('--my', my + '%');
                card.style.transform = `perspective(900px) rotateX(${ry}deg) rotateY(${rx}deg) translateY(-2px)`;
                rafId = 0;
            };

            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                mx = px * 100;
                my = py * 100;
                rx = (px - 0.5) * 4;  // max 2deg each side
                ry = (0.5 - py) * 4;
                if (!rafId) rafId = requestAnimationFrame(update);
            }, { passive: true });

            card.addEventListener('pointerleave', () => {
                mx = 50; my = 50; rx = 0; ry = 0;
                card.style.transform = '';
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            });
        });
    }

    /* ---------- 2. Magnetic hover on hero primary CTA ---------- */
    if (!prefersReduced && !isCoarse) {
        const magneticSelectors = [
            '.hero .neon-btn',
            '.nav-desktop .nav-cta'
        ];
        document.querySelectorAll(magneticSelectors.join(',')).forEach((btn) => {
            let rafId = 0;
            let tx = 0, ty = 0;

            const apply = () => {
                btn.style.transform = `translate(${tx}px, ${ty}px)`;
                rafId = 0;
            };

            btn.addEventListener('pointermove', (e) => {
                const r = btn.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                tx = (e.clientX - cx) * 0.18;
                ty = (e.clientY - cy) * 0.18;
                if (!rafId) rafId = requestAnimationFrame(apply);
            }, { passive: true });

            btn.addEventListener('pointerleave', () => {
                tx = 0; ty = 0;
                btn.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1)';
                btn.style.transform = '';
                setTimeout(() => { btn.style.transition = ''; }, 360);
            });
        });
    }

    /* ---------- 3. Staggered reveals on scroll ---------- */
    const revealTargets = document.querySelectorAll('[data-v2-reveal]');
    if (revealTargets.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealTargets.forEach((el, idx) => {
            const groupStagger = el.getAttribute('data-v2-stagger');
            if (groupStagger !== null) {
                el.style.setProperty('--v2-stagger', groupStagger);
            } else {
                el.style.setProperty('--v2-stagger', String(idx % 6));
            }
            io.observe(el);
        });
    } else if (revealTargets.length) {
        revealTargets.forEach((el) => el.classList.add('is-visible'));
    }
})();
