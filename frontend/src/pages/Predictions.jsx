import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";


function Predictions(){

return(

<>

<Navbar />


<div className="layout">


<Sidebar />


<main className="dashboard">


<h1>
AI Predictions
</h1>


<div className="patient-card">


<h2>
Health Risk Prediction
</h2>


<p>
Diabetes Risk : Low
</p>


<p>
Heart Disease Risk : Medium
</p>


<p>
Recommendation : Regular Monitoring
</p>


</div>


</main>


</div>


</>

)

}


export default Predictions;