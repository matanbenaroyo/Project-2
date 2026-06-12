# Project Rules — Black Hat

## Language
- All user-facing text is in Hebrew
- Code comments and file names are in English

## Design
- Background is always near-black
- Accent colors: green (#00ff41), red (#ff0040), or blue (#00d4ff) cyber tones
- Font: monospace style to match the hacker aesthetic
- Always RTL (right to left) for Hebrew text

## Security
- The `.env` file is NEVER committed to git
- Passwords are always hashed before saving to the database
- Lesson pages are only accessible to logged-in users who have paid

## Code style
- Keep each file small and readable
- No clever tricks — clear and simple code only
- One responsibility per file

## Features
- Do not add features not listed in TODO.md
- Complete each milestone fully before starting the next
- Test each milestone before moving on

## Payment
- Payment is handled by Meshulam only
- Never store payment card details — Meshulam handles that
- Account is created automatically after Meshulam webhook is received

## Git
- Never commit `.env`
- Never commit `node_modules/`
- Never commit `data/blackhat.db`
- Commit only after a milestone is working and tested
