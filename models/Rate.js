const mongoose = require("mongoose");

const RateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  rate: { type: Number, required: true },
});

module.exports = mongoose.model("Rate", RateSchema);
