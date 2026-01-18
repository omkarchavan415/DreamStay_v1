const Listing = require("./models/listing")
const Review = require("./models/review")

const expresserror = require("./utils/expresserror.js");
const { listingschema, reviewschema } = require("./schema.js");


module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};



module.exports.saveredirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validatelisting = (req, res, next) => {
    let { err } = listingschema.validate(req.body);

    if (err) {
        let errmsg = err.details.map((el) => el.message).join(",");
        throw new expresserror(400, errmsg);
    }
    else {
        next();
    }
}


module.exports.validatereview = (req, res, next) => {
    let { err } = reviewschema.validate(req.body);

    if (err) {
        let errmsg = err.details.map((el) => el.message).join(",");
        throw new expresserror(400, errmsg);
    }
    else {
        next();
    }
}


module.exports.isreviewauthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);

    if (!review.author._id.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
