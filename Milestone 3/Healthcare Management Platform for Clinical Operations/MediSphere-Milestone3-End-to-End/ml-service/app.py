from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import json, joblib, numpy as np, pandas as pd
try:
    import shap
except Exception:
    shap = None

app = Flask(__name__)
CORS(app)
BASE = Path(__file__).resolve().parent
FEATURES = ["heart_rate","systolic_bp","diastolic_bp","respiratory_rate","spo2","temperature"]
MODEL_PATH = BASE / "vitals_model.pkl"
METRICS_PATH = BASE / "results" / "metrics.json"
MODEL = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None
EXPLAINER = None
if MODEL is not None and shap is not None:
    try:
        EXPLAINER = shap.TreeExplainer(MODEL.named_steps["classifier"])
    except Exception:
        EXPLAINER = None

def load_metrics():
    if METRICS_PATH.exists():
        return json.loads(METRICS_PATH.read_text())
    return {"threshold":0.80,"precisionPercent":0.0,"recallPercent":0.0,"accuracyPercent":0.0,"truePositives":0,"falsePositives":0,"total":0}

@app.get("/health")
def health():
    m = load_metrics()
    return jsonify({"status":"UP" if MODEL is not None else "DOWN","modelLoaded":MODEL is not None,"precisionPercent":m["precisionPercent"]})

@app.get("/metrics")
def metrics():
    return jsonify(load_metrics())

@app.post("/predict")
def predict():
    if MODEL is None:
        return jsonify({"success":False,"message":"Model not found"}),503
    try:
        p = request.get_json(force=True) or {}
        missing = [f for f in FEATURES if f not in p]
        if missing:
            return jsonify({"success":False,"message":"Missing fields: " + ", ".join(missing)}),400
        row = pd.DataFrame([{f:float(p[f]) for f in FEATURES}], columns=FEATURES)
        m = load_metrics()
        score = float(MODEL.predict_proba(row)[0,1])
        pred = int(score >= float(m["threshold"]))
        shap_out = {}
        if EXPLAINER is not None:
            try:
                arr = MODEL.named_steps["imputer"].transform(row)
                raw = EXPLAINER(arr)
                vals = np.asarray(raw.values)
                if vals.ndim == 3: vals = vals[0,:,1]
                elif vals.ndim == 2: vals = vals[0]
                else: vals = vals.reshape(-1)
                if len(vals) == len(FEATURES): shap_out = {f:float(v) for f,v in zip(FEATURES, vals)}
            except Exception:
                shap_out = {}
        return jsonify({"success":True,"anomalyDetected":pred==1,"prediction":pred,"anomalyScore":score,"precisionPercent":float(m["precisionPercent"]),"precisionTargetMet":float(m["precisionPercent"])>85,"message":"Anomaly detected in patient vitals." if pred else "No anomaly detected in patient vitals.","shap":shap_out})
    except Exception as e:
        return jsonify({"success":False,"message":str(e)}),400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
