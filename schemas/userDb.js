const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userDb = new Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
});

const user = mongoose.model('users', userDb);

module.exports = user;