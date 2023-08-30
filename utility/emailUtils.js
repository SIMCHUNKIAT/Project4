const nodemailer = require("nodemailer");

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASS,
  },
});

module.exports = contactEmail;