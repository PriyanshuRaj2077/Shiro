<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo/shiro-logo-white.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs/logo/shiro-logo-black.svg">
    <img src="docs/logo/shiro-logo-white.svg" width="230" alt="Shiro Logo">
  </picture>
</p>

<p align="center">
  Look up any medicine — understand its purpose, usage, and possible side effects in plain language.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/backend-Spring%20Boot-green" alt="Backend">
  <img src="https://img.shields.io/badge/frontend-Vanilla%20JS-orange" alt="Frontend">
</p>

---

# Philosophy

Shiro is built on one idea: **radical simplicity**.

Medicine information on the web is often cluttered with advertisements, medical jargon, and unnecessary navigation. Shiro removes that complexity by providing a single, distraction-free search experience.

The name **Shiro (白)** means *white* in Japanese, representing clarity, simplicity, and minimal design.

---

# Features

### Current

- Search medicines by brand name
- Plain-language medicine information
- Purpose / Indications
- Mechanism of action (when available)
- Common side effects (when available)
- Intelligent fallback handling for incomplete API responses
- Responsive minimalist interface
- Lightweight About & Credits modal
- Backend REST API built with Spring Boot
- Real-time medicine lookup using the OpenFDA API

---

# Upcoming

- Multiple medicine search results
- Better search ranking
- Generic medicine suggestions
- Drug interaction lookup
- Medicine bookmarking
- Search history
- Caching frequently searched medicines
- AI-generated simplified medicine explanations

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Inter, Noto Sans JP)

## Backend

- Java 21
- Spring Boot 4.0.7
- Spring Web
- Maven
- RestClient
- Jackson JSON

## External API

- OpenFDA Drug Label API

---

# Architecture

```text
                User
                  │
                  ▼
         HTML + CSS + JavaScript
                  │
                  ▼
      GET /api/medicine/search
                  │
                  ▼
        Spring Boot Controller
                  │
                  ▼
          MedicineService
                  │
                  ▼
          OpenFdaClient
                  │
                  ▼
          OpenFDA REST API
                  │
                  ▼
        OpenFdaResponse DTO
                  │
                  ▼
      MedicineResponse DTO
                  │
                  ▼
            JSON Response
                  │
                  ▼
        Rendered in Browser
```

---

# Backend Structure

```text
backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/shiro/
│       │       ├── controller/
│       │       │   └── MedicineController.java
│       │       ├── service/
│       │       │   └── MedicineService.java
│       │       ├── client/
│       │       │   └── OpenFdaClient.java
│       │       └── dto/
│       │           ├── MedicineResponse.java
│       │           ├── OpenFdaResponse.java
│       │           ├── Result.java
│       │           └── OpenFda.java
│       └── resources/
│
├── pom.xml
├── mvnw
├── Dockerfile
└── .mvn/
```

---

# Project Structure

```text
shiro/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── Dockerfile
│
├── docs/
├── index.html
├── script.js
├── style.css
├── README.md
├── LICENSE
└── package-lock.json
```

---

# API

### Search Medicine

```text
GET /api/medicine/search?name={medicine}
```

Example:

```text
GET /api/medicine/search?name=dolo
```

The endpoint returns a JSON array of medicine results.

Example Response:

```json
[
  {
    "brandName": "DOLO-650",
    "genericName": "ACETAMINOPHEN",
    "purpose": "Pain reliever / Fever reducer",
    "mechanism": "Not Available",
    "sideEffects": [
      "Nausea",
      "Vomiting"
    ]
  }
]
```

---

# Running Locally

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend defaults to:

```text
http://localhost:8080
```

The application also supports a `PORT` environment variable for deployment platforms that assign the server port dynamically.

## Frontend

The frontend is a static HTML/CSS/JavaScript application.

Serve the repository root using any static server.

For example:

```bash
python -m http.server 5500
```

or use the VS Code Live Server extension.

---

# Deployment

Shiro is deployed using separate frontend and backend services.

## Frontend

Hosted on Vercel:

https://shiro-med.vercel.app

## Backend

Hosted on Render:

https://shiro-255r.onrender.com

The deployed frontend communicates with the Spring Boot REST API hosted on Render.

The production frontend is configured to use the deployed backend URL, while the backend retains port `8080` as its local default and supports the hosting platform's dynamically assigned `PORT`.

---

# Docker

The backend includes a multi-stage Dockerfile using Java 21.

The build stage uses a Java 21 JDK to compile the Spring Boot application, while the runtime stage uses a Java 21 JRE to run the generated JAR.

Build the backend image from the repository root:

```bash
docker build -t shiro-backend ./backend
```

Run the container locally:

```bash
docker run -p 8080:8080 shiro-backend
```

The application supports dynamic ports through the `PORT` environment variable when deployed to hosting platforms.

For example:

```bash
docker run -e PORT=8080 -p 8080:8080 shiro-backend
```

The Dockerfile was used by Render to build and deploy the backend container.

Local Docker CLI verification was not performed because Docker was unavailable in the development environment.

---

# Current Limitations

- Uses OpenFDA as the primary data source.
- Some medicines do not expose complete information because OpenFDA labels vary between manufacturers.
- Mechanism of action and side effects may not be available for every medicine.
- Currently searches by brand name.

---

# Disclaimer

Shiro provides educational information sourced from the OpenFDA Drug Label API.

It is **not** intended to replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before taking or changing any medication.

---

# Credits

- OpenFDA API
- U.S. Food & Drug Administration
- Google Fonts (Inter & Noto Sans JP)

---

# Author

**Priyanshu Raj**

GitHub:

https://github.com/PriyanshuRaj2077

---

# License

MIT License
