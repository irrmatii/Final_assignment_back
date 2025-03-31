const usersInfo = require("../modules/functions");
const userDb = require('../schemas/userDb')

module.exports = {

    validateRegister: async function (req, res, next) {

        const {email, username, password, password2 } = req.body;
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const userNameExists = await userDb.findOne({username})
        const userExists = await userDb.findOne({email, username})


        if (!email) return res.status(400).send({message: 'Email is required', error: "email"});
        if (!pattern.test(email)) return res.status(400).send({message: 'Invalid email', error: "email"});
        if (userNameExists) return res.status(400).send({message: 'Username already exist', error: "username"});
        if (userExists) return res.status(400).send({message: 'User already exist', error: "all"});
        if (!username) return res.status(400).send({message: 'Username is required', error: "username"});
        if (username[0]!== username[0].toUpperCase()) return res.status(400).send({message: 'Username should start with upper letter', error: "username"});
        if (username.length < 4) return res.status(400).send({message: 'Username must have at least 4 characters', error: "username"});
        if (username.length > 20) return res.status(400).send({message: 'Username is too long', error: "username"});
        if (!password  || !password2) return res.status(400).send({message: 'Password is required', error: "password"});
        if (password.length < 5) return res.status(400).send({message: 'Password must have at least 5 characters', error: "password"});
        if (password.length > 20) return res.status(400).send({message: 'Password is too long', error: "password"});
        if (password !== password2) return res.status(400).send({message: 'Passwords does not match', error: "password"});
        if (Object.keys(req.body).length > 4) return res.status(400).send({message: 'Object has too much keys', error: true});

        next()
    },

    validateLogin: async function (req, res, next) {

        const {email, username, password} = req.body;
        const userExists = await userDb.findOne({email, username});

        if (!email) return res.status(400).send({message: 'Email is required', error: "email"});
        if (!username) return res.status(400).send({message: 'Username is required', error: "username"});
        if (!password) return res.status(400).send({message: 'Password is required', error: "password"});
        if (!userExists) return res.send({message: 'User does not exists', error: "all" });

        next()
    },

    validateUsername: async function (req, res, next) {
        const{username} = req.body;
        const userNameExists = await userDb.findOne({username})

        if (userNameExists) return res.send({message: 'Username already exist', alert: 'Username'});
        if (!username) return res.status(400).send({message: 'Username is required', alert: "Username"});
        if (username[0]!== username[0].toUpperCase()) return res.status(400).send({message: 'Username should start with upper letter', alert: "Username"});
        if (username.length < 4) return res.status(400).send({message: 'Username must have at least 4 characters', alert: "Username"});
        if (username.length > 20) return res.status(400).send({message: 'Username is too long', alert: "Username"});
        next()
    },

    validatePassword: function (req, res, next) {
        const { password } = req.body;
        if (!password) return res.status(400).send({message: 'Password is required', alert: "Password"});
        if (password.length < 5) return res.status(400).send({message: 'Password must have at least 5 characters', alert: "Password"});
        if (password.length > 20) return res.status(400).send({message: 'Password is too long', alert: "Password"});
        next()
    },

    validateNewPost: async function (req, res, next) {
        const {title, postImage, description, time} = req.body;

        if (!title) return res.status(400).send({message: 'Title is required', alert: "Title"});
        if (title.length < 5) return res.status(400).send({message: 'Title must have at least 5 characters', alert: "Title"});
        if (title.length > 55) return res.status(400).send({message: 'Title is too long', alert: "Title"});
        if (!postImage) return res.status(400).send({message: 'Image is required', alert: "Image"});
        if (!description) return res.status(400).send({message: 'Description is required', alert: "Description"});
        if (description.length < 50) return res.status(400).send({message: 'Description must have at least 50 characters', alert: "Description"});
        if (description.length > 1000) return res.status(400).send({message: 'Description is too long', alert: "Description"});
        next()
    }

}