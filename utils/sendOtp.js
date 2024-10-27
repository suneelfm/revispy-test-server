import nodemailer from "nodemailer";

export const mailingOptions = (name, emailId, otp) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: `Ecommerce <${process.env.EMAIL}>`,
    to: [emailId],
    subject: "Verify your email",
    html: `<div>
      <p>Hi 🖐 <b>${name},</b></p>
      <p>The 8 digit OTP for verify your email ${emailId} is as follows</p>
      <p>OTP: <b>${otp}</b></p>
      <br/>
      <h4 style="text-decoration:underline">This OTP will expires after 10 min.</h4>
      </div>`,
  };
  return { transport, mailOptions };
};
