import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../../../lib/db"; // uses your lib/db.js

export default NextAuth({
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) return null;

        // Try DB user
        if (process.env.DATABASE_URL) {
          const user = await getUserByEmail(email);
          if (user && user.password) {
            const ok = await bcrypt.compare(password, user.password);
            if (ok) return { id: user.id, name: user.name || user.email, email: user.email };
          }
        }

        // Fallback to single admin env-based credential (server-only)
        const adminUser = process.env.ADMIN_USERNAME;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (adminUser && adminHash && email === adminUser) {
          const ok = await bcrypt.compare(password, adminHash);
          if (ok) return { id: 1, name: adminUser, email: adminUser };
        }

        return null;
      }
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Add user object to token on sign-in
      if (user) token.user = user;
      if (account?.provider === "google" && profile) {
        // ensure we have basic info
        token.user = {
          id: token.sub || profile.sub || user?.id,
          name: profile.name || user?.name,
          email: profile.email || user?.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token.user on session
      if (token?.user) session.user = token.user;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
