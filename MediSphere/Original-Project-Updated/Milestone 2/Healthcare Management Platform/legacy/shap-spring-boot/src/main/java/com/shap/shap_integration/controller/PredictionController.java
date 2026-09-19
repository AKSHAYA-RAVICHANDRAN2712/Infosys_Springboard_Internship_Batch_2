package com.shap.shap_integration.controller;

import com.shap.shap_integration.dtos.PredictionRequest;
import com.shap.shap_integration.service.MLService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/shap")
@CrossOrigin(origins = "*")
public class PredictionController {
    private final MLService mlService;

    public PredictionController(
            MLService mlService
    ) {
        this.mlService = mlService;
    }

    @PostMapping("/predict")
    public Map<String, Object> predict(
            @RequestBody PredictionRequest request
    ) {

        return mlService.predict(
                request
        );
    }
}
