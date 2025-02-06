package com.example.backend.Entity;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.aspectj.bridge.IMessage;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users") // MySQL 테이블 이름 지정
public class User {

    //테이블 수정 예정이라 바뀔 예정

    // === PK (Primary Key) ===
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    @Column(name = "user_id")
    private Long userId;

    // === 카카오 로그인용 ID (DB 컬럼명: kakao_id) ===
    @Column(name = "kakao_id")
    private String kakaoId;

    @Column(name = "email", nullable = false, unique = true, length = 40)

    private String email;

    @Column(name = "password",nullable = false, length = 40)
    private String password;

    @Column(name = "nickname", length = 20)
    private String nickname;

    @Column(name = "profile_image")
    private String profileImage;

    @CreationTimestamp // 자동으로 현재 시간을 저장
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "record_user_id")
    private int recordUserId;

    @Column(name = "visited_location_user_id")
    private int visitedLocationUserId;

    @Column(name = "like_user_id")
    private int likeUserId;

    @Column(name = "searchlog_user_id")
    private int searchlogUserId;

    @Column(name = "provider")
    private String provider;


    @Column(length = 500)
    private String refreshToken; // 리프레시 토큰 저장

    // Getter, Setter
    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(String kakaoId) {
        this.kakaoId = kakaoId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getRecordUserId() {
        return recordUserId;
    }

    public void setRecordUserId(int recordUserId) {
        this.recordUserId = recordUserId;
    }

    public int getVisitedLocationUserId() {
        return visitedLocationUserId;
    }

    public void setVisitedLocationUserId(int visitedLocationUserId) {
        this.visitedLocationUserId = visitedLocationUserId;
    }

    public int getLikeUserId() {
        return likeUserId;
    }

    public void setLikeUserId(int likeUserId) {
        this.likeUserId = likeUserId;
    }

    public int getSearchlogUserId() {
        return searchlogUserId;
    }

    public void setSearchlogUserId(int searchlogUserId) {
        this.searchlogUserId = searchlogUserId;
    }

    public String getProvider() {
        return provider;
    }
    public void setProvider(String provider) {
        this.provider = provider;
    }
    // === toString ===
    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", kakaoId='" + kakaoId + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", nickname='" + nickname + '\'' +
                ", profileImage='" + profileImage + '\'' +
                ", createdAt=" + createdAt +
                ", recordUserId=" + recordUserId +
                ", visitedLocationUserId=" + visitedLocationUserId +
                ", likeUserId=" + likeUserId +
                ", searchlogUserId=" + searchlogUserId +
                '}';
    }
}
