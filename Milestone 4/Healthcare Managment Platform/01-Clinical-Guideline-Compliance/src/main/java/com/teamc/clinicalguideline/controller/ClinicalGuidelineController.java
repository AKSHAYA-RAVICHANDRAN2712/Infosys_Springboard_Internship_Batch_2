package com.teamc.clinicalguideline.controller;

import com.teamc.clinicalguideline.dto.ClinicalGuidelineRequest;
import com.teamc.clinicalguideline.dto.ComplianceResponse;
import com.teamc.clinicalguideline.service.ClinicalGuidelineService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/clinical-guidelines")
@CrossOrigin(origins="*")
public class ClinicalGuidelineController {
    private final ClinicalGuidelineService service;
    public ClinicalGuidelineController(ClinicalGuidelineService service){this.service=service;}
    @GetMapping("/health") public Map<String,String> health(){return Map.of("status","UP","module","Clinical Guideline Compliance");}
    @GetMapping public Map<String,Object> guidelines(){return Map.of("items",service.guidelines(),"count",service.guidelines().size());}
    @GetMapping("/stats") public Map<String,Object> stats(){return Map.of("storedResults",service.resultCount());}
    @PostMapping("/check") public ComplianceResponse check(@Valid @RequestBody ClinicalGuidelineRequest request){return service.check(request);}
}
