package com.example.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // MySQL 테이블 이름 지정
public class User {

    private Long id;
    private String kakaoId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Primary Key, AUTO_INCREMENT
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email", nullable = false, length = 40)
    private String email;

    @Column(name = "password", nullable = false, length = 40)
    private String password;

    @Column(name = "nickname", nullable = false, length = 20)
    private String nickname;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "record_user_id", nullable = false)
    private int recordUserId;

    @Column(name = "visited_location_user_id", nullable = false)
    private int visitedLocationUserId;

    @Column(name = "like_user_id", nullable = false)
    private int likeUserId;

    @Column(name = "searchlog_user_id", nullable = false)
    private int searchlogUserId;

    // Getters and Setters 부분
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(String kakaoId) {
        this.kakaoId = kakaoId;
    }


    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
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
