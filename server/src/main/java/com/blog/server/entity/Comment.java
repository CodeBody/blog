package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@Data
@TableName("comments")
public class Comment implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long articleId;
    private String authorName;
    private String authorEmail;
    private String content;
    private Integer status; // 0-pending, 1-approved, 2-rejected
    private Date createdAt;
}
