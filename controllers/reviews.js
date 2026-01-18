const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createreview = async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();

    req.flash("success", "Review Added Successfully");

    res.redirect(`/listings/${listing.id}`);
}


module.exports.deletereview = async (req, res) => {
    let { id, reviewid } = req.params;
    let listing = await Listing.findById(id)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted Successfully");

    res.redirect(`/listings/${id}`);
}