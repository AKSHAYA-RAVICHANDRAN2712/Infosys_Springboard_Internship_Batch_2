import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MediStorage from '../../services/storage';

/* Global Search Engine, ported from assets/js/search.js */
export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  useEffect(() => {
    async function fetchAppts() {
      try {
        const data = await MediStorage.getAppointments();
        setAllAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAppts();
  }, [open]);

  const q = query.trim().toLowerCase();
  let patients = [], doctors = [], appointments = [], fhir = [];

  if (q.length >= 2) {
    patients = MediStorage.getPatients().filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    doctors = MediStorage.getDoctors().filter(d => d.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q));
    appointments = allAppointments.filter(a => a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
    fhir = MediStorage.getFHIRResources().filter(f => f.patientName.toLowerCase().includes(q) || f.resourceType.toLowerCase().includes(q));
  }

  const hasResults = patients.length || doctors.length || appointments.length || fhir.length;

  function go(path) {
    setOpen(false);
    setQuery('');
    navigate(path);
  }

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <div className="table-search" style={{ padding: '4px 10px', height: 32, width: 220, background: 'rgba(0,0,0,0.2)' }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="text"
          placeholder="Global Search..."
          style={{ fontSize: '0.8rem' }}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(e.target.value.trim().length >= 2); }}
          onFocus={() => setOpen(query.trim().length >= 2)}
        />
      </div>

      {open && (
        <div style={{ position: 'absolute', top: 38, right: 0, width: 340, background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.6)', zIndex: 1000, maxHeight: 380, overflowY: 'auto' }}>
          {!hasResults && (
            <div style={{ padding: 16, color: '#9CA3AF', textAlign: 'center' }}>No matching records found.</div>
          )}

          {patients.length > 0 && (
            <>
              <div style={{ padding: '8px 12px', fontWeight: 700, fontSize: '0.75rem', color: '#3B82F6', textTransform: 'uppercase' }}>Patients ({patients.length})</div>
              {patients.slice(0, 3).map(p => (
                <div key={p.id} className="search-item" style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }} onClick={() => go(`/digital-twin?patient=${p.id}`)}>
                  <strong style={{ color: '#FFF' }}>{p.name}</strong> <span style={{ color: '#9CA3AF' }}>({p.id}) - {p.gender}, {p.age}y</span>
                </div>
              ))}
            </>
          )}

          {doctors.length > 0 && (
            <>
              <div style={{ padding: '8px 12px', fontWeight: 700, fontSize: '0.75rem', color: '#22C55E', textTransform: 'uppercase' }}>Doctors ({doctors.length})</div>
              {doctors.slice(0, 3).map(d => (
                <div key={d.id} className="search-item" style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }} onClick={() => go(`/doctors?doctor=${d.id}`)}>
                  <strong style={{ color: '#FFF' }}>{d.name}</strong> <span style={{ color: '#9CA3AF' }}>- {d.department}</span>
                </div>
              ))}
            </>
          )}

          {appointments.length > 0 && (
            <>
              <div style={{ padding: '8px 12px', fontWeight: 700, fontSize: '0.75rem', color: '#F59E0B', textTransform: 'uppercase' }}>Appointments ({appointments.length})</div>
              {appointments.slice(0, 3).map(a => (
                <div key={a.id} className="search-item" style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }} onClick={() => go(`/appointments?id=${a.id}`)}>
                  <strong style={{ color: '#FFF' }}>{a.id}</strong> <span style={{ color: '#9CA3AF' }}>- {a.patientName} with {a.doctorName} ({a.date})</span>
                </div>
              ))}
            </>
          )}

          {fhir.length > 0 && (
            <>
              <div style={{ padding: '8px 12px', fontWeight: 700, fontSize: '0.75rem', color: '#8B5CF6', textTransform: 'uppercase' }}>FHIR Resources ({fhir.length})</div>
              {fhir.slice(0, 2).map(f => (
                <div key={f.id} className="search-item" style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => go(`/fhir?id=${f.id}`)}>
                  <strong style={{ color: '#FFF' }}>{f.resourceType}</strong> <span style={{ color: '#9CA3AF' }}>- {f.patientName} ({f.sourceSystem})</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
