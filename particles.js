(() => {
    const layer = document.querySelector('.daily-particles');
    const particles = layer ? [...layer.querySelectorAll('span')] : [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!particles.length || reducedMotion.matches || !window.PointerEvent) return;

    let pointer = null;
    let frame = null;

    function resetParticles() {
        particles.forEach((particle) => {
            particle.style.setProperty('--repel-x', '0px');
            particle.style.setProperty('--repel-y', '0px');
        });
    }

    function repelParticles() {
        frame = null;
        if (!pointer) return;

        particles.forEach((particle) => {
            const bounds = particle.getBoundingClientRect();
            const particleX = bounds.left + bounds.width / 2;
            const particleY = bounds.top + bounds.height / 2;
            const distanceX = particleX - pointer.x;
            const distanceY = particleY - pointer.y;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            const radius = 150;

            if (distance >= radius || distance === 0) {
                particle.style.setProperty('--repel-x', '0px');
                particle.style.setProperty('--repel-y', '0px');
                return;
            }

            const strength = (1 - distance / radius) ** 2;
            const amount = 42 * strength;
            particle.style.setProperty('--repel-x', `${(distanceX / distance) * amount}px`);
            particle.style.setProperty('--repel-y', `${(distanceY / distance) * amount}px`);
        });
    }

    document.addEventListener('pointermove', (event) => {
        pointer = { x: event.clientX, y: event.clientY };
        if (!frame) frame = requestAnimationFrame(repelParticles);
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        pointer = null;
        resetParticles();
    });
})();
