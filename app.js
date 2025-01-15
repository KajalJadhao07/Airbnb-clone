//Import modules
const express = require("express");
const app = express();
const mongoose= require("mongoose");
const path = require("path");
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 30;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); 
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


// MongoDB Connection
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
app.engine('ejs', ejsMate);

//middlewares
app.use(express.urlencoded ({ extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))

app.use("/listings" , listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req,res,next)=>{
    next(new ExpressError(404 , "Page not Found!"));
});

app.use((err,req,res,next)=>{
    console.log(err);  // Log the error for debugging purposes
    console.error(err.stack);
    let { statusCode = 500 , message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });    
})

app.listen(8080, ()=>{
    console.log("Server is listening to port");
})