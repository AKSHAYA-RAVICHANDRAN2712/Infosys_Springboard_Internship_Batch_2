// MediSphere frontend API configuration.
// LOCAL development uses the local Spring Boot ports.
// After deploying the 3 backend services to Render, replace the three
// YOUR-*-SERVICE-URL values below with the actual Render service URLs.

const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const localApi = {
    FHIR: ["http://localhost:8083"],
    CONSENT: ["http://localhost:8081", "http://localhost:8080"],
    AUDIT: ["http://localhost:8082"]
};

const productionApi = {
    FHIR: ["https://YOUR-FHIR-SERVICE-URL.onrender.com"],
    CONSENT: ["https://YOUR-CONSENT-SERVICE-URL.onrender.com"],
    AUDIT: ["https://YOUR-AUDIT-SERVICE-URL.onrender.com"]
};

window.MEDISPHERE_API = isLocal ? localApi : productionApi;
