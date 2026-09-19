from fastapi import FastAPI
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models import (
    FederatedRound,
    FederatedClientUpdate,
    FederatedMetric
)

from app.federated.round_runner import run_training


app = FastAPI(
    title="MediSphere Federated Convergence API",
    version="1.0.0"
)


# ---------------------------------------------------------
# Root
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "component": "Federated Round Convergence",
        "status": "running"
    }


# ---------------------------------------------------------
# Get all federated rounds
# ---------------------------------------------------------

@app.get("/api/federated/rounds")
def get_rounds():

    db: Session = SessionLocal()

    try:

        rounds = (
            db.query(FederatedRound)
            .order_by(
                FederatedRound.round_number.asc()
            )
            .all()
        )

        return [
            {
                "round_id": r.round_id,
                "round_number": r.round_number,
                "global_model_version": (
                    r.global_model_version
                ),
                "status": r.status,
                "expected_clients": (
                    r.expected_clients
                ),
                "accepted_clients": (
                    r.accepted_clients
                ),
                "global_accuracy": (
                    r.global_accuracy
                ),
                "improvement": r.improvement,
                "convergence_status": (
                    r.convergence_status
                ),
                "started_at": r.started_at,
                "completed_at": r.completed_at
            }
            for r in rounds
        ]

    finally:

        db.close()


# ---------------------------------------------------------
# Get latest round
# ---------------------------------------------------------

@app.get("/api/federated/rounds/latest")
def get_latest_round():

    db: Session = SessionLocal()

    try:

        latest = (
            db.query(FederatedRound)
            .order_by(
                FederatedRound.round_id.desc()
            )
            .first()
        )

        if latest is None:

            return {
                "message": "No federated rounds found"
            }

        return {
            "round_id": latest.round_id,
            "round_number": latest.round_number,
            "global_model_version": (
                latest.global_model_version
            ),
            "global_accuracy": (
                latest.global_accuracy
            ),
            "improvement": latest.improvement,
            "convergence_status": (
                latest.convergence_status
            ),
            "accepted_clients": (
                latest.accepted_clients
            )
        }

    finally:

        db.close()


# ---------------------------------------------------------
# Get convergence status
# ---------------------------------------------------------

@app.get("/api/federated/convergence")
def get_convergence():

    db: Session = SessionLocal()

    try:

        latest = (
            db.query(FederatedRound)
            .order_by(
                FederatedRound.round_id.desc()
            )
            .first()
        )

        if latest is None:

            return {
                "converged": False,
                "message": (
                    "No training has been performed"
                )
            }

        return {
            "round": latest.round_number,
            "accuracy": latest.global_accuracy,
            "improvement": latest.improvement,
            "status": latest.convergence_status,
            "converged": (
                latest.convergence_status
                == "CONVERGED"
            )
        }

    finally:

        db.close()


# ---------------------------------------------------------
# Get client updates for a round
# ---------------------------------------------------------

@app.get(
    "/api/federated/rounds/{round_id}/clients"
)
def get_client_updates(round_id: int):

    db: Session = SessionLocal()

    try:

        updates = (
            db.query(FederatedClientUpdate)
            .filter(
                FederatedClientUpdate.round_id
                == round_id
            )
            .all()
        )

        return [
            {
                "update_id": u.update_id,
                "client_id": u.client_id,
                "model_version": u.model_version,
                "sample_count": u.sample_count,
                "local_accuracy": u.local_accuracy,
                "update_reference": (
                    u.update_reference
                ),
                "update_status": (
                    u.update_status
                ),
                "submitted_at": u.submitted_at
            }
            for u in updates
        ]

    finally:

        db.close()


# ---------------------------------------------------------
# Get metrics for a round
# ---------------------------------------------------------

@app.get(
    "/api/federated/rounds/{round_id}/metrics"
)
def get_round_metrics(round_id: int):

    db: Session = SessionLocal()

    try:

        metrics = (
            db.query(FederatedMetric)
            .filter(
                FederatedMetric.round_id
                == round_id
            )
            .all()
        )

        return [
            {
                "metric_id": m.metric_id,
                "metric_name": m.metric_name,
                "metric_value": m.metric_value,
                "improvement": m.improvement,
                "recorded_at": m.recorded_at
            }
            for m in metrics
        ]

    finally:

        db.close()


# ---------------------------------------------------------
# Dashboard
# ---------------------------------------------------------

@app.get("/api/federated/dashboard")
def get_dashboard():

    db: Session = SessionLocal()

    try:

        rounds = (
            db.query(FederatedRound)
            .order_by(
                FederatedRound.round_number.asc()
            )
            .all()
        )

        if not rounds:

            return {
                "component": (
                    "Federated Round Convergence"
                ),
                "status": "NO_TRAINING_DATA",
                "total_rounds": 0
            }

        latest = rounds[-1]

        if (
            latest.convergence_status
            == "CONVERGED"
        ):
            status = "CONVERGED"
        else:
            status = "TRAINING"

        return {
            "component": (
                "Federated Round Convergence"
            ),
            "status": status,
            "total_rounds": len(rounds),
            "current_round": (
                latest.round_number
            ),
            "global_model_version": (
                latest.global_model_version
            ),
            "global_accuracy": (
                latest.global_accuracy
            ),
            "improvement": (
                latest.improvement
            ),
            "convergence_status": (
                latest.convergence_status
            ),
            "expected_clients": (
                latest.expected_clients
            ),
            "accepted_clients": (
                latest.accepted_clients
            )
        }

    finally:

        db.close()


# ---------------------------------------------------------
# Start federated training
# ---------------------------------------------------------

@app.post("/api/federated/train")
def start_training():

    run_training()

    return {
        "message": (
            "Federated training completed"
        )
    }
