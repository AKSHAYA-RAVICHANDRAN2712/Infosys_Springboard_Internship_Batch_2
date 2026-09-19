import json
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)


class ModelTrainer:

    TRAINING_RATIO = 0.80
    RANDOM_SEED = 42

    def train_model(self, features, targets):

        print("--------------------------------")
        print("Dataset Split")
        print("--------------------------------")

        # Keep the final test set completely separate
        train_x, test_x, train_y, test_y = train_test_split(
            features,
            targets,
            test_size=1 - self.TRAINING_RATIO,
            random_state=self.RANDOM_SEED,
            stratify=targets
        )

        print("Total rows:", len(features))
        print("Training rows:", len(train_x))
        print("Testing rows:", len(test_x))

        # --------------------------------
        # Hyperparameter tuning
        # --------------------------------

        print("--------------------------------")
        print("Tuning Random Forest...")
        print("--------------------------------")

        base_model = RandomForestClassifier(
            random_state=self.RANDOM_SEED,
            class_weight="balanced",
            n_jobs=-1
        )

        parameter_grid = {
            "n_estimators": [100, 200],
            "max_depth": [None, 10, 20],
            "min_samples_split": [2, 5],
            "min_samples_leaf": [1, 2]
        }

        grid_search = GridSearchCV(
            estimator=base_model,
            param_grid=parameter_grid,
            scoring="f1",
            cv=5,
            n_jobs=-1,
            verbose=1
        )

        grid_search.fit(train_x, train_y)

        model = grid_search.best_estimator_

        # Save trained model
        model_path = Path(__file__).resolve().parents[1] / "models" / "random_forest_model.joblib"
        model_path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(model, model_path)

        print("--------------------------------")
        print("Model saved successfully!")
        print("--------------------------------")
        print("Model path:", model_path)

        print("--------------------------------")
        print("Best Random Forest Parameters")
        print("--------------------------------")
        print(grid_search.best_params_)

        print("--------------------------------")
        print("Training completed!")
        print("--------------------------------")

        # --------------------------------
        # Final test-set prediction
        # --------------------------------

        predictions = model.predict(test_x)

        # --------------------------------
        # Model Evaluation
        # --------------------------------

        accuracy = accuracy_score(
            test_y,
            predictions
        ) * 100

        precision = precision_score(
            test_y,
            predictions,
            zero_division=0
        ) * 100

        recall = recall_score(
            test_y,
            predictions,
            zero_division=0
        ) * 100

        f1 = f1_score(
            test_y,
            predictions,
            zero_division=0
        ) * 100

        matrix = confusion_matrix(
            test_y,
            predictions
        )

        correct_predictions = sum(
            predictions == test_y
        )

        metrics = {
            "model": "Random Forest",
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "confusion_matrix": matrix.tolist(),
            "training_samples": len(train_x),
            "testing_samples": len(test_x),
            "best_parameters": grid_search.best_params_
        }

        metrics_path = (
            Path(__file__).resolve().parents[1]
            / "models"
            / "model_metrics.json"
        )
        metrics_path.parent.mkdir(parents=True, exist_ok=True)

        with open(metrics_path, "w", encoding="utf-8") as file:
            json.dump(metrics, file, indent=4)

        print("--------------------------------")
        print("Model metrics saved successfully!")
        print("--------------------------------")
        print("Metrics path:", metrics_path)

        print("--------------------------------")
        print("Final Model Evaluation")
        print("--------------------------------")

        print(
            "Correct predictions:",
            correct_predictions
        )

        print(
            "Total test samples:",
            len(test_y)
        )

        print(
            f"Accuracy: {accuracy:.2f}%"
        )

        print(
            f"Precision: {precision:.2f}%"
        )

        print(
            f"Recall: {recall:.2f}%"
        )

        print(
            f"F1 Score: {f1:.2f}%"
        )

        print("--------------------------------")
        print("Confusion Matrix")
        print("--------------------------------")

        print(matrix)

        print("--------------------------------")

        return {
            "model": model,
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "confusion_matrix": matrix.tolist(),
            "training_samples": len(train_x),
            "testing_samples": len(test_x),
            "best_parameters": grid_search.best_params_
        }