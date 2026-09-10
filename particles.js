(() => {
    const layer = document.querySelector('.daily-particles');
    const particles = layer ? [...layer.querySelectorAll('span')] : [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!particles.length || reducedMotion.matches || !window.PointerEvent) return;

    let pointer = null;
    let frame = null;
    let lastTime = performance.now();
    const states = particles.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));

    function flowParticles(time) {
        const elapsed = Math.min((time - lastTime) / 16.67, 2);
        lastTime = time;

        particles.forEach((particle, index) => {
            const state = states[index];

            if (pointer) {
                const bounds = particle.getBoundingClientRect();
                const particleX = bounds.left + bounds.width / 2;
                const particleY = bounds.top + bounds.height / 2;
                const distanceX = particleX - pointer.x;
                const distanceY = particleY - pointer.y;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;
                const radius = 230;

                if (distance < radius) {
                    const strength = (1 - distance / radius) ** 2;
                    const flow = strength * 0.42 * elapsed;
                    const swirlX = -distanceY / distance;
                    const swirlY = distanceX / distance;
                    const currentX = distanceX / distance;
                    const currentY = distanceY / distance;

                    state.vx += (swirlX + currentX * 0.18) * flow;
                    state.vy += (swirlY + currentY * 0.18) * flow;
                }
            }

            state.vx *= 0.94 ** elapsed;
            state.vy *= 0.94 ** elapsed;
            state.x += state.vx * elapsed;
            state.y += state.vy * elapsed;
            state.x *= 0.998 ** elapsed;
            state.y *= 0.998 ** elapsed;

            particle.style.setProperty('--flow-x', `${state.x}px`);
            particle.style.setProperty('--flow-y', `${state.y}px`);
        });

        frame = requestAnimationFrame(flowParticles);
    }

    document.addEventListener('pointermove', (event) => {
        pointer = { x: event.clientX, y: event.clientY };
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        pointer = null;
    });

    frame = requestAnimationFrame(flowParticles);
})();
