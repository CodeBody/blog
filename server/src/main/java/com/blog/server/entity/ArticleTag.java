package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;

@Data
@TableName("article_tags")
public class ArticleTag implements Serializable {
    private Long articleId;
    private Long tagId;
}
