import React from "react";
import PostCard from "./postcard"; // PostCard 컴포넌트 가져오기
import styles from "../../_styles/MainPage.module.scss";

const MainContent: React.FC = () => {
    return (
        <div className={styles.leftColumn}>
            {/* 섹션 제목 */}
            <h2 className={styles.sectionTitle}>Today's Trip</h2>

            {/* 게시물 카드 렌더링 */}
            <PostCard />
        </div>
    );
};

export default MainContent;
