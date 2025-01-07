package com.example.backend;

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

    /**
     * [예시 1]
     * 프론트엔드에서 JSON 바디로 { "token": "...", "additionalData": "..." } 형태로 보내는 상황
     * (Authorization 헤더는 사용하지 않고, 바디로만 토큰을 받는 경우)
     */
    @PostMapping("/body")
    public ResponseEntity<?> receiveTokenFromBody(@RequestBody Map<String, String> request) {

        // 1) Request Body에서 토큰 추출
        String token = request.get("token");
        String additionalData = request.get("additionalData");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("No token provided in the request body.");
        }

        // 2) 토큰 검증 로직 (UserService에 구현했다고 가정)
        boolean isValid = userService.validateUserToken(token);

        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }

        // 3) 토큰이 유효하다면, 필요한 로직 (ex. DB 조회, 사용자 정보 반환 등)
        //    여기서는 단순히 '추가 데이터'를 로그로 찍고, 'token valid'라는 응답을 줌.
        System.out.println("Additional data from body: " + additionalData);

        return ResponseEntity.ok("Token is valid. additionalData = " + additionalData);
    }

    /**
     * [예시 2]
     * 프론트엔드에서 헤더에 Authorization: Bearer <TOKEN>
     * + JSON 바디에는 추가 정보만 담아서 보내는 경우
     */
    @PostMapping("/header")
    public ResponseEntity<?> receiveTokenFromHeader(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody(required = false) Map<String, String> body
    ) {

        // 1) Authorization 헤더에서 "Bearer " 뒷부분만 추출
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        // 2) 바디에도 무언가 additionalData가 있을 수 있음
        String additionalData = (body != null) ? body.get("additionalData") : null;

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("No Bearer token found in Authorization header.");
        }

        // 3) 토큰 검증
        boolean isValid = userService.validateUserToken(token);
        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }

        // 4) 토큰이 유효하다면 후속 로직 수행
        System.out.println("Additional data from body: " + additionalData);

        return ResponseEntity.ok("Header token is valid. additionalData = " + additionalData);
    }
}
