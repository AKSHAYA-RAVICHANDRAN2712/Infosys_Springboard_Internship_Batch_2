from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import numpy as np
import pandas as pd
import shap

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "data",
    "framingham.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.pkl"
)

FEATURES = [
    "age",
    "sysBP",
    "totChol",
    "BMI",
    "glucose"
]

TARGET = "TenYearCHD"

DISPLAY_NAMES = {
    "age": "Age",
    "sysBP": "Blood Pressure",
    "totChol": "Cholesterol",
    "BMI": "BMI",
    "glucose": "Glucose"
}

SAMPLE_INDEX = 10

print("\n============================================")
print("LOADING FRAMINGHAM DATASET")
print("============================================")

df = pd.read_csv(DATASET_PATH)

print(
    "Dataset loaded:",
    df.shape
)

X = df[FEATURES].copy()
y = df[TARGET].copy()

print("\n============================================")
print("LOADING TRAINED MODEL")
print("============================================")

model = joblib.load(MODEL_PATH)

print(
    "Model loaded successfully!"
)

imputer = model.named_steps[
    "imputer"
]

classifier = model.named_steps[
    "classifier"
]

X_imputed_array = imputer.transform(
    X
)

X_imputed = pd.DataFrame(
    X_imputed_array,
    columns=FEATURES
)

print("\n============================================")
print("CREATING SHAP EXPLAINER")
print("============================================")

try:
    explainer = shap.TreeExplainer(
        classifier,
        X_imputed,
        feature_perturbation="interventional",
        model_output="probability"
    )

    SHAP_MODE = "probability"

    print(
        "Probability SHAP explainer created successfully!"
    )

except Exception as error:
    print(
        "Probability SHAP explainer failed:"
    )

    print(error)

    print(
        "Creating fallback TreeExplainer..."
    )

    explainer = shap.TreeExplainer(
        classifier
    )

    SHAP_MODE = "raw"

    print(
        "Fallback SHAP explainer created successfully!"
    )


def get_prediction_label(
    predicted_class
):
    if predicted_class == 1:
        return "High Risk"

    return "Low Risk"


def extract_shap_values(
    shap_result
):
    values = np.asarray(
        shap_result.values
    )

    print(
        "Raw SHAP dimensions:",
        values.shape
    )

    if values.ndim == 3:
        values = values[
            0,
            :,
            1
        ]

    elif values.ndim == 2:
        values = values[
            0,
            :
        ]

    elif values.ndim == 1:
        values = values

    else:
        raise ValueError(
            f"Unexpected SHAP dimensions: {values.shape}"
        )

    values = np.asarray(
        values,
        dtype=float
    ).reshape(-1)

    if len(values) != len(FEATURES):
        raise ValueError(
            "SHAP feature count does not match "
            f"model feature count. "
            f"Expected {len(FEATURES)}, "
            f"got {len(values)}."
        )

    return values


def extract_base_value(
    shap_result
):
    base_values = np.asarray(
        shap_result.base_values
    )

    print(
        "Raw base value dimensions:",
        base_values.shape
    )

    if base_values.ndim == 0:
        return float(
            base_values
        )

    if base_values.ndim == 2:
        if base_values.shape[1] > 1:
            return float(
                base_values[0, 1]
            )

        return float(
            base_values[0, 0]
        )

    if base_values.ndim == 1:
        if len(base_values) > 1:
            return float(
                base_values[1]
            )

        return float(
            base_values[0]
        )

    return float(
        base_values.reshape(-1)[0]
    )


