// Run this once to create a test user:
//   node scripts/createTestUser.js
//
// Test credentials:
//   Email:    test@blackhat.com
//   Password: test123

const bcrypt = require('bcryptjs');
const { initDatabase, readDB, writeDB } = require('../server/db/database');

initDatabase();

var email    = 'test@blackhat.com';
var password = 'test123';
var hash     = bcrypt.hashSync(password, 10);

var db = readDB();

if (db.users.find(function(u) { return u.email === email; })) {
  console.log('Test user already exists — nothing changed.');
  process.exit(0);
}

db.users.push({
  id: Date.now(),
  email: email,
  password: hash,
  paid: 1,
  created_at: new Date().toISOString()
});

writeDB(db);

console.log('Test user created successfully.');
console.log('  Email:    ' + email);
console.log('  Password: ' + password);
