// Simple animation for timeline items
document.addEventListener("DOMContentLoaded", function () {
  const timelineItems = document.querySelectorAll(".timeline-item");

  // Set initial state
  timelineItems.forEach((item) => {
    item.style.opacity = 0;
    item.style.transform = "translateY(50px)";
    item.style.transition = "all 0.8s ease";
  });

  // Animate on scroll
  window.addEventListener("scroll", function () {
    const timeline = document.querySelector(".timeline-container");
    const timelinePosition = timeline.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (timelinePosition < screenPosition) {
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = 1;
          item.style.transform = "translateY(0)";
        }, index * 300);
      });
    }
  });

  // Trigger scroll once to check initial state
  window.dispatchEvent(new Event("scroll"));
});