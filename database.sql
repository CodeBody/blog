create table article_tags
(
    article_id bigint not null comment '文章ID',
    tag_id     bigint not null comment '标签ID',
    primary key (article_id, tag_id)
)
    comment '文章标签关联表';

create table articles
(
    id           bigint                               not null comment '文章ID'
        primary key,
    author_id    bigint                               not null comment '作者ID',
    category_id  bigint                               not null comment '分类ID',
    title        varchar(255)                         not null comment '文章标题',
    content      longtext                             not null comment '文章正文，MD格式的文本',
    status       tinyint    default 0                 not null comment '状态：0-草稿，1-已发布',
    views        int        default 0                 not null comment '阅读量',
    published_at datetime                             null comment '发布时间',
    created_at   datetime   default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at   datetime   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    deleted      tinyint(1) default 0                 null comment '删除标识 0: 没有删除 1: 已经删除'
)
    comment '文章表';

create table categories
(
    id          bigint                               not null comment '分类ID'
        primary key,
    name        varchar(50)                          not null comment '分类名称',
    description varchar(255)                         null comment '分类描述',
    created_at  datetime   default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at  datetime   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    deleted     tinyint(1) default 0                 null comment '删除标识 0: 没有删除 1: 已经删除'
)
    comment '分类表';

create table comments
(
    id           bigint                             not null comment '评论ID'
        primary key,
    article_id   bigint                             not null comment '文章ID',
    author_name  varchar(50)                        not null comment '评论者名称',
    author_email varchar(100)                       not null comment '评论者邮箱',
    content      text                               not null comment '评论内容',
    status       tinyint  default 0                 not null comment '状态：0-待审核，1-通过，2-拒绝',
    created_at   datetime default CURRENT_TIMESTAMP not null comment '创建时间'
)
    comment '评论表';

create table tags
(
    id         bigint                               not null comment '标签ID'
        primary key,
    name       varchar(50)                          not null comment '标签名称',
    created_at datetime   default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at datetime   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    deleted    tinyint(1) default 0                 null comment '删除标识 0: 没有删除 1: 已经删除'
)
    comment '标签表';

create table users
(
    id         bigint                                not null comment '用户ID'
        primary key,
    username   varchar(50)                           not null comment '用户名',
    password   varchar(255)                          not null comment '密码哈希',
    nickname   varchar(50)                           null comment '昵称',
    avatar     varchar(255)                          null comment '头像',
    bio        text                                  null comment '简介',
    github     varchar(255)                          null comment 'Github',
    twitter    varchar(255)                          null comment 'Twitter',
    linkedin   varchar(255)                          null comment 'Linkedin',
    email      varchar(100)                          not null comment '邮箱',
    role       varchar(20) default 'user'            null comment '角色',
    created_at datetime    default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at datetime    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    deleted    tinyint(1)  default 0                 null comment '删除标识 0: 没有删除 1: 已经删除'
)
    comment '用户表';

