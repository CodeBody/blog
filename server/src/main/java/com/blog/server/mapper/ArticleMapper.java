package com.blog.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.server.entity.Article;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface ArticleMapper extends BaseMapper<Article> {
    @Select("SELECT COALESCE(SUM(views), 0) FROM articles")
    Integer getTotalViews();

    @Update("UPDATE articles SET views = views + 1 WHERE id = #{id}")
    int incrementViews(Long id);
}
