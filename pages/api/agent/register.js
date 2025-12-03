import { createDevice } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { agent_id, name, ip } = req.body || {};
  if (!agent_id || !name) return res.status(400).json({ error: "missing fields" });
  try {
    const device = await createDevice({ agent_id, name, ip });
    res.status(201).json({ device });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
}
