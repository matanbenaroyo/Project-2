# Black Hat — Hebrew Cybersecurity Lessons

A website where students can purchase and access cybersecurity lessons in Hebrew.

## How it works
1. Visitor lands on the homepage
2. Clicks the buy button → goes to Meshulam payment page
3. After payment, Meshulam notifies the server automatically (webhook)
4. Server creates an account and emails the buyer their login details
5. Buyer logs in and accesses all lessons

## Tech stack
- Frontend: HTML + CSS + JS (dark cyber theme, Hebrew RTL)
- Backend: Node.js + Express
- Database: SQLite
- Payment: Meshulam
- Hosting: Railway

## How to run locally
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open browser: `http://localhost:3000`
