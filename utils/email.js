const nodemailer = require('nodemailer'); //135
//135
const sendEmail = async options => {
  //1) create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //Activate in gmail 'less secure app' option
  });
  //2) define the email options
  const mailOptions = {
      from: 'test <hi@hi.com>',
      to: options.email,
      subject: options.subject,
      text: options.message
      // html:
    };
    // 3) actually send the email
    console.log(mailOptions);
  await transporter.sendMail(mailOptions);
};
// 135
module.exports = sendEmail;
