"use client";

import Image from "next/image";
import styles from "./_styles/page.module.scss";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();

  const handleLogin = async (provider) => {
    try {
      const result = await signIn(provider);

      if (result && result.ok) {
        const token = session?.user?.accessToken;

        if (token) {
          const response = await fetch("/api/send-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            console.log("토큰 전송 성공:", await response.json());
          } else {
            console.error("토큰 전송 실패:", response.status);
          }
        }
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.background}>
      <button className={styles.goHomeButton}>
        <AiOutlineArrowLeft />
        홈으로
      </button>
      <div className={styles.loginContainer}>
        {status === "authenticated" ? (
          <>
            <Image src="/Logo.png" alt="logo" width={400} height={400} />
            <div className={styles.loginText}>
              {session.user?.name}님, TRIPSTORY에 오신 것을 환영합니다!
            </div>
            <button
              className={styles.kakaoLoginButton}
              onClick={() => signOut()}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Image src="/Logo.png" alt="logo" width={400} height={400} />
            <div className={styles.loginText}>TRIPSTORY에 로그인 하기</div>
            <button
              className={styles.kakaoLoginButton}
              onClick={() => handleLogin("kakao")}
            >
              <Image src="/KakaoLogo.png" alt="kakao" width={48} height={48} />
              카카오 계정으로 계속하기
            </button>
            <button
              className={styles.googleLoginButton}
              onClick={() => handleLogin("google")}
            >
              <Image
                src="/GoogleLogo.png"
                alt="Google"
                width={48}
                height={48}
              />
              Google 계정으로 계속하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
