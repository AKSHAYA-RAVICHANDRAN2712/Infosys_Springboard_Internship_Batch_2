package com.teamc.druginteraction.service;
import com.teamc.druginteraction.dto.*; import org.springframework.jdbc.core.JdbcTemplate; import org.springframework.stereotype.Service; import java.util.*;
@Service public class DrugInteractionService {
 private final JdbcTemplate jdbc; public DrugInteractionService(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public List<InteractionResponse> check(InteractionCheckRequest req){
  if(req==null||req.getMedicines()==null||req.getMedicines().size()<2) return List.of();
  List<String> meds=req.getMedicines().stream().filter(Objects::nonNull).map(String::trim).filter(s->!s.isBlank()).distinct().toList();
  for(String m:meds){Integer c=jdbc.queryForObject("select count(*) from medicines where lower(name)=lower(?)",Integer.class,m); if(c==null||c==0) throw new IllegalArgumentException("Medicine not found: "+m);}
  List<InteractionResponse> out=new ArrayList<>();
  for(int i=0;i<meds.size();i++) for(int j=i+1;j<meds.size();j++){
   String a=meds.get(i),b=meds.get(j);
   List<InteractionResponse> rows=jdbc.query("select drug1,drug2,severity,description,recommendation from drug_interactions where (lower(drug1)=lower(?) and lower(drug2)=lower(?)) or (lower(drug1)=lower(?) and lower(drug2)=lower(?))",(rs,n)->new InteractionResponse(rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5)),a,b,b,a);
   out.addAll(rows);
  }
  return out;
 }
 public List<String> medicines(){return jdbc.query("select name from medicines order by name",(rs,n)->rs.getString(1));}
 public long interactionCount(){return jdbc.queryForObject("select count(*) from drug_interactions",Long.class);}
}
