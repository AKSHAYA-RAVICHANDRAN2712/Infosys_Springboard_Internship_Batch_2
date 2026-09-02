package com.medisphere.milestone3.service;

import com.medisphere.milestone3.dto.AlertRequest;
import com.medisphere.milestone3.entity.AlertFatigue;
import com.medisphere.milestone3.enums.*;
import com.medisphere.milestone3.repository.AlertRepository;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AlertFatigueServiceTest {
    @Test void firstAlertActive(){
        AlertRepository r=mock(AlertRepository.class);
        when(r.findTopByPatientIdAndAlertTypeAndAlertTimestampAfterOrderByAlertTimestampDesc(anyString(),anyString(),any())).thenReturn(Optional.empty());
        when(r.save(any())).thenAnswer(i->i.getArgument(0));
        var s=new AlertFatigueService(r,5);
        var a=s.process(new AlertRequest("P1","HIGH_HR",AlertSeverity.HIGH,"High HR",0.9,null,"TEST"));
        assertEquals(AlertStatus.ACTIVE,a.status()); assertFalse(a.suppressed()); assertEquals(1,a.occurrenceCount());
    }

    @Test void duplicateCreatesSuppressedHistoryRow(){
        AlertRepository r=mock(AlertRepository.class);
        AlertFatigue old=new AlertFatigue(); old.setPatientId("P1"); old.setAlertType("HIGH_HR"); old.setSeverity(AlertSeverity.HIGH);
        old.setMessage("old"); old.setStatus(AlertStatus.ACTIVE); old.setOccurrenceCount(1); old.setSuppressed(false); old.setAlertTimestamp(LocalDateTime.now());
        when(r.findTopByPatientIdAndAlertTypeAndAlertTimestampAfterOrderByAlertTimestampDesc(anyString(),anyString(),any())).thenReturn(Optional.of(old));
        when(r.save(any())).thenAnswer(i->i.getArgument(0));
        var s=new AlertFatigueService(r,5);
        var a=s.process(new AlertRequest("P1","HIGH_HR",AlertSeverity.HIGH,"again",0.8,null,"TEST"));
        assertEquals(AlertStatus.SUPPRESSED,a.status()); assertTrue(a.suppressed()); assertEquals(2,a.occurrenceCount());
        assertEquals("P1",a.patientId()); verify(r).save(any(AlertFatigue.class));
    }

    @Test void criticalRepeatEscalates(){
        AlertRepository r=mock(AlertRepository.class);
        AlertFatigue old=new AlertFatigue(); old.setPatientId("P1"); old.setAlertType("HIGH_HR"); old.setSeverity(AlertSeverity.HIGH); old.setOccurrenceCount(1); old.setStatus(AlertStatus.ACTIVE); old.setAlertTimestamp(LocalDateTime.now());
        when(r.findTopByPatientIdAndAlertTypeAndAlertTimestampAfterOrderByAlertTimestampDesc(anyString(),anyString(),any())).thenReturn(Optional.of(old));
        when(r.save(any())).thenAnswer(i->i.getArgument(0));
        var s=new AlertFatigueService(r,5);
        var a=s.process(new AlertRequest("P1","HIGH_HR",AlertSeverity.CRITICAL,"critical",0.99,null,"TEST"));
        assertEquals(AlertStatus.ESCALATED,a.status()); assertEquals(AlertSeverity.CRITICAL,a.severity()); assertFalse(a.suppressed());
    }
}
