document.addEventListener("DOMContentLoaded", function () {
  // ---------------- Get server data from hidden div ---------------- //
  const dataEl = document.getElementById("server-data");

  const serverData = {
    successMsg: dataEl?.dataset.success || "",
    errorMsg: dataEl?.dataset.error || "",
    oldData: dataEl?.dataset.old ? JSON.parse(dataEl.dataset.old) : {},
    errors: dataEl?.dataset.errors ? JSON.parse(dataEl.dataset.errors) : {},
  };

  // ---------------- DOM Elements ---------------- //
  const contactForm = document.getElementById("contactForm");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  const messageError = document.getElementById("messageError");
  const successNotification = document.getElementById("successNotification");
  const errorNotification = document.getElementById("errorNotification");

  // ---------------- Restore old form data ---------------- //
  if (serverData.oldData) {
    if (serverData.oldData.firstName)
      document.getElementById("firstName").value = serverData.oldData.firstName;
    if (serverData.oldData.email)
      document.getElementById("email").value = serverData.oldData.email;
    if (serverData.oldData.phone)
      document.getElementById("phone").value = serverData.oldData.phone;
    if (serverData.oldData.message)
      document.getElementById("message").value = serverData.oldData.message;
  }

  // ---------------- Show server-side errors ---------------- //
  if (serverData.errors) {
    if (serverData.errors.firstName) {
      document.getElementById("firstNameError").textContent =
        serverData.errors.firstName;
      document.getElementById("firstNameError").style.display = "block";
    }
    if (serverData.errors.email) {
      document.getElementById("emailError").textContent =
        serverData.errors.email;
      document.getElementById("emailError").style.display = "block";
    }
    if (serverData.errors.phone) {
      document.getElementById("phoneError").textContent =
        serverData.errors.phone;
      document.getElementById("phoneError").style.display = "block";
    }
    if (serverData.errors.message) {
      document.getElementById("messageError").textContent =
        serverData.errors.message;
      document.getElementById("messageError").style.display = "block";
    }
  }

  // ---------------- Character Count ---------------- //
  function updateCharCount() {
    const length = messageInput.value.length;
    charCount.textContent = `${length}/10 characters`;

    if (length < 10) {
      charCount.classList.add("short");
      if (!serverData.errors.message) {
        messageError.style.display = "block";
      }
    } else {
      charCount.classList.remove("short");
      if (!serverData.errors.message) {
        messageError.style.display = "none";
      }
    }
  }

  updateCharCount();
  messageInput.addEventListener("input", updateCharCount);

  // ---------------- Client-side validation ---------------- //
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset previous errors
    document.querySelectorAll(".error").forEach((el) => {
      if (el.innerText.includes("Please")) {
        el.style.display = "none";
      }
    });

    let isValid = true;

    // Validate name
    const nameInput = document.getElementById("firstName");
    const firstNameErrorDiv = document.getElementById("firstNameError");
    if (!nameInput.value.trim()) {
      firstNameErrorDiv.textContent = "Please enter your name";
      firstNameErrorDiv.style.display = "block";
      isValid = false;
    }

    // Validate email
    const emailInput = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErrorDiv = document.getElementById("emailError");
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
      emailErrorDiv.textContent = "Please enter a valid email address";
      emailErrorDiv.style.display = "block";
      isValid = false;
    }

    // Validate message
    if (messageInput.value.length < 10) {
      messageError.textContent = "Message must be at least 10 characters long";
      messageError.style.display = "block";
      isValid = false;
    }

    // Validate phone if provided
    const phoneInput = document.getElementById("phone");
    const phoneErrorDiv = document.getElementById("phoneError");
    if (phoneInput.value && !/^[\d\s\-\(\)]{10,}$/.test(phoneInput.value)) {
      phoneErrorDiv.textContent = "Please enter a valid phone number";
      phoneErrorDiv.style.display = "block";
      isValid = false;
    }

    if (isValid) {
      contactForm.submit();
    } else {
      showNotification(errorNotification);
      const firstError = Array.from(document.querySelectorAll(".error")).find(
        (el) => el.style.display === "block"
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  // ---------------- Notifications ---------------- //
  function showNotification(notification) {
    notification.classList.add("show");
    const progressBar = notification.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.animation = "progress 5s linear forwards";
    }
    setTimeout(() => {
      hideNotification(notification);
    }, 5000);
  }

  function hideNotification(notification) {
    notification.classList.remove("show");
    const progressBar = notification.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.animation = "none";
    }
  }

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const notification = this.closest(".notification");
      hideNotification(notification);
    });
  });

  // ---------------- Show flash messages from server ---------------- //
  if (serverData.successMsg.trim() !== "") {
    const span = successNotification.querySelector("span");
    if (span) span.textContent = serverData.successMsg;
    showNotification(successNotification);
  }

  if (serverData.errorMsg.trim() !== "") {
    const span = errorNotification.querySelector("span");
    if (span) span.textContent = serverData.errorMsg;
    showNotification(errorNotification);
  }

  // ---------------- Progress bar animation keyframes ---------------- //
  const style = document.createElement("style");
  style.textContent = `
    @keyframes progress {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
  `;
  document.head.appendChild(style);
});
