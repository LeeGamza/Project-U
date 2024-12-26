import Image from "next/image";
import styles from "./_styles/page.module.scss";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function Login() {
  return (
    <div className={styles.background}>
      <button className={styles.goHomeButton}>
        <AiOutlineArrowLeft />
        홈으로
      </button>
      <div className={styles.loginContainer}>
        <Image src="/Logo.png" alt="logo" width={400} height={400} />
        <div className={styles.loginText}>TRIPSTORY에 로그인 하기</div>
        <button className={styles.kakaoLoginButton}>
          <Image src="/KakaoLogo.png" alt="kakao" width={48} height={48} />
          카카오 계정으로 계속하기
        </button>
        <button className={styles.googleLoginButton}>
          <Image src="/GoogleLogo.png" alt="Google" width={48} height={48} />
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
  );
}
