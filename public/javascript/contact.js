// /public/javascript/contact.js
// Lightweight notification handler kept for server-side flash messages (if provided).
document.addEventListener("DOMContentLoaded", function () {
  const successNotification = document.getElementById("successNotification");
  const errorNotification = document.getElementById("errorNotification");

  // Read optional server-side flash messages from #server-data if rendered by server
  const dataEl = document.getElementById("server-data");
  const serverData = {
    successMsg: dataEl?.dataset?.success ? dataEl.dataset.success : "",
    errorMsg: dataEl?.dataset?.error ? dataEl.dataset.error : "",
  };

  // Show notification utility
  function showNotification(notification, duration = 5000) {
    if (!notification) return;
    notification.classList.add("show");
    const progressBar = notification.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.animation = `progress ${duration}ms linear forwards`;
    }
    setTimeout(() => hideNotification(notification), duration);
  }

  function hideNotification(notification) {
    if (!notification) return;
    notification.classList.remove("show");
    const progressBar = notification.querySelector(".progress-bar");
    if (progressBar) progressBar.style.animation = "none";
  }

  // Close buttons
  document.querySelectorAll(".notification .close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const notification = this.closest(".notification");
      hideNotification(notification);
    });
  });

  // If server passed messages, show them
  if (serverData.successMsg && successNotification) {
    const span = successNotification.querySelector("span");
    if (span) span.textContent = serverData.successMsg;
    showNotification(successNotification, 5000);
  }
  if (serverData.errorMsg && errorNotification) {
    const span = errorNotification.querySelector("span");
    if (span) span.textContent = serverData.errorMsg;
    showNotification(errorNotification, 6000);
  }

  // Accessibility: allow Esc to close any visible notification
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".notification.show")
        .forEach((n) => hideNotification(n));
    }
  });
});
