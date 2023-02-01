const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const User = require("./models/user");

// connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB).catch((err) => {
  throw err;
});
mongoose.connection.on("error", (err) => {
  if (err) throw err;
});

// set up LocalStrategy to be called on passport.authenticate()
passport.use(
  new LocalStrategy((username, password, cb) => {
    // find user in database
    User.findOne({ username: username }, (err, user) => {
      //if err, return error
      if (err) return cb(err);
      // if no user, return false (2nd parameter)
      if (!user)
        return cb(null, false, { message: "Incorrect username or password." });
      // if passswords do not match, return false (2nd parameter)
      if (user.password !== password)
        return cb(null, false, { message: "Incorrect username or password." });
      // user found, password matches, return user
      else return cb(null, user);
    });
  })
);

// create application
const app = express();
app.use(cors());
app.use(express.json());

// session support (saves to mongoDB in "sessions" collection)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB,
      collectionName: "sessions",
    }),
  })
);
// authenticate session with passportJS
app.use(passport.authenticate("session"));

// configure Passport to persist user information in the login session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);

// serve client build
app.use(express.static(path.join(__dirname, "/client/build")));

// define routes
app.post("/signup", (req, res, next) => {
  // validation here (skipped for now)
  // for error handling, see format of error handler below

  // save user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user.save((err, result) => {
    if (err) return next(err);
    // saved
    res.json({ err: false });
  });
});

app.post("/login", (req, res, next) =>
  passport.authenticate("local", (err, user, info, status) => {
    // if error, return error
    if (err) return next(err);
    // user set to false when authentication fails
    // if authentication fails, return 'invalid credentials'
    if (!user) return res.json({ err: "Invalid credentials." });
    res.json({ err: false, username: user.username });
  })(req, res, next)
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ err: false });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// any other request
app.use((req, res, next) => {
  next(new Error("Route not found."));
});

// error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).json({ err: "An unknown error occurred." });
  }
});

// start server
app.listen(8000, () => console.log("listening at port 8000"));
