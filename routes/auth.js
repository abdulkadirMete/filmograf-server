const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const errorWrapper = require("../helpers/errorWrapper");
const CustomError = require("../helpers/customError");
const UserVerification = require("../models/UserVerification");
const uniqid = require("uniqid");
const { sendVerificationMail } = require("../helpers/sendMail");
const { accessTokenExpireDate } = require("../data/options");

// register
router.post(
  "/register",
  errorWrapper(async (req, res, next) => {
    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });

    const user = await newUser.save();
    const { password, ...info } = user._doc;

    // create access token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: accessTokenExpireDate }
    );
    // email verification
    let verification = await new UserVerification({
      userId: user._id,
      uniqString: uniqid(),
    }).save();
    sendVerificationMail(user, verification);
    res.status(200).json({ ...info, accessToken });
  })
);

// verify
router.post(
  "/verify",
  errorWrapper(async (req, res, next) => {
    const { userId, token } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json("Geçersiz Email");

    const verification = await UserVerification.findOne({
      userId: user._id,
      uniqString: token,
    });
    if (!verification) return res.status(400).json("Geçersiz Token");
    await User.findByIdAndUpdate(user._id, { verified: true });
    await UserVerification.findByIdAndRemove(verification._id);
    res.status(200).json({ success: true, message: "Kullanıcı Onaylandı!!" });
  })
);

// login
router.post(
  "/login",
  errorWrapper(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    !user && next(new CustomError("Email veya şifre yanlış!!", 401));

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const orginalPassword = bytes.toString(CryptoJS.enc.Utf8);

    orginalPassword !== req.body.password &&
      next(new CustomError("Email veya şifre yanlış!!", 401));

    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;

    await user.save();

    res.status(200).json({ ...info, accessToken });
  })
);

// send user verify e-mail again
router.get(
  "/verify/:id",
  errorWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    !user &&
      res
        .status(400)
        .json({ success: false, message: "Böyle bir kullanıcı yok." });
    const verification = await UserVerification.findOne({ userId: user._id });
    !verification &&
      res.status(400).json({ success: false, message: "Bir hata oluştu." });

    sendVerificationMail(user, verification);
    res
      .status(200)
      .json({ success: true, message: "Hesap Onaylama Maili Gönderildi." });
  })
);

module.exports = router;
