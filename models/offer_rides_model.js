const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const offerRideSchema = new mongoose.Schema({
    driverName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    passengerName : {
        type: Array,
        default: []
    },
    passengerEmail : {
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
        // required: true
    },
    bookings:
    {
        type: Number,
        default: 0,
    },
    reviews: [
        {
          passengerEmail: String,
          rating: { type: Number, min: 1, max: 5 },
          comment: String,
          createdAt: { type: Date, default: Date.now }
        }
      ]
});

const offerRideModel = mongoose.model('offer_ride', offerRideSchema);
module.exports = offerRideModel;
