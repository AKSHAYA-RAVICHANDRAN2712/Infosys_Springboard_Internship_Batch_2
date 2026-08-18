package com.teamc.patientconsentverification.service;

import com.teamc.patientconsentverification.dto.PatientConsentRequest;
import com.teamc.patientconsentverification.dto.PatientConsentResponse;

public interface PatientConsentService {

    PatientConsentResponse verifyConsent(PatientConsentRequest request);

}