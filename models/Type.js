const mongoose = require("mongoose");

const TypesSchema = new mongoose.Schema(
  {
    title: { type: String, require: true, unique: true },
    id: { type: Number, require: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Type", TypesSchema);
