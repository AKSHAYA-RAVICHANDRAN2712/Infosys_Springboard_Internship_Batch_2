import KpiCard from '../components/KpiCard'

const appointments = [
  ['09:30 AM','John Doe','Diabetes follow-up','Dr. Sarah Chen','Confirmed'],
  ['10:15 AM','Emily Carter','Blood pressure review','Dr. James Wilson','Confirmed'],
  ['11:00 AM','Michael Brown','Medication review','Nurse Maria Lopez','Waiting'],
  ['01:30 PM','Sophia Patel','Careplan assessment','Dr. Sarah Chen','Scheduled'],
]
const riskPatients = [
  ['John Doe','Type 2 Diabetes','High','16.2%','Dr. Chen'],
  ['Emily Carter','Hypertension','Moderate','12.8%','Dr. Wilson'],
  ['Michael Brown','Heart Failure','High','19.4%','Dr. Chen'],
  ['Sophia Patel','Diabetes + HTN','Moderate','11.6%','Dr. Wilson'],
]

export default function Dashboard(){
  return <div className="page">
    <div className="page-header"><div><div className="eyebrow">CLINICAL OPERATIONS / OVERVIEW</div><h1>Good morning, care team</h1><p>Monitor patient health, careplan activity and intervention priorities from one workspace.</p></div><button className="primary-btn"><i className="bi bi-plus-lg"/> New careplan</button></div>
    <div className="kpi-grid four">
      <KpiCard label="Active patients" value="1,248" trend="8.4%" trendDirection="up" icon="people" />
      <KpiCard label="High-risk patients" value="86" trend="4.2%" trendDirection="down" icon="activity" />
      <KpiCard label="Open tasks" value="34" trend="6 due today" trendDirection="neutral" icon="check2-square" />
      <KpiCard label="Careplan adherence" value="87.4%" trend="3.8% vs last month" trendDirection="up" icon="clipboard2-check" />
    </div>
    <div className="dashboard-grid">
      <section className="panel span-2"><div className="panel-head"><div><h2>Today's schedule</h2><p>Appointments and clinical activities</p></div><button className="text-btn">View calendar <i className="bi bi-arrow-right"/></button></div><div className="schedule-list">{appointments.map((a,i)=><div className="schedule-row" key={i}><div className="schedule-time">{a[0]}</div><div className="schedule-avatar">{a[1].split(' ').map(x=>x[0]).join('')}</div><div className="schedule-main"><strong>{a[1]}</strong><span>{a[2]} • {a[3]}</span></div><span className={`status-pill ${a[4].toLowerCase()}`}>{a[4]}</span></div>)}</div></section>
      <section className="panel"><div className="panel-head"><div><h2>Clinical performance</h2><p>Last 30 days</p></div></div><div className="donut-wrap"><div className="donut"><strong>87%</strong><span>Adherence</span></div><div className="legend"><span><i className="legend-dot blue"/>Careplan adherence <b>87%</b></span><span><i className="legend-dot green"/>Follow-up completed <b>92%</b></span><span><i className="legend-dot amber"/>Medication adherence <b>81%</b></span></div></div><div className="mini-stat"><span>Hospitalization risk</span><strong className="positive">↓ 23%</strong></div></section>
      <section className="panel span-2"><div className="panel-head"><div><h2>Patients requiring attention</h2><p>Prioritized by predicted clinical risk</p></div><button className="text-btn">View all patients <i className="bi bi-arrow-right"/></button></div><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Condition</th><th>Risk</th><th>CVD score</th><th>Provider</th><th /></tr></thead><tbody>{riskPatients.map((p,i)=><tr key={i}><td><strong>{p[0]}</strong><small>MRN-00{i+21}</small></td><td>{p[1]}</td><td><span className={`risk ${p[2].toLowerCase()}`}>{p[2]}</span></td><td>{p[3]}</td><td>{p[4]}</td><td><button className="icon-btn"><i className="bi bi-three-dots"/></button></td></tr>)}</tbody></table></div></section>
      <section className="panel"><div className="panel-head"><div><h2>Priority alerts</h2><p>Needs review today</p></div><span className="alert-badge">3 new</span></div><div className="alert-list"><div className="alert-item high"><i className="bi bi-exclamation-circle"/><div><strong>John Doe</strong><span>Glucose trend above target</span><small>12 min ago</small></div></div><div className="alert-item medium"><i className="bi bi-heart-pulse"/><div><strong>Michael Brown</strong><span>Weight gain detected</span><small>48 min ago</small></div></div><div className="alert-item low"><i className="bi bi-clock"/><div><strong>4 patients</strong><span>Careplan review due</span><small>Today</small></div></div></div></section>
    </div>
  </div>
}
