document.addEventListener("DOMContentLoaded", function () {
  // --- CORE FUNCTIONALITY ---
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  // Throttle function for performance
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // Welcome message animation
  const welcomeMsg = document.getElementById("welcome-msg");
  if (welcomeMsg) {
    const popText = "The Corporate Society, SSCBS";
    popText.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = i * 0.1 + "s";
      welcomeMsg.appendChild(span);
    });
  }

  // Hero section fade on scroll
  const logoContainer = document.getElementById(
    "center-rotating-logo-container"
  );
  const taglineScroll = document.getElementById("tagline-scroll");
  if (logoContainer && taglineScroll) {
    window.addEventListener(
      "scroll",
      throttle(() => {
        const scrollPosition = window.scrollY;
        const fadeEnd = window.innerHeight / 2; // Point at which opacity becomes 0

        let opacity = 1 - scrollPosition / fadeEnd;
        opacity = Math.max(0, Math.min(1, opacity)); // Clamp value between 0 and 1

        const pointerEvents = opacity < 0.1 ? "none" : "auto";

        // Apply styles only to elements that should fade with scroll
        taglineScroll.style.opacity = opacity;
        taglineScroll.style.pointerEvents = pointerEvents;
      }, 10),
      { passive: true }
    );
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Scroll to About section
  if (taglineScroll) {
    const scrollToAbout = () => {
      document.getElementById("about-us")?.scrollIntoView({
        behavior: "smooth",
      });
    };
    taglineScroll.addEventListener("click", scrollToAbout);
    taglineScroll.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") scrollToAbout();
    });
  }

  // Marquee hover functionality
  const partnersMarquee = document.getElementById("partners-marquee");
  const achievementsMarquee = document.getElementById("achievements-marquee");

  function setupMarqueeHover(marquee) {
    if (!marquee) return;
    marquee.addEventListener("mouseenter", () =>
      marquee.classList.add("paused")
    );
    marquee.addEventListener("mouseleave", () =>
      marquee.classList.remove("paused")
    );
  }

  setupMarqueeHover(partnersMarquee);
  setupMarqueeHover(achievementsMarquee);

  // Optimized particle animation
  const particleContainer = document.querySelector(".particles");
  if (particleContainer) {
    // Create fewer particles for better performance
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
