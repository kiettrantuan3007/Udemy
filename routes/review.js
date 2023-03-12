const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../errorClass/catchAsync");

router.use(express.json());
router.use(express.urlencoded())

const reviewController = require("../controller/review")
const { storeLastURL, isAuthenticated, isReviewCreater } = require("../middleware")

router.post("/add", isAuthenticated, catchAsync(reviewController.postAddComment))
router.delete("/:reviewID", isAuthenticated, isReviewCreater, catchAsync(reviewController.deleteComment))

module.exports = router