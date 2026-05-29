const { Resend } = require('resend');

const generateOTP = (length = 6) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
};

const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is not configured');
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('Resend sender email is not configured');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Your OTP for Task Manager',
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in ${process.env.OTP_EXPIRY || 10} minutes.</p>
      `
    });

    if (error) {
      throw new Error(error.message || 'Resend failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

const calculateExpiry = (minutes = 10) => {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60000);
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  calculateExpiry
};
