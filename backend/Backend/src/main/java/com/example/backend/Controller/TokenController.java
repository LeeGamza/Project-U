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

    //프론트엔드에서 JSON 바디로 { "token": "...", "additionalData": "..." } 형태로 보낼 경우
    @PostMapping("/body")
    public ResponseEntity<?> receiveTokenFromBody(@RequestBody Map<String, String> request) {

        // 1) Request Body에서 토큰 추출, 실패 로그
        String token = request.get("token");
        String additionalData = request.get("additionalData");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("No token provided in the request body.");
        }

        // 2) 토큰 검증 로직 (UserService에 구현), 실패 로그
        boolean isValid = userService.validateUserToken(token);

        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }

        // 3) 토큰이 유효하다면, 로직 실행
        System.out.println("Additional data from body: " + additionalData);

        return ResponseEntity.ok("Token is valid. additionalData = " + additionalData);
    }

    //프론트엔드에서 헤더에 Authorization: Bearer <TOKEN>, JSON 바디에는 추가 정보만 담아서 보내는 경우
    //위랑 아래 중에 뭐일지 몰라서 2개 다 해놨음
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

        // 2) 바디에도 additionalData가 있으면 추출
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
