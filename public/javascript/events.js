document.addEventListener("DOMContentLoaded", function () {
  // --- PARTICLE ANIMATION ---
  const particleContainer = document.querySelector(".particles");
  if (particleContainer) {
    // Create particles for better performance
    const particlesCount = 30;
    let particles = [];

    function createParticle() {
      const p = document.createElement("div");
      p.classList.add("particle");
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 100}vh`;
      const size = Math.random() * 6 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      particleContainer.appendChild(p);

      return {
        element: p,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        size: size,
      };
    }

    // Initialize particles
    for (let i = 0; i < particlesCount; i++) {
      particles.push(createParticle());
    }

    // Animation loop
    let lastTime = 0;
    function animateParticles(time) {
      const deltaTime = time - lastTime;
      lastTime = time;

      particles.forEach((particle) => {
        particle.x += particle.speedX * (deltaTime / 16);
        particle.y += particle.speedY * (deltaTime / 16);

        // Boundary check
        if (particle.x < 0 || particle.x > 100) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > 100) particle.speedY *= -1;

        // Update position
        particle.element.style.transform = `translate(${particle.x}vw, ${particle.y}vh)`;
      });

      requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
  }
});
