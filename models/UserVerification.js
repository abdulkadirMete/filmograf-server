const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uniqString: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserVerification", UserVerificationSchema);
