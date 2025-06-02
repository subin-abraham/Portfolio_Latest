import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Dashboard',
      description: 'Modern admin dashboard for e-commerce platform with real-time analytics, inventory management, and sales tracking.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management application with drag-and-drop functionality, team collaboration, and project tracking.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      technologies: ['React', 'Redux', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false
    },
    {
      id: 3,
      title: 'Weather Forecast App',
      description: 'Beautiful weather application with location-based forecasts, interactive maps, and detailed weather analytics.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
      technologies: ['Vue.js', 'API Integration', 'SCSS', 'PWA'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false
    },
    {
      id: 4,
      title: 'Portfolio Website',
      description: 'Responsive portfolio website for a creative agency with stunning animations, case studies, and contact forms.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      technologies: ['Next.js', 'Framer Motion', 'Styled Components'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true
    },
    {
      id: 5,
      title: 'Food Delivery App',
      description: 'Mobile-first food delivery application with restaurant listings, cart management, and order tracking.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      technologies: ['React Native', 'Firebase', 'Redux', 'Maps API'],
      liveUrl: '#',
      codeUrl: '#',
      featured: false
    },
    {
      id: 6,
      title: 'Learning Management System',
      description: 'Comprehensive LMS platform with course creation, student progress tracking, and interactive learning modules.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      technologies: ['React', 'GraphQL', 'Apollo', 'Material-UI'],
      liveUrl: '#',
      codeUrl: '#',
      featured: true
    }
  ];

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <section id="portfolio" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Portfolio
          </div>
          <h2 className="font-heading text-4xl font-bold text-navy mb-6">
            Selected <span className="text-accent">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Below are a few front-end projects I've built—tools, landing pages, dashboards, and web applications 
            that demonstrate my ability to write clean, optimized code and create engaging user experiences.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <h3 className="font-heading text-2xl font-semibold text-navy mb-8 text-center">Featured Projects</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4">
                      <a
                        href={project.liveUrl}
                        className="bg-accent text-white p-3 rounded-full hover:bg-accent-hover transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <a
                        href={project.codeUrl}
                        className="bg-white text-navy p-3 rounded-full hover:bg-gray-100 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-5 h-5" />
                      </a>
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
                    <a
                      href={project.liveUrl}
                      className="flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Live <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={project.codeUrl}
                      className="flex items-center gap-2 text-gray-600 hover:text-navy font-medium transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Code <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <h3 className="font-heading text-2xl font-semibold text-navy mb-8 text-center">Other Notable Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-white rounded-lg shadow-md overflow-hidden card-hover"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <a
                        href={project.liveUrl}
                        className="bg-accent text-white p-2 rounded-full hover:bg-accent-hover transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={project.codeUrl}
                        className="bg-white text-navy p-2 rounded-full hover:bg-gray-100 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                      </a>
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
        <div className="text-center mt-16" data-aos="fade-up">
          <p className="text-gray-600 mb-6">
            Interested in seeing more of my work or discussing a project?
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary group"
          >
            Get In Touch
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
