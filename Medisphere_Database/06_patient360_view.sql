CREATE OR REPLACE VIEW synthea.patient360 AS
SELECT
    p.id,
    p.first,
    p.last,
    p.gender,
    p.birthdate,
    p.city,
    p.state,
    COUNT(DISTINCT e.id) AS total_encounters,
    COUNT(DISTINCT c.code) AS total_conditions,
    COUNT(DISTINCT m.code) AS total_medications
FROM synthea.patients p
LEFT JOIN synthea.encounters e
    ON p.id = e.patient
LEFT JOIN synthea.conditions c
    ON p.id = c.patient
LEFT JOIN synthea.medications m
    ON p.id = m.patient
GROUP BY
    p.id,
    p.first,
    p.last,
    p.gender,
    p.birthdate,
    p.city,
    p.state;
