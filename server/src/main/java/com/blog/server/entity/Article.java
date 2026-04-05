package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@TableName("articles")
public class Article implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long authorId;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long categoryId;
    private String title;
    private String content;
    private Integer status;
    private Integer views;
    private Date publishedAt;
    private Date createdAt;
    private Date updatedAt;

    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private List<String> tags;
}
