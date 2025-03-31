const mongoose = require('mongoose')
const Schema = mongoose.Schema


const commentDb = new Schema({
    postId: {
        type: String,
        required: true,
    },
    comments: {
        type: Array,
        required: true,
    }

});

const comments = mongoose.model('comments', commentDb);

module.exports = comments;