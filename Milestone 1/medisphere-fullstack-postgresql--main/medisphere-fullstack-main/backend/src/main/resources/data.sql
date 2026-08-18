-- Seed data mirroring src/data/mockData.js and src/data/patient360Data.js
-- so the app behaves the same once VITE_USE_MOCK_DATA=false is flipped.
-- Safe to re-run: every insert is guarded by a NOT EXISTS check.
--
-- Demo login passwords (bcrypt-hashed below): admin123 / doctor123 / patient123 / reception123

INSERT INTO users (id, name, email, password, role, specialization)
SELECT * FROM (SELECT 1 AS id, 'Ava Thompson' AS name, 'admin@medisphere.com' AS email,
       '$2b$10$FFg1y8CK/B9Y6XAtbICmYO3GvUqlVfcvZ7Z6s3yXsnxSpK5mTOV3S' AS password, 'ADMIN' AS role, NULL AS specialization) t
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@medisphere.com');

INSERT INTO users (id, name, email, password, role, specialization)
SELECT * FROM (SELECT 2, 'Dr. Rajesh Menon', 'doctor@medisphere.com',
       '$2b$10$DdPzPH0vE2HRYNaqxRcEheK3p75zOV3orJykiVfLCRegRwEd3qf2e', 'DOCTOR', 'Cardiology') t
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@medisphere.com');

INSERT INTO users (id, name, email, password, role, specialization)
SELECT * FROM (SELECT 3, 'Priya Sharma', 'patient@medisphere.com',
       '$2b$10$zJfoCJug.imD3eXk62GJvuRSVh3T9OsnZ1kLPrOamOyEI0B13FcZu', 'PATIENT', NULL) t
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@medisphere.com');

INSERT INTO users (id, name, email, password, role, specialization)
SELECT * FROM (SELECT 4, 'Meera Nair', 'reception@medisphere.com',
       '$2b$10$0vKxIm1LTdWoZDt0yqeXbuA7XBI3Zbkh4kgdKIQmSX5.S.evAZlpS', 'RECEPTIONIST', NULL) t
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'reception@medisphere.com');

-- Patients
INSERT INTO patients (id, name, age, gender, phone, blood_group, condition, last_visit, doctor, status)
SELECT * FROM (SELECT 101, 'Priya Sharma', 29, 'Female', '+91 98765 43210', 'O+', 'Hypertension', DATE'2026-07-12', 'Dr. Rajesh Menon', 'Active') t
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE id = 101);

INSERT INTO patients (id, name, age, gender, phone, blood_group, condition, last_visit, doctor, status)
SELECT * FROM (SELECT 102, 'Arjun Verma', 45, 'Male', '+91 91234 56780', 'B+', 'Type 2 Diabetes', DATE'2026-07-18', 'Dr. Rajesh Menon', 'Active') t
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE id = 102);

INSERT INTO patients (id, name, age, gender, phone, blood_group, condition, last_visit, doctor, status)
SELECT * FROM (SELECT 103, 'Kavita Iyer', 34, 'Female', '+91 99887 66554', 'A-', 'Post-surgery follow-up', DATE'2026-06-30', 'Dr. Sana Kapoor', 'Discharged') t
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE id = 103);

INSERT INTO patients (id, name, age, gender, phone, blood_group, condition, last_visit, doctor, status)
SELECT * FROM (SELECT 104, 'Rohan Das', 8, 'Male', '+91 90000 11223', 'AB+', 'Seasonal allergy', DATE'2026-07-22', 'Dr. Sana Kapoor', 'Active') t
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE id = 104);

INSERT INTO patients (id, name, age, gender, phone, blood_group, condition, last_visit, doctor, status)
SELECT * FROM (SELECT 105, 'Neha Joshi', 61, 'Female', '+91 98123 45670', 'O-', 'Arthritis', DATE'2026-07-05', 'Dr. Rajesh Menon', 'Active') t
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE id = 105);

-- Appointments
INSERT INTO appointments (id, patient_id, patient_name, doctor, date, time, type, status)
SELECT * FROM (SELECT 201, 101, 'Priya Sharma', 'Dr. Rajesh Menon', DATE'2026-07-31', '09:30', 'Follow-up', 'Confirmed') t
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 201);

INSERT INTO appointments (id, patient_id, patient_name, doctor, date, time, type, status)
SELECT * FROM (SELECT 202, 102, 'Arjun Verma', 'Dr. Rajesh Menon', DATE'2026-07-31', '10:15', 'Consultation', 'Pending') t
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 202);

INSERT INTO appointments (id, patient_id, patient_name, doctor, date, time, type, status)
SELECT * FROM (SELECT 203, 104, 'Rohan Das', 'Dr. Sana Kapoor', DATE'2026-07-31', '11:00', 'Check-up', 'Confirmed') t
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 203);

INSERT INTO appointments (id, patient_id, patient_name, doctor, date, time, type, status)
SELECT * FROM (SELECT 204, 105, 'Neha Joshi', 'Dr. Rajesh Menon', DATE'2026-08-01', '09:00', 'Follow-up', 'Confirmed') t
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 204);

