// Theme Toggle
const themeToggle = document.querySelector("#theme-toggle");
if (themeToggle) {
  const themePreferenceKey = "portfolio-theme";
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem(themePreferenceKey);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
  };

  // Applies the theme and keeps the toggle's label and accessibility state in sync.
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === "dark" ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  };

  // Use the saved choice, or follow the system preference until the user picks a theme.
  applyTheme(getSavedTheme() || (colorScheme.matches ? "dark" : "light"));
  colorScheme.addEventListener("change", (event) => {
    if (!getSavedTheme()) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  //Switch between light and dark themes.
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themePreferenceKey, nextTheme);
    applyTheme(nextTheme);
  });
}

// Image Viewer
const imageViewer = document.querySelector("#image-viewer");
const viewerImage = document.querySelector("#image-viewer-image");

if (imageViewer && viewerImage) {
  // Close the enlarged image with the button or by clicking the dialog backdrop.
  imageViewer.querySelector(".image-viewer-close").addEventListener("click", () => {
    imageViewer.close();
  });
  imageViewer.addEventListener("click", (event) => {
    if (event.target === imageViewer) {
      imageViewer.close();
    }
  });
}

//Project and Certificate Previews
document.querySelectorAll(".proof-image").forEach((image) => {
  const placeholder = image.nextElementSibling;

  // Show the image only when it loaded successfully otherwise show its placeholder.
  const updateVisibility = () => {
    const imageLoaded = image.naturalWidth > 0 && image.naturalHeight > 0;
    image.hidden = !imageLoaded;
    if (placeholder) {
      placeholder.hidden = imageLoaded;
    }
  };

  // Allow each preview to open in the viewer with a click, Enter, or Space.
  if (imageViewer && viewerImage) {
    const openViewer = () => {
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      imageViewer.showModal();
    };

    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Enlarge ${image.alt}`);
    image.addEventListener("click", openViewer);
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openViewer();
      }
    });
  }

  // Update the preview and placeholder when the browser finishes loading the image.
  image.addEventListener("load", updateVisibility);
  image.addEventListener("error", updateVisibility);

  if (image.complete) {
    updateVisibility();
  }
});
