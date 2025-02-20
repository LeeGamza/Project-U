import React, { useState, useEffect } from "react";
import { PiBellRinging } from "react-icons/pi";
import styles from "../../_styles/MainPage.module.scss";

// 인터페이스 정의
interface User {
    username: string;
    profileImage: string;
}

interface Post {
    id: number;
    title: string;
    imageUrl: string;
}

interface Notification {
    user: User;
    post: Post;
    action: "liked" | "commented"; // 가능한 값 제한
    comment?: string; // 댓글은 선택적(optional) 속성
}

const Notifications: React.FC = () => {


    const [isBellOpen, setIsBellOpen] = useState(false);

    // 알림 데이터 상태 (초기값 설정)
    const [notifications, setNotifications] = useState<Notification[]>([
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
            comment: "이정도는 되야 미국의 엉덩이지.",
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
    ]);

    // 알림 창 토글 함수
    const toggleBellBox = () => setIsBellOpen((prev) => !prev);

    // 외부 클릭 감지 로직
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
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            {/* 알림 버튼 */}
            <PiBellRinging className={styles.bellicon} onClick={toggleBellBox} />

            {/* 알림 창 */}
            {isBellOpen && (
                <div className={styles.bellBox}>
                    <h3>&ensp;알림</h3>
                    <hr className={styles.lines} />
                    <ul className={styles.bellList}>
                        {notifications.map((notification, index) => (
                            <li key={index} className={styles.notificationItem}>
                                {/* 사용자 프로필 이미지 */}
                                <img
                                    src={notification.user.profileImage}
                                    alt={`${notification.user.username}'s profile`}
                                    className={styles.profileImage}
                                />

                                {/* 알림 텍스트 */}
                                <span className={styles.notificationText}>
                  <strong>{notification.user.username}</strong>님이 회원님의 게시물{" "}
                                    <strong>&quot;{notification.post.title}&quot;</strong>에{" "}
                                    {notification.action === "liked"
                                        ? "스타포인트를 눌렀습니다."
                                        : `댓글을 남겼습니다: "${notification.comment}"`}
                </span>

                                {/* 게시물 이미지 */}
                                <img
                                    src={notification.post.imageUrl}
                                    alt={`${notification.post.title}`}
                                    className={styles.postImage}
                                />
                                <hr className={styles.lines} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Notifications;
