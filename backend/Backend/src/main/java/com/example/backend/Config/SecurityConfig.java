package com.example.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and() // ✅ CORS 설정 활성화
                .csrf().disable() // ✅ CSRF 비활성화 (REST API에서는 보통 비활성화)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/token/kakao", "/api/auth/kakao", "/api/auth/kakao/refresh").permitAll() // ✅ 카카오 로그인 API 인증 필요 없음
                        .requestMatchers("/api/**").authenticated() // ✅ 다른 API는 인증 필요
                        .anyRequest().permitAll()
                )
                .oauth2Login(); // ✅ OAuth2 로그인 설정 유지

        return http.build();
    }
}

