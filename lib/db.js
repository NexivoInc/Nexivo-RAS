import { Pool } from "pg";

// Create a connection pool (Vercel + Neon compatible)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Used by API routes
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

export default pool;
