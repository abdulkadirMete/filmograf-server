const router = require("express").Router();
const errorWrapper = require("../helpers/errorWrapper");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verifyUser = require("../middlewares/auth/verifyUser");
const photoUpload = require("../helpers/profileImage/uploadImageMulter");
const { cloudinary } = require("../helpers/profileImage/uploadImageCloudinary");

// update user
router.put(
  "/:id",
  verifyUser,
  errorWrapper(async (req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET_KEY
        ).toString();
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else {
      res.status(403).json("Sadece kendi hesabını güncelleyebilirsin!!");
    }
  })
);

// delete user
router.delete(
  "/:id",
  verifyUser,
  errorWrapper(async (req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Kullanıcı silindi !!");
    } else {
      res.status(403).json("Sadece kendi hesabını silebilirsin!!");
    }
  })
);

// get user
router.get(
  "/find/:id",
  errorWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  })
);

//get all users
router.get(
  "/",
  verifyUser,
  errorWrapper(async (req, res, next) => {
    const query = req.query.new;
    if (req.user?.isAdmin) {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } else {
      res.status(403).json("Tüm kullanıcıları görme izniniz yok");
    }
  })
);

// profile image upload
router.post(
  "/uplaod/image",
  verifyUser,
  errorWrapper(async (req, res, next) => {
    const uploadResponse = await cloudinary.uploader.upload(req.body.imgData, {
      upload_preset: "ml_default",
      transformation: [{ width: 150, height: 150, crop: "fit" }],
    });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { img: uploadResponse.url },
      { new: true }
    );
    res.status(200).json(user);
  })
);

module.exports = router;
