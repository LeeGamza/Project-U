package com.example.backend;

import com.example.backend.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

@Service
public class UserService {

    // JWT Secret Key (환경변수 또는 application.yml에서 관리 권장)
    private static final String SECRET_KEY = "very-secure-secret-key";

    // JWT 만료 시간 (1시간)
    private static final long EXPIRATION_TIME = 3600000; // 1시간

    // 카카오 사용자 정보를 토대로 신규 사용자 생성 혹은 기존 사용자 조회
    public User findOrCreateUserByKakao(Object kakaoId, String email, String nickname) {
        // 실제로는 DB에서 사용자 조회 또는 신규 생성 로직 필요
        User user = new User();
        user.setId(1L); // DB에서 발급된 ID
        user.setKakaoId(String.valueOf(kakaoId));
        user.setEmail(email);
        user.setNickname(nickname);
        return user;
    }

    // JWT 발급
    public String createServiceToken(User user) {
        // 현재 시간과 만료 시간 계산
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        // JWT 생성
        return Jwts.builder()
                .setSubject(user.getId().toString()) // 사용자 ID를 서브젝트로 설정
                .claim("email", user.getEmail())     // 추가 클레임 (이메일)
                .claim("nickname", user.getNickname()) // 추가 클레임 (닉네임)
                .setIssuedAt(now)                    // 발급 시간
                .setExpiration(expiryDate)           // 만료 시간
                .signWith(SignatureAlgorithm.HS256, getSigningKey()) // 서명
                .compact();
    }

    // Secret Key 반환
    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }
}
