import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";


function CarePlans(){


return(

<>


<Navbar />


<div className="layout">


<Sidebar />


<main className="dashboard">


<h1>
Care Plans
</h1>


<div className="patient-card">


<h2>
Patient Care Management
</h2>


<p>
Exercise Plan
</p>


<p>
Medication Schedule
</p>


<p>
Doctor Follow-up
</p>


</div>


</main>


</div>


</>


)


}


export default CarePlans;