const express = require("express");
const app = express();
const mongoose= require("mongoose");
const listing= require("./models/listing.js");
const path = require("path");
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main(). then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({ extended: true}));
app.use(methodOverride("_method"));

app.get("/", (req,res)=>{
    res.send("Hi I am root");
})

app.get("/listings", async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index", { alllistings });
})

//New Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new");
});

//Create Toute
app.post("/listings", async(req,res)=>{
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit Route
app.get('/listing/:id/edit', async (req,res)=>{
    const {id} = req.params;
    const listings = await listing.findById(id);
    res.render("listings/edit" , { listings });
});

//Update Route
app.put("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Show Route
app.get("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const listings = await listing.findById(id);
    res.render("listings/show" , { listings });
})

//Delete route
app.delete("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const deletedlistings = await listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    res.redirect("/listings");
})

app.listen(8080, ()=>{
    console.log("Server is listening to port");
})