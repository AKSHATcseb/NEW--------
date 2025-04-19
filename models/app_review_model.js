const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const appReviewSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    rating: { type: Number, min: 1, max: 5 },
    feedback: String,
    date: {
        type: Date,
        default: Date.now 
    }
})

const appReviewModel = mongoose.model('appreview', appReviewSchema);

module.exports = appReviewModel;