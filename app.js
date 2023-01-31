const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/user");

// connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB).catch((err) => {
  throw err;
});
mongoose.connection.on("error", (err) => {
  if (err) throw err;
});

// create application
const app = express();
app.use(cors());
app.use(express.json());

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).json({ err: "An unknown error occured." });
  }
});

// start server
app.listen(8000, () => console.log("listening at port 8000"));
