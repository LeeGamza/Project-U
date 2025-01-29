package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    @Value("${kakao.rest-api-key}") // ✅ Spring의 @Value 사용 (올바른 import)
    private String kakaoRestApiKey;

    private static final String SECRET_KEY = "very-very-very-secure-secret-key";
    private static final long EXPIRATION_TIME = 3600000; // 1시간

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        System.out.println("Google Client ID: " + googleClientId);
    }

    public UserService(UserRepository userRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    public void printGoogleCredentials() {
        System.out.println("Google Client ID: " + googleClientId);
        System.out.println("Google Client Secret: " + googleClientSecret);
    }

    // ✅ 카카오 로그인 - 유저 찾기 또는 생성 (리프레시 토큰 저장 추가)
    public User findOrCreateUserByKakao(String kakaoId, String email, String nickname, String refreshToken) {
        Optional<User> existingUser = Optional.ofNullable(userRepository.findByKakaoId(kakaoId));

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // 🔹 기존 유저라면 리프레시 토큰 갱신
            if (refreshToken != null) {
                user.setRefreshToken(refreshToken);
                userRepository.save(user);
            }
            return user;
        }

        // 🔹 신규 유저 생성 (리프레시 토큰 포함)
        User newUser = new User();
        newUser.setKakaoId(kakaoId);
        newUser.setEmail(email);
        newUser.setNickname(nickname);
        newUser.setRefreshToken(refreshToken);
        userRepository.save(newUser);

        return newUser;
    }

    // ✅ Google 로그인 로직 (리프레시 토큰 저장 추가)
    public User findOrCreateUserByGoogle(String email, String name, String refreshToken) {
        Optional<User> existingUser = Optional.ofNullable(userRepository.findByEmail(email));

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (refreshToken != null) {
                user.setRefreshToken(refreshToken);
            }
            return userRepository.save(user);
        }

        // 신규 유저 생성
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setNickname(name);
        newUser.setRefreshToken(refreshToken);
        newUser.setPassword("");
        newUser.setCreatedAt(LocalDateTime.now());

        return userRepository.save(newUser);
    }

    // ✅ 리프레시 토큰을 이용한 사용자 조회
    public User getUserByRefreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken).orElse(null);
    }

    // ✅ JWT 발급 (액세스 토큰)
    public String createServiceToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(user.getUserId().toString())
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // ✅ 최신 방식 적용
                .compact();
    }

    // ✅ JWT 토큰 검증
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

    // ✅ Google 리프레시 토큰을 이용한 액세스 토큰 재발급
    public String refreshAccessToken(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> requestEntity = new HttpEntity<>(
                "client_id=" + googleClientId +
                        "&client_secret=" + googleClientSecret +
                        "&refresh_token=" + refreshToken +
                        "&grant_type=refresh_token",
                headers
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        }

        return null;
    }

    // ✅ 카카오 리프레시 토큰을 이용한 새로운 액세스 토큰 요청
    public String refreshKakaoAccessToken(String refreshToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "refresh_token");
            params.add("client_id", Objects.requireNonNull(kakaoRestApiKey)); // ✅ Null 보호
            params.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity("https://kauth.kakao.com/oauth/token", requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("access_token"); // ✅ 새 액세스 토큰 반환
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // 리프레시 토큰이 만료되었거나 실패한 경우
    }

    // ✅ Secret Key 반환 (최신 JWT 방식 적용)
    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }
}
