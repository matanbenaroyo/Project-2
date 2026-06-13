const express = require('express');
const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('../db/database');
const { sendWelcomeEmail } = require('../mailer');

const router = express.Router();

// Generates a random 10-character password
function generatePassword() {
  var chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  var password = '';
  for (var i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// POST /api/payment/webhook
// Meshulam calls this after a successful payment
// NOTE: When you set up Meshulam, enter this URL as the webhook:
//   https://your-site.com/api/payment/webhook
router.post('/webhook', (req, res) => {
  var body = req.body;

  console.log('Webhook received:', JSON.stringify(body));

  // STEP 1: Verify the request came from Meshulam using your page code
  // NOTE: Update MESHULAM_PAGE_ID in your .env to match your Meshulam page
  if (process.env.MESHULAM_PAGE_ID !== 'your-meshulam-page-id-here') {
    if (body.pageCode !== process.env.MESHULAM_PAGE_ID) {
      console.log('Webhook rejected: invalid pageCode');
      return res.status(400).send('Invalid');
    }
  }

  // STEP 2: Only handle successful payments (statusCode "0" = success in Meshulam)
  if (body.statusCode !== '0') {
    console.log('Payment not successful, statusCode:', body.statusCode);
    return res.status(200).send('OK'); // 200 so Meshulam stops retrying
  }

  // STEP 3: Get the buyer's email from the webhook payload
  // NOTE: Meshulam may send it as 'payerEmail' — confirm in their dashboard
  var email = body.payerEmail || body.email;
  if (!email) {
    console.log('Webhook error: no email in payload', body);
    return res.status(400).send('No email');
  }

  email = email.toLowerCase().trim();

  var db = readDB();

  // STEP 4: Avoid creating duplicate accounts
  var existing = db.users.find(function(u) { return u.email === email; });
  if (existing && existing.paid) {
    console.log('User already has paid access:', email);
    return res.status(200).send('OK');
  }

  // STEP 5: Generate password and create (or upgrade) the account
  var password = generatePassword();
  var hash = bcrypt.hashSync(password, 10);

  if (existing) {
    // Account exists but was not paid — mark it as paid
    existing.paid = 1;
    existing.password = hash;
  } else {
    // New user — create account
    db.users.push({
      id: Date.now(),
      email: email,
      password: hash,
      paid: 1,
      created_at: new Date().toISOString()
    });
  }

  writeDB(db);
  console.log('Paid account created for:', email);

  // STEP 6: Send welcome email with login details
  sendWelcomeEmail(email, password)
    .then(function() {
      console.log('Welcome email sent to:', email);
    })
    .catch(function(err) {
      // Email failure does NOT undo the account — user still has access
      console.log('Email send failed (account still active):', err.message);
    });

  // Respond 200 immediately so Meshulam does not retry
  res.status(200).send('OK');
});

module.exports = router;
