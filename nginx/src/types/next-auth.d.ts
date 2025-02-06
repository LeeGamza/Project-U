// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // accessToken 추가
  }
  interface Token {
    accessToken?: string; // Token에도 accessToken 추가
  }
}
