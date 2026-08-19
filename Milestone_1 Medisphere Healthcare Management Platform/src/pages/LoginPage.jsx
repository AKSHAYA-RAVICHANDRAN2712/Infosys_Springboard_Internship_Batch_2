import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MediStorage from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { homeForRole } from '../utils/rbac';

const PRESETS = {
  admin: { id: 'ADMIN001', pass: 'admin123', placeholder: 'ADMIN001 or admin@medisphere.health' },
  doctor: { id: 'DOC1001', pass: 'doctor123', placeholder: 'DOC1001 or doctor@medisphere.health' },
  patient: { id: 'PAT1001', pass: 'patient123', placeholder: 'PAT1001 or patient@medisphere.health' },
  receptionist: { id: 'REC1001', pass: 'reception123', placeholder: 'REC1001 or reception@medisphere.health' },
  employee: { id: 'EMP1001', pass: 'employee123', placeholder: 'EMP1001 or employee@medisphere.health' }
};

const ROLES = [
  { key: 'admin', label: 'Admin' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'patient', label: 'Patient' },
  { key: 'receptionist', label: 'Receptionist' },
  { key: 'employee', label: 'Med Staff' }
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [view, setView] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loginId, setLoginId] = useState(PRESETS.admin.id);
  const [password, setPassword] = useState(PRESETS.admin.pass);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || location.state?.denied || '');

  const [reg, setReg] = useState({
    name: 'Shreya Shetty', gender: 'Female', blood: 'O+', dob: '1998-08-15', age: '28',
    mobile: '+91 98450 99887', email: 'shreya.shetty@gmail.com',
    address: 'Near City Bus Stand, Udupi, Karnataka',
    emergency: 'Ashok Shetty (Father) - +91 98450 88776',
    pass: 'patient123', passConfirm: 'patient123'
  });

  function updateReg(field, value) { setReg(prev => ({ ...prev, [field]: value })); }

  function selectRole(role) {
    setError('');
    const isAnyPreset = Object.values(PRESETS).some(p => p.id === loginId.trim());
    setSelectedRole(role);
    if (isAnyPreset || !loginId.trim()) {
      setLoginId(PRESETS[role].id);
      setPassword(PRESETS[role].pass);
    }
  }

  function fillDemoCredentials(role) {
    setSelectedRole(role);
    setLoginId(PRESETS[role].id);
    setPassword(PRESETS[role].pass);
    toast.info(`Filled credentials for ${role.toUpperCase()} role (${PRESETS[role].id})`);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError('');
    const id = loginId.trim();
    const pass = password.trim();

    if (!id || !pass) {
      setError('Please enter both User ID/Email and Password.');
      toast.error('Please enter both User ID/Email and Password.', 'Authentication Error');
      return;
    }

    const result = await MediStorage.authenticateUser(id, pass, selectedRole);
    if (!result.success) {
      setError(result.message || 'Invalid User ID or Password.');
      toast.error(result.message || 'Invalid User ID or Password.', 'Authentication Error');
      return;
    }

    const user = result.user;
    login(user);
    MediStorage.logActivity('User Login', `User ${user.name} (${user.role.toUpperCase()}) logged in successfully.`);
    toast.success(`Welcome back, ${user.name}! Accessing portal...`, 'Authentication Successful');

    setTimeout(() => {
      navigate(homeForRole(user.role));
    }, 700);
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError('');

    if (!reg.name || !reg.email || !reg.mobile || !reg.pass) {
      const msg = 'Please fill in all mandatory registration fields.';
      setError(msg);
      toast.error(msg, 'Authentication Error');
      return;
    }
    if (reg.pass !== reg.passConfirm) {
      const msg = 'Passwords do not match. Please verify password entry.';
      setError(msg);
      toast.error(msg, 'Authentication Error');
      return;
    }
    if (reg.pass.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setError(msg);
      toast.error(msg, 'Authentication Error');
      return;
    }

    const result = await MediStorage.registerPatient({
      fullName: reg.name, gender: reg.gender, bloodGroup: reg.blood, dob: reg.dob, age: reg.age,
      mobile: reg.mobile, email: reg.email, address: reg.address, emergencyContact: reg.emergency, password: reg.pass
    });

    if (!result.success) {
      setError(result.message || 'Registration failed.');
      toast.error(result.message || 'Registration failed.', 'Authentication Error');
      return;
    }

    toast.success(`Registration Successful. Your Patient ID is ${result.patientId}`, 'Welcome to MediSphere');
    setNotice(`Registration Successful! Assigned Patient ID: ${result.patientId}. Please login below.`);
    setView('login');
    setLoginId(result.patientId);
    setPassword(reg.pass);
    setSelectedRole('patient');
  }

  return (
    <div className="login-body">
      <div className="login-bg-glow"></div>

      <div className="login-card-container page-fade-in">
        <div className="login-hero-panel">
          <div className="login-hero-brand">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m-8-8h16"></path></svg>
            MediSphere
          </div>

          <div className="login-hero-illustration">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h2m0 0h2m-4-10a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm-8 4a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h1 className="login-hero-title">Enterprise Health Operating System</h1>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            © 2026 MediSphere Health Systems. HL7 FHIR v4 Certified.
          </div>
        </div>

        <div className="login-form-panel">
          <div className="auth-nav-tabs">
            <button className={`auth-tab-btn${view === 'login' ? ' active' : ''}`} onClick={() => { setView('login'); setError(''); }}>🔑 Portal Login</button>
            <button className={`auth-tab-btn${view === 'register' ? ' active' : ''}`} onClick={() => { setView('register'); setError(''); }}>🏥 Register as Patient</button>
          </div>

          {notice && (
            <div className="auth-notice-banner" style={{ display: 'flex' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div className="auth-error-banner" style={{ display: 'flex' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          {view === 'login' ? (
            <div>
              <div className="login-header">
                <h2>Sign In to MediSphere</h2>
                <p>Select your hospital role and enter your User ID/Email & Password</p>
              </div>

              <span className="role-selector-label">Select Hospital Role</span>
              <div className="role-pills">
                {ROLES.map(r => (
                  <div key={r.key} className={`role-pill${selectedRole === r.key ? ' active' : ''}`} onClick={() => selectRole(r.key)}>{r.label}</div>
                ))}
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">User ID / Email Address</label>
                  <div className="input-with-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                    <input type="text" id="login-email" placeholder={PRESETS[selectedRole].placeholder} required value={loginId} onChange={e => setLoginId(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-with-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <input type={showPassword ? 'text' : 'password'} id="login-password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="show-password-toggle" onClick={() => setShowPassword(p => !p)}>{showPassword ? 'Hide' : 'Show'}</button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" defaultChecked /> Remember session
                  </label>
                  <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); alert('Password Recovery: Please contact your MediSphere Administrator at admin@medisphere.health or use default passwords (admin123).'); }}>Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Sign In to Dashboard</button>

                <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: '#9CA3AF' }}>
                  New Patient? <a href="#" onClick={(e) => { e.preventDefault(); setView('register'); }} style={{ color: '#60A5FA', fontWeight: 600 }}>Register as Patient here</a>
                </div>
              </form>

              <div className="demo-credentials-box">
                <p>Quick Demo One-Click Presets:</p>
                <div className="demo-btns">
                  <button className="demo-btn" onClick={() => fillDemoCredentials('admin')}>Admin (ADMIN001)</button>
                  <button className="demo-btn" onClick={() => fillDemoCredentials('doctor')}>Doctor (DOC1001)</button>
                  <button className="demo-btn" onClick={() => fillDemoCredentials('patient')}>Patient (PAT1001)</button>
                  <button className="demo-btn" onClick={() => fillDemoCredentials('receptionist')}>Receptionist (REC1001)</button>
                  <button className="demo-btn" onClick={() => fillDemoCredentials('employee')}>Med Staff (EMP1001)</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="login-header" style={{ marginBottom: 16 }}>
                <h2>Patient Self-Registration</h2>
                <p>Create your MediSphere Patient Health Profile to access your digital twin & appointment schedule.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="reg-grid">
                <div className="form-group reg-full">
                  <label>Full Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Shreya Shetty" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.name} onChange={e => updateReg('name', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select className="form-select" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.gender} onChange={e => updateReg('gender', e.target.value)}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Blood Group *</label>
                  <select className="form-select" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.blood} onChange={e => updateReg('blood', e.target.value)}>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.dob} onChange={e => updateReg('dob', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" placeholder="28" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.age} onChange={e => updateReg('age', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input type="tel" placeholder="+91 98450 12345" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.mobile} onChange={e => updateReg('mobile', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" placeholder="shreya@gmail.com" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.email} onChange={e => updateReg('email', e.target.value)} />
                </div>

                <div className="form-group reg-full">
                  <label>Residential Address *</label>
                  <input type="text" placeholder="e.g. MG Road, Udupi, Karnataka" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.address} onChange={e => updateReg('address', e.target.value)} />
                </div>

                <div className="form-group reg-full">
                  <label>Emergency Contact *</label>
                  <input type="text" placeholder="Name & Phone Number" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.emergency} onChange={e => updateReg('emergency', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.pass} onChange={e => updateReg('pass', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', borderRadius: 6 }} value={reg.passConfirm} onChange={e => updateReg('passConfirm', e.target.value)} />
                </div>

                <div className="form-group reg-full" style={{ marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Complete Patient Registration</button>
                </div>

                <div className="reg-full" style={{ textAlign: 'center', marginTop: 4, fontSize: '0.85rem', color: '#9CA3AF' }}>
                  Already registered? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); }} style={{ color: '#60A5FA', fontWeight: 600 }}>Sign in here</a>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
