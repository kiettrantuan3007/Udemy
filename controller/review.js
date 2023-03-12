const Campgrounds = require('../modelSchema/campgrounds')
const Review = require('../modelSchema/review')
const joiReviewSchema = require("../joiSchema/review");
const expressError = require("../errorClass/expressError");

module.exports.postAddComment = async (req, res) => {
    const id = req.params.id;
    let { name, body, date, title, rating } = req.body;

    const dateNow = new Date(Date.now())
    const reviewDate = dateNow.getDate() + "/" + (dateNow.getMonth() + 1);

    if (!res.locals.currentUser) {
        req.flash("error", "You need to log in or input name as anonymous!!!")
        return res.redirect(`/campgrounds/${id}`);
    } else {
        name = res.locals.currentUser.username;
        date = reviewDate;
    }

    dataValidate = {
        title: title,
        name: name,
        body: body,
        date: date,
        rating: rating
    }

    if (joiReviewSchema
        .validate(dataValidate).error) throw new expressError(joiReviewSchema
            .validate(dataValidate).error.details[0].message, "404");
    const newComment = new Review({
        ...dataValidate,

        author: res.locals.currentUser.id
    });
    const campgroundFound = await Campgrounds.findById(id);
    campgroundFound.review.push(newComment);
    await newComment.save();
    await campgroundFound.save();
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campgrounds.findByIdAndUpdate(id, {
        $pull: {
            review: reviewID
        }
    })

    await Review.findByIdAndRemove(reviewID)
    res.redirect(`/campgrounds/${id}`)
}