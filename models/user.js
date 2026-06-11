import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "customer"
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        type: String,
        required: false,
        default: "https://th.bing.com/th/id/R.8db9e772b0e4ef1a56cccf6bfc57c44b?rik=3e%2fMoYGK5iMxzg&pid=ImgRaw&r=0"
    }

})

const User = mongoose.model("users", userSchema);

export default User;