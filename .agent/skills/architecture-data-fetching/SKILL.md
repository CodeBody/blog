---
name: architecture-data-fetching
description: Strict guidelines for on-demand and isolated data fetching in this blog repository. Use this skill whenever adding new pages, components, or API endpoints. This ensures maximum performance and prevents inefficient bulk-loading patterns.
---

This skill defines the architectural mandates for data handling in the Blog system (both Admin and Front-end). Adhere to these principles to maintain a clean, high-performance codebase.

## Core Mandates

### 1. On-Demand Fetching (Component-Level)
- **NO Global Pre-loading**: Never trigger bulk data fetches (e.g., loading all articles) in the `AppLayout`, `AdminLayout`, or the `useEffect` of the `BlogContext` provider.
- **Local Lifecycle**: Data fetching must be initiated by the component or page that *directly* consumes it. Use `useEffect` at the page level to trigger specific data loads.

### 2. Strict Resource Isolation
- **No Shared State Loading**: Avoid making one page's correct display dependent on another page's previously loaded state. If the "Categories" page needs the "Article Count", the Category API must provide it. It should NOT rely on the "Articles" list being loaded in the context.
- **Context as a Cache only**: The `BlogContext` should store results for performance, but it is **not** an orchestrator of data lifecycle.

### 3. Backend Aggregation (Specialized APIs)
- **Specialized DTOs**: Create specific DTOs (e.g., `DashboardStatsDTO`, `CategoryDTO` with `articleCount`) to fulfill UI needs directly from the database.
- **Aggregation over Processing**: Perform counts (`COUNT`), sums (`SUM`), and distributions on the database/backend side. NEVER fetch full entity lists to compute basic metadata on the client.

### 4. API Granularity
- **Paginate by Default**: When fetching lists, always support and use pagination parameters (`page`, `size`).
- **Single Entity Endpoints**: Always provides a `/api/{resource}/{id}` endpoint. Pages like "Article Detail" must strictly use this targeted endpoint instead of searching a global list.

## Examples of "Bad" vs "Good"

### ❌ BAD (Bulk Loading)
```javascript
// BlogContext.jsx
useEffect(() => {
  fetchAllArticles();
  fetchAllCategories();
  fetchAllTags();
}, []); // Everything loaded at once for no reason.
```

### ✅ GOOD (Isolated Loading)
```javascript
// Dashboard.jsx
useEffect(() => {
  // Only fetch the summary statistics.
  fetchDashboardStats();
}, []);

// Posts.jsx
useEffect(() => {
  // Only fetch the article list when the management page is active.
  fetchArticles(1, 20);
}, []);
```

## Audit Checklist
- [ ] Does this page fetch data that it doesn't display? (If yes, optimize).
- [ ] Does this page depend on `context.articles` being populated by a previous navigation? (If yes, add a local fetch).
- [ ] Can the backend provide this metadata more efficiently? (If yes, create a new DTO/Endpoint).
