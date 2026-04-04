package com.blog.server.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.server.common.Result;
import com.blog.server.entity.Article;
import com.blog.server.entity.Category;
import com.blog.server.service.ArticleService;
import com.blog.server.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;
    private final ArticleService articleService;

    @GetMapping
    public Result<List<Category>> list() {
        List<Category> list = categoryService.list();
        for (Category category : list) {
            long count = articleService.count(new LambdaQueryWrapper<Article>().eq(Article::getCategoryId, category.getId()));
            category.setArticleCount((int) count);
        }
        return Result.success(list);
    }

    @PostMapping
    public Result<Void> create(@RequestBody Category category) {
        Date now = new Date();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        categoryService.save(category);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        category.setUpdatedAt(new Date());
        categoryService.updateById(category);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        // Normally there's a check to prevent deletion if articles associate with it, simplified for MVP
        categoryService.removeById(id);
        return Result.success();
    }
}
