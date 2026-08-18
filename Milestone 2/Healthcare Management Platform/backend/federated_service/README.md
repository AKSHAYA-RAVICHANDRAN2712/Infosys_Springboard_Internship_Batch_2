# Federated Convergence

The default service uses a dependency-light weighted Federated Averaging implementation with four synthetic clients. It keeps patient data out of the demonstration and persists rounds, client updates and metrics to PostgreSQL.

The original TensorFlow Federated implementation is preserved under `legacy_app/` for reference. It is not the default runner because the submitted TFF/TensorFlow versions are not compatible with every current Python installation (especially Python 3.14).
