const mongoose = require("mongoose");

const DescSchema = new mongoose.Schema({
  desc: { type: Array },
});

module.exports = mongoose.model("Desc", DescSchema);
