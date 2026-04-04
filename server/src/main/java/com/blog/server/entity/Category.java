package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.util.Date;

@Data
@TableName("categories")
public class Category {
    private Long id;
    private String name;
    private String description;
    private Date createdAt;
    private Date updatedAt;

    @TableField(exist = false)
    private Integer articleCount;
}
