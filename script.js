// Shiro (白) - Application Logic

// API Configuration
const API_BASE_URL = "http://localhost:8080";

// DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultContainer = document.getElementById("result-container");
const navAbout = document.getElementById("nav-about");
const navCredits = document.getElementById("nav-credits");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");

// Form Event Listener
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMedicine(query);
  }
});

/**
 * Searches medicine information via the backend API.
 * @param {string} query - The name of the medicine to search for.
 */
async function searchMedicine(query) {
  // Set subtle loading state
  const originalButtonText = searchButton.textContent;
  searchButton.textContent = "Searching...";
  searchButton.disabled = true;
  searchInput.disabled = true;

  // Clear previous results and keep hidden
  resultContainer.innerHTML = "";
  resultContainer.classList.add("hidden");

  try {
    const response = await fetch(`${API_BASE_URL}/api/medicine/search?name=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate the response shape
    if (isValidMedicineData(data)) {
      renderResult(data);
    } else {
      renderError("No results found.");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    renderError("No results found.");
  } finally {
    // Reset loading state
    searchButton.textContent = originalButtonText;
    searchButton.disabled = false;
    searchInput.disabled = false;
  }
}

/**
 * Validates if the response matches the expected medicine contract.
 * @param {any} data - The response data to validate.
 * @returns {boolean} True if data matches the contract, false otherwise.
 */
function isValidMedicineData(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  
  // Must have at least a name (generic or brand) and purpose
  const hasName = typeof data.genericName === "string" || typeof data.brandName === "string";
  const hasPurpose = typeof data.purpose === "string";
  const hasMechanism = typeof data.mechanism === "string";
  const hasSideEffects = Array.isArray(data.sideEffects);
  
  return hasName && hasPurpose && hasMechanism && hasSideEffects;
}

/**
 * Renders the medicine information in the result container.
 * @param {object} medicine - Valid medicine data object.
 */
function renderResult(medicine) {
  // Format the heading. If both brand and generic names exist and differ, show both.
  let headingText = "";
  if (medicine.brandName && medicine.genericName && medicine.brandName.toLowerCase() !== medicine.genericName.toLowerCase()) {
    headingText = `${medicine.brandName} (${medicine.genericName})`;
  } else {
    headingText = medicine.brandName || medicine.genericName || "Medicine Information";
  }

  // Format side effects
  const sideEffectsText = medicine.sideEffects.length > 0 
    ? medicine.sideEffects.join(", ") 
    : "None reported.";

  // Create HTML content matching design requirements
  const htmlContent = `
    <h2 class="medicine-title">${escapeHTML(headingText)}</h2>
    
    <div class="result-section">
      <span class="result-label">What it's for</span>
      <p class="result-content">${escapeHTML(medicine.purpose)}</p>
    </div>
    
    <div class="result-section">
      <span class="result-label">How it works</span>
      <p class="result-content">${escapeHTML(medicine.mechanism)}</p>
    </div>
    
    <div class="result-section">
      <span class="result-label">Common side effects</span>
      <p class="result-content">${escapeHTML(sideEffectsText)}</p>
    </div>
  `;

  resultContainer.innerHTML = htmlContent;
  resultContainer.classList.remove("hidden");
}

/**
 * Renders a plain muted error or no-results message.
 * @param {string} message - The message to display.
 */
function renderError(message) {
  resultContainer.innerHTML = `<p class="status-text">${escapeHTML(message)}</p>`;
  resultContainer.classList.remove("hidden");
}

/**
 * Simple HTML escaping helper to prevent XSS.
 * @param {string} unsafe - Unsafe string to escape.
 * @returns {string} Safe escaped string.
 */
function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Modal Data and Navigation Handlers
const modalData = {
  about: {
    title: "About",
    text: "Shiro helps you understand what your medicine actually does to your body, in plain language."
  },
  credits: {
    title: "Credits",
    text: "Drug data provided free by the openFDA API (U.S. Food & Drug Administration)."
  }
};

/**
 * Opens the modal overlay with specific content.
 * @param {string} type - The content type ('about' or 'credits').
 */
function openModal(type) {
  const content = modalData[type];
  if (content) {
    modalTitle.textContent = content.title;
    modalText.textContent = content.text;
    modalOverlay.classList.remove("hidden");
    // Focus the close button when opened
    modalClose.focus();
  }
}

/**
 * Closes the modal overlay.
 */
function closeModal() {
  modalOverlay.classList.add("hidden");
}

// Modal Event Listeners
navAbout.addEventListener("click", () => openModal("about"));
navCredits.addEventListener("click", () => openModal("credits"));
modalClose.addEventListener("click", closeModal);

// Close on clicking backdrop
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

// Close on pressing Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    closeModal();
  }
});
