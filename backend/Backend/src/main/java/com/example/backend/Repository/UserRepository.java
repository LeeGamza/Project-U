package com.example.backend.Repository;

import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// 엔티티(User), 기본키 타입(Long)
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 특정 필드(kakaoId) 기준으로 사용자 검색하는 쿼리 메서드 예시
    User findByKakaoId(String kakaoId);

    User findByEmail(String email);
}
