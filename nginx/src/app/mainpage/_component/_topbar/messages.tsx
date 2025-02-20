import React, { useState, useEffect } from "react";
import { LuMessageCircle } from "react-icons/lu";
import styles from "../../_styles/MainPage.module.scss";

interface Message {
    username: string;
    profileImage: string;
    content: string;
}

const Messages: React.FC = () => {
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    // 메시지 창 토글 함수
    const toggleMessageBox = () => setIsMessageOpen((prev) => !prev);

    // 메시지 창 외부 클릭 감지
    useEffect(() => {
        const handleClickOutsideMessage = (event: MouseEvent) => {
            if (
                !(event.target as HTMLElement).closest(`.${styles.messageBox}`) &&
                !(event.target as HTMLElement).closest(`.${styles.chaticon}`)
            ) {
                setIsMessageOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutsideMessage);
        return () =>
            document.removeEventListener("click", handleClickOutsideMessage);
    }, []);

    // 임시 데이터 (메시지)
    const temporarymessageData: Message[] = [
        {
            username: "captain_america",
            profileImage: "profile2.jpg",
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

    return (
        <div>
            {/* 메시지 버튼 */}
            <LuMessageCircle
                className={styles.chaticon}
                onClick={toggleMessageBox}
            />

            {/* 메시지 창 */}
            {isMessageOpen && (
                <div className={styles.messageBox}>
                    <h3>&ensp;Trip Talk</h3>
                    <hr className={styles.lines} />
                    <ul className={styles.messageList}>
                        {temporarymessageData.map((message, index) => (
                            <li key={index} className={styles.messageItem}>
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
        </div>
    );
};

export default Messages;
