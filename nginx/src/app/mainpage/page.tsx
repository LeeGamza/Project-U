"use client";

import React, { useState , useEffect } from "react";
import { PiBellRinging } from "react-icons/pi";
import { LuMessageCircle } from "react-icons/lu";
import {VscCaseSensitive, VscCircleLarge} from "react-icons/vsc";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import styles from "./MainPage.module.scss";


const Home: React.FC = () => {



    // 알림 창 추가
    const [isBellOpen, setIsBellOpen] = React.useState(false);
    const toggleBellBox=()=>{
        setIsBellOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                !(event.target as HTMLElement).closest(`.${styles.bellBox}`) &&
                !(event.target as HTMLElement).closest(`.${styles.bellicon}`)
            ) {
                setIsBellOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);



    // 메시지 창 상태 추가
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const toggleMessageBox = () => {
        setIsMessageOpen((prev) => !prev);
    };
    // 메시지 창 외부 클릭 감지 및 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                !(event.target as HTMLElement).closest(`.${styles.messageBox}`) &&
                !(event.target as HTMLElement).closest(`.${styles.chaticon}`)
            ) {
                setIsMessageOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    // 드롭아웃 토글 이벤트
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // 드롭다운 외부 클릭 감지 및 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(`.${styles.dropdownMenu}`) &&
                !(event.target as HTMLElement).closest(`.${styles.dropdownIcon}`)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때 한 번만 실행

    //-------------------------------------------------------------------------------------------------

    // 임시 데이터 (알림)
    const temporaryBellData = [
        {
            user: { username: "G_dragon", profileImage: "profile1.jpg" },
            post: { id: 101, title: "서울 여행", imageUrl: "post1.jpg" },
            action: "commented",
            comment: "I Got the Power!",
        },
        {
            user: { username: "captain_america", profileImage: "profile2.jpg" },
            post: { id: 102, title: "서울 여행", imageUrl: "post1.jpg" },
            action: "commented",
            comment: "이정도는 되야 미국의 엉덩이지."
        },
        {
            user: { username: "Iron_man", profileImage: "profile3.jpg" },
            post: { id: 103, title: "부산 광안리", imageUrl: "post2.jpg" },
            action: "commented",
            comment: "3000만큼 사랑해",
        },
        {
            user: { username: "G_dragon", profileImage: "profile1.jpg" },
            post: { id: 101, title: "서울 여행", imageUrl: "post1.jpg" },
            action: "liked",
        },
        {
            user: { username: "NIKITA", profileImage: "profile4.jpg" },
            post: { id: 104, title: "부산 광안리", imageUrl: "post2.jpg" },
            action: "liked",
        },
        {
            user: { username: "NIKITA", profileImage: "profile4.jpg" },
            post: { id: 104, title: "부산 광안리", imageUrl: "post2.jpg" },
            action: "commented",
            comment: "아 씨 꼬우면 겜 접든가 ㅋㅋ"
        },
        {
            user: { username: "NIKITA", profileImage: "profile4.jpg" },
            post: { id: 104, title: "서울 여행", imageUrl: "post1.jpg" },
            action: "commented",
            comment: "아 씨 꼬우면 겜 접든가 ㅋㅋ"
        },
        {
            user: { username: "NIKITA", profileImage: "profile4.jpg" },
            post: { id: 104, title: "서울 여행", imageUrl: "post1.jpg" },
            action: "liked",
        },
        {
            user: { username: "G_dragon", profileImage: "profile1.jpg" },
            post: { id: 101, title: "부산 광안리", imageUrl: "post2.jpg" },
            action: "liked",
        },
        {
            user: { username: "Iron_man", profileImage: "profile3.jpg" },
            post: { id: 103, title: "부산 광안리", imageUrl: "post2.jpg" },
            action: "liked",
        },
    ];

    //----------------------------------------------------------------------------------------------
    // 임시데이터 (메세지)
    const temporarymessageData = [
        {
            username: "captain_america",
            profileImage: "profile2.jpg", // 프로필 사진 경로
            content: "이 장소는 어디인가요?",
        },
        {
            username: "Iron_man",
            profileImage: "profile3.jpg",
            content: "여행 정보가 궁금합니다!",
        },
        {
            username: "G_dragon",
            profileImage: "profile1.jpg",
            content: "안녕하세요!",
        },
    ];




//-----------------------------------------------------------------------------------------------
    const [user, setUser] = useState({ username: "user_1" });
    const [trips, setTrips] = useState([
        {
            id: 1,
            image: "post1.jpg", // 나중에 이미지 URL로 대체
            title: "서울에서 사기당한 썰 푼다.",
            likes: 1233,
            username: "user_101",
        },
        {
            id: 2,
            image: "post2.jpg",
            title: "부산에서 돈 뺏긴 썰 푼다.",
            likes: 2944,
            username: "user_102",
        },
        {
            id: 3,
            image: "post3.jpg",
            title: "실시간 강원도 출근길 ㅈ된거냐?",
            likes: 412,
            username: "user_103",
        },
        {
            id: 4,
            image: "post4.jpg",
            title: "대구가 사람 사는 곳이 맞냐?",
            likes: 1987,
            username: "user_104",
        },
    ]);
    const [hallOfFame, setHallOfFame] = useState([
        "user_1",
        "user_10asdas2",
        "I'm_girl",
        "user_132",
    ]);

    //-----------------------------------------------------------------------------------------------

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
                        <IoIosSearch className={styles.searchIcon} />
                    </div>

                    <button className={styles.createPostButton}>
                        + 새로운 게시물 만들기
                    </button>

                    {/* 알람 벨 버튼*/}
                    <PiBellRinging className={styles.bellicon} onClick={toggleBellBox}/>

                    {/* 메시지 버튼 */}
                    <LuMessageCircle className={styles.chaticon} onClick={toggleMessageBox} />

                    {/* 프로필아이콘, 사용자 이름 */}
                    <div className={styles.profileIcon}>
                        <img
                            src="profile4.jpg" // 사용자 프로필 이미지 경로
                            alt={`${user.username}'s profile`}
                            className={styles.profileImage}
                        />
                    </div>
                    <p className={styles.username}>{user.username}</p>

                    {/* 드롭아웃 토글 이벤트*/}
                    <IoChevronDown className={styles.dropdownIcon} onClick={toggleDropdown} />
                    {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <p className={styles.dropdownItem}>My 프로필</p> {/*마이 페이지 포트 설정*/}
                            <p className={styles.dropdownItem}>로그아웃</p> {/*로그아웃 포트 설정*/}
                        </div>
                    )}
                </div>
            </header>

            {/* 알림 창 */}
            {isBellOpen && (
                <div className={styles.bellBox}>
                    <h3>&ensp;알림</h3>
                    <hr className={styles.lines}/>
                    <ul className={styles.bellList}>
                        {temporaryBellData.map((notification, index) => (
                            <li key={index} className={styles.notificationItem}>
                                <img
                                    src={notification.user.profileImage}
                                    alt={`${notification.user.username}'s profile`}
                                    className={styles.profileImage}
                                />
                                <span className={styles.notificationText}>
                                    <strong>{notification.user.username}</strong>님이 회원님의 게시물{" "}
                                    <strong>&quot;{notification.post.title}&quot;</strong>에{" "}
                                    {notification.action === "liked"
                                        ? `스타포인트를 눌렀습니다.`
                                        : `댓글을 남겼습니다: "${notification.comment}"`}
                                </span>

                                <img
                                    src={notification.post.imageUrl}
                                    alt={`${notification.post.title}`}
                                    className={styles.postImage}
                                />
                                <hr className={styles.lines}/>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 메시지 창 */}
            {isMessageOpen && (
                <div className={styles.messageBox}>
                    <h3>&ensp;Trip Talk</h3>
                    <hr className={styles.lines} />
                    <ul className={styles.messageList}>
                        {temporarymessageData.map((message, index) => (
                            <li key={index} className={styles.messageItem}>
                                {/* 유저 프로필 사진 */}
                                <img
                                    src={message.profileImage}
                                    alt={`${message.username}'s profile`}
                                    className={styles.profileImage}
                                />
                                <span className={styles.messageText}>
                        <strong>{message.username}</strong>: {message.content}
                    </span>
                                <hr className={styles.lines} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Left Column */}
                <div className={styles.leftColumn}>
                    <h2 className={styles.sectionTitle}>Today&apos;s Trip</h2>
                    <div className={styles.gridContainer}>
                        {trips.map((trip) => (
                            <div
                                key={trip.id}
                                className={styles.card}
                                onClick={() => window.location.href = `/post/${trip.id}`} // 클릭 후 다른 게시물로 연결 포트
                                style={{cursor: "pointer"}} // 마우스 커서를 포인터로 변경
                            >
                                <img src={trip.image} alt={trip.title} className={styles.cardImage}/>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <p className={styles.cardTitle}>{trip.title}</p>
                                        <div className={styles.cardDetails}>
                                            <span className={styles.cardRating}>⭐ {trip.likes}k</span>
                                            <span className={styles.cardUser}>{trip.username}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Column */}
                <div className={styles.rightColumn}>
                    <h2 className={styles.hallOfFameTitle}>👑 명예의전당 👑</h2>
                    <hr className={styles.divider}/>
                    <p className={styles.hallOfFameSubtitle}>⭐스타 포인트 순위⭐</p>
                    <p className={styles.topUser}>가장 많은 포인트를 받은 유저</p>
                    <ul className={styles.hallOfFameList}>
                        {hallOfFame.map((user, index) => (
                            <li key={index} className={styles.hallOfFameItem}>
                                {index + 1 === 1 && "🥇"}
                                {index + 1 === 2 && "🥈"}
                                {index + 1 === 3 && "🥉"}
                                {index + 1 > 3 && "🏅"} {user}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
