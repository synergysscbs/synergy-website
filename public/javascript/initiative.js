AOS.init({
  duration: 900,
  once: false,
  easing: "ease-out-back",
});

// Intersection Observer to trigger number animations when the section comes into view
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3, // Lower threshold for mobile
};

const fundSection = document.getElementById("funds");
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Animate desktop counters
      animateValue("company-count", 0, 12, 800);
      animateValue("experience", 0, 2, 1, "+");
      animateValue("return-open", 0, 9, 800, "%");
      
      // Animate mobile counters
      animateValue("mobile-company-count", 0, 12, 800);
      animateValue("mobile-fund-size", 0, 60, 900, "K+");
      animateValue("mobile-return-open", 0, 9, 800, "%");
      
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
  if (carousel) {
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
  }
})();

// Mobile-specific enhancements
document.addEventListener("DOMContentLoaded", function() {
  // Add touch support for mobile carousel
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack && 'ontouchstart' in window) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    carouselTrack.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diff = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swipe left - next
          document.querySelector('.carousel-button.next')?.click();
        } else {
          // Swipe right - previous
          document.querySelector('.carousel-button.prev')?.click();
        }
      }
    });
  }

  // Mobile stats animation enhancement
  const mobileStats = document.querySelector('.mobile-stats');
  if (mobileStats) {
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add subtle animation to mobile stats cards
          const mobileCards = mobileStats.querySelectorAll('.mobile-stat-card');
          mobileCards.forEach((card, index) => {
            setTimeout(() => {
              card.style.transform = 'translateY(0)';
              card.style.opacity = '1';
            }, index * 150);
          });
        }
      });
    }, { threshold: 0.5 });

    mobileObserver.observe(mobileStats);
  }

  // Initialize mobile stats initial state
  const mobileCards = document.querySelectorAll('.mobile-stat-card');
  mobileCards.forEach(card => {
    card.style.transform = 'translateY(20px)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.5s ease';
  });
});