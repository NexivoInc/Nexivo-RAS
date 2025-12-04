import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: "Missing fields" });

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.email_verified) return res.status(400).json({ error: "Already verified" });
    if (user.verification_code !== code) return res.status(400).json({ error: "Invalid code" });
    if (new Date(user.verification_expires) < new Date()) return res.status(400).json({ error: "Code expired" });

    await pool.query("UPDATE users SET email_verified = true, verification_code = NULL, verification_expires = NULL WHERE email = $1", [email]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
}
