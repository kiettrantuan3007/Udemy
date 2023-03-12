const Campgrounds = require('../modelSchema/campgrounds');
const joiCampSchema = require("../joiSchema/campground");
const expressError = require("../errorClass/expressError");
const { cloudinary } = require('../cloudinary/cloudinary');
module.exports.renderAddCampForm = (req, res) => {
    res.render("campgrounds/add");
}

module.exports.renderAllCamp = async (req, res) => {
    const campgrounds = await Campgrounds.find({})
    res.render("campgrounds/showAll", { campgrounds })
}

module.exports.renderOneCamp = async (req, res) => {
    const { id } = req.params;
    if (!id) throw new expressError("Id not found", 404)
    const campground = await Campgrounds.findById(id).populate("review").populate("author");
    const comments = campground.review;
    const authors = campground.author;
    // const geoPosition = campground.geoPosition

    res.render("campgrounds/show", { campground, comments, authors })
}

module.exports.postAddCamp = async (req, res, next) => {
    console.log(req.body)
    const campImage = req.files.map((element) => ({
        url: element.path,
        filename: element.filename
    }))
    const data = req.body;
    data.image = campImage;
    const dataSearchPosition = req.body.location.replaceAll(" ", "%20")
    console.log(dataSearchPosition)
    console.log(process.env.GOOGLE_MAP_API)
    if (req.body.mapPosition == "") {
        const apiKey = `https://maps.googleapis.com/maps/api/geocode/json?address=${dataSearchPosition}&key=${process.env.GOOGLE_MAP_API}`
        console.log(apiKey)
        await fetch(apiKey)
            .then((response) => response.json())
            .then((jsonResponse) => {
                console.log(jsonResponse)
                console.log(jsonResponse.results[0].geometry.location)
                data.mapPosition = jsonResponse.results[0].geometry.location
            });
    }
    data.mapPosition = JSON.parse(data.mapPosition)
    // if (joiCampSchema
    //     .validate(req.body).error) throw new expressError(joiCampSchema
    //         .validate(req.body).error.details[0].message, "404");
    data.author = res.locals.currentUser;
    console.log(data)
    await Campgrounds.insertMany([data]);
    req.flash('success', 'Added successfully');
    res.redirect("/campgrounds");
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const foundCampDelete = await Campgrounds.findById(id);
    foundCampDelete.image.forEach(async (element) => {
        console.log(element.filename)
        await cloudinary.uploader.destroy(element.filename);
    })
    await Campgrounds.findByIdAndDelete(id);
    res.redirect("/campgrounds")
}

module.exports.renderEditCamp = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campgrounds.findById(id);
    res.render("campgrounds/edit", { foundCamp });
}

module.exports.patchEditCamp = async (req, res) => {
    const { id } = req.params;
    const campImage = req.files.map((element) => ({
        url: element.path,
        filename: element.filename
    }))
    if (joiCampSchema
        .validate(req.body).error) throw new expressError(joiCampSchema
            .validate(req.body).error.details[0].message, "404");
    let foundCamp = await Campgrounds.findByIdAndUpdate(id, { ...req.body });
    foundCamp.image.push(...campImage);
    foundCamp.image = foundCamp.image.filter(element => {
        if (req.body.checkbox.indexOf(element.filename) == -1) {
            return element;
        }
    })
    req.body.checkbox.forEach(async element => {
        await cloudinary.uploader.destroy(element);
    })
    await foundCamp.save()
    console.log(foundCamp)
    res.redirect("/")
}