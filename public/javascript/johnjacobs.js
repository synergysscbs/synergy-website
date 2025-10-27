document.addEventListener("DOMContentLoaded", function () {
  // Animation on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("stat-item")) {
            animateCounter(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // Observe all relevant elements for scroll animation
  document
    .querySelectorAll(
      "section, .section-header, .card, .highlight-box, .stat-item, h2, h3"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // Hover effects for cards
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
    });
    card.addEventListener("mouseleave", () => {
      if (!card.matches(":hover")) {
        card.style.transform = "";
      }
    });
  });

  function animateCounter(item) {
    const counter = item.querySelector(".stat-number");
    const targetText = item.getAttribute("data-target");
    const numMatch = targetText.match(/\d+/);

    if (numMatch) {
      const num = parseInt(numMatch[0]);
      const suffix = targetText.replace(num, "");
      let current = 0;
      const increment = num / 50;

      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          counter.textContent = targetText;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, 30);
    } else {
      // Handle non-numeric targets
      counter.textContent = targetText;
    }
  }

  // Stacked Cards Functionality - No Scrollbar Version
  const cards = document.querySelectorAll(".stacked-card");
  const dots = document.querySelectorAll(".stacked-dot");
  let currentCard = 0;
  let autoRotate = true;
  let rotationInterval;

  // Initialize card positions
  function updateCardPositions() {
    cards.forEach((card, index) => {
      const diff = (index - currentCard + 4) % 4;

      // Remove all position classes
      card.classList.remove("active", "next", "next2", "next3");

      // Add appropriate position class
      if (diff === 0) {
        card.classList.add("active");
      } else if (diff === 1) {
        card.classList.add("next");
      } else if (diff === 2) {
        card.classList.add("next2");
      } else if (diff === 3) {
        card.classList.add("next3");
      }
    });

    // Update navigation dots
    dots.forEach((dot, index) => {
      if (index === currentCard) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // Adjust container height
    adjustContainerHeight();
  }

  // Adjust container height based on active card
  function adjustContainerHeight() {
    const container = document.querySelector(".stacked-cards-container");
    const activeCard = document.querySelector(".stacked-card.active");

    if (activeCard) {
      // Calculate the height needed for the active card plus the stack offset
      const activeCardHeight = activeCard.scrollHeight;
      // Add extra space for the stacked effect (90px for the deepest card)
      const containerHeight = activeCardHeight + 90;
      container.style.minHeight = `${containerHeight}px`;
    }
  }

  // Auto rotate cards
  function startAutoRotation() {
    rotationInterval = setInterval(() => {
      if (autoRotate) {
        currentCard = (currentCard + 1) % 4;
        updateCardPositions();
      }
    }, 4000);
  }

  // Card click handler
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Get card index
      const index = parseInt(card.getAttribute("data-index"));

      // Only update if it's not the active card
      if (index !== currentCard) {
        autoRotate = false;
        currentCard = index;
        updateCardPositions();

        // Resume auto rotation after a delay
        setTimeout(() => {
          autoRotate = true;
        }, 10000);
      }
    });
  });

  // Dot click handler
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"));

      if (index !== currentCard) {
        autoRotate = false;
        currentCard = index;
        updateCardPositions();

        // Resume auto rotation after a delay
        setTimeout(() => {
          autoRotate = true;
        }, 10000);
      }
    });
  });

  // Initialize and start auto rotation
  updateCardPositions();
  startAutoRotation();

  // Pause auto rotation on container hover
  const container = document.querySelector(".stacked-cards-container");
  container.addEventListener("mouseenter", () => {
    autoRotate = false;
  });

  container.addEventListener("mouseleave", () => {
    autoRotate = true;
  });

  // Adjust height on window resize
  window.addEventListener("resize", () => {
    adjustContainerHeight();
  });
});