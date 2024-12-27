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
                <div className={styles.login}>로그인</div>
                <div className={styles.register}>
                    무료로 <span className={styles.boldText}>TRIPSTORY</span> 사용하기
                </div>
            </div>

            <div className={styles.down}>
                <Image
                    src="/World.png"
                    alt="World"
                    width={600}
                    height={600}
                    className={styles.worldImage}
                />
            </div>
        </div>
    );
}
