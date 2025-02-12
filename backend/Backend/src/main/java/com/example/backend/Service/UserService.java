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
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    @Value("${kakao.rest-api-key}")
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

    // --- 카카오 로그인 관련 ---
    public User findOrCreateUserByKakao(String kakaoId, String email, String nickname, String refreshToken, Map<String, Object> kakaoUserInfo) {
        Optional<User> existingUser = Optional.ofNullable(userRepository.findByKakaoId(kakaoId));

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // 기존 유저라면 리프레시 토큰 갱신
            if (refreshToken != null) {
                user.setRefreshToken(refreshToken);
                userRepository.save(user);
            }
            return user;
        }
        // 이메일이 없으면 임시 이메일 생성
        if (email == null || email.isEmpty()) {
            Map<String, Object> accountMap = (Map<String, Object>) kakaoUserInfo.get("kakao_account");
            if (accountMap != null && accountMap.containsKey("email_needs_agreement")) {
                boolean emailNeedsAgreement = (boolean) accountMap.get("email_needs_agreement");
                if (emailNeedsAgreement) {
                    throw new IllegalArgumentException("사용자가 이메일 제공에 동의하지 않았습니다. 카카오 로그인 페이지에서 이메일 제공 동의를 해주세요.");
                }
            }
            email = "kakao_" + kakaoId + "@kakao.com";
            System.out.println("이메일이 없어서 임시 이메일 생성: " + email);
        }

        // 신규 유저 생성
        User newUser = new User();
        newUser.setKakaoId(kakaoId);
        newUser.setEmail(email);
        newUser.setNickname(nickname);
        newUser.setRefreshToken(refreshToken);
        newUser.setPassword("");
        userRepository.save(newUser);
        return newUser;
    }

    public User findOrCreateUserByGoogle(String email, String googleId, String name, String refreshToken) {
        System.out.println("Google Client ID: " + googleId.trim());

        if (googleId == null || googleId.trim().isEmpty()) {
            System.out.println("❌ [ERROR] googleId is null or empty");
            throw new IllegalArgumentException("googleId cannot be null or empty");
        }

        // 검색할 googleId 출력 (디버깅 용도)
        System.out.println("🔍 [DEBUG] 검색할 googleId: " + googleId);

        // DB에서 googleId로 유저 검색
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            System.out.println("✅ [SUCCESS] 유저 조회 성공: " + user);
            System.out.println("📌 이메일: " + user.getEmail());
            System.out.println("📌 Google ID: " + user.getGoogleId());
            System.out.println("📌 닉네임: " + user.getNickname());
            System.out.println("📌 닉네임: " + user.getNickname());

            // 🔹 `user` 필드 중 null 값이 있는지 체크
            if (user.getEmail() == null || user.getGoogleId() == null) {
                System.out.println("❌ [ERROR] 필수 정보 누락: 이메일 또는 Google ID가 null");
                throw new NullPointerException("User email or Google ID is null");
            }

            // 리프레시 토큰이 있으면 업데이트
            if (refreshToken != null) {
                user.setRefreshToken(refreshToken);
                userRepository.save(user);  // 🔹 저장 후 반환
            }
            return user;
        }

        System.out.println("❌ [ERROR] 유저를 찾을 수 없습니다. 새 유저 생성: googleId = " + googleId);

        // 신규 유저 생성
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setGoogleId(googleId);
        newUser.setNickname(name);
        newUser.setRefreshToken(refreshToken);
        newUser.setPassword("");
        newUser.setCreatedAt(LocalDateTime.now());

        // 🔹 `newUser` 필드 중 null 값이 있는지 체크
        if (newUser.getEmail() == null || newUser.getGoogleId() == null) {
            System.out.println("❌ [ERROR] 새 유저 필수 정보 누락: 이메일 또는 Google ID가 null");
            throw new NullPointerException("New user email or Google ID is null");
        }

        return userRepository.save(newUser);
    }

    // ✅ Google Access Token을 이용하여 사용자 정보 가져오기
    public Map<String, Object> getGoogleUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    requestEntity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                System.out.println("❌ [ERROR] Google 사용자 정보 조회 실패: " + response.getStatusCode());
                return null;
            }

            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public User getUserByRefreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken).orElse(null);
    }

    // JWT 발급 (액세스 토큰)
    public String createServiceToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);
        return Jwts.builder()
                .setSubject(user.getUserId().toString())
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
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

    // Google 리프레시 토큰을 이용한 액세스 토큰 재발급
    public String refreshAccessToken(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<String> requestEntity = new HttpEntity<>(
                "client_id=" + googleClientId +
                        "&client_secret=" + googleClientSecret +
                        "&refresh_token=" + refreshToken +
                        "&grant_type=refresh_token",
                headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                requestEntity,
                Map.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        }
        return null;
    }

    // 카카오 리프레시 토큰을 이용한 새로운 액세스 토큰 요청
    public String refreshKakaoAccessToken(String refreshToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "refresh_token");
            params.add("client_id", Objects.requireNonNull(kakaoRestApiKey));
            params.add("refresh_token", refreshToken);
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity("https://kauth.kakao.com/oauth/token", requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    public Map<String, Object> processGoogleAccessToken(String accessToken) {
        System.out.println("? 받은 accessToken: " + accessToken);

        // 1️⃣ 구글 사용자 정보 가져오기
        Map<String, Object> userInfo = getGoogleUserInfo(accessToken);

        if (userInfo == null) {
            System.out.println("❌ [ERROR] Google 사용자 정보를 가져올 수 없습니다!");
            return null;
        }

        String email = (String) userInfo.get("email");
        String googleId = (String) userInfo.get("sub");
        String name = (String) userInfo.get("name");
        String refreshToken = null; // refreshToken은 처음 로그인 시 null일 수 있음

        System.out.println("? [DEBUG] 검색할 googleId: " + googleId);

        // 2️⃣ 사용자 정보 저장 또는 조회
        User user = findOrCreateUserByGoogle(email, googleId, name, refreshToken);

        if (user == null) {
            System.out.println("❌ [ERROR] user가 null입니다!");
            throw new IllegalArgumentException("user cannot be null");
        }

        // 3️⃣ JWT 액세스 토큰 생성
        String serviceToken = createServiceToken(user);

        if (serviceToken == null) {
            System.out.println("❌ [ERROR] 생성된 서비스 토큰이 null!");
        }

        if (refreshToken == null) {
            System.out.println("❌ [ERROR] refreshToken is null!");
            refreshToken = ""; // 기본 빈 문자열로 대체
        }

        System.out.println("? [DEBUG] 발급된 서비스 토큰: " + serviceToken);
        System.out.println("? [DEBUG] 리프레시 토큰: " + refreshToken);

        return Map.of(
                "access_token", serviceToken,
                "refresh_token", refreshToken // null 값 방지
        );
    }



}
