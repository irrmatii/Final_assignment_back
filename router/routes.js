const express = require('express');
const router = express.Router();


const {
    register,
    logIn, getAllPosts, getSinglePost, getMessages, sendMessage, getUsers, updateEmail, updateUsername,
    updateImage, confirmPassword, updatePassword, createPost, addToFavorites, getFavorites, addComment, getOnlineUser,
    getSingleUser, getUserPosts, deletePost
} = require('../controllers/mainController')

const {
    validateRegister,
    validateLogin, validateUsername, validatePassword, validateNewPost
} = require('../middleware/validators')

const userAuth = require('../middleware/userAuth')



router.post('/register', validateRegister, register);
router.post('/logIn', validateLogin, logIn);
router.get('/AllPosts', getAllPosts);
router.get('/posts/:id', getSinglePost);
router.post('/deletePost', userAuth, deletePost);
router.post('/addComment', userAuth, addComment);
router.post('/createPost', userAuth, validateNewPost, createPost);
router.get('/allUsers', getUsers);
router.post('/message', sendMessage);
router.get('/message', userAuth, getMessages);
router.get('/userInfo', userAuth, getOnlineUser);
router.post('/updateEmail', userAuth, updateEmail);
router.post('/updateUsername', userAuth, validateUsername, updateUsername);
router.post('/updateImage', userAuth, updateImage);
router.post('/confirmPassword', userAuth, confirmPassword);
router.post('/updatePassword', userAuth, validatePassword, updatePassword);
router.post('/favoritesPosts', userAuth, addToFavorites);
router.get('/favoritesPosts', userAuth, getFavorites);
router.get('/users/:username', userAuth, getSingleUser);
router.post('/userPosts', getUserPosts);




module.exports = router;