const express = require("express") ;
const router = express.Router() ;
const { indexPage } = require("../controllers/indexController");

router.get("/", (req, res) => {
    res.render("index");
});

module.exports = router;