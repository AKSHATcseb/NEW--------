const express = require("express") ;
const router = express.Router() ;
const isloggedin = require("../middlewares/isLoggedIn");
const { bookRide, cancelRide, offerRide, reviewRide } = require("../controllers/rideController");


router.get("/", function (req, res) {
res.send("hey rides route is working");
});


router.post("/bookRide", bookRide);
// router.post("/cancelRide",cancelRide);
router.post("/offerRide", offerRide);
router.post("/:rideId/review", reviewRide);



module.exports = router;

