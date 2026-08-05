
import "../styles/HealthcarePages.css";


function VitalValidation(){

    return(

        <div className="health-page">


            <h1>Vitals Range Validation</h1>


            <p className="intro">

                Vitals Range Validation checks patient vital signs
                and ensures values are within medically acceptable
                ranges before storing them in the database.

            </p>



            <div className="health-card">


                <h2>Patient Vital Monitoring</h2>


                <table>


                    <thead>

                        <tr>

                            <th>Vital Parameter</th>
                            <th>Current Value</th>
                            <th>Normal Range</th>
                            <th>Status</th>

                        </tr>

                    </thead>



                    <tbody>


                        <tr>

                            <td>Heart Rate</td>
                            <td>78 BPM</td>
                            <td>60 - 100 BPM</td>
                            <td className="safe">Normal</td>

                        </tr>



                        <tr>

                            <td>Body Temperature</td>
                            <td>98.6°F</td>
                            <td>97°F - 99°F</td>
                            <td className="safe">Normal</td>

                        </tr>



                        <tr>

                            <td>Blood Pressure</td>
                            <td>120/80 mmHg</td>
                            <td>90/60 - 120/80</td>
                            <td className="safe">Normal</td>

                        </tr>



                        <tr>

                            <td>Oxygen Level</td>
                            <td>98%</td>
                            <td>95% - 100%</td>
                            <td className="safe">Normal</td>

                        </tr>


                    </tbody>


                </table>


            </div>



            <div className="health-card">


                <h2>Validation Process</h2>


                <ol>

                    <li>Receive patient vital data.</li>

                    <li>Compare values with medical ranges.</li>

                    <li>Identify abnormal conditions.</li>

                    <li>Store only validated information.</li>

                    <li>Generate alerts for critical values.</li>


                </ol>


            </div>



        </div>

    );

}


export default VitalValidation;