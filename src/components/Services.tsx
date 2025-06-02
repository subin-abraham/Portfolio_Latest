
import React from 'react';
import { Code, Smartphone, Zap, Palette, Settings, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Building modern, interactive web applications using React, Vue.js, and vanilla JavaScript with clean, maintainable code.',
      features: ['Single Page Applications', 'Component Libraries', 'State Management', 'API Integration']
    },
    {
      icon: Smartphone,
      title: 'Responsive Web Design',
      description: 'Creating pixel-perfect, mobile-first designs that work seamlessly across all devices and screen sizes.',
      features: ['Mobile-First Approach', 'Cross-Browser Testing', 'Flexible Grid Systems', 'Touch-Friendly Interfaces']
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Optimizing websites for speed and performance with code splitting, lazy loading, and best practices.',
      features: ['Code Splitting', 'Image Optimization', 'Bundle Analysis', 'Core Web Vitals']
    },
    {
      icon: Palette,
      title: 'UI/UX Implementation',
      description: 'Translating design mockups from Figma, Sketch, or Adobe XD into pixel-perfect, accessible web interfaces.',
      features: ['Design System Implementation', 'Accessibility Compliance', 'Animation & Interactions', 'Style Guides']
    },
    {
      icon: Settings,
      title: 'Website Maintenance',
      description: 'Ongoing support and maintenance to keep your website secure, updated, and running smoothly.',
      features: ['Regular Updates', 'Security Monitoring', 'Performance Audits', 'Bug Fixes']
    },
    {
      icon: Globe,
      title: 'JAMstack Development',
      description: 'Modern web development using JavaScript, APIs, and Markup for faster, more secure websites.',
      features: ['Static Site Generation', 'Headless CMS Integration', 'CDN Optimization', 'Serverless Functions']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Services
          </div>
          <h2 className="font-heading text-4xl font-bold text-navy mb-6">
            What I <span className="text-accent">Offer</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive front-end development services to bring your digital vision to life with 
            modern technologies and best practices.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-off-white to-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="font-heading text-xl font-semibold text-navy mb-4 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-accent font-medium hover:text-accent-hover transition-colors duration-300 group-hover:underline"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="mt-20" data-aos="fade-up">
          <h3 className="font-heading text-3xl font-bold text-navy text-center mb-12">
            My Development <span className="text-accent">Process</span>
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'Understanding your requirements, goals, and target audience' },
              { step: '02', title: 'Planning', description: 'Creating wireframes, selecting technologies, and project timeline' },
              { step: '03', title: 'Development', description: 'Writing clean, efficient code with regular progress updates' },
              { step: '04', title: 'Delivery', description: 'Testing, optimization, deployment, and ongoing support' }
            ].map((phase, index) => (
              <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {phase.step}
                </div>
                <h4 className="font-heading text-lg font-semibold text-navy mb-2">{phase.title}</h4>
                <p className="text-gray-600 text-sm">{phase.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 transform translate-x-8 w-full h-0.5 bg-accent/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-navy to-gray-800 rounded-2xl p-12" data-aos="fade-up">
          <h3 className="font-heading text-3xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss your requirements and create something amazing together. 
            I'm here to help bring your digital vision to life.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-accent text-white px-8 py-3 rounded-lg font-heading font-medium hover:bg-accent-hover transition-all duration-300 transform hover:scale-105"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
