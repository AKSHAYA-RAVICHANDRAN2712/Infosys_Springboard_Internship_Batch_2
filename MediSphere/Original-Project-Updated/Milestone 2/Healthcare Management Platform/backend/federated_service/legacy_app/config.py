import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./federated_convergence.db")
DEFAULT_CONVERGENCE_THRESHOLD = float(os.getenv("CONVERGENCE_THRESHOLD", "0.001"))
DEFAULT_STABLE_ROUNDS = int(os.getenv("STABLE_ROUNDS", "2"))
DEFAULT_CLIENTS = int(os.getenv("FEDERATED_CLIENTS", "4"))
DEFAULT_ROUNDS = int(os.getenv("FEDERATED_ROUNDS", "8"))
