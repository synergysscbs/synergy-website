document.addEventListener("DOMContentLoaded", function () {
  // Animation on scroll with repeating animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Add 'visible' class when element comes into view
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("stat-item")) {
            animateCounter(entry.target);
          }
        }
        // Remove 'visible' class when element leaves view
        else {
          entry.target.classList.remove("visible");
          if (entry.target.classList.contains("stat-item")) {
            resetCounter(entry.target);
          }
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // Observe all animatable elements
  document
    .querySelectorAll(
      "section, .section-header, .card, .highlight-box, .stat-item"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // Reset counter function
  function resetCounter(item) {
    const counter = item.querySelector(".stat-number");
    counter.textContent = "0";

    // Clear any existing timer for this item
    if (item.dataset.timerId) {
      clearInterval(parseInt(item.dataset.timerId));
      delete item.dataset.timerId;
    }
  }

  // Animate counter function
  function animateCounter(item) {
    const counter = item.querySelector(".stat-number");
    const targetText = item.getAttribute("data-target");
    const numMatch = targetText.match(/\d+/);

    // Only animate if we have a valid number
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      const suffix = targetText.replace(num, "");
      let current = 0;
      const increment = num / 50;

      // Clear any existing timer for this item
      if (item.dataset.timerId) {
        clearInterval(parseInt(item.dataset.timerId));
      }

      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          counter.textContent = targetText;
          clearInterval(timer);
          delete item.dataset.timerId;
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, 30);

      // Store the timer ID on the element
      item.dataset.timerId = timer;
    }
  }

  // Initial animations
  setTimeout(() => {
    document.querySelector("header").style.opacity = "1";
    document.querySelector("#hero-image").style.opacity = "1";
  }, 300);
});