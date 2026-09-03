-- ============================================================
-- MediSphere Healthcare Management Platform
-- Milestone 4 Database
-- Components:
--   1. Outcome Measurement
--   2. Provider Collaboration
--   3. Clinical Guidance Compliance
--
-- IMPORTANT:
-- Run this AFTER the existing Milestone 1-3 database.
-- Required existing tables:
--   patients(patient_id)
--   predictions(prediction_id)
--   clinical_rules(rule_id)
--   rule_executions(execution_id)
-- ============================================================

BEGIN;

-- ============================================================
-- 1. OUTCOME METRICS
-- ============================================================

CREATE TABLE IF NOT EXISTS outcome_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(150) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    target_value NUMERIC(10,2),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. OUTCOME MEASUREMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS outcome_measurements (
    outcome_id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(100) NOT NULL,
    metric_id BIGINT NOT NULL,
    prediction_id BIGINT,
    rule_execution_id BIGINT,
    baseline_value NUMERIC(10,2),
    measured_value NUMERIC(10,2),
    outcome_status VARCHAR(30) NOT NULL,
    measurement_date TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    CONSTRAINT fk_outcome_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id),

    CONSTRAINT fk_outcome_metric
        FOREIGN KEY (metric_id) REFERENCES outcome_metrics(metric_id),

    CONSTRAINT fk_outcome_prediction
        FOREIGN KEY (prediction_id) REFERENCES predictions(prediction_id),

    CONSTRAINT fk_outcome_rule_execution
        FOREIGN KEY (rule_execution_id) REFERENCES rule_executions(execution_id),

    CONSTRAINT outcome_status_check
        CHECK (outcome_status IN
            ('IMPROVED','STABLE','WORSENED','NO_CHANGE','UNKNOWN'))
);

-- ============================================================
-- 3. PROVIDER COLLABORATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS provider_collaborations (
    collaboration_id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(100) NOT NULL,
    initiated_by VARCHAR(150) NOT NULL,
    collaborating_provider VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_collaboration_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id),

    CONSTRAINT collaboration_priority_check
        CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),

    CONSTRAINT collaboration_status_check
        CHECK (status IN
            ('OPEN','IN_PROGRESS','RESOLVED','CLOSED'))
);

-- ============================================================
-- 4. COLLABORATION NOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS collaboration_notes (
    note_id BIGSERIAL PRIMARY KEY,
    collaboration_id BIGINT NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    note_type VARCHAR(50) NOT NULL DEFAULT 'COMMENT',
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_collaboration_note
        FOREIGN KEY (collaboration_id)
        REFERENCES provider_collaborations(collaboration_id)
        ON DELETE CASCADE,

    CONSTRAINT collaboration_note_type_check
        CHECK (note_type IN
            ('COMMENT','OBSERVATION','RECOMMENDATION','DECISION','FOLLOW_UP'))
);

-- ============================================================
-- 5. CLINICAL GUIDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS clinical_guidance (
    guidance_id BIGSERIAL PRIMARY KEY,
    guidance_title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    guidance_type VARCHAR(50) NOT NULL,
    source_rule_id BIGINT,
    severity VARCHAR(30) DEFAULT 'NORMAL',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_guidance_rule
        FOREIGN KEY (source_rule_id)
        REFERENCES clinical_rules(rule_id),

    CONSTRAINT guidance_type_check
        CHECK (guidance_type IN
            ('MONITORING','MEDICATION','FOLLOW_UP',
             'DIAGNOSTIC','LIFESTYLE','REFERRAL','OTHER')),

    CONSTRAINT guidance_severity_check
        CHECK (severity IN
            ('LOW','NORMAL','HIGH','CRITICAL'))
);

