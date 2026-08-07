CREATE SCHEMA IF NOT EXISTS synthea;

CREATE TABLE IF NOT EXISTS synthea.allergies (
    START timestamp,
    STOP timestamp,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.careplans (
    Id text,
    START timestamp,
    STOP timestamp,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    REASONCODE text,
    REASONDESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.conditions (
    START timestamp,
    STOP timestamp,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.devices (
    START timestamp,
    STOP timestamp,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    UDI text
);

CREATE TABLE IF NOT EXISTS synthea.encounters (
    Id text,
    START timestamp,
    STOP timestamp,
    PATIENT text,
    ORGANIZATION text,
    PROVIDER text,
    PAYER text,
    ENCOUNTERCLASS text,
    CODE text,
    DESCRIPTION text,
    BASE_ENCOUNTER_COST numeric(14,2),
    TOTAL_CLAIM_COST numeric(14,2),
    PAYER_COVERAGE numeric(14,2),
    REASONCODE text,
    REASONDESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.imaging_studies (
    Id text,
    DATE date,
    PATIENT text,
    ENCOUNTER text,
    BODYSITE_CODE text,
    BODYSITE_DESCRIPTION text,
    MODALITY_CODE text,
    MODALITY_DESCRIPTION text,
    SOP_CODE text,
    SOP_DESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.immunizations (
    DATE date,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    BASE_COST numeric(14,2)
);

CREATE TABLE IF NOT EXISTS synthea.medications (
    START timestamp,
    STOP timestamp,
    PATIENT text,
    PAYER text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    BASE_COST numeric(14,2),
    PAYER_COVERAGE numeric(14,2),
    DISPENSES integer,
    TOTALCOST numeric(14,2),
    REASONCODE text,
    REASONDESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.observations (
    DATE date,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    VALUE text,
    UNITS text,
    TYPE text
);

CREATE TABLE IF NOT EXISTS synthea.organizations (
    Id text,
    NAME text,
    ADDRESS text,
    CITY text,
    STATE text,
    ZIP text,
    LAT double precision,
    LON double precision,
    PHONE text,
    REVENUE numeric(14,2),
    UTILIZATION numeric(10,2)
);

CREATE TABLE IF NOT EXISTS synthea.patients (
    Id text,
    BIRTHDATE date,
    DEATHDATE date,
    SSN text,
    DRIVERS text,
    PASSPORT text,
    PREFIX text,
    FIRST text,
    LAST text,
    SUFFIX text,
    MAIDEN text,
    MARITAL text,
    RACE text,
    ETHNICITY text,
    GENDER text,
    BIRTHPLACE text,
    ADDRESS text,
    CITY text,
    STATE text,
    COUNTY text,
    ZIP text,
    LAT double precision,
    LON double precision,
    HEALTHCARE_EXPENSES numeric(14,2),
    HEALTHCARE_COVERAGE numeric(14,2)
);

CREATE TABLE IF NOT EXISTS synthea.payers (
    Id text,
    NAME text,
    ADDRESS text,
    CITY text,
    STATE_HEADQUARTERED text,
    ZIP text,
    PHONE text,
    AMOUNT_COVERED numeric(14,2),
    AMOUNT_UNCOVERED numeric(14,2),
    REVENUE numeric(14,2),
    COVERED_ENCOUNTERS integer,
    UNCOVERED_ENCOUNTERS integer,
    COVERED_MEDICATIONS integer,
    UNCOVERED_MEDICATIONS integer,
    COVERED_PROCEDURES integer,
    UNCOVERED_PROCEDURES integer,
    COVERED_IMMUNIZATIONS integer,
    UNCOVERED_IMMUNIZATIONS integer,
    UNIQUE_CUSTOMERS integer,
    QOLS_AVG numeric(10,2),
    MEMBER_MONTHS integer
);

CREATE TABLE IF NOT EXISTS synthea.payer_transitions (
    PATIENT text,
    START_YEAR integer,
    END_YEAR integer,
    PAYER text,
    OWNERSHIP text
);

CREATE TABLE IF NOT EXISTS synthea.procedures (
    DATE date,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    BASE_COST numeric(14,2),
    REASONCODE text,
    REASONDESCRIPTION text
);

CREATE TABLE IF NOT EXISTS synthea.providers (
    Id text,
    ORGANIZATION text,
    NAME text,
    GENDER text,
    SPECIALITY text,
    ADDRESS text,
    CITY text,
    STATE text,
    ZIP text,
    LAT double precision,
    LON double precision,
    UTILIZATION numeric(10,2)
);

CREATE TABLE IF NOT EXISTS synthea.supplies (
    DATE date,
    PATIENT text,
    ENCOUNTER text,
    CODE text,
    DESCRIPTION text,
    QUANTITY integer
);
