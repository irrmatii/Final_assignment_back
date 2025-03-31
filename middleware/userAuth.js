const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const userToken = req.headers.authorization;

    jwt.verify(userToken, process.env.SECRET_KEY, async (err, item) => {

        if (err) return res.send({message: 'Invalid token'})
        if (!item) return res.send({message: 'Invalid token'})

        req.body.user = item

        next()
    })
}