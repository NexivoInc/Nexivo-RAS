import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        const user = process.env.ADMIN_USERNAME;
        const hash = process.env.ADMIN_PASSWORD_HASH;

        if (!user || !hash) return null;
        if (credentials.username !== user) return null;

        const valid = await bcrypt.compare(credentials.password, hash);
        return valid ? { id: 1, name: user } : null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET
});
