"use client";
import React from "react";
import TopBar from "./_component/_topbar";
import MainContent from "./_component/_maincontent";
import RankContent from "./_component/_rankcontent";
import styles from "./_styles/MainPage.module.scss";

const HomePage: React.FC = () => {
    return (
        <div className={styles.container}>
            {/* Top Bar */}<TopBar/>
            <div className={styles.mainContent}>
                {/* 게시물 */}<MainContent/>
                {/* 명예의 전당 */}<RankContent/>
            </div>
        </div>
    );
};
export default HomePage;