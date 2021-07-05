const mongoose = require('mongoose');

const firstlistSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    added: {
        type: String,
    }
});

mongoose.model('Firstlist', firstlistSchema);