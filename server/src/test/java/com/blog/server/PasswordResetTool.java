package com.blog.server;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordResetTool {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        encoder.encode(rawPassword);
        
        
        // 验证一下
        encoder.matches(rawPassword, encoder.encode(rawPassword));

    }
}
