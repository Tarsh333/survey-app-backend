import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    userLevel:{
        type:Number,
        default:0
    },
    following:{
        type:[mongoose.Schema.Types.ObjectId]
    }
});

const User = mongoose.model('user', UserSchema);

export default User;