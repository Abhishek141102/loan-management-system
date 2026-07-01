const nodemailer =
  require("nodemailer");

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: "asoundankar02@gmail.com",
      pass: "jqqomexbviehhman",
    },
  });

module.exports = transporter;