// Lottie Animations
const animations = {};

// Initialize Hero Animation
animations.hero = lottie.loadAnimation({
  container: document.getElementById("heroAnimation"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "https://lottie.host/1c8f1a4e-d6e2-4110-827c-3f95e865f142/j4yG1p7p6c.json",
});

// Initialize Card Animations
const cardAnimations = [
  "https://lottie.host/5a07c087-540c-40b9-873d-9d4133d1b26c/zH3vH4uH2g.json",
  "https://lottie.host/7476e828-567a-42c6-a67b-1188d6b820a2/wXn2G3jD1l.json",
  "https://lottie.host/dd5843b0-6425-419b-b0b3-d85c3702a0a2/M8Yn8X4FhH.json",
  "https://lottie.host/809c914d-6b5d-4f01-9a72-73a78f287116/HhB6Q8oM7i.json",
  "https://lottie.host/5a07c087-540c-40b9-873d-9d4133d1b26c/zH3vH4uH2g.json",
];

cardAnimations.forEach((path, index) => {
  const container = document.getElementById(`cardAnimation${index + 1}`);
  if (container) {
    animations[`card${index + 1}`] = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: path,
    });
  }
});

// Open Report Function - Fixed version
function openReport(url) {
  // Use event.target to find the closest card element
  const card = event.target.closest(".card");
  if (card) {
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
      window.open(url, "_blank");
    }, 150);
  } else {
    // Fallback if card not found
    window.open(url, "_blank");
  }
}

// Set up event listeners for cards
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const pdfUrl = card.getAttribute("data-pdf");

    // Add click event to the card
    card.addEventListener("click", function (event) {
      // Check if the click was on the button specifically
      if (event.target.classList.contains("open-report-btn")) {
        return; // Let the button's own event handler deal with it
      }

      // Otherwise, open the PDF
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
        window.open(pdfUrl, "_blank");
      }, 150);
    });

    // Add click event to the button specifically
    const button = card.querySelector(".open-report-btn");
    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent the card click event from firing
        const card = this.closest(".card");
        card.style.transform = "scale(0.95)";
        setTimeout(() => {
          card.style.transform = "";
          window.open(pdfUrl, "_blank");
        }, 150);
      });
    }
  });
});

// Mobile touch handling for cards
function handleCardTouch() {
  if (window.innerWidth <= 900) {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      // Add touch event listeners
      card.addEventListener("touchstart", (e) => {
        // Remove touched class from all cards
        cards.forEach((c) => c.classList.remove("touched"));
        // Add touched class to current card
        card.classList.add("touched");
      });
    });

    // Remove touched class when clicking outside
    document.addEventListener("touchstart", (e) => {
      if (!e.target.closest(".card")) {
        cards.forEach((card) => card.classList.remove("touched"));
      }
    });
  }
}

// Initialize mobile touch handling
handleCardTouch();

// Re-initialize on window resize
window.addEventListener("resize", handleCardTouch);