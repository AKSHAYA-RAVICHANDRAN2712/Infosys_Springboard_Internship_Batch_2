import "../styles/Module.css";


function RoleCard(){


    return(

        <div className="module-card">


            <h2>
                RBAC Access
            </h2>


            <div className="role">


                <h3>
                    Current Role: Patient
                </h3>


                <p>
                    ✓ View Personal Health Data
                </p>


                <p>
                    ✓ View Reports
                </p>


                <p>
                    ✓ View Medication
                </p>


            </div>



            <div className="role">


                <h3>
                    Provider Access
                </h3>


                <p>
                    ✓ View Patients
                </p>


                <p>
                    ✓ Update Care Plans
                </p>


                <p>
                    ✓ Run Predictions
                </p>


            </div>


        </div>

    )

}


export default RoleCard;