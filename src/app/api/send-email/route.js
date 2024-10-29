// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  const { name, email, message, subject, phoneNumber } = await request.json();

  // Configure the SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email address
      pass: process.env.SMTP_PASS, // your email password or app-specific password
    },
  });

  // Set up email data
  const mailOptions = {
    from: email, // sender address
    to: 'rxdevs100@gmail.com', // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: `
        <p>You have a new message from <strong>${name}</strong>:</p>
        <p>Email: ${email}</p>
        <p>Whatsapp number: ${phoneNumber}</p>
        <p>Message: ${message}</p>
      `, // HTML body
  };

  // Send mail
  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' });
  }
}
