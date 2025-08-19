import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



const NotFound = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
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


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-sans overflow-hidden relative p-4">
      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Creative 404 display */}
        <div className="relative">
          <div className="text-[180px] md:text-[220px] font-bold text-blue-500/10 tracking-tighter">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Lost in Space</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden w-full max-w-md">
          <div className="p-6 md:p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center bg-gray-800/50 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-4">
                The page <code className="font-mono bg-gray-800/50 px-2 py-1 rounded text-blue-300">{location.pathname}</code> doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home Page
              </a>
              <a
                onClick={() => scrollToSection('contact')}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
            </div>

            <div className="text-gray-400 text-sm">
              <div className="flex flex-wrap justify-center items-center gap-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Web Developer & UI/UX Designer</span>
                </div>
                <span>•</span>
                <span>Portfolio & Business Solutions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full py-4 px-4 text-center text-gray-500 dark:text-gray-400 text-sm mt-auto">
          <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Available for new projects</span>
            </div>
            <div className="hidden sm:block">•</div>
            <span>Let's create something amazing together</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
