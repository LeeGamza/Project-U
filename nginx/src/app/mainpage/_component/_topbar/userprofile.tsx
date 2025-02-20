import React, { useState } from "react";
import styles from "../../_styles/MainPage.module.scss";

const UserProfile: React.FC = () => {
    // 사용자 상태
    const [user] = useState({ username: "user_1", profileImage: "profile4.jpg" });

    return (
        <>
            {/* 프로필 아이콘 */}
            <div className={styles.profileIcon}>
                <img
                    src={user.profileImage}
                    alt={`${user.username}'s profile`}
                    className={styles.profileImage}
                />
            </div>
            {/* 사용자 이름 */}
            <p className={styles.username}>{user.username}</p>
        </>
    );
};

export default UserProfile;
