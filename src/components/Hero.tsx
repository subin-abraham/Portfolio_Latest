import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialCode = `const developer = {
  name: 'Subin Abraham',
  skills: ['React', 'TS'],
  passion: 'Creating UI'
}`;

const Hero = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState(initialCode);
  const codeRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerText = code; // Set initial content once on mount
    }
  }, []);

  const handleCodeInput = () => {
    if (codeRef.current) {
      setCode(codeRef.current.innerText);
    }
  };

  return (
    <section id="home" className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left" data-aos="fade-right">
            <div className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              Available for Freelance Work
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Hi, I'm <span className="text-accent">Subin Abraham</span>
              <br />
              <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-300">
                Front-End Engineer
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Crafting pixel-perfect, responsive user interfaces that deliver exceptional user experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
      onClick={() => navigate("/portfolio")}
      className="btn-primary group flex items-center justify-center"
    >
      View My Work
      <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
    </button>
              
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-transparent border-2 border-accent text-accent px-8 py-3 rounded-lg font-heading font-medium transition-all duration-300 hover:bg-accent hover:text-white hover:transform hover:scale-105"
              >
                Hire Me
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center lg:justify-start gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-accent">2+</div>
                <div className="text-sm text-gray-300">Years Exp</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-accent">15+</div>
                <div className="text-sm text-gray-300">Projects</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-accent">10+</div>
                <div className="text-sm text-gray-300">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Right Column - Editable Code + Static Pills */}
          <div className="relative order-first lg:order-last" data-aos="fade-left" data-aos-delay="200">
            <div className="relative w-full max-w-md mx-auto">
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent/20 rounded-full animate-float"></div>
              <div className="absolute top-1/2 -left-6 w-10 h-10 bg-accent/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-4 right-1/4 w-12 h-12 bg-accent/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
              
              {/* Main Hero Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  {/* Editable Code Editor Mock */}
                  <div
                    ref={codeRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleCodeInput}
                    spellCheck={false}
                    className="bg-navy/80 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap text-white outline-none cursor-text max-h-48 overflow-y-auto"
                    aria-label="Editable code editor"
                  ></div>

                  {/* Tech Stack Pills - keep design and color */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['React', 'TypeScript', 'Tailwind', 'Node.js'].map((tech) => (
                      <div
                        key={tech}
                        className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/20 select-none"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => scrollToSection('experience')}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
