from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shared_db import Base, engine
from shared_db import models
from .app.api import router

app=FastAPI(title='MediSphere - Model Accuracy API',version='2.0.0')
app.add_middleware(CORSMiddleware,allow_origins=['*'],allow_credentials=False,allow_methods=['*'],allow_headers=['*'])
@app.on_event('startup')
def startup(): Base.metadata.create_all(bind=engine); print('Model Accuracy database tables ready.')
@app.get('/')
def root(): return {'service':'Model Accuracy','status':'running','docs':'/docs'}
app.include_router(router)
