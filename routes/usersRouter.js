const express = require("express") ;
const router = express.Router() ;
const isloggedin = require("../middlewares/isLoggedIn");
const {registerUser, loginUser, userProfile, logout, reviewApp, complaint} = require("../controllers/userController");


router.get("/", function (req, res) {
res.send("hey user route is working");
});

// issme try karna ye feature ke jab tak user saare info. nahi deta tab tak user register naa ho sake
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", userProfile);
router.get("/logout", logout);
router.post("/appReview", reviewApp);
router.post("/complaint", complaint);


module.exports = router;

