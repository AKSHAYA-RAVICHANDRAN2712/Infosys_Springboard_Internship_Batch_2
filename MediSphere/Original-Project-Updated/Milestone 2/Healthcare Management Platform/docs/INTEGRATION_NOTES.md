# Integration notes

The original submissions were not identical in runtime architecture. The integration keeps the supplied models/data and API concepts but removes duplicated startup logic and aligns all services to the shared PostgreSQL schema.

Model Accuracy keeps the supplied tuned Random Forest `.joblib` and metrics JSON.

SHAP keeps the supplied `model.pkl`, five-feature explanation contract, validity checks, and result structure, and adds database persistence directly to the Flask endpoint.

Federated convergence keeps the supplied four-client synthetic demonstration concept and database tables. The default runtime uses weighted FedAvg in NumPy for Python-version portability; the original TensorFlow Federated implementation remains available as legacy reference.
