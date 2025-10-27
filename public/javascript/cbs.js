// Smooth fade-in effect
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll("section, header");

  fadeElements.forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 1s ease, transform 1s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((el) => observer.observe(el));
});