import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    // signIn returns a redirect unless redirect: false
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      alert("Login failed: " + res.error);
    } else {
      // success — redirect to dashboard
      window.location.href = "/admin";
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <input placeholder="Email or username" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign in</button>
    </form>
  );
}
