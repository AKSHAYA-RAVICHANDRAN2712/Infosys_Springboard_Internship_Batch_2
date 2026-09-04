package com.teamc.clinicalguideline.service;

import com.teamc.clinicalguideline.dto.ClinicalGuidelineRequest;
import com.teamc.clinicalguideline.dto.ComplianceResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ClinicalGuidelineService {
    private final JdbcTemplate jdbc;
    public ClinicalGuidelineService(JdbcTemplate jdbc){this.jdbc=jdbc;}

    public ComplianceResponse check(ClinicalGuidelineRequest r){
        List<String> violations=new ArrayList<>(), warnings=new ArrayList<>();
        String guidelineCode=jdbc.query("select code from clinical_guideline where upper(condition_name)=upper(?) and status='ACTIVE' order by id limit 1",
                ps->{ps.setString(1,r.getCondition());}, rs->rs.next()?rs.getString(1):null);
        if(guidelineCode==null){
            warnings.add("No active guideline configured for condition: "+r.getCondition());
        } else {
            jdbc.query("select rule_type, threshold from guideline_rule where guideline_id=(select id from clinical_guideline where code=?) and active=true order by priority",
                    ps->{ps.setString(1,guidelineCode);}, rs->{while(rs.next()){
                        String type=rs.getString("rule_type"); double threshold=rs.getDouble("threshold");
                        if("HBA1C_MAX".equals(type) && r.getHba1c()>threshold) violations.add("HbA1c exceeds configured maximum of "+threshold);
                        if("HBA1C_MONITORING_DAYS_MAX".equals(type) && r.getHba1cMonitoringDays()>threshold) violations.add("HbA1c monitoring interval exceeds "+(int)threshold+" days");
                    }});
        }
        List<String> allergies=r.getAllergies()==null?List.of():r.getAllergies();
        List<String> meds=new ArrayList<>(); if(r.getMedications()!=null) meds.addAll(r.getMedications()); if(r.getCarePlanMedications()!=null) meds.addAll(r.getCarePlanMedications());
        for(String allergy:allergies){ for(String med:meds){ if(allergy!=null&&med!=null&&med.toLowerCase(Locale.ROOT).contains(allergy.toLowerCase(Locale.ROOT))) violations.add("Medication may conflict with allergy: "+med); }}
        boolean compliant=violations.isEmpty();
        String status=compliant?"COMPLIANT":"NON_COMPLIANT";
        jdbc.update("insert into compliance_result(patient_id,care_plan_id,guideline_code,status,violations,warnings,checked_at) values (?,?,?,?,?,?,now())",
                parseLong(r.getPatientId()),parseLong(r.getCarePlanId()),guidelineCode,status,String.join(" | ",violations),String.join(" | ",warnings));
        return new ComplianceResponse(compliant,status,guidelineCode,violations,warnings, OffsetDateTime.now().toString());
    }
    public List<String> guidelines(){return jdbc.query("select code || ' — ' || name || ' — ' || condition_name from clinical_guideline where status='ACTIVE' order by id",(rs,n)->rs.getString(1));}
    public long resultCount(){return jdbc.queryForObject("select count(*) from compliance_result",Long.class);}
    private Long parseLong(String s){try{return Long.valueOf(s);}catch(Exception e){return null;}}
}
