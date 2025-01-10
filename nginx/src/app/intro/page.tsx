"use client";

import Image from "next/image";
import styles from "./_styles/intro.module.scss";

export default function IntroPage() {
    return (
        <div className={styles.container}>

            <div className={styles.up}>
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={100}
                    height={100}
                    className={styles.logoImage}
                    />
                <div className={styles.logoText}>TRIPSTORY</div>

                <div className={styles.login}>

                    <div className={styles.loginImage}>
                        <Image
                            src="/LogIn_Intro.png"
                            alt="login_icon"
                            width={20}
                            height={20}
                            className={styles.logoImage}
                        />
                    </div>

                    <div className={styles.loginText}>
                        로그인
                    </div>
                </div>
            </div>

            <div className={styles.down}>

                <div className={styles.downText}>
                    <p className={styles.indentedText}>대한민국 지역들을 <br /> 여행하고 기록해보세요.</p>
                </div>

                <div className={styles.kWorld}>
                    <Image
                        src="/KoreaWorld_Intro.png"
                        alt="World"
                        width={800}
                        height={800}
                        className={styles.worldImage}
                    />
                </div>

                <div className={styles.sKImage}>
                    <Image
                        src="/SouthKorea_Intro.png"
                        alt="SouthK"
                        width={300}
                        height={300}
                        className={styles.southKImage}
                    />
                </div>
            </div>
        </div>
    );
}
