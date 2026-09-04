package com.teamc.clinicalguideline.dto;

import java.util.List;

public class ComplianceResponse {
    private boolean compliant;
    private String status;
    private String guidelineCode;
    private List<String> violations;
    private List<String> warnings;
    private String checkedAt;

    public ComplianceResponse() {}
    public ComplianceResponse(boolean compliant,String status,String guidelineCode,List<String> violations,List<String> warnings,String checkedAt){
        this.compliant=compliant; this.status=status; this.guidelineCode=guidelineCode; this.violations=violations; this.warnings=warnings; this.checkedAt=checkedAt;
    }
    public boolean isCompliant(){return compliant;} public String getStatus(){return status;} public String getGuidelineCode(){return guidelineCode;}
    public List<String> getViolations(){return violations;} public List<String> getWarnings(){return warnings;} public String getCheckedAt(){return checkedAt;}
}
