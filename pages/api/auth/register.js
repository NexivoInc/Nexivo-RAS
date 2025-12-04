import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const exists = await getUserByEmail(email);
    if (exists) return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    const user = await createUser({
      name,
      email,
      passwordHash,
      verificationCode,
      verificationExpires: expires
    });

    return res.status(200).json({ ok: true, userId: user.id, code: verificationCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
}
