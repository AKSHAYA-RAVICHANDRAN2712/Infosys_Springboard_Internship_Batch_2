function PatientSelect({ patients, value, onChange }) {
  return (
    <select className="m4-patient-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {patients.length === 0 && <option value="">No patients yet</option>}
      {patients.map((id) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </select>
  )
}

export default PatientSelect
