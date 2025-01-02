const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/palm-tree-near-seashore-Siuwr3uCir0",
    },
    price: Number,
    location: String,
    country: String
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;