def generate_shap_explanation(
    sample_index=None,
    patient_data=None
):
    if patient_data is not None:
        patient_df = pd.DataFrame(
            [patient_data],
            columns=FEATURES
        )

        patient_df = pd.DataFrame(
            imputer.transform(patient_df),
            columns=FEATURES
        )

        actual_class = None
        result_sample_index = None

    else:
        if (
            sample_index is None
            or sample_index < 0
            or sample_index >= len(X_imputed)
        ):
            raise ValueError(
                f"sampleIndex must be between "
                f"0 and {len(X_imputed) - 1}"
            )

        patient_df = X_imputed.iloc[
            [sample_index]
        ].copy()

        actual_class = int(
            y.iloc[sample_index]
        )

        result_sample_index = sample_index

    patient_array = patient_df[
        FEATURES
    ].to_numpy(
        dtype=float
    )

    print(
        "\nPatient array shape:",
        patient_array.shape
    )

    prediction = model.predict(
        patient_df
    )

    probabilities = model.predict_proba(
        patient_df
    )

    predicted_class = int(
        prediction[0]
    )

    class0_probability = float(
        probabilities[0, 0]
    )

    class1_probability = float(
        probabilities[0, 1]
    )

    confidence = (
        max(
            class0_probability,
            class1_probability
        )
        * 100
    )

    prediction_label = (
        get_prediction_label(
            predicted_class
        )
    )

    print(
        "\nCalculating SHAP values..."
    )

    shap_explanation = explainer(
        patient_array
    )

    shap_values = extract_shap_values(
        shap_explanation
    )

    base_value = extract_base_value(
        shap_explanation
    )

    feature_results = []

    for feature, shap_value in zip(
        FEATURES,
        shap_values
    ):
        value = float(
            shap_value
        )

        feature_results.append({
            "feature": feature,
            "name": DISPLAY_NAMES[feature],
            "shap_value": value,
            "absolute_value": abs(value)
        })

    feature_results.sort(
        key=lambda item:
        item["absolute_value"],
        reverse=True
    )

    reconstructed_probability = (
        base_value
        +
        float(
            np.sum(
                shap_values
            )
        )
    )

    probability_difference = abs(
        reconstructed_probability
        -
        class1_probability
    )

    CONSISTENCY_THRESHOLD = 0.01

    if (
        probability_difference
        <=
        CONSISTENCY_THRESHOLD
    ):
        consistency = "PASS"
    else:
        consistency = "FAIL"

    model_importance = (
        classifier.feature_importances_
    )

    importance_results = sorted(
        zip(
            FEATURES,
            model_importance
        ),
        key=lambda item:
        item[1],
        reverse=True
    )

    shap_top_features = set(
        item["feature"]
        for item
        in feature_results[:3]
    )

    model_top_features = set(
        feature
        for feature, importance
        in importance_results[:3]
    )

    overlap = (
        shap_top_features
        &
        model_top_features
    )

    overlap_count = len(
        overlap
    )

    if overlap_count >= 2:
        feature_agreement = "PASS"
    else:
        feature_agreement = "REVIEW"

    top_feature = (
        feature_results[0]
    )

    top_feature_name = (
        top_feature["feature"]
    )

    top_feature_shap_value = (
        top_feature["shap_value"]
    )

    original_probability = (
        class1_probability
    )

    perturbed_patient = (
        patient_df.copy()
    )

    original_value = float(
        perturbed_patient.iloc[0][
            top_feature_name
        ]
    )

    if original_value == 0:
        perturbed_value = 0.1
    else:
        perturbed_value = (
            original_value
            * 1.10
        )

    perturbed_patient.loc[
        perturbed_patient.index[0],
        top_feature_name
    ] = perturbed_value

    perturbed_probability = float(
        model.predict_proba(
            perturbed_patient
        )[0, 1]
    )

    probability_change = abs(
        perturbed_probability
        -
        original_probability
    )

    if probability_change >= 0.02:
        perturbation = "STRONG"

    elif probability_change >= 0.005:
        perturbation = "MODERATE"

    else:
        perturbation = "WEAK"

    score = 0

    if consistency == "PASS":
        score += 40

    if feature_agreement == "PASS":
        score += 30

    elif feature_agreement == "REVIEW":
        score += 15

    if perturbation == "STRONG":
        score += 30

    elif perturbation == "MODERATE":
        score += 20

    if score >= 80:
        final_result = "VALID"

    elif score >= 50:
        final_result = "PARTIALLY VALID"

    else:
        final_result = "INVALID"

    valid = (
        final_result == "VALID"
    )

    if final_result == "VALID":
        message = (
            "The SHAP explanation passed "
            "the defined validity checks."
        )

    elif final_result == "PARTIALLY VALID":
        message = (
            "The SHAP explanation requires review."
        )

    else:
        message = (
            "The SHAP explanation failed "
            "the validity checks."
        )

    features = []

    for item in feature_results:
        features.append({
            "name": item["name"],
            "value": float(
                item["shap_value"]
            )
        })

    validation = {
        "consistency": consistency,
        "featureAgreement": feature_agreement,
        "overlapCount": int(
            overlap_count
        ),
        "perturbation": perturbation,
        "originalProbability": float(
            original_probability
        ),
        "perturbedProbability": float(
            perturbed_probability
        ),
        "probabilityChange": float(
            probability_change
        ),
        "reconstructedOutput": float(
            reconstructed_probability
        ),
        "topFeature": top_feature["name"],
        "topFeatureShapValue": float(
            top_feature_shap_value
        )
    }

    print(
        "\n========================================"
    )

    print(
        "SHAP RESULT"
    )

    print(
        "========================================"
    )

    print(
        "Prediction:",
        prediction_label
    )

    print(
        "Confidence:",
        round(
            confidence,
            2
        ),
        "%"
    )

    print(
        "Consistency:",
        consistency
    )

    print(
        "Feature Agreement:",
        feature_agreement
    )

    print(
        "Perturbation:",
        perturbation
    )

    print(
        "Validity Score:",
        score
    )

    print(
        "Final Result:",
        final_result
    )

    return {
        "sampleIndex": result_sample_index,
        "actualClass": actual_class,
        "predictedClass": predicted_class,
        "prediction": prediction_label,
        "confidence": float(
            confidence
        ),
        "class0Probability": class0_probability,
        "class1Probability": class1_probability,
        "valid": valid,
        "validityScore": int(
            score
        ),
        "finalResult": final_result,
        "message": message,
        "features": features,
        "validation": validation
    }


