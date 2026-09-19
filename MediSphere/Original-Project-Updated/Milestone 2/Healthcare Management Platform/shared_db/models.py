from sqlalchemy import Column, Integer, Integer, String, Numeric, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from .database import Base

class MLModel(Base):
    __tablename__='ml_model'
    model_id=Column(Integer,primary_key=True,index=True)
    model_name=Column(String(100),nullable=False)
    algorithm=Column(String(100),nullable=False)
    version=Column(String(50),nullable=False)
    training_samples=Column(Integer)
    testing_samples=Column(Integer)
    accuracy=Column(Numeric(5,2))
    status=Column(String(30))
    created_at=Column(DateTime,server_default=func.now())

class ModelMetrics(Base):
    __tablename__='model_metrics'
    metric_id=Column(Integer,primary_key=True,index=True)
    model_id=Column(Integer,ForeignKey('ml_model.model_id'),nullable=False)
    accuracy=Column(Numeric(5,2)); precision_score=Column(Numeric(5,2)); recall_score=Column(Numeric(5,2)); f1_score=Column(Numeric(5,2)); roc_auc=Column(Numeric(5,2))
    evaluated_at=Column(DateTime,server_default=func.now())

class ModelPrediction(Base):
    __tablename__='model_predictions'
    prediction_id=Column(Integer,primary_key=True,index=True)
    model_id=Column(Integer,ForeignKey('ml_model.model_id'),nullable=False)
    male=Column(Integer); age=Column(Integer); education=Column(Integer); current_smoker=Column(Integer); cigs_per_day=Column(Numeric); bp_meds=Column(Integer); prevalent_stroke=Column(Integer); prevalent_hyp=Column(Integer); diabetes=Column(Integer)
    tot_chol=Column(Numeric); sys_bp=Column(Numeric); dia_bp=Column(Numeric); bmi=Column(Numeric); heart_rate=Column(Numeric); glucose=Column(Numeric)
    prediction=Column(Integer); prediction_label=Column(String(50)); predicted_at=Column(DateTime,server_default=func.now())

class SHAPPrediction(Base):
    __tablename__='shap_prediction'
    prediction_id=Column(Integer,primary_key=True,index=True)
    age=Column(Integer); blood_pressure=Column(Numeric); cholesterol=Column(Numeric); bmi=Column(Numeric); glucose=Column(Numeric)
    actual_class=Column(Integer); predicted_class=Column(Integer); prediction=Column(String(50)); confidence=Column(Numeric(8,5)); class_0_probability=Column(Numeric(8,5)); class_1_probability=Column(Numeric(8,5)); validity_score=Column(Numeric(8,2)); final_result=Column(String(30)); message=Column(Text); created_at=Column(DateTime,server_default=func.now())

class SHAPFeature(Base):
    __tablename__='shap_feature'
    id=Column(Integer,primary_key=True,index=True)
    prediction_id=Column(Integer,ForeignKey('shap_prediction.prediction_id'),nullable=False)
    feature_name=Column(String(100),nullable=False); shap_value=Column(Numeric(12,8))

class SHAPValidation(Base):
    __tablename__='shap_validation'
    validation_id=Column(Integer,primary_key=True,index=True)
    prediction_id=Column(Integer,ForeignKey('shap_prediction.prediction_id'),nullable=False,unique=True)
    consistency=Column(String(30)); feature_agreement=Column(String(30)); overlap_count=Column(Integer); perturbation=Column(String(30)); original_probability=Column(Numeric(8,5)); perturbed_probability=Column(Numeric(8,5)); probability_change=Column(Numeric(8,5)); reconstructed_output=Column(Numeric(12,8)); top_feature=Column(String(100)); top_feature_shap_value=Column(Numeric(12,8))

class FederatedRound(Base):
    __tablename__='federated_round'
    round_id=Column(Integer,primary_key=True,index=True); round_number=Column(Integer,nullable=False); global_model_version=Column(String(100),nullable=False); status=Column(String(50),nullable=False); expected_clients=Column(Integer,nullable=False); accepted_clients=Column(Integer,nullable=False); global_accuracy=Column(Float); improvement=Column(Float); convergence_status=Column(String(50),nullable=False); started_at=Column(DateTime,server_default=func.now()); completed_at=Column(DateTime)

class FederatedClientUpdate(Base):
    __tablename__='federated_client_update'
    update_id=Column(Integer,primary_key=True,index=True); round_id=Column(Integer,ForeignKey('federated_round.round_id'),nullable=False); client_id=Column(String(100),nullable=False); model_version=Column(String(100),nullable=False); sample_count=Column(Integer,nullable=False); local_accuracy=Column(Float); update_reference=Column(String(255)); update_status=Column(String(50),nullable=False); submitted_at=Column(DateTime,server_default=func.now())

class FederatedMetric(Base):
    __tablename__='federated_metric'
    metric_id=Column(Integer,primary_key=True,index=True); round_id=Column(Integer,ForeignKey('federated_round.round_id'),nullable=False); metric_name=Column(String(100),nullable=False); metric_value=Column(Float); improvement=Column(Float); recorded_at=Column(DateTime,server_default=func.now())
