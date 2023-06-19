const database = require('./database')


const getUsers = (req, res ) => {
  let sql = 'select id, firstname, lastname, email, city, language from users'
  const sqlValues = []
  if(req.query.language) {
    sql += ' where language = ?'
    sqlValues.push(req.query.language)
    if(req.query.city) {
      sql += ' and city = ?'
      sqlValues.push(req.query.city)
    }
  } else if(req.query.city) {
    sql += ' where city = ?'
      sqlValues.push(req.query.city)
    if(req.query.language) {
      sql += ' and language = ?'
    sqlValues.push(req.query.language)
    }
  }
    database
      .query(sql, sqlValues)
      .then(([users]) => {
        res.json(users)
        // res.status(200).send("send")
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving data from database')
      })
  }

const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    database
        .query('select id, firstname, lastname, email, city, language from users where id=?', [id])
        .then(([users]) => {
            if(users[0] != null) {
                res.json(users[0])
            } else {
                res.status(404).send('not found')
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error retrieving data from database")
        })
}

const postUsers = (req, res) => {
    const {firstname, lastname, email, city, language, password} = req.body
    database
        .query('INSERT INTO users (firstname, lastname, email, city, language, password) VALUES (?,?,?,?,?,?)', [firstname, lastname, email, city, language, password])
        .then(([result]) => {
            res.location(`api/users/${result.insertId}`).sendStatus(201)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error saving the user");
          })
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    
    const {firstname, lastname, email, city, language, password} = req.body
    database
        .query('UPDATE users SET firstname = ?, lastname = ?, email= ?, city = ?, language = ?, password = ? WHERE id = ?', [firstname, lastname, email, city, language,password, id])
        .then(([result]) => {
          if(id !== req.payload.sub) {
            res.sendStatus(403)
          } else if(result.affectedRows === 0) {
              res.status(404).send('Not found')
          } else {
              res.sendStatus(204)
          }
        })
        .catch((error) => {
        console.error(error);
        res.status(500).send("Error editing the user");
        })

}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)
    
    database
      .query('DELETE FROM users WHERE id = ?', [id])
      .then(([result]) => { 
        if(id !== req.payload.sub) {
          res.sendStatus(403)
        }else if(result.affectedRows === 0) {
          res.status(404).send('not found')
        } else {
          res.sendStatus(204)
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error deleting the user");
      })
  }

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const {email} = req.body
  database
    .query('select * from users where email = ?', [email])
    .then(([users]) => {
      if(users[0] != null) {
        req.user = users[0]
        next()
      } else {
        res.sendStatus(401)
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error server");
    })
}





module.exports = {
    getUsers,
    getUserById,
    postUsers,
    updateUser,
    deleteUser,
    getUserByEmailWithPasswordAndPassToNext
}