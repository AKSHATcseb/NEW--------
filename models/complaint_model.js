const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const complaintSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    rideId: {
        type: String,
        require: true
    },
    complaint: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now 
    }
})

const complaintModel = mongoose.model('complaint', complaintSchema);

module.exports = complaintModel;