"use client";

import React, { useState, useEffect } from "react";
import { PiBellRinging } from "react-icons/pi";
import { LuMessageCircle } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import styles from "./_styles/MyPage.module.scss";
import Image from "next/image";

const Home: React.FC = () => {
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState({ username: "user_1" });

    const toggleBellBox = () => setIsBellOpen((prev) => !prev);
    const toggleMessageBox = () => setIsMessageOpen((prev) => !prev);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                !(event.target as HTMLElement).closest(`.${styles.bellBox}`) &&
                !(event.target as HTMLElement).closest(`.${styles.bellicon}`)
            ) {
                setIsBellOpen(false);
            }
            if (
                !(event.target as HTMLElement).closest(`.${styles.messageBox}`) &&
                !(event.target as HTMLElement).closest(`.${styles.chaticon}`)
            ) {
                setIsMessageOpen(false);
            }
            if (
                !(event.target as HTMLElement).closest(`.${styles.dropdownMenu}`) &&
                !(event.target as HTMLElement).closest(`.${styles.dropdownIcon}`)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>로고위치</div>
                    <h1 className={styles.title} onClick={() => window.location.reload()}>
                        TRIPSTORY &ensp;
                    </h1>

                    <button className={styles.createPostButton}>+ 새로운 게시물 만들기</button>

                    {/* 알람 벨 버튼 */}
                    <PiBellRinging className={styles.bellicon} onClick={toggleBellBox}/>

                    {/* 메시지 버튼 */}
                    <LuMessageCircle className={styles.chaticon} onClick={toggleMessageBox}/>

                    {/* 프로필아이콘, 사용자 이름 */}
                    <div className={styles.profileIcon}>
                        <img
                            src="profile4.jpg"
                            alt={`${user.username}'s profile`}
                            className={styles.profileImage}
                        />
                    </div>
                    <p className={styles.username}>{user.username}</p>

                    {/* 드롭아웃 토글 */}
                    <IoChevronDown className={styles.dropdownIcon} onClick={toggleDropdown}/>
                    {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <p className={styles.dropdownItem}>My 프로필</p>
                            <p className={styles.dropdownItem}>로그아웃</p>
                        </div>
                    )}
                </div>
            </header>

            {/* 알림 창 */}
            {isBellOpen && (
                <div className={styles.bellBox}>
                    <h3>&ensp;알림</h3>
                    <hr className={styles.lines}/>
                    <ul className={styles.bellList}>알림 내용 없음</ul>
                </div>
            )}

            {/* 메시지 창 */}
            {isMessageOpen && (
                <div className={styles.messageBox}>
                    <h3>&ensp;Trip Talk</h3>
                    <hr className={styles.lines}/>
                    <ul className={styles.messageList}>메시지 내용 없음</ul>
                </div>
            )}

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* 왼쪽 컨테이너 */}
                <div className={styles.leftContainer}>
                    {/* 큰 박스 */}
                    <div className={styles.leftBoxLarge}>
                        <div className={styles.largeBoxIcon}>👤</div>
                        <p className={styles.largeBoxText}>user_1</p>
                    </div>

                    {/* 작은 박스 */}
                    <div className={styles.leftBoxSmall}>
                        <p>마이 페이지로 돌아가기</p>
                    </div>
                </div>

                {/* 중앙 컨테이너 */}
                <div className={styles.centerContainer}>
                    {/* 텍스트 */}
                    <p className={styles.centerText}>나만의 여행 지도</p>

                    {/* 이미지 */}
                    <Image
                        src="/KoreaWorld_Intro.png"
                        alt="KRWorld"
                        layout="responsive"
                        width={100}
                        height={100}
                        className={styles.centerImage}
                    />

                    <div className={styles.smallBoxes}>
                        {[
                            {text: "0%", color: "#D9D9D9"},
                            {text: "1~32%", color: "#FE9691"},
                            {text: "33~65%", color: "#A7DBE8"},
                            {text: "66~99%", color: "#A0D468"},
                            {text: "100%", color: "#FFD700"},
                        ].map((box, index) => (
                            <div
                                key={index}
                                className={`${styles.smallBox} ${styles[`smallBox${index + 1}`]}`}>
                                <span className={styles.boxLabel} style={{color: box.color}}>
                                    {box.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 오른쪽 컨테이너 */}
                <div className={styles.rightContainer}>
                    {/* 큰 텍스트 */}
                    <p className={styles.rightTextLarge}>
                        나만의 지도를{"\n"}완성해보세요!
                    </p>

                    {/* 작은 텍스트 */}
                    <p className={styles.rightTextSmall}>
                        방문한 횟수에 따라{"\n"}색이 변합니다.
                    </p>

                    {/* 박스 */}
                    <div className={styles.rightBox}>
                        <p className={styles.rightBoxTitle}>자주 방문한 순위</p>

                        {/* 구분 선 */}
                        <div className={styles.rightBoxDivider}></div>

                        {/* 순위 리스트 */}
                        <ul className={styles.rightBoxList}>
                            {[
                                {icon: "👑", text: "강원도"},
                                {icon: "🥇", text: "경상남도"},
                                {icon: "🥈", text: "경상북도"},
                                {icon: "🥉", text: "충청남도"},
                            ].map((item, index) => (
                                <li key={index} className={styles.rightBoxItem}>
                                    <span className={styles.rightBoxIcon}>{item.icon}</span>
                                    <span className={styles.rightBoxText}>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
