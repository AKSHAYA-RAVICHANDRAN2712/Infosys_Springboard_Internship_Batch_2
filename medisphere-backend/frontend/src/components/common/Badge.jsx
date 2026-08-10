import React from 'react'

const STATUS_STYLES = {
  Active: '#12b76a',
  Confirmed: '#12b76a',
  Pending: '#f5a524',
  Cancelled: '#ef4444',
  Discharged: '#8b97ab',
}

export default function Badge({ status }) {
  const color = STATUS_STYLES[status] || '#8a97a0'
  return (
    <span className="ms-badge-status">
      <span className="dot" style={{ background: color }}></span>
      {status}
    </span>
  )
}
