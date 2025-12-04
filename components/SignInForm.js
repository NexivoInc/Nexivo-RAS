import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm({ csrfToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      alert('Login failed');
    } else {
      window.location.href = '/admin';
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
}
