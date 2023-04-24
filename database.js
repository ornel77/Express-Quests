require('dotenv').config();

// import mysql pour se connecter à la BDD
const mysql = require('mysql2/promise');

//  préparer un pool de connexion à l'aide des variables d'environnement que tu viens de créer
const database = mysql.createPool({
    host: process.env.DB_HOST, // address of the server
    port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the APP_PORT !
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//obtenir une première connexion depuis le pool
// ce n'est pas obbligatoire mais recommandé pour déboguer en cas d'échec de co 
database
    .getConnection()
    .then(() => {
        console.log('Can reach database');
    })
    .catch((err) => {
        console.error(err)
    })

// faire une requête
// database
//     .query('select * from users')
//     .then((result) => {
//         const movies = result[0] // en destructurant .then(([movies]))
//         console.log(movies);
//     })
//     .catch((err) => {
//         console.log(err);
//     })

module.exports = database;
