from pydantic import BaseModel, Field

class RoundResponse(BaseModel):
    round_number: int
    global_model_version: str
    expected_clients: int
    accepted_clients: int
    global_accuracy: float
    improvement: float
    convergence_status: str

class TrainingResponse(BaseModel):
    message: str
    current_round: int
    global_model_version: str
    global_accuracy: float
    convergence_status: str
    rounds: list[RoundResponse]
