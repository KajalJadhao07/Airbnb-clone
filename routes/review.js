const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasyns.js");
const ExpressError = require("../utils/ExpressError.js"); 
const { listingSchema, reviewSchema} = require("../schema.js");
const Review= require("../models/reviews.js");
const Listing= require("../models/listing.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log("Validation error:", error.details); // Log the error to debug
        throw new ExpressError(400, error.details.map(e => e.message).join(", "));
    } else {
        next();
    }
};


router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
}));


//Delete review route
router.delete("/:reviewId", wrapAsync(async( req ,res)=>{
    let {id ,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;