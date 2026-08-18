# Medisphere Healthcare Platform — Full Integration

React frontend → Flask backend → PostgreSQL, wired end-to-end for:

- **Model Versioning** (list / register / activate / archive model versions)
- **Prediction** (run the active model against a patient)
- **SHAP Explainability** (explain a patient's most recent prediction)

`Patients`, `Federated Training`, `Analytics`, and `Reports` remain mock UI —
they were out of scope for this integration.

```
Medisphere-Healthcare-Platform/
├── backend/          Flask API + model registry + SHAP + PostgreSQL schema
└── frontend/         React (Vite) app, hits the backend at http://127.0.0.1:5000
```

## 1. Prerequisites

- Python 3.10+ (`python --version`)
- Node.js 18+ (`node --version`)
- PostgreSQL running locally, with a database created for this project

## 2. Database setup (Windows, `psql`)

Open a terminal (Command Prompt or PowerShell) and run, replacing `medisphere`
with your own DB name if different:

```bat
psql -U postgres -c "CREATE DATABASE medisphere;"

cd backend\database
psql -U postgres -d medisphere -f ml_model_versioning.sql
psql -U postgres -d medisphere -f shap_explainability.sql
psql -U postgres -d medisphere -f updates.sql
psql -U postgres -d medisphere -f ml_patient_data.sql
```

`ml_patient_data.sql` also seeds three sample patients (`P001`, `P002`,
`P003`) so you can test `/predict` and `/explain` immediately without
waiting on real patient data.

## 3. Backend setup (Windows)

```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

copy .env.example .env
notepad .env
```

Edit `.env` with your real PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medisphere
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

Train an initial model version (this also inserts the first
`model_versions` row with `status='Active'`, so `/models/active` and
predictions have something to use right away):

```bat
python train_model.py
```

Start the API:

```bat
python app.py
```

You should see Flask running at `http://127.0.0.1:5000`. Leave this
terminal open.

## 4. Frontend setup (Windows)

Open a **second** terminal:

```bat
cd frontend
npm install
npm run dev
```

Vite serves the app at `http://localhost:5177` (configured in
`vite.config.js`) and opens it automatically. The backend's CORS is
already configured to allow this exact origin — no changes needed.

Log in with either demo account (there's no real `/auth/login` route on
the backend yet, so the frontend falls back to these built-in demo
users):

- `admin@clinicalops.com` / `admin123`
- `doctor@clinicalops.com` / `doctor123`

## 5. Testing the real end-to-end flow

Go to **Models** in the sidebar.

1. **Model Versioning panel** — you should see the version inserted by
   `train_model.py`, marked `Active`. Try **Register version** to add a
   second one, then **Activate** it — the previous version flips to
   `Archived` automatically (single-transaction, enforced server-side
   in `model_registry.py`).
2. **SHAP Explainability panel** — enter `P001` and click **Explain**.
   - If no prediction exists yet for that patient, you'll see a **"Run
     prediction for this patient"** button — click it, which calls
     `POST /predict`, then automatically retries the explanation.
   - Once a prediction exists, you'll see the live SHAP feature
     contributions (`GET /explain/P001`), pulled from the model version
     that actually produced that prediction — not necessarily the
     currently active one.
3. Go to **Dashboard** — the prediction panel there lets you run
   `POST /predict` directly for any patient ID and see the resulting
   risk level, confidence score, and prediction ID.

### Verifying in PostgreSQL directly

```bat
psql -U postgres -d medisphere -c "SELECT version_id, model_name, version_number, status FROM model_versions ORDER BY version_id;"
psql -U postgres -d medisphere -c "SELECT prediction_id, patient_id, model_version_id, prediction_result, confidence_score FROM predictions ORDER BY prediction_id DESC LIMIT 5;"
psql -U postgres -d medisphere -c "SELECT prediction_id, feature_name, feature_value, shap_value, feature_rank FROM shap_explanations ORDER BY prediction_id DESC, feature_rank LIMIT 20;"
```

## 6. API reference

| Method | Route                          | Purpose                                             |
|--------|---------------------------------|------------------------------------------------------|
| GET    | `/`                              | Health check                                          |
| POST   | `/predict`                       | `{ "patient_id": "P001" }` → run active model, store + return the prediction |
| GET    | `/explain/<patient_id>`          | SHAP explanation for that patient's latest prediction |
| GET    | `/models`                        | List all model versions                               |
| GET    | `/models/active`                 | Get the currently active version                      |
| GET    | `/models/<version_id>`           | Get one model version                                  |
| POST   | `/models`                        | Register a new model version (always inserted `Inactive`) |
| PUT    | `/models/<version_id>/activate`  | Activate this version, archive the previous active one |
| PUT    | `/models/<version_id>/archive`   | Archive this version                                    |

## 7. What was fixed in this integration pass

- **`frontend/src/services/api.js`** — was pointed at
  `http://localhost:3000/api` (a placeholder that doesn't exist). Now
  points at `http://127.0.0.1:5000` with no `/api` prefix, matching the
  Flask app's routes, and is overridable via `VITE_API_URL`.
- **`ModelVersioning.jsx`** — was static mock data with client-only
  state. Now fetches `GET /models` on load, and `Activate`/`Archive`/
  `Register` call the real `PUT`/`POST` endpoints and refresh the list.
- **`ShapExplainability.jsx`** — was a dropdown over hardcoded SHAP
  values keyed by a fake model version. Now takes a patient ID, calls
  `GET /explain/<patient_id>`, and offers to trigger `POST /predict`
  first if that patient has no prediction yet.
- **`PredictionPanel.jsx`** (Dashboard) — was fully static text. Now
  takes a patient ID and calls `POST /predict` for a live result.
- **`Models.jsx`** — now owns a single `GET /models` fetch shared by
  both panels via props, so Activate/Archive/Register in one panel
  can't leave the other panel showing stale data.
- Backend (`app.py`, `db.py`, `model_registry.py`, `predict.py`,
  `shap_explain.py`) is carried over unchanged from
  `Medisphere-ML-Backend-FINAL.zip` — it was already refactored into
  real functions with no import-time side effects, active-version
  lookups instead of hardcoded `v1.0`, and per-request DB connections.
  Nothing in it was reverted or replaced.
- Added `.env.example` for both backend and frontend so setup doesn't
  require guessing variable names. No real `.env`, passwords, or keys
  are included anywhere in this ZIP.

## 8. Known limitations / things to verify on your machine

- This was assembled and reviewed in a sandbox with **no PostgreSQL
  instance and no access to install `flask-cors`/`shap`/`psycopg2`**,
  so the full request → DB → response path could not be executed live
  end-to-end here. What *was* verified in-sandbox:
  - Every backend `.py` file compiles cleanly (`python -m py_compile`).
  - The Flask app was started with `psycopg2`/`flask_cors`/`shap`
    stubbed out, and every route was exercised with a test client —
    confirming routing, status codes (400/404/500), and CORS
    configuration are all correct, independent of a real database.
  - All new/edited frontend files pass a structural syntax check
    (balanced braces/JSX, no stray old API references) but could not
    be run through a live `npm run build` (no package registry access
    in this sandbox).
- **Run a real `npm run dev` and click through the flow once on your
  machine** before you consider this done — that's the one step this
  environment genuinely could not perform for you.
- `train_model.py` must be run at least once (or a version registered
  manually via the UI/API) before `/models/active` and `/predict` have
  anything to use.
