import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";


function Twins(){

return(

<>
<Navbar />

<div className="layout">

<Sidebar />


<main className="dashboard">


<h1>
Digital Health Twins
</h1>


<div className="patient-card">


<h2>
Active Twins
</h2>


<p>
John Doe Twin - Active
</p>


<p>
Sarah Smith Twin - Active
</p>


</div>


</main>


</div>


</>

)


}


export default Twins;