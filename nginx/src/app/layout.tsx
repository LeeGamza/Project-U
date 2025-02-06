"use client";
// import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      <html lang="en">
        <body>
          <SessionProvider>{children}</SessionProvider>
        </body>
      </html>
    </RecoilRoot>
  );
}
