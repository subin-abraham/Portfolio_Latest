
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Home', action: () => handleNavigation('/'), path: '/' },
    { label: 'Experience', action: () => scrollToSection('experience'), path: null },
    { label: 'Skills', action: () => scrollToSection('skills'), path: null },
    { label: 'About', action: () => handleNavigation('/about'), path: '/about' },
    { label: 'Projects', action: () => handleNavigation('/portfolio'), path: '/portfolio' },
    { label: 'Services', action: () => handleNavigation('/services'), path: '/services' },
    { label: 'Blog', action: () => handleNavigation('/blog'), path: '/blog' },
    { label: 'Contact', action: () => scrollToSection('contact'), path: null },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-navy/90 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className={`font-heading font-bold text-xl cursor-pointer ${
                isScrolled ? 'text-navy' : 'text-white'
              }`}
              onClick={() => handleNavigation('/')}
            >
              &lt;Subin/&gt;
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`nav-link transition-colors duration-300 relative ${
                    isScrolled 
                      ? `text-navy hover:text-accent ${isActive(item.path) ? 'text-accent' : ''}` 
                      : `text-white hover:text-accent ${isActive(item.path) ? 'text-accent' : ''}`
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden ${isScrolled ? 'text-navy' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-items">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`block text-white text-xl font-heading hover:text-accent transition-colors duration-300 ${
                isActive(item.path) ? 'text-accent' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
