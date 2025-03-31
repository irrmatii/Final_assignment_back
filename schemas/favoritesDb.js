const mongoose = require('mongoose')
const Schema = mongoose.Schema


const favoritesDb = new Schema({
    username: {
        type: String,
        required: true,
    },
    favorites: {
        type: Array,
        required: true,
    }

});

const favorites = mongoose.model('favorites', favoritesDb);

module.exports = favorites;