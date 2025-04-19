const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const rideSchema = new mongoose.Schema({
    driverName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    passengerName :{
        type: Array,
        default: []
    },
    date: String,
    origin : {
        type: String,
        required: true
    },
    destination : {
        type: String,
        required: true
    },
    fare : {
        type: Number,
        required: true
    },
    time: String,
    status: {
        type: String,
        default: "Available",
    },
    bookings:
    {
        type: Number,
        default: 0
    },
    bookedAt: { type: Date, default: Date.now }
});

const rideModel = mongoose.model('ride', rideSchema);
module.exports = rideModel;
