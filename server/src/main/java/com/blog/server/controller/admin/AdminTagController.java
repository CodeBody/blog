package com.blog.server.controller.admin;

import com.blog.server.common.Result;
import com.blog.server.entity.Tag;
import com.blog.server.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tags")
@RequiredArgsConstructor
public class AdminTagController {

    private final TagService tagService;

    @GetMapping
    public Result<List<Tag>> list() {
        return Result.success(tagService.list());
    }

    @PostMapping
    public Result<Void> create(@RequestBody Tag tag) {
        Date now = new Date();
        tag.setCreatedAt(now);
        tag.setUpdatedAt(now);
        tagService.save(tag);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Tag tag) {
        tag.setId(id);
        tag.setUpdatedAt(new Date());
        tagService.updateById(tag);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        tagService.removeById(id);
        return Result.success();
    }
}
