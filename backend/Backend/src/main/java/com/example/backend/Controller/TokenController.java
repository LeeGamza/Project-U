package com.example.backend.Controller;

import com.example.backend.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/token")
public class TokenController {

    private final UserService userService;

    public TokenController(UserService userService) {
        this.userService = userService;
    }

    // ✅ 액세스 토큰이 만료되었을 경우, 자동으로 재발급하여 반환 (리프레시 토큰 활용)
    @PostMapping("/validate")
    public ResponseEntity<?> validateAndRefreshToken(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestHeader(value = "Refresh-Token", required = false) String refreshToken) {

        // 1) Authorization 헤더에서 "Bearer " 뒷부분만 추출
        String accessToken = authorizationHeader;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            accessToken = authorizationHeader.substring(7);
        }

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body("No access token provided.");
        }

        // 2) 액세스 토큰 검증
        boolean isValid = userService.validateUserToken(accessToken);
        if (isValid) {
            return ResponseEntity.ok("Access token is valid.");
        }

        // 3) 액세스 토큰이 만료되었을 경우, 리프레시 토큰으로 새 액세스 토큰 발급 시도
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(401).body("Access token expired. No refresh token provided.");
        }

        // 4) 리프레시 토큰이 유효한지 확인
        String newAccessToken = userService.refreshAccessToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(401).body("Refresh token expired. Please log in again.");
        }

        // 5) 새로운 액세스 토큰을 응답 헤더에 추가 후 반환
        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + newAccessToken)
                .body("Access token refreshed successfully.");
    }
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}
