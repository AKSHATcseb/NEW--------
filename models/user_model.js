const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rideModel = require('./ride_model');
const offerRideModel = require('./offer_rides_model');


const userSchema = new mongoose.Schema({
    image: String,
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    recentRides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ride',
            default: []
        }
    ],
    offeredRides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'offer_ride',
            default: []
        }
    ]
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;