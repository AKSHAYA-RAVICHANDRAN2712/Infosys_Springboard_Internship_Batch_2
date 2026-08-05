import "../styles/Cards.css";


function PatientCard(){

    return(

        <div className="patient-card">


            <h2>
                Digital Health Twin - John Doe
            </h2>


            <div className="patient-grid">


                <div>
                    <h3>FHIR Patient Resource</h3>
                    <p>
                        Patient ID: MS10234
                    </p>
                    <p>
                        Age: 45
                    </p>
                    <p>
                        Gender: Male
                    </p>
                </div>



                <div>
                    <h3>Vitals Stream</h3>
                    <p>
                        Heart Rate: 78 BPM
                    </p>

                    <p>
                        Blood Pressure: 120/80
                    </p>

                    <p>
                        SpO2: 98%
                    </p>
                </div>



                <div>
                    <h3>Lab Results</h3>

                    <p>
                        Glucose: Normal
                    </p>

                    <p>
                        Cholesterol: Normal
                    </p>

                </div>



                <div>
                    <h3>Medications</h3>

                    <p>
                        Metformin
                    </p>

                    <p>
                        Vitamin D
                    </p>

                </div>


            </div>



            <div className="actions">


                <button>
                    View Timeline
                </button>


                <button>
                    Run Prediction
                </button>


                <button>
                    Create Careplan
                </button>


            </div>



        </div>

    )

}


export default PatientCard;