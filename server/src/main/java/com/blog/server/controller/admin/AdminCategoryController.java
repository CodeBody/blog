package com.blog.server.controller.admin;

import com.blog.server.common.Result;
import com.blog.server.entity.Category;
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

    @GetMapping
    public Result<List<Category>> list() {
        return Result.success(categoryService.list());
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
