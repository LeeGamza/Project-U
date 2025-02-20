import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../_styles/MainPage.module.scss";

// 명예의 전당 데이터 타입 정의
interface Rank {
    username: string;
    points: number;
}

const RankList: React.FC = () => {
    const [rankings, setRankings] = useState<Rank[]>([]); // 명예의 전당 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태

    // 명예의 전당 데이터 가져오기
    useEffect(() => {
        async function fetchRankings() {
            try {
                const response = await axios.get("/api/v1/rank");
                const result = response.data;

                if (result.status === 200) {
                    setRankings(result.data); // 데이터 업데이트
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError("Failed to fetch rankings.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchRankings();
    }, []);

    return (
        <div className={styles.rightColumn}>
            <h2 className={styles.hallOfFameTitle}>👑 명예의전당 👑</h2>
            <hr className={styles.divider} />
            <p className={styles.hallOfFameSubtitle}>⭐ 스타 포인트 순위 ⭐</p>
            <p className={styles.topUser}>가장 많은 포인트를 받은 유저</p>

            {loading ? (
                <p>Loading ranking...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul className={styles.hallOfFameList}>
                    {rankings.map((rank, index) => (
                        <li key={index} className={styles.hallOfFameItem}>
                            {index + 1 === 1 && "🥇"}
                            {index + 1 === 2 && "🥈"}
                            {index + 1 === 3 && "🥉"}
                            {index + 1 > 3 && "🏅"} {rank.username} - {rank.points} points
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RankList;
