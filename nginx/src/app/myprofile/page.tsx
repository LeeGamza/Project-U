"use client";

import React, { useState , useEffect } from "react";
import { PiBellRinging } from "react-icons/pi";
import { LuMessageCircle } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";

import styles from "./Myprofile.module.scss"

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

    //----------------------------------------------------------------------------------------------------
    // 임시데이터 (인기 게시물 카드슬롯)

    const userData = {
        profileImage: "profile4.jpg",
        userName: "user_1",
        linkedAccount: "kakao", // "google"로 변경 가능
    };

    const popularPost = {
        image: "post1.jpg",
    };

    const postData = {
        title: "서울 집값 떡상",
        starPoints: "5.2K⭐",
    };

    //-----------------------------------------------------------------------------------------------------
    // 임시데이터 (공유한 추억들)
    const posts = [
        {
            title: "서울 집값 떡상",
            imageUrl: "post1.jpg",
            starPoints: "5.2K", // 별점 정보
            date: "2025년 1월 21일 18:32", // 작성일
        },
        {
            title: "부산 야경 직입니다.",
            imageUrl: "post2.jpg",
            starPoints: "3.1K",
            date: "2024년 11월 18일 21:15",
        },
        {
            title: "대구는 해가 질 때도 덥다",
            imageUrl: "post4.jpg",
            starPoints: "2.2K",
            date: "2024년 8월 18일 14:00",
        },
        {
            title: "부산 야경 맛집 모르면 나가라.",
            imageUrl: "post2.jpg",
            starPoints: "1.1K",
            date: "2024년 5월 13일 09:45",
        },
        {
            title: "제주도 보소..",
            imageUrl: "post1.jpg",
            starPoints: "4.8K",
            date: "2023년 10월 10일 12:00",
        },
        {
            title: "대구 날씨 이게 맞냐?",
            imageUrl: "post4.jpg",
            starPoints: "5.1K",
            date: "2023년 8월 12일 14:00",
        },
        {
            title: "겨울 설원의 평화.",
            imageUrl: "post3.jpg",
            starPoints: "3.7K",
            date: "2023년 7월 25일 07:30",
        },
    ];



//-----------------------------------------------------------------------------------------------
    const [user, setUser] = useState({ username: "user_1" });

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
                        <IoIosSearch className={styles.searchIcon}/>
                    </div>

                    <button className={styles.createPostButton}>
                        + 새로운 게시물 만들기
                    </button>

                    {/* 알람 벨 버튼*/}
                    <PiBellRinging className={styles.bellicon} onClick={toggleBellBox}/>

                    {/* 메시지 버튼 */}
                    <LuMessageCircle className={styles.chaticon} onClick={toggleMessageBox}/>

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
                    <IoChevronDown className={styles.dropdownIcon} onClick={toggleDropdown}/>
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
                    <hr className={styles.lines}/>
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
                                <hr className={styles.lines}/>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/*-----------------------------------------메인 콘텐츠 ------------------------------------------------------*/}
            {/* 인기 게시물 */}
            <section className={styles.upsection}>
                {/* 왼쪽 프로필 섹션 */}
                <div className={styles.Leftsection}>
                    <img className={styles.sectionprofileimg}
                         src={userData.profileImage}
                         alt="프로필 사진"/><br/>
                    <button className={styles.sectionbutton}>
                        프로필 사진 변경하기
                    </button>
                    <p className={styles.sectionusername}>
                        {userData.userName}</p>
                    <p>연동된 계정</p>
                    <div className={styles.sectionservice}>
                        <img className={styles.sectionserviceimg}
                             src={`/${userData.linkedAccount}.png`}
                             alt={`${userData.linkedAccount} 연동`}/>
                        {/* 또는 */}
                        {/*<img src="/google-icon.png" alt="구글 연동" style={{width: "30px", height: "30px"}}>*/}
                    </div>
                </div>

                {/* 중간 구분선 */}
                <div className={styles.middleline}></div>
                <div className={styles.Rightsection}>
                    {/* 가장 인기 있는 게시물 */}
                    <h3>내 프로필 중 가장 인기 있는 게시물</h3>
                    <div className={styles.rightimgsection}>
                        <img className={styles.rightimg}
                             src={popularPost.image}/>
                    </div>
                    <div className={styles.rightpostset}>
                        {/* 게시물 이름 */}
                        <span className={styles.rightpostname}>{postData.title}</span>
                        {/* 스타포인트 */}
                        <span className={styles.rightstarpoint}>{postData.starPoints}</span>
                    </div>
                </div>
            </section>

            {/*----------------------------------------------------------------------------------------------------------------------------*/}

            {/* 공유한 추억들 */}
            <section style={{marginTop: "30px"}}>
                <p className={styles.sharetitle}>
                    내가 공유한 추억들
                    <button className={styles.gotomymap}>나만의 지도 보러가기</button></p>

                <div className={styles.downsection}>
                    {posts.slice(0, 10).map((post, index) => (
                        <div className={styles.cardslot} key={index}>
                            {/* 게시물 이미지 */}
                            <img className={styles.cardimg} src={post.imageUrl} alt={post.title}/>

                            {/* 게시물 텍스트와 정보 */}
                            <div className={styles.cardinformation}>

                                {/* 제목과 스타 포인트 */}
                                <div className={styles.cardtitle}>
                                    <p className={styles.posttitle}> {post.title}</p>
                                    <div className={styles.cardstarpoint}><span>{post.starPoints}⭐</span></div>
                                </div>

                                {/* 작성자 정보 개인 프로필이기 때문에 무조건 유저 정보와 사진이 고정으로 존재해야함 */}
                                <div className={styles.carduserinfo}>
                                    <img className={styles.carduserimg}
                                        src="profile4.jpg"
                                        alt="User Profile"/>
                                    <span className={styles.cardusername}>user_1</span></div>

                                {/* 작성일 */}
                                <p className={styles.carddate}>작성일:{post.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default Home;
