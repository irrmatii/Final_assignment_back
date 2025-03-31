
let onlineUsers = []

module.exports = {
    profileImages: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB4UE7tTfa0_Ed4q3XE5Qxn3MfrJAZrkbbWQ&s',
        'https://pbs.twimg.com/profile_images/1311008414156423170/Kxu_7mQS_400x400.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQER-VdIdNVf7SGJ8d3DA_FSBueMRYn650Kg&s',
        'https://wallpapers.com/images/hd/funny-discord-profile-pictures-35eno0as8jp53qq7.jpg',
        'https://i.pinimg.com/736x/c4/4b/2d/c44b2d80f866b3ce693236dab085aca5.jpg',
        'https://i.pinimg.com/474x/12/07/f7/1207f701dc572a63a490d7621738a1ec.jpg'
    ],

    addUser: (user) => {
        onlineUsers.push(user)
        return onlineUsers
    },
    getUsers: () => {
        return onlineUsers
    },
    updateUser: (user) => {
        onlineUsers = user
    },
    findUserOnline: (username) => {
        const findUser = onlineUsers.find((user) => user.username === username)
        return !!findUser
    },

    replaceUsername: (oldUsername, newUsername) => {
        onlineUsers = onlineUsers.map(user =>
            user.username === oldUsername ? { ...user, username:newUsername } : user
        );
    },

    randomIndex: () => Math.floor(Math.random() * 6),
};

