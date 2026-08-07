CREATE INDEX idx_encounters_patient
ON synthea.encounters(patient);

CREATE INDEX idx_conditions_patient
ON synthea.conditions(patient);

CREATE INDEX idx_medications_patient
ON synthea.medications(patient);

CREATE INDEX idx_observations_patient
ON synthea.observations(patient);

CREATE INDEX idx_encounters_provider
ON synthea.encounters(provider);

CREATE INDEX idx_encounters_organization
ON synthea.encounters(organization);
