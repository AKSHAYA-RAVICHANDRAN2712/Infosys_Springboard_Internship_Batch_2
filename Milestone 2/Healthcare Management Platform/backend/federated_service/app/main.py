from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import numpy as np
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path: sys.path.insert(0,str(ROOT))
from shared_db import Base, engine, SessionLocal, FederatedRound, FederatedClientUpdate, FederatedMetric

app=FastAPI(title='MediSphere Federated Convergence API',version='2.0.0')
app.add_middleware(CORSMiddleware,allow_origins=['*'],allow_methods=['*'],allow_headers=['*'])
Base.metadata.create_all(bind=engine)

NUM_CLIENTS=4; SAMPLES_PER_CLIENT=160; FEATURES=4

def make_clients(seed=42):
    rng=np.random.default_rng(seed); clients=[]
    for i in range(NUM_CLIENTS):
        shift=(i-(NUM_CLIENTS-1)/2)*0.15
        x=rng.normal(loc=shift,scale=1.0,size=(SAMPLES_PER_CLIENT,FEATURES))
        score=1.4*x[:,0]-1.1*x[:,1]+0.8*x[:,2]-0.5*x[:,3]+rng.normal(0,.3,SAMPLES_PER_CLIENT)
        y=(score>0).astype(float)
        split=int(.8*SAMPLES_PER_CLIENT)
        clients.append({'client_id':f'client_{i+1}','train_x':x[:split],'train_y':y[:split],'test_x':x[split:],'test_y':y[split:]})
    return clients

def sigmoid(z): return 1/(1+np.exp(-np.clip(z,-30,30)))
def local_train(w,b,x,y,epochs=3,lr=.08):
    w=w.copy(); b=float(b)
    for _ in range(epochs):
        p=sigmoid(x@w+b); err=p-y
        w-=lr*(x.T@err/len(x)); b-=lr*float(np.mean(err))
    return w,b
def accuracy(w,b,x,y): return float(np.mean((sigmoid(x@w+b)>=.5)==y))

def train(rounds=8, clients_count=4, threshold=.001, stable_rounds=2):
    clients=make_clients(); clients=clients[:clients_count]
    rng=np.random.default_rng(7); w=rng.normal(0,.05,FEATURES); b=0.0; previous=None; stable=0; history=[]
    db=SessionLocal()
    try:
        for r in range(1,rounds+1):
            started=datetime.now(timezone.utc); local=[]; total=sum(len(c['train_x']) for c in clients)
            for c in clients:
                lw,lb=local_train(w,b,c['train_x'],c['train_y']); local.append((c,lw,lb))
            w=sum(c['train_x'].shape[0]*lw for c,lw,lb in local)/total
            b=sum(c['train_x'].shape[0]*lb for c,lw,lb in local)/total
            allx=np.vstack([c['test_x'] for c in clients]); ally=np.concatenate([c['test_y'] for c in clients])
            acc=accuracy(w,b,allx,ally); improvement=0.0 if previous is None else acc-previous
            stable=stable+1 if previous is not None and abs(improvement)<=threshold else 0
            converged=stable>=stable_rounds
            version=f'global-v{r}'
            rr=FederatedRound(round_number=r,global_model_version=version,status='CONVERGED' if converged else 'COMPLETED',expected_clients=len(clients),accepted_clients=len(clients),global_accuracy=acc,improvement=improvement,convergence_status='CONVERGED' if converged else 'NOT_CONVERGED',started_at=started,completed_at=datetime.now(timezone.utc)); db.add(rr); db.flush()
            for c,lw,lb in local:
                la=accuracy(lw,lb,c['train_x'],c['train_y'])
                db.add(FederatedClientUpdate(round_id=rr.round_id,client_id=c['client_id'],model_version=version,sample_count=len(c['train_x']),local_accuracy=la,update_reference=f'round-{r}/{c["client_id"]}',update_status='ACCEPTED'))
            db.add(FederatedMetric(round_id=rr.round_id,metric_name='global_accuracy',metric_value=acc,improvement=improvement)); db.add(FederatedMetric(round_id=rr.round_id,metric_name='convergence_threshold',metric_value=threshold,improvement=0.0)); db.commit()
            item={'round_id':rr.round_id,'round_number':r,'global_model_version':version,'expected_clients':len(clients),'accepted_clients':len(clients),'global_accuracy':round(acc,6),'improvement':round(improvement,6),'convergence_status':'CONVERGED' if converged else 'NOT_CONVERGED'}; history.append(item); previous=acc
            if converged: break
        return history
    except Exception: db.rollback(); raise
    finally: db.close()

