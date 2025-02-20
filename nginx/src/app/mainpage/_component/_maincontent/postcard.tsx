import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../_styles/MainPage.module.scss";

// 게시물 타입 정의
interface Post {
    id: number;
    image: string;
    title: string;
    likes: number;
    userId: number;
    username: string;
    profileImage?: string;
}


const PostCard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]); // 게시물 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태

    // 게시물 데이터 가져오기
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await axios.get("/api/v1/posts");
                const result = response.data;

                if (result.status === 200) {
                    // API 응답 데이터를 변환
                    const postsData: Post[] = result.data.map((post: any) => ({
                        id: post.post_id,
                        image: post.image,
                        title: post.title,
                        likes: post.hits,
                        userId: post.user_id,
                        username: "unknown", // 기본값 설정
                    }));

                    // 각 게시물의 사용자 정보 추가
                    const postsWithUser = await Promise.all(
                        postsData.map(async (post) => {
                            try {
                                const userResponse = await axios.get(`/api/v1/users/${post.userId}`);
                                const userResult = userResponse.data;

                                if (userResult.status === 200) {
                                    return {
                                        ...post,
                                        username: userResult.data.username,
                                        profileImage: userResult.data.profileImage,
                                    };
                                }
                                return post; // 유저 정보가 없으면 기본값 유지
                            } catch (error) {
                                console.error(error);
                                return post; // 에러 발생 시 기본값 유지
                            }
                        })
                    );

                    setPosts(postsWithUser); // 상태 업데이트
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError("Failed to fetch posts.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
                <div className={styles.leftColumn}>
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className={styles.card}
                                onClick={() => (window.location.href = `/post/${post.id}`)}
                                style={{cursor: "pointer"}}
                            >
                                <img src={post.image} alt={post.title} className={styles.cardImage}/>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <p className={styles.cardTitle}>{post.title}</p>
                                        <div className={styles.cardDetails}>
                                            <span className={styles.cardRating}>⭐ {post.likes}k</span>
                                            <span className={styles.cardUser}>{post.username}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
    );
};

                export default PostCard;
