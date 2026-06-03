import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, otp) {
  try {
    await resend.emails.send({
      from: "PixelCart <onboarding@resend.dev>",
      to: to,
      subject: "PixelCart — Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Use this code to verify your account:</p>
        <h1 style="letter-spacing: 4px">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong></p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });
    console.log("OTP email sent successfully");
  } catch (err) {
    console.log("Email sending failed:", err.message); 
  }
}

export default sendEmail;