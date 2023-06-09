const { func } = require("joi");
const Campgrounds = require("./modelSchema/campgrounds")
const Review = require("./modelSchema/review")
module.exports.isAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl;
        req.flash("error", "You must login first!!!!!")
        res.redirect("/user/login");
    }
    else {
        next()
    }
}

module.exports.isOwner = async function (req, res, next) {
    const currentUserID = res.locals.currentUser.id;
    const { id } = req.params;
    const foundCamp = await Campgrounds.findById(id);
    if (foundCamp) {
        if (foundCamp.author == currentUserID)
            return next();
    }

    req.flash("error", "You dont have permission!!!!!")
    res.redirect("/campgrounds");
}
module.exports.isReviewCreater = async function (req, res, next) {
    const currentUserID = res.locals.currentUser.id;
    const { id, reviewID } = req.params;

    const foundReview = await Review.findById(reviewID);
    if (foundReview) {
        if (foundReview.author == currentUserID)
            return next();
    }

    req.flash("error", "You dont have permission!!!!!")
    res.redirect("/campgrounds");
}


module.exports.storeLastURL = function (req, res, next) {
    if (req.originalUrl == "/user/login") return next();
    if (req.originalUrl.includes(".")) return next();
    req.session.lastURL = req.originalUrl;
    next()
}
