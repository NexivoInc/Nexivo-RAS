import { upsertAgentHeartbeat } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { agent_id, ip, os, version } = req.body || {};
  if (!agent_id) return res.status(400).json({ error: "missing agent_id" });
  try {
    await upsertAgentHeartbeat(agent_id, { ip, os, version });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
}
