const nodemailer = require('nodemailer');

function sendWelcomeEmail(toEmail, password) {
  // If email is not configured yet, just print to the console instead of sending
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('--------- EMAIL NOT CONFIGURED — would have sent: ---------');
    console.log('To:      ', toEmail);
    console.log('Password:', password);
    console.log('-----------------------------------------------------------');
    return Promise.resolve();
  }

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  var siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Black Hat — החשבון שלך מוכן',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; background: #0a0a0a; color: #a0a0a0; padding: 2rem; max-width: 500px;">
        <h1 style="color: #00ff41; letter-spacing: 4px; margin-bottom: 0.5rem;">BLACK HAT</h1>
        <h2 style="color: #ffffff; margin-bottom: 1.5rem;">החשבון שלך מוכן</h2>
        <p style="margin-bottom: 1.5rem;">תודה על הרכישה! להלן פרטי הכניסה שלך:</p>
        <div style="background: #111111; border: 1px solid #00ff41; padding: 1.2rem; margin-bottom: 1.5rem; font-family: monospace;">
          <p style="margin-bottom: 0.5rem;"><span style="color: #00ff41;">אימייל: </span>${toEmail}</p>
          <p><span style="color: #00ff41;">סיסמה: </span>${password}</p>
        </div>
        <a href="${siteUrl}/login.html"
           style="display: inline-block; background: transparent; color: #00ff41; border: 1px solid #00ff41; padding: 0.8rem 1.5rem; text-decoration: none; font-family: monospace;">
          כנס לאתר ←
        </a>
        <p style="color: #444; font-size: 0.8rem; margin-top: 2rem;">
          מומלץ לשנות את הסיסמה לאחר הכניסה הראשונה.
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
