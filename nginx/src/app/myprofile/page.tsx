"use client";
import React from "react";
import TopBar from "../mainpage/_component/_topbar";
import UpCard from "./_component/_upsection";
import DownCard from "./_component/_downsection";
import styles from "./_styles/Myprofile.module.scss";

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            {/*top*/}<TopBar/>
            {/* 메인 콘텐츠 */}<div className={styles.mainContent}>
            {/*위*/}<UpCard/>
            {/*아래*/}<DownCard />
            </div>
        </div>
    );
};
export default Home;