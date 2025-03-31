const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { faker } = require("@faker-js/faker");

const postDb = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const post = mongoose.model('posts', postDb);

// Default Posts
const defaultPosts = [
    {
        title: "Coffee: The Lifeblood of Every Morning",
        postImage: "https://foolproofliving.com/wp-content/uploads/2014/03/24-2775-post/How-to-make-Turkish-Coffee-FB.jpg",
        description: "It’s 7 AM. You’re tired. You stumble to the kitchen, eyes barely open. Then you make the perfect cup of coffee—ah, bliss. Suddenly, you feel like you can conquer the world. But here’s the twist: That first sip may just be the best moment of your entire day. So, who really needs to do anything else but drink coffee? (Spoiler alert: You still need to get dressed).",
        time: new Date().toISOString().split('T').join(' ').split('.')[0],
        username: "Admin",
        image: "https://imgcdn.stablediffusionweb.com/2024/3/31/a1fd1cbf-348a-4603-8f2a-a8313b5be708.jpg"
    },
    {
        title: "The Cat’s Guide to Napping Like a Pro",
        postImage: "https://t4.ftcdn.net/jpg/09/71/65/69/360_F_971656927_HMdcQ63VAbxL79Z9iLUS2OldOkh7rwdj.jpg",
        description: "Cats are the undisputed champions of napping. They can sleep up to 16 hours a day and still manage to maintain their elegance and mystery. Their secret? Perfect timing, a comfy spot, and an ability to fully embrace relaxation. Want to master the art of napping? Follow the cat’s lead: find a quiet spot, stretch out, and let the world fade away. Remember, the more you nap, the more energized you’ll be—just like your cat!",
        time: new Date().toISOString().split('T').join(' ').split('.')[0],
        username: "Admin",
        image: "https://imgcdn.stablediffusionweb.com/2024/3/31/a1fd1cbf-348a-4603-8f2a-a8313b5be708.jpg"

    },
    {
        title: "Cooking at Home: Expectations vs. Reality",
        postImage: "https://www.helpguide.org/wp-content/uploads/2023/02/Cooking-at-Home-1200x800.jpeg",
        description: "You watch a cooking tutorial, feeling inspired and ready to tackle the kitchen. The expectations? A delicious, Instagram-worthy meal. The reality? You’ve got flour in your hair, the oven timer went off 10 minutes ago, and the recipe you followed looks more like a mystery casserole. But hey, you’re learning, right? And at least there’s a takeaway: Maybe just stick to ordering takeout next time.",
        time: new Date().toISOString().split('T').join(' ').split('.')[0],
        username: "Admin",
        image: "https://imgcdn.stablediffusionweb.com/2024/3/31/a1fd1cbf-348a-4603-8f2a-a8313b5be708.jpg"

    }
];


const initializeDatabase = async () => {

    const count = await post.countDocuments();
    if (count === 0) {
        await post.insertMany(defaultPosts);
        console.log("Default posts added to the database!");
    } else {
        console.log("Posts already exist.");
    }
};
initializeDatabase();

module.exports = post;