@app.get('/')
def root(): return {'component':'Federated Round Convergence','status':'running'}
@app.get('/api/federated/health')
def health(): return {'status':'UP','service':'Federated Convergence','database':'PostgreSQL'}
@app.get('/api/federated/rounds')
def rounds():
    db=SessionLocal();
    try:
        return [{'round_id':r.round_id,'round_number':r.round_number,'global_model_version':r.global_model_version,'status':r.status,'expected_clients':r.expected_clients,'accepted_clients':r.accepted_clients,'global_accuracy':r.global_accuracy,'improvement':r.improvement,'convergence_status':r.convergence_status} for r in db.query(FederatedRound).order_by(FederatedRound.round_number).all()]
    finally: db.close()
@app.get('/api/federated/rounds/latest')
def latest():
    db=SessionLocal();
    try:
        r=db.query(FederatedRound).order_by(FederatedRound.round_id.desc()).first(); return {'message':'No federated rounds found'} if r is None else {'round_id':r.round_id,'round_number':r.round_number,'global_model_version':r.global_model_version,'global_accuracy':r.global_accuracy,'improvement':r.improvement,'convergence_status':r.convergence_status,'accepted_clients':r.accepted_clients}
    finally: db.close()
@app.get('/api/federated/convergence')
def convergence():
    db=SessionLocal();
    try:
        r=db.query(FederatedRound).order_by(FederatedRound.round_id.desc()).first(); return {'converged':False,'message':'No training has been performed'} if r is None else {'round':r.round_number,'accuracy':r.global_accuracy,'improvement':r.improvement,'status':r.convergence_status,'converged':r.convergence_status=='CONVERGED'}
    finally: db.close()
@app.get('/api/federated/dashboard')
def dashboard():
    db=SessionLocal();
    try:
        rs=db.query(FederatedRound).order_by(FederatedRound.round_number).all()
        if not rs:return {'component':'Federated Round Convergence','status':'NO_TRAINING_DATA','total_rounds':0}
        r=rs[-1]; return {'component':'Federated Round Convergence','status':'CONVERGED' if r.convergence_status=='CONVERGED' else 'TRAINING','total_rounds':len(rs),'current_round':r.round_number,'global_model_version':r.global_model_version,'global_accuracy':r.global_accuracy,'improvement':r.improvement,'convergence_status':r.convergence_status,'expected_clients':r.expected_clients,'accepted_clients':r.accepted_clients}
    finally: db.close()
@app.get('/api/federated/rounds/{round_id}/clients')
def clients(round_id:int):
    db=SessionLocal();
    try:
        return [{'update_id':u.update_id,'client_id':u.client_id,'model_version':u.model_version,'sample_count':u.sample_count,'local_accuracy':u.local_accuracy,'update_reference':u.update_reference,'update_status':u.update_status} for u in db.query(FederatedClientUpdate).filter(FederatedClientUpdate.round_id==round_id).all()]
    finally: db.close()
@app.get('/api/federated/rounds/{round_id}/metrics')
def metrics(round_id:int):
    db=SessionLocal();
    try:
        return [{'metric_id':m.metric_id,'metric_name':m.metric_name,'metric_value':m.metric_value,'improvement':m.improvement} for m in db.query(FederatedMetric).filter(FederatedMetric.round_id==round_id).all()]
    finally: db.close()
@app.post('/api/federated/train')
def start_training():
    try:
        history=train(); return {'message':'Federated training completed','rounds':history}
    except Exception as e: raise HTTPException(500,detail=str(e))

if __name__=='__main__':
    import uvicorn; uvicorn.run(app,host='0.0.0.0',port=8092)
