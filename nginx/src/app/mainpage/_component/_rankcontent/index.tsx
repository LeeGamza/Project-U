import React from "react";
import RankList from "./ranklist"; // RankList 컴포넌트 가져오기
import styles from "../../_styles/MainPage.module.scss";

const RankContent: React.FC = () => {
    return (
        <div className={styles.rankContent}>
            {/* 명예의 전당 섹션 */}
            <RankList />
        </div>
    );
};

export default RankContent;
