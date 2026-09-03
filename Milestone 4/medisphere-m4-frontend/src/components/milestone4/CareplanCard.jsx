function CareplanCard() {
  return <section className="careplan-section">
    <div className="careplan-head"><div><div className="eyebrow">AI-GENERATED INTERVENTION PLAN</div><h2>Personalized Careplan</h2><p>John Doe • Type 2 Diabetes + Hypertension • v2.1</p></div><span className="ai-status"><i className="bi bi-stars"/> Clinician review ready</span></div>
    <div className="careplan-grid">
      <article className="goal-card"><div className="goal-number">01</div><div><span className="goal-label">GLYCEMIC CONTROL</span><h3>Reduce HbA1c to &lt;7.0% in 3 months</h3><p><b>Intervention:</b> Increase Metformin to 1000mg BID</p><p><b>Monitoring:</b> Weekly glucose logs via patient app</p></div><span className="goal-state">On track</span></article>
      <article className="goal-card"><div className="goal-number">02</div><div><span className="goal-label">BLOOD PRESSURE</span><h3>Reach BP target &lt;130/80 mmHg</h3><p><b>Intervention:</b> Add Amlodipine 5mg</p><p><b>Monitoring:</b> Daily BP from connected wearable</p></div><span className="goal-state">Improving</span></article>
    </div>
    <div className="careplan-footer"><div><span>Predicted outcome</span><strong>CVD risk ↓ to 16.2%</strong><small>Adherence score: 87% • Hospitalization risk ↓ 23%</small></div><div className="careplan-actions"><button className="secondary-btn">Modify plan</button><button className="primary-btn">Approve plan</button><button className="text-btn">Send to patient</button></div></div>
  </section>
}
export default CareplanCard
