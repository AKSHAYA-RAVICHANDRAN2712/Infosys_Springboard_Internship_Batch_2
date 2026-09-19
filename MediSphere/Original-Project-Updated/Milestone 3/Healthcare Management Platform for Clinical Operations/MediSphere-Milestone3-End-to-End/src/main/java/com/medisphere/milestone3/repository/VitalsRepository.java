package com.medisphere.milestone3.repository;
import com.medisphere.milestone3.entity.Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface VitalsRepository extends JpaRepository<Vitals,Long>{
 List<Vitals> findTop50ByOrderByIdDesc();
 long countByHeartRateStatusNot(String status);
}
