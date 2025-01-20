package com.example.backend.Controller;

import com.example.backend.Entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.backend.Service.UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;


@RestController
@RequestMapping("/api/auth/google")
public class GoogleLoginController {

    private final UserService userService;

    public GoogleLoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login/success")
    //로그인 api 오류 확인
    public ResponseEntity<?> googleLoginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User) {
        System.out.println("Google login callback received");
        if (oAuth2User == null) {
            System.out.println("Unauthorized access attempt.");
            return ResponseEntity.status(401).body("Unauthorized");
        }
    //유저 정보 추출
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        System.out.println("Authenticated user email: " + email);
    //유조 정보 저장
        com.example.backend.Entity.User user = userService.findOrCreateUserByGoogle(email, name);
    //JWT 발급
        String serviceToken = userService.createServiceToken(user);
    // 클라이언트에 응답
        return ResponseEntity.ok(Map.of("token", serviceToken));
    }

    //실패 시 /failure 화면으로 이동
    @GetMapping("/failure")
    public ResponseEntity<?> googleLoginFailure() {
        return ResponseEntity.status(401).body("Google Login Failed");
    }
}
