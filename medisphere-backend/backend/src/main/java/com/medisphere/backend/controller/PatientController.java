package com.medisphere.backend.controller;

import com.medisphere.backend.entity.Appointment;
import com.medisphere.backend.entity.Patient;
import com.medisphere.backend.entity.Prescription;
import com.medisphere.backend.entity.Vitals;
import com.medisphere.backend.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public List<Patient> getAll() {
        return patientService.getAll();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id) {
        return patientService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Patient create(@Valid @RequestBody Patient patient) {
        return patientService.create(patient);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.update(id, patient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/allergies")
    public List<String> getAllergies(@PathVariable Long id) {
        return patientService.getAllergies(id);
    }

    @GetMapping("/{id}/prescriptions")
    public List<Prescription> getPrescriptions(@PathVariable Long id) {
        return patientService.getPrescriptions(id);
    }

    @GetMapping("/{id}/appointments")
    public List<Appointment> getAppointments(@PathVariable Long id) {
        return patientService.getAppointments(id);
    }

    /** Historical readings persisted from the live /ws/vitals/{id} feed, most recent first. */
    @GetMapping("/{id}/vitals")
    public List<Vitals> getVitals(@PathVariable Long id) {
        return patientService.getVitals(id);
    }
}
