import clientPromise from "../../../lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { NextAuthOptions, User, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ["lillenkk@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user?: User | undefined;
      account?: Account | null;
      profile?: Profile | undefined;
    }): Promise<boolean> {
      if (
        account &&
        account.provider === "google" &&
        profile &&
        profile.email
      ) {
        return adminEmails.includes(profile.email);
      }
      return true;
    },
    session: async ({ session, token, user }) => {
      const email = session?.user?.email;
      const isAdmin = email && adminEmails.includes(email);
      if (isAdmin) {
        return {
          ...session,
          user: {
            ...session.user,
            isAdmin: true,
          },
        };
      } else {
        return {
          user: {},
          expires: new Date().toISOString(),
        };
      }
    },
  },
};

export default NextAuth(authOptions);
