
import "../styles/HealthcarePages.css";


function RBAC(){


    return(


        <div className="health-page">


            <h1>Role Based Access Control (RBAC)</h1>


            <p className="intro">

                RBAC provides secure access management by assigning
                permissions based on user roles. MediSphere supports
                Provider and Patient roles.

            </p>




            <div className="role-grid">


                <div className="role-card">


                    <h2>Doctor / Provider</h2>


                    <ul>

                        <li>View patient health records</li>

                        <li>Monitor patient vitals</li>

                        <li>Update treatment plans</li>

                        <li>Access medical reports</li>

                        <li>Manage care information</li>


                    </ul>


                </div>




                <div className="role-card">


                    <h2>Patient</h2>


                    <ul>

                        <li>View personal health data</li>

                        <li>Check medical reports</li>

                        <li>View care plans</li>

                        <li>Track health progress</li>

                        <li>Manage profile information</li>


                    </ul>


                </div>



            </div>




            <div className="health-card">


                <h2>Security Advantages</h2>


                <ul>

                    <li>Prevents unauthorized data access.</li>

                    <li>Protects sensitive healthcare information.</li>

                    <li>Improves privacy and security.</li>

                    <li>Provides controlled system access.</li>


                </ul>


            </div>



        </div>


    );


}


export default RBAC;