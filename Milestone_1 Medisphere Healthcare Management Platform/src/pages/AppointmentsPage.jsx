import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import BookAppointmentForm from '../components/forms/BookAppointmentForm';
import AppointmentSlipView from '../components/forms/AppointmentSlipView';

const statusVariant = (v) => v === 'Confirmed' ? 'success' : v === 'Pending' ? 'warning' : v === 'Completed' ? 'purple' : 'danger';

export default function AppointmentsPage() {

const { currentUser } = useAuth();
const { open } = useModal();
const toast = useToast();

const [refreshKey, setRefreshKey] = useState(0);
const [data, setData] = useState([]);

function refresh() { setRefreshKey(k => k + 1); }


useEffect(() => {
loadAppointments();
}, [refreshKey]);


async function loadAppointments() {
try {
const appointments = await MediStorage.getAppointments();
setData(Array.isArray(appointments) ? appointments : []);
} catch(error) {
console.error(error);
setData([]);
}
}


let filteredData = data;

if (currentUser.role === 'patient') {
filteredData = data.filter(a => a.patientName === currentUser.name || a.patientId === currentUser.id);
} 
else if (currentUser.role === 'doctor') {
const docAppts = data.filter(a => a.doctorName === currentUser.name);
if (docAppts.length > 0) filteredData = docAppts;
}


function viewDetail(id) {

const a = filteredData.find(x => x.id === id);

if(!a) return;

open(`Appointment Details - ${a.id}`, (
<div style={{color:'#FFF',lineHeight:1.8}}>
Patient: {a.patientName} ({a.patientId || 'PAT-1001'})
<br/>
Doctor: {a.doctorName} ({a.department})
<br/>
Date & Time: {a.date} at {a.time}
<br/>
Status: {a.status}
<br/>
Chief Complaint: {a.symptoms}
<br/>
Notes: {a.notes || 'Routine consultation scheduled'}
</div>
));

}


function confirmStatus(id) {
MediStorage.updateAppointmentStatus(id,'Confirmed');
toast.success(`Confirmed appointment ${id}`);
refresh();
}


function completeStatus(id) {
MediStorage.updateAppointmentStatus(id,'Completed');
toast.success(`Appointment ${id} marked as Completed!`);
refresh();
}


function cancelStatus(id) {
MediStorage.updateAppointmentStatus(id,'Cancelled');
toast.warning(`Cancelled appointment ${id}`);
refresh();
}


function deleteRecord(id) {

if(confirm(`Admin action: Delete appointment record ${id}?`)) {

MediStorage.deleteAppointment(id);
toast.success(`Deleted appointment ${id}`);
refresh();

}

}


function printSlip(id) {

const appt = filteredData.find(x=>x.id===id);

if(!appt) return;

open('Appointment Slip',
<AppointmentSlipView appointment={appt}/>
);

}


const title = currentUser.role === 'patient'
? 'My Scheduled Appointments'
: currentUser.role === 'doctor'
? 'My Assigned Patient Consultations'
: 'Hospital Appointment Directory';


return (
<>

<h2>Appointment Management</h2>

<p style={{color:'#9CA3AF',fontSize:'0.85rem',marginTop:4}}>
Schedule, confirm, reschedule, and manage clinical appointments.
</p>


<button 
className="btn btn-primary"
onClick={() => open('Book Appointment',
<BookAppointmentForm refresh={refresh}/>
)}
>
+ Book New Appointment
</button>


<div key={refreshKey}>

<DataTable
title={title}
searchPlaceholder="Search by Patient, Doctor, Date, Status..."
data={filteredData}
columns={[
{key:'id',label:'Appt ID'},

{
key:'patientName',
label:'Patient Name',
render:(v,row)=>
<>
<strong>{v}</strong>
<span style={{fontSize:'0.75rem',color:'#9CA3AF'}}>
({row.patientId || 'PAT-1001'})
</span>
</>
},

{
key:'doctorName',
label:'Doctor',
render:(v,row)=>
<>
<strong>{v}</strong>
<span style={{fontSize:'0.75rem',color:'#9CA3AF'}}>
({row.department})
</span>
</>
},

{
key:'date',
label:'Date & Time',
render:(v,row)=>`${v} at ${row.time}`
},

{
key:'symptoms',
label:'Chief Complaint'
},

{
key:'status',
label:'Status',
render:v=><Badge variant={statusVariant(v)}>{v}</Badge>
},

{
key:'id',
label:'Actions',
render:(id,row)=>{

const btns=[
<button key="det" className="btn btn-secondary btn-sm" onClick={()=>viewDetail(id)}>
Details
</button>
];


if(['admin','receptionist','doctor'].includes(currentUser.role) && row.status==='Pending'){
btns.push(
<button key="conf" className="btn btn-success btn-sm" onClick={()=>confirmStatus(id)}>
Confirm
</button>
);
}


if(currentUser.role==='doctor' && row.status==='Confirmed'){
btns.push(
<button key="comp" className="btn btn-purple btn-sm" onClick={()=>completeStatus(id)}>
Complete
</button>
);
}


if(['patient','receptionist','admin'].includes(currentUser.role) && row.status!=='Cancelled' && row.status!=='Completed'){
btns.push(
<button key="cancel" className="btn btn-warning btn-sm" onClick={()=>cancelStatus(id)}>
Cancel
</button>
);
}


if(['admin','receptionist','patient'].includes(currentUser.role)){
btns.push(
<button key="slip" className="btn btn-info btn-sm" onClick={()=>printSlip(id)}>
Slip
</button>
);
}


if(currentUser.role==='admin'){
btns.push(
<button key="del" className="btn btn-danger btn-sm" onClick={()=>deleteRecord(id)}>
Delete
</button>
);
}


return <>{btns.map((b,i)=><span key={i}>{b} </span>)}</>;

}
}

]}
/>

</div>

</>
);

}