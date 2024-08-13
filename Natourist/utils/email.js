const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Ahmad <ahmad@gmail.com>', // Sender address
    to: options.email, // Recipient address
    subject: options.subject, // Email subject
    text: options.message, // Email body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
