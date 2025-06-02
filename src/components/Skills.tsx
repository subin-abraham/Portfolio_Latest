
import React, { useEffect, useState } from 'react';
import { Code, Palette, Zap, Globe, Database, Settings } from 'lucide-react';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      console.log('Is intersecting:', entry.isIntersecting); // Add this
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.1 }
  );

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  return () => observer.disconnect();
}, []);


  const skills = [
    { name: 'Javascript', percentage: 95, icon: Code, color: '#E34F26' },
    { name: 'TypeScript', percentage: 95, icon: Palette, color: '#1572B6' },
    { name: 'Angular', percentage: 95, icon: Zap, color: '#F7DF1E' },
    { name: 'React', percentage: 90, icon: Globe, color: '#61DAFB' },
    { name: 'Node Js', percentage: 60, icon: Code, color: '#3178C6' },
    { name: 'HTML', percentage: 98, icon: Database, color: '#339933' },
    { name: 'CSS/SASS', percentage: 98, icon: Settings, color: '#F05032' },
    { name: 'Tailwind', percentage: 95, icon: Settings, color: '#8DD6F9' },
  ];

  const tools = [
    'React', 'Angular', 'Next.js', 'Redux', 'Tailwind CSS', 
    'Git', 'Figma', 'Postman', 'Bootstrap', ''
  ];

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Skills & Tools
          </div>
          <h2 className="font-heading text-4xl font-bold text-navy mb-6">
            Technical <span className="text-accent">Expertise</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive set of modern web development skills and tools to bring your ideas to life
          </p>
        </div>

        {/* Skills Progress Bars */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <div 
                key={skill.name} 
                className="bg-gray-50 p-6 rounded-lg"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${skill.color}20` }}
                    >
                      <IconComponent 
                        className="w-5 h-5" 
                        style={{ color: skill.color }}
                      />
                    </div>
                    <span className="font-semibold text-navy">{skill.name}</span>
                  </div>
                  <span className="text-accent font-semibold">{skill.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full rounded-full transition-all duration-1000 ease-out"
    style={{
      width: isVisible ? `${skill.percentage}%` : '0%',
      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`
    }}
  />
</div>

              </div>
            );
          })}
        </div>

        {/* Tools & Technologies */}
        <div className="text-center" data-aos="fade-up">
          <h3 className="font-heading text-2xl font-semibold text-navy mb-8">
            Tools & Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <span
                key={tool}
                className="bg-accent/10 text-accent px-4 py-2 rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300 cursor-default"
                data-aos="zoom-in"
                data-aos-delay={index * 50}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg" data-aos="fade-up">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h4 className="font-heading text-xl font-semibold text-navy mb-2">Fast Performance</h4>
            <p className="text-gray-600">Optimized code that loads in under 3 seconds</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg" data-aos="fade-up" data-aos-delay="100">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h4 className="font-heading text-xl font-semibold text-navy mb-2">Responsive Design</h4>
            <p className="text-gray-600">Pixel-perfect across all devices and screen sizes</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg" data-aos="fade-up" data-aos-delay="200">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-accent" />
            </div>
            <h4 className="font-heading text-xl font-semibold text-navy mb-2">Clean Code</h4>
            <p className="text-gray-600">Maintainable, scalable, and well-documented code</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
