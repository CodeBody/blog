package com.blog.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalArticles;
    private Long publishedArticles;
    private Long draftArticles;
    private Long totalViews;
    private List<CategoryCount> categoryDistribution;
    private List<TrendItem> trendData;

    @Data
    @AllArgsConstructor
    public static class CategoryCount {
        private String name;
        private Integer value;
    }

    @Data
    @AllArgsConstructor
    public static class TrendItem {
        private String date;
        private Integer views;
        private Integer count;
    }
}
