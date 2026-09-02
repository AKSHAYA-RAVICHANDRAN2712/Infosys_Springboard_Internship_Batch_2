package com.medisphere.milestone3.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medisphere.milestone3.dto.*;
import com.medisphere.milestone3.entity.AnomalyRecord;
import com.medisphere.milestone3.enums.AlertSeverity;
import com.medisphere.milestone3.repository.AnomalyRecordRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;

@Service
public class AnomalyService {
    private final RestClient client; private final ObjectMapper mapper=new ObjectMapper(); private final AnomalyRecordRepository repo; private final AlertFatigueService alertService;
    public AnomalyService(@Value("${ml.service.url:http://localhost:5001}")String url,AnomalyRecordRepository repo,AlertFatigueService alertService){client=RestClient.builder().baseUrl(url).build();this.repo=repo;this.alertService=alertService;}
    public Map<String,Object> health(){try{JsonNode n=mapper.readTree(client.get().uri("/health").retrieve().body(String.class));double p=n.path("precisionPercent").asDouble(0);return Map.of("status","UP","modelLoaded",n.path("modelLoaded").asBoolean(false),"precisionPercent",p,"targetMet",p>85);}catch(Exception e){return Map.of("status","DOWN","modelLoaded",false,"precisionPercent",0.0,"targetMet",false,"message","Python ML service unavailable");}}
    public PrecisionResponse precision(){try{JsonNode n=mapper.readTree(client.get().uri("/metrics").retrieve().body(String.class));double p=n.path("precisionPercent").asDouble(0);long tp=n.path("truePositives").asLong(0),fp=n.path("falsePositives").asLong(0),total=n.path("total").asLong(0);return new PrecisionResponse(p/100.0,p,tp,fp,total,n.path("threshold").asDouble(.8),p>85);}catch(Exception e){return new PrecisionResponse(0,0,0,0,0,.8,false);}}
    public AnomalyResponse detect(Map<String,Object> payload){
        try{String body=client.post().uri("/predict").contentType(MediaType.APPLICATION_JSON).body(payload).retrieve().body(String.class);return handle(mapper.readTree(body),payload);}catch(Exception e){throw new IllegalStateException("Anomaly Detection service is unavailable. Start the Python ML service on port 5001.",e);}
    }
    private AnomalyResponse handle(JsonNode n,Map<String,Object> p)throws Exception{
        boolean detected=n.path("anomalyDetected").asBoolean(false);int pred=n.path("prediction").asInt(0);double score=n.path("anomalyScore").asDouble(0);double precision=n.path("precisionPercent").asDouble(0);String msg=n.path("message").asText();Map<String,Double> shap=n.has("shap")?mapper.convertValue(n.get("shap"),new TypeReference<Map<String,Double>>(){}):Map.of();save(p,detected,pred,score,precision,msg);if(detected)createAlert(p,score,msg);return new AnomalyResponse(true,detected,pred,score,precision,precision>85,msg,p,shap);
    }
    private void createAlert(Map<String,Object> p,double score,String msg){String patient=String.valueOf(p.getOrDefault("patientId",p.getOrDefault("patient_id","UNKNOWN")));AlertSeverity sev=score>=.90?AlertSeverity.CRITICAL:AlertSeverity.HIGH;alertService.process(new AlertRequest(patient,"ANOMALY_DETECTED",sev,msg,score,null,"ANOMALY_DETECTION"));}
    private void save(Map<String,Object> p,boolean detected,int pred,double score,double precision,String msg){AnomalyRecord a=new AnomalyRecord();a.setPatientId(String.valueOf(p.getOrDefault("patientId",p.getOrDefault("patient_id","UNKNOWN"))));a.setAnomalyDetected(detected);a.setPrediction(pred);a.setAnomalyScore(score);a.setPrecisionPercent(precision);a.setHeartRate(num(p.get("heart_rate")));a.setSystolicBp(num(p.get("systolic_bp")));a.setDiastolicBp(num(p.get("diastolic_bp")));a.setRespiratoryRate(num(p.get("respiratory_rate")));a.setSpo2(num(p.get("spo2")));a.setTemperature(num(p.get("temperature")));a.setMessage(msg);repo.save(a);}
    private double num(Object x){if(x==null)return 0;try{return Double.parseDouble(String.valueOf(x));}catch(Exception e){return 0;}}
}
