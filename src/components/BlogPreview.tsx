import React from 'react';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

const BlogPreview = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Building Performant React Applications: Best Practices for 2024',
      excerpt: 'Explore the latest techniques for optimizing React applications, including code splitting, lazy loading, and modern state management patterns.',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'React',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'The Future of CSS: Container Queries and Modern Layout Techniques',
      excerpt: 'Discover how container queries are revolutionizing responsive design and learn about the latest CSS features that will shape web development.',
      date: '2024-01-08',
      readTime: '6 min read',
      category: 'CSS',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: 'TypeScript Tips: Advanced Patterns for Better Developer Experience',
      excerpt: 'Level up your TypeScript skills with advanced patterns, utility types, and techniques that will make your code more robust and maintainable.',
      date: '2024-01-01',
      readTime: '10 min read',
      category: 'TypeScript',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
      featured: false
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Blog
          </div>
          <h2 className="font-heading text-4xl font-bold text-navy mb-6">
            From the <span className="text-accent">Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sharing insights on front-end development, performance optimization, and the latest web technologies.
            Stay updated with the ever-evolving world of web development.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <div key={post.id} className="mb-16" data-aos="fade-up">
            <div className="bg-gradient-to-r from-navy to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="p-8 lg:p-12 text-white">
                  <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {post.category}
                  </div>
                  <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <button className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-hover transition-all duration-300 inline-flex items-center gap-2 group">
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Other Posts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {blogPosts.filter(post => !post.featured).map((post, index) => (
            <article
              key={post.id}
              className="bg-off-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
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

        {/* Coming Soon Section */}
        <div className="text-center bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-12" data-aos="fade-up">
          <div className="max-w-2xl mx-auto">
            <BookOpen className="w-16 h-16 text-accent mx-auto mb-6" />
            <h3 className="font-heading text-2xl font-bold text-navy mb-4">
              More Articles Coming Soon
            </h3>
            <p className="text-gray-600 mb-8">
              I'm constantly working on new content covering the latest in front-end development, 
              best practices, and emerging technologies. Subscribe to stay updated!
            </p>
            
            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors">
                Subscribe
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              No spam, just quality content about web development.
            </p>
          </div>
        </div>

        {/* View All Posts Button */}
        <div className="text-center mt-12" data-aos="fade-up">
          <button className="bg-transparent border-2 border-accent text-accent px-8 py-3 rounded-lg font-heading font-medium hover:bg-accent hover:text-white transition-all duration-300">
            View All Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
