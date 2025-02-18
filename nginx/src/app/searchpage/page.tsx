"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "./_component/Header";
import { NotificationBox } from "./_component/NotificationBox";
import { MessageBox } from "./_component/MessageBox";
import { PostList } from "./_component/PostList";
import styles from "./_styles/searchPage.module.scss";

interface Post {
    post_id: number;
    user_id: number;
    location_id: number;
    title: string;
    content: string;
    image: string;
    hits: number;
    created_at: string;
}

const Home: React.FC = () => {
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("/api/posts");
            setPosts(response.data.data);
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
            setError("서버 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className={styles.container}>
            <Header
                onBellClick={() => setIsBellOpen((prev) => !prev)}
                onMessageClick={() => setIsMessageOpen((prev) => !prev)}
            />

            {isBellOpen && <NotificationBox />}
            {isMessageOpen && <MessageBox />}

            <div className={styles.mainContent}>
                <h2 className={styles.sectionHeaderText}>{"'서울'에 대한 검색결과"}</h2>
                <div className={styles.divider}></div>

                <p className={styles.subHeaderText}>서울을 가본 사람들의 추억</p>
                <PostList posts={posts} loading={loading} error={error} />
            </div>
        </div>
    );
};

export default Home;
