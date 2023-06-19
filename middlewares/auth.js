const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const hashPassword = async (req, res, next) => {
    // récupération du mdp en clair
    let password = req.body.password
    const hashingOptions = {
        type: argon2.argon2d,
        memoryCost: 2 ** 16,
        parallelism: 1
    }
    // argon2
    //     .hash(password) //hasher le mdp
    //     .then((hashedPassword) => {
    //         // la promesse retounne le mdp hasher
    //         // écraser le mdp clair
    //         req.body.password = hashedPassword
    //         next()
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json('servor error')
    //     })
    try {
        let hashedPassword = await argon2.hash(password)
        // la promesse retounne le mdp hasher
        // écraser le mdp clair
        req.body.password = hashedPassword
        next()
    } catch(err) {
        console.log(err);
        res.sendStatus(500)
    }
    
}

const verifyPassword = (req, res) => {
    
    argon2
        .verify(req.user.password, req.body.password)
        .then((isVerified) => {
            if(isVerified) {
                const payload = {sub: req.user.id}
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"} )
                delete req.user.password
                res.send({ token, user: req.user })
            } else {
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
    // try {
    //     // cette promesse renvoie un booléin
    //     const isVerified = await argon2.verify(req.user.password, req.body.password)
    //     if(isVerified) {
    //         res.send('Credentials are valid')
    //     } else {
    //         res.sendStatus(401)
    //     }
    // } catch(err) {
    //     console.log(err);
    //     res.sendStatus(500)
    // }
  }


const verifyToken = (req, res, next) => {
    try {
        const authorizationHeader = req.get('Authorization')
        console.log(authorizationHeader.split(' '))
        if(authorizationHeader == null) {
            throw new Error('Aothorization header is missing')
        }
        const [type, token] = authorizationHeader.split(' ')
        if(type != "Bearer") {
        throw new Error("not the Bearer type")
        }

        req.payload = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch(err) {
        console.error(err)
        res.sendStatus(401)
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
    verifyToken
}