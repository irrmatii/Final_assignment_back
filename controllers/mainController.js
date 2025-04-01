const userDb = require('../schemas/userDb')
const postDb = require('../schemas/postDb')
const messageDb = require('../schemas/messageDb')
const favoritesDb = require('../schemas/favoritesDb')
const commentDb =require('../schemas/commentDb')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const functions = require('../modules/functions')
const io = require("../modules/sockets")

module.exports = {

    register: async (req, res) => {
        const {email, username, password} = req.body;

        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(password, salt);

        const randImage = functions.profileImages[functions.randomIndex()]

        console.log(randImage)

        const user = {
            email: email,
            username: username,
            password : hash,
            image: randImage
        }

        const newUser = new userDb(user);
        await newUser.save()

        const newMsg = new messageDb({username, chats: []});
        await newMsg.save()

        res.send({message: 'User registered successfully'});
    },

    logIn: async (req, res) => {

        const {email, username, password} = req.body;

        const userExists = await userDb.findOne({email, username});

        const comparePassword = await bcrypt.compare(password, userExists.password);
        if (!comparePassword) return res.send({message: 'Incorrect password', error: "password"});

        const token = jwt.sign({ username: username, image: userExists.image }, process.env.SECRET_KEY)

        return res.send({message: 'User logIn successfully', token, user:{username: userExists.username, image: userExists.image, email: userExists.email}});
    },

    getAllPosts: async (req, res) => {
        const allPosts = await postDb.find()
        return res.send(allPosts);
    },

    getSinglePost: async (req, res) => {
        const {id} =req.params;
        const findPost = await postDb.findById(id);
        const allComments = await commentDb.findOne({postId: id})

        return res.send({findPost, allComments});
    },

    addComment: async (req, res) => {
        const {message, postId, date, user} = req.body;

        const comment = {
            username: user.username,
            image: user.image,
            message,
            date,
        }

        const CommentExist = await commentDb.findOne({postId: postId})

        if (!CommentExist) {
            const newComment = new commentDb({ postId: postId, comments: [comment] });
            await newComment.save()
        } else {
            const findComment = await commentDb.findOneAndUpdate({postId: postId}, {$push: { comments: comment}},  { new: true })
        }

        const allComments = await commentDb.findOne({postId: postId})

        io.sockets.emit('newComment', allComments)
        res.send({message: 'Comment added successfully',})
    },

    sendMessage: async (req, res) => {

        const {from, to, message } = req.body

        if (!message) return;

        const findChat = await messageDb.findOne({username: from, 'chats.username': to})

        if (!findChat) {
            const createChat = await  messageDb.findOneAndUpdate({username: from}, {$push: {chats: {username:to, messages: [req.body]}}})
            const createChat2 = await messageDb.findOneAndUpdate({username: to}, {$push: {chats: {username:from, messages: [req.body]}}})
        } else {
            const pushMessage = await  messageDb.findOneAndUpdate({username: from, 'chats.username': to}, {$push: {"chats.$.messages": req.body}})
            const pushMessage2 = await messageDb.findOneAndUpdate({username: to, 'chats.username': from}, {$push: {"chats.$.messages": req.body}})
        }

        const IsUserOnline = functions.findUserOnline(to)

        const allMessages = await messageDb.findOne({username: from, 'chats.username': to})
        const allMessages2 = await messageDb.findOne({username: to, 'chats.username': from})

        if (IsUserOnline) {
            const findUser = await functions.getUsers().find(user => user.username === to)
            console.log("Online user TO founded:" + findUser)
            io.to(findUser.id).emit('newMessage', {msg:allMessages2, newMsg: from})
        }

        const findUser = await functions.getUsers().find(user => user.username === from)
        console.log("Online user FROM founded:" + findUser)
        io.to(findUser.id).emit('newMessage', {msg:allMessages, newMsg: ""})
        res.send({message: 'Message was sent'});
    },

    getMessages: async (req, res) => {
        const {user} = req.body;
        const allMessages = await messageDb.findOne({username: user.username})
        res.send(allMessages)
    },

    getUsers: async (req, res) => {
        const allUsers = await userDb.find()
        res.send(allUsers)
    },

    /* ==== PROFILE PAGE ==== */
    getOnlineUser: async (req, res) => {
        const {user} = req.body;
        const findUser = await userDb.findOne({username: user.username})
        console.log("FindUser for profilePage", findUser)
        const userObject = findUser.toObject();
        delete userObject.password;
        res.send(userObject)
    },

    updateEmail: async (req, res) => {
        const {email, user} = req.body;

        console.log("from front email:", email)
        const findUser = await userDb.findOne({username:user.username})
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (findUser.email === email || !email || !pattern.test(email)) {
            console.log("Same email as previous");
            res.send({message: 'Incorrect value', alert: 'Email'})
            return;
        }
        const updateUser = await userDb.findOneAndUpdate({username: user.username}, {$set: {email: email}}, {new: true, projection:{password:0}})
        res.send({message: 'Email updated successfully', alert: 'CorrectEmail', updateUser})
    },

    updateUsername: async (req, res) => {
        const {username, user} = req.body;

        console.log("from front username:", username)

        // ==== Updating messages
        await messageDb.findOneAndUpdate(
            {username: user.username},
            {$set: {username: username}},
            {new: true}
        );
        await messageDb.updateMany(
            {"chats.username": user.username},
            {$set: {"chats.$.username": username}}
        );
        await messageDb.updateMany(
            {},
            {$set: {"chats.$[].messages.$[msg].from": username}},
            { arrayFilters: [
                    { 'msg.from': user.username }],
                new:true }
        );
        await messageDb.updateMany(
            {},
            {$set: {"chats.$[].messages.$[msg].to": username}},
            { arrayFilters: [
                    { 'msg.to': user.username }],
                new: true, }
        );

        // ==== Updating favorites
        await favoritesDb.updateMany({username: user.username}, {$set: {username: username}})
        // ==== Updating posts
        await postDb.updateMany({username: user.username}, {$set: {username: username}})
        // ==== Updating Token
        const token = jwt.sign({ username: username, image: user.image }, process.env.SECRET_KEY)
        // ==== Updating comments
        await commentDb.updateMany({}, {$set: {'comments.$[].username': username}}, {new: true} )

        functions.replaceUsername(user.username, username);

        const updateUser = await userDb.findOneAndUpdate({username: user.username}, {$set: {username: username}}, {new: true, projection:{password:0}})
        res.send({message: 'Username updated successfully', alert: 'CorrectUsername', updateUser, token})
    },

    updateImage: async (req, res) => {
        const {image, user} = req.body;

        const findUser = await userDb.findOne({username:user.username})

        if (findUser.image === image || !image) {
            console.log("Incorrect Image");
            res.send({message: 'Incorrect value', alert: 'Image',})
            return;
        }

        // ==== Updating Messages
        const updateMsgImg = await messageDb.updateMany(
            {},
            {$set: {"chats.$[].messages.$[msg].image": image}},
            { arrayFilters: [
                    { "msg.from": user.username }  // Ensure you're updating messages from the specific user
                ],
                new:true }
        );
        console.log("Image updated in messages:", updateMsgImg);

        // ==== Updating posts
        await postDb.updateMany({username: user.username}, {$set: {image: image}})
        // ==== Updating comments
        await commentDb.updateMany({}, {$set: {'comments.$[].image': image}}, {new: true} )
        // ==== Updating Token
        const token = jwt.sign({ username: user.username, image: image }, process.env.SECRET_KEY)


        const updateUser = await userDb.findOneAndUpdate({username: user.username}, {$set: {image: image}}, {new: true, projection:{password:0}})
        res.send({message: 'Image updated successfully', alert: 'CorrectImage', updateUser, token})
    },

    confirmPassword: async (req, res) => {
        const {password, user} = req.body;

        console.log("from front password:", password)
        const findUser = await userDb.findOne({username:user.username})

        const comparePassword = await bcrypt.compare(password, findUser.password);
        if (!comparePassword) return res.send({message: 'Incorrect password', alert: "Password"});

        res.send({message: 'Password confirmed', alert:'Confirmed'})
    },

    updatePassword: async (req, res) => {
        const {password, user} = req.body;

        console.log("from front NewPassword:", password)
        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(password, salt);

        await userDb.findOneAndUpdate(
            {username: user.username},
            {$set: {password: hash}},
            {new: true, projection:{password:0}}
        );
        res.send({message: 'Password updated successfully', alert: 'CorrectPassword'})
    },

    /* ==== CREATE POST PAGE ==== */
    createPost: async (req, res) => {
        const {title, postImage, description, time, user} = req.body;

        const newPost = {
            title,
            postImage,
            description,
            image: user.image,
            username: user.username,
            time
        }

        console.log("post info from front", newPost)

        const createNewPost = new postDb(newPost);
        await createNewPost.save()

        res.send({message: 'Post created successfully', alert: 'CorrectPost'})
    },

    /* ==== ADD POST TO FAVORITES ==== */
    addToFavorites: async (req, res) => {
        const {id, user} = req.body;

        const FavoriteExists = await favoritesDb.findOne({username: user.username})

        if (!FavoriteExists) {
            const newFavorite = new favoritesDb({ username: user.username, favorites: [id] });
            await newFavorite.save()
        }
        else if(FavoriteExists.favorites.includes(id)){
            await favoritesDb.findOneAndUpdate(
                { username: user.username },
                { $pull: { favorites: id }}
            );
        }
        else {
            await favoritesDb.findOneAndUpdate(
                { username: user.username },
                { $push: { favorites: id }}
            );
        }

        const findFavorite = await favoritesDb.findOne({username: user.username})
        const postId = findFavorite ? findFavorite.favorites : [];
        return res.send({message: 'Added to favorites', postId })
    },

    getFavorites: async (req, res) => {
        const {user} = req.body;

        const favoritePostsId = await favoritesDb.findOne({username: user.username})

        if (!favoritePostsId) {
            return res.send({ postId: [] });
        }

        console.log("favoritePostsId:", favoritePostsId);

        return res.send({ postId: favoritePostsId.favorites || [] })
    },

    getSingleUser: async (req, res) => {
        const {username} = req.params;
        const {user} =req.body

        console.log("params username", username)
        console.log("token User username", user.username)
        let findUser = await userDb.findOne({username: username});
        let profileUser = await userDb.findOne({username: user.username})

        if (findUser){
            const userInfo = {
                username: findUser.username,
                image: findUser.image,
            }
            return res.send(userInfo);
        } else {
            const profileInfo = {
                username: profileUser.username,
                image: profileUser.image,
            }
            return res.send(profileInfo);
        }
    },

    getUserPosts: async (req, res) => {
        const {username} = req.body;
        const userPosts = await postDb.find({username: username})

        return res.send(userPosts)
    },

}




