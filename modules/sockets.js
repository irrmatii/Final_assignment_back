const {Server} = require('socket.io')
const functions = require('./functions')

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    socket.on('login', (username) => {

        const user = {
            username: username,
            id: socket.id,
        };

        functions.addUser(user);

        const users = functions.getUsers();

        io.emit('login',users)
        console.log("Received new user", user)
        console.log("All online users", users)
    })
    socket.on('disconnected',()=> {

        const users = functions.getUsers();
        const deletedUser = users.filter(user => user.id !== socket.id)

        functions.updateUser(deletedUser)

        io.emit('disconnected', deletedUser)
        console.log("LogOut users", deletedUser)
    })

})


module.exports = io