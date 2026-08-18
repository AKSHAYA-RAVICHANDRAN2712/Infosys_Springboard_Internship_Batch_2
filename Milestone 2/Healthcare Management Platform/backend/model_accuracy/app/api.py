from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from pathlib import Path
import json, joblib, sys

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path: sys.path.insert(0, str(ROOT))
from shared_db import get_db, MLModel, ModelMetrics, ModelPrediction

MODEL_PATH = ROOT / 'backend' / 'model_accuracy' / 'random_forest_model.joblib'
METRICS_PATH = ROOT / 'backend' / 'model_accuracy' / 'model_metrics.json'
model = joblib.load(MODEL_PATH)
with open(METRICS_PATH, encoding='utf-8') as f: metrics = json.load(f)

router = APIRouter(prefix='/api/model', tags=['Model Accuracy'])

class PatientData(BaseModel):
    male: int = Field(ge=0, le=1); age: float = Field(ge=18, le=120); education: int = Field(ge=1, le=4)
    currentSmoker: int = Field(ge=0, le=1); cigsPerDay: float = Field(ge=0, le=100)
    BPMeds: int = Field(ge=0, le=1); prevalentStroke: int = Field(ge=0, le=1); prevalentHyp: int = Field(ge=0, le=1); diabetes: int = Field(ge=0, le=1)
    totChol: float = Field(ge=80, le=500); sysBP: float = Field(ge=70, le=250); diaBP: float = Field(ge=40, le=150)
    BMI: float = Field(ge=10, le=70); heartRate: float = Field(ge=30, le=220); glucose: float = Field(ge=40, le=500)

def ensure_model(db: Session):
    rec = db.query(MLModel).filter(MLModel.model_name == metrics['model'], MLModel.version == '1.0.0').first()
    if rec is None:
        rec = MLModel(model_name=metrics['model'], algorithm='Random Forest Classifier', version='1.0.0', training_samples=metrics['training_samples'], testing_samples=metrics['testing_samples'], accuracy=round(metrics['accuracy'],2), status='ACTIVE')
        db.add(rec); db.flush()
    mm = db.query(ModelMetrics).filter(ModelMetrics.model_id == rec.model_id).order_by(ModelMetrics.metric_id.desc()).first()
    if mm is None or round(float(mm.accuracy),2) != round(metrics['accuracy'],2):
        db.add(ModelMetrics(model_id=rec.model_id, accuracy=metrics['accuracy'], precision_score=metrics['precision'], recall_score=metrics['recall'], f1_score=metrics['f1_score'], roc_auc=None)); db.flush()
    return rec

def as_input(p):
    return [[p.male,p.age,p.education,p.currentSmoker,p.cigsPerDay,p.BPMeds,p.prevalentStroke,p.prevalentHyp,p.diabetes,p.totChol,p.sysBP,p.diaBP,p.BMI,p.heartRate,p.glucose]]

@router.get('/health')
def health(db: Session=Depends(get_db)):
    try:
        rec=ensure_model(db); db.commit()
        return {'status':'UP','service':'Model Accuracy','model':metrics['model'],'database':'CONNECTED','modelId':rec.model_id}
    except Exception as e:
        db.rollback(); raise HTTPException(503, detail={'status':'DOWN','database':'UNAVAILABLE','error':str(e)})

@router.get('/accuracy')
def accuracy(db: Session=Depends(get_db)):
    try:
        rec=ensure_model(db); db.commit()
        return {'model':metrics['model'],'accuracy':round(metrics['accuracy'],2),'precision':round(metrics['precision'],2),'recall':round(metrics['recall'],2),'f1Score':round(metrics['f1_score'],2),'confusionMatrix':metrics['confusion_matrix'],'trainingSamples':metrics['training_samples'],'testingSamples':metrics['testing_samples'],'bestParameters':metrics['best_parameters'],'databaseModelId':rec.model_id}
    except Exception as e:
        db.rollback(); raise HTTPException(500, detail=str(e))

@router.post('/predict')
def predict(p: PatientData, db: Session=Depends(get_db)):
    try:
        pred=int(model.predict(as_input(p))[0]); label='High risk of coronary heart disease' if pred else 'Low risk of coronary heart disease'
        rec=ensure_model(db)
        row=ModelPrediction(model_id=rec.model_id,male=p.male,age=int(p.age),education=p.education,current_smoker=p.currentSmoker,cigs_per_day=p.cigsPerDay,bp_meds=p.BPMeds,prevalent_stroke=p.prevalentStroke,prevalent_hyp=p.prevalentHyp,diabetes=p.diabetes,tot_chol=p.totChol,sys_bp=p.sysBP,dia_bp=p.diaBP,bmi=p.BMI,heart_rate=p.heartRate,glucose=p.glucose,prediction=pred,prediction_label=label)
        db.add(row); db.commit(); db.refresh(row)
        return {'success':True,'message':'Prediction completed successfully','model':metrics['model'],'prediction':pred,'result':label,'modelAccuracy':round(metrics['accuracy'],2),'precision':round(metrics['precision'],2),'recall':round(metrics['recall'],2),'f1Score':round(metrics['f1_score'],2),'predictionId':row.prediction_id,'databaseSaved':True}
    except Exception as e:
        db.rollback(); raise HTTPException(500, detail={'success':False,'message':'Unable to process prediction','error':str(e)})
