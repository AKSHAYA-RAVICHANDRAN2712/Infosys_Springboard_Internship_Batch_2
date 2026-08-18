# Optional local smoke test. It uses SQLite only and does not replace the shared PostgreSQL DB.
import os, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
os.environ.setdefault('DATABASE_URL','sqlite:///./local_smoke.db')
sys.path.insert(0,str(ROOT))
from shared_db import Base, engine
import shared_db.models
Base.metadata.create_all(engine)
print('Local shared schema smoke test: OK')
