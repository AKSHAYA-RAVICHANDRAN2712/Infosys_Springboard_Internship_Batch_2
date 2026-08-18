import tensorflow as tf
import tensorflow_federated as tff
from datetime import datetime

from app.database import SessionLocal

from app.models import (
    FederatedRound,
    FederatedClientUpdate,
    FederatedMetric
)

from app.federated.clients import (
    create_client_data,
    create_evaluation_data
)

from app.federated.training import (
    create_federated_process
)

from app.federated.convergence import (
    ConvergenceChecker
)

from app.federated.local_training import (
    calculate_client_accuracy
)


def create_tf_dataset(x, y):
    return tf.data.Dataset.from_tensor_slices(
        (x, y)
    ).batch(20)


def evaluate_global_model(
    state,
    process,
    x_test,
    y_test
):

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(4,)),
        tf.keras.layers.Dense(
            16,
            activation="relu"
        ),
        tf.keras.layers.Dense(
            8,
            activation="relu"
        ),
        tf.keras.layers.Dense(
            2,
            activation="softmax"
        )
    ])

    model_weights = process.get_model_weights(
        state
    )

    model_weights.assign_weights_to(
        model
    )

    model.compile(
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    _, accuracy = model.evaluate(
        x_test,
        y_test,
        verbose=0
    )

    return float(accuracy)


def run_training(num_rounds=30):

    # -------------------------------------------------
    # Initialize TFF local execution context
    # -------------------------------------------------

    tff.backends.native.set_sync_local_cpp_execution_context(
        default_num_clients=4
    )

    # -------------------------------------------------
    # Create simulated clients
    # -------------------------------------------------

    clients = create_client_data()

    # -------------------------------------------------
    # Create global evaluation dataset
    # -------------------------------------------------

    x_test, y_test = create_evaluation_data()

    # -------------------------------------------------
    # Create TFF FedAvg process
    # -------------------------------------------------

    process = create_federated_process()

    # -------------------------------------------------
    # Initialize global model
    # -------------------------------------------------

    state = process.initialize()

    # -------------------------------------------------
    # Convergence configuration
    # -------------------------------------------------

    convergence_checker = ConvergenceChecker(
        threshold=0.0025,
        patience=3
    )

    # -------------------------------------------------
    # Convert client data to TensorFlow datasets
    # -------------------------------------------------

    client_datasets = [
        create_tf_dataset(x, y)
        for x, y in clients.values()
    ]

    # -------------------------------------------------
    # Database connection
    # -------------------------------------------------

    db = SessionLocal()

    try:

        # =============================================
        # Federated rounds
        # =============================================

        for round_number in range(
            1,
            num_rounds + 1
        ):

            started_at = datetime.utcnow()

            # -----------------------------------------
            # Get current global model weights
            # -----------------------------------------

            current_weights = (
                process.get_model_weights(state)
            )

            # -----------------------------------------
            # Calculate local accuracy
            # -----------------------------------------

            client_accuracies = {}

            for client_id, (x, y) in clients.items():

                local_accuracy = (
                    calculate_client_accuracy(
                        x,
                        y,
                        current_weights
                    )
                )

                client_accuracies[
                    client_id
                ] = local_accuracy

            # -----------------------------------------
            # Run TFF Federated Averaging
            # -----------------------------------------

            state, metrics = process.next(
                state,
                client_datasets
            )

            # -----------------------------------------
            # Evaluate global model
            # -----------------------------------------

            global_accuracy = (
                evaluate_global_model(
                    state,
                    process,
                    x_test,
                    y_test
                )
            )

            # -----------------------------------------
            # Check convergence
            # -----------------------------------------

            improvement, converged = (
                convergence_checker.check(
                    global_accuracy
                )
            )

            if converged:

                convergence_status = (
                    "CONVERGED"
                )

            else:

                convergence_status = (
                    "TRAINING"
                )

            # -----------------------------------------
            # Global model version
            # -----------------------------------------

            model_version = (
                f"global-v{round_number}"
            )

            # =========================================
            # Save Federated Round
            # =========================================

            federated_round = FederatedRound(

                round_number=round_number,

                global_model_version=(
                    model_version
                ),

                status="COMPLETED",

                expected_clients=len(
                    clients
                ),

                accepted_clients=len(
                    clients
                ),

                global_accuracy=(
                    global_accuracy
                ),

                improvement=(
                    improvement
                ),

                convergence_status=(
                    convergence_status
                ),

                started_at=(
                    started_at
                ),

                completed_at=(
                    datetime.utcnow()
                )
            )

            db.add(
                federated_round
            )

            db.flush()

            # =========================================
            # Save Client Updates
            # =========================================

            for client_id, (x, y) in (
                clients.items()
            ):

                client_update = (
                    FederatedClientUpdate(

                        round_id=(
                            federated_round.round_id
                        ),

                        client_id=(
                            client_id
                        ),

                        model_version=(
                            model_version
                        ),

                        sample_count=(
                            len(x)
                        ),

                        local_accuracy=(
                            client_accuracies[
                                client_id
                            ]
                        ),

                        update_reference=(
                            f"{model_version}-{client_id}"
                        ),

                        update_status=(
                            "ACCEPTED"
                        ),

                        submitted_at=(
                            datetime.utcnow()
                        )
                    )
                )

                db.add(
                    client_update
                )

            # =========================================
            # Save Global Accuracy Metric
            # =========================================

            accuracy_metric = FederatedMetric(

                round_id=(
                    federated_round.round_id
                ),

                metric_name=(
                    "global_accuracy"
                ),

                metric_value=(
                    global_accuracy
                ),

                improvement=(
                    improvement
                ),

                recorded_at=(
                    datetime.utcnow()
                )
            )

            db.add(
                accuracy_metric
            )

            # =========================================
            # Save Improvement Metric
            # =========================================

            improvement_metric = FederatedMetric(

                round_id=(
                    federated_round.round_id
                ),

                metric_name=(
                    "accuracy_improvement"
                ),

                metric_value=(
                    improvement
                ),

                improvement=(
                    improvement
                ),

                recorded_at=(
                    datetime.utcnow()
                )
            )

            db.add(
                improvement_metric
            )

            # =========================================
            # Commit round
            # =========================================

            db.commit()

            # =========================================
            # Display results
            # =========================================

            print(
                f"Round {round_number} | "
                f"Global Accuracy: "
                f"{global_accuracy * 100:.2f}% | "
                f"Improvement: "
                f"{improvement * 100:.4f}% | "
                f"Status: "
                f"{convergence_status}"
            )

            for client_id, accuracy in (
                client_accuracies.items()
            ):

                print(
                    f"  {client_id} "
                    f"Local Accuracy: "
                    f"{accuracy * 100:.2f}%"
                )

            # =========================================
            # Stop if converged
            # =========================================

            if converged:

                print(
                    f"\nModel converged at "
                    f"round {round_number}."
                )

                break

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    run_training()
