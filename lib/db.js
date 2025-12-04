import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* Devices & heartbeats */
export async function upsertAgentHeartbeat(agent_id, { ip, os, version }) {
  const query = `
    INSERT INTO agent_heartbeats (agent_id, ip, os, version, last_seen)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (agent_id)
    DO UPDATE SET ip = $2, os = $3, version = $4, last_seen = NOW()
    RETURNING *;
  `;
  const values = [agent_id, ip, os, version];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function createDevice({ agent_id, name, ip }) {
  const query = `
    INSERT INTO devices (agent_id, name, ip)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [agent_id, name, ip];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

/* Users */
export async function createUser({ name, email, passwordHash, verificationCode, verificationExpires }) {
  const query = `
    INSERT INTO users (name, email, password, email_verified, verification_code, verification_expires)
    VALUES ($1, $2, $3, false, $4, $5)
    RETURNING id, name, email;
  `;
  const values = [name, email, passwordHash, verificationCode, verificationExpires];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function getUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}

export default pool;
