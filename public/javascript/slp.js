document.addEventListener("DOMContentLoaded", function () {
  // Number counting animation function
  function animateNumber(element, target, duration, isPercentage = false) {
    let start = 0;
    const increment = target / (duration / 16); // 16ms per frame (approx 60fps)

    const updateNumber = () => {
      start += increment;
      if (start >= target) {
        if (isPercentage) {
          element.textContent = target + "%";
        } else {
          element.textContent = target + "+";
        }
      } else {
        element.textContent = Math.floor(start) + (isPercentage ? "" : "+");
        requestAnimationFrame(updateNumber);
      }
    };

    if (isPercentage) {
      element.textContent = "0%";
    } else {
      element.textContent = "0+";
    }
    updateNumber();
  }

  // Animation observer with replay capability
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section headers
          if (entry.target.classList.contains("section-header")) {
            entry.target.classList.add("animated");
            const h2 = entry.target.querySelector("h2");
            const p = entry.target.querySelector("p");
            if (h2) h2.style.animation = "fadeInUp 1.2s forwards";
            if (p)
              setTimeout(
                () => (p.style.animation = "fadeInUp 1.2s forwards"),
                300
              );
          }

          // Cards
          if (entry.target.classList.contains("card")) {
            entry.target.classList.add("animated");
            entry.target.style.animation = "fadeInUp 1.2s forwards";
          }

          // Stats items
          if (entry.target.classList.contains("stat-item")) {
            entry.target.classList.add("animated");
            entry.target.style.animation = "scaleIn 1s forwards";

            // Animate the numbers
            const statNumber = entry.target.querySelector(".stat-number");
            if (statNumber && statNumber.getAttribute("data-target")) {
              const target = parseInt(statNumber.getAttribute("data-target"));
              const statLabel =
                entry.target.querySelector(".stat-label").textContent;

              if (statLabel.includes("Growth")) {
                statNumber.textContent = target + "X";
                statNumber.style.opacity = 1;
              } else if (statLabel.includes("Satisfaction")) {
                setTimeout(() => {
                  animateNumber(statNumber, target, 1500, true);
                }, 300);
              } else {
                setTimeout(() => {
                  animateNumber(statNumber, target, 1500);
                }, 300);
              }
            }
          }

          // Student project section
          if (entry.target.classList.contains("student-project")) {
            entry.target.classList.add("animated");
            entry.target.style.animation = "fadeInUp 1.2s forwards";
          }

          // Highlight box
          if (entry.target.classList.contains("highlight-box")) {
            entry.target.classList.add("animated");
            entry.target.style.animation = "fadeInUp 1s forwards";
          }

          // Gallery items
          if (entry.target.classList.contains("gallery-item")) {
            entry.target.classList.add("animated");
            entry.target.style.animation = "fadeInUp 1.2s forwards";
          }
        } else {
          // Remove animated class when element leaves viewport
          // This allows animation to replay when scrolled back into view
          entry.target.classList.remove("animated");

          if (entry.target.classList.contains("section-header")) {
            const h2 = entry.target.querySelector("h2");
            const p = entry.target.querySelector("p");
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

          if (entry.target.classList.contains("card")) {
            entry.target.style.animation = "none";
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(40px)";
          }

          if (entry.target.classList.contains("stat-item")) {
            entry.target.style.animation = "none";
            entry.target.style.opacity = "0";
            entry.target.style.transform = "scale(0.9)";

            // Reset numbers
            const statNumber = entry.target.querySelector(".stat-number");
            if (statNumber && statNumber.getAttribute("data-target")) {
              const statLabel =
                entry.target.querySelector(".stat-label").textContent;
              if (statLabel.includes("Growth")) {
                statNumber.textContent = "0X";
              } else if (statLabel.includes("Satisfaction")) {
                statNumber.textContent = "0%";
              } else {
                statNumber.textContent = "0";
              }
            }
          }

          if (entry.target.classList.contains("student-project")) {
            entry.target.style.animation = "none";
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(40px)";
          }

          if (entry.target.classList.contains("highlight-box")) {
            entry.target.style.animation = "none";
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(20px)";
          }

          if (entry.target.classList.contains("gallery-item")) {
            entry.target.style.animation = "none";
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(40px)";
          }
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  // Elements to observe
  const elements = [
    ...document.querySelectorAll(".section-header"),
    ...document.querySelectorAll(".card"),
    ...document.querySelectorAll(".stat-item"),
    ...document.querySelectorAll(".student-project"),
    ...document.querySelectorAll(".highlight-box"),
    ...document.querySelectorAll(".gallery-item"),
  ];

  // Start observing all elements
  elements.forEach((element) => {
    observer.observe(element);
  });

  // Card hover effect
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (!card.classList.contains("animated")) return;
      card.style.transform = "translateY(-15px)";
    });
    card.addEventListener("mouseleave", () => {
      if (!card.classList.contains("animated")) return;
      card.style.transform = "translateY(0)";
    });
  });
});