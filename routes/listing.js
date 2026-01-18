const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isloggedin, isowner, validatelisting } = require("../middleware.js")
const { validatereview } = require("../middleware.js")
const listingcontroller = require("../controllers/listings.js")
const multer = require("multer");
const { storage } = require("../clouldconfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapasync(listingcontroller.index))
    .post(isloggedin,
        upload.single("listing[image]"),
        validatelisting,
        wrapasync(listingcontroller.createlistings)
    );



//new route
router.get("/new", isloggedin, listingcontroller.rendernewform);

router.route("/:id")
    .get(wrapasync(listingcontroller.showlisting))
    .put(isloggedin, isowner,
        upload.single("listing[image]"),
        validatelisting, wrapasync(listingcontroller.updatelisting))
    .delete(isloggedin, isowner, wrapasync(listingcontroller.deletelistings));


//index route


//show route




//create route

//edit route
router.get("/:id/edit", isloggedin, isowner, wrapasync(listingcontroller.rendereditform));

//update route

//delete route


module.exports = router;