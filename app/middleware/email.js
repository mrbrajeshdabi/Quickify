import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
// generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
    // service:'gmail',
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY
    }
  });

// Send OTP function
export async function sendOTP(email) {
  const otp = generateOTP();
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quickify OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#4285F4; padding:24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">Quickify</h1>
              <p style="margin:6px 0 0; color:#eaf1ff; font-size:14px;">Smart & Secure Communication</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; color:#333333;">
              <h2 style="margin-top:0; font-size:22px;">Verify Your Email</h2>

              <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">
                Hello 👋,<br /><br />
                Use the OTP below to verify your email address and complete your Quickify signup.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; background:#f1f5ff; color:#4285F4; font-size:32px; letter-spacing:6px; padding:14px 26px; border-radius:10px; font-weight:bold;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:14px; color:#555555; line-height:1.6;">
                ⏳ This OTP is valid for <b>5 minutes</b> only.<br />
                ❌ Do not share this code with anyone.
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:28px 0;" />

              <p style="font-size:13px; color:#777777; line-height:1.6;">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa; padding:20px; text-align:center; font-size:12px; color:#888888;">
              © 2025 Quickify. All rights reserved.<br />
              Built with 💙 for fast & secure communication
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
  
    let mailResponse = await transporter.sendMail({
      from: `"Quickify 🚀" <${process.env.EMAIL}>`,
      to: email,
      subject: "Quickify OTP Verification",
      text: `Your OTP is ${otp}`,
      html: html
  });
  console.log("Email sent:", mailResponse.messageId);
  return otp;
}

