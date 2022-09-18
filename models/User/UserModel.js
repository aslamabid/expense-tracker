import mongoose from "mongoose";

const User = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    }
}, { timestamps: true });

export default mongoose.model('User', User, 'users');