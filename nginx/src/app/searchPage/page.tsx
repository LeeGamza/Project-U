"use client";

import React, { useState, useEffect } from "react";
import { PiBellRinging } from "react-icons/pi";
import { LuMessageCircle } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import styles from "./_styles/searchPage.module.scss";
import Image from "next/image";

const Home: React.FC = () => {
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState({ username: "user_1" });

    const posts = Array.from({ length: 12 }, (_, index) => ({
        id: index,
        title: "[놀자에요]",
        image: "/Seoul_1.png",
        author: "user_1",
        date: "2025. 1. 21 00:00",
        likes: "5.2K",
    }));

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

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="도시 검색"
                            className={styles.searchInput}
                        />
                        <IoIosSearch className={styles.searchIcon}/>
                    </div>

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

            <div className={styles.mainContent}>
                <h2 className={styles.sectionHeaderText}>
                    {"'서울'에 대한 검색결과"}</h2>
                <div className={styles.divider}></div>

                <div className={styles.contentWrapper}>

                    <div className={styles.largeBox}>
                        <h1>서울</h1>
                        <h2>대한민국의 수도이자 최대 도시</h2>
                        <div className={styles.imageContainer}>
                            <Image
                                src="/Seoul_1.png"
                                alt="KRWorld1"
                                layout="responsive"
                                width={100}
                                height={100}
                                className={styles.centerImage}
                            />
                            <Image
                                src="/Seoul_2.png"
                                alt="KRWorld2"
                                layout="responsive"
                                width={100}
                                height={100}
                                className={styles.centerImage}
                            />
                            <Image
                                src="/Seoul_3.png"
                                alt="KRWorld3"
                                layout="responsive"
                                width={100}
                                height={100}
                                className={styles.centerImage}
                            />
                        </div>
                    </div>


                    <div className={styles.rightBox}>
                        <p className={styles.rightBoxTitle}>자주 방문한 순위</p>
                        <div className={styles.rightBoxDivider}></div>
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

                <p className={styles.subHeaderText}>서울을 가본 사람들의 추억</p>


                <div className={styles.cardGrid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.card}>
                            <img src={post.image} alt={post.title}/>
                            <div className={styles.cardContent}>
                                <div className={styles.cardTitle}>{post.title}</div>
                                <div className={styles.cardAuthor}>
                                    <img src="/profile4.jpg" alt="Author"/>
                                    <span>{post.author}</span>
                                </div>
                                <div className={styles.cardMeta}>
                                    <span>{post.likes} ⭐</span>
                                    <span className={styles.cardDate}>작성일: {post.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Home;