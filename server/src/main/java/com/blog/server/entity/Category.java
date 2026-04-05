package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import java.util.Date;

@Data
@TableName("categories")
public class Category {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String name;
    private String description;
    private Date createdAt;
    private Date updatedAt;

    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private Integer articleCount;
}
