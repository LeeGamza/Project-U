package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.Date;

@Service
public class UserService {

    // JWT Secret Key (환경변수 또는 application.yml에서 관리 권장)
    private static final String SECRET_KEY = "very-very-very-secure-secret-key";

    // JWT 만료 시간 (1시간)
    private static final long EXPIRATION_TIME = 3600000; // 1시간

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findOrCreateUserByKakao(Object kakaoId, String email, String nickname) {
        // 1) kakaoId로 DB 조회
        String kakaoIdStr = String.valueOf(kakaoId);
        User user = userRepository.findByKakaoId(kakaoIdStr);

        // 2) DB에 이미 존재하면 그대로 반환
        if (user != null) {
            return user;
        }

        // 3) 없으면 새로 만들어서 저장
        User newUser = new User();
        newUser.setKakaoId(kakaoIdStr);
        newUser.setEmail(email);
        newUser.setNickname(nickname);

        newUser.setPassword(""); // 비밀번호가 필요 없어서 ""-> null값으로 처리하려고 비워놨음
        newUser.setCreatedAt(LocalDateTime.now()); // 가입 시점 기록
        newUser.setRecordUserId(0);                // 기본값 0
        newUser.setVisitedLocationUserId(0);
        newUser.setLikeUserId(0);
        newUser.setSearchlogUserId(0);

        // 4) 새 유저를 DB에 저장
        userRepository.save(newUser);

        return newUser;
    }

    public com.example.backend.Entity.User findOrCreateUserByGoogle(String email, String name) {
        // 1) 이메일로 유저 검색
        com.example.backend.Entity.User user = userRepository.findByEmail(email);

        // 2) 유저가 없으면 새로 생성
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setNickname(name);
            user.setPassword(""); // 빈 문자열로 기본 설정
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
        return user;
    }

    // JWT 발급
    public String createServiceToken(User user) {
        // 현재 시간과 만료 시간 계산
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        // JWT 생성
        return Jwts.builder()
                .setSubject(user.getUserId().toString()) // 사용자 ID를 서브젝트로 설정
                .claim("email", user.getEmail())     // 추가 클레임 (이메일)
                .claim("nickname", user.getNickname()) // 추가 클레임 (닉네임)
                .setIssuedAt(now)                    // 발급 시간
                .setExpiration(expiryDate)           // 만료 시간
                .signWith(SignatureAlgorithm.HS256, getSigningKey()) // 서명
                .compact();
    }

    public boolean validateUserToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Secret Key 반환
    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }
}
