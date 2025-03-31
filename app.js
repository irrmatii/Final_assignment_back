require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const mainRouter = require('./router/routes.js');
const mongoose = require('mongoose')

const sockets = require('./modules/sockets')
sockets.listen(3001);

app.use(express.json());
app.use(cors({
}));
app.use('/', mainRouter)

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.log(err)
    });

app.listen(8001);
console.log('Server started on port 8001');







