// MediSphere frontend <-> backend integration.
// Backends currently used by Team C:
//   Patient Consent: 8081 (fallback 8080 for the standalone build)
//   HIPAA Audit:     8082
//   FHIR Validation: 8083

const API = window.MEDISPHERE_API || {};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[ch]));
}

function showResult(element, ok, message, errors = []) {
  if (!element) return;
  const safeErrors = Array.isArray(errors) ? errors : [errors];
  const list = safeErrors.filter(Boolean).length
    ? `<ul class="mb-0 mt-2">${safeErrors.filter(Boolean).map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`
    : '';
  element.innerHTML = `<div class="alert ${ok ? 'alert-success' : 'alert-danger'}"><strong>${escapeHtml(message)}</strong>${list}</div>`;
}

function serviceBases(service) {
  const configured = API[service];
  if (Array.isArray(configured)) return configured.filter(Boolean);
  if (configured) return [configured];
  return [];
}

async function apiRequest(service, path, options = {}) {
  const bases = serviceBases(service);
  if (!bases.length) throw new Error(`${service} API is not configured.`);

  let lastError;
  for (const base of bases) {
    try {
      const response = await fetch(`${base}${path}`, options);
      // Try the next configured base only when this base clearly isn't serving the endpoint.
      if (response.status === 404 || response.status === 405) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Unable to reach backend service.');
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text); }
  catch { return { message: text }; }
}

// ---------------- Patient Consent ----------------
const consentForm = document.getElementById('consentForm');
const patientIdOptions = document.getElementById('patientIdOptions');
const consentResultBox = document.getElementById('consentResultBox');

async function loadPatientIds() {
  if (!patientIdOptions) return;
  try {
    const response = await apiRequest('CONSENT', '/api/consent/patients');
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.message || `Patient service returned HTTP ${response.status}.`);

    const patients = Array.isArray(data) ? data : (data.patients || data.data || []);
    patientIdOptions.innerHTML = patients
      .map(p => `<option value="${escapeHtml(typeof p === 'string' ? p : p.patientId)}"></option>`)
      .join('');

    const total = document.querySelector('.patient-total-count');
    if (total && patients.length) total.textContent = patients.length.toLocaleString();
  } catch (error) {
    console.warn('Patient list could not be loaded:', error);
    // The verification API remains usable even if the optional patient-list endpoint is unavailable.
  }
}

if (consentForm) {
  loadPatientIds();
  document.getElementById('refreshPatientsBtn')?.addEventListener('click', loadPatientIds);

  consentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = document.getElementById('verifyConsentBtn');
    const patientId = document.getElementById('consentPatientId')?.value.trim();
    const consentType = document.getElementById('consentType')?.value;
    const authorizedBy = document.getElementById('authorizedBy')?.value.trim();

    if (!patientId || !consentType || !authorizedBy) {
      showResult(consentResultBox, false, 'Please fill all required fields.');
      return;
    }

    const payload = {
      patientId,
      consentType,
      consentStatus: document.getElementById('consentStatus')?.value === 'true',
      authorizedBy
    };

    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Verifying...';

    try {
      const response = await apiRequest('CONSENT', '/api/consent/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await readJson(response);
      const ok = response.ok && String(data.status || '').toUpperCase() === 'SUCCESS';
      showResult(
        consentResultBox,
        ok,
        data.message || (ok ? 'Patient consent verified successfully.' : 'Patient consent verification failed.'),
        data.errors || []
      );
    } catch (error) {
      showResult(consentResultBox, false, 'Could not reach Patient Consent Service. Check the configured backend port and CORS settings.');
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-shield-check"></i> Verify';
    }
  });
}

// ---------------- FHIR Validation ----------------
const fhirFileInput = document.querySelector('.upload-file-input');
const validateBtn = document.getElementById('validateBtn');
const resultResourceType = document.getElementById('resultResourceType');
const resultStatus = document.getElementById('resultStatus');
const resultCheckedOn = document.getElementById('resultCheckedOn');
const resultMessage = document.getElementById('resultMessage');
const validationErrorsBody = document.getElementById('validationErrorsBody');

