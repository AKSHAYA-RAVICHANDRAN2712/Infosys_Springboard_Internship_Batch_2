from .database import Base, engine
from . import models
Base.metadata.create_all(bind=engine)
print('MediSphere shared database tables are ready.')
