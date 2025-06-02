// pages/PortfolioPage.jsx
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import WarningModal from '@/components/WarningModal';

const PortfolioPage = () => {
  // State to control the warning modal
  const [showWarning, setShowWarning] = useState(false);

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Dashboard',
      description:
        'Modern admin dashboard for an e-commerce platform featuring real-time analytics, inventory widgets, and sales trends charts.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'Task Management App',
      description:
        'Collaborative task management tool with drag-and-drop boards, team chat integration, and project timelines.',
      image:
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      technologies: ['React', 'Redux', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false,
    },
    {
      id: 3,
      title: 'Weather Forecast App',
      description:
        'Interactive weather application offering location-based forecasts, animated maps, and hourly/daily breakdowns.',
      image:
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
      technologies: ['Vue.js', 'REST API', 'SCSS', 'PWA'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false,
    },
    {
      id: 4,
      title: 'Portfolio Website',
      description:
        'Responsive portfolio site showcasing case studies, animated transitions, and a custom blog section.',
      image:
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      technologies: ['Next.js', 'Framer Motion', 'Styled Components'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true,
    },
    {
      id: 5,
      title: 'Food Delivery App',
      description:
        'Mobile-first food delivery interface with interactive menus, cart summaries, and real-time order tracking.',
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      technologies: ['React Native', 'Firebase', 'Redux', 'Google Maps API'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false,
    },
    {
      id: 6,
      title: 'Learning Management System',
      description:
        'Comprehensive LMS platform with course catalogs, student progress dashboards, and interactive quizzes.',
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      technologies: ['React', 'GraphQL', 'Apollo Client', 'Material-UI'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true,
    },
    {
      id: 7,
      title: 'Cryptocurrency Tracker',
      description:
        'Single-page app displaying live crypto prices, market cap trends, and interactive candlestick charts.',
      image:
        'https://images.unsplash.com/photo-1555375771-3e1440a26d13?w=600&h=400&fit=crop',
      technologies: ['Next.js', 'Recharts', 'CoinGecko API', 'Tailwind CSS'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false,
    },
    {
      id: 8,
      title: 'Real-Time Chat Interface',
      description:
        'Sleek chat UI supporting one-to-one and group messaging, with typing indicators and emoji reactions.',
      image:
        'https://images.unsplash.com/photo-1520614073993-3d95d2a2b9dd?w=600&h=400&fit=crop',
      technologies: ['React', 'Socket.io', 'Styled Components', 'Firebase Auth'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false,
    },
    {
      id: 9,
      title: 'Landing Page for SaaS Startup',
      description:
        'Marketing landing page with smooth scroll animations, feature sections, pricing cards, and a newsletter form.',
      image:
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop',
      technologies: ['Gatsby', 'GraphQL', 'CSS Modules', 'Netlify Forms'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true,
    },
    {
      id: 10,
      title: 'Interactive Data Dashboard',
      description:
        'Data visualization dashboard aggregating multiple datasets into dynamic charts, tables, and filters.',
      image:
        'https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=400&fit=crop',
      technologies: ['Angular', 'D3.js', 'RxJS', 'Bootstrap'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false,
    },
  ];

  const featuredProjects = projects.filter((proj) => proj.featured);
  const otherProjects = projects.filter((proj) => !proj.featured);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Warning modal */}
      <WarningModal visible={showWarning} onClose={() => setShowWarning(false)} />

      {/* Hero Section */}
      <section className="pt-20 py-16 bg-gradient-to-br from-navy to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            My <span className="text-accent">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my work—everything from landing pages to interactive web apps
          </p>
        </div>
      </section>

      {/* Portfolio Content */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured Projects */}
          <div className="mb-16">
            <h3 className="font-heading text-2xl font-semibold text-navy mb-8 text-center">
              Featured Projects
            </h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowWarning(true)}
                          className="bg-accent text-white p-3 rounded-full hover:bg-accent-hover transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowWarning(true)}
                          className="bg-white text-navy p-3 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-heading text-xl font-semibold text-navy mb-3 group-hover:text-accent transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowWarning(true)}
                        className="flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors"
                      >
                        View Live <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowWarning(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-navy font-medium transition-colors"
                      >
                        View Code <Github className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Notable Projects */}
          <div>
            <h3 className="font-heading text-2xl font-semibold text-navy mb-8 text-center">
              Other Notable Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-lg shadow-md overflow-hidden card-hover"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowWarning(true)}
                          className="bg-accent text-white p-2 rounded-full hover:bg-accent-hover transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowWarning(true)}
                          className="bg-white text-navy p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="font-heading text-lg font-semibold text-navy mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">
              Interested in seeing more of my work or discussing a project?
            </p>
            <button
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="bg-accent text-white px-8 py-3 rounded-lg font-heading font-medium hover:bg-accent-hover transition-all duration-300 transform hover:scale-105 group"
            >
              Get In Touch
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 inline" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default PortfolioPage;
