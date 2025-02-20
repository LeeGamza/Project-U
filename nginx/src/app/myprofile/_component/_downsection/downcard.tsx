import React from "react";
import styles from "../../_styles/Myprofile.module.scss";

interface DownCardProps {
    image: string;
    title: string;
    likes: number;
    username: string;
    profileImage?: string;
    createdAt?: string;
}

const DownCard: React.FC<DownCardProps> = ({
                                               image,
                                               title,
                                               likes,
                                               username,
                                               profileImage,
                                               createdAt,
                                           }) => (
    <div className={styles.cardslot}>
        <img className={styles.cardimg} src={image} alt={title} />
        <div className={styles.cardinformation}>
            <div className={styles.cardtitle}>
                <p className={styles.posttitle}>{title}</p>
                <div className={styles.cardstarpoint}>
                    <span>{likes}⭐</span>
                </div>
            </div>
            <div className={styles.carduserinfo}>
                <img
                    className={styles.carduserimg}
                    src={profileImage || "/default-profile.png"}
                    alt={`${username}'s profile`}
                />
                <span className={styles.cardusername}>{username}</span>
            </div>
            <p className={styles.carddate}>
                작성일: {createdAt ? new Date(createdAt).toLocaleString() : "알 수 없음"}
            </p>
        </div>
    </div>
);

export default DownCard;
