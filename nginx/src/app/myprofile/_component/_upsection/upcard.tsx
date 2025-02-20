"use client";

import React from "react";
import styles from "../../_styles/Myprofile.module.scss";

interface UpCardProps {
    image: string;
    title: string;
    likes: number;
}

const UpCard: React.FC<UpCardProps> = ({ image, title, likes }) => {
    return (
        <div className={styles.rightimgsection}>
            <img className={styles.rightimg} src={image} alt={title} />
            <div className={styles.rightpostset}>
                <span className={styles.rightpostname}>{title}</span>
                <span className={styles.rightstarpoint}>{likes}⭐</span>
            </div>
        </div>
    );
};

export default UpCard;
