import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Login</h2>
      <input placeholder="username" onChange={e=>setUsername(e.target.value)} />
      <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={() => signIn("credentials", { username, password, callbackUrl: "/admin" })}>Sign in</button>
    </div>
  );
}
