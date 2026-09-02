-- Milestone 3 tables. Existing patients/vitals/anomaly_* tables are preserved.
CREATE TABLE IF NOT EXISTS alert_fatigue (
 id BIGSERIAL PRIMARY KEY,
 patient_id VARCHAR(255) NOT NULL,
 alert_type VARCHAR(100) NOT NULL,
 severity VARCHAR(20) NOT NULL,
 message TEXT,
 confidence DOUBLE PRECISION,
 alert_timestamp TIMESTAMP NOT NULL,
 status VARCHAR(30) NOT NULL,
 suppressed BOOLEAN NOT NULL DEFAULT FALSE,
 suppression_reason TEXT,
 occurrence_count INTEGER NOT NULL DEFAULT 1,
 source VARCHAR(40),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_alert_fatigue_patient_type_time ON alert_fatigue(patient_id,alert_type,alert_timestamp DESC);
CREATE TABLE IF NOT EXISTS m3_anomaly_record (
 id BIGSERIAL PRIMARY KEY,
 patient_id VARCHAR(255),
 anomaly_detected BOOLEAN NOT NULL,
 anomaly_score DOUBLE PRECISION,
 prediction INTEGER,
 precision_percent DOUBLE PRECISION,
 heart_rate DOUBLE PRECISION,
 systolic_bp DOUBLE PRECISION,
 diastolic_bp DOUBLE PRECISION,
 respiratory_rate DOUBLE PRECISION,
 spo2 DOUBLE PRECISION,
 temperature DOUBLE PRECISION,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 message TEXT
);
