import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";


function Patients(){

    return(

        <>
        <Navbar />

        <div className="layout">

            <Sidebar />


            <main className="dashboard">

                <h1>
                    Patients
                </h1>


                <div className="patient-card">

                    <h2>
                        Patient List
                    </h2>


                    <p>
                        John Doe - ID: MS10234
                    </p>

                    <p>
                        Sarah Smith - ID: MS10235
                    </p>

                    <p>
                        Robert Brown - ID: MS10236
                    </p>


                </div>


            </main>


        </div>

        </>

    )

}


export default Patients;