export const defaultProfile = {
  name: "Alex Dev",
  bio: "Frontend Engineer & Design Enthusiast. I love building beautiful user interfaces and sharing what I learn.",
  avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
  socials: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  }
};

export const defaultArticles = [
  {
    id: "1",
    title: "Building Modern Web Apps with React 18 & Vite",
    abstract: "A comprehensive guide to starting new projects using the latest React features and lightning-fast Vite bundler.",
    content: `# Building Modern Web Apps

Welcome to this guide on building modern React web applications!

## Why React 18?
React 18 introduced concurrency, allowing React to interrupt long-running renders to handle high-priority events like user typing.

### Key Features
- **Automatic Batching:** fewer re-renders.
- **Transitions:** mark state updates as non-urgent.
- **Suspense on the Server:** stream HTML out to the client.

## Why Vite?
Vite is incredibly fast compared to Create React App. It leverages native ES modules in the browser to avoid bundling during development.

\`\`\`jsx
import React from 'react';

const App = () => {
  return <div>Hello Vite!</div>;
}
export default App;
\`\`\`

> "The web is evolving, and so should our tools."
`,
    author: "Alex Dev",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["React", "Vite", "Frontend"],
    views: 1205,
    status: "published"
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS v3",
    abstract: "Tailwind CSS v3 brings a JIT engine by default. Learn how to leverage arbitrary values and new utilities.",
    content: `# Mastering Tailwind CSS
    
Tailwind is amazing for rapid UI development.

## Arbitrary Values
You can now use arbitrary values directly in your classes:
\`<div class="top-[117px] bg-[#1da1f2]"></div>\`

## Typography
Using the official typography plugin makes formatting Markdown a breeze.
`,
    author: "Alex Dev",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["CSS", "Tailwind", "Design"],
    views: 842,
    status: "published"
  },
  {
    id: "3",
    title: "Draft: The Future of Server Components",
    abstract: "Exploring the implications of React Server Components and Next.js.",
    content: "Content coming soon...",
    author: "Alex Dev",
    date: new Date().toISOString(),
    tags: ["React", "Architecture"],
    views: 12,
    status: "draft"
  }
];
