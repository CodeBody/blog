package com.blog.server.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.server.entity.User;

public interface UserService extends IService<User> {
    User getAdminUser();
    User login(String username, String password);
}
