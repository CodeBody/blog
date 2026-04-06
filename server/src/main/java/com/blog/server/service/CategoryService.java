package com.blog.server.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.server.entity.Category;

import java.util.List;

public interface CategoryService extends IService<Category> {
    List<Category> listWithArticleCount();
}
