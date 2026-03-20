document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const formatNumber = (value, decimals) => {
    const safeDecimals = Number.isFinite(decimals) ? Math.max(0, decimals) : 0;
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: safeDecimals,
      maximumFractionDigits: safeDecimals,
    });
    return formatter.format(value);
  };

  const animateStatNumber = (el) => {
    if (!el || el.dataset.animated === "1") return;

    const rawTarget = el.getAttribute("data-target") ?? "0";
    const target = Number.parseFloat(rawTarget);
    const suffix = el.getAttribute("data-suffix") ?? "";
    const decimals = Number.parseInt(el.getAttribute("data-decimals") ?? "0", 10);

    if (!Number.isFinite(target)) return;

    el.dataset.animated = "1";
    el.textContent = "0";

    const durationMs = 1500;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      const current = target * eased;
      el.textContent = `${formatNumber(current, decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          el.classList.add("animated");

          if (el.classList.contains("section-header")) {
            const h2 = el.querySelector("h2");
            const p = el.querySelector("p");
            if (h2) h2.style.animation = "fadeInUp 1.2s forwards";
            if (p)
              setTimeout(() => (p.style.animation = "fadeInUp 1.2s forwards"), 250);
          }

          if (el.classList.contains("card")) {
            el.style.animation = "fadeInUp 1.2s forwards";
          }

          if (el.classList.contains("stat-item")) {
            el.style.animation = "scaleIn 1s forwards";
            const statNumber = el.querySelector(".stat-number");
            if (statNumber) animateStatNumber(statNumber);
          }

          if (el.classList.contains("student-project")) {
            el.style.animation = "fadeInUp 1.2s forwards";
            const highlight = el.querySelector(".highlight-box");
            if (highlight) highlight.classList.add("animated");
          }

          if (el.classList.contains("highlight-box")) {
            el.style.animation = "fadeInUp 1s forwards";
          }

          if (el.classList.contains("gallery-item")) {
            el.style.animation = "fadeInUp 1.2s forwards";
          }
        } else {
          // Replay effects (similar to slp.js), but keep stat numbers stable once animated.
          el.classList.remove("animated");

          if (el.classList.contains("section-header")) {
            const h2 = el.querySelector("h2");
            const p = el.querySelector("p");
            if (h2) {
              h2.style.animation = "none";
              h2.style.opacity = "0";
              h2.style.transform = "translateY(30px)";
            }
            if (p) {
              p.style.animation = "none";
              p.style.opacity = "0";
              p.style.transform = "translateY(20px)";
            }
          }

          if (el.classList.contains("card")) {
            el.style.animation = "none";
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
          }

          if (el.classList.contains("stat-item")) {
            el.style.animation = "none";
            el.style.opacity = "0";
            el.style.transform = "scale(0.9)";
          }

          if (el.classList.contains("gallery-item")) {
            el.style.animation = "none";
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
          }

          if (el.classList.contains("student-project")) {
            el.style.animation = "none";
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
          }

          if (el.classList.contains("highlight-box")) {
            el.style.animation = "none";
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  const elementsToObserve = [
    ...document.querySelectorAll(".section-header"),
    ...document.querySelectorAll(".card"),
    ...document.querySelectorAll(".stat-item"),
    ...document.querySelectorAll(".student-project"),
    ...document.querySelectorAll(".highlight-box"),
    ...document.querySelectorAll(".gallery-item"),
  ];

  elementsToObserve.forEach((el) => observer.observe(el));

  // If reduced motion: just show everything immediately.
  if (prefersReduced) {
    document.querySelectorAll(".section-header,.card,.stat-item,.student-project,.highlight-box,.gallery-item").forEach((el) => {
      el.classList.add("animated");
    });
    document.querySelectorAll(".stat-number").forEach((n) => {
      const target = n.getAttribute("data-target") ?? "0";
      const suffix = n.getAttribute("data-suffix") ?? "";
      const decimals = Number.parseInt(n.getAttribute("data-decimals") ?? "0", 10);
      const num = Number.parseFloat(target);
      n.textContent = `${formatNumber(Number.isFinite(num) ? num : 0, decimals)}${suffix}`;
    });
  }

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  let lastActive = null;

  const openLightbox = (img) => {
    if (!lightbox || !lightboxImg || !img) return;
    lastActive = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "Snapshot";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    lightboxClose?.focus?.();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.documentElement.style.overflow = "";
    lastActive?.focus?.();
  };

  document.addEventListener("click", (e) => {
    const img = e.target?.closest?.(".lightbox-trigger");
    if (img) openLightbox(img);
  });

  lightboxClose?.addEventListener?.("click", closeLightbox);

  lightbox?.addEventListener?.("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
  });
});
