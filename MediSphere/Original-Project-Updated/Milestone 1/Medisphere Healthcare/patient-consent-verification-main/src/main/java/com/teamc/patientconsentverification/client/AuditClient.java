package com.teamc.patientconsentverification.client;

import com.teamc.patientconsentverification.dto.AuditLogRequest;
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

        } catch (Exception e) {
            System.err.println(
                    "Audit Service unavailable: " + e.getMessage()
            );
        }
    }
}