package com.teamc.careplansafety.controller;
import com.teamc.careplansafety.dto.*; import com.teamc.careplansafety.service.CarePlanSafetyService; import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/careplans") @CrossOrigin(origins="*")
public class CarePlanSafetyController {
 private final CarePlanSafetyService service; public CarePlanSafetyController(CarePlanSafetyService s){service=s;}
 @GetMapping("/health") public Map<String,String> health(){return Map.of("status","UP","module","Careplan Safety Checks");}
 @PostMapping("/safety-check") public CarePlanSafetyResponse check(@Valid @RequestBody CarePlanSafetyRequest r){return service.validate(r);}
 @GetMapping("/history/{patientId}") public Map<String,Object> history(@PathVariable String patientId){return Map.of("patientId",patientId,"items",service.history(patientId));}
 @GetMapping("/stats") public Map<String,Object> stats(){return Map.of("storedResults",service.resultCount());}
}
