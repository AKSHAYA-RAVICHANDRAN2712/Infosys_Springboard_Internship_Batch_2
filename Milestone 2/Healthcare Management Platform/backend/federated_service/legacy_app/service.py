from datetime import datetime, timezone
from sqlalchemy.orm import Session

from .convergence import ConvergenceDetector
from .data import create_client_datasets
from .federated import create_federated_algorithm, make_tf_dataset
from .federated import evaluate_global_weights, client_update_metrics
from .models import FederatedRound, FederatedClientUpdate, FederatedMetric

def now():
    return datetime.now(timezone.utc)

def run_federated_training(db: Session, rounds=8, clients=4,
                           convergence_threshold=0.001, stable_rounds=2):
    client_data = create_client_datasets(num_clients=clients)
    algorithm = create_federated_algorithm()
    state = algorithm.initialize()

    detector = ConvergenceDetector(convergence_threshold, stable_rounds)
    history = []
    previous_accuracy = None

    for round_number in range(1, rounds + 1):
        started = now()

        client_datasets = [make_tf_dataset(c) for c in client_data]

        # Actual TensorFlow Federated weighted FedAvg.
        state, train_metrics = algorithm.next(state, client_datasets)

        accuracy = evaluate_global_weights(state.global_model_weights, client_data)
        result = detector.update(accuracy, previous_accuracy)
        improvement = result["improvement"]

        round_record = FederatedRound(
            round_number=round_number,
            global_model_version=f"global-v{round_number}",
            status="CONVERGED" if result["converged"] else "COMPLETED",
            expected_clients=clients,
            accepted_clients=clients,
            global_accuracy=accuracy,
            improvement=improvement,
            convergence_status="CONVERGED" if result["converged"] else "NOT_CONVERGED",
            started_at=started,
            completed_at=now(),
        )
        db.add(round_record)
        db.flush()

        for client in client_data:
            local_accuracy = client_update_metrics(client, state.global_model_weights)
            db.add(FederatedClientUpdate(
                round_id=round_record.round_id,
                client_id=client["client_id"],
                model_version=f"global-v{round_number}",
                sample_count=len(client["train_x"]),
                local_accuracy=local_accuracy,
                update_reference=f"round-{round_number}/{client['client_id']}",
                update_status="ACCEPTED",
                submitted_at=now(),
            ))

        db.add(FederatedMetric(
            round_id=round_record.round_id,
            metric_name="global_accuracy",
            metric_value=accuracy,
            improvement=improvement,
            recorded_at=now(),
        ))
        db.add(FederatedMetric(
            round_id=round_record.round_id,
            metric_name="convergence_threshold",
            metric_value=convergence_threshold,
            improvement=0.0,
            recorded_at=now(),
        ))

        db.commit()

        item = {
            "round_number": round_number,
            "global_model_version": f"global-v{round_number}",
            "expected_clients": clients,
            "accepted_clients": clients,
            "global_accuracy": round(accuracy, 6),
            "improvement": round(improvement, 6),
            "convergence_status": "CONVERGED" if result["converged"] else "NOT_CONVERGED",
        }
        history.append(item)

        print(
            f"Round {round_number} | Accuracy: {accuracy:.4f} | "
            f"Improvement: {improvement:.4f} | Converged: {result['converged']}"
        )

        previous_accuracy = accuracy
        if result["converged"]:
            break

    return history