@app.route(
    "/",
    methods=["GET"]
)
def home():
    return jsonify({
        "application":
            "MediSphere SHAP Explanation Validity API",
        "status":
            "running",
        "message":
            "SHAP backend is running successfully.",
        "endpoints": {
            "health":
                "GET /api/health",
            "shap":
                "GET /api/predictions/shap",
            "explain":
                "POST /api/explain"
        }
    })


@app.route(
    "/api/health",
    methods=["GET"]
)
def health():
    return jsonify({
        "status":
            "UP",
        "service":
            "SHAP Explanation Validity",
        "modelLoaded":
            True,
        "datasetSamples":
            len(X),
        "features":
            FEATURES
    })


@app.route(
    "/api/predictions/shap",
    methods=["GET"]
)
def shap_prediction():
    try:
        sample_index = int(
            request.args.get(
                "sampleIndex",
                SAMPLE_INDEX
            )
        )

        result = generate_shap_explanation(
            sample_index=sample_index
        )

        return jsonify(
            result
        ), 200

    except ValueError as error:
        return jsonify({
            "error":
                str(error)
        }), 400

    except Exception as error:
        print(
            "\nSHAP API ERROR:"
        )

        print(
            repr(error)
        )

        return jsonify({
            "error":
                str(error)
        }), 500


@app.route(
    "/api/explain",
    methods=["POST"]
)
def explain():
    try:
        request_data = request.get_json(
            silent=True
        )

        if request_data is None:
            return jsonify({
                "error":
                    "Request body is required."
            }), 400

        required_features = [
            "age",
            "sysBP",
            "totChol",
            "BMI",
            "glucose"
        ]

        missing_features = [
            feature
            for feature in required_features
            if feature not in request_data
        ]

        if missing_features:
            return jsonify({
                "error":
                    "Missing required features.",
                "missingFeatures":
                    missing_features
            }), 400

        patient_data = {
            "age":
                float(
                    request_data["age"]
                ),
            "sysBP":
                float(
                    request_data["sysBP"]
                ),
            "totChol":
                float(
                    request_data["totChol"]
                ),
            "BMI":
                float(
                    request_data["BMI"]
                ),
            "glucose":
                float(
                    request_data["glucose"]
                )
        }

        result = generate_shap_explanation(
            patient_data=patient_data
        )

        return jsonify(
            result
        ), 200

    except ValueError as error:
        return jsonify({
            "error":
                str(error)
        }), 400

    except Exception as error:
        print(
            "\nSHAP API ERROR:"
        )

        print(
            repr(error)
        )

        return jsonify({
            "error":
                str(error)
        }), 500


if __name__ == "__main__":
    print(
        "\n============================================"
    )

    print(
        "MediSphere SHAP Explanation Validity API"
    )

    print(
        "============================================"
    )

    print(
        "\nDataset samples:",
        len(X)
    )

    print(
        "Model features:",
        FEATURES
    )

    print(
        "\nAPI running at:"
    )

    print(
        "http://localhost:5000"
    )

    print(
        "\nSHAP GET endpoint:"
    )

    print(
        "GET http://localhost:5000/api/predictions/shap"
    )

    print(
        "\nSHAP POST endpoint:"
    )

    print(
        "POST http://localhost:5000/api/explain"
    )

    print(
        "\nHealth endpoint:"
    )

    print(
        "GET http://localhost:5000/api/health"
    )

    print(
        "\n============================================\n"
    )

    if __name__ == "__main__":
        print("\n============================================")
        print("MediSphere SHAP Explanation Validity API")
        print("============================================\n")

        app.run(
            host="0.0.0.0",
            port=int(os.environ.get("PORT", 5000)),
            debug=False
        )