package com.blog.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.server.entity.Article;
import com.blog.server.entity.Category;
import com.blog.server.mapper.ArticleMapper;
import com.blog.server.mapper.CategoryMapper;
import com.blog.server.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {
    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public List<Category> listWithArticleCount() {
        List<Category> categories = this.list();
        for (Category category : categories) {
            Long count = articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                    .eq(Article::getCategoryId, category.getId())
                    .eq(Article::getStatus, 1)); // Only count published articles
            category.setArticleCount(count.intValue());
        }
        return categories;
    }
}
