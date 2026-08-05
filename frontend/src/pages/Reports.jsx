import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";


function Reports(){


return(

<>

<Navbar />


<div className="layout">


<Sidebar />


<main className="dashboard">


<h1>
Reports
</h1>


<div className="patient-card">


<h2>
Healthcare Reports
</h2>


<p>
FHIR Data Report Generated
</p>


<p>
Patient Health Summary
</p>


<p>
Twin Analytics Report
</p>


</div>


</main>


</div>


</>


)


}


export default Reports;