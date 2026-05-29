const jwt = require('jsonwebtoken');
const { pool } = require('../config/init');
const { generateOTP, sendOTPEmail, calculateExpiry } = require('../utils/otp');
const { body, validationResult } = require('express-validator');

exports.sendOTP = [
  body('email').isEmail().withMessage('Invalid email format'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email } = req.body;
      const otp = generateOTP();
      const expiry = calculateExpiry(parseInt(process.env.OTP_EXPIRY) || 10);

      // Save OTP to database
      await pool.query(
        'INSERT INTO otp_logs (email, otp_code, expires_at) VALUES ($1, $2, $3)',
        [email, otp, expiry]
      );

      // Send OTP via email
      await sendOTPEmail(email, otp);

      res.json({
        success: true,
        message: 'OTP sent to email'
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending OTP',
        error: error.message || 'Unknown email error'
      });
    }
  }
];

exports.verifyOTP = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('otp').isLength({ min: 6 }).withMessage('Invalid OTP format'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, otp } = req.body;

      // Verify OTP from database
      const result = await pool.query(
        'SELECT * FROM otp_logs WHERE email = $1 AND otp_code = $2 AND expires_at > NOW() AND verified = FALSE ORDER BY created_at DESC LIMIT 1',
        [email, otp]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Mark OTP as verified
      await pool.query(
        'UPDATE otp_logs SET verified = TRUE WHERE id = $1',
        [result.rows[0].id]
      );

      // Create or get user
      let userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        userResult = await pool.query(
          'INSERT INTO users (email) VALUES ($1) RETURNING *',
          [email]
        );
      }

      const user = userResult.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying OTP',
        error: error.message
      });
    }
  }
];

exports.logout = (req, res) => {
  // OTP-based auth is stateless, so logout is just a confirmation
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
