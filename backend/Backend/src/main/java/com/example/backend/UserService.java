package com.example.backend;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    // @Autowired UserRepository userRepository;
    // DB 접근을 위한 repository 또는 mapper

    // 카카오 사용자 정보를 토대로 신규 사용자 생성 혹은 기존 사용자 조회
    public User findOrCreateUserByKakao(Object kakaoId, String email, String nickname) {
        // 예시: 카카오 ID로 DB에서 조회, 없으면 새로 가입
        // User user = userRepository.findByKakaoId(kakaoId);
        // if (user == null) {
        //     user = new User(...);
        //     user.setKakaoId(kakaoId);
        //     user.setEmail(email);
        //     user.setNickname(nickname);
        //     userRepository.save(user);
        // }
        // return user;

        // 여기서는 간단하게 아무거나 리턴하는 예시
        User user = new User();
        user.setId(1L); // DB에서 발급된 ID
        user.setKakaoId(String.valueOf(kakaoId));
        user.setEmail(email);
        user.setNickname(nickname);
        return user;
    }

    // JWT 발급 (또는 세션 쿠키 생성)
    public String createServiceToken(User user) {
        // JWT 라이브러리 (io.jsonwebtoken) 사용 예시
        // SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        // String jws = Jwts.builder()
        //     .setSubject("user-auth")
        //     .claim("userId", user.getId())
        //     .claim("email", user.getEmail())
        //     .setIssuedAt(new Date())
        //     .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1시간
        //     .signWith(key)
        //     .compact();
        // return jws;

        // 간단 예시
        return "our-service-jwt-token-example";
    }
}
