package com.blog.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@Data
@TableName("users")
public class User implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String avatar;
    private String bio;
    private String github;
    private String twitter;
    private String linkedin;
    private String email;
    private String role;
    private Date createdAt;
    private Date updatedAt;

    @TableLogic
    private Integer deleted;
}
