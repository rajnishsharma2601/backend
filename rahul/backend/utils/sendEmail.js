import nodemailer from "nodemailer";

const sendEmail = async (email, subject, message) => {
  // Create a test account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // use TLS
    auth: {
      user: testAccount.user, // auto-generated ethereal user
      pass: testAccount.pass, // auto-generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: `"Test App 👻" <${testAccount.user}>`,
    to: email,
    subject: subject,
    html: message,
  });

  console.log("✅ Email sent:", info.messageId);
  console.log("📬 Preview URL:", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
