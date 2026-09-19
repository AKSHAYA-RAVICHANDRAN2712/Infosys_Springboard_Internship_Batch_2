from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class FederatedRound(Base):
    __tablename__ = "federated_round"

    round_id = Column(Integer, primary_key=True, index=True)
    round_number = Column(Integer, nullable=False)
    global_model_version = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    expected_clients = Column(Integer, nullable=False)
    accepted_clients = Column(Integer, nullable=False)
    global_accuracy = Column(Float)
    improvement = Column(Float)
    convergence_status = Column(String(50), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    client_updates = relationship(
        "FederatedClientUpdate",
        back_populates="round"
    )

    metrics = relationship(
        "FederatedMetric",
        back_populates="round"
    )


class FederatedClientUpdate(Base):
    __tablename__ = "federated_client_update"

    update_id = Column(Integer, primary_key=True, index=True)
    round_id = Column(
        Integer,
        ForeignKey("federated_round.round_id"),
        nullable=False
    )
    client_id = Column(String(100), nullable=False)
    model_version = Column(String(100), nullable=False)
    sample_count = Column(Integer, nullable=False)
    local_accuracy = Column(Float)
    update_reference = Column(String(255))
    update_status = Column(String(50), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    round = relationship(
        "FederatedRound",
        back_populates="client_updates"
    )


class FederatedMetric(Base):
    __tablename__ = "federated_metric"

    metric_id = Column(Integer, primary_key=True, index=True)
    round_id = Column(
        Integer,
        ForeignKey("federated_round.round_id"),
        nullable=False
    )
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float)
    improvement = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    round = relationship(
        "FederatedRound",
        back_populates="metrics"
    )
