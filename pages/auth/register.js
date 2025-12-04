import { useState } from "react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [serverCode, setServerCode] = useState('');
  const [code, setCode] = useState('');

  async function register(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const password = e.target.password.value;
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.ok) {
      setServerCode(data.code);
      setStep(2);
    } else {
      alert(data.error || 'Register error');
    }
  }

  async function verify(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (data.ok) {
      alert('Verified! You can now sign in.');
      window.location.href = '/auth/signin';
    } else {
      alert(data.error || 'Verification failed');
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
      <h1>Create account</h1>

      {step === 1 && (
        <form onSubmit={register}>
          <input name="name" placeholder="Name" required />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      )}

      {step === 2 && (
        <>
          <p>Your verification code (preview): <b>{serverCode}</b></p>
          <form onSubmit={verify}>
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit code" required />
            <button type="submit">Verify</button>
          </form>
        </>
      )}
    </div>
  );
}
