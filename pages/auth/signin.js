import { getCsrfToken } from "next-auth/react";
import SignInForm from "../../components/SignInForm";

export default function SignIn({ csrfToken }) {
  return (
    <div style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <h1>Sign In</h1>
      <SignInForm csrfToken={csrfToken} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
}
