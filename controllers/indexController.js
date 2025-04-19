const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const isLoggedIn = require("../middlewares/isLoggedIn");
// const index = require("../views/index");


const indexPage = async function(req, res) {
    res.render("user_test");
}

module.exports = {
    indexPage
};