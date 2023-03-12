// import module 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}



const express = require("express");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const engine = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport')
const app = express();
const methodOverride = require('method-override')
const catchAsync = require("./errorClass/catchAsync");
const path = require("path");
const Joi = require("joi");
const mongoose = require("mongoose");
const User = require('./modelSchema/user');
const campground = require("./routes/campgrounds")
const review = require("./routes/review")
const userRoute = require("./routes/user")
const LocalStrategy = require('passport-local')
const { storeLastURL, isAuthenticated } = require("./middleware")

const mongoAtlasConnect = `mongodb+srv://kiettrantuan3007:${process.env.PASS_MONGODB}@cluster0.69bswcq.mongodb.net/?retryWrites=true&w=majority`

var store = new MongoDBStore({
    // uri: 'mongodb://127.0.0.1:27017/test',
    uri: mongoAtlasConnect,
    collection: 'mySessions'
});

mongoose.connect(mongoAtlasConnect)
// mongoose.connect('mongodb://127.0.0.1:27017/test')

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"))

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded())
app.use(methodOverride('X-Method-Override'))
app.use(methodOverride('_method'))

app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));



app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.returnURL = req.session.returnUrl;
    res.locals.lastURL = req.session.lastURL;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.errorFlash = req.flash("error");
    next();
})

store.on('error', function (error) {
    console.log(error)
});

app.use(storeLastURL);
app.use("/campgrounds", campground);
app.use("/campgrounds/:id/review", review);
app.use("/user", userRoute)

app.get("/", (req, res) => {
    res.render("home");
})

app.all("*", (err, req, res, next) => {
    res.send("404 ERROR");
    next(err);
})

app.use((err, req, res, next) => {
    res.render("error", { error: err });
})

app.listen(3000, () => {
    console.log("SEVER OPEN AT PORT 3000")
})