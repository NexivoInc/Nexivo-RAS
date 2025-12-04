import { getSession, signOut } from "next-auth/react";

export default function Admin({ user }) {
  if (!user) return <div>Not authorized</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name || user.email}</p>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>

      {/* TODO: add device list, agent controls, etc. */}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: { destination: "/auth/signin", permanent: false },
    };
  }
  return { props: { user: session.user } };
}
