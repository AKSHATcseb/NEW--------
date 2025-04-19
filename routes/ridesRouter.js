const express = require("express") ;
const router = express.Router() ;
const isloggedin = require("../middlewares/isLoggedIn");
const { bookRide, cancelRide, offerRide, reviewRide } = require("../controllers/rideController");


router.get("/", function (req, res) {
res.send("hey rides route is working");
});


router.get("/bookRide", (req, res) => {
    res.render("bookRide");
})
router.post("/bookRide", bookRide);

router.get("/offerRide", (req, res) => {
    res.render("offerRide");
})
router.post("/offerRide", offerRide);

// router.get("//:rideId/review", (req, res) => {
    
// })
router.post("/:rideId/review", reviewRide);



// router.post("/cancelRide",cancelRide);
module.exports = router;

