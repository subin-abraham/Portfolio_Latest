
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Portfolio Website',
      position: 'Client: Anna Williams',
      company: '',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
      text: 'Built a sleek, responsive portfolio website showcasing Anna’s photography with a dynamic gallery and contact form.'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      position: 'Client: Green Leaf Organics',
      company: '',
      image: 'https://randomuser.me/api/portraits/men/41.jpg',
      rating: 5,
      text: 'Developed a custom online store with product filtering, secure checkout, and mobile optimization.'
    },
    {
      id: 3,
      name: 'Blog Platform',
      position: 'Client: TechTalk Blog',
      company: '',
      image: 'https://randomuser.me/api/portraits/women/52.jpg',
      rating: 5,
      text: 'Created a content management system with markdown support, SEO optimization, and fast page loads.'
    },
    {
      id: 4,
      name: 'Landing Page',
      position: 'Client: FinTech Innovators',
      company: '',
      image: 'https://randomuser.me/api/portraits/men/48.jpg',
      rating: 5,
      text: 'Designed and coded a high-conversion landing page with animations and clear CTAs to attract investors.'
    },
    {
      id: 5,
      name: 'CRM Dashboard',
      position: 'Client: SalesPro Ltd.',
      company: '',
      image: 'https://randomuser.me/api/portraits/men/59.jpg',
      rating: 5,
      text: 'Built a dashboard with real-time data visualization and user-friendly interface to manage sales pipelines.'
    }
  ];


  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <section id="testimonials" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Testimonials
          </div>
          <h2 className="font-heading text-4xl font-bold text-navy mb-6">
            What Clients <span className="text-accent">Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what some of my clients have to say about working with me.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="testimonial-carousel relative overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-slide p-12 text-center">
                  <div className="relative">
                    <Quote className="w-16 h-16 text-accent/20 mx-auto mb-6" />

                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
                      "{testimonial.text}"
                    </blockquote>

                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-navy text-lg">{testimonial.name}</div>
                        <div className="text-gray-600">{testimonial.position}</div>
                        <div className="text-accent font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-navy p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-navy p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>


          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-accent scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          {[
            { number: '15+', label: 'Projects Completed' },
            { number: '95%', label: 'Client Satisfaction' },
            { number: '2+', label: 'Years Experience' },
            { number: '24h', label: 'Average Response Time' }
          ].map((stat, index) => (
            <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16" data-aos="fade-up">
          <p className="text-gray-600 mb-6 text-lg">
            Ready to join these satisfied clients?
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
