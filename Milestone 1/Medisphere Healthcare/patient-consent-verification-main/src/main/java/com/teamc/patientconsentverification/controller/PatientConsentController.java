package com.teamc.patientconsentverification.controller;
import com.teamc.patientconsentverification.entity.PatientEntity;
import com.teamc.patientconsentverification.repository.PatientRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.teamc.patientconsentverification.dto.PatientConsentRequest;
import com.teamc.patientconsentverification.dto.PatientConsentResponse;
import com.teamc.patientconsentverification.service.PatientConsentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consent")
@CrossOrigin(origins = "*")
public class PatientConsentController {

    @Autowired
    private PatientConsentService patientConsentService;

    @GetMapping("/health")
    public String health() {
        return "Patient consent service is UP";
    }

    @PostMapping("/verify")
    public PatientConsentResponse verifyConsent(
            @Valid @RequestBody PatientConsentRequest request) {

        return patientConsentService.verifyConsent(request);
    }


    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/patients")
    public List<PatientEntity> getAllPatients() {
        return patientRepository.findAll();
    }
}