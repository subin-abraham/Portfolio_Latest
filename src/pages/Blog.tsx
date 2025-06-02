
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Building Performant React Applications: Best Practices for 2024',
      content: `
        <p>React applications can become slow and unresponsive if not optimized properly. In this comprehensive guide, we'll explore the latest techniques for building high-performance React applications that provide exceptional user experiences.</p>
        
        <h3>Code Splitting and Lazy Loading</h3>
        <p>One of the most effective ways to improve your React app's performance is through code splitting. By breaking your application into smaller chunks, you can load only the code that's needed for the current page.</p>
        
        <h3>Modern State Management</h3>
        <p>Moving beyond traditional state management solutions, we'll explore modern patterns including React Query, SWR, and the Context API for different use cases.</p>
        
        <h3>Performance Monitoring</h3>
        <p>Learn how to use React DevTools Profiler and other tools to identify performance bottlenecks and measure the impact of your optimizations.</p>
      `,
      excerpt: 'Explore the latest techniques for optimizing React applications, including code splitting, lazy loading, and modern state management patterns.',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'React',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'The Future of CSS: Container Queries and Modern Layout Techniques',
      content: `
        <p>CSS is evolving rapidly, and container queries represent one of the most significant advances in responsive design since media queries. Let's explore how this game-changing feature works.</p>
        
        <h3>Understanding Container Queries</h3>
        <p>Container queries allow elements to respond to the size of their containing element rather than the viewport, enabling truly component-based responsive design.</p>
        
        <h3>CSS Grid and Flexbox Mastery</h3>
        <p>Modern layout techniques have revolutionized how we approach web design. We'll dive deep into advanced Grid and Flexbox patterns.</p>
        
        <h3>CSS Custom Properties in Action</h3>
        <p>Discover how CSS custom properties (variables) can create more maintainable and dynamic stylesheets.</p>
      `,
      excerpt: 'Discover how container queries are revolutionizing responsive design and learn about the latest CSS features that will shape web development.',
      date: '2024-01-08',
      readTime: '6 min read',
      category: 'CSS',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: 'TypeScript Tips: Advanced Patterns for Better Developer Experience',
      content: `
        <p>TypeScript has become essential for modern web development. Let's explore advanced patterns that will make your TypeScript code more robust and maintainable.</p>
        
        <h3>Utility Types Deep Dive</h3>
        <p>TypeScript's built-in utility types like Pick, Omit, and Record can significantly improve your code's type safety and readability.</p>
        
        <h3>Generic Constraints and Conditional Types</h3>
        <p>Master advanced TypeScript features that enable you to write more flexible and reusable code.</p>
        
        <h3>Type Guards and Assertion Functions</h3>
        <p>Learn how to create custom type guards that help TypeScript understand your code's runtime behavior.</p>
      `,
      excerpt: 'Level up your TypeScript skills with advanced patterns, utility types, and techniques that will make your code more robust and maintainable.',
      date: '2024-01-01',
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
