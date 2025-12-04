# Nexivo-RAS (Starter)

This is a starter project for Nexivo - Remote Access Software (prototype).
It uses Next.js (pages router), NextAuth (Credentials provider), and PostgreSQL (Neon).

Features:
- Credentials auth (email/password) with bcrypt
- Email verification via console (OTP code shown in API response)
- Admin fallback credentials via environment variables
- Agent API: register and heartbeat
- DB helper using `pg` and Neon-compatible SSL settings

Use the GitHub UI to add these files to your repo, then add environment variables on Vercel and deploy.

See `.env.example` for required env vars.
