"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import UpCard from "./upcard";
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

const UpSection: React.FC = () => {
    // 파일 인풋 ref (프로필 사진 변경용)
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 사용자 상태 (로그인된 사용자 정보)
    // 실제 서비스에서는 전역 상태나 쿠키/세션 등을 이용해 관리합니다.
    const [user, setUser] = useState({ id: 1, username: "user_1" });
    const [linkedAccount, setLinkedAccount] = useState<string>("");
    const [profileImg, setProfileImg] = useState("profile4.jpg");
    const [error, setError] = useState<string | null>(null);

    // 프로필 사진 변경 핸들러 (변경 후 백엔드에 저장 요청)
    const handleProfileImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            // 클라이언트에서 미리 읽어 UI 업데이트 (옵티미스틱 업데이트)
            const reader = new FileReader();
            reader.onload = async (event) => {
                const result = event.target?.result as string;
                setProfileImg(result);

                // 백엔드에 프로필 사진 업데이트 요청 (FormData 사용)
                const formData = new FormData();
                formData.append("profileImage", file);

                try {
                    const res = await axios.put(`/api/v1/users/${user.id}`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    const json = res.data;
                    if (json.status === 200) {
                        console.log("프로필 사진이 성공적으로 업데이트되었습니다.");
                    } else {
                        console.error("프로필 사진 업데이트 실패:", json.message);
                    }
                } catch (error) {
                    console.error("프로필 사진 업데이트 중 오류 발생:", error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // 로그인 정보 가져오기 (예: 연동 계정 정보)
    useEffect(() => {
        async function fetchLoginProvider() {
            try {
                const res = await axios.get(`/api/v1/users/${user.id}`);
                const result = res.data;
                if (result.status === 200) {
                    setLinkedAccount(result.data.linked_account);
                } else {
                    setError(result.message || "사용자 정보를 불러오지 못했습니다.");
                }
            } catch (err) {
                console.error(err);
                setError("로그인 정보를 가져오는 중 오류가 발생했습니다.");
            }
        }
        fetchLoginProvider();
    }, [user.id]);

    // → "내 프로필 중 가장 인기 있는 게시물" API 상태
    const [topPost, setTopPost] = useState<Post | null>(null);
    const [topPostLoading, setTopPostLoading] = useState(true);
    const [topPostError, setTopPostError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTopPost() {
            try {
                const res = await axios.get(`/api/v1/users/${user.id}/posts/top`);
                const result = res.data;
                if (result.status === 200) {
                    const post: Post = {
                        id: result.data.post_id,
                        image: result.data.image,
                        title: result.data.title,
                        likes: result.data.hits,
                        userId: result.data.user_id,
                        username: user.username, // 필요하다면 API에서 받아올 수 있음
                    };
                    setTopPost(post);
                } else {
                    setTopPostError(result.message);
                }
            } catch (err) {
                console.error(err);
                setTopPostError("Failed to fetch top post.");
            } finally {
                setTopPostLoading(false);
            }
        }
        fetchTopPost();
    }, [user.id, user.username]);

    return (
        <section className={styles.upsection}>
            {/* 왼쪽 섹션: 프로필 정보 */}
            <div className={styles.Leftsection}>
                <img
                    className={styles.sectionprofileimg}
                    src={profileImg}
                    alt="프로필 사진"
                />
                <br />
                <button
                    className={styles.sectionbutton}
                    onClick={() => fileInputRef.current?.click()}
                >
                    프로필 사진 변경하기
                </button>
                {/* 프로필 사진 변경을 위한 숨김 파일 인풋 */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleProfileImageChange}
                />
                <p className={styles.sectionusername}>{user.username}</p>
                <p>연동된 계정</p>
                <div className={styles.sectionservice}>
                    {linkedAccount ? (
                        <img
                            className={styles.sectionserviceimg}
                            src={`/${linkedAccount}.png`}
                            alt={`${linkedAccount} 연동`}
                        />
                    ) : (
                        <p>연동된 계정 정보를 불러오는 중...</p>
                    )}
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </div>

            {/* 가운데 구분선 */}
            <div className={styles.middleline}></div>

            {/* 오른쪽 섹션: 가장 인기 있는 게시물 */}
            <div className={styles.Rightsection}>
                <h3>내 프로필 중 가장 인기 있는 게시물</h3>
                {topPostLoading ? (
                    <p>Loading top post...</p>
                ) : topPostError ? (
                    <p>Error: {topPostError}</p>
                ) : topPost ? (
                    <UpCard
                        image={topPost.image}
                        title={topPost.title}
                        likes={topPost.likes}
                    />
                ) : (
                    <p>등록된 인기 게시물이 없습니다.</p>
                )}
            </div>
        </section>
    );
};

export default UpSection;
