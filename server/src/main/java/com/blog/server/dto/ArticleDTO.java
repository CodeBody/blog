package com.blog.server.dto;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
public class ArticleDTO implements Serializable {
    private Long id;
    private Long authorId;
    private Long categoryId;
    private String title;
    private String content;
    private Integer status;
    private List<Long> tagIds;
}
