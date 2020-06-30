const {Schema,model}=require('mongoose');

const userSchema=new Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    profilePic: {
        type: String,
        default: '/uploads/default.jpg'
    }
},{
    timestamps:true
});

const User = model('User',userSchema)
module.exports=User