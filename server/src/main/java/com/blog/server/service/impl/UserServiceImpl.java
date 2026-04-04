package com.blog.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.server.entity.User;
import com.blog.server.mapper.UserMapper;
import com.blog.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User getAdminUser() {
        return this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getRole, "admin")
                .last("LIMIT 1"));
    }

    @Override
    public User login(String username, String password) {
        log.info("====== 正在数据库中查找用户: {} ======", username);
        User user = this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)
                .last("LIMIT 1"));
        
        if (user == null) {
            log.warn("====== 未找到用户: {} ======", username);
            return null;
        }

        log.info("====== 找到用户: {}, 数据库中的密码哈希长度: {} ======", 
            username, 
            user.getPassword() != null ? user.getPassword().length() : 0);

        boolean isMatch = passwordEncoder.matches(password, user.getPassword());
        log.info("====== BCrypt 比对结果: {} ======", isMatch);

        if (isMatch) {
            return user;
        }
        return null;
    }
}
