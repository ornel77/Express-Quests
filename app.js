require('dotenv').config()

const express = require("express");

const app = express();


// important pour récupérer les données de req.body
app.use(express.json())

const port =  process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers")
const {validateMovie, validateUser} = require('./validators')

/* ------------------------------ MOVIES ROUTE ------------------------------ */
// GET
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

// POST
app.post('/api/movies', validateMovie, movieHandlers.postMovie)

// PUT
app.put('/api/movies/:id',validateMovie, movieHandlers.updateMovie)

/* ------------------------------- USERS ROUTE ------------------------------ */
// GET
app.get("/api/users", userHandlers.getUsers)
app.get("/api/users/:id", userHandlers.getUserById)

// POST
app.post('/api/users', validateUser, userHandlers.postUsers)

// PUT
app.put('/api/users/:id', validateUser, userHandlers.updateUser)




/* ----------------------------- PORT LISTENING ----------------------------- */
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
