import { getSession, signOut } from "next-auth/react";

export default function Admin({ user }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name || user?.email}</p>
      <button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>Sign Out</button>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  return { props: { user: session.user } };
}
