const mongoose = require("mongoose");
const config = require("../config");

const connectDB = () => {
  return new Promise(function (resolve, reject) {
    mongoose.connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let db = mongoose.connection;
    db.on("connected", function (ref) {
      console.log("Connected to Mongo Server");
      return resolve(db);
    });
    db.on("error", function (err) {
      console.log(`Failed to connect Mongo `, err.message);
      return reject(db);
    });
  });
};

module.exports = connectDB;
