import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Admin Panel</h1>
      {!session && <p>You must log in first.</p>}
      {session && <p>Welcome, {session.user.name}!</p>}
    </div>
  );
}

// Prevent static export
export async function getServerSideProps() {
  return { props: {} };
}
