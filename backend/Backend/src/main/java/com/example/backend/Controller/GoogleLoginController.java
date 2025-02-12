package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/auth/google")
public class GoogleLoginController {

    private final UserService userService;

    public GoogleLoginController(UserService userService, OAuth2AuthorizedClientService authorizedClientService) {
        this.userService = userService;
    }

    @PostMapping("/token")
    public ResponseEntity<?> googleLoginCallback(@RequestBody Map<String, String> request) {
        // 요청 본문에서 "accessToken" 키를 사용
        String token = request.get("accessToken");
        System.out.println("🔍 받은 accessToken: " + token);

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Access token is missing");
        }


        // processGoogleAccessToken 메서드를 사용하여 사용자 정보 조회 및 처리
        Map<String, Object> result = userService.processGoogleAccessToken(token);
        if (result == null) {
            return ResponseEntity.status(401).body("Google Login Failed");
        }
        return ResponseEntity.ok(result);
    }

    // ✅ 리프레시 토큰을 이용한 액세스 토큰 재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");

        // 🔹 DB에서 리프레시 토큰 검증 (보안 강화)
        User user = userService.getUserByRefreshToken(refreshToken);
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid refresh token. Please log in again.");
        }

        // 새 액세스 토큰 요청
        String newAccessToken = userService.refreshAccessToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(401).body("Refresh token expired. Please log in again.");
        }

        return ResponseEntity.ok(Map.of("access_token", newAccessToken));
    }

    @GetMapping("/failure")
    public ResponseEntity<?> googleLoginFailure() {
        return ResponseEntity.status(401).body("Google Login Failed");
    }
}
