import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  Code,
  Users,
  Target,
  Award,
  Calendar,
  MapPin,
  Coffee,
  Heart,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

const AboutPage = () => {
  const highlights = [
    {
      icon: Code,
      title: 'Front-End Focus',
      description:
        'Expertise in building sleek, responsive UIs using JavaScript, TypeScript, Angular, and React.',
    },
    {
      icon: Users,
      title: 'Lifelong Learner',
      description:
        'Continuously exploring new tools—Next.js, Tailwind CSS, Bootstrap—and sharing knowledge.',
    },
    {
      icon: Target,
      title: 'Attention to Detail',
      description:
        'Meticulous about clean, maintainable code and pixel-perfect, accessible designs.',
    },
    {
      icon: Award,
      title: 'Forward Thinking',
      description:
        'Always experimenting with modern front-end patterns to stay ahead of trends.',
    },
  ];

  const timeline = [
    {
      year: '2021',
      title: 'B.Tech Graduation',
      description:
        'Completed Electronics & Communication Engineering and discovered a passion for software development.',
    },
    {
      year: '2022',
      title: 'First Internship in Software',
      description:
        'Stepped into the front-end world—dived into JavaScript, TypeScript, Angular, React, Bootstrap, and Tailwind CSS.',
    },
    {
      year: '2023',
      title: 'Portfolio & Experimentation',
      description:
        'Built this portfolio to experiment with Next.js, Tailwind CSS, and refine front-end workflows.',
    },
    {
      year: '2024',
      title: 'Professional Growth',
      description:
        'Focused on mastering modern front-end technologies and delivering responsive web apps.',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion-Driven Development',
      description:
        'I transitioned from electronics to software because I genuinely love crafting digital experiences.',
    },
    {
      icon: BookOpen,
      title: 'Continuous Improvement',
      description:
        'The web evolves rapidly—so do I—by learning new frameworks, patterns, and best practices every day.',
    },
    {
      icon: Lightbulb,
      title: 'Creative Problem Solving',
      description:
        'I approach challenges analytically and creatively to build solutions that users and stakeholders love.',
    },
    {
      icon: Coffee,
      title: 'Balanced Mindset',
      description:
        'I value sustainable development practices and maintain a healthy work–life balance to stay sharp.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 py-16 bg-gradient-to-br from-navy to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-accent">Me</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Electronics Engineer turned Front-End Developer, passionate about crafting modern web
            experiences
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column – Content */}
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                My Story
              </div>

              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-6">
                From Electronics to <span className="text-accent">Front-End</span>
              </h2>

              <div className="space-y-4 text-gray-700 text-base leading-relaxed mb-8">
                <p>
                  I began my journey with a <strong>B.Tech in Electronics & Communication</strong>,
                  driven by a curiosity for hardware. Along the way, I discovered that my true
                  passion lay in software—especially creating intuitive web interfaces that users
                  love.
                </p>

                <p>
                  During my internship in 2022, I seized the chance to switch paths into the world of
                  front-end development. That pivotal experience introduced me to{' '}
                  <strong>JavaScript, TypeScript, Angular, React, Bootstrap,</strong> and{' '}
                  <strong>Tailwind CSS</strong>, setting the foundation for my career.
                </p>

                <p>
                  Beyond coding, I view every project as an opportunity to learn and grow. This
                  portfolio is my sandbox for experimenting with <strong>Next.js</strong> and{' '}
                  <strong>Tailwind CSS</strong>, keeping my skills sharp and my creativity flowing.
                </p>

                <p>
                  Currently, I focus on mastering modern front-end technologies and delivering
                  responsive, high-performance web applications. I stay updated with industry trends
                  to ensure my work is both innovative and efficient.
                </p>

                <p>
                  Looking ahead, I’m actively enhancing my backend skills—<strong>Node.js, MongoDB,
                  SQL</strong>—to evolve into a full-stack engineer who builds end-to-end solutions
                  that drive real impact.
                </p>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 text-accent mr-2" />
                  <span>Bangalore, India</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 text-accent mr-2" />
                  <span>3+ Years in Front-End</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="bg-accent text-white px-8 py-3 rounded-lg font-heading font-medium hover:bg-accent-hover transition-all duration-300 transform hover:scale-105"
              >
                Let's Work Together
              </button>
            </div>

            {/* Right Column – Highlights Grid */}
            <div>
              <div className="grid sm:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => {
                  const IconComponent = highlight.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-lg text-center hover:bg-accent/5 transition-colors duration-300"
                    >
                      <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-navy mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-sm text-gray-600">{highlight.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
<section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-navy mb-4">
              My <span className="text-accent">Journey</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From an electronics enthusiast to a front-end engineer—here’s how I got here
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-accent/20"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div key={index} className="relative flex items-center">
                    {isLeft ? (
                      <>
                        {/* Left-side card */}
                        <div className="w-1/2 pr-8 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                            <div className="text-accent font-bold text-lg mb-2">{item.year}</div>
                            <h3 className="font-heading text-xl font-semibold text-navy mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>

                        {/* Center dot */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-md"></div>

                        {/* Empty right half */}
                        <div className="w-1/2"></div>
                      </>
                    ) : (
                      <>
                        {/* Empty left half */}
                        <div className="w-1/2"></div>

                        {/* Center dot */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-md"></div>

                        {/* Right-side card */}
                        <div className="w-1/2 pl-8">
                          <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                            <div className="text-accent font-bold text-lg mb-2">{item.year}</div>
                            <h3 className="font-heading text-xl font-semibold text-navy mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-navy mb-4">
              What Drives <span className="text-accent">Me</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles and values that guide my approach to development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-navy mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Summary */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold mb-8">
            Technical <span className="text-accent">Expertise</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-heading text-xl font-semibold mb-4">Front-End</h3>
              <div className="space-y-2 text-gray-300">
                <p>JavaScript & TypeScript</p>
                <p>Angular & React</p>
                <p>Next.js & React.js</p>
                <p>Bootstrap & Tailwind CSS</p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold mb-4">Back-End (Intermediate)</h3>
              <div className="space-y-2 text-gray-300">
                <p>Node.js & Express</p>
                <p>MongoDB & Mongoose</p>
                <p>SQL (MySQL, PostgreSQL)</p>
                <p>RESTful API Design</p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold mb-4">Tools & Workflow</h3>
              <div className="space-y-2 text-gray-300">
                <p>Git & GitHub</p>
                <p>Vite & Webpack</p>
                <p>Figma & Adobe XD</p>
                <p>Jest & Testing Library</p>
                <p>Performance Optimization & Accessibility (WCAG)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutPage;