INSERT INTO appointments (id, patient_id, patient_name, doctor, date, time, type, status)
SELECT * FROM (SELECT 205, 103, 'Kavita Iyer', 'Dr. Sana Kapoor', DATE'2026-08-01', '14:30', 'Review', 'Cancelled') t
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 205);

-- Allergies
INSERT INTO allergies (patient_id, name) SELECT 101, 'Penicillin' WHERE NOT EXISTS (SELECT 1 FROM allergies WHERE patient_id = 101 AND name = 'Penicillin');
INSERT INTO allergies (patient_id, name) SELECT 101, 'Peanuts' WHERE NOT EXISTS (SELECT 1 FROM allergies WHERE patient_id = 101 AND name = 'Peanuts');
INSERT INTO allergies (patient_id, name) SELECT 103, 'Sulfa drugs' WHERE NOT EXISTS (SELECT 1 FROM allergies WHERE patient_id = 103 AND name = 'Sulfa drugs');
INSERT INTO allergies (patient_id, name) SELECT 104, 'Pollen (seasonal)' WHERE NOT EXISTS (SELECT 1 FROM allergies WHERE patient_id = 104 AND name = 'Pollen (seasonal)');

-- Prescriptions
INSERT INTO prescriptions (patient_id, drug, dosage, prescribed_by, date)
SELECT 101, 'Amlodipine 5mg', 'Once daily', 'Dr. Rajesh Menon', DATE'2026-07-12'
WHERE NOT EXISTS (SELECT 1 FROM prescriptions WHERE patient_id = 101 AND drug = 'Amlodipine 5mg');

INSERT INTO prescriptions (patient_id, drug, dosage, prescribed_by, date)
SELECT 101, 'Aspirin 75mg', 'Once daily, after food', 'Dr. Rajesh Menon', DATE'2026-07-12'
WHERE NOT EXISTS (SELECT 1 FROM prescriptions WHERE patient_id = 101 AND drug = 'Aspirin 75mg');

INSERT INTO prescriptions (patient_id, drug, dosage, prescribed_by, date)
SELECT 102, 'Metformin 500mg', 'Twice daily', 'Dr. Rajesh Menon', DATE'2026-07-18'
WHERE NOT EXISTS (SELECT 1 FROM prescriptions WHERE patient_id = 102 AND drug = 'Metformin 500mg');

INSERT INTO prescriptions (patient_id, drug, dosage, prescribed_by, date)
SELECT 104, 'Cetirizine 10mg', 'Once daily as needed', 'Dr. Sana Kapoor', DATE'2026-07-22'
WHERE NOT EXISTS (SELECT 1 FROM prescriptions WHERE patient_id = 104 AND drug = 'Cetirizine 10mg');

INSERT INTO prescriptions (patient_id, drug, dosage, prescribed_by, date)
SELECT 105, 'Ibuprofen 200mg', 'Twice daily with food', 'Dr. Rajesh Menon', DATE'2026-07-05'
WHERE NOT EXISTS (SELECT 1 FROM prescriptions WHERE patient_id = 105 AND drug = 'Ibuprofen 200mg');

-- Consents (per-patient) — seeded for patient 101 (Priya Sharma) to match consentService.js mock
INSERT INTO consents (patient_id, label, description, granted, required)
SELECT 101, 'Share records with treating doctor', 'Allows your doctor to view your full medical history during consultations.', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE patient_id = 101 AND label = 'Share records with treating doctor');

INSERT INTO consents (patient_id, label, description, granted, required)
SELECT 101, 'Share data with insurance provider', 'Allows billing and insurance claims to access relevant treatment records.', TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE patient_id = 101 AND label = 'Share data with insurance provider');

INSERT INTO consents (patient_id, label, description, granted, required)
SELECT 101, 'Use of data for research (anonymized)', 'Your anonymized data may be used in medical research studies.', FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE patient_id = 101 AND label = 'Use of data for research (anonymized)');

INSERT INTO consents (patient_id, label, description, granted, required)
SELECT 101, 'Telemedicine consultation recording', 'Allows recording of video consultations for quality and reference.', FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE patient_id = 101 AND label = 'Telemedicine consultation recording');

INSERT INTO consents (patient_id, label, description, granted, required)
SELECT 101, 'SMS / email health reminders', 'Allows the platform to send appointment and medication reminders.', TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE patient_id = 101 AND label = 'SMS / email health reminders');

-- Vitals — a starting baseline reading for patient 101 so history isn't empty
-- before the live WebSocket feed (see VitalsWebSocketHandler) writes more.
INSERT INTO vitals (patient_id, heart_rate, spo2, systolic_bp, diastolic_bp, temperature, recorded_at)
SELECT 101, 72, 98, 120, 80, 36.8, TIMESTAMP'2026-08-06 19:09:03'
WHERE NOT EXISTS (SELECT 1 FROM vitals WHERE patient_id = 101 AND recorded_at = TIMESTAMP'2026-08-06 19:09:03');
