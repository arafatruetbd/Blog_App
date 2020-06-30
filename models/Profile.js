const {Schema,model}=require('mongoose');
const Post = require('./Post');

const profileSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    tittle:{
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    bio:{
        type:String,
        trim: true,
        maxlength: 500,
        required: true
        
    },
    profilePic: String,
    links:{
        website: String,
        facebook: String,
        twitter: String,
        github: String
    },
     posts: [

    {
    type: Schema.Types.ObjectId,
    ref: Post
    }
],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: Post
        }
    ]
},
{
    timestamps:true
});

const Profile = model('Profile',profileSchema);
module.exports= Profile;