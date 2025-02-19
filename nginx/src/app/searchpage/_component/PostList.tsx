import React from "react";
import styles from "../_styles/searchPage.module.scss";

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

interface PostListProps {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

export const PostList: React.FC<PostListProps> = ({ posts, loading, error }) => {
    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className={styles.errorText}>{error}</p>;

    return (
        <div className={styles.cardGrid}>
            {posts.map((post) => (
                <div key={post.post_id} className={styles.card}>
                    <img src={post.image} alt={post.title} />
                    <div className={styles.cardContent}>
                        <div className={styles.cardTitle}>{post.title}</div>
                        <div className={styles.cardAuthor}>
                            <img src="/profile4.jpg" alt="Author" />
                            <span>{post.user_id}</span>
                        </div>
                        <div className={styles.cardMeta}>
                            <span>{post.hits} ⭐</span>
                            <span className={styles.cardDate}>작성일: {post.created_at}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};