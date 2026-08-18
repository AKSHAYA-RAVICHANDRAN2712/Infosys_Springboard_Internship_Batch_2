# MediSphere AI Predictions - Integrated Milestone 2

This package combines the three submitted components into one runnable local project with a shared PostgreSQL persistence layer and the supplied static frontend.

## Components

- **Model Accuracy** — FastAPI, Random Forest, PostgreSQL. Port `8091`.
- **Federated Convergence** — FastAPI, dependency-light weighted Federated Averaging simulation with four synthetic clients, PostgreSQL. Port `8092`.
- **SHAP Explanation Validity** — Flask + SHAP + supplied `model.pkl`, PostgreSQL. Port `8093`.
- **Frontend** — static HTML/CSS/JS. Port `5500`.

## Important architecture decision

The submitted SHAP package contained a Spring Boot gateway plus a Python Flask ML service. The original Spring Boot controller only forwarded requests and did not persist SHAP results. For a direct-run integrated demo, the frontend calls the Python SHAP service directly and the Flask service persists `shap_prediction`, `shap_feature`, and `shap_validation`. The original Spring Boot project is retained in the source archive but is not required for the default local run.

The submitted Federated package had two competing implementations and required TensorFlow/TensorFlow Federated versions that are problematic on current Python 3.14 installations. The default integrated runner uses genuine weighted Federated Averaging implemented with NumPy so the whole project can run in the same Python environment. The original TFF implementation is preserved under `backend/federated_service/legacy_app/` and its dependencies are listed in `requirements-tff-legacy.txt`.

## Database

The shared DB schema contains the six supplied Model Accuracy/SHAP tables plus the three federated tables used by the submitted federated backend:

- `ml_model`
- `model_metrics`
- `model_predictions`
- `shap_prediction`
- `shap_feature`
- `shap_validation`
- `federated_round`
- `federated_client_update`
- `federated_metric`

Existing team-owned tables such as `patients` and `audit_logs` are intentionally not modified.

## First-time Windows setup

1. Copy `.env.example` to `.env`.
2. Put the real shared PostgreSQL `DATABASE_URL` in `.env`. Do not commit `.env`.
3. Run `run_all_windows.bat`.
4. Open `http://127.0.0.1:5500`.
5. Model Accuracy docs: `http://127.0.0.1:8091/docs`.
6. Federated docs: `http://127.0.0.1:8092/docs`.
7. SHAP health: `http://127.0.0.1:8093/api/health`.

## Test order

1. `/api/model/health` and `/api/model/accuracy`.
2. `/api/model/predict` with the 15-feature JSON from the Model Accuracy component.
3. Open Federated Convergence and click **Train**; then refresh.
4. Open SHAP Validity, enter age, blood pressure, cholesterol, BMI and glucose, and click **Search / Predict**.
5. Refresh the Dashboard.

## Security

A real PostgreSQL credential appeared in the submitted source files. Rotate that password before using the shared database for a real submission, and keep the new URL only in `.env`.
