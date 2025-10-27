document.addEventListener("DOMContentLoaded", function () {
  if (window.__SYNERGY_HOMEPAGE_LOADED) return;
  window.__SYNERGY_HOMEPAGE_LOADED = true;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  function throttle(fn, ms) {
    let t = null, last = 0;
    return function () {
      const now = Date.now();
      const ctx = this, args = arguments;
      if (!last || now - last >= ms) {
        last = now;
        fn.apply(ctx, args);
      } else {
        clearTimeout(t);
        t = setTimeout(() => { last = Date.now(); fn.apply(ctx, args); }, ms - (now - last));
      }
    };
  }
  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      const ctx = this, args = arguments;
      t = setTimeout(() => fn.apply(ctx, args), ms);
    };
  }

  (function heroNavSafetyViewportAware() {
    const hero = document.querySelector('.hero-section');
    const navbar = document.querySelector('nav');
    const centerContainer = document.getElementById('center-rotating-logo-container');
    const FALLBACK_NAV = 64;

    if (!hero) return;

    function computeExtraOffsetByViewport(w, h) {
      let extra = 30;
      if (h <= 600) extra += 30;
      else if (h <= 740) extra += 18;
      if (w <= 900 && h <= 740) extra += 10;
      if (w <= 520) extra += 8;
      return extra;
    }

    function computeBaseVhByViewport(w, h) {
      if (w <= 520) return 12;
      if (w <= 900 && h <= 740) return 12;
      if (w <= 1000) return 8;
      return 6;
    }

    function applyOffset() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const navH = navbar ? (navbar.offsetHeight || FALLBACK_NAV) : FALLBACK_NAV;

      const extra = computeExtraOffsetByViewport(w, h);
      const offset = Math.max(12, navH) + extra;

      try { document.documentElement.style.setProperty('--nav-offset', offset + 'px'); } catch (e) {}
      hero.style.paddingTop = offset + 'px';
      hero.style.minHeight = `calc(100vh - ${offset}px)`;

      if (centerContainer) {
        const baseVh = computeBaseVhByViewport(w, h);
        centerContainer.style.top = `calc(${offset}px + ${baseVh}vh)`;
        centerContainer.style.left = '50%';
        centerContainer.style.transform = 'translateX(-50%)';
      }
    }

    applyOffset();
    setTimeout(applyOffset, 200);
    setTimeout(applyOffset, 800);

    window.addEventListener('resize', throttle(applyOffset, 80), { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(applyOffset, 120));

    if (navbar && window.MutationObserver) {
      try {
        const mo = new MutationObserver(throttle(applyOffset, 120));
        mo.observe(navbar, { attributes: true, childList: true, subtree: true });
      } catch (e) { /* ignore */ }
    }
  })();

  (function setupHeading() {
    const welcomeMsg = document.getElementById("welcome-msg");
    if (!welcomeMsg) return;

    const raw = (welcomeMsg.textContent || welcomeMsg.innerText || "").trim() || "The Corporate Society - SSCBS";
    const words = raw.split(/\s+/);

    // Clear and rebuild as spans (each word is an inline-block)
    welcomeMsg.innerHTML = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.whiteSpace = "nowrap";
      span.style.display = "inline-block";
      span.style.animationDelay = (i * 0.06) + "s";
      welcomeMsg.appendChild(span);
      if (i < words.length - 1) welcomeMsg.appendChild(document.createTextNode(" "));
    });
  })();

  /* ===== FADE-UP SCROLL EFFECT ===== */
  (function revealOnScroll() {
    const elements = document.querySelectorAll(".fade-up");
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.25 });
    elements.forEach((el) => observer.observe(el));
  })();

  /* ===== SMOOTH ANCHORS ===== */
  (function smoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  })();

  /* ===== TAGLINE: FADE & CLICK ===== */
  (function taglineFadeAndScroll() {
    const tagline = document.getElementById("tagline-scroll");
    if (!tagline) return;
    const updateOpacity = () => {
      const heroHeight = window.innerHeight;
      const fadeEnd = Math.max(120, heroHeight / 2);
      let opacity = 1 - (window.scrollY / fadeEnd);
      opacity = Math.max(0, Math.min(1, opacity));
      tagline.style.opacity = opacity;
      tagline.style.pointerEvents = opacity < 0.12 ? "none" : "auto";
    };
    window.addEventListener("scroll", throttle(updateOpacity, 16), { passive: true });
    updateOpacity();
    const gotoAbout = () => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
    tagline.addEventListener("click", gotoAbout);
    tagline.addEventListener("keypress", (e) => { if (e.key === "Enter" || e.key === " ") gotoAbout(); });
  })();

  /* ===== MARQUEE HOVER PAUSE ===== */
  (function marqueeHover() {
    ["partners-marquee", "achievements-marquee"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("mouseenter", () => el.classList.add("paused"));
      el.addEventListener("mouseleave", () => el.classList.remove("paused"));
    });
  })();

  /* ===== PARTICLES (lightweight) ===== */
  (function particlesInit() {
    const container = document.querySelector(".particles");
    if (!container) return;
    const count = 28;
    const parts = [];
    function create() {
      const d = document.createElement("div");
      d.className = "particle";
      const size = Math.random() * 6 + 4;
      d.style.width = d.style.height = size + "px";
      d.style.left = (Math.random() * 100) + "vw";
      d.style.top = (Math.random() * 100) + "vh";
      container.appendChild(d);
      return { el: d, x: Math.random() * 100, y: Math.random() * 100, sx: (Math.random() - 0.5) * 0.2, sy: (Math.random() - 0.5) * 0.2 };
    }
    for (let i = 0; i < count; i++) parts.push(create());
    let last = 0;
    function frame(t) {
      const dt = t - last || 16;
      last = t;
      parts.forEach(p => {
        p.x += p.sx * (dt / 16);
        p.y += p.sy * (dt / 16);
        if (p.x < 0 || p.x > 100) p.sx *= -1;
        if (p.y < 0 || p.y > 100) p.sy *= -1;
        p.el.style.transform = `translate(${p.x}vw, ${p.y}vh)`;
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

});

