// Shiro (白) - Application Logic

const API_BASE_URL = "https://shiro-255r.onrender.com";

// DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultContainer = document.getElementById("result-container");
const navAbout = document.getElementById("nav-about");
const navCredits = document.getElementById("nav-credits");
const themeToggle = document.getElementById("theme-toggle");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");

// Handle form submit when user searches
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMedicine(query);
  }
});

// Search for medicine from backend or direct openFDA
async function searchMedicine(query) {
  // Show searching text on button
  const originalButtonText = searchButton.textContent;
  searchButton.textContent = "Searching...";
  searchButton.disabled = true;
  searchInput.disabled = true;

  // Clear last search
  resultContainer.innerHTML = "";
  resultContainer.classList.add("hidden");

  let medicines = [];

  // Try to search using our local backend first
  try {
    const response = await fetch(`${API_BASE_URL}/api/medicine/search?name=${encodeURIComponent(query)}`);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        const list = Array.isArray(data) ? data : [data];
        list.forEach(m => {
          if (isValidMedicineData(m)) {
            medicines.push(m);
          }
        });
      }
    }
  } catch (error) {
    // If backend is down, we will fetch directly from openFDA in frontend
  }

  // Also query openFDA directly to get other similar results
  try {
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(query)}*&limit=15`;
    const fdaResponse = await fetch(fdaUrl);
    if (fdaResponse.ok) {
      const fdaData = await fdaResponse.json();
      if (fdaData.results && fdaData.results.length > 0) {
        const mapped = fdaData.results.map(r => {
          const brandNames = r.openfda?.brand_name || [];
          const genericNames = r.openfda?.generic_name || [];
          
          // Waterfall for Purpose (What the drug is for)
          const purpose = r.purpose?.[0] || 
                          r.indications_and_usage?.[0] || 
                          r.indications_and_usage_table?.[0] || 
                          r.description?.[0] || 
                          "Information about the purpose of this medicine is not available on the label.";
          
          // Waterfall for Mechanism (How it works)
          const mechanism = r.mechanism_of_action?.[0] || 
                            (r.active_ingredient?.[0] ? "Active Ingredient: " + r.active_ingredient[0] : null) || 
                            r.description?.[0] || 
                            "Information about how this medicine works is not available on the label.";
          
          // Waterfall for Side Effects
          const sideEffects = r.adverse_reactions || 
                              r.warnings || 
                              r.warnings_and_cautions || 
                              r.precautions || 
                              ["No specific side effects or warnings are reported on the label."];

          return {
            brandName: brandNames[0] || null,
            genericName: genericNames[0] || null,
            purpose: purpose,
            mechanism: mechanism,
            sideEffects: sideEffects
          };
        }).filter(item => item.brandName !== null);

        // Add to our list, skip duplicates
        for (const item of mapped) {
          if (!medicines.some(m => (m.brandName || "").toLowerCase() === item.brandName.toLowerCase())) {
            medicines.push(item);
          }
        }
      }
    }
  } catch (fdaError) {
    // openFDA request failed
  }

  // Restore button status
  searchButton.textContent = originalButtonText;
  searchButton.disabled = false;
  searchInput.disabled = false;

  // Render results if found
  if (medicines.length > 0) {
    const sortedMedicines = sortMedicinesBySimilarity(medicines, query);
    renderMedicines(sortedMedicines, query, 0);
  } else {
    renderError("No results found.");
  }
}

// Sort results so the closest match stays on top
function sortMedicinesBySimilarity(list, query) {
  const q = query.toLowerCase();
  return list.sort((a, b) => {
    const aBrand = (a.brandName || "").toLowerCase();
    const bBrand = (b.brandName || "").toLowerCase();
    
    const aExact = aBrand === q;
    const bExact = bBrand === q;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    const aStarts = aBrand.startsWith(q);
    const bStarts = bBrand.startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    const aContains = aBrand.includes(q);
    const bContains = bBrand.includes(q);
    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;
    
    return aBrand.length - bBrand.length || aBrand.localeCompare(bBrand);
  });
}

// Make sure the medicine data is valid
function isValidMedicineData(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  // Must have generic or brand name
  return (typeof data.genericName === "string" && data.genericName.trim() !== "") || 
         (typeof data.brandName === "string" && data.brandName.trim() !== "");
}

// Clean brand name to remove mg, tablets, and marketing texts
function cleanBrandName(name) {
  if (!name) return "";
  
  return name
    .replace(/\b\d+(\.\d+)?\s*(mg|g|mcg|%|ml|capsules|tablets|tabs|caplets)\b/gi, "")
    .replace(/\b(maximum strength|extra strength|regular strength|strength|for adults|adults|cough & cold|pain relief)\b/gi, "")
    .replace(/\s+-\s+/g, " ")
    .replace(/[^a-zA-Z0-9\s()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Render pills list and selected card
function renderMedicines(medicines, query, activeIndex) {
  if (!medicines || medicines.length === 0) {
    renderError("No results found.");
    return;
  }

  const medicine = medicines[activeIndex];

  // Set card title heading
  let headingText = "";
  if (medicine.brandName && medicine.genericName && medicine.brandName.toLowerCase() !== medicine.genericName.toLowerCase()) {
    headingText = `${medicine.brandName} (${medicine.genericName})`;
  } else {
    headingText = medicine.brandName || medicine.genericName || "Medicine Information";
  }

  // Check and format details
  const purposeText = (medicine.purpose && medicine.purpose.trim()) ? medicine.purpose.trim() : "null";
  const mechanismText = (medicine.mechanism && medicine.mechanism.trim()) ? medicine.mechanism.trim() : "null";
  
  let sideEffectsText = "null";
  if (medicine.sideEffects && medicine.sideEffects.length > 0) {
    const filtered = medicine.sideEffects.filter(s => s && s.trim());
    if (filtered.length > 0) {
      sideEffectsText = filtered.join(", ");
    }
  }

  // Create similar pills HTML
  let pillsHtml = "";
  if (medicines.length > 1) {
    pillsHtml = `
      <div class="similar-results-container">
        <span class="similar-title">Similar Results</span>
        <div class="similar-pills">
          ${medicines.map((m, idx) => `
            <button type="button" class="similar-pill ${idx === activeIndex ? "active" : ""}" data-index="${idx}">
              ${escapeHTML(cleanBrandName(m.brandName || m.genericName))}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Create details card HTML
  const cardHtml = `
    <div class="medicine-card">
      <div class="medicine-card-header">
        <h2 class="medicine-card-title">${escapeHTML(headingText)}</h2>
      </div>
      
      <div class="card-detail">
        <span class="result-label">What it's for</span>
        <p class="result-content">${escapeHTML(purposeText)}</p>
      </div>
      
      <div class="card-detail">
        <span class="result-label">How it works</span>
        <p class="result-content">${escapeHTML(mechanismText)}</p>
      </div>
      
      <div class="card-detail">
        <span class="result-label">Common side effects</span>
        <p class="result-content">${escapeHTML(sideEffectsText)}</p>
      </div>
    </div>
  `;

  resultContainer.innerHTML = pillsHtml + cardHtml;
  resultContainer.classList.remove("hidden");

  // Add click listener to select other pills
  const pills = resultContainer.querySelectorAll(".similar-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      const idx = parseInt(pill.getAttribute("data-index"), 10);
      renderMedicines(medicines, query, idx);
    });
  });
}

// Fallback method to render a single result
function renderResult(medicine) {
  renderMedicines([medicine], medicine.brandName || medicine.genericName || "", 0);
}

// Show error messages in result box
function renderError(message) {
  resultContainer.innerHTML = `<p class="status-text">${escapeHTML(message)}</p>`;
  resultContainer.classList.remove("hidden");
}

// Escape HTML tags to prevent XSS
function escapeHTML(unsafe) {
  if (unsafe == null) {
    return "";
  }

  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Modal popup content definitions
const modalData = {
  about: {
    title: "About",
    html: `Shiro helps you understand what your medicine actually does to your body, in plain language.<br><br>Developed by <a href="https://www.linkedin.com/in/priyanshuraj2077/" target="_blank" class="modal-link">Priyanshu Raj</a>.`
  },
  credits: {
    title: "Credits",
    html: `Drug data provided free by the openFDA API (U.S. Food & Drug Administration).`
  }
};

// Open the about or credits modal
function openModal(type) {
  const content = modalData[type];
  if (content) {
    modalTitle.textContent = content.title;
    modalText.innerHTML = content.html;
    modalOverlay.classList.remove("hidden");
    modalClose.focus();
  }
}

// Close the modal
function closeModal() {
  modalOverlay.classList.add("hidden");
}

// Setup click listeners for about, credits, and close buttons
navAbout.addEventListener("click", () => openModal("about"));
navCredits.addEventListener("click", () => openModal("credits"));
modalClose.addEventListener("click", closeModal);

// Close modal if user clicks on backdrop
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

// Close modal if user presses Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    closeModal();
  }
});

// Theme(Light vs. Dark)
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  themeToggle.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme preference on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.textContent = "Light";
}
