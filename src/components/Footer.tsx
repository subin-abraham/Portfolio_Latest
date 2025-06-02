
import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy text-white relative">
      {/* Accent Top Border */}
      <div className="h-1 bg-gradient-to-r from-accent to-accent-hover"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="font-heading font-bold text-2xl mb-4">
              &lt;Subin/&gt;
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Front-End Engineer & Freelance Developer specializing in creating exceptional 
              digital experiences with modern web technologies.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/alexchen"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-accent transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/alexchen"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-accent transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:alex.chen.dev@gmail.com"
                className="bg-white/10 p-3 rounded-full hover:bg-accent transition-all duration-300 hover:scale-110"
                aria-label="Email Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', id: 'about' },
                { label: 'Skills', id: 'skills' },
                { label: 'Portfolio', id: 'portfolio' },
                { label: 'Services', id: 'services' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-300 hover:text-accent transition-colors duration-300 hover:underline"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                'Frontend Development',
                'Responsive Design',
                'Performance Optimization',
                'UI/UX Implementation'
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-accent transition-colors duration-300 hover:underline text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-300">
                © {currentYear} Subin Abraham. All Rights Reserved.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Powered by React, TypeScript & Tailwind CSS. Built for performance and accessibility.
              </p>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                About
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                Portfolio
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                Services
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => scrollToSection('blog')}
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                Blog
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="back-to-top visible"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
