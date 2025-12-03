import { getSession, signOut } from "next-auth/react";
import SignInForm from "../components/SignInForm";

export default function Admin({ session }) {
  if (!session) {
    return <SignInForm />;
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
      {/* Admin UI: device list, sessions, logs */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return { props: { session } };
}