-- ============================================================
-- 6. GUIDANCE COMPLIANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS guidance_compliance (
    compliance_id BIGSERIAL PRIMARY KEY,
    guidance_id BIGINT NOT NULL,
    patient_id VARCHAR(100) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    compliance_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    action_taken TEXT,
    compliance_date TIMESTAMP WITHOUT TIME ZONE,
    remarks TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_compliance_guidance
        FOREIGN KEY (guidance_id)
        REFERENCES clinical_guidance(guidance_id),

    CONSTRAINT fk_compliance_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id),

    CONSTRAINT compliance_status_check
        CHECK (compliance_status IN
            ('PENDING','COMPLIANT','PARTIALLY_COMPLIANT',
             'NON_COMPLIANT','NOT_APPLICABLE'))
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_outcome_measurements_patient
    ON outcome_measurements(patient_id);

CREATE INDEX IF NOT EXISTS idx_outcome_measurements_metric
    ON outcome_measurements(metric_id);

CREATE INDEX IF NOT EXISTS idx_outcome_measurements_date
    ON outcome_measurements(measurement_date);

CREATE INDEX IF NOT EXISTS idx_outcome_measurements_status
    ON outcome_measurements(outcome_status);

CREATE INDEX IF NOT EXISTS idx_provider_collaborations_patient
    ON provider_collaborations(patient_id);

CREATE INDEX IF NOT EXISTS idx_provider_collaborations_status
    ON provider_collaborations(status);

CREATE INDEX IF NOT EXISTS idx_collaboration_notes_collaboration
    ON collaboration_notes(collaboration_id);

CREATE INDEX IF NOT EXISTS idx_collaboration_notes_created_at
    ON collaboration_notes(created_at);

CREATE INDEX IF NOT EXISTS idx_guidance_compliance_patient
    ON guidance_compliance(patient_id);

CREATE INDEX IF NOT EXISTS idx_guidance_compliance_guidance
    ON guidance_compliance(guidance_id);

CREATE INDEX IF NOT EXISTS idx_guidance_compliance_status
    ON guidance_compliance(compliance_status);

CREATE INDEX IF NOT EXISTS idx_clinical_guidance_rule
    ON clinical_guidance(source_rule_id);

-- ============================================================
-- TIMESTAMP FUNCTION + TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_milestone4_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_provider_collaborations_updated_at
ON provider_collaborations;

CREATE TRIGGER trg_provider_collaborations_updated_at
BEFORE UPDATE ON provider_collaborations
FOR EACH ROW
EXECUTE FUNCTION update_milestone4_timestamp();

DROP TRIGGER IF EXISTS trg_clinical_guidance_updated_at
ON clinical_guidance;

CREATE TRIGGER trg_clinical_guidance_updated_at
BEFORE UPDATE ON clinical_guidance
FOR EACH ROW
EXECUTE FUNCTION update_milestone4_timestamp();

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW patient_outcome_summary AS
SELECT
    o.outcome_id,
    o.patient_id,
    m.metric_name,
    m.unit,
    o.baseline_value,
    o.measured_value,
    o.outcome_status,
    o.measurement_date,
    o.notes
FROM outcome_measurements o
JOIN outcome_metrics m
    ON o.metric_id = m.metric_id;

CREATE OR REPLACE VIEW provider_collaboration_summary AS
SELECT
    c.collaboration_id,
    c.patient_id,
    c.initiated_by,
    c.collaborating_provider,
    c.subject,
    c.priority,
    c.status,
    COUNT(n.note_id) AS total_notes,
    c.created_at
FROM provider_collaborations c
LEFT JOIN collaboration_notes n
    ON c.collaboration_id = n.collaboration_id
GROUP BY
    c.collaboration_id,
    c.patient_id,
    c.initiated_by,
    c.collaborating_provider,
    c.subject,
    c.priority,
    c.status,
    c.created_at;

CREATE OR REPLACE VIEW clinical_guidance_compliance_summary AS
SELECT
    gc.compliance_id,
    gc.patient_id,
    cg.guidance_title,
    cg.guidance_type,
    cg.severity,
    gc.provider_name,
    gc.compliance_status,
    gc.action_taken,
    gc.compliance_date,
    gc.remarks
FROM guidance_compliance gc
JOIN clinical_guidance cg
    ON gc.guidance_id = cg.guidance_id;

COMMIT;

-- ============================================================
-- END OF MILESTONE 4 SCHEMA
-- ============================================================
