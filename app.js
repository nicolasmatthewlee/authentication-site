const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

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
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return next(err);
        if (res) return cb(null, user); // passwords match
        else
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
      });
    });
  })
);

// create application
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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
app.post("/signup", [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username must be provided.")
    .isLength({ max: 100 })
    .withMessage("Username must not exceed 100 characters.")
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) return Promise.reject("Username already in use.");
      });
    }),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Password must be provided.")
    .isLength({ max: 100 })
    .withMessage("Password must not exceed 100 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ err: false, formErrors: errors.errors });

    // validation succeeded
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);

      // save user
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        status: "user",
      });

      user.save((err, result) => {
        if (err) return next(err);
        // saved
        res.json({ err: false });
      });
    });
  },
]);

app.post("/login", [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username must be provided.")
    .isLength({ max: 100 })
    .withMessage("Username must not exceed 100 characters."),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Password must be provided.")
    .isLength({ max: 100 })
    .withMessage("Password must not exceed 100 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ err: false, formErrors: errors.errors });
    next();
  },
  (req, res, next) =>
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
    })(req, res, next),
]);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ err: false });
  });
});

app.get("/user", (req, res, next) => {
  if (!req.user) return res.json({ err: "Unauthorized." });
  res.json({ username: req.user.username, status: req.user.status });
});

app.post("/message", [
  // validation
  body("message")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Message must not be empty.")
    .isLength({ max: 200 })
    .withMessage("Message must not exceed 200 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ err: errors.errors });

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
  },
]);

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
  if (
    req.body.password === process.env.MEMBER_KEY ||
    req.body.password === process.env.ADMIN_KEY
  ) {
    // approved, update status
    const newStatus =
      req.body.password === process.env.MEMBER_KEY ? "member" : "admin";

    User.findByIdAndUpdate(req.user._id, { status: newStatus }).exec(
      (err, result) => {
        if (err) return res.json({ err: "Failed to update status." });
        res.json({ err: false });
      }
    );
  } else res.json({ err: "Incorrect." });
});

app.post("/delete", (req, res, next) => {
  if (!req.user) return res.json({ err: "Unauthorized." });
  if (req.user.status !== "admin") return res.json("Unauthorized.");
  else {
    // admin authenticated
    Message.findByIdAndDelete(req.body.id).exec((err, result) => {
      if (err) return next(err);
      res.json({ err: false });
    });
  }
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
app.listen(2000, () => console.log("listening at port 2000"));
