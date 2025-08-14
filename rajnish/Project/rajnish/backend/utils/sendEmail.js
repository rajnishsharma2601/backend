import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email, // user email
    subject: subject, // Subject line
    html: message, // html body
  });
};

export default sendEmail;




// import nodemailer from "nodemailer";

// const sendEmail = async (email, subject, message) => {
//   // Create a test account from ethereal.email
//   const testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // use TLS
//     auth: {
//       user: testAccount.user, // auto-generated ethereal user
//       pass: testAccount.pass, // auto-generated ethereal password
//     },
//   });

//   const info = await transporter.sendMail({
//     from: `"Test App 👻" <${testAccount.user}>`,
//     to: email,
//     subject: subject,
//     html: message,
//   });

//   console.log("✅ Email sent:", info.messageId);
// console.log("📬 Preview URL:", nodemailer.getTestMessageUrl(info));
// };

// export default sendEmail;
