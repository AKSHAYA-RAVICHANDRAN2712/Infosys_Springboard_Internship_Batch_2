import React from 'react'

const STATUS_STYLES = {
  Active: '#1c9184',
  Confirmed: '#1c9184',
  Pending: '#c98a2e',
  Cancelled: '#d95c4f',
  Discharged: '#8a97a0',
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
