AOS.init({
  duration: 900,
  once: false,
  easing: "ease-out-back",
});

// Intersection Observer to trigger number animations when the section comes into view
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5, // Trigger when 50% of the section is visible
};

const fundSection = document.getElementById("funds");
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateValue("company-count", 0, 12, 800);
      animateValue("fund-size", 0, 60, 900, "K+");
      animateValue("return-open", 0, 9, 800, "%");
      // Disconnect the observer after the animation has run once
      observer.disconnect();
    }
  });
}, observerOptions);

if (fundSection) {
  observer.observe(fundSection);
}

// Function to animate numerical values
function animateValue(id, start, end, duration, suffix = "") {
  let obj = document.getElementById(id);
  if (!obj) return;
  let range = end - start;
  let current = start;
  let increment = end > start ? 1 : -1;
  let stepTime = Math.abs(Math.floor(duration / Math.max(Math.abs(range), 1)));
  let timer = setInterval(() => {
    current += increment;
    obj.innerText = current + suffix;
    if (current === end) clearInterval(timer);
  }, stepTime);
}

// Improved Carousel functionality
(() => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let isTransitioning = false;

  const moveToSlide = (targetIndex) => {
    if (isTransitioning) return;

    isTransitioning = true;
    const slideWidth = track.clientWidth;
    track.style.transform = `translateX(-${targetIndex * slideWidth}px)`;
    currentIndex = targetIndex;
    updateButtons();

    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  };

  const updateButtons = () => {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

    prevButton.style.opacity = currentIndex === 0 ? "0.3" : "1";
    nextButton.style.opacity = currentIndex === slides.length - 1 ? "0.3" : "1";
  };

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      moveToSlide(currentIndex + 1);
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (!isTransitioning) {
      const slideWidth = track.clientWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  });

  // Initialize
  updateButtons();

  // Auto-slide functionality (optional)
  let autoSlideInterval = setInterval(() => {
    if (currentIndex < slides.length - 1) {
      moveToSlide(currentIndex + 1);
    } else {
      moveToSlide(0);
    }
  }, 4000);

  // Pause auto-slide on hover
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
  });

  carousel.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        moveToSlide(currentIndex + 1);
      } else {
        moveToSlide(0);
      }
    }, 4000);
  });
})();
