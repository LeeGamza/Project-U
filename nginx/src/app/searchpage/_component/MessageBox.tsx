import React from "react";
import styles from "../_styles/searchPage.module.scss";

export const MessageBox: React.FC = () => {
    return (
        <div className={styles.messageBox}>
            <h3>&ensp;Trip Talk</h3>
            <hr className={styles.lines} />
            <ul className={styles.messageList}>메시지 내용 없음</ul>
        </div>
    );
};