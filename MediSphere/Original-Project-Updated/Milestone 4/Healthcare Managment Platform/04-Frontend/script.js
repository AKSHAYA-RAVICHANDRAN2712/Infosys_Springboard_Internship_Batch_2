/* MediSphere — Milestone 4, Care & Medication Safety
   Dynamic / API-ready: every module tries its backend first (fetch),
   and falls back to demo data with a clear notice if it isn't reachable
   yet — same pattern as Milestone 3's script.js. When the real backends
   are ready, just update the URLs in API below; the render functions
   already normalise whatever shape a typical REST response would use. */

const API = {
  careplan: "http://localhost:8100",
  drugInteraction: "http://localhost:8101",
  guidelineCompliance: "http://localhost:8102"
};

function setText(id, value, fallback="--"){
  const el=document.getElementById(id);
  if(el) el.textContent = value ?? fallback;
}

function notice(id, message, type="info"){
  const el=document.getElementById(id);
  if(!el) return;
  el.innerHTML=`<i class="bi ${type==="error"?"bi-exclamation-triangle":"bi-cloud-check"}"></i><span>${message}</span>`;
}

async function apiFetch(url, options={}){
  const res=await fetch(url, {headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  const text=await res.text();
  return text ? JSON.parse(text) : {};
}

let interactionChart = null;
let adherenceChart = null;

/* ---------------- Careplan Safety Checks ---------------- */
const PLAN_POOL = [
  {name:"Metformin 500mg — twice daily",     rule:"Dosage within limit for renal function"},
  {name:"Physiotherapy — knee, 3x/week",     rule:"No contraindication for current condition"},
  {name:"Warfarin 5mg — once daily",         rule:"Check against active NSAID prescriptions"},
  {name:"Low-sodium diet plan",              rule:"Consistent with hypertension management"},
  {name:"Penicillin course — 7 days",        rule:"Cross-checked against allergy record"},
];
function demoCareplan(){
  return PLAN_POOL.map(p=>({...p, ok: Math.random()>0.28}));
}
function normaliseCareplan(raw){
  const arr=Array.isArray(raw)?raw:(raw.items||raw.data||raw.results||[]);
  return arr.map(item=>({
    name: item.name ?? item.item ?? item.description ?? "Careplan item",
    rule: item.rule ?? item.reason ?? item.ruleTriggered ?? "Safety rule evaluation",
    ok: item.ok ?? item.safe ?? item.status==="PASSED" ?? item.status==="SAFE"
  }));
}
function paintCareplan(rows){
  const list=document.getElementById("planList");
  if(!list) return;
  list.innerHTML="";
  let bad=0;
  rows.forEach(p=>{
    if(!p.ok) bad++;
    list.insertAdjacentHTML("beforeend",`
      <div class="plan-row">
        <div><div class="pname">${p.name}</div><div class="prule">${p.rule}</div></div>
        <div class="plan-badge ${p.ok?"ok":"bad"}">${p.ok?"Safe":"Flagged"}</div>
        <div></div>
      </div>`);
  });
  setText("cpTotal", rows.length);
  setText("cpOk", rows.length-bad);
  setText("cpBad", bad);
  setText("cpTime", new Date().toLocaleTimeString());
  setText("cpStatus", bad>0 ? "Review Needed" : "All Clear");
}
async function renderCareplan(){
  notice("cpNotice","Loading careplan checks from backend...");
  try{
    const data=await apiFetch(`${API.careplan}/api/careplan/checks`);
    const rows=normaliseCareplan(data);
    if(!rows.length) throw new Error("Empty response");
    paintCareplan(rows);
    notice("cpNotice","Live careplan checks loaded from the backend.");
  }catch(e){
    paintCareplan(demoCareplan());
    notice("cpNotice",`Backend not reachable at ${API.careplan}. Showing demo data — connect the Careplan Safety Checks API to see live results.`,"error");
  }
}

/* ---------------- Drug Interaction Validation ---------------- */
const DRUG_POOL = [
  {sev:"critical", pair:"Warfarin + Aspirin",        note:"Increased bleeding risk"},
  {sev:"high",     pair:"Lisinopril + Potassium",    note:"Risk of hyperkalemia"},
  {sev:"medium",   pair:"Metformin + Contrast Dye",  note:"Monitor renal function"},
  {sev:"low",      pair:"Paracetamol + Ibuprofen",   note:"Generally safe, monitor dosing"},
  {sev:"medium",   pair:"Simvastatin + Amlodipine",  note:"Increased statin exposure"},
];
function demoDrugPairs(){
  return DRUG_POOL.map(d=>({...d, checkedAt:"Just now"}));
}
function normaliseDrugPairs(raw){
  const arr=Array.isArray(raw)?raw:(raw.interactions||raw.data||raw.results||[]);
  return arr.map(item=>({
    sev: (item.severity ?? item.sev ?? "low").toLowerCase(),
    pair: item.pair ?? item.drugs ?? `${item.drugA ?? ""} + ${item.drugB ?? ""}`,
    note: item.note ?? item.description ?? item.reason ?? "Interaction detected",
    checkedAt: item.checkedAt ?? item.timestamp ?? "--"
  }));
}
function paintDrugPairs(rows){
  const list=document.getElementById("drugList");
  if(!list) return;
  list.innerHTML="";
  rows.forEach(d=>{
    list.insertAdjacentHTML("beforeend",`
      <div class="drug-row">
        <div class="sev-tag ${d.sev}">${d.sev.toUpperCase()}</div>
        <div><div class="dpair">${d.pair}</div><div class="dnote">${d.note}</div></div>
        <div class="dstate">${d.checkedAt}</div>
      </div>`);
  });
  const severe=rows.filter(d=>d.sev==="critical"||d.sev==="high").length;
  const meds=new Set(rows.flatMap(d=>d.pair.split(" + "))).size;
  setText("diTotal", meds || rows.length);
  setText("diFound", rows.length);
  setText("diSevere", severe);
  setText("diSafe", Math.max(0, meds - rows.length));
}
async function renderInteractions(){
  notice("diNotice","Loading drug interactions from backend...");
  try{
    const data=await apiFetch(`${API.drugInteraction}/api/drug-interactions/check`);
    const rows=normaliseDrugPairs(data);
    if(!rows.length) throw new Error("Empty response");
    paintDrugPairs(rows);
    setText("diStatus","Backend Connected");
    notice("diNotice","Live interaction data loaded from the backend.");
  }catch(e){
    paintDrugPairs(demoDrugPairs());
    setText("diStatus","Waiting");
    notice("diNotice",`Backend not reachable at ${API.drugInteraction}. Showing demo data — connect the Drug Interaction Validation API to see live results.`,"error");
  }
  drawInteractionChart();
}
function drawInteractionChart(){
  const canvas=document.getElementById("interactionChart");
  if(!canvas || typeof Chart==="undefined") return;
  if(interactionChart) interactionChart.destroy();
  interactionChart=new Chart(canvas.getContext("2d"),{
    type:"bar",
    data:{labels:["Critical","High","Medium","Low"],datasets:[{
      data:[1+Math.floor(Math.random()*2),1+Math.floor(Math.random()*3),2+Math.floor(Math.random()*3),1+Math.floor(Math.random()*3)],
      backgroundColor:["#f87171","#fb923c","#fbbf24","#60a5fa"],borderRadius:6
    }]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{x:{ticks:{color:"#8190a7"},grid:{display:false}},y:{ticks:{color:"#8190a7"},grid:{color:"rgba(139,148,167,.08)"}}}}
  });
}

/* ---------------- Clinical Guideline Compliance ---------------- */
const GUIDELINE_POOL = [
  {name:"Type 2 Diabetes — first-line therapy",   guideline:"ADA Standard of Care: Metformin as first-line"},
  {name:"Hypertension — treatment target",        guideline:"JNC 8: BP goal < 140/90 for this age group"},
  {name:"Post-MI — antiplatelet therapy",          guideline:"ACC/AHA: Dual antiplatelet for 12 months"},
  {name:"CKD Stage 3 — medication review",         guideline:"KDIGO: Avoid nephrotoxic NSAIDs"},
  {name:"Asthma — controller therapy",             guideline:"GINA: Step-up if rescue inhaler use > 2x/week"},
];
function demoGuidelines(){
  return GUIDELINE_POOL.map(g=>({...g, ok: Math.random()>0.22}));
}
function normaliseGuidelines(raw){
  const arr=Array.isArray(raw)?raw:(raw.items||raw.data||raw.results||[]);
  return arr.map(item=>({
    name: item.name ?? item.item ?? item.condition ?? "Guideline check",
    guideline: item.guideline ?? item.protocol ?? item.reason ?? "Clinical guideline reference",
    ok: item.ok ?? item.compliant ?? item.status==="COMPLIANT"
  }));
}
function paintGuidelines(rows){
  const list=document.getElementById("guidelineList");
  if(!list) return;
  list.innerHTML="";
  let bad=0;
  rows.forEach(g=>{
    if(!g.ok) bad++;
    list.insertAdjacentHTML("beforeend",`
      <div class="plan-row">
        <div><div class="pname">${g.name}</div><div class="prule">${g.guideline}</div></div>
        <div class="plan-badge ${g.ok?"ok":"bad"}">${g.ok?"Compliant":"Non-Compliant"}</div>
        <div></div>
      </div>`);
  });
  const rate = rows.length ? Math.round(((rows.length-bad)/rows.length)*100) : 0;
  setText("gcTotal", rows.length);
  setText("gcOk", rows.length-bad);
  setText("gcBad", bad);
  setText("gcRate", rate+"%");
  setText("gcStatus", bad>0 ? "Review Needed" : "Fully Compliant");
}
async function renderGuidelines(){
  notice("gcNotice","Loading guideline compliance from backend...");
  try{
    const data=await apiFetch(`${API.guidelineCompliance}/api/guideline-compliance/checks`);
    const rows=normaliseGuidelines(data);
    if(!rows.length) throw new Error("Empty response");
    paintGuidelines(rows);
    notice("gcNotice","Live compliance checks loaded from the backend.");
  }catch(e){
    paintGuidelines(demoGuidelines());
    notice("gcNotice",`Backend not reachable at ${API.guidelineCompliance}. Showing demo data — connect the Clinical Guideline Compliance API to see live results.`,"error");
  }
  drawComplianceChart();
}
function drawComplianceChart(){
  const canvas=document.getElementById("complianceChart");
  if(!canvas || typeof Chart==="undefined") return;
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const values=days.map(()=>82+Math.random()*15);
  if(adherenceChart) adherenceChart.destroy();
  adherenceChart=new Chart(canvas.getContext("2d"),{
    type:"line",
    data:{labels:days,datasets:[
      {label:"Compliance Rate",data:values,borderColor:"#4ade80",backgroundColor:"rgba(74,222,128,.12)",borderWidth:3,pointRadius:4,tension:.35,fill:true},
      {label:"90% Target",data:days.map(()=>90),borderColor:"#f87171",borderDash:[6,5],borderWidth:2,pointRadius:0,fill:false}
    ]},
    options:{responsive:true,maintainAspectRatio:false,
      scales:{x:{ticks:{color:"#8190a7"},grid:{color:"rgba(139,148,167,.08)"}},
               y:{min:0,max:100,ticks:{color:"#8190a7",callback:v=>v+"%"},grid:{color:"rgba(139,148,167,.08)"}}},
      plugins:{legend:{labels:{color:"#cdd4e0"}}}}
  });
}

/* ---------------- Dashboard summary ---------------- */
async function refreshDashboard(){
  notice("dashNotice","Refreshing backend data...");
  let anyConnected=false;

  try{
    const data=await apiFetch(`${API.careplan}/api/careplan/checks`);
    const rows=normaliseCareplan(data);
    if(!rows.length) throw new Error("Empty");
    setText("dashPlanFlagged", rows.filter(r=>!r.ok).length);
    anyConnected=true;
  }catch(e){
    setText("dashPlanFlagged", demoCareplan().filter(r=>!r.ok).length);
  }

  try{
    const data=await apiFetch(`${API.drugInteraction}/api/drug-interactions/check`);
    const rows=normaliseDrugPairs(data);
    if(!rows.length) throw new Error("Empty");
    setText("dashDrugFlagged", rows.length);
    anyConnected=true;
  }catch(e){
    setText("dashDrugFlagged", demoDrugPairs().length);
  }

  try{
    const data=await apiFetch(`${API.guidelineCompliance}/api/guideline-compliance/checks`);
    const rows=normaliseGuidelines(data);
    if(!rows.length) throw new Error("Empty");
    const rate=Math.round((rows.filter(g=>g.ok).length/rows.length)*100);
    setText("dashCompliance", rate+"%");
    anyConnected=true;
  }catch(e){
    const rows=demoGuidelines();
    const rate=Math.round((rows.filter(g=>g.ok).length/rows.length)*100);
    setText("dashCompliance", rate+"%");
  }

  notice("dashNotice", anyConnected
    ? "Dashboard refreshed. Live values are shown wherever a backend has data."
    : "No backend APIs reachable yet. Showing demo data for all three modules.",
    anyConnected ? "info" : "error");
}