if (validateBtn && fhirFileInput) {
  validateBtn.addEventListener('click', async () => {
    if (!fhirFileInput.files.length) {
      alert('Please choose a FHIR Patient JSON file first.');
      return;
    }

    validateBtn.disabled = true;
    validateBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Validating...';

    try {
      const text = await fhirFileInput.files[0].text();
      let payload;
      try { payload = JSON.parse(text); }
      catch { throw new Error('The selected file is not valid JSON.'); }

      const response = await apiRequest('FHIR', '/api/fhir/patient/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await readJson(response);
      const success = response.ok && String(data.status || '').toUpperCase() === 'SUCCESS';
      const errors = Array.isArray(data.errors) ? data.errors : [];

      resultResourceType.textContent = payload.resourceType || '-';
      resultCheckedOn.textContent = new Date().toLocaleString();
      resultMessage.textContent = data.message || (success ? 'FHIR resource is valid.' : 'FHIR validation failed.');
      resultStatus.innerHTML = success
        ? '<span class="pill pill-green">Valid</span>'
        : '<span class="pill pill-red">Invalid</span>';

      validationErrorsBody.innerHTML = errors.length
        ? errors.map(error => `<tr><td>FHIR resource</td><td>${escapeHtml(error)}</td><td><span class="pill pill-red">High</span></td></tr>`).join('')
        : '<tr><td colspan="3" class="text-muted">No validation errors.</td></tr>';

      if (window.renderDonut) {
        window.renderDonut('fhirDonut', success ? [1, 0] : [0, 1], ['#4ade80', '#ef4444']);
      }
    } catch (error) {
      resultStatus.innerHTML = '<span class="pill pill-red">Error</span>';
      resultMessage.textContent = error.message || 'FHIR validation service is unavailable.';
      validationErrorsBody.innerHTML = `<tr><td colspan="3">${escapeHtml(error.message)}</td></tr>`;
    } finally {
      validateBtn.disabled = false;
      validateBtn.innerHTML = '<i class="bi bi-check2-circle"></i> Validate Resource';
    }
  });
}

// ---------------- HIPAA Audit Logs ----------------
const auditTableBody = document.getElementById('auditLogsBody');

async function loadAuditLogs() {
  if (!auditTableBody) return;
  auditTableBody.innerHTML = '<tr><td colspan="7" class="text-muted">Loading audit logs...</td></tr>';

  try {
    const response = await apiRequest('AUDIT', '/api/audit/logs', { headers: { 'Accept': 'application/json' } });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.message || `Audit service returned HTTP ${response.status}.`);

    const logs = Array.isArray(data) ? data : (data.logs || data.data || []);
    const successCount = logs.filter(log => String(log.status || '').toUpperCase() === 'SUCCESS').length;
    const failedCount = logs.length - successCount;

    auditTableBody.innerHTML = logs.length ? logs.map(log => {
      const success = String(log.status || '').toUpperCase() === 'SUCCESS';
      const ts = log.timestamp ? new Date(log.timestamp).toLocaleString() : '-';
      return `<tr class="audit-row">
        <td>${escapeHtml(ts)}</td>
        <td>${escapeHtml(log.module || '-')}</td>
        <td>${escapeHtml(log.source || 'Service')}</td>
        <td>${escapeHtml(log.action || '-')}</td>
        <td>${escapeHtml((log.resourceType || '-') + ' / ' + (log.resourceId || '-'))}</td>
        <td><span class="pill ${success ? 'pill-green' : 'pill-red'}">${success ? 'Success' : 'Failed'}</span></td>
        <td>${escapeHtml(log.ipAddress || '-')}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="text-muted">No audit logs found.</td></tr>';

    const cards = document.querySelectorAll('.stat-card-v2 h3');
    if (cards.length >= 3 && logs.length) {
      cards[0].textContent = logs.length.toLocaleString();
      cards[1].textContent = successCount.toLocaleString();
      cards[2].textContent = failedCount.toLocaleString();
      const successPct = (successCount / logs.length * 100).toFixed(1);
      const failedPct = (failedCount / logs.length * 100).toFixed(1);
      cards[1].nextElementSibling?.replaceChildren(document.createTextNode(`${successPct}%`));
      cards[2].nextElementSibling?.replaceChildren(document.createTextNode(`${failedPct}%`));
    }
  } catch (error) {
    auditTableBody.innerHTML = `<tr><td colspan="7" class="text-danger">${escapeHtml(error.message || 'Could not load audit logs.')}</td></tr>`;
  }
}

if (auditTableBody) {
  loadAuditLogs();
  document.getElementById('refreshAuditBtn')?.addEventListener('click', loadAuditLogs);
}
