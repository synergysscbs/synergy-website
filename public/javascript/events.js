document.addEventListener("DOMContentLoaded", function () {
  // --- PARTICLE ANIMATION ---
  const particleContainer = document.querySelector(".particles");
  if (particleContainer) {
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

    for (let i = 0; i < particlesCount; i++) {
      particles.push(createParticle());
    }

    let lastTime = 0;
    function animateParticles(time) {
      const deltaTime = time - lastTime;
      lastTime = time;

      particles.forEach((particle) => {
        particle.x += particle.speedX * (deltaTime / 16);
        particle.y += particle.speedY * (deltaTime / 16);

        if (particle.x < 0 || particle.x > 100) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > 100) particle.speedY *= -1;

        particle.element.style.transform = `translate(${particle.x}vw, ${particle.y}vh)`;
      });

      requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
  }

  // --- NAVBAR CLICK PROTECTION ---
  const navbar = document.querySelector('.navbar');
  const eventLinks = document.querySelectorAll('.main-event');

  // Ensure navbar is fixed and thin
  if (navbar) {
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.width = '100%';
    navbar.style.height = '60px';
    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    navbar.style.backdropFilter = 'blur(15px)';
    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    navbar.style.zIndex = '1000';
  }

  // Update body padding to match navbar height
  document.body.style.paddingTop = '60px';

  // Simple click protection for navbar area
  document.addEventListener('click', function(e) {
    const navbarHeight = navbar ? navbar.offsetHeight : 60;
    
    // If click is in the top navbar area
    if (e.clientY < navbarHeight + 10) {
      let target = e.target;
      while (target && target !== document.body) {
        if (target.classList && target.classList.contains('main-event')) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        target = target.parentElement;
      }
    }
  }, true);

  console.log('Events page initialized with thin navbar');
});