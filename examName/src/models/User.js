const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required!'],
        minlength: [5, 'Should be at least 5 characters'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        minlength: [10, 'Should be at least 10 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;