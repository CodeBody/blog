package com.blog.server;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordResetTool {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String encodedPassword = encoder.encode(rawPassword);
        
        System.out.println("\n\n========================================");
        System.out.println("原始密码: " + rawPassword);
        System.out.println("生成的正确哈希: " + encodedPassword);
        System.out.println("========================================");
        
        // 验证一下
        boolean matches = encoder.matches(rawPassword, encodedPassword);
        System.out.println("本地自验证结果 (预期为 true): " + matches);
        System.out.println("========================================\n\n");
    }
}
