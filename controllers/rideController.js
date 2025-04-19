const rideModel = require("../models/ride_model");
const offerRideModel = require("../models/offer_rides_model");
const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const isLoggedIn = require("../middlewares/isLoggedIn");


const bookRide = async function (req, res) {
    try {
        const { email, origin, destination, date, time } = req.body;

        // 1. Get the logged-in user's ID
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send("You are not registered");

        const availableRides = await offerRideModel.find({ origin, destination, date, time });

        if (availableRides.length == 0) return res.status(401).send("No ride is available for this route");

        const bookedRide = availableRides[0];
        const bookedRideId = bookedRide._id;

        const alreadyBooked = user.recentRides.some(
            rideId => rideId.toString() === bookedRideId.toString()
        );


        if (alreadyBooked) {
            return res.status(401).send("Cannot Book same ride again");
        }

        if (bookedRide.bookings >= 4) {
            return res.status(401).send("No space available");
        }

        const newRide = new rideModel({
            passengerName: [user.fullname],
            driverName: bookedRide.driverName,
            date,
            origin,
            destination,
            fare: bookedRide.fare,
            time,
            bookings: bookedRide.bookings + 1
        });

        bookedRide.bookings += 1;
        if (bookedRide.bookings >= 4) {
            bookedRide.status = "Full";
        }
        await bookedRide.save();

        await newRide.save();
        user.recentRides.push(bookedRide);
        await user.save();

        res.status(200).send("Ride successfully booked");
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).send("Something went wrong during ride booking");
    }
};


const offerRide = async function (req, res) {
    console.log("offer ride working");

    try {
        const { newEmail, newOrigin, newDestination, newFare, newDate, newTime } = req.body;

        const user = await userModel.findOne({ email: newEmail });
        if (!user) return res.status(401).send("You are not registered");

        // Get all rides offered by this email
        const existingRides = await offerRideModel.find({ email: newEmail });

        const isDuplicate = existingRides.some(ride =>
            (ride.origin === newOrigin &&
                ride.destination === newDestination &&
                ride.date === newDate &&
                ride.time === newTime) ||
            (ride.date === newDate && ride.time === newTime)
        );

        if (isDuplicate) {
            return res.status(400).json({ message: "You cannot offer this ride again (same route/time conflict)" });
        }

        // Create a new ride
        const newOfferedRide = new offerRideModel({
            email: newEmail,
            origin: newOrigin,
            destination: newDestination,
            fare: newFare,
            date: newDate,
            time: newTime
        });

        await newOfferedRide.save();
        res.status(201).json({ message: "Ride successfully offered", ride: newOfferedRide });

    } catch (err) {
        console.error("Error offering ride:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const reviewRide = async function (req, res) {

    try {

        const { rideId } = req.params;
        const { passengerEmail, rating, comment } = req.body;

        const user = await userModel.findOne({ email: passengerEmail });
        if (!user) return res.status(401).send("Invalid user");

        const ride = await offerRideModel.findById(rideId);
        if (!ride) return res.status(404).send("Ride not found");

        const findRide = user.recentRides.some(
            userRideId => userRideId.toString() === rideId.toString());
        if (!findRide) {
            return res.status(401).send("You have not booked this ride");
        }

        const alreadyReviewed = ride.reviews.some(r => r.passengerEmail === passengerEmail);
        if (alreadyReviewed) return res.status(400).send("You have already reviewed this ride");

        ride.reviews.push({ passengerEmail, rating, comment });
        await ride.save();

        res.status(200).send("Review submitted successfully");
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).send("Internal server error");
    }
};


module.exports = {
    bookRide,
    // cancelRide,
    offerRide,
    reviewRide
};

