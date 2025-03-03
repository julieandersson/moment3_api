'use strict';

const Hapi = require('@hapi/hapi'); // Importerar ramverket Hapi
const Mongoose = require("mongoose"); // Importerar mongoose för databasen
require("dotenv").config(); // dotenv för att läsa in variabler från .env-filen

// Initierar servern
const init = async () => {

    // Hapi-server
    const server = Hapi.server({
        port: process.env.PORT || 5000, // port 5000
        host: '0.0.0.0', // lyssnar på ipadress
        routes: {
            cors: {
                origin: ['*'], // tillåter alla CORS-anrop
                credentials: true, // cookies skickas med
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin"]
            }
        }
    });

    // Anslutning till Mongodb
    Mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB!"); // Bekräftelsemeddelande om anslutningen lyckades
    }).catch((error) => {
        console.error("Fel vid anslutning till databasen: " + error); // Felmeddelande vid misslyckad anslutning
    });

    await server.start();
    console.log('Server startad på %s', server.info.uri); // loggar serverns URI
};

// fångar ohanterade fel och avslutar processen
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();