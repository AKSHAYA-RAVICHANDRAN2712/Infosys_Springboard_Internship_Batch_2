insert into clinical_guideline(code,name,condition_name,description,version,status)
values('DIABETES-001','Diabetes Care Guideline','Diabetes','Demo project guideline for HbA1c monitoring and medication/allergy checks','1.0','ACTIVE')
on conflict (code) do nothing;
insert into guideline_rule(guideline_id,rule_code,rule_type,rule_description,threshold,unit,priority,active)
select g.id,'DM-HBA1C-01','HBA1C_MAX','HbA1c should remain within configured project threshold',7.0,'percent',1,true
from clinical_guideline g where g.code='DIABETES-001'
and not exists(select 1 from guideline_rule r where r.rule_code='DM-HBA1C-01');
insert into guideline_rule(guideline_id,rule_code,rule_type,rule_description,threshold,unit,priority,active)
select g.id,'DM-HBA1C-02','HBA1C_MONITORING_DAYS_MAX','HbA1c monitoring interval should not exceed configured threshold',90,'days',2,true
from clinical_guideline g where g.code='DIABETES-001'
and not exists(select 1 from guideline_rule r where r.rule_code='DM-HBA1C-02');
insert into guideline_rule(guideline_id,rule_code,rule_type,rule_description,threshold,unit,priority,active)
select g.id,'DM-ALLERGY-01','ALLERGY_MEDICATION','Medication/allergy combination should be reviewed',null,null,3,true
from clinical_guideline g where g.code='DIABETES-001'
and not exists(select 1 from guideline_rule r where r.rule_code='DM-ALLERGY-01');
