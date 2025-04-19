const express = require("express") ;
const router = express.Router() ;
const isloggedin = require("../middlewares/isLoggedIn");
const {registerUser, loginUser, userProfile, logout, reviewApp, complaint} = require("../controllers/userController");


router.get('/', (req, res) => {
    res.render("user");
});



router.get('/register', (req, res) => {
    res.render("register"); 
});
router.post("/register", registerUser);

router.get('/login', (req, res) => {
    res.render("login"); 
});
router.post("/login", loginUser);

router.get('/profile', (req, res) => {
    res.render("profile"); 
});
router.post("/profile", userProfile);

router.get("/appReview", (req, res) => {
    res.render("appFeedback");
})
router.post("/appReview", reviewApp);

router.get("/complaint", (req, res) => {
    res.render("complaint");
});
router.post("/complaint", complaint);

router.get("/logout", logout);

module.exports = router;

