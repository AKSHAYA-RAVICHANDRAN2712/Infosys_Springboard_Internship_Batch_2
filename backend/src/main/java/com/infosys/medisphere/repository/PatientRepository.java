package com.infosys.medisphere.repository;

import com.infosys.medisphere.model.PatientTwin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends MongoRepository<PatientTwin, String> {
}