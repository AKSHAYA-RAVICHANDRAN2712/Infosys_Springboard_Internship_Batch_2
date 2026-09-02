package com.medisphere.milestone3.service;

import com.medisphere.milestone3.dto.*;
import com.medisphere.milestone3.entity.AlertFatigue;
import com.medisphere.milestone3.enums.*;
import com.medisphere.milestone3.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.*;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class AlertFatigueService {
    private final AlertRepository repo;
    private final long windowMinutes;
    public AlertFatigueService(AlertRepository repo,@Value("${alert-fatigue.suppression-window-minutes:5}")long windowMinutes){this.repo=repo;this.windowMinutes=windowMinutes;}

    public AlertResponse process(AlertRequest r){
        LocalDateTime now=parseTimestamp(r.timestamp());
        LocalDateTime since=now.minusMinutes(windowMinutes);
        Optional<AlertFatigue> recent=repo.findTopByPatientIdAndAlertTypeAndAlertTimestampAfterOrderByAlertTimestampDesc(r.patientId(),r.alertType(),since);
        if(recent.isEmpty()){
            AlertFatigue a=new AlertFatigue(); a.setPatientId(r.patientId()); a.setAlertType(r.alertType()); a.setSeverity(r.severity());
            a.setMessage(r.message()); a.setConfidence(r.confidence()); a.setAlertTimestamp(now); a.setStatus(AlertStatus.ACTIVE); a.setSuppressed(false); a.setOccurrenceCount(1); a.setSource(defaultSource(r.source()));
            return toResponse(repo.save(a));
        }
        AlertFatigue previous=recent.get();
        int count=previous.getOccurrenceCount()+1;
        AlertFatigue a=new AlertFatigue();
        a.setPatientId(r.patientId()); a.setAlertType(r.alertType()); a.setSeverity(r.severity());
        a.setMessage(r.message()); a.setConfidence(r.confidence()); a.setAlertTimestamp(now); a.setSource(defaultSource(r.source()));
        a.setOccurrenceCount(count); a.setSuppressed(false);
        boolean critical=r.severity()==AlertSeverity.CRITICAL;
        boolean worsening=r.severity().ordinal()>previous.getSeverity().ordinal();
        if(critical || worsening){
            a.setStatus(AlertStatus.ESCALATED);
        }else{
            a.setStatus(AlertStatus.SUPPRESSED); a.setSuppressed(true);
            a.setSuppressionReason("Repeated "+r.alertType()+" within "+windowMinutes+" minutes");
        }
        return toResponse(repo.save(a));
    }

    public List<AlertResponse> recent(){return repo.findTop50ByOrderByAlertTimestampDesc().stream().map(this::toResponse).toList();}
    public AlertResponse get(Long id){return repo.findById(id).map(this::toResponse).orElseThrow(()->new NoSuchElementException("Alert not found: "+id));}
    public AlertResponse acknowledge(Long id){AlertFatigue a=find(id);a.setStatus(AlertStatus.ACKNOWLEDGED);a.setSuppressed(false);return toResponse(repo.save(a));}
    public AlertResponse escalate(Long id){AlertFatigue a=find(id);a.setSeverity(AlertSeverity.CRITICAL);a.setStatus(AlertStatus.ESCALATED);a.setSuppressed(false);a.setSuppressionReason(null);return toResponse(repo.save(a));}
    public AlertMetricsResponse metrics(){LocalDateTime s=LocalDateTime.now().minusHours(1);long total=repo.countByAlertTimestampAfter(s);long suppressed=repo.countBySuppressedTrueAndAlertTimestampAfter(s);long active=repo.countByStatusAndAlertTimestampAfter(AlertStatus.ACTIVE,s)+repo.countByStatusAndAlertTimestampAfter(AlertStatus.ESCALATED,s);double rate=total==0?0:(100.0*suppressed/total);return new AlertMetricsResponse(total,suppressed,active,rate);}
    private AlertFatigue find(Long id){return repo.findById(id).orElseThrow(()->new NoSuchElementException("Alert not found: "+id));}
    private String defaultSource(String s){return s==null||s.isBlank()?"SYSTEM":s;}
    private LocalDateTime parseTimestamp(String t){if(t==null||t.isBlank())return LocalDateTime.now();try{return LocalDateTime.parse(t);}catch(DateTimeParseException ignored){try{return OffsetDateTime.parse(t).toLocalDateTime();}catch(DateTimeParseException e){return LocalDateTime.now();}}}
    private AlertResponse toResponse(AlertFatigue a){return new AlertResponse(a.getId(),a.getPatientId(),a.getAlertType(),a.getSeverity(),a.getMessage(),a.getConfidence(),a.getStatus(),a.isSuppressed(),a.getSuppressionReason(),a.getOccurrenceCount(),a.getSource(),a.getAlertTimestamp().toString(),a.getCreatedAt().toString(),a.getUpdatedAt().toString());}
}
