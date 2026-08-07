ALTER TABLE synthea.encounters
ADD CONSTRAINT fk_encounters_patient
FOREIGN KEY (patient)
REFERENCES synthea.patients(id);

ALTER TABLE synthea.conditions
ADD CONSTRAINT fk_conditions_patient
FOREIGN KEY (patient)
REFERENCES synthea.patients(id);

ALTER TABLE synthea.medications
ADD CONSTRAINT fk_medications_patient
FOREIGN KEY (patient)
REFERENCES synthea.patients(id);

ALTER TABLE synthea.observations
ADD CONSTRAINT fk_observations_patient
FOREIGN KEY (patient)
REFERENCES synthea.patients(id);
