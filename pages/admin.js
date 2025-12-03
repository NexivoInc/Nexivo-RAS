import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Admin() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (session) return <div style={{padding:20}}>Admin Logged In</div>;

  return (
    <div style={{padding:20}}>
      <input placeholder="Username" onChange={e=>setUsername(e.target.value)} /><br/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/>
      <button onClick={()=>signIn("credentials",{username,password})}>Login</button>
    </div>
  );
}
