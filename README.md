# 🔴Shiro (白)

A minimalist medicine information lookup tool. Search a medicine, understand what it is, what it's for, and how it works in your body — in plain language, with no clutter.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Philosophy

Shiro is built on one idea: **radical simplicity**. No dashboards, no ads, no unnecessary UI. One search box, one clean result. The name *Shiro* (白) means "white" in Japanese — a nod to the clean, minimal aesthetic the whole project is built around.

---

## Features

### Current (Frontend)
- Minimalist single-page interface — logo, search box, nothing else
- Clean, distraction-free result display (medicine name, purpose, mechanism, side effects)
- Responsive design — works on mobile, tablet, and desktop
- About and Credits sections via lightweight modals

### Planned (Backend)
- Real-time medicine data lookup via the [openFDA API](https://open.fda.gov/apis/)
- Caching layer — searched medicines are stored locally so repeat lookups are instant
- Search history for registered users
- Save medicines to a personal list ("my medicines")
- Basic drug interaction checks (future phase)

---

## Tech Stack

**Frontend**
- HTML5, CSS3, Vanilla JavaScript (no frameworks, no build tools)
- Google Fonts: Inter, Noto Sans JP

**Backend** *(in progress)*
- Java 17
- Spring Boot 3 (Spring Web, Spring Data JPA, Spring Security)
- MySQL
- Maven

**Data Source**
- [openFDA API](https://open.fda.gov/apis/) — free, public FDA drug data

**Deployment** *(planned)*
- Frontend: Vercel
- Backend: Render

---

## Project Structure

```
shiro/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   └── (Spring Boot project — coming soon)
└── README.md
```

---

## Getting Started (Frontend)

The frontend currently runs against mock data while the backend is under development.

```bash
cd frontend
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## API Contract

The frontend expects the backend to expose:

```
GET /api/medicine/search?name={query}
```

**Response shape:**
```json
{
  "genericName": "Acetaminophen",
  "brandName": "Tylenol",
  "purpose": "Relieves mild to moderate pain and reduces fever.",
  "mechanism": "Inhibits prostaglandin synthesis in the central nervous system.",
  "sideEffects": ["Nausea", "Headache", "Allergic reaction (rare)"]
}
```

If no result is found, the frontend displays a plain "No results found." message.

---

## Disclaimer

Shiro provides informational data sourced from the openFDA API for educational purposes only. It is **not** a substitute for professional medical advice. Always consult a doctor or pharmacist regarding your medication.

---

## Credits

- Drug data provided free by the [openFDA API](https://open.fda.gov/), maintained by the U.S. Food & Drug Administration.
- Fonts via [Google Fonts](https://fonts.google.com/) (Inter, Noto Sans JP).

---

## Author

Built by **Priyanshu Raj** ([@PriyanshuRaj2077](https://github.com/PriyanshuRaj2077)) as a personal learning project — combining Java/Spring Boot backend development with a focus on clean, minimalist product design.

---

## License

MIT License — free to use, modify, and distribute.
