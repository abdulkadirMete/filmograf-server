const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// verification mail send
async function sendVerificationMail(user, verification) {
  const message = `Lütfen hesabını doğrulamak için linke tıkla: ${process.env.BASE_URL}/verify/${user._id}/${verification.uniqString}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `verify email`,
    text: message,
  });
}
module.exports = { transporter, sendVerificationMail };
