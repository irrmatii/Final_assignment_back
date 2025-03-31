const mongoose = require('mongoose')
const Schema = mongoose.Schema


const messageDb = new Schema({
    username: {
        type: String,
        required: true,
    },
    chats: [
        {
            username: String,
            messages: [
                {
                    from: String,
                    to: String,
                    message: String,
                    date: String,
                    image: String
                }
            ]
        }
    ]
});

const message = mongoose.model('messages', messageDb);

module.exports = message;