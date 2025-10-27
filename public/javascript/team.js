document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.transition = "transform 0.1s ease";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.3s ease";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.querySelector("header h1");
  const p = document.querySelector(".para");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === h1) {
            h1.classList.remove("animate-h1");
            void h1.offsetWidth; // force reflow
            h1.classList.add("animate-h1");
          }
          if (entry.target === p) {
            p.classList.remove("animate-p");
            void p.offsetWidth;
            p.classList.add("animate-p");
          }
        }
      });
    },
    { threshold: 0.5 }
  ); // Trigger when 50% visible

  observer.observe(h1);
  observer.observe(p);
});