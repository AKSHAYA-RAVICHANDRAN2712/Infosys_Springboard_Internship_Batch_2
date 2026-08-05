import "../styles/Cards.css";

function StatCard({title, value, description}){

    return(

        <div className="stat-card">

            <h3>{title}</h3>

            <h1>{value}</h1>

            <p>{description}</p>

        </div>

    )

}

export default StatCard;