import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Login.css";


function Login(){

    const navigate = useNavigate();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");



    const handleLogin = (e) => {

        e.preventDefault();


        if(email === "patient@gmail.com" && password === "123456"){

            localStorage.setItem("isLoggedIn", "true");

            navigate("/dashboard");

        }
        else{

            alert("Invalid Email or Password");

        }

    };



    return(

        <div className="login-page">


            <div className="login-box">


                <h1>
                    🏥 MediSphere
                </h1>


                <p>
                    Patient 360 Healthcare Platform
                </p>



                <form onSubmit={handleLogin}>


                    <input

                        type="email"

                        placeholder="Enter Email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                    />



                    <input

                        type="password"

                        placeholder="Enter Password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                    />



                    <button type="submit">

                        Login

                    </button>


                </form>



                <div className="demo-credentials">

                    <h4>
                        Demo Credentials
                    </h4>


                    <p>
                        Email: patient@gmail.com
                    </p>


                    <p>
                        Password: 123456
                    </p>


                </div>



            </div>


        </div>

    )

}


export default Login;