package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") //카카오 로그인 post
public class KakaoLoginController {

    @Value("${kakao.rest-api-key}") //이거랑
    private String kakaoRestApiKey;

    @Value("${kakao.redirect-uri}") //이거.env 나 set으로 설정 해야 할듯 나중에
    private String kakaoRedirectUri;

    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final RestTemplate restTemplate;
    private final UserService userService;

    public KakaoLoginController(RestTemplate restTemplate, UserService userService) {
        this.restTemplate = restTemplate;
        this.userService = userService;
    }

    @PostMapping("/kakao") //post 요청 처리
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body("Authorization code is missing");
        }
        //액세스 요청 처리, 실패 로그
        String accessToken = getKakaoAccessToken(code);
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve Kakao Access Token");
        }
        //사용자 정보 요청, 실패 로그
        Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
        if (kakaoUserInfo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve Kakao user info");
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

        User user = userService.findOrCreateUserByKakao(kakaoId, email, nickname); //조회 or 생성
        String serviceToken = userService.createServiceToken(user); //토큰 생성

        Map<String, String> response = new HashMap<>();
        response.put("token", serviceToken);

        return ResponseEntity.ok(response);
    }
    //
    private String getKakaoAccessToken(String code) {
        try {
            HttpHeaders headers = new HttpHeaders(); //http 요청 준비
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>(); //필수 파라미터 설정(null값 X)
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoRestApiKey);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(KAKAO_TOKEN_URL, requestEntity, Map.class); //post 요청 전송

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> body = response.getBody();
                return (String) body.get("access_token");
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            //api get으로 요청
            ResponseEntity<Map> response = restTemplate.exchange(KAKAO_USERINFO_URL, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) { //토큰 맞으면 사용자 정보 추출해서 반환
                return response.getBody();
            } else {
                return null;
            }
        } catch (HttpClientErrorException e) { //예외 처리 부분
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
