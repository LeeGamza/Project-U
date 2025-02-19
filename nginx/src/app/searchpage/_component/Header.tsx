import React from "react";
import { PiBellRinging } from "react-icons/pi";
import { LuMessageCircle } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import styles from "../_styles/searchPage.module.scss";

interface HeaderProps {
    onBellClick: () => void;
    onMessageClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBellClick, onMessageClick }) => {
    return (
        <header className={styles.header}>
        <div className={styles.headerContent}>
        <div className={styles.logo}>로고위치</div>
            <h1 className={styles.title} onClick={() => window.location.reload()}>
    TRIPSTORY &ensp;
    </h1>

    <div className={styles.searchContainer}>
    <input type="text" placeholder="도시 검색" className={styles.searchInput} />
    <IoIosSearch className={styles.searchIcon} />
    </div>

    <button className={styles.createPostButton}>+ 새로운 게시물 만들기</button>
    <PiBellRinging className={styles.bellicon} onClick={onBellClick} />
    <LuMessageCircle className={styles.chaticon} onClick={onMessageClick} />
    </div>
    </header>
);
};