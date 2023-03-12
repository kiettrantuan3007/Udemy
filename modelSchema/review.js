const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: String,
    rate: Number,
    name: String,
    body: String,
    date: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campgrounds"
    }
});
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;