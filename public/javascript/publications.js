function wrapCharacters(element) {
  const text = element.textContent;
  element.innerHTML = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char === " " ? "\u00A0" : char;
    element.appendChild(span);
  }
}

function isOverlapping(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function highlightOverlappingChars(card, image) {
  const imageRect = image.getBoundingClientRect();
  const chars = card.querySelectorAll(".char");

  chars.forEach((char) => {
    const charRect = char.getBoundingClientRect();
    if (isOverlapping(charRect, imageRect)) {
      char.classList.add("highlighted");
    } else {
      char.classList.remove("highlighted");
    }
  });
}

const cards = document.querySelectorAll(".publication-card");

cards.forEach((card) => {
  const cardInner = card.querySelector(".card-inner");
  const image = card.querySelector(".floating-image");
  const button = card.querySelector(".view-btn");
  const heading = card.querySelector("h2");
  const paragraph = card.querySelector("p");

  // Wrap characters in spans for hover effect
  if (window.innerWidth > 900) {
    wrapCharacters(heading);
    wrapCharacters(paragraph);
  }

  cardInner.addEventListener("mouseenter", () => {
    if (window.innerWidth > 900) {
      image.style.opacity = "1";
    }
  });

  cardInner.addEventListener("mouseleave", () => {
    if (window.innerWidth > 900) {
      image.style.opacity = "0";
      const chars = card.querySelectorAll(".char");
      chars.forEach((char) => char.classList.remove("highlighted"));
    }
  });

  cardInner.addEventListener("mousemove", (e) => {
    if (window.innerWidth > 900) {
      const rect = cardInner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const buttonRect = button.getBoundingClientRect();

      const isOverButton =
        e.clientX >= buttonRect.left &&
        e.clientX <= buttonRect.right &&
        e.clientY >= buttonRect.top &&
        e.clientY <= buttonRect.bottom;

      if (isOverButton) {
        image.style.opacity = "0";
        const chars = card.querySelectorAll(".char");
        chars.forEach((char) => char.classList.remove("highlighted"));
      } else {
        const imageWidth = image.offsetWidth;
        const imageHeight = image.offsetHeight;
        const padding = 20;

        const minX = padding;
        const maxX = rect.width - imageWidth - padding;
        const minY = padding;
        const maxY = rect.height - imageHeight - padding;

        let imageX = Math.max(minX, Math.min(maxX, x - imageWidth / 2));
        let imageY = Math.max(minY, Math.min(maxY, y - imageHeight / 2));

        image.style.left = imageX + "px";
        image.style.top = imageY + "px";
        image.style.opacity = "1";

        requestAnimationFrame(() => {
          highlightOverlappingChars(card, image);
        });
      }
    }
  });
});
