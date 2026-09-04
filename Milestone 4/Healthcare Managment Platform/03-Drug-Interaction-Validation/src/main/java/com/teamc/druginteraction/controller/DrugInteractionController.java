package com.teamc.druginteraction.controller;
import com.teamc.druginteraction.dto.*; import com.teamc.druginteraction.service.DrugInteractionService; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/interactions") @CrossOrigin(origins="*") public class DrugInteractionController {
 private final DrugInteractionService service; public DrugInteractionController(DrugInteractionService s){service=s;}
 @GetMapping("/health") public Map<String,String> health(){return Map.of("status","UP","module","Drug Interaction Validation");}
 @GetMapping("/medicines") public Map<String,Object> medicines(){return Map.of("items",service.medicines());}
 @GetMapping("/stats") public Map<String,Object> stats(){return Map.of("interactionRules",service.interactionCount());}
 @PostMapping("/check") public Object check(@RequestBody InteractionCheckRequest request){try{return service.check(request);}catch(IllegalArgumentException e){return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status",404,"error","Medicine Not Found","message",e.getMessage()));}}
}
