package com.blog.server.controller;

import com.blog.server.common.Result;
import com.blog.server.entity.User;
import com.blog.server.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final com.blog.server.utils.JwtUtils jwtUtils;

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @GetMapping("/admin")
    public Result<Map<String, Object>> getAdminProfile() {
        User admin = userService.getAdminUser();
        
        if (admin == null) {
            return Result.fail(404, "Admin user not found");
        }

        // Convert to the format expected by the frontend
        Map<String, Object> profile = new HashMap<>();
        profile.put("name", admin.getNickname() != null ? admin.getNickname() : admin.getUsername());
        profile.put("avatar", admin.getAvatar());
        profile.put("bio", admin.getBio());
        
        Map<String, String> socials = new HashMap<>();
        socials.put("github", admin.getGithub());
        socials.put("twitter", admin.getTwitter());
        socials.put("linkedin", admin.getLinkedin());
        profile.put("socials", socials);

        return Result.success(profile);
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {

        
        User user = userService.login(request.getUsername(), request.getPassword());
        
        if (user != null) {

            
            // 生成 Token
            String token = jwtUtils.createToken(user.getUsername(), user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            
            return Result.success(response);
        } else {

            return Result.fail(401, "Invalid username or password");
        }
    }
}
