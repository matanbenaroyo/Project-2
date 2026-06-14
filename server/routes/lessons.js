const express = require('express');
const path = require('path');

const router = express.Router();

// Middleware: check user is logged in and has paid
function requirePaid(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  if (!req.session.user.paid) {
    return res.redirect('/#pricing');
  }
  next();
}

// GET /lesson/01
router.get('/lesson/01', requirePaid, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/lessons/lesson-01.html'));
});

module.exports = router;
