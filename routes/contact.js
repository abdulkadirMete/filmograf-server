const router = require("express").Router();
const transporter = require("../helpers/sendMail");
const errorWrapper = require("../helpers/errorWrapper");

// send mail
router.post(
  "/",
  errorWrapper(async (req, res, next) => {
    const { subject, email, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `email:${email} subject:${subject}`,
      text: message,
    });

    res.status(200).json("Mesajınız iletildi!!");
  })
);

module.exports = router;
