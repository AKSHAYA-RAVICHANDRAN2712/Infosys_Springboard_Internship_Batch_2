import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import ShapExplainability from './models/ShapExplainability'
import ModelVersioning from './models/ModelVersioning'

function Models() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVersionId, setSelectedVersionId] = useState(null)

  const fetchModels = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/models')
      setModels(res.data)
      const active = res.data.find((m) => m.status === 'Active')
      setSelectedVersionId((prev) => prev ?? active?.version_id ?? res.data[0]?.version_id ?? null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load model versions from the backend.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  return (
    <main className="dashboard">
      <h1 className="dashboard__title">Models</h1>

      <div className="models-grid">
        <ShapExplainability />
        <ModelVersioning
          models={models}
          loading={loading}
          error={error}
          onRefresh={fetchModels}
          selectedVersionId={selectedVersionId}
          onSelectVersion={setSelectedVersionId}
        />
      </div>
    </main>
  )
}

export default Models
