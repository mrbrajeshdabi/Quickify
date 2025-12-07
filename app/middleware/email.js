import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
// generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Send OTP function
export async function sendOTP(email) {
  const otp = generateOTP();
  const transporter = nodemailer.createTransport({
    host: `${process.env.SMTPSERVER}`,
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.SMTPLOGIN}`,
      pass: `${process.env.SMTPPASS}`
    }
  });

  const info = await transporter.sendMail({
    from: `${process.env.SMTPEMAIL}`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    html: `<h2>Your OTP: <b>${otp}</b></h2>`
  });
  return otp;
}

