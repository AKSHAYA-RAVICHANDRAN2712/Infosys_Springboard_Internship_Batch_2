
package com.teamc.fhir_validation.client;

import com.teamc.fhir_validation.dto.AuditLogRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AuditClient {

    private final RestClient restClient;

    @Value("${audit.service.url}")
    private String auditServiceUrl;

    public AuditClient() {
        this.restClient = RestClient.create();
    }

    public void log(AuditLogRequest request) {


        try {

            restClient.post()
                    .uri(auditServiceUrl + "/api/audit/log")
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("AUDIT SENT SUCCESSFULLY");

        } catch (Exception e) {

            System.err.println("AUDIT FAILED");
            System.err.println("Error: " + e.getMessage());
        }

        System.out.println("=========== AUDIT END ===========");
    }
}