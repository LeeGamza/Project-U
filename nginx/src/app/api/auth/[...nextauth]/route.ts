import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// next-auth 타입 확장
declare module "next-auth" {
  interface Session {
    accessToken?: string; // accessToken 추가
  }
  interface Token {
    accessToken?: string; // Token에도 accessToken 추가
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: any }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session & { accessToken?: string };
      token: JWT;
    }) {
      if (token.accessToken) {
        console.log("12222:" + token.accessToken);
        session.accessToken = token.accessToken; // accessToken이 존재할 때만 할당
      } else {
        session.accessToken = undefined; // undefined로 할당
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
