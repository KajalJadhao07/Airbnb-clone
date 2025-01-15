const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasyns.js");
const ExpressError = require("../utils/ExpressError.js"); 
const { listingSchema } = require("../schema.js");
const Listing= require("../models/listing.js");


// Validation Middleware
const validateListing = (req,res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        const message = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400 , message);
    }else{
        next();
    }
}


router.get("/", wrapAsync(async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index", { alllistings });
}));

//New Route
router.get("/new", (req,res)=>{
    res.render("listings/new");
});

//Create Route
router.post("/", validateListing , wrapAsync(async(req,res)=>{
    console.log(req.body);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }
    res.render("listings/edit", { listing });
}));

//Update Route
router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    console.log("Received PUT request for ID:", req.params.id);
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const {id} = req.params;
    const { title, description, price, location, country, image } = req.body.listing;
    await Listing.findByIdAndUpdate(id, { title, description, price, location, country, image }, { new: true });
    res.redirect(`/listings/${id}`);
}));

//Show Route
router.get("/:id", wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id).populate("reviews");
    res.render("listings/show" , { listings });
}));

//Delete route
router.delete("/:id", wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const deletedlistings = await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    res.redirect("/listings");
}));

module.exports= router;
