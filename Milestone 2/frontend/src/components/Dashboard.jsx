import MetricCard from './MetricCard'
import PredictionPanel from './PredictionPanel'

function Dashboard() {
  return (
    <main className="dashboard">
      <h1 className="dashboard__title">AI Risk Prediction Engine</h1>

      <div className="row g-3 metrics-row">
        <div className="col-md-4">
          <MetricCard label="Patients" value="342" />
        </div>
        <div className="col-md-4">
          <MetricCard
            label="Model Accuracy"
            value="91.6%"
            sublabel="Cross-validated"
          />
        </div>
        <div className="col-md-4">
          <MetricCard
            label="Active Hospitals"
            value="23"
            sublabel="Connected"
          />
        </div>
      </div>

      <PredictionPanel />
    </main>
  )
}

export default Dashboard
