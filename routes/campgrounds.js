const express = require("express");
const router = express.Router();
const catchAsync = require("../errorClass/catchAsync");
const campgroundController = require("../controller/campgrouds")
const { isAuthenticated, isOwner } = require("../middleware")
const multer = require('multer')
const { storage } = require("../cloudinary/cloudinary")
const upload = multer({ storage })

router.use(express.json());
router.use(express.urlencoded())
router.get('/', catchAsync(campgroundController.renderAllCamp))
router.route("/add")
    .get(isAuthenticated, campgroundController.renderAddCampForm)
    .post(isAuthenticated, upload.array('photoCamp'), catchAsync(campgroundController.postAddCamp))
router.route("/:id")
    .get(catchAsync(campgroundController.renderOneCamp))
    .delete(isAuthenticated, isOwner, catchAsync(campgroundController.deleteCamp))
    .patch(isAuthenticated, upload.array('photoCamp'), isOwner, catchAsync(campgroundController.patchEditCamp))


router.get("/:id/edit", isAuthenticated, isOwner, catchAsync(campgroundController.renderEditCamp))


module.exports = router;