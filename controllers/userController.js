const userModel = require("../models/user_model");
const rideModel = require("../models/ride_model");
const appReviewModel = require("../models/app_review_model");
const complaintModel = require("../models/complaint_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const { isMatch } = require("picomatch");

const registerUser = async function (req, res) {
    try {
        const { fullname, email, password } = req.body;

        const user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send("You already registered , You must login");

        if (!fullname || !email || !password) {
            return res.status(400).send("All fields required");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            fullname,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.redirect("/users");
        return res.status(200).send("Registered Successfully");
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send("Something went wrong during registration");
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send("Missing credentials");

        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send("Email or password incorrect");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send("Email or password incorrect");

        // Set a dummy cookie (in production, use JWT)
        const token = "fake-jwt-token";
        res.cookie("token", token, { httpOnly: true });

        // Dummy: Fetch recent and offered rides
        const recentRides = await rideModel.find({ userId: user._id }).sort({ date: -1 }).limit(5);
        const offeredRides = await rideModel.find({ offeredBy: user._id });

        // Show profile page with user data
        return res.render("profile", {
            user,
            recentRides,
            offeredRides
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Internal Server Error");
    }
};



// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) return res.status(400).send("Missing credentials");

//         const user = await userModel.findOne({ email });
//         if (!user) return res.status(401).send("Email or password incorrect");

//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log("Do passwords match?", isMatch);

//         if (!isMatch) return res.status(401).send("Email or password incorrect");

//         // Fake token generation for example
//         const token = "fake-jwt-token";
//         res.cookie("token", token, { httpOnly: true });
//         return res.send("You are logged in");
//     } catch (err) {
//         console.error("Login error:", err);
//         res.status(500).send("Internal Server Error");
//     }
// };


const userProfile = async (req, res, next) => {
    // try {
    //     const { email } = req.body;
    //     if (!email) {
    //         return res.status(400).json({ message: 'Email required.' });
    //     }

    //     // Don't use .lean() here to make sure password is included
    //     const user = await userModel.findOne({ email });
    //     if (!user) {
    //         return res.status(401).json({ message: 'Invalid email' });
    //     }

    //     const recentRides = await rideModel.find({ user: user._id })
    //         .sort({ createdAt: -1 })
    //         .limit(5)
    //         .lean();

    //     res.json({
    //         fullname: user.fullname,
    //         email: user.email,
    //         recentRides,
    //     });
    // } catch (error) {
    //     console.error('Profile error:', error);
    //     res.status(500).json({ message: 'Server error.' });
    // }


    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.render('user_profile', { user: null, message: "User not found" });
        }

        const recentRides = await rideModel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.render('user_profile', {
            user: {
                fullname: user.fullname,
                email: user.email,
                recentRides
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('user_profile', { user: null, message: "Server error" });
    }


};


const logout = async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
};


const reviewApp = async function (req, res) {
    try {
        const { email, rating, feedback } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send("Invalid user");

        const newReview = new appReviewModel({
            email,
            rating,
            feedback
        });

        await newReview.save();
        res.send("review taken successfully");
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send("Error in reviewing");
    }
};


const complaint = async function (req, res) {
    try{
        const {email, rideId, complaint} = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send("Invalid user");

        const findRide = user.recentRides.some(
            userRideId => userRideId.toString() === rideId.toString());
        if (!findRide) {
            return res.status(401).send("You have not booked this ride or ride do not exist");
        }

        const newComplaint = new complaintModel({
            email,
            rideId,
            complaint
        })

        await newComplaint.save();
        res.send("complaint booked successfully");
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send("Error in registering complaint");
    }
};

module.exports = {
    registerUser,
    loginUser,
    userProfile,
    logout,
    reviewApp,
    complaint
};