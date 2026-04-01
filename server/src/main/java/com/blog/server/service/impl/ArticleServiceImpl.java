package com.blog.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.server.dto.ArticleDTO;
import com.blog.server.entity.Article;
import com.blog.server.entity.ArticleTag;
import com.blog.server.mapper.ArticleMapper;
import com.blog.server.mapper.ArticleTagMapper;
import com.blog.server.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    private final ArticleTagMapper articleTagMapper;

    @Override
    public Article getArticleDetailAndAddViews(Long id) {
        Article article = this.getById(id);
        if (article != null) {
            // Updating views directly on database for MVP
            article.setViews((article.getViews() == null ? 0 : article.getViews()) + 1);
            this.updateById(article);
        }
        return article;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveArticleWithTags(ArticleDTO dto) {
        Article article = new Article();
        BeanUtils.copyProperties(dto, article);
        Date now = new Date();
        article.setCreatedAt(now);
        article.setUpdatedAt(now);
        if (article.getStatus() != null && article.getStatus() == 1) {
            article.setPublishedAt(now);
        }
        this.save(article);
        
        saveTags(article.getId(), dto);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateArticleWithTags(ArticleDTO dto) {
        Article article = new Article();
        BeanUtils.copyProperties(dto, article);
        article.setUpdatedAt(new Date());
        this.updateById(article);

        // Delete old tags
        LambdaQueryWrapper<ArticleTag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticleTag::getArticleId, article.getId());
        articleTagMapper.delete(wrapper);

        // Insert new tags
        saveTags(article.getId(), dto);
    }

    private void saveTags(Long articleId, ArticleDTO dto) {
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            for (Long tagId : dto.getTagIds()) {
                ArticleTag at = new ArticleTag();
                at.setArticleId(articleId);
                at.setTagId(tagId);
                articleTagMapper.insert(at);
            }
        }
    }
}
