
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Building Performant React Applications: Best Practices for 2025',
      content: `
  <p>React applications are incredibly powerful, but with great flexibility comes the risk of performance degradation. Whether you're building a small project or scaling an enterprise-grade app, performance should be a core focus in 2025 and beyond.</p>

  <h3>Code Splitting and Lazy Loading</h3>
  <p>React’s ecosystem has matured significantly, and one of its most valuable performance tools is code splitting. By leveraging dynamic <code>import()</code> along with <code>React.lazy</code> or Loadable Components, you can load components only when they're needed. This reduces initial bundle size, speeds up time-to-interactive, and improves overall user experience.</p>
  <p>Instead of importing everything upfront, use route-based or component-based splitting to deliver just-in-time code. Suspense boundaries with fallback UIs ensure smooth transitions and reduce perceived latency.</p>

  <h3>Modern State Management</h3>
  <p>Redux still has its place, but 2025 sees widespread adoption of modern alternatives like React Query, Zustand, Jotai, and TanStack Store. These tools reduce boilerplate and optimize renders out of the box.</p>
  <p>Data-fetching tools like React Query and SWR also improve caching, synchronization, and pagination, making them ideal for modern SPAs. Meanwhile, smaller libraries like Zustand offer reactivity without complexity, ideal for local component state and shared logic.</p>

  <h3>Performance Monitoring</h3>
  <p>Optimization doesn't end at deployment. Use tools like React DevTools Profiler to spot expensive renders and prevent re-renders. In production, integrate observability tools like Sentry, Datadog, or LogRocket to trace slow transactions and user interactions.</p>
  <p>Combine this with performance budgets, Core Web Vitals tracking, and automated CI checks to ensure regressions are caught early.</p>

  <h3>Additional 2025 Best Practices</h3>
  <ul>
    <li><strong>Memoization:</strong> Use <code>React.memo</code> and <code>useMemo</code> to prevent unnecessary recalculations.</li>
    <li><strong>Virtualization:</strong> For large lists or tables, libraries like <code>react-window</code> or <code>react-virtual</code> provide efficient rendering strategies.</li>
    <li><strong>Image Optimization:</strong> Use modern formats like AVIF and WebP, and lazy-load images for performance gains.</li>
    <li><strong>Server Components:</strong> React Server Components (RSC) are becoming more mainstream, especially in Next.js. These allow you to move logic to the server, reducing client-side JS.</li>
    <li><strong>Edge Rendering:</strong> Leverage edge computing platforms like Vercel or Cloudflare to bring content closer to the user with minimal latency.</li>
  </ul>

  <p>By combining these strategies, your React applications in 2025 will not only be fast but also scalable and resilient—delivering exceptional user experiences across devices and networks.</p>
`,
      excerpt: 'Explore the latest techniques for optimizing React applications, including code splitting, lazy loading, and modern state management patterns.',
      date: '2025-01-15',
      readTime: '8 min read',
      category: 'React',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'The Future of CSS: Container Queries and Modern Layout Techniques',
      content: `
  <p>CSS is undergoing a renaissance. From new layout primitives to the game-changing container queries, we’re entering a golden era of responsive and maintainable design. This article explores these cutting-edge features and how you can start using them today.</p>

  <h3>Understanding Container Queries</h3>
  <p>For years, developers have relied on media queries to make designs responsive. But media queries are tied to the viewport, not to individual components. Container queries shift this paradigm by allowing styles to change based on the size of a container rather than the window.</p>
  <p>Imagine a card component that looks different when it's inside a sidebar versus a main content area. With container queries, that’s not only possible—it’s trivial. They enable true modular and component-based responsive design.</p>
  <p>Example:</p>
  <pre><code>
  @container (min-width: 600px) {
    .card {
      flex-direction: row;
    }
  }
  </code></pre>

  <h3>CSS Grid and Flexbox Mastery</h3>
  <p>Flexbox and Grid have completely revolutionized layout in the browser. Grid is perfect for two-dimensional layouts (rows and columns), while Flexbox excels in one-dimensional flows. But modern techniques combine the best of both.</p>
  <p>Learn how to create responsive layouts using Grid’s <code>auto-fit</code> and <code>minmax()</code> functions, or how to build fluid layouts using Flexbox's <code>gap</code> property, which now enjoys broad support.</p>

  <h3>CSS Custom Properties in Action</h3>
  <p>Variables in CSS aren’t just for colors anymore. They can drive dynamic theming, handle layout values, and be scoped to specific components. With JavaScript, you can even manipulate them in real time.</p>
  <p>For example, you can toggle light/dark mode by changing a single root variable:</p>
  <pre><code>
  :root {
    --bg-color: #fff;
    --text-color: #000;
  }

  [data-theme="dark"] {
    --bg-color: #000;
    --text-color: #fff;
  }
  </code></pre>

  <h3>What’s Next?</h3>
  <p>Beyond container queries, the CSS Working Group is experimenting with features like subgrid, native masonry layout, and scoped styles. These will continue to push the boundaries of what’s possible with native CSS—making it easier to write robust, scalable, and beautiful interfaces without relying on heavy JavaScript solutions.</p>
`,
      excerpt: 'Discover how container queries are revolutionizing responsive design and learn about the latest CSS features that will shape web development.',
      date: '2025-01-08',
      readTime: '6 min read',
      category: 'CSS',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: 'TypeScript Tips: Advanced Patterns for Better Developer Experience',
      content: `
  <p>TypeScript is more than just JavaScript with types—it’s a powerful tool that, when used to its fullest, can dramatically improve the quality and maintainability of your codebase. This article explores advanced TypeScript patterns that will take your developer experience to the next level.</p>

  <h3>Utility Types Deep Dive</h3>
  <p>TypeScript ships with dozens of utility types that can help you avoid repetition and write DRY, readable types. Some of the most commonly used include:</p>
  <ul>
    <li><code>Partial&lt;T&gt;</code> – Makes all properties in <code>T</code> optional</li>
    <li><code>Required&lt;T&gt;</code> – Makes all properties in <code>T</code> required</li>
    <li><code>Pick&lt;T, K&gt;</code> – Selects a subset of properties from <code>T</code></li>
    <li><code>Omit&lt;T, K&gt;</code> – Removes a subset of properties from <code>T</code></li>
  </ul>
  <p>Combine these with conditional types and mapped types to create extremely flexible interfaces.</p>

  <h3>Generic Constraints and Conditional Types</h3>
  <p>Generics allow you to build components and functions that are type-safe yet reusable. You can add constraints to limit what types are acceptable:</p>
  <pre><code>
  function merge&lt;T extends object, U extends object&gt;(a: T, b: U): T & U {
    return { ...a, ...b };
  }
  </code></pre>

  <p>Conditional types allow branching logic in types themselves:</p>
  <pre><code>
  type IsString&lt;T&gt; = T extends string ? "yes" : "no";
  </code></pre>

  <h3>Type Guards and Assertion Functions</h3>
  <p>Custom type guards enable you to narrow types at runtime:</p>
  <pre><code>
  function isString(value: unknown): value is string {
    return typeof value === "string";
  }
  </code></pre>
  <p>With this, TypeScript can infer types inside conditional blocks, reducing the need for casting or unsafe access.</p>

  <h3>Advanced Inference Techniques</h3>
  <p>Use infer in conditional types to extract types:</p>
  <pre><code>
  type ReturnType&lt;T&gt; = T extends (...args: any) =&gt; infer R ? R : never;
  </code></pre>
  <p>This is especially powerful when building generic libraries or creating type-safe APIs and data structures.</p>

  <p>Mastering these patterns will help you write safer, more predictable, and more expressive code—boosting both team productivity and application reliability.</p>
`
      ,
      excerpt: 'Level up your TypeScript skills with advanced patterns, utility types, and techniques that will make your code more robust and maintainable.',
      date: '2025-01-01',
      readTime: '10 min read',
      category: 'TypeScript',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
      featured: false
    }
  ];

  const [selectedPost, setSelectedPost] = React.useState(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <article className="max-w-4xl mx-auto px-6 py-12">
            {/* Back button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-accent hover:text-accent-hover mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>

            {/* Featured image */}
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedPost.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </div>
                </div>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
                {selectedPost.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {selectedPost.excerpt}
              </p>
            </header>

            {/* Article content */}
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </article>
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-15">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-navy to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              My <span className="text-accent">Blog</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sharing insights on front-end development, performance optimization, and the latest web technologies.
              Stay updated with the ever-evolving world of web development.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </div>
                    {post.featured && (
                      <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-navy mb-3 leading-tight group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>

                      <button className="text-accent hover:text-accent-hover font-medium text-sm transition-colors group-hover:underline">
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default BlogPage;
