import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../../../lib/db";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) return null;

        if (process.env.DATABASE_URL) {
          const user = await getUserByEmail(email);
          if (user && user.password) {
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) return null;
            if (!user.email_verified) return null;
            return { id: user.id, name: user.name || user.email, email: user.email };
          }
        }

        const adminUser = process.env.ADMIN_USERNAME;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (adminUser && adminHash && email === adminUser) {
          const ok = await bcrypt.compare(password, adminHash);
          if (ok) return { id: 1, name: adminUser, email: adminUser };
        }

        return null;
      }
    })
  ],
  pages: { signIn: "/auth/signin" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});
