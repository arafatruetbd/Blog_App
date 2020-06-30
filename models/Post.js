const {Schema,model}=require('mongoose');
const Comment = require('./Comments');

const postSchema=new Schema({
    tittle:{
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    body:{
        type:String,
        trim: true,  
    },
    author: {
    type: Schema.Types.ObjectId,
     ref: 'User',
     required: true
    },
    tags: {
     type: [String],
     required: true
    },
    thumbnail: String,
    readTime: String,

    likes: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User' 

        }
    ],
    dislikes: [  {
        type: Schema.Types.ObjectId,
        ref: 'User' 

        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: Comment
        }
    ]
},
{
    timestamps:true
})
postSchema.index({tittle: `text`, tags: `text`, body: `text`})


const Post = model('Post',postSchema);
module.exports= Post;