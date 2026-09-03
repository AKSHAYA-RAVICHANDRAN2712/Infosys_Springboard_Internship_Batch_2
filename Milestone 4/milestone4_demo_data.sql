-- ============================================================
-- MediSphere Milestone 4 Demo Data
-- ============================================================
-- IMPORTANT:
-- This demo-data file uses the actual IDs from the current
-- Milestone 3 database used during development:
--   P004, P005, P010, P011, P016, P017, P022, P023,
--   P028, P029, P033, P034, P035, P039, P040, P041,
--   P045, P046, P047
--
-- DO NOT run this blindly on a different database.
-- First confirm that the referenced patient/prediction/
-- rule-execution/rule IDs exist.
-- ============================================================

BEGIN;

-- Reference/configuration data
INSERT INTO outcome_metrics
    (metric_name, description, unit, target_value)
SELECT *
FROM (VALUES
    ('Blood Glucose','Patient blood glucose measurement','mg/dL',140::NUMERIC),
    ('Heart Rate','Patient heart rate measurement','bpm',100::NUMERIC),
    ('SpO2','Peripheral oxygen saturation','%',95::NUMERIC),
    ('Blood Pressure Systolic','Systolic blood pressure measurement','mmHg',120::NUMERIC)
) AS v(metric_name, description, unit, target_value)
WHERE NOT EXISTS (
    SELECT 1 FROM outcome_metrics om
    WHERE om.metric_name = v.metric_name
);

-- Use the existing Milestone 3 rule_id = 4
INSERT INTO clinical_guidance
    (guidance_title, description, guidance_type, source_rule_id, severity)
SELECT
    v.guidance_title, v.description, v.guidance_type, 4, v.severity
FROM (VALUES
    ('Blood Glucose Follow-up',
     'Continue regular blood glucose monitoring and perform a clinical follow-up after a high glucose alert.',
     'MONITORING','HIGH'),
    ('Glucose Monitoring Plan',
     'Continue regular blood glucose monitoring and record follow-up measurements.',
     'MONITORING','HIGH'),
    ('Medication Review',
     'Review the patient medication plan and assess treatment response during follow-up.',
     'MEDICATION','NORMAL'),
    ('Clinical Follow-up Assessment',
     'Schedule a clinical follow-up assessment to evaluate the patient outcome.',
     'FOLLOW_UP','NORMAL')
) AS v(guidance_title, description, guidance_type, severity)
WHERE NOT EXISTS (
    SELECT 1
    FROM clinical_guidance cg
    WHERE cg.guidance_title = v.guidance_title
);

-- Outcome records for the current demo database.
-- Existing P004 outcome is not duplicated.
INSERT INTO outcome_measurements (
    patient_id, metric_id, prediction_id, rule_execution_id,
    baseline_value, measured_value, outcome_status, notes
)
SELECT
    v.patient_id,
    (SELECT metric_id FROM outcome_metrics WHERE metric_name='Blood Glucose' LIMIT 1),
    v.prediction_id,
    v.execution_id,
    v.baseline_value,
    v.measured_value,
    v.outcome_status,
    v.notes
FROM (VALUES
    ('P004',4,1,180::NUMERIC,135::NUMERIC,'IMPROVED','Blood glucose improved after clinical intervention and follow-up monitoring.'),
    ('P005',5,2,175,145,'IMPROVED','Blood glucose improved after clinical intervention and follow-up monitoring.'),
    ('P010',10,3,160,142,'IMPROVED','Follow-up measurement shows improvement in blood glucose.'),
    ('P011',53,4,190,190,'STABLE','Blood glucose remained stable during follow-up monitoring.'),
    ('P016',16,6,185,150,'IMPROVED','Blood glucose reduced after clinical intervention.'),
    ('P017',17,7,155,155,'STABLE','Blood glucose remained stable during follow-up.'),
    ('P022',22,8,170,145,'IMPROVED','Follow-up monitoring shows improved blood glucose.'),
    ('P023',23,9,165,175,'WORSENED','Follow-up measurement indicates increased blood glucose.'),
    ('P028',28,10,180,150,'IMPROVED','Blood glucose improved following clinical intervention.'),
    ('P029',29,11,172,160,'IMPROVED','Follow-up blood glucose measurement shows improvement.'),
    ('P033',33,12,158,158,'STABLE','Blood glucose remained stable during monitoring.'),
    ('P034',34,13,195,165,'IMPROVED','Blood glucose improved during follow-up assessment.'),
    ('P035',35,14,180,190,'WORSENED','Follow-up measurement indicates worsening blood glucose.'),
    ('P039',39,15,168,145,'IMPROVED','Blood glucose improved after intervention.'),
    ('P040',40,16,150,150,'STABLE','Blood glucose remained stable during follow-up.'),
    ('P041',41,17,185,140,'IMPROVED','Blood glucose improved following clinical management.'),
    ('P045',45,18,175,160,'IMPROVED','Follow-up measurement shows improved blood glucose.'),
    ('P046',46,19,165,175,'WORSENED','Follow-up measurement indicates increased blood glucose.'),
    ('P047',47,20,170,145,'IMPROVED','Blood glucose improved during follow-up monitoring.')
) AS v(patient_id,prediction_id,execution_id,baseline_value,measured_value,outcome_status,notes)
WHERE NOT EXISTS (
    SELECT 1
    FROM outcome_measurements o
    WHERE o.patient_id=v.patient_id
      AND o.prediction_id=v.prediction_id
      AND o.rule_execution_id=v.execution_id
);

