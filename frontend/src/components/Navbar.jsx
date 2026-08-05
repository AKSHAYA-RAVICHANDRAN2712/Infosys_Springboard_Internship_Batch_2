import "../styles/Navbar.css";

function Navbar(){

    return(
        <nav className="navbar">

            <div className="logo">
                🏥 MediSphere
            </div>


            <div className="title">
                Milestone 1: FHIR Integration & Twin Foundation
            </div>


            <div className="user">

                <span>
                    Clinician
                </span>

                <button
onClick={()=>{

localStorage.removeItem("isLoggedIn");

window.location.href="/";

}}
>
Logout
</button>

            </div>


        </nav>
    )
}


export default Navbar;