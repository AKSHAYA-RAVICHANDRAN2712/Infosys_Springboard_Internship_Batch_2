import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import AddUserForm from '../components/forms/AddUserForm';
import AddDoctorForm from '../components/forms/AddDoctorForm';
import AddPatientForm from '../components/forms/AddPatientForm';

const TABS = [
  { key: 'users', label: '👥 System User Accounts' },
  { key: 'logs', label: '📜 Activity Audit Logs' },
  { key: 'doctors', label: '🩺 Doctors Roster' },
  { key: 'patients', label: '🏥 Patients Directory' },
  { key: 'staff', label: '👩‍⚕️ Medical & Reception Staff' }
];

export default function AdminPage() {
  const { open } = useModal();
  const toast = useToast();
  const [tab, setTab] = useState('users');
  const [refreshKey, setRefreshKey] = useState(0);

  const [users, setUsers] = useState([]);
  const [docs, setDocs] = useState([]);
  const [pats, setPats] = useState([]);
  const [emps, setEmps] = useState([]);
  const logs = MediStorage.getActivityLogs();

  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    async function loadData() {
      const [uList, dList, pList, eList] = await Promise.all([
        MediStorage.fetchUsers(),
        MediStorage.fetchDoctors(),
        MediStorage.fetchPatients(),
        MediStorage.fetchEmployees()
      ]);
      setUsers(uList);
      setDocs(dList);
      setPats(pList);
      setEmps(eList);
    }
    loadData();
  }, [refreshKey]);

  function toggleUserStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Disabled' ? 'Active' : 'Disabled';
    MediStorage.setUserActiveStatus(id, newStatus);
    toast.success(`Set user ${id} status to ${newStatus}`);
    refresh();
  }

  function resetPassword(id) {
    const newPass = prompt('Enter new password for user:', 'medisphere2026');
    if (newPass) {
      MediStorage.resetUserPassword(id, newPass);
      toast.success(`Password reset for user ${id}!`);
      refresh();
    }
  }

  function changeRole(id) {
    const newRole = prompt('Enter new role (admin, doctor, patient, receptionist, employee):', 'doctor');
    if (newRole && ['admin', 'doctor', 'patient', 'receptionist', 'employee'].includes(newRole.toLowerCase())) {
      MediStorage.assignUserRole(id, newRole.toLowerCase());
      toast.success(`Assigned role ${newRole.toUpperCase()} to user ${id}!`);
      refresh();
    } else if (newRole) {
      toast.error('Invalid role. Allowed: admin, doctor, patient, receptionist, employee');
    }
  }

  function deleteUser(id) {
    if (confirm(`Are you sure you want to delete user ${id}?`)) {
      MediStorage.deleteUser(id);
      toast.success(`Deleted user account ${id}`);
      refresh();
    }
  }

  function deleteDoctor(id) {
    if (confirm(`Are you sure you want to delete doctor ${id}?`)) {
      MediStorage.deleteDoctor(id);
      toast.success(`Deleted doctor ${id}`);
      refresh();
    }
  }

  function deletePatient(id) {
    if (confirm(`Are you sure you want to delete patient ${id}?`)) {
      MediStorage.deletePatient(id);
      toast.success(`Deleted patient ${id}`);
      refresh();
    }
  }

  function deleteStaff(id) {
    if (confirm(`Are you sure you want to delete staff member ${id}?`)) {
      MediStorage.deleteEmployee(id);
      toast.success(`Deleted staff ${id}`);
      refresh();
    }
  }

  const roleVariant = (role) => role === 'admin' ? 'danger' : role === 'doctor' ? 'purple' : role === 'patient' ? 'info' : 'success';

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospital Administrator Portal (Super Admin)</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: 4 }}>Full administrative control over users, access rights, activity logs, and hospital operations.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => open('Create System User', <AddUserForm onSaved={refresh} />)}>+ Create System User</button>
          <button className="btn btn-success" onClick={() => open('Add New Doctor', <AddDoctorForm onSaved={refresh} />)}>+ Add Doctor</button>
          <button className="btn btn-secondary" onClick={() => open('Register New Patient', <AddPatientForm onSaved={refresh} />)}>+ Register Patient</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">System Users</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-subtext green">All Roles Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Doctors</div>
          <div className="stat-value">{docs.length}</div>
          <div className="stat-subtext">Clinical Roster</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Registered Patients</div>
          <div className="stat-value">{pats.length}</div>
          <div className="stat-subtext">EHR Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medical Staff</div>
          <div className="stat-value">{emps.length}</div>
          <div className="stat-subtext">Nurses & Reception</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Audit Logs</div>
          <div className="stat-value">{logs.length}</div>
          <div className="stat-subtext orange">Tracked Actions</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.key} className={`btn btn-sm ${tab === t.key ? 'btn-primary active' : 'btn-secondary'} admin-tab-btn`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div key={refreshKey}>
        {tab === 'users' && (
          <DataTable
            title="System User Accounts & Role Permissions"
            searchPlaceholder="Search users by name, email, role, status..."
            data={users}
            columns={[
              { key: 'id', label: 'User ID' },
              { key: 'name', label: 'Full Name', render: v => <strong>{v}</strong> },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', render: v => <Badge variant={roleVariant(v)}>{v.toUpperCase()}</Badge> },
              { key: 'status', label: 'Status', render: v => <Badge variant={v === 'Active' ? 'success' : 'warning'}>{v || 'Active'}</Badge> },
              { key: 'id', label: 'Actions', render: (id, row) => (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={() => toggleUserStatus(id, row.status || 'Active')}>{row.status === 'Disabled' ? 'Enable' : 'Disable'}</button>{' '}
                  <button className="btn btn-warning btn-sm" onClick={() => resetPassword(id)}>Reset Pass</button>{' '}
                  <button className="btn btn-info btn-sm" onClick={() => changeRole(id)}>Change Role</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(id)}>Delete</button>
                </>
              ) }
            ]}
          />
        )}

        {tab === 'logs' && (
          <DataTable
            title="System Activity & Permission Audit Log"
            searchPlaceholder="Search audit trail by user, action, timestamp..."
            data={logs}
            columns={[
              { key: 'id', label: 'Log ID' },
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'performedBy', label: 'User', render: (v, row) => <><strong>{v}</strong> <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({row.role ? row.role.toUpperCase() : 'SYSTEM'})</span></> },
              { key: 'action', label: 'Action Event', render: v => <span style={{ color: '#60A5FA', fontWeight: 600 }}>{v}</span> },
              { key: 'details', label: 'Details' }
            ]}
          />
        )}

        {tab === 'doctors' && (
          <DataTable
            title="Doctors Roster Management"
            searchPlaceholder="Search doctors by name, department..."
            data={docs}
            columns={[
              { key: 'id', label: 'Doc ID' },
              { key: 'name', label: 'Doctor Name', render: v => <strong>{v}</strong> },
              { key: 'department', label: 'Department' },
              { key: 'specialization', label: 'Specialization' },
              { key: 'experience', label: 'Experience' },
              { key: 'email', label: 'Email' },
              { key: 'id', label: 'Actions', render: id => <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(id)}>Remove Doctor</button> }
            ]}
          />
        )}

        {tab === 'patients' && (
          <DataTable
            title="Patients EHR Master Directory"
            searchPlaceholder="Search patients by name, blood group, doctor..."
            data={pats}
            columns={[
              { key: 'id', label: 'Patient ID' },
              { key: 'name', label: 'Patient Name', render: v => <strong>{v}</strong> },
              { key: 'age', label: 'Age / Sex', render: (v, row) => `${v} Yrs / ${row.gender}` },
              { key: 'assignedDoctor', label: 'Assigned Doctor' },
              { key: 'hospital', label: 'Hospital' },
              { key: 'id', label: 'Actions', render: id => <button className="btn btn-danger btn-sm" onClick={() => deletePatient(id)}>Delete Patient</button> }
            ]}
          />
        )}

        {tab === 'staff' && (
          <DataTable
            title="Medical Staff & Reception Roster"
            searchPlaceholder="Search staff by name, role, department..."
            data={emps}
            columns={[
              { key: 'id', label: 'Staff ID' },
              { key: 'name', label: 'Staff Name', render: v => <strong>{v}</strong> },
              { key: 'role', label: 'Staff Role' },
              { key: 'department', label: 'Department' },
              { key: 'email', label: 'Email' },
              { key: 'id', label: 'Actions', render: id => <button className="btn btn-danger btn-sm" onClick={() => deleteStaff(id)}>Remove Staff</button> }
            ]}
          />
        )}
      </div>
    </>
  );
}
