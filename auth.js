const argon2 = require('argon2')

const hashPassword = (req, res, next) => {
    // récupération du mdp en clair
    const password = req.body.password
    const hashingOptions = {
        type: argon2.argon2d,
        memoryCost: 2 ** 16,
        parallelism: 1
    }
    argon2
        .hash(password, hashingOptions) //hasher le mdp
        .then((hashedPassword) => {
            // la promess retounne le mdp hasher
            console.log(hashedPassword)
            // donner le mdp hasher à mon champ hashedPassword
            req.body.hashedPassword = hashedPassword
            delete password
            next()
        })
        .catch(err => {
            console.log(err)
            res.senStatus(500)
        })
}

module.exports = {
    hashPassword
}