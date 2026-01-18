const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const { reviewschema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const { validatereview, isloggedin, isreviewauthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js")
//Reviews
//Post review route
router.post("/", isloggedin, validatereview, wrapasync(reviewcontroller.createreview))

//delete review route
router.delete("/:reviewid", isloggedin, isreviewauthor, wrapasync(reviewcontroller.deletereview))

module.exports = router;