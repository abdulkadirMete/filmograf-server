const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new mongoose.Schema(
  {
    cast: { type: Array },
    categorys: { type: Array },
    desc: { type: Schema.Types.ObjectId, ref: "Desc" },
    director: { type: String },
    imdb: { type: Number },
    img: { type: String },
    langs: { type: Array },
    name: { type: String, required: true },
    release: { type: String },
    type: { type: String },
    video: { type: String },
    view: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MovieSchema.index({ name: "text" });
module.exports = mongoose.model("Movie", MovieSchema);
