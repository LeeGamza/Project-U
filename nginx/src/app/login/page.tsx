"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./_styles/page.module.scss";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState(null);

  // 세션이 변경될 때 토큰 업데이트
  useEffect(() => {
    if (session) {
      console.log("세션 업데이트 감지됨:", session);
      setToken(session.accessToken); // 최신 토큰 저장
    }
  }, [session]);

  // 로그인 처리 함수
  const handleLogin = async (provider) => {
    try {
      console.log("로그인 시도 중 - provider:", provider);

      await signIn(provider, { redirect: false });

      console.log("로그인 요청 후, 세션 확인 대기...");
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  };

  // 토큰이 업데이트되면 백엔드로 전송
  useEffect(() => {
    if (token) {
      console.log("업데이트된 토큰:", token);
      sendTokenToBackend(token);
    }
  }, [token]);

  // 백엔드로 토큰 전송 함수
  const sendTokenToBackend = async (accessToken) => {
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accessToken: accessToken }),
      });

      console.log({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accessToken: accessToken }),
      });

      if (response.ok) {
        console.log("토큰 전송 성공:", await response.json());
      } else {
        console.error("토큰 전송 실패:", response.status);
      }
    } catch (error) {
      console.error("토큰 전송 중 오류 발생:", error);
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
