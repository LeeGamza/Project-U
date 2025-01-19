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
    public ResponseEntity<?> googleLoginSuccess(@AuthenticationPrincipal OAuth2User oAuth2User) {
        System.out.println("Google login callback received");
        if (oAuth2User == null) {
            System.out.println("Unauthorized access attempt.");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        System.out.println("Authenticated user email: " + email);

        com.example.backend.Entity.User user = userService.findOrCreateUserByGoogle(email, name);

        String serviceToken = userService.createServiceToken(user);
        return ResponseEntity.ok(Map.of("token", serviceToken));
    }
}
