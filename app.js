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
const { hashPassword, verifyPassword, verifyToken } = require('./middlewares/auth')

const isCredentiaValid = (req, res, next) => {
  const { email, password } = req.body
  if(email === 'dwight@theoffice.com' && password==="123456") {
    res.send("Credentials are valid")
  } else {
    res.sendStatus(401)
  }
}


/* -------------------------------------------------------------------------- */
/*                                PUBLIC ROUTES                               */
/* -------------------------------------------------------------------------- */

/* ------------------------------ MOVIES ROUTE ------------------------------ */
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

/* ------------------------------- USERS ROUTE ------------------------------ */

app.get("/api/users", userHandlers.getUsers)
app.get("/api/users/:id", userHandlers.getUserById)
app.post('/api/users', validateUser, hashPassword , userHandlers.postUsers)

/* ---------------------------------- Login --------------------------------- */
app.post('/api/login', userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword)


/* -------------------------------------------------------------------------- */
/*                           PRIVATES ROUTES / WALL                           */
/* -------------------------------------------------------------------------- */
// authentication WALL : verifyToken is activated for each route after this line
app.use(verifyToken)

/* ------------------------------ MOVIES ROUTE ------------------------------ */
app.post('/api/movies', validateMovie, movieHandlers.postMovie)
app.put('/api/movies/:id',validateMovie, movieHandlers.updateMovie)
app.delete('/api/movies/:id', movieHandlers.deleteMovie)

/* ------------------------------- USERS ROUTE ------------------------------ */
app.put('/api/users/:id', validateUser, hashPassword, userHandlers.updateUser)
app.delete('/api/users/:id', userHandlers.deleteUser)






/* ----------------------------- PORT LISTENING ----------------------------- */
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
