import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import SignInForm from "../../components/SignInForm";

export default function SignIn({ providers, csrfToken }) {
  return (
    <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1>Sign in to Nexivo</h1>

      {/* Google Button */}
      {providers?.google && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => signIn("google")} style={{ padding: "10px 16px" }}>
            Sign in with Google
          </button>
        </div>
      )}

      {/* Credentials Form */}
      <SignInForm csrfToken={csrfToken} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return { props: { providers, csrfToken } };
}
