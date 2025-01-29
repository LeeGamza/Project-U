package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

// ✅ 액세스 토큰 + 리프레시 토큰 관리 추가
@RestController
@RequestMapping("/api/auth")
public class KakaoLoginController {

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final RestTemplate restTemplate;
    private final UserService userService;

    public KakaoLoginController(RestTemplate restTemplate, UserService userService) {
        this.restTemplate = restTemplate;
        this.userService = userService;
    }

    // ✅ 카카오 로그인 API (리프레시 토큰 저장 포함)
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body("Authorization code is missing");
        }

        // ✅ 카카오 액세스 토큰 및 리프레시 토큰 요청
        Map<String, String> tokens = getKakaoAccessToken(code);
        String accessToken = tokens.get("access_token");
        String refreshToken = tokens.get("refresh_token");

        if (accessToken == null || refreshToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve Kakao tokens");
        }

        // ✅ 카카오 사용자 정보 가져오기
        Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
        if (kakaoUserInfo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve Kakao user info");
        }

        Object kakaoId = kakaoUserInfo.get("id");
        Map<String, Object> accountMap = (Map<String, Object>) kakaoUserInfo.get("kakao_account");

        String email = null;
        String nickname = null;

        if (accountMap != null) {
            email = (String) accountMap.get("email");
            Map<String, Object> profileMap = (Map<String, Object>) accountMap.get("profile");
            if (profileMap != null) {
                nickname = (String) profileMap.get("nickname");
            }
        }

        // ✅ 사용자 저장 (리프레시 토큰도 함께 저장)
        User user = userService.findOrCreateUserByKakao(String.valueOf(kakaoId), email, nickname, refreshToken);
        String serviceToken = userService.createServiceToken(user);

        // ✅ 클라이언트에 액세스 토큰 & 리프레시 토큰 반환
        return ResponseEntity.ok(Map.of(
                "access_token", serviceToken,
                "refresh_token", refreshToken
        ));
    }

    // ✅ 리프레시 토큰을 이용한 액세스 토큰 재발급
    @PostMapping("/kakao/refresh")
    public ResponseEntity<?> refreshKakaoAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body("No refresh token provided.");
        }

        // 1) DB에서 해당 리프레시 토큰이 유효한지 확인
        User user = userService.getUserByRefreshToken(refreshToken);
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid refresh token. Please log in again.");
        }

        // 2) 카카오 API를 이용해 새로운 액세스 토큰 요청
        String newAccessToken = userService.refreshKakaoAccessToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(401).body("Refresh token expired. Please log in again.");
        }

        return ResponseEntity.ok(Map.of("access_token", newAccessToken));
    }

    // ✅ 카카오 OAuth 토큰 요청
    private Map<String, String> getKakaoAccessToken(String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoRestApiKey);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(KAKAO_TOKEN_URL, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return (Map<String, String>) response.getBody();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new HashMap<>();
    }

    // ✅ 카카오 사용자 정보 요청
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(KAKAO_USERINFO_URL, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (HttpClientErrorException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
