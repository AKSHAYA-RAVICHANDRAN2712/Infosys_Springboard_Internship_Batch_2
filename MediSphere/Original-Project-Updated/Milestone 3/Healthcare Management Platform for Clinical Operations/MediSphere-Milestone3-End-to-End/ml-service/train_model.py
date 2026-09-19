from pathlib import Path
import json, joblib, numpy as np, pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import precision_score, recall_score, accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

BASE=Path(__file__).resolve().parent
DATA=BASE/"data"/"vitals_benchmark.csv"; MODEL=BASE/"vitals_model.pkl"; METRICS=BASE/"results"/"metrics.json"
FEATURES=["heart_rate","systolic_bp","diastolic_bp","respiratory_rate","spo2","temperature"]

def build(seed=42,n=5000):
    rng=np.random.default_rng(seed)
    normal=pd.DataFrame({"heart_rate":rng.normal(78,9,n),"systolic_bp":rng.normal(118,12,n),"diastolic_bp":rng.normal(76,8,n),"respiratory_rate":rng.normal(16,3,n),"spo2":rng.normal(98,1.2,n),"temperature":rng.normal(36.7,.35,n)})
    abnormal=pd.DataFrame({"heart_rate":rng.choice([rng.normal(132,14,n),rng.normal(45,7,n)]),"systolic_bp":rng.choice([rng.normal(175,20,n),rng.normal(78,8,n)]),"diastolic_bp":rng.choice([rng.normal(108,12,n),rng.normal(48,7,n)]),"respiratory_rate":rng.choice([rng.normal(29,5,n),rng.normal(8,2,n)]),"spo2":rng.normal(87,4,n),"temperature":rng.choice([rng.normal(39.1,.7,n),rng.normal(34.8,.5,n)])})
    x=pd.concat([normal,abnormal],ignore_index=True).clip(lower=0); y=pd.Series([0]*n+[1]*n,name="anomaly"); DATA.parent.mkdir(parents=True,exist_ok=True); x.to_csv(DATA,index=False); return x,y
x,y=build(); xt,xv,yt,yv=train_test_split(x,y,test_size=.2,random_state=42,stratify=y)
model=Pipeline([("imputer",SimpleImputer(strategy="median")),("classifier",RandomForestClassifier(n_estimators=300,random_state=42,min_samples_leaf=2,class_weight="balanced",n_jobs=-1))]); model.fit(xt,yt)
prob=model.predict_proba(xv)[:,1]; threshold=.50; pred=(prob>=threshold).astype(int)
tp=int(((pred==1)&(yv.to_numpy()==1)).sum()); fp=int(((pred==1)&(yv.to_numpy()==0)).sum()); precision=precision_score(yv,pred,zero_division=0)*100; recall=recall_score(yv,pred,zero_division=0)*100; acc=accuracy_score(yv,pred)*100; cm=confusion_matrix(yv,pred).tolist()
joblib.dump(model,MODEL); METRICS.parent.mkdir(exist_ok=True); METRICS.write_text(json.dumps({"threshold":threshold,"precisionPercent":precision,"recallPercent":recall,"accuracyPercent":acc,"truePositives":tp,"falsePositives":fp,"total":len(yv),"confusionMatrix":cm},indent=2)); print(METRICS.read_text())
