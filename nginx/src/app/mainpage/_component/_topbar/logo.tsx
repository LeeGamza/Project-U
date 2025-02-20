import React from "react";
import styles from "../../_styles/MainPage.module.scss";

const Logo: React.FC = () => (
        <div className={styles.headerContent}>
            <div className={styles.logo}>로고위치</div>
            <h1 className={styles.title} onClick={() => window.location.href = "/mainpage"}>TRIPSTORY &ensp;</h1>
        </div>
            );

            export default Logo;