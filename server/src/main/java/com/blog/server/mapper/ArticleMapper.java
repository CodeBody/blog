package com.blog.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.server.entity.Article;
import org.apache.ibatis.annotations.Select;

public interface ArticleMapper extends BaseMapper<Article> {
    @Select("SELECT COALESCE(SUM(views), 0) FROM articles")
    Integer getTotalViews();
}
