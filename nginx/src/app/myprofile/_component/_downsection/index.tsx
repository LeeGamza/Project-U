"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../_styles/Myprofile.module.scss";

// API 응답에 맞춘 게시물 데이터 타입
export interface Post {
    id: number;
    image: string;
    title: string;
    likes: number;
    userId: number;
    username: string;
    profileImage?: string;
    createdAt?: string;
}

const DownSection: React.FC = () => {
    // 사용자 상태 (예시)
    const [user, setUser] = useState({ id: 1, username: "user_1" });
    // 프로필 이미지 (게시물 카드에 표시할 유저 이미지)
    const [profileImg, setProfileImg] = useState("profile4.jpg");

    // "내가 공유한 추억들" 게시물 상태
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userPostsLoading, setUserPostsLoading] = useState(true);
    const [userPostsError, setUserPostsError] = useState<string | null>(null);

    // 게시물 불러오기 API 호출
    useEffect(() => {
        async function fetchUserPosts() {
            try {
                const res = await axios.get(`/api/v1/users/${user.id}/posts`);
                const result = res.data;
                if (result.status === 200) {
                    // API의 게시물 데이터를 Post 타입에 맞게 매핑
                    const fetchedPosts: Post[] = result.data.map((post: any) => ({
                        id: post.post_id,
                        image: post.image,
                        title: post.title,
                        likes: post.hits,
                        userId: post.user_id,
                        username: user.username, // 필요 시 API에서 받아올 수 있음
                        createdAt: post.created_at,
                    }));
                    setUserPosts(fetchedPosts);
                } else {
                    setUserPostsError(result.message);
                }
            } catch (err) {
                console.error(err);
                setUserPostsError("게시물을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setUserPostsLoading(false);
            }
        }
        fetchUserPosts();
    }, [user.id, user.username]);

    return (
        <section>
            <p className={styles.sharetitle}>
                내가 공유한 추억들
                <button
                    className={styles.gotomymap}
                    onClick={() => (window.location.href = "/myPage")}
                >
                    나만의 지도 보러가기
                </button>
            </p>
            <div className={styles.downsection}>
                {userPostsLoading ? (
                    <p>게시물을 불러오는 중...</p>
                ) : userPostsError ? (
                    <p>Error: {userPostsError}</p>
                ) : userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div className={styles.cardslot} key={post.id}>
                            <img
                                className={styles.cardimg}
                                src={post.image}
                                alt={post.title}
                            />
                            <div className={styles.cardinformation}>
                                <div className={styles.cardtitle}>
                                    <p className={styles.posttitle}>{post.title}</p>
                                    <div className={styles.cardstarpoint}>
                                        <span>{post.likes}⭐</span>
                                    </div>
                                </div>
                                <div className={styles.carduserinfo}>
                                    <img
                                        className={styles.carduserimg}
                                        src={profileImg}
                                        alt="User Profile"
                                    />
                                    <span className={styles.cardusername}>{user.username}</span>
                                </div>
                                <p className={styles.carddate}>
                                    작성일:{" "}
                                    {post.createdAt
                                        ? new Date(post.createdAt).toLocaleString()
                                        : ""}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>게시물이 없습니다.</p>
                )}
            </div>
        </section>
    );
};

export default DownSection;
