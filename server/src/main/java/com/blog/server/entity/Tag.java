package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.util.Date;

@Data
@TableName("tags")
public class Tag {
    private Long id;
    private String name;
    private Date createdAt;
    private Date updatedAt;

    @TableField(exist = false)
    private Integer articleCount;
}
