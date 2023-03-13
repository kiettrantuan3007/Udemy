const User = require("../modelSchema/user");

module.exports.renderRegisterForm = async (req, res) => {
    res.render("user/register")
}
module.exports.renderLoginForm = async (req, res) => {
    req.session.returnUrl = req.originalUrl;
    res.render("user/login");
}

module.exports.postLogin = async (req, res) => {
    console.log(res.locals.returnURL)
    const returnURL = res.locals.lastURL || "/campgrounds";
    res.redirect(returnURL);
}

module.exports.getLogout = (req, res) => {
    req.logout(() => {
        req.flash("success", "Goodbye, see you soon")
        res.redirect("/campgrounds")
    });
}

module.exports.postCreateUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email: email, username: username });
        const fullUser = await User.register(user, password);
        req.login(fullUser, (e) => {
            if (e) return next(e)
            else {
                req.flash("success", "Create user successfully")
                res.redirect("/campgrounds");
            }
        })

    } catch (e) {
        req.flash("error", e.toString());
        res.redirect("/user/register");
    }
}