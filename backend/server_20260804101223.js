// ================================================================
// MEDISPHERE BACKEND SERVER
// Kafka Simulation Mode
// ================================================================


const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");



const app = express();

const PORT = 5000;



// ================================================================
// MIDDLEWARE
// ================================================================

app.use(cors());

app.use(express.json());



// ================================================================
// ROUTES
// ================================================================

const fhirRoutes =
require("./routes/fhir.routes");


const kafkaRoutes =
require("./routes/kafka.routes");


const vitalsRoutes =
require("./routes/vitals.routes");



app.use(
"/api/fhir",
fhirRoutes
);



app.use(
"/api/kafka",
kafkaRoutes
);



app.use(
"/api/vitals",
vitalsRoutes
);




// ================================================================
// SOCKET SERVER
// ================================================================

const server = http.createServer(app);



const io = socket(server,{

    cors:{
        origin:"*"
    }

});





io.on("connection",(socket)=>{


    console.log(
        "Frontend connected:",
        socket.id
    );


    socket.on("disconnect",()=>{

        console.log(
            "Frontend disconnected"
        );

    });


});





// ================================================================
// KAFKA SIMULATION MODE
// ================================================================


const mockKafka =
require("./kafka/mockKafka");





// Send live updates every 5 seconds

setInterval(()=>{


    io.emit(
        "kafka-update",
        {

            vitals:
            mockKafka.getVitals(),


            events:
            mockKafka.getEvents()

        }
    );


},5000);







// ================================================================
// START SERVER
// ================================================================


server.listen(PORT,()=>{


    console.log(
        "================================"
    );


    console.log(
        "MediSphere Backend Started"
    );


    console.log(
        "Kafka Mode : SIMULATION"
    );


    console.log(
        `Server running on http://localhost:${PORT}`
    );


    console.log(
        "================================"
    );


});