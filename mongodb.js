const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB).catch((err) => {
  throw err;
});
mongoose.connection.on("error", (err) => {
  if (err) throw err;
});

const User = require("./models/user");

const performOperations = async () => {
  // delete users
  //   try {
  //     await User.deleteMany({ username: "adsf" });
  //     console.log("Deletion successful.");
  //   } catch (err) {
  //     console.log(err);
  //   }

  User.find().exec((err, result) => {
    if (err) console.log(err);
    console.log(result);
    mongoose.connection.close();
  });
};

performOperations();
