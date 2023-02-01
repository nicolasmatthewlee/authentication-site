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

// import models
const User = require("./models/user");
const Message = require("./models/message");

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
app.use(cors({ credentials: true, origin: "http://127.0.0.1:3000" }));
app.use(express.json());

// session support (saves to mongoDB in "sessions" collection)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB,
      collectionName: "sessions",
    }),
  })
);

// authenticate session with passportJS
app.use(passport.authenticate("session"));

// configure Passport to persist user information in the login session
// necessary to add user object to req as req.user
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
    status: "user",
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

    // login user
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ err: false, user: user.username });
    });
  })(req, res, next)
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ err: false });
  });
});

app.get("/user", (req, res, next) => {
  if (!req.user) return next();
  res.json({ username: req.user.username });
});

app.post("/message", (req, res, next) => {
  // check if user is authenticated
  if (!req.user) res.json({ err: "Unauthorized." });
  // user authenticated
  const message = new Message({
    content: req.body.message,
    author: req.user.username,
    datetime: new Date(),
  });

  message.save((err) => {
    if (err) return next(err);
    res.json({ err: false });
  });
});

app.get("/message", (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.json({ err: "Unauthorized." });
  // user authenticated

  // do not send authors back if user.status==='user'
  if (req.user.status === "user") {
    Message.find({}, { __v: 0, author: 0 }).exec((err, result) => {
      if (err) return next(err);
      // no error
      res.send(result);
    });
  } else {
    Message.find({}, { __v: 0 }).exec((err, result) => {
      if (err) return next(err);
      // no error
      res.send(result);
    });
  }
});

app.post("/register", (req, res, next) => {
  if (!req.user) res.json({ err: "Unauthorized." });
  // user authenticated

  // check if password matches REGISTER_PASSWORD
  if (req.body.password === process.env.MEMBER_KEY) {
    // approved, update status

    User.findByIdAndUpdate(req.user._id, { status: "member" }).exec(
      (err, result) => {
        if (err) return res.json({ err: "Failed to update status." });
        res.json({ err: false });
      }
    );
  } else res.json({ err: "Incorrect." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// any other request
app.use((req, res, next) => {
  res.json({ err: "Route not found." });
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
