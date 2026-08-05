import { Routes, Route } from "react-router-dom";


import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Twins from "../pages/Twins";
import Predictions from "../pages/Predictions";
import Alerts from "../pages/Alerts";
import CarePlans from "../pages/CarePlans";
import Reports from "../pages/Reports";
import TwinCompleteness from "../pages/TwinCompleteness";
import VitalValidation from "../pages/VitalValidation";
import RBAC from "../pages/RBAC";


function AppRoutes(){

return(

<Routes>


<Route path="/" element={<Login />} />


<Route path="/dashboard" element={<Dashboard />} />


<Route path="/patients" element={<Patients />} />


<Route path="/twins" element={<Twins />} />


<Route path="/predictions" element={<Predictions />} />


<Route path="/alerts" element={<Alerts />} />


<Route path="/careplans" element={<CarePlans />} />


<Route path="/reports" element={<Reports />} />
<Route 
path="/twin-completeness" 
element={<TwinCompleteness />} 
/>


<Route 
path="/vital-validation" 
element={<VitalValidation />} 
/>


<Route 
path="/rbac" 
element={<RBAC />} 
/>

</Routes>

)

}


export default AppRoutes;