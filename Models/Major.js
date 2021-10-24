const mongoose = require("mongoose");

exports.Major = mongoose.model(
  "Major",
  new mongoose.Schema({
    majorId: { type: String, required: true },
    label: { type: String, required: true },
    schedule: { type: Object, required: true },
    updatedOn: { type: Date, required: true, default: Date.now },
  })
);
