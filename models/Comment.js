const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    comment: { type: String, required: true, maxlength: 250 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
