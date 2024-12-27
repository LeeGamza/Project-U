package com.example.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class KakaoLoginController {

    // application.yml에 정의된 값들 주입
    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    // 카카오 토큰, 유저 정보 조회용 URL
    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final RestTemplate restTemplate;
    private final UserService userService;     // 실제 회원가입/조회/토큰발급 등의 로직

    public KakaoLoginController(RestTemplate restTemplate, UserService userService) {
        this.restTemplate = restTemplate;
        this.userService = userService;
    }

    /**
     * 프론트엔드에서 카카오 인가 코드를 code 파라미터로 받아서,
     * 카카오 서버와 통신하여 AccessToken -> 카카오 유저 정보 -> 우리 서비스 토큰 발급 흐름
     */
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body("인가 코드를 받지 못했습니다.");
        }

        // 1. 카카오 Access Token 요청
        String accessToken = getKakaoAccessToken(code);
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("카카오 Access Token 발급 실패");
        }

        // 2. 카카오 유저 정보 조회
        Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
        if (kakaoUserInfo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("카카오 사용자 정보 조회 실패");
        }

        // 3. 카카오 유저 정보 파싱 (id, email, nickname 등)
        // 예: { id=123456789, kakao_account={profile={nickname=홍길동}, email=test@kakao.com }, ... }
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

        // 4. 우리 서비스에서 사용자 등록/조회
        //    - DB에 해당 카카오ID로 가입된 유저가 있는지 확인 -> 없으면 회원가입 -> 있으면 로그인 처리
        //    - User 엔티티 등으로 관리한다고 가정
        User user = userService.findOrCreateUserByKakao(kakaoId, email, nickname);

        // 5. 우리 서비스에서 사용하는 JWT(또는 세션) 발급
        String serviceToken = userService.createServiceToken(user);

        // 프론트엔드로 응답: { "token": "...our-service-jwt..." }
        Map<String, String> response = new HashMap<>();
        response.put("token", serviceToken);

        return ResponseEntity.ok(response);
    }

    /**
     * 카카오 서버에 AccessToken 요청
     */
    private String getKakaoAccessToken(String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // 카카오 토큰 요청용 파라미터
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoRestApiKey);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> requestEntity =
                    new HttpEntity<>(params, headers);

            // 응답을 Map으로 받음
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    KAKAO_TOKEN_URL,
                    requestEntity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> body = response.getBody();
                // access_token 필드 추출
                return (String) body.get("access_token");
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Access Token을 가지고 카카오 유저 정보 요청
     */
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken); // Bearer {accessToken}
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<?> entity = new HttpEntity<>(headers);

            // 카카오 사용자 정보 조회 (POST)
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    KAKAO_USERINFO_URL,
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
