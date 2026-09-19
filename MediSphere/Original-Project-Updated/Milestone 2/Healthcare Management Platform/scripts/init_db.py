from shared_db import Base, engine
from shared_db import models
Base.metadata.create_all(bind=engine)
print('All MediSphere component tables are ready.')
