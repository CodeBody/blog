package com.blog.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.server.dto.ArticleDTO;
import com.blog.server.entity.Article;
import com.blog.server.entity.ArticleTag;
import com.blog.server.mapper.ArticleMapper;
import com.blog.server.mapper.ArticleTagMapper;
import com.blog.server.mapper.TagMapper;
import com.blog.server.entity.Tag;
import com.blog.server.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    private final ArticleTagMapper articleTagMapper;
    private final TagMapper tagMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Article getArticleDetailAndAddViews(Long id) {
        // Atomic increment in DB
        baseMapper.incrementViews(id);
        
        // Fetch article detail
        Article article = this.getById(id);
        if (article != null) {
            populateTags(article);
        }
        return article;
    }

    @Override
    public void populateTags(Article article) {
        if (article == null || article.getId() == null) return;
        
        LambdaQueryWrapper<ArticleTag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticleTag::getArticleId, article.getId());
        List<ArticleTag> atList = articleTagMapper.selectList(wrapper);
        
        if (atList != null && !atList.isEmpty()) {
            List<Long> tagIds = atList.stream().map(ArticleTag::getTagId).collect(Collectors.toList());
            List<Tag> tagList = tagMapper.selectBatchIds(tagIds);
            if (tagList != null) {
                article.setTags(tagList.stream().map(Tag::getName).collect(Collectors.toList()));
            }
        } else {
            article.setTags(new ArrayList<>());
        }
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
