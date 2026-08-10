/* MediSphere Data Storage & Backend Simulation Layer (ported from assets/js/storage.js) */
import { generateId, generateJWTToken } from './utils';
const API_URL = "http://localhost:5000/api/appointments";
const PATIENT_API_URL = "http://localhost:5000/api/patients";
const DOCTOR_API_URL = "http://localhost:5000/api/doctors";
const FHIR_API_URL = "http://localhost:5000/api/fhir-resources";
const VITALS_API_URL = "http://localhost:5000/api/vitals";
const LAB_RESULTS_API_URL = "http://localhost:5000/api/lab-results";
const KAFKA_API_URL = "http://localhost:5000/api/kafka-events";
const USER_API_URL = "http://localhost:5000/api/users";
const EMPLOYEE_API_URL = "http://localhost:5000/api/employees";
const KEYS = {
  USERS: 'medisphere_users',
  PATIENTS: 'medisphere_patients',
  DOCTORS: 'medisphere_doctors',
  EMPLOYEES: 'medisphere_employees',
  APPOINTMENTS: 'medisphere_appointments',
  MEDICAL_RECORDS: 'medisphere_medical_records',
  FHIR_RESOURCES: 'medisphere_fhir_resources',
  KAFKA_EVENTS: 'medisphere_kafka_events',
  DIGITAL_TWINS: 'medisphere_digital_twins',
  CURRENT_USER: 'medisphere_current_user',
  TOKEN: 'medisphere_token',
  SETTINGS: 'medisphere_settings',
  ACTIVITY_LOGS: 'medisphere_activity_logs'
};

const firstNames = ['Anushree', 'Ashok', 'Raghavendra', 'Shreya', 'Nikhil', 'Pooja', 'Keerthana', 'Pranav', 'Aditi', 'Preethi', 'Venkatesh', 'Sumithra', 'Srinivas', 'Deepika', 'Vivek', 'Gowri', 'Santhosh', 'Archana', 'Chethan', 'Varun', 'Rashmi', 'Shruti', 'Anand', 'Mahesh', 'Rajeshwari', 'Suresh', 'Vinay', 'Soumya', 'Sunita', 'Kavya'];
const lastNames = ['Naik', 'Shetty', 'Hegde', 'Rao', 'Bhat', 'Kamath', 'Shenoy', 'Pai', 'Gowda', 'Kulkarni', 'Patil', 'Deshpande', 'Poojary', 'Acharya', 'Maindan'];
const doctorFirstNames = ['Ananthakrishna', 'Sudhakar', 'Veena', 'Gururaj', 'Sandhya', 'Manjunath', 'Usha', 'Prakash', 'Suma', 'Nitin', 'Ramesh', 'Aravind', 'Saritha', 'Ganesh', 'Latha'];
const depts = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'Emergency Medicine', 'Radiology', 'Dermatology', 'Gastroenterology', 'Endocrinology'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const karnatakaHospitals = [
  'Kasturba Medical College Hospital, Manipal',
  'KMC Hospital, Attavar, Mangaluru',
  'Father Muller Medical College Hospital, Mangaluru',
  'A.J. Hospital & Research Centre, Mangaluru',
  'Yenepoya Medical College Hospital, Mangaluru',
  'K.S. Hegde Charitable Hospital, Mangaluru',
  'TMA Pai Hospital, Udupi',
  'Victoria Hospital, Bengaluru',
  'Manipal Hospital, HAL Airport Road, Bengaluru',
  'Narayana Health City, Bengaluru',
  'Fortis Hospital, Bannerghatta Road, Bengaluru',
  "St. John's Medical College Hospital, Bengaluru",
  'Jayadeva Institute of Cardiovascular Sciences, Bengaluru',
  'NIMHANS, Bengaluru',
  'SDM College of Medical Sciences, Dharwad',
  'Karnataka Institute of Medical Sciences (KIMS), Hubballi',
  'JSS Hospital, Mysuru',
  'Mysore Medical College (KR Hospital), Mysuru',
  'Shivamogga Institute of Medical Sciences (SIMS), Shivamogga',
  'Vijayanagar Institute of Medical Sciences (VIMS), Ballari'
];
const conditionsList = ['Essential Hypertension', 'Type 2 Diabetes Mellitus', 'Dengue Fever', 'Chikungunya', 'Malaria (P. vivax)', 'Bronchial Asthma', 'Ischemic Heart Disease', 'Chronic Kidney Disease', 'Osteoarthritis', 'Acid Peptic Disease'];
const medicationsList = ['Paracetamol 650mg (Dolo 650)', 'Metformin 500mg (Glycomet)', 'Telmisartan 40mg (Telma 40)', 'Pantoprazole 40mg (Pan 40)', 'Amlodipine 5mg', 'Atorvastatin 10mg', 'Montelukast 10mg (Levocet-M)', 'Azithromycin 500mg'];
const allergiesList = ['Penicillin', 'Sulfa Drugs', 'NSAIDs', 'Dust Mite Allergy', 'Seafood Allergy', 'None'];
const insuranceList = ['Star Health Insurance #SH-882193', 'Ayushman Bharat - Arogya Karnataka (AB-ARK) #ARK-90214', 'ICICI Lombard Health #IL-44021', 'HDFC ERGO Health #HE-30192', 'Care Health Insurance #CHI-55102'];

