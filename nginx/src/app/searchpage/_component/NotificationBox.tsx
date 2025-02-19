import React from "react";
import styles from "../_styles/searchPage.module.scss";

export const NotificationBox: React.FC = () => {
    return (
        <div className={styles.bellBox}>
            <h3>&ensp;알림</h3>
            <hr className={styles.lines} />
            <ul className={styles.bellList}>알림 내용 없음</ul>
        </div>
    );
};