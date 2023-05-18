const database = require('./database')

// const movies = [
//   {
//     id: 1,
//     title: "Citizen Kane",
//     director: "Orson Wells",
//     year: "1941",
//     colors: false,
//     duration: 120,
//   },
//   {
//     id: 2,
//     title: "The Godfather",
//     director: "Francis Ford Coppola",
//     year: "1972",
//     colors: true,
//     duration: 180,
//   },
//   {
//     id: 3,
//     title: "Pulp Fiction",
//     director: "Quentin Tarantino",
//     year: "1994",
//     color: true,
//     duration: 180,
//   },
// ];

const getMovies = (req, res) => {
  database
    .query('select * from movies')
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database")
    })
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('select * from movies where id = ?', [id])
    .then(([movies]) => {
      if(movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send('not found')
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database")
    })
};

const postMovie = (req, res) => {
  console.log(req.body);
  const {title, director, year, color, duration} = req.body
  database
  .query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration]
  )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201)
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error saving the movie");
    })
}

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id)
  const { title, director, year, color, duration } = req.body
  database
    .query('UPDATE movies SET title = ?, director = ?, year= ?, color = ?, duration = ? WHERE id = ?', [title, director, year, color, duration, id])
    .then(([result]) => {
      // si aucune ligne de la base n'est affecté cela veut dire que la data est introuvable
      if(result.affectedRows === 0) {
        res.status(404).send('Not found')
      } else {
        // sinon request successful (no-content to send)
        res.sendStatus(204)
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error editing the movie");
    })
}



module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
};
