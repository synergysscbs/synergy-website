(function () {
  const page = document.getElementById("projects-page");
  if (!page) return;

  // Scroll progress bar
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    document.getElementById(
      "progress-bar"
    ).style.transform = `scaleX(${progress})`;

    // Parallax effect
    document.querySelectorAll(".parallax-section").forEach((section) => {
      const offset = window.scrollY * 0.4;
      section.style.backgroundPositionY = `${-offset}px`;
    });
  });

  // Re-triggering fade-up animation on scroll
  const fadeEls = page.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    },
    { threshold: 0.3 }
  ); // The threshold is the percentage of the element that needs to be visible to trigger the callback

  fadeEls.forEach((el) => observer.observe(el));
})();