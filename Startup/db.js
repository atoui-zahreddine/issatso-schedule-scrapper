const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("DB_URL"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("db : connected successfully"))
    .catch((err) =>
      console.log("db : connection failed , error : ", err.message)
    );
};
