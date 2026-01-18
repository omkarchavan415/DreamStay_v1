const User = require("../models/user")


module.exports.rendersignup = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username })
        const registereduser = await User.register(newuser, password);
        console.log(registereduser);
        req.login(registereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust")
            res.redirect("/listings")
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}

module.exports.renderlogin = (req, res) => {
    res.render("users/login.ejs");

}


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust")
    let redirecturl = res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out now!")
        res.redirect("/listings");
    })
}


