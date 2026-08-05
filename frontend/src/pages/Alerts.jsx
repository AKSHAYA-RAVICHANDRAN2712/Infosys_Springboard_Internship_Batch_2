import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";


function Alerts(){

return(

<>

<Navbar />

<div className="layout">

<Sidebar />


<main className="dashboard">


<h1>
Patient Alerts
</h1>


<div className="patient-card">


<h2>
Active Alerts
</h2>


<p>
⚠ Blood Pressure Increased
</p>


<p>
⚠ Medication Reminder
</p>


</div>


</main>


</div>


</>

)

}


export default Alerts;