const mongoose = require("mongoose");
const Review = require("./review");

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})


const CampgroundsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    image: [
        ImageSchema
    ],
    price: Number,
    location: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: [true, "description needed"]
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // geoPosition: {
    //     type: {
    //       type: String, // Don't do `{ location: { type: String } }`
    //       enum: ['Point'], // 'location.type' must be 'Point'

    //     },
    //     coordinates: {
    //       type: [Number],

    //     }
    //   }
    mapPosition: {
        type: Object
    }

});
CampgroundsSchema.post("findOneAndDelete", async function (deleteThing) {
    if (deleteThing) {
        await Review.deleteMany({
            _id: {
                $in: deleteThing.review
            }
        })
    }
})
const Campgrounds = mongoose.model("Campgrounds", CampgroundsSchema);

module.exports = Campgrounds;