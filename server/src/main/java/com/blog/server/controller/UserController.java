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
    public Result<User> login(@RequestBody LoginRequest request) {
        log.info("====== 收到登录请求: username={} ======", request.getUsername());
        
        User user = userService.login(request.getUsername(), request.getPassword());
        
        if (user != null) {
            log.info("====== 登录成功: {} ======", request.getUsername());
            return Result.success(user);
        } else {
            log.warn("====== 登录失败: {} ======", request.getUsername());
            return Result.fail(401, "Invalid username or password");
        }
    }
}
