ALTER TABLE synthea.patients
ADD CONSTRAINT pk_patients PRIMARY KEY (id);

ALTER TABLE synthea.encounters
ADD CONSTRAINT pk_encounters PRIMARY KEY (id);

ALTER TABLE synthea.providers
ADD CONSTRAINT pk_providers PRIMARY KEY (id);

ALTER TABLE synthea.organizations
ADD CONSTRAINT pk_organizations PRIMARY KEY (id);

ALTER TABLE synthea.payers
ADD CONSTRAINT pk_payers PRIMARY KEY (id);
