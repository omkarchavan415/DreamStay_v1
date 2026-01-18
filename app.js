if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const metodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expresserror = require("./utils/expresserror.js");
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const usersRouter = require("./routes/user.js")
const dburl = process.env.ATLASTDBURL


main().then(() => {
  console.log("connected to DB")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);

}

app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(metodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})


store.on("error", (err) => {
  console.log("Error in Mongo Session Store", err)
})

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  }
}

// app.get("/", (req, res) => {

//   res.send("hi, iam root");
// })


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
})

// //demo user
// app.get("/demouser", async (req, res) => {
//   let fakeuser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registereduser = await User.register(fakeuser, "helloworld");
//   res.send(registereduser);
// });



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", usersRouter);


app.use((req, res, next) => {
  next(new expresserror(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "something went wrong" } = err;
  res.status(statuscode).render("error.ejs", { message });
  // res.status(statuscode).send(message);
})

app.listen(8080, () => {
  console.log("sever is listening to port 8080")
})

