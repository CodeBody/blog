package com.blog.server.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.server.dto.ArticleDTO;
import com.blog.server.entity.Article;

public interface ArticleService extends IService<Article> {
    Article getArticleDetailAndAddViews(Long id);
    void saveArticleWithTags(ArticleDTO dto);
    void updateArticleWithTags(ArticleDTO dto);
    void populateTags(Article article);
}
