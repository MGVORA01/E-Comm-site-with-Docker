export const showToast = (message) => {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "rgba(17, 24, 39, 0.95)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "12px",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.95rem",
    fontWeight: "600",
    zIndex: "9999",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
    opacity: "0",
    transform: "translateY(16px)",
    transition: "opacity 180ms ease, transform 180ms ease",
  });
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(16px)";
    setTimeout(() => toast.remove(), 200);
  }, 2200);
};
