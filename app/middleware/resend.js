import { Resend } from 'resend';

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function sendMailEmail(email) {
    const resend = new Resend('re_TerShv4j_8aDc5MhoicrqM9wmVqEfpwxs');
    let otp = generateOTP();
    let check = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Your Otp Is ${otp}`,
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    console.log(check);
    return opt;
}