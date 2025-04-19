// package aquiring
const express = require("express");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session")

// path aquiring
const app = express() ;
const path = require("path");


const usersRouter = require("./routes/usersRouter");
const ridesRouter = require("./routes/ridesRouter");

const db = require("./config/mongoose_connection");
require("dotenv").config();

//  Middleware Setup
app.use(express.json());
app. use(express.urlencoded({ extended: true }) );
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session setup
app.use(
    expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_KEY,
    })
);

// setting up base routes 

app.use("/users", usersRouter);
app.use("/rides", ridesRouter);


// app.listen(3000);

module.exports = app;


