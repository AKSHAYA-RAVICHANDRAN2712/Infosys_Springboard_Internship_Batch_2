
import "../styles/HealthcarePages.css";

function TwinCompleteness() {

    return (

        <div className="health-page">

            <h1>Digital Twin Data Completeness</h1>

            <p className="intro">
                Digital Twin Data Completeness ensures that all required
                patient information is available, accurate, and updated
                for better healthcare decisions.
            </p>


            <div className="health-card">

                <h2>Completeness Score</h2>

                <div className="score-circle">
                    96%
                </div>

                <p>
                    Current data completeness is above the required
                    threshold of 95%.
                </p>

            </div>



            <div className="health-card">

                <h2>Patient Digital Twin Data Status</h2>


                <div className="status-list">

                    <div>
                        <span>Patient Profile</span>
                        <b>Completed ✓</b>
                    </div>


                    <div>
                        <span>Medical History</span>
                        <b>Completed ✓</b>
                    </div>


                    <div>
                        <span>Previous Reports</span>
                        <b>Completed ✓</b>
                    </div>


                    <div>
                        <span>Vital Records</span>
                        <b>Verified ✓</b>
                    </div>


                    <div>
                        <span>Medication Details</span>
                        <b>Updated ✓</b>
                    </div>


                </div>

            </div>



            <div className="health-card">

                <h2>Benefits</h2>

                <ul>

                    <li>Provides complete patient health information.</li>

                    <li>Helps doctors make accurate decisions.</li>

                    <li>Reduces missing medical data issues.</li>

                    <li>Improves personalized healthcare services.</li>

                </ul>

            </div>


        </div>

    );
}


export default TwinCompleteness;