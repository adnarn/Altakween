const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL || 'https://app.altakween.ng'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Altakween Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Or copy and paste this link in your browser:
            </p>
            <p style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace;">
              ${resetUrl}
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your reset token is: <strong style="color: #667eea;">${resetToken}</strong>
            </p>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              This link will expire in 15 minutes. If you didn't request this password reset, 
              please ignore this email or contact support if you have concerns.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
};
