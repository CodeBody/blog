package com.blog.server.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.server.common.Result;
import com.blog.server.entity.Project;
import com.blog.server.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public Result<Page<Project>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "6") Integer size,
            @RequestParam(required = false) String title) {
            
        Page<Project> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(title)) {
            queryWrapper.and(wrapper -> wrapper
                .like(Project::getTitle, title)
                .or()
                .like(Project::getDescription, title)
            );
        }
        
        queryWrapper.orderByDesc(Project::getCreatedAt);
        return Result.success(projectService.page(pageParam, queryWrapper));
    }
}
