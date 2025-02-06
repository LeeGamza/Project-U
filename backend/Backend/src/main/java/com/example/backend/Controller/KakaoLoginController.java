package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class KakaoLoginController {

    // 카카오 사용자 정보 요청 URL
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final RestTemplate restTemplate;
    private final UserService userService;

    public KakaoLoginController(RestTemplate restTemplate, UserService userService) {
        this.restTemplate = restTemplate;
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    /**
     * 프론트엔드에서 전달받은 액세스 토큰으로 카카오 사용자 정보를 조회하고,
     * 사용자 정보를 기반으로 회원을 저장(또는 조회) 후 자체 액세스 토큰(서비스 토큰)을 반환합니다.
     */
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
        String accessToken = request.get("accessToken");
        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Access token is missing");
        }

        // 카카오 API를 통해 사용자 정보 조회
        Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
        if (kakaoUserInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to retrieve Kakao user info");
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

        // ✅ 이메일이 없을 경우 임시 이메일 생성 포함
        User user = userService.findOrCreateUserByKakao(String.valueOf(kakaoId), email, nickname, null, kakaoUserInfo);
        String serviceToken = userService.createServiceToken(user);

        return ResponseEntity.ok(Map.of("access_token", serviceToken));
    }

    /**
     * 리프레시 토큰을 이용하여 새로운 액세스 토큰(서비스 토큰)을 재발급합니다.
     */
    @PostMapping("/kakao/refresh")
    public ResponseEntity<?> refreshKakaoAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body("No refresh token provided.");
        }

        // DB에서 해당 리프레시 토큰이 유효한 사용자 조회
        User user = userService.getUserByRefreshToken(refreshToken);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid refresh token. Please log in again.");
        }

        // 기존 로직을 이용하여 새로운 액세스 토큰(서비스 토큰) 발급
        String newAccessToken = userService.refreshKakaoAccessToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Refresh token expired. Please log in again.");
        }

        return ResponseEntity.ok(Map.of("access_token", newAccessToken));
    }

    /**
     * 카카오 API를 호출하여 사용자 정보를 가져옵니다.
     *
     * @param accessToken 프론트엔드에서 전달받은 카카오 액세스 토큰
     * @return 카카오 사용자 정보가 담긴 Map 또는 실패 시 null
     */
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    KAKAO_USERINFO_URL, HttpMethod.GET, entity, Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                System.out.println("카카오 API 응답 실패: " + response.getStatusCode());
                throw new RuntimeException("Failed to retrieve Kakao user info");// ❌ 강제 예외 발생
            }
        } catch (HttpClientErrorException e) {
            System.out.println("카카오 API 요청 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("Kakao API error: " + e.getMessage()); // ❌ 강제 예외 발생
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Unexpected error in getKakaoUserInfo()"); // ❌ 강제 예외 발생
        }
    }
}
