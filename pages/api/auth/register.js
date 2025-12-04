import bcrypt from "bcryptjs";
import { pool } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Server error" });
  }
}
