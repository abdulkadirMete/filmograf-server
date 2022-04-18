const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// google api for auth mail
let accessToken;
const configureAuth = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  accessToken = await oAuth2Client.getAccessToken();
};
configureAuth();

// transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "oAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken,
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
