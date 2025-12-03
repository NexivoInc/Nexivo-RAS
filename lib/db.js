import pkg from "pg";
const { Pool } = pkg;

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  pool = null;
}

export async function query(text, params) {
  if (!pool) throw new Error("DATABASE_URL not configured");
  const res = await pool.query(text, params);
  return res;
}

export async function queryUserByUsername(username) {
  const r = await query("SELECT id, username, password_hash FROM users WHERE username = $1 LIMIT 1", [username]);
  return r.rows[0];
}

export async function createDevice(device) {
  const r = await query(
    "INSERT INTO devices (agent_id, name, ip, last_seen) VALUES ($1,$2,$3,NOW()) RETURNING *",
    [device.agent_id, device.name, device.ip]
  );
  return r.rows[0];
}

export async function upsertAgentHeartbeat(agent_id, info) {
  // info is { ip, os, version }
  await query(
    `INSERT INTO agents (agent_id, ip, os, version, last_seen)
     VALUES ($1,$2,$3,$4,NOW())
     ON CONFLICT (agent_id) DO UPDATE SET ip = EXCLUDED.ip, os = EXCLUDED.os, version = EXCLUDED.version, last_seen = NOW()`,
    [agent_id, info.ip, info.os, info.version]
  );
}
