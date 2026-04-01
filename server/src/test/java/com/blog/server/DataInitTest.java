package com.blog.server;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.server.entity.*;
import com.blog.server.mapper.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

@SpringBootTest
public class DataInitTest {

    @Autowired
    private ArticleMapper articleMapper;
    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private TagMapper tagMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ArticleTagMapper articleTagMapper;

    @Test
    public void initReactData() {
        Date now = new Date();
        
        Category c1 = new Category();
        c1.setName("前端开发");
        c1.setDescription("前端相关技术文章");
        c1.setCreatedAt(now);
        c1.setUpdatedAt(now);
        categoryMapper.insert(c1);

        User u1 = new User();
        u1.setUsername("admin");
        u1.setPassword("123456"); 
        u1.setEmail("admin@blog.com");
        u1.setCreatedAt(now);
        u1.setUpdatedAt(now);
        userMapper.insert(u1);

        Tag t1 = new Tag();
        t1.setName("React");
        t1.setCreatedAt(now);
        t1.setUpdatedAt(now);
        tagMapper.insert(t1);

        Article a1 = new Article();
        a1.setAuthorId(u1.getId());
        a1.setCategoryId(c1.getId());
        a1.setTitle("React 19 深度解析与新特性盘点");
        a1.setContent("React 19 带来了许多令人兴奋的新特性，主要集中在性能优化、服务端集成以及开发者体验方面。\\n\\n### 1. Actions 和表单增强\\nReact 19 提供了新的处理异步数据突变的 `Actions` 机制。配合 `useActionState` 和 `useOptimistic`，可以轻松处理表单提交和 UI 乐观更新，大幅减少传统 useState 管理 loading 状态的样板代码。\\n\\n### 2. Experimental React Compiler\\n官方编译器可以自动在底层完成组件渲染优化，开发者不再需要频繁手动包裹 `useMemo` 或 `useCallback`。\\n\\n### 3. 原生支持 Server Components\\n改善了服务端渲染和代码流机制，进一步缩减了客户端打包体积，极大地提升首屏性能。");
        a1.setStatus(1);
        a1.setViews(0);
        a1.setPublishedAt(now);
        a1.setCreatedAt(now);
        a1.setUpdatedAt(now);
        articleMapper.insert(a1);

        ArticleTag at1 = new ArticleTag();
        at1.setArticleId(a1.getId());
        at1.setTagId(t1.getId());
        articleTagMapper.insert(at1);

        Article a2 = new Article();
        a2.setAuthorId(u1.getId());
        a2.setCategoryId(c1.getId());
        a2.setTitle("掌握 React Hooks 核心原理与进阶用法");
        a2.setContent("React Hooks 彻底改变了前端编写状态的方式。相比于 Class Component，Hooks 的出现让逻辑复用变得极为清爽。\\n\\n主要的 Hooks 包括：\\n1. **useState**: 声明和修改组件内部状态。\\n2. **useEffect**: 用于处理副作用（如数据请求、DOM操作等）。\\n3. **useContext**: 快速消费跨层级传递的共享状态。\\n\\n进阶使用中，我们常通过提取 `自定义 Hooks` 将高频的 UI 行为逻辑封装起来（比如 useDebounce, useWindowSize 等），让主组件代码非常整洁。");
        a2.setStatus(1);
        a2.setViews(0);
        a2.setPublishedAt(now);
        a2.setCreatedAt(now);
        a2.setUpdatedAt(now);
        articleMapper.insert(a2);

        ArticleTag at2 = new ArticleTag();
        at2.setArticleId(a2.getId());
        at2.setTagId(t1.getId());
        articleTagMapper.insert(at2);
        
        System.out.println("====== 测试数据插入成功 ======");
    }
}
