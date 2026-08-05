import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import StatCard from "../components/StatCard";
import PatientCard from "../components/PatientCard";

// import TwinCompleteness from "../pages/TwinCompleteness";
// import VitalValidation from "../pages/VitalValidation";
// import RBAC from "../pages/RBAC";

import "../styles/Dashboard.css";


function Dashboard(){

    return(

        <>

        <Navbar />


        <div className="layout">


            <Sidebar />


            <main className="dashboard">


                <h1>
                    Patient 360 Dashboard
                </h1>



                {/* Top Statistics Cards */}

                <div className="stats">


                    <StatCard

                        title="Patients Onboarded"

                        value="250"

                        description="Active Patients"

                    />



                    <StatCard

                        title="FHIR Resources"

                        value="1200"

                        description="FHIR Integrated Data"

                    />



                    <StatCard

                        title="Twins Created"

                        value="180"

                        description="Digital Health Twins"

                    />


                </div>



                {/* Patient Digital Twin Section */}

                <PatientCard />



                {/* MediSphere Required Modules */}


                <div className="module-section">

{/* 
                    <TwinCompleteness />


                    <VitalValidation />       

                    <RBAC /> */}


                </div>



            </main>


        </div>


        </>

    )

}


export default Dashboard;