-- Provider collaborations
INSERT INTO provider_collaborations (
    patient_id, initiated_by, collaborating_provider, subject, priority, status
)
SELECT v.*
FROM (VALUES
    ('P004','Dr. Priya Sharma','Dr. Rahul Verma','Review improved blood glucose outcome','HIGH','IN_PROGRESS'),
    ('P005','Dr. Ananya Rao','Dr. Rahul Verma','Review blood glucose improvement','HIGH','IN_PROGRESS'),
    ('P010','Dr. Meera Singh','Dr. Karthik Reddy','Review follow-up glucose measurement','NORMAL','OPEN'),
    ('P011','Dr. Ananya Rao','Dr. Priya Sharma','Discuss stable glucose outcome','NORMAL','RESOLVED'),
    ('P016','Dr. Karthik Reddy','Dr. Rahul Verma','Coordinate follow-up monitoring','HIGH','IN_PROGRESS'),
    ('P017','Dr. Priya Sharma','Dr. Meera Singh','Review stable patient outcome','LOW','OPEN')
) AS v(patient_id,initiated_by,collaborating_provider,subject,priority,status)
WHERE NOT EXISTS (
    SELECT 1 FROM provider_collaborations c
    WHERE c.patient_id=v.patient_id
      AND c.subject=v.subject
);

-- Notes
INSERT INTO collaboration_notes (
    collaboration_id, provider_name, note_type, note_text
)
SELECT
    c.collaboration_id,
    v.provider_name,
    v.note_type,
    v.note_text
FROM (VALUES
    ('P004','Dr. Priya Sharma','OBSERVATION','Patient P004 shows improvement in blood glucose after the clinical intervention.'),
    ('P004','Dr. Rahul Verma','RECOMMENDATION','Continue regular blood glucose monitoring and review the patient during follow-up.'),
    ('P004','Dr. Priya Sharma','FOLLOW_UP','Follow-up assessment planned to confirm continued improvement.'),
    ('P005','Dr. Ananya Rao','OBSERVATION','Patient shows improvement in blood glucose during follow-up monitoring.'),
    ('P010','Dr. Meera Singh','RECOMMENDATION','Continue regular glucose monitoring and maintain the planned follow-up schedule.'),
    ('P011','Dr. Ananya Rao','DECISION','Current glucose status is stable; continue the existing monitoring plan.'),
    ('P016','Dr. Karthik Reddy','RECOMMENDATION','Continue close monitoring and repeat the glucose assessment during follow-up.'),
    ('P017','Dr. Priya Sharma','FOLLOW_UP','Follow-up review planned to confirm continued stable glucose status.')
) AS v(patient_id,provider_name,note_type,note_text)
JOIN provider_collaborations c
  ON c.patient_id=v.patient_id
WHERE NOT EXISTS (
    SELECT 1 FROM collaboration_notes n
    WHERE n.collaboration_id=c.collaboration_id
      AND n.note_text=v.note_text
);

-- Compliance records
INSERT INTO guidance_compliance (
    guidance_id, patient_id, provider_name, compliance_status,
    action_taken, compliance_date, remarks
)
SELECT
    cg.guidance_id,
    v.patient_id,
    v.provider_name,
    v.compliance_status,
    v.action_taken,
    v.compliance_date,
    v.remarks
FROM (VALUES
    ('P004','Dr. Priya Sharma','COMPLIANT','Regular blood glucose monitoring was performed and follow-up assessment was completed.','Patient outcome improved from 180 mg/dL to 135 mg/dL.'),
    ('P005','Dr. Ananya Rao','COMPLIANT','Regular blood glucose monitoring was completed.','Patient showed improvement during follow-up.'),
    ('P010','Dr. Meera Singh','COMPLIANT','Follow-up glucose measurement was reviewed.','Patient outcome showed improvement.'),
    ('P011','Dr. Ananya Rao','PARTIALLY_COMPLIANT','Monitoring was completed but additional follow-up is required.','Patient glucose remained stable.'),
    ('P016','Dr. Karthik Reddy','COMPLIANT','Patient monitoring and follow-up assessment were completed.','Blood glucose improved after clinical management.'),
    ('P017','Dr. Priya Sharma','PENDING','Follow-up action has not yet been completed.','Awaiting the next clinical follow-up.')
) AS v(patient_id,provider_name,compliance_status,action_taken,remarks)
JOIN clinical_guidance cg
  ON cg.guidance_title =
     CASE
       WHEN v.patient_id='P004' THEN 'Blood Glucose Follow-up'
       WHEN v.patient_id='P005' THEN 'Glucose Monitoring Plan'
       WHEN v.patient_id='P010' THEN 'Clinical Follow-up Assessment'
       WHEN v.patient_id='P011' THEN 'Glucose Monitoring Plan'
       WHEN v.patient_id='P016' THEN 'Clinical Follow-up Assessment'
       WHEN v.patient_id='P017' THEN 'Medication Review'
     END
WHERE NOT EXISTS (
    SELECT 1 FROM guidance_compliance gc
    WHERE gc.patient_id=v.patient_id
      AND gc.guidance_id=cg.guidance_id
);

COMMIT;

-- ============================================================
-- END OF DEMO DATA
-- ============================================================
