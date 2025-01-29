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
    private final OAuth2AuthorizedClientService authorizedClientService;

    public GoogleLoginController(UserService userService, OAuth2AuthorizedClientService authorizedClientService) {
        this.userService = userService;
        this.authorizedClientService = authorizedClientService;
    }

    @GetMapping("/login/success")
    public ResponseEntity<?> googleLoginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User) {
        System.out.println("Google login callback received");

        if (oAuth2User == null) {
            System.out.println("Unauthorized access attempt.");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // 유저 정보 추출
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        System.out.println("Authenticated user email: " + email);

        // OAuth2AuthorizedClient에서 리프레시 토큰 가져오기 (Principal의 Name을 사용)
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient("google", oAuth2User.getName());
        String refreshToken = (client != null && client.getRefreshToken() != null) ? client.getRefreshToken().getTokenValue() : null;

        // 사용자 정보 저장 (리프레시 토큰이 존재할 경우만 업데이트)
        User user = userService.findOrCreateUserByGoogle(email, name, refreshToken);

        // 액세스 토큰 발급
        String serviceToken = userService.createServiceToken(user);

        // 클라이언트에 응답 (액세스 토큰 + 리프레시 토큰 포함)
        return ResponseEntity.ok(Map.of(
                "access_token", serviceToken,
                "refresh_token", refreshToken
        ));
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
