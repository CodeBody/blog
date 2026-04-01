package com.blog.server.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.server.common.Result;
import com.blog.server.entity.Article;
import com.blog.server.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public Result<Page<Article>> listArticles(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long categoryId) {

        Page<Article> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Article> queryWrapper = new LambdaQueryWrapper<>();
        
        // Frontend only shows published articles (status = 1)
        queryWrapper.eq(Article::getStatus, 1);
        
        if (categoryId != null) {
            queryWrapper.eq(Article::getCategoryId, categoryId);
        }
        
        queryWrapper.orderByDesc(Article::getCreatedAt);

        return Result.success(articleService.page(pageParam, queryWrapper));
    }

    @GetMapping("/{id}")
    public Result<Article> getArticle(@PathVariable Long id) {
        Article article = articleService.getArticleDetailAndAddViews(id);
        if (article == null || article.getStatus() != 1) {
            return Result.fail(404, "Article not found or not published");
        }
        return Result.success(article);
    }
}