const SEED_VERSION_KEY = 'medisphere_seed_v2026_role_auth_v6';

function seedInitialData() {
  localStorage.setItem(SEED_VERSION_KEY, 'true');
  localStorage.setItem(KEYS.USERS, '[]');
  localStorage.setItem(KEYS.PATIENTS, '[]');
  localStorage.setItem(KEYS.DOCTORS, '[]');
  localStorage.setItem(KEYS.EMPLOYEES, '[]');
  localStorage.setItem(KEYS.APPOINTMENTS, '[]');
  localStorage.setItem(KEYS.FHIR_RESOURCES, '[]');
  localStorage.setItem(KEYS.KAFKA_EVENTS, '[]');
  localStorage.setItem(KEYS.DIGITAL_TWINS, '[]');
  localStorage.setItem(KEYS.ACTIVITY_LOGS, '[]');
}

function getItem(key) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : [];
  } catch (e) {
    return [];
  }
}

function setItem(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

seedInitialData();

const MediStorage = {
  async fetchUsers() {
    try {
      const response = await fetch(USER_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setItem(KEYS.USERS, data);
        }
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch users from DB", error);
    }
    return getItem(KEYS.USERS);
  },

  getUsers() {
    return getItem(KEYS.USERS);
  },

  async fetchPatients() {
    try {
      const response = await fetch(PATIENT_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setItem(KEYS.PATIENTS, data);
        }
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch patients from DB", error);
    }
    return getItem(KEYS.PATIENTS);
  },

  getPatients() {
    return getItem(KEYS.PATIENTS);
  },

  async fetchDoctors() {
    try {
      const response = await fetch(DOCTOR_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setItem(KEYS.DOCTORS, data);
        }
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch doctors from DB", error);
    }
    return getItem(KEYS.DOCTORS);
  },

  getDoctors() {
    return getItem(KEYS.DOCTORS);
  },

  async fetchEmployees() {
    try {
      const response = await fetch(EMPLOYEE_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setItem(KEYS.EMPLOYEES, data);
        }
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch employees from DB", error);
    }
    return getItem(KEYS.EMPLOYEES);
  },

  getEmployees() {
    return getItem(KEYS.EMPLOYEES);
  },

  async getAppointments() {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setItem(KEYS.APPOINTMENTS, data);
        }
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch appointments from DB", error);
    }
    return getItem(KEYS.APPOINTMENTS);
  },
  getFHIRResources: () => getItem(KEYS.FHIR_RESOURCES),
  getKafkaEvents: () => getItem(KEYS.KAFKA_EVENTS),
  getDigitalTwins: () => getItem(KEYS.DIGITAL_TWINS),
  getActivityLogs: () => getItem(KEYS.ACTIVITY_LOGS),

  async authenticateUser(loginId, password, selectedRole) {
    await this.fetchUsers();
    await this.fetchPatients();
    await this.fetchDoctors();

    const users = getItem(KEYS.USERS) || [];
    const patients = getItem(KEYS.PATIENTS) || [];
    const doctors = getItem(KEYS.DOCTORS) || [];
    const term = (loginId || '').trim().toLowerCase();
    const pass = (password || '').trim();
    const role = selectedRole || 'admin';

    if (!term || !pass) {
      return { success: false, message: 'Please enter both User ID/Email and Password.' };
    }

    let user = users.find(u => {
      const matchId = u.id && u.id.toLowerCase() === term;
      const matchEmail = u.email && u.email.toLowerCase() === term;
      const matchUsername = u.username && u.username.toLowerCase() === term;
      return matchId || matchEmail || matchUsername;
    });

    if (!user) {
      if (role === 'patient') {
        const pRecord = patients.find(p => (p.id && p.id.toLowerCase() === term) || (p.email && p.email.toLowerCase() === term));
        if (pRecord) {
          user = {
            id: pRecord.id, name: pRecord.name, email: pRecord.email, username: pRecord.id,
            password: 'patient123', role: 'patient', status: 'Active', department: 'Outpatient Clinic',
            phone: pRecord.phone || '+91 98450 12345', token: 'token-' + Math.floor(10000 + Math.random() * 90000)
          };
          users.unshift(user);
          setItem(KEYS.USERS, users);
          try {
            await fetch(USER_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user)
            });
          } catch (err) { console.error(err); }
        }
      } else if (role === 'doctor') {
        const dRecord = doctors.find(d => (d.id && d.id.toLowerCase() === term) || (d.email && d.email.toLowerCase() === term));
        if (dRecord) {
          user = {
            id: dRecord.id, name: dRecord.name, email: dRecord.email, username: dRecord.id,
            password: 'doctor123', role: 'doctor', status: 'Active', department: dRecord.department || 'Cardiology',
            phone: dRecord.phone || '+91 98450 12345', token: 'token-' + Math.floor(10000 + Math.random() * 90000)
          };
          users.unshift(user);
          setItem(KEYS.USERS, users);
          try {
            await fetch(USER_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user)
            });
          } catch (err) { console.error(err); }
        }
      }
    }

    if (!user) {
      return { success: false, message: 'Invalid credentials for the selected role.' };
    }

    if (user.role !== role) {
      return { success: false, message: 'Invalid credentials for the selected role.' };
    }

    if (user.password !== pass) {
      return { success: false, message: 'Invalid credentials for the selected role.' };
    }

    if (user.status === 'Disabled' || user.status === 'Inactive') {
      return { success: false, message: 'Account is disabled. Please contact Admin.' };
    }

    return { success: true, user };
  },

  async registerPatient(patientData) {
    await this.fetchUsers();
    await this.fetchPatients();
    
    const users = getItem(KEYS.USERS) || [];
    const patients = getItem(KEYS.PATIENTS) || [];

    const existingUser = users.find(u => u.email && u.email.toLowerCase() === patientData.email.trim().toLowerCase());
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists. Please login.' };
    }

    let maxNum = 1000;
    patients.forEach(p => {
      if (p.id) {
        const digits = p.id.replace(/\D/g, '');
        if (digits) {
          const num = parseInt(digits, 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      }
    });

    const newPatientId = `PAT-${maxNum + 1}`;

    const newUser = {
      id: newPatientId, name: patientData.fullName, email: patientData.email, username: newPatientId,
      password: patientData.password, role: 'patient', status: 'Active', department: 'Outpatient Clinic',
      phone: patientData.mobile, token: 'token-' + Math.floor(10000 + Math.random() * 90000)
    };

    const newPatientRecord = {
      id: newPatientId, name: patientData.fullName, email: patientData.email,
      age: parseInt(patientData.age) || 28, gender: patientData.gender || 'Female',
      dob: patientData.dob || '1998-05-15', bloodGroup: patientData.bloodGroup || 'O+',
      hospital: 'Kasturba Medical College Hospital, Manipal', assignedDoctor: 'Dr. Ananthakrishna Bhat',
      doctorEmail: 'doctor@medisphere.health', phone: patientData.mobile,
      address: patientData.address || 'Karnataka, India',
      emergencyContact: patientData.emergencyContact || `Emergency - ${patientData.mobile}`,
      conditions: ['Routine Primary Healthcare'], medications: ['Paracetamol 650mg as needed'],
      allergies: 'None', insurance: 'Arogya Karnataka Scheme',
      vitals: { hr: 72, bp: '120/80', spo2: 98, temp: 98.6, resp: 16 }, twinCompleteness: 85
    };

    try {
      await fetch(USER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      await fetch(PATIENT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatientRecord)
      });

      users.unshift(newUser);
      setItem(KEYS.USERS, users);
      patients.unshift(newPatientRecord);
      setItem(KEYS.PATIENTS, patients);

      this.logActivity('Patient Self-Registration', `Registered new patient account ${newUser.name} (${newPatientId})`);

      return { success: true, patientId: newPatientId, message: 'Registration Successful. Please Login.' };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Registration failed due to database connection issue." };
    }
  },

  async adminCreateUser(userData) {
    let userId = userData.employeeId || userData.username;
    if (!userId) {
      const prefix = userData.role === 'doctor' ? 'DOC' : userData.role === 'receptionist' ? 'REC' : userData.role === 'employee' ? 'EMP' : 'ADMIN';
      userId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newUser = {
      id: userId, name: userData.fullName, email: userData.email, username: userId,
      password: userData.password || 'medisphere2026', role: userData.role, status: 'Active',
      department: userData.department || 'Hospital Operations', phone: userData.mobile || '+91 98450 11223',
      token: 'token-' + Math.floor(10000 + Math.random() * 90000)
    };

    try {
      await fetch(USER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (userData.role === 'doctor') {
        await this.saveDoctor({
          id: userId, name: userData.fullName.startsWith('Dr.') ? userData.fullName : `Dr. ${userData.fullName}`,
          email: userData.email, department: userData.department || 'General Medicine',
          specialization: `${userData.department || 'General'} Specialist`, experience: '8 Years',
          phone: userData.mobile || '+91 98450 12345', rating: '4.9', availability: 'Mon - Fri (09:00 - 17:00)',
          status: 'Available', patientsCount: 0
        });
      } else if (userData.role === 'employee' || userData.role === 'receptionist') {
        await this.saveEmployee({
          id: userId, name: userData.fullName, email: userData.email,
          role: userData.role === 'receptionist' ? 'Receptionist (Intake Desk)' : 'Medical Staff (Nurse)',
          department: userData.department || 'Outpatient Clinic', shift: 'Day Shift'
        });
      }

      this.logActivity('Admin created user account', `Admin created ${userData.role.toUpperCase()} account for ${newUser.name} (${userId})`);
      return { success: true, user: newUser };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to create user in DB" };
    }
  },

  logActivity(action, details) {
    const logs = getItem(KEYS.ACTIVITY_LOGS) || [];
    const user = this.getCurrentUser();
    const now = new Date();
    const formattedTime = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

    const entry = {
      id: 'LOG-' + Math.floor(10000 + Math.random() * 90000),
      action, details: details || '',
      performedBy: user ? user.name : 'System Administrator',
      role: user ? user.role : 'admin',
      timestamp: formattedTime
    };
    logs.unshift(entry);
    if (logs.length > 300) logs.pop();
    setItem(KEYS.ACTIVITY_LOGS, logs);
    return entry;
  },

  saveUser(u) {
    const list = getItem(KEYS.USERS);
    const idx = list.findIndex(x => x.id === u.id || x.email === u.email);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...u };
    } else {
      if (!u.id) u.id = generateId('USR');
      if (!u.status) u.status = 'Active';
      list.unshift(u);
    }
    setItem(KEYS.USERS, list);
    this.logActivity('Admin saved user account', `Saved account ${u.name} (${u.role})`);
  },

  deleteUser(id) {
    let list = getItem(KEYS.USERS);
    const target = list.find(x => x.id === id);
    list = list.filter(x => x.id !== id);
    setItem(KEYS.USERS, list);
    this.logActivity('Admin deleted user account', `Deleted user ${target ? target.name : id}`);
  },

  setUserActiveStatus(id, status) {
    const list = getItem(KEYS.USERS);
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      setItem(KEYS.USERS, list);
      this.logActivity('Admin changed user status', `Set account ${list[idx].name} to ${status}`);
    }
  },

  resetUserPassword(id, newPass) {
    const list = getItem(KEYS.USERS);
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list[idx].password = newPass;
      setItem(KEYS.USERS, list);
      this.logActivity('Admin reset password', `Reset password for user ${list[idx].name}`);
    }
  },

  assignUserRole(id, newRole) {
    const list = getItem(KEYS.USERS);
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list[idx].role = newRole;
      setItem(KEYS.USERS, list);
      this.logActivity('Admin assigned role', `Assigned role ${newRole} to user ${list[idx].name}`);
    }
  },

  async saveAppointment(appt) {

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(appt)
  });

  return await response.json();
},

  async updateAppointmentStatus(id, status) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status
      })
    }
  );

  return await response.json();
},

  async deleteAppointment(id) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE"
    }
  );

  return await response.json();
},
async savePatient(patient) {
  const list = getItem(KEYS.PATIENTS);
  const idx = list.findIndex(x => x.id === patient.id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...patient };
  } else {
    list.unshift(patient);
  }
  setItem(KEYS.PATIENTS, list);

  try {
    const response = await fetch(PATIENT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patient)
    });

    if (!response.ok) {
        throw new Error("Failed to save patient to DB");
    }

    const savedPatient = await response.json();
    
    // Update local storage with the database response
    const newList = getItem(KEYS.PATIENTS);
    const newIdx = newList.findIndex(x => x.id === savedPatient.id);
    if (newIdx !== -1) {
      newList[newIdx] = savedPatient;
    } else {
      newList.unshift(savedPatient);
    }
    setItem(KEYS.PATIENTS, newList);

    return savedPatient;
  } catch (err) {
    console.error(err);
    return patient;
  }
},
async updatePatient(id, patient) {
  const list = getItem(KEYS.PATIENTS);
  const idx = list.findIndex(x => x.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...patient };
    setItem(KEYS.PATIENTS, list);
  }

  try {
    const response = await fetch(`${PATIENT_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patient)
    });
    if (!response.ok) {
      throw new Error("Failed to update patient in DB");
    }
    const updatedPatient = await response.json();
    return updatedPatient;
  } catch (err) {
    console.error(err);
    return patient;
  }
},
async deletePatient(id) {
  let list = getItem(KEYS.PATIENTS);
  list = list.filter(p => p.id !== id);
  setItem(KEYS.PATIENTS, list);

  try {
    const response = await fetch(`${PATIENT_API_URL}/${id}`, {
      method: "DELETE"
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { success: false };
  }
},

  async saveDoctor(doctor) {
    const response = await fetch(
        DOCTOR_API_URL,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(doctor)
        }
    );
    if(!response.ok){
        throw new Error("Failed to save doctor");
    }
    const result = await response.json();
    return result;
  },

  async updateDoctor(id, doctorData){
    const response = await fetch(
        `${DOCTOR_API_URL}/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(doctorData)
        }
    );
    return await response.json();
  },

  async deleteDoctor(id){
    const response = await fetch(
        `${DOCTOR_API_URL}/${id}`,
        {
            method:"DELETE"
        }
    );
    return await response.json();
  },

  async saveEmployee(emp) {
    const list = getItem(KEYS.EMPLOYEES);
    const idx = list.findIndex(x => x.id === emp.id);
    let action = 'Admin added Medical Staff';
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...emp };
      action = 'Admin updated Medical Staff';
    } else {
      list.unshift(emp);
    }
    setItem(KEYS.EMPLOYEES, list);
    this.logActivity(action, `${action}: ${emp.name} (${emp.role})`);

    try {
      await fetch(EMPLOYEE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emp)
      });
    } catch (err) { console.error(err); }
  },

  async deleteEmployee(id) {
    let list = getItem(KEYS.EMPLOYEES);
    const target = list.find(e => e.id === id);
    list = list.filter(e => e.id !== id);
    setItem(KEYS.EMPLOYEES, list);
    this.logActivity('Admin deleted Medical Staff', `Deleted staff member ${target ? target.name : id}`);

    try {
      await fetch(`${EMPLOYEE_API_URL}/${id}`, {
        method: "DELETE"
      });
    } catch (err) { console.error(err); }
  },

  async fetchFHIRResources() {
    try {
      const response = await fetch(FHIR_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.resourceId,
            patientId: item.patientId,
            patientName: item.patientName || "Anushree Naik",
            resourceType: item.resourceType,
            fhirVersion: item.fhirVersion || "R4",
            sourceSystem: item.source || "Hospital EHR",
            importTime: item.receivedAt,
            status: item.validationStatus === "Valid" ? "Synced" : "Failed"
          }));
          setItem(KEYS.FHIR_RESOURCES, formatted);
          return formatted;
        }
      }
    } catch (error) {
      console.error("Failed to fetch FHIR resources from DB", error);
    }
    return getItem(KEYS.FHIR_RESOURCES);
  },

  async addFHIRResource(res) {
    const list = getItem(KEYS.FHIR_RESOURCES);
    list.unshift(res);
    setItem(KEYS.FHIR_RESOURCES, list);
    this.logActivity('Uploaded FHIR Resource', `Uploaded ${res.resourceType} for ${res.patientName}`);

    try {
      const dbResource = {
        resourceType: res.resourceType,
        resourceId: res.id,
        patientId: res.patientId,
        patientName: res.patientName,
        source: res.sourceSystem,
        validationStatus: res.status === "Synced" ? "Valid" : "Invalid",
        receivedAt: res.importTime || new Date().toISOString(),
        resource: res.resource || { original: "Uploaded FHIR JSON" }
      };
      await fetch(FHIR_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbResource)
      });
    } catch (err) {
      console.error("Failed to save FHIR Resource to DB", err);
    }
  },

  async deleteFHIRResource(id) {
    let list = getItem(KEYS.FHIR_RESOURCES);
    list = list.filter(r => r.id !== id);
    setItem(KEYS.FHIR_RESOURCES, list);

    try {
      await fetch(`${FHIR_API_URL}/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete FHIR Resource from DB", err);
    }
  },

  async fetchKafkaEvents() {
    try {
      const response = await fetch(KAFKA_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.eventId,
            patientId: item.patientId,
            patientName: item.patientName || "Anushree Naik",
            metric: item.eventType || "VitalsStream",
            hr: item.hr || 72,
            bp: item.bp || "120/80",
            spo2: item.spo2 || 98,
            temp: item.temp || "98.6",
            resp: item.resp || 16,
            timestamp: item.receivedAt,
            status: item.status === "PROCESSED" ? "Processed" : "Failed",
            latencyMs: item.latencyMs || 2
          }));
          setItem(KEYS.KAFKA_EVENTS, formatted);
          return formatted;
        }
      }
    } catch (error) {
      console.error("Failed to fetch Kafka events from DB", error);
    }
    return getItem(KEYS.KAFKA_EVENTS);
  },

  async addKafkaEvent(evt) {
    const list = getItem(KEYS.KAFKA_EVENTS);
    list.unshift(evt);
    if (list.length > 500) list.pop();
    setItem(KEYS.KAFKA_EVENTS, list);

    try {
      const dbEvent = {
        eventId: evt.id,
        patientId: evt.patientId,
        patientName: evt.patientName,
        eventType: evt.metric || "VITAL",
        topic: "patient-vitals",
        status: evt.status === "Processed" ? "PROCESSED" : "FAILED",
        receivedAt: evt.timestamp || new Date().toISOString(),
        hr: evt.hr,
        bp: evt.bp,
        spo2: evt.spo2,
        temp: evt.temp,
        resp: evt.resp,
        latencyMs: evt.latencyMs
      };
      await fetch(KAFKA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbEvent)
      });
    } catch (err) {
      console.error("Failed to save Kafka Event to DB", err);
    }
  },

  async updateKafkaEvent(id, patch) {
    const list = getItem(KEYS.KAFKA_EVENTS);
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch };
      setItem(KEYS.KAFKA_EVENTS, list);
    }

    try {
      const dbStatus = patch.status === "Processed" ? "PROCESSED" : "FAILED";
      await fetch(`${KAFKA_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: dbStatus })
      });
    } catch (err) {
      console.error("Failed to update Kafka Event in DB", err);
    }
  },

  async deleteKafkaEvent(id) {
    let list = getItem(KEYS.KAFKA_EVENTS);
    list = list.filter(e => e.id !== id);
    setItem(KEYS.KAFKA_EVENTS, list);

    try {
      await fetch(`${KAFKA_API_URL}/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete Kafka Event from DB", err);
    }
  },

  async fetchVitals() {
    try {
      const response = await fetch(VITALS_API_URL);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch vitals from DB", error);
    }
    return [];
  },

  async saveVitals(vitalsData) {
    try {
      const response = await fetch(VITALS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitalsData)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Failed to save vitals to DB", error);
    }
    return vitalsData;
  },

  async fetchLabResults() {
    try {
      const response = await fetch(LAB_RESULTS_API_URL);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch lab results from DB", error);
    }
    return [];
  },

  async saveLabResults(patientId, labResults) {
    try {
      const response = await fetch(LAB_RESULTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, labResults })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Failed to save lab results to DB", error);
    }
    return { patientId, labResults };
  },

  getCurrentUser: () => {
    try {
      const u = sessionStorage.getItem(KEYS.CURRENT_USER);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser: (user) => {
    sessionStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    sessionStorage.setItem(KEYS.TOKEN, generateJWTToken(user));
  },

  getToken: () => sessionStorage.getItem(KEYS.TOKEN),

  logout: () => {
    sessionStorage.removeItem(KEYS.CURRENT_USER);
    sessionStorage.removeItem(KEYS.TOKEN);
  },

  resetData: () => {
    localStorage.clear();
    seedInitialData();
  }
};

export { KEYS };
export default MediStorage;
