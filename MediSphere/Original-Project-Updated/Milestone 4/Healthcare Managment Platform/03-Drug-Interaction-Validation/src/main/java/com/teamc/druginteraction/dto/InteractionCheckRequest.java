package com.teamc.druginteraction.dto;
import java.util.List; public class InteractionCheckRequest { private List<String> medicines; public InteractionCheckRequest(){} public List<String> getMedicines(){return medicines;} public void setMedicines(List<String> v){medicines=v;} }
