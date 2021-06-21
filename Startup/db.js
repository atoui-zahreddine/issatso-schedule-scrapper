const mongoose = require("mongoose");

module.exports = function () {
    mongoose
        .connect("mongodb://localhost:27017/issatso-majors-db", {
            useNewUrlParser: true, useUnifiedTopology: true
        })
        .then(() => console.log("db : connected successfully"))
        .catch((err) => console.log("db : connection failed , error : ", err.message));
};
