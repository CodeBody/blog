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

        User user = this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)
                .last("LIMIT 1"));
        
        if (user == null) {

            return null;
        }



        boolean isMatch = passwordEncoder.matches(password, user.getPassword());


        if (isMatch) {
            return user;
        }
        return null;
    }
}
