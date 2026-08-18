package com.shap.shap_integration.service;

import com.shap.shap_integration.dtos.PredictionRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class MLService {

    private final RestClient restClient;

    public MLService(
            @Value("${ml.service.url}") String mlServiceUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
    }

    public Map<String, Object> predict(
            PredictionRequest request
    ) {

        return restClient.post()
                .uri("/api/explain")
                .body(request)
                .retrieve()
                .body(Map.class);
    }
